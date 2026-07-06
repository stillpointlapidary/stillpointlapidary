#!/usr/bin/env node
'use strict';

/**
 * Pre-Gate-4 Structured-Field Reconciliation — existing-live rows
 *
 * For a stone that already has an `enc_stone_content` row (a previously-
 * imported or previously-live stone going through a correction/reimport),
 * compares the PM-controlled structured fields currently in Supabase against
 * the generated Production Master export
 * (pipeline/data/structured-values.generated.json) and reports any drift.
 *
 * This is the "on a re-import or correction, check any existing Supabase
 * value against the Production Master export and halt on conflict rather
 * than silently preferring the Supabase value" rule
 * (ENCYCLOPEDIA-DATABASE-REFERENCE.md §2), run as a standalone pre-Gate-4
 * check instead of only surfacing as a generate-packet.js halt.
 *
 * Only these PM-controlled structured fields are compared or written:
 *   chakra_primary, chakra_secondary, element, zodiac, material_type,
 *   energetic_role, energetic_role_icon, color_energy,
 *   nav_prev_slug, nav_prev_name, nav_next_slug, nav_next_name
 *
 * energetic_role_icon is not an independent Production Master column — it is
 * derived deterministically from energetic_role via icon-map.json, the same
 * derivation generate-packet.js uses (ENCYCLOPEDIA-ICON-REGISTRY.md §6).
 *
 * Public-copy fields (signature_line, overview, collector_context, pills,
 * etc.) are never read or written by this script.
 *
 * Dry-run by default — reports diffs only. Pass --apply to write the
 * Production-Master-export values for the fields above into the existing
 * enc_stone_content row(s). A stone with no existing enc_stone_content row
 * is skipped (a first-time import uses the normal Gate 4 packet/import
 * path, not this tool).
 *
 * Usage:
 *   node pipeline/reconcile-structured-fields.js --stone <stone_id-or-slug> [--apply]
 *   node pipeline/reconcile-structured-fields.js --all [--apply]
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

const fs = require('fs');
const { STRUCTURED_EXPORT_PATH } = require('./lib/paths');
const iconMap = require('./lib/icon-map.json');

const RECONCILE_FIELDS = [
  'chakra_primary', 'chakra_secondary', 'element', 'zodiac', 'material_type',
  'energetic_role', 'energetic_role_icon', 'color_energy',
  'nav_prev_slug', 'nav_prev_name', 'nav_next_slug', 'nav_next_name',
];

function parseArgs(argv) {
  const args = argv || process.argv.slice(2);
  const opts = { apply: false, all: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--stone') opts.stone = args[++i];
    if (args[i] === '--all') opts.all = true;
    if (args[i] === '--apply') opts.apply = true;
  }
  if (!opts.stone && !opts.all) {
    console.error('Usage: node pipeline/reconcile-structured-fields.js --stone <stone_id-or-slug> [--apply]');
    console.error('   or: node pipeline/reconcile-structured-fields.js --all [--apply]');
    process.exit(1);
  }
  return opts;
}

function loadStructuredExport() {
  if (!fs.existsSync(STRUCTURED_EXPORT_PATH)) {
    console.error(`Structured values export not found at ${STRUCTURED_EXPORT_PATH}.\nRun "npm run pipeline:export-structured-values" first.\nReconciliation stopped.`);
    process.exit(2);
  }
  const raw = JSON.parse(fs.readFileSync(STRUCTURED_EXPORT_PATH, 'utf8'));
  return raw.stones || {};
}

// energetic_role_icon is derived, not a direct Production Master column —
// same rule generate-packet.js applies (ENCYCLOPEDIA-ICON-REGISTRY.md §6).
function expectedValues(exportRow) {
  const expected = {};
  for (const field of RECONCILE_FIELDS) {
    if (field === 'energetic_role_icon') continue;
    expected[field] = exportRow[field] ?? null;
  }
  expected.energetic_role_icon = exportRow.energetic_role
    ? (iconMap.energeticRoles[exportRow.energetic_role] ?? null)
    : null;
  return expected;
}

function diffFields(existing, expected) {
  const diffs = [];
  for (const field of RECONCILE_FIELDS) {
    const current = existing[field] ?? null;
    const target = expected[field];
    if (current !== target) diffs.push({ field, current, expected: target });
  }
  return diffs;
}

function resolveStoneId(input, exportStones) {
  if (exportStones[input]) return input;
  const bySlug = Object.values(exportStones).find(row => row.slug === input);
  if (bySlug) return bySlug.stone_id;
  return null;
}

async function reconcileStone(supabase, stoneId, exportRow, apply) {
  const { data: existing, error } = await supabase
    .from('enc_stone_content')
    .select(['stone_id', ...RECONCILE_FIELDS].join(','))
    .eq('stone_id', stoneId)
    .single();

  if (error || !existing) {
    return { stoneId, status: 'skipped', reason: 'no existing enc_stone_content row — use the normal Gate 4 import path for a first-time import, not reconciliation' };
  }

  const expected = expectedValues(exportRow);
  const diffs = diffFields(existing, expected);

  if (diffs.length === 0) {
    return { stoneId, status: 'in-sync' };
  }
  if (!apply) {
    return { stoneId, status: 'diff', diffs };
  }

  const update = {};
  for (const d of diffs) update[d.field] = d.expected;
  const { error: updateError } = await supabase
    .from('enc_stone_content')
    .update(update)
    .eq('stone_id', stoneId);

  if (updateError) {
    return { stoneId, status: 'error', reason: updateError.message };
  }
  return { stoneId, status: 'applied', diffs };
}

function report(results, apply) {
  console.log(`\n=== Structured-Field Reconciliation (${apply ? 'APPLY' : 'DRY RUN'}) ===\n`);
  let hasUnresolvedDiff = false;
  let hasError = false;

  for (const r of results) {
    if (r.status === 'skipped') {
      console.log(`SKIP       ${r.stoneId}  — ${r.reason}`);
    } else if (r.status === 'in-sync') {
      console.log(`IN-SYNC    ${r.stoneId}`);
    } else if (r.status === 'diff') {
      hasUnresolvedDiff = true;
      console.log(`DIFF       ${r.stoneId}`);
      for (const d of r.diffs) {
        console.log(`             ${d.field}: current=${JSON.stringify(d.current)}  production-master=${JSON.stringify(d.expected)}`);
      }
    } else if (r.status === 'applied') {
      console.log(`APPLIED    ${r.stoneId}`);
      for (const d of r.diffs) {
        console.log(`             ${d.field}: ${JSON.stringify(d.current)} -> ${JSON.stringify(d.expected)}`);
      }
    } else if (r.status === 'error') {
      hasError = true;
      console.error(`ERROR      ${r.stoneId}  — ${r.reason}`);
    }
  }

  if (!apply && hasUnresolvedDiff) {
    console.log('\nDry run found drift against the Production Master export. Re-run with --apply to write the PM-controlled fields listed above. Re-run "npm run pipeline:export-structured-values" first if the Production Master changed since the export was generated.');
  }

  process.exitCode = (hasError || (!apply && hasUnresolvedDiff)) ? 1 : 0;
}

async function main() {
  const opts = parseArgs();

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY env vars are required.');
    process.exit(1);
  }
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const exportStones = loadStructuredExport();

  let targets;
  if (opts.all) {
    targets = Object.keys(exportStones);
  } else {
    const stoneId = resolveStoneId(opts.stone, exportStones);
    if (!stoneId) {
      console.error(`"${opts.stone}" was not found in the structured-values export by stone_id or slug.\nReconciliation stopped.`);
      process.exit(2);
    }
    targets = [stoneId];
  }

  const results = [];
  for (const stoneId of targets) {
    const result = await reconcileStone(supabase, stoneId, exportStones[stoneId], opts.apply);
    results.push(result);
  }

  report(results, opts.apply);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Unexpected error:', err.message);
    process.exitCode = 1;
  });
}

module.exports = {
  parseArgs,
  expectedValues,
  diffFields,
  resolveStoneId,
  RECONCILE_FIELDS,
};
