#!/usr/bin/env node
'use strict';

/**
 * Gate 4 Precheck
 *
 * Read-only. Makes no changes to the Production Master, Supabase, or any
 * file. Reports every known Gate-4 blocker class for one stone in a single
 * pass, so blockers surface together instead of one failed pipeline run at
 * a time (see the Moss Agate Pre-Test-2 debrief).
 *
 * Usage:
 *   node pipeline/gate4-precheck.js --md <path>
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

const fs = require('fs');
const path = require('path');
const { parseMD } = require('./lib/parse-md');
const iconMap = require('./lib/icon-map.json');
const {
  buildColumnIndex, normalize, resolveCollectionLabel, loadWorkbook,
  DEFAULT_SOURCE, SHEET_NAME, PRODUCTION_DATA_VERSION,
} = require('./export-structured-values');
const {
  validateIconSlug, loadCssIconClasses, loadStorageIconFiles,
  THEME_FORBIDDEN_ICONS, COLLECTOR_NOTE_FORBIDDEN_ICONS,
} = require('./validate-packet');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { source: DEFAULT_SOURCE };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--md') opts.md = args[++i];
    if (args[i] === '--source') opts.source = args[++i];
  }
  if (!opts.md) {
    console.error('Usage: node pipeline/gate4-precheck.js --md <path>');
    process.exit(1);
  }
  return opts;
}

const REQUIRED_STRUCTURED = ['Primary Chakra', 'Element', 'Zodiac', 'Material Type'];
const REQUIRED_NAV = ['Previous Stone', 'Previous Slug', 'Next Stone', 'Next Slug'];

function findProductionMasterRow(source, stoneId) {
  const workbook = loadWorkbook(source);
  const sheet = workbook.Sheets[SHEET_NAME];
  const XLSX = require('xlsx');
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const col = buildColumnIndex(rows[0]);
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (normalize(row[col['Stone ID']]) === stoneId) {
      return { row, col, rowNumber: r + 1 };
    }
  }
  return null;
}

async function main() {
  const opts = parseArgs();
  const result = { pass: [], warn: [], blocker: [] };

  // --- MD existence + parse ---
  if (!fs.existsSync(opts.md)) {
    result.blocker.push(`Canonical MD not found at exact path: ${opts.md}`);
    return report(result);
  }
  result.pass.push(`Canonical MD found at ${opts.md}`);

  const mdText = fs.readFileSync(opts.md, 'utf8');
  let parsed;
  try {
    parsed = parseMD(mdText);
  } catch (err) {
    result.blocker.push(`MD schema/parse error: ${err.message}`);
    return report(result);
  }
  result.pass.push('MD parses and matches current schema');

  const { frontMatter, themes, collectorNotes, relatedStones } = parsed;
  const stoneId = frontMatter.stone_id;
  const stoneName = frontMatter.stone_name;
  const stoneSlug = frontMatter.stone_slug;

  if (frontMatter.production_data_version !== PRODUCTION_DATA_VERSION) {
    result.blocker.push(`MD production_data_version "${frontMatter.production_data_version}" does not match expected pipeline sentinel "${PRODUCTION_DATA_VERSION}"`);
  } else {
    result.pass.push(`production_data_version matches expected sentinel "${PRODUCTION_DATA_VERSION}"`);
  }

  // --- Production Master row ---
  let pm;
  try {
    pm = findProductionMasterRow(opts.source, stoneId);
  } catch (err) {
    result.blocker.push(`Could not read Production Master: ${err.message}`);
    return report(result);
  }
  if (!pm) {
    result.blocker.push(`No Production Master row found for stone_id "${stoneId}"`);
    return report(result);
  }
  result.pass.push(`Production Master row found (row ${pm.rowNumber})`);

  const { row, col } = pm;
  const pmName = normalize(row[col['Canonical Name']]);
  const pmSlug = normalize(row[col['Slug']]);
  if (pmName !== stoneName) result.blocker.push(`Production Master Canonical Name "${pmName}" does not match MD stone_name "${stoneName}"`);
  if (pmSlug !== stoneSlug) result.blocker.push(`Production Master Slug "${pmSlug}" does not match MD stone_slug "${stoneSlug}"`);
  if (pmName === stoneName && pmSlug === stoneSlug) result.pass.push('Production Master identity (name/slug) matches MD front matter');

  // --- Blocker / Notes ---
  const blockerText = normalize(row[col['Blocker']]);
  const notesText = normalize(row[col['Notes']]);
  if (blockerText) {
    result.blocker.push(`Production Master Blocker is not empty: "${blockerText}"`);
  } else {
    result.pass.push('Production Master Blocker is empty');
  }
  if (notesText) {
    result.warn.push(`Production Master Notes is non-empty — review for currency before proceeding (not auto-resolved): "${notesText}"`);
  }

  // --- Required structured fields (Production Master) ---
  for (const field of REQUIRED_STRUCTURED) {
    const val = normalize(row[col[field]]);
    if (!val) result.blocker.push(`Production Master "${field}" is blank for this stone`);
  }
  const tierRaw = normalize(row[col['Collection Tier']]);
  if (!tierRaw) {
    result.blocker.push('Production Master "Collection Tier" is blank for this stone');
  } else {
    try {
      resolveCollectionLabel(tierRaw, stoneId);
      result.pass.push(`Collection Tier "${tierRaw}" resolves to a documented label`);
    } catch (_) {
      result.blocker.push(`Production Master "Collection Tier" value "${tierRaw}" has no documented label mapping`);
    }
  }
  for (const field of REQUIRED_NAV) {
    const val = normalize(row[col[field]]);
    if (!val) result.blocker.push(`Production Master "${field}" is blank for this stone`);
  }
  if (REQUIRED_STRUCTURED.concat(REQUIRED_NAV).every(f => normalize(row[col[f]]))) {
    result.pass.push('All required Production Master structured/navigation fields are non-blank');
  }

  // --- Supabase: roster + current-pipeline dependency fields + related-stone resolution ---
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    result.warn.push('SUPABASE_URL/SUPABASE_SERVICE_KEY not set — Supabase-dependent checks skipped (roster fields, related-stone resolution, icon Storage existence)');
    return report(result);
  }
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data: stoneRow, error: stoneErr } = await supabase
    .from('stones')
    .select('id, name, slug, enc_energetic_role, color_energy')
    .eq('id', stoneId)
    .single();
  if (stoneErr || !stoneRow) {
    result.blocker.push(`No Supabase stones row found for stone_id "${stoneId}"`);
  } else {
    if (stoneRow.name !== stoneName) result.blocker.push(`Supabase stones.name "${stoneRow.name}" does not match MD stone_name "${stoneName}"`);
    if (stoneRow.slug !== stoneSlug) result.blocker.push(`Supabase stones.slug "${stoneRow.slug}" does not match MD stone_slug "${stoneSlug}"`);
    if (!stoneRow.enc_energetic_role) {
      result.blocker.push('Supabase stones.enc_energetic_role is null (current pipeline reads this at Gate 4 — pending source-authority redesign)');
    } else {
      result.pass.push(`Supabase stones.enc_energetic_role = "${stoneRow.enc_energetic_role}"`);
    }
    if (!stoneRow.color_energy) {
      result.warn.push('Supabase stones.color_energy is null (read by current pipeline at Gate 4; not in HARD_REQUIRED list but will render blank on the live page)');
    } else {
      result.pass.push(`Supabase stones.color_energy = "${stoneRow.color_energy}"`);
    }
  }

  const { data: rosterRows } = await supabase.from('stones').select('slug, name');
  const rosterBySlug = new Map((rosterRows || []).map(s => [s.slug, s.name]));
  for (const rs of relatedStones) {
    const match = rosterBySlug.get(rs.related_slug);
    if (!match) {
      result.blocker.push(`Related stone slug "${rs.related_slug}" (${rs.related_name}) not found in stones roster`);
    } else if (match !== rs.related_name) {
      result.blocker.push(`Related stone slug "${rs.related_slug}" resolves to "${match}" in roster, but MD names it "${rs.related_name}"`);
    }
  }
  if (relatedStones.length > 0 && result.blocker.every(b => !b.startsWith('Related stone slug'))) {
    result.pass.push(`All ${relatedStones.length} related-stone slugs resolve against the live roster`);
  }

  // --- Icon classes ---
  const cssClasses = loadCssIconClasses();
  const storageFiles = await loadStorageIconFiles(supabase);
  const iconErrors = [];

  const energeticRole = stoneRow?.enc_energetic_role;
  if (energeticRole) {
    const expectedIcon = iconMap.energeticRoles[energeticRole];
    if (!expectedIcon) {
      result.blocker.push(`Energetic Role "${energeticRole}" has no entry in icon-map.json energeticRoles`);
    } else {
      validateIconSlug(expectedIcon, `Energetic Role (${energeticRole})`, iconErrors, cssClasses, storageFiles);
    }
  }
  for (const t of themes) {
    if ((t.tier === 'primary' || t.tier === 'secondary') && t.icon_slug) {
      validateIconSlug(t.icon_slug, `Energetic Themes > ${t.title}`, iconErrors, cssClasses, storageFiles);
      if (THEME_FORBIDDEN_ICONS.has(t.icon_slug)) {
        iconErrors.push(`Energetic Themes > ${t.title}: "${t.icon_slug}" is reserved for a different section (ENCYCLOPEDIA-ICON-REGISTRY.md §8.3.2/§8.4/§11)`);
      }
    }
  }
  for (const n of collectorNotes) {
    validateIconSlug(n.icon_slug, `Collector Notes > ${n.title}`, iconErrors, cssClasses, storageFiles);
    if (COLLECTOR_NOTE_FORBIDDEN_ICONS.has(n.icon_slug)) {
      iconErrors.push(`Collector Notes > ${n.title}: "${n.icon_slug}" is reserved for the fixed Care & Cleaning row (ENCYCLOPEDIA-ICON-REGISTRY.md §8.4)`);
    }
  }
  if (iconErrors.length > 0) {
    for (const e of iconErrors) result.blocker.push(e);
  } else {
    result.pass.push('All MD-authored icon classes resolve to icon-map.json, enc-icons.css, and Supabase Storage');
  }

  return report(result);
}

function report(result) {
  console.log('\n=== Gate 4 Precheck ===\n');
  console.log(`PASS (${result.pass.length})`);
  for (const p of result.pass) console.log(`  - ${p}`);
  console.log(`\nWARN (${result.warn.length})`);
  for (const w of result.warn) console.log(`  - ${w}`);
  console.log(`\nBLOCKER (${result.blocker.length})`);
  for (const b of result.blocker) console.log(`  - ${b}`);
  console.log('');
  if (result.blocker.length === 0) {
    console.log('No avoidable blockers found. Packet generation is expected to proceed.');
    process.exitCode = 0;
  } else {
    console.log(`${result.blocker.length} blocker(s) would stop Gate 4. Resolve before running generate-packet.js.`);
    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exitCode = 1;
});

module.exports = { findProductionMasterRow };
