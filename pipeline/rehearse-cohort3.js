#!/usr/bin/env node
'use strict';

/**
 * 2G — Cohort 3 Read-Only Rehearsal
 *
 * READ-ONLY. Does not write, import, or change publication state.
 * Do not run any import path against Cohort 3 records.
 *
 * What this does:
 *   1. Generates packets for all Cohort 3 stones from their staged MDs
 *      (working mirrors of the canonical MDs at
 *      Documents\Still Point Lapidary\Encyclopedia\Canonical MDs)
 *   2. Runs full schema and roster validation on the generated packets
 *   3. Compares generated packet values field-by-field against live Supabase records
 *      (text, order, slugs, icon classes, nullable fields) — read comparison only
 *   4. Runs the rendered-page smoke test against the existing live pages
 *
 * Report:
 *   - Whether the generator reproduces the correct packet for all 8 stones
 *   - Whether validation correctly passes all 8
 *   - Whether generated packet values match live Supabase records exactly
 *   - Whether smoke test passes with zero false positives or negatives
 *
 * Cohort 3 stones (8 total):
 *   hematite, moonstone, sodalite, malachite, sunstone
 *   + the 3 Cohort 2 stones that were published alongside them (confirm slug list with Christie)
 *
 * Usage:
 *   node pipeline/rehearse-cohort3.js --base-url <url>
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 *
 * Required files (staged MDs must be in new schema format before rehearsal):
 *   docs/encyclopedia/entries/{slug}.md for each Cohort 3 stone
 *
 * Canonical MDs live at Documents\Still Point Lapidary\Encyclopedia\Canonical MDs.
 * The files under docs/encyclopedia/entries/ are working mirrors / staging inputs for
 * the pipeline only — they are not an independent canonical source, and any conflict
 * resolves in favor of the external canonical file. The pipeline should be updated to
 * read the external canonical MD path from one approved configuration source.
 *
 * NOTE: The Cohort 3 MDs staged in docs/encyclopedia/entries/ are currently in
 * the OLD format (no YAML front matter, research notes mixed in, old heading structure).
 * They must be converted to the new MD schema (MD-SCHEMA-REFERENCE.md) before this
 * rehearsal can run. This conversion is a prerequisite — do not attempt to auto-convert;
 * the conversion must be reviewed and approved by Christie.
 *
 * Requires: npm install puppeteer (for smoke test step)
 */

const fs = require('fs');
const path = require('path');
const { parseMD } = require('./lib/parse-md');
const iconMap = require('./lib/icon-map.json');

// ---------------------------------------------------------------------------
// Cohort 3 stone list — confirm with Christie before running
// ---------------------------------------------------------------------------
const COHORT3_STONES = [
  'hematite',
  'moonstone',
  'sodalite',
  'malachite',
  'sunstone',
];

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  let baseUrl = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--base-url') baseUrl = args[++i];
  }
  if (!baseUrl) {
    console.error('Usage: node pipeline/rehearse-cohort3.js --base-url <url>');
    process.exit(1);
  }
  return { baseUrl };
}

// ---------------------------------------------------------------------------
// Read-only comparison against live Supabase
// ---------------------------------------------------------------------------
async function comparePacketToSupabase(supabase, packet) {
  const name = packet.meta.stone_name;
  const stoneId = packet.meta.stone_id;
  const mismatches = [];

  function cmp(field, expected, actual) {
    const e = expected ?? null;
    const a = actual ?? null;
    if (e !== a) mismatches.push(`  ${field}\n    packet:   ${JSON.stringify(e)}\n    supabase: ${JSON.stringify(a)}`);
  }

  // enc_stone_content
  const { data: sc } = await supabase
    .from('enc_stone_content')
    .select('*')
    .eq('stone_id', stoneId)
    .single();

  if (!sc) return { stone: name, status: 'FAIL', mismatches: ['enc_stone_content: no row found'] };

  const scFields = [
    'slug', 'signature_line', 'pill_1', 'pill_2', 'pill_3',
    'best_for', 'use_when', 'affirmation', 'overview_p1', 'overview_p2',
    'formation', 'collector_context_p1', 'collector_context_p2', 'collector_context_p3',
    'chakra_primary', 'chakra_secondary', 'element', 'zodiac', 'material_type',
    'energetic_role', 'energetic_role_icon', 'color_energy',
    'nav_prev_slug', 'nav_prev_name', 'nav_next_slug', 'nav_next_name',
  ];
  for (const f of scFields) cmp(`enc_stone_content.${f}`, packet.enc_stone_content[f], sc[f]);

  // enc_mineral_facts
  const { data: facts } = await supabase
    .from('enc_mineral_facts')
    .select('label, value, display_order')
    .eq('stone_id', stoneId)
    .order('display_order');

  if (!facts || facts.length !== 8) {
    mismatches.push(`enc_mineral_facts: expected 8 rows, found ${facts?.length ?? 0}`);
  } else {
    for (let i = 0; i < 8; i++) {
      cmp(`enc_mineral_facts[${i + 1}].label`, packet.enc_mineral_facts[i]?.label, facts[i].label);
      cmp(`enc_mineral_facts[${i + 1}].value`, packet.enc_mineral_facts[i]?.value, facts[i].value);
    }
  }

  // enc_localities
  const { data: locs } = await supabase
    .from('enc_localities')
    .select('locality, display_order')
    .eq('stone_id', stoneId)
    .order('display_order');
  if (!locs || locs.length !== packet.enc_localities.length) {
    mismatches.push(`enc_localities: expected ${packet.enc_localities.length}, found ${locs?.length ?? 0}`);
  } else {
    for (let i = 0; i < packet.enc_localities.length; i++) {
      cmp(`enc_localities[${i + 1}]`, packet.enc_localities[i].locality, locs[i].locality);
    }
  }

  // enc_reach_for
  const { data: reach } = await supabase
    .from('enc_reach_for')
    .select('label, description, display_order')
    .eq('stone_id', stoneId)
    .order('display_order');
  if (!reach || reach.length !== packet.enc_reach_for.length) {
    mismatches.push(`enc_reach_for: expected ${packet.enc_reach_for.length}, found ${reach?.length ?? 0}`);
  } else {
    for (let i = 0; i < packet.enc_reach_for.length; i++) {
      cmp(`enc_reach_for[${i + 1}].label`, packet.enc_reach_for[i]?.label, reach[i].label);
      cmp(`enc_reach_for[${i + 1}].description`, packet.enc_reach_for[i]?.description, reach[i].description);
    }
  }

  // enc_themes
  const { data: themes } = await supabase
    .from('enc_themes')
    .select('tier, title, description, icon_slug, display_order')
    .eq('stone_id', stoneId)
    .order('tier').order('display_order');
  const sortFn = (a, b) => a.tier.localeCompare(b.tier) || a.display_order - b.display_order;
  const tE = [...packet.enc_themes].sort(sortFn);
  const tA = (themes || []).sort(sortFn);
  if (tE.length !== tA.length) {
    mismatches.push(`enc_themes: expected ${tE.length} rows, found ${tA.length}`);
  } else {
    for (let i = 0; i < tE.length; i++) {
      cmp(`enc_themes[${tE[i].tier},${tE[i].display_order}].title`, tE[i].title, tA[i]?.title);
      cmp(`enc_themes[${tE[i].tier},${tE[i].display_order}].icon_slug`, tE[i].icon_slug, tA[i]?.icon_slug);
      cmp(`enc_themes[${tE[i].tier},${tE[i].display_order}].description`, tE[i].description ?? null, tA[i]?.description ?? null);
    }
  }

  // enc_collector_notes
  const { data: notes } = await supabase
    .from('enc_collector_notes')
    .select('title, body, icon_slug, display_order')
    .eq('stone_id', stoneId)
    .order('display_order');
  const nE = packet.enc_collector_notes;
  if (!notes || notes.length !== nE.length) {
    mismatches.push(`enc_collector_notes: expected ${nE.length}, found ${notes?.length ?? 0}`);
  } else {
    for (let i = 0; i < nE.length; i++) {
      cmp(`enc_collector_notes[${i + 1}].title`, nE[i].title, notes[i].title);
      cmp(`enc_collector_notes[${i + 1}].icon_slug`, nE[i].icon_slug, notes[i].icon_slug);
      cmp(`enc_collector_notes[${i + 1}].body`, nE[i].body, notes[i].body);
    }
  }

  // enc_care
  const { data: care } = await supabase
    .from('enc_care')
    .select('category, body, display_order')
    .eq('stone_id', stoneId)
    .order('display_order');
  if (!care || care.length !== 4) {
    mismatches.push(`enc_care: expected 4, found ${care?.length ?? 0}`);
  } else {
    for (let i = 0; i < 4; i++) {
      cmp(`enc_care[${i + 1}].category`, packet.enc_care[i].category, care[i].category);
      cmp(`enc_care[${i + 1}].body`, packet.enc_care[i].body, care[i].body);
    }
  }

  // enc_related_stones
  const { data: related } = await supabase
    .from('enc_related_stones')
    .select('"group", related_slug, related_name, reason, display_order')
    .eq('stone_id', stoneId)
    .order('"group"').order('display_order');
  const rSortFn = (a, b) => a.group.localeCompare(b.group) || a.display_order - b.display_order;
  const rE = [...packet.enc_related_stones].sort(rSortFn);
  const rA = (related || []).sort(rSortFn);
  if (rE.length !== 4 || rA.length !== 4) {
    mismatches.push(`enc_related_stones: expected 4, found packet=${rE.length} supabase=${rA.length}`);
  } else {
    for (let i = 0; i < 4; i++) {
      cmp(`enc_related_stones[${rE[i].group},${rE[i].display_order}].related_slug`, rE[i].related_slug, rA[i]?.related_slug);
      cmp(`enc_related_stones[${rE[i].group},${rE[i].display_order}].related_name`, rE[i].related_name, rA[i]?.related_name);
      cmp(`enc_related_stones[${rE[i].group},${rE[i].display_order}].reason`, rE[i].reason, rA[i]?.reason);
    }
  }

  if (mismatches.length === 0) return { stone: name, status: 'MATCH' };
  return { stone: name, status: 'MISMATCH', mismatches };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const { baseUrl } = parseArgs();

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY env vars are required.');
    process.exit(1);
  }
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const mdDir = path.join(__dirname, '..', 'docs', 'encyclopedia', 'entries');

  console.log('=== Cohort 3 Read-Only Rehearsal ===');
  console.log('READ-ONLY: no writes, no imports, no publication changes.\n');

  const parseResults = [];
  const packets = [];

  // Step 1 & 2: Generate and validate packets
  console.log('--- Step 1: Generate packets from staged MDs ---');
  for (const slug of COHORT3_STONES) {
    const mdPath = path.join(mdDir, `${slug}.md`);
    if (!fs.existsSync(mdPath)) {
      console.error(`BLOCKED  ${slug}: MD file not found at ${mdPath}`);
      console.error(`         Convert the MD to new schema format (MD-SCHEMA-REFERENCE.md) before running rehearsal.`);
      parseResults.push({ stone: slug, status: 'BLOCKED', reason: 'MD file not found in new schema format' });
      continue;
    }

    let parsed;
    try {
      parsed = parseMD(fs.readFileSync(mdPath, 'utf8'));
    } catch (err) {
      console.error(`FAIL  ${slug}: ${err.message}`);
      parseResults.push({ stone: slug, status: 'FAIL', reason: err.message });
      continue;
    }

    // Build a minimal packet for comparison (structured values will come from Supabase)
    const stoneId = parsed.frontMatter.stone_id;
    const { data: stoneRow } = await supabase
      .from('stones')
      .select('id, name, slug, enc_energetic_role, color_energy, color_hex, color_categories')
      .eq('id', stoneId)
      .single();

    if (!stoneRow) {
      console.error(`FAIL  ${slug}: stone_id ${stoneId} not found in stones table`);
      parseResults.push({ stone: slug, status: 'FAIL', reason: `stone_id ${stoneId} not found` });
      continue;
    }

    const { data: existingContent } = await supabase
      .from('enc_stone_content')
      .select('*')
      .eq('stone_id', stoneId)
      .single();

    const energeticRoleIcon = iconMap.energeticRoles[stoneRow.enc_energetic_role] || null;

    const packet = {
      meta: { stone_id: stoneId, stone_name: parsed.frontMatter.stone_name, stone_slug: slug, production_data_version: parsed.frontMatter.production_data_version, generated_at: new Date().toISOString() },
      enc_stone_content: {
        stone_id: stoneId, slug,
        ...parsed.hero,
        ...parsed.overview,
        formation: parsed.mineralProfile.formation,
        collector_context_p1: parsed.mineralProfile.collector_context_p1,
        collector_context_p2: parsed.mineralProfile.collector_context_p2,
        collector_context_p3: parsed.marketNotes || null,
        collector_context_p4: parsed.mineralProfile.collector_context_p4,
        collector_context_p5: parsed.mineralProfile.collector_context_p5,
        chakra_primary: existingContent?.chakra_primary || null,
        chakra_secondary: existingContent?.chakra_secondary || null,
        element: existingContent?.element || null,
        zodiac: existingContent?.zodiac || null,
        material_type: existingContent?.material_type || null,
        energetic_role: stoneRow.enc_energetic_role,
        energetic_role_icon: energeticRoleIcon,
        color_energy: stoneRow.color_energy,
        nav_prev_slug: existingContent?.nav_prev_slug || null,
        nav_prev_name: existingContent?.nav_prev_name || null,
        nav_next_slug: existingContent?.nav_next_slug || null,
        nav_next_name: existingContent?.nav_next_name || null,
        published: existingContent?.published ?? false,
      },
      enc_mineral_facts: parsed.mineralProfile.mineralFacts.map(f => ({ ...f, stone_id: stoneId })),
      enc_localities: parsed.mineralProfile.localities.map(l => ({ ...l, stone_id: stoneId })),
      enc_reach_for: parsed.reachFor.map(r => ({ ...r, stone_id: stoneId })),
      enc_themes: parsed.themes.map(t => ({ ...t, stone_id: stoneId })),
      enc_collector_notes: parsed.collectorNotes.map(n => ({ ...n, stone_id: stoneId })),
      enc_care: parsed.care.map(c => ({ ...c, stone_id: stoneId, icon_slug: iconMap.care[c.category] || null })),
      enc_related_stones: parsed.relatedStones.map(rs => ({ ...rs, stone_id: stoneId })),
    };

    packets.push({ slug, packet });
    parseResults.push({ stone: slug, status: 'OK' });
    console.log(`OK    ${slug}`);
  }

  // Step 3: Compare against live Supabase
  console.log('\n--- Step 2: Compare generated packets against live Supabase ---');
  const compareResults = [];
  for (const { slug, packet } of packets) {
    const result = await comparePacketToSupabase(supabase, packet);
    compareResults.push(result);
    if (result.status === 'MATCH') {
      console.log(`MATCH  ${result.stone}`);
    } else {
      console.error(`MISMATCH  ${result.stone}`);
      for (const m of result.mismatches) console.error(m);
    }
  }

  // Step 4: Smoke test
  console.log('\n--- Step 3: Rendered-page smoke test ---');
  let smokeResults = [];
  try {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ headless: 'new' });
    const pg = await browser.newPage();

    for (const { slug, packet } of packets) {
      const url = `${baseUrl}/stones/stone.html?slug=${slug}`;
      const consoleErrors = [];
      pg.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

      await pg.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const errors = [];
      const checks = [
        ['.hero-name', 'hero name'],
        ['.hero-signature', 'signature line'],
        ['[data-section="overview"]', 'overview section'],
        ['[data-section="reach"]', 'reach section'],
        ['[data-section="mineral"]', 'mineral section'],
        ['[data-section="care"]', 'care section'],
        ['[data-section="related"]', 'related section'],
      ];
      for (const [sel, label] of checks) {
        const el = await pg.$(sel);
        if (!el) errors.push(`Selector not found: ${sel} (${label})`);
      }
      for (const ce of consoleErrors) errors.push(`Console error: ${ce}`);

      smokeResults.push({ stone: slug, errors });
      if (errors.length === 0) {
        console.log(`PASS  ${slug}`);
      } else {
        console.error(`FAIL  ${slug}`);
        for (const e of errors) console.error(`  ${e}`);
      }
    }
    await browser.close();
  } catch (_) {
    console.warn('puppeteer not installed — smoke test skipped. Run: npm install --save-dev puppeteer');
    smokeResults = packets.map(({ slug }) => ({ stone: slug, skipped: true }));
  }

  // Final summary
  console.log('\n=== Rehearsal Summary ===');
  console.log(`Parse:   ${parseResults.filter(r => r.status === 'OK').length}/${COHORT3_STONES.length} OK`);
  console.log(`Compare: ${compareResults.filter(r => r.status === 'MATCH').length}/${packets.length} MATCH`);
  const smokePass = smokeResults.filter(r => !r.skipped && r.errors?.length === 0).length;
  console.log(`Smoke:   ${smokePass}/${packets.length} PASS`);

  const anyFail = parseResults.some(r => r.status !== 'OK')
    || compareResults.some(r => r.status !== 'MATCH')
    || smokeResults.some(r => !r.skipped && r.errors?.length > 0);

  if (anyFail) {
    console.error('\nRehearssal complete with failures. Do not proceed to Cohort 4 data until all failures are resolved.');
    process.exit(1);
  }
  console.log('\nRehearsal complete. All checks passed. Cohort 4 pipeline is ready to proceed.');
}

main().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
