#!/usr/bin/env node
'use strict';

/**
 * Guarded SOTD writeback: Production Master (Group L SOTD Authoring fields)
 * -> Supabase `stones` rich-SOTD/review columns.
 *
 * Source of truth for this write: the canonical Production Master. Supabase
 * is operational output only. Reads workbook columns by stripped field name
 * (text after the last "|" in the header), never by fixed column position,
 * so this keeps working if columns are reordered or the workbook gains more
 * columns later.
 *
 * Column mapping (seven fields only — deliberately not all nine PM columns):
 *   SOTD Essence        -> stones.sotd_essence
 *   SOTD Energy Label   -> stones.sotd_energy_label
 *   SOTD Question       -> stones.sotd_question
 *   SOTD Takeaway        -> stones.sotd_takeaway
 *   SOTD Review Status  -> stones.sotd_review_status
 *   SOTD Review Source  -> stones.sotd_review_source
 *   SOTD Reviewed At    -> stones.sotd_reviewed_at
 *
 * "SOTD Reviewed By" and "SOTD Notes / Blocker" are Production-Master-only
 * tracking fields. No matching Supabase column has been approved for either,
 * so this tool never writes them and never invents a database column for
 * them.
 *
 * Never touched by this tool, under any flag: sotd_enabled, sotd_ready,
 * sotd_worth_noticing, stone_of_day_schedule, card_* fields, energetic_role_*,
 * primary_chakra, any photo/image field, any runtime code.
 *
 * Safeguards (all must pass before a write is permitted):
 *   - Exact Stone ID match (workbook row <-> live Supabase row), refuses on
 *     zero or multiple matches in either source.
 *   - Canonical Name and Slug must match exactly between the workbook row
 *     and the live Supabase row for that Stone ID.
 *   - SOTD Review Status must equal "Approved v1" exactly.
 *   - All four rich fields (Essence, Energy Label, Question, Takeaway) must
 *     be non-blank in the workbook.
 *   - No duplicate Essence/Question/Takeaway value across the target batch.
 *   - For a first writeback, every one of the seven target Supabase columns
 *     must currently be null for every target row — any existing value is
 *     treated as drift and halts the whole batch rather than silently
 *     overwriting it.
 *
 * Any safeguard failure halts the ENTIRE batch (no partial writes) and is
 * reported as BLOCKED.
 *
 * Default mode is dry-run (report only, no write). Live write requires the
 * explicit --apply flag.
 *
 * Usage:
 *   node pipeline/tools/write-sotd-supabase.js --pm-path "<path>" [--stone-ids C-0001,C-0002,...] [--apply]
 *
 * Required env vars (same as the rest of the pipeline):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

const fs = require('fs');
const XLSX = require('xlsx');

const SHEET_NAME = 'Catalog Master';
const ID_HEADER = 'Stone ID';
const NAME_HEADER = 'Canonical Name';
const SLUG_HEADER = 'Slug';

const PM_TO_SUPABASE_MAP = {
  'SOTD Essence': 'sotd_essence',
  'SOTD Energy Label': 'sotd_energy_label',
  'SOTD Question': 'sotd_question',
  'SOTD Takeaway': 'sotd_takeaway',
  'SOTD Review Status': 'sotd_review_status',
  'SOTD Review Source': 'sotd_review_source',
  'SOTD Reviewed At': 'sotd_reviewed_at',
};
const PM_ONLY_FIELDS = ['SOTD Reviewed By', 'SOTD Notes / Blocker']; // no Supabase counterpart — never written
const RICH_FIELDS_REQUIRE_NONBLANK = ['SOTD Essence', 'SOTD Energy Label', 'SOTD Question', 'SOTD Takeaway'];
const DUPLICATE_CHECK_FIELDS = ['SOTD Essence', 'SOTD Question', 'SOTD Takeaway'];
const REQUIRED_REVIEW_STATUS = 'Approved v1';

const DEFAULT_STONE_IDS = [
  'C-0151', 'C-0075', 'C-0129', 'C-0119', 'C-0175',
  'C-0162', 'C-0020', 'C-0037', 'C-0147', 'C-0114',
];

class ToolFailure extends Error {}

function fail(message) {
  throw new ToolFailure(message);
}

function stripGroupPrefix(header) {
  const parts = String(header).split('|');
  return parts[parts.length - 1].trim();
}

function normalizeStr(value) {
  if (value === undefined || value === null) return null;
  const str = typeof value === 'string' ? value : String(value);
  const trimmed = str.trim();
  return trimmed === '' ? null : trimmed;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    pmPath: 'C:\\Users\\chris\\Documents\\Still Point Lapidary\\Encyclopedia\\Production Data\\Still-Point-Lapidary-Production-Master.xlsx',
    stoneIds: DEFAULT_STONE_IDS.slice(),
    apply: false,
  };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--pm-path') opts.pmPath = args[++i];
    else if (args[i] === '--stone-ids') opts.stoneIds = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (args[i] === '--apply') opts.apply = true;
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Production Master read (read-only, via xlsx package)
// ---------------------------------------------------------------------------

function readProductionMaster(pmPath) {
  if (!fs.existsSync(pmPath)) fail(`Workbook not found at: ${pmPath}`);
  const workbook = XLSX.readFile(pmPath);
  if (!workbook.SheetNames.includes(SHEET_NAME)) {
    fail(`Workbook is missing sheet "${SHEET_NAME}". Found: ${workbook.SheetNames.join(', ')}`);
  }
  const sheet = workbook.Sheets[SHEET_NAME];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  if (rows.length < 2) fail(`Sheet "${SHEET_NAME}" has no data rows.`);
  const header = rows[0];

  const colIndex = {};
  header.forEach((cell, i) => {
    if (cell == null) return;
    const stripped = stripGroupPrefix(cell);
    colIndex[stripped] = Object.prototype.hasOwnProperty.call(colIndex, stripped) ? 'AMBIGUOUS' : i;
  });

  const requiredHeaders = [ID_HEADER, NAME_HEADER, SLUG_HEADER, ...Object.keys(PM_TO_SUPABASE_MAP), ...PM_ONLY_FIELDS];
  for (const h of requiredHeaders) {
    if (colIndex[h] === undefined) fail(`Required header "${h}" not found in workbook (resolved by stripped field name after "|").`);
    if (colIndex[h] === 'AMBIGUOUS') fail(`Header "${h}" is ambiguous in the workbook (matches more than one column after stripping).`);
  }

  return { rows, header, colIndex };
}

function findRowsForStoneId(rows, idColIdx, stoneId) {
  const matches = [];
  for (let r = 1; r < rows.length; r++) {
    if (normalizeStr(rows[r][idColIdx]) === stoneId) matches.push(r);
  }
  return matches;
}

// ---------------------------------------------------------------------------
// Supabase read (read-only SELECT via supabase-js)
// ---------------------------------------------------------------------------

async function fetchSupabaseRows(stoneIds) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    fail('SUPABASE_URL and SUPABASE_SERVICE_KEY env vars are required.');
  }
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data, error } = await supabase
    .from('stones')
    .select('id,name,slug,sotd_enabled,sotd_ready,sotd_essence,sotd_energy_label,sotd_question,sotd_takeaway,sotd_review_status,sotd_review_source,sotd_reviewed_at,sotd_worth_noticing')
    .in('id', stoneIds);
  if (error) fail(`Supabase read failed: ${error.message}`);
  const byId = {};
  (data || []).forEach((row) => { byId[row.id] = row; });
  return byId;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function run() {
  const opts = parseArgs();
  console.log(`Workbook: ${opts.pmPath}`);
  console.log(`Mode: ${opts.apply ? 'LIVE WRITE (--apply)' : 'DRY RUN (default — no --apply given)'}`);
  console.log(`Target Stone IDs (${opts.stoneIds.length}): ${opts.stoneIds.join(', ')}\n`);

  const { rows, colIndex } = readProductionMaster(opts.pmPath);

  console.log('Resolved headers (stripped field name -> column index):');
  [ID_HEADER, NAME_HEADER, SLUG_HEADER, ...Object.keys(PM_TO_SUPABASE_MAP), ...PM_ONLY_FIELDS].forEach((h) => {
    console.log(`  "${h}" -> index ${colIndex[h]}`);
  });
  console.log('');

  const idColIdx = colIndex[ID_HEADER];
  const nameColIdx = colIndex[NAME_HEADER];
  const slugColIdx = colIndex[SLUG_HEADER];

  // --- Resolve exact rows for each target Stone ID ---
  const pmRecords = [];
  const identityIssues = [];
  for (const stoneId of opts.stoneIds) {
    const matches = findRowsForStoneId(rows, idColIdx, stoneId);
    if (matches.length !== 1) {
      identityIssues.push(`Stone ID "${stoneId}" matched ${matches.length} row(s) in the workbook (expected exactly 1).`);
      continue;
    }
    const r = matches[0];
    const record = {
      stoneId,
      excelRow: r + 1,
      canonicalName: normalizeStr(rows[r][nameColIdx]),
      slug: normalizeStr(rows[r][slugColIdx]),
      pm: {},
    };
    for (const pmField of Object.keys(PM_TO_SUPABASE_MAP)) {
      record.pm[pmField] = normalizeStr(rows[r][colIndex[pmField]]);
    }
    for (const pmField of PM_ONLY_FIELDS) {
      record.pm[pmField] = normalizeStr(rows[r][colIndex[pmField]]);
    }
    pmRecords.push(record);
  }

  console.log('=== Matched workbook rows ===');
  pmRecords.forEach((r) => console.log(`  ${r.stoneId} -> Excel row ${r.excelRow} (${r.canonicalName}, /${r.slug})`));
  if (identityIssues.length) {
    console.log('\nIdentity issues (workbook side):');
    identityIssues.forEach((m) => console.log(`  ${m}`));
  }
  console.log('');

  // --- PM-side field validation ---
  const fieldIssues = [];
  pmRecords.forEach((r) => {
    if (r.pm['SOTD Review Status'] !== REQUIRED_REVIEW_STATUS) {
      fieldIssues.push(`${r.stoneId}: SOTD Review Status is "${r.pm['SOTD Review Status']}", expected exactly "${REQUIRED_REVIEW_STATUS}".`);
    }
    RICH_FIELDS_REQUIRE_NONBLANK.forEach((f) => {
      if (r.pm[f] === null) fieldIssues.push(`${r.stoneId}: "${f}" is blank in the workbook — required non-blank.`);
    });
  });

  // --- Duplicate check within the batch ---
  const duplicateIssues = [];
  DUPLICATE_CHECK_FIELDS.forEach((field) => {
    const seen = new Map();
    pmRecords.forEach((r) => {
      const val = r.pm[field];
      if (val === null) return;
      if (!seen.has(val)) seen.set(val, []);
      seen.get(val).push(r.stoneId);
    });
    seen.forEach((stoneIdsSharing, val) => {
      if (stoneIdsSharing.length > 1) {
        duplicateIssues.push(`Duplicate "${field}" value shared by ${stoneIdsSharing.join(', ')}: "${val}"`);
      }
    });
  });

  console.log('=== PM-side field validation ===');
  console.log(fieldIssues.length ? fieldIssues.map((m) => `  ISSUE: ${m}`).join('\n') : '  All rows: Review Status = "Approved v1", all four rich fields non-blank. PASS.');
  console.log('\n=== Duplicate check (Essence / Question / Takeaway) ===');
  console.log(duplicateIssues.length ? duplicateIssues.map((m) => `  ISSUE: ${m}`).join('\n') : '  No duplicate values found across the batch. PASS.');
  console.log('');

  // --- Supabase read ---
  const supabaseById = await fetchSupabaseRows(opts.stoneIds);
  const supabaseIssues = [];
  console.log('=== Current Supabase values ===');
  pmRecords.forEach((r) => {
    const sb = supabaseById[r.stoneId];
    if (!sb) {
      supabaseIssues.push(`${r.stoneId}: no matching row found in Supabase "stones" table.`);
      console.log(`  ${r.stoneId}: NOT FOUND in Supabase`);
      return;
    }
    console.log(`  ${r.stoneId} (${sb.name}, /${sb.slug}) — sotd_enabled=${sb.sotd_enabled}, sotd_ready=${sb.sotd_ready}, sotd_worth_noticing=${JSON.stringify(sb.sotd_worth_noticing)}`);
    Object.values(PM_TO_SUPABASE_MAP).forEach((col) => {
      console.log(`      ${col}: ${JSON.stringify(sb[col])}`);
    });
  });
  console.log('');

  // --- Identity cross-check: PM name/slug vs Supabase name/slug ---
  console.log('=== Identity cross-check (PM vs Supabase) ===');
  pmRecords.forEach((r) => {
    const sb = supabaseById[r.stoneId];
    if (!sb) return; // already flagged above
    const nameMatch = r.canonicalName === sb.name;
    const slugMatch = r.slug === sb.slug;
    console.log(`  ${r.stoneId}: name ${nameMatch ? 'MATCH' : `MISMATCH (PM "${r.canonicalName}" vs Supabase "${sb.name}")`}, slug ${slugMatch ? 'MATCH' : `MISMATCH (PM "${r.slug}" vs Supabase "${sb.slug}")`}`);
    if (!nameMatch) supabaseIssues.push(`${r.stoneId}: Canonical Name mismatch — PM "${r.canonicalName}" vs Supabase "${sb.name}".`);
    if (!slugMatch) supabaseIssues.push(`${r.stoneId}: Slug mismatch — PM "${r.slug}" vs Supabase "${sb.slug}".`);
  });
  console.log('');

  // --- "Currently null" check (first-write precondition) ---
  console.log('=== Currently-null check (first-write precondition on all 7 mapped columns) ===');
  const driftIssues = [];
  pmRecords.forEach((r) => {
    const sb = supabaseById[r.stoneId];
    if (!sb) return;
    Object.values(PM_TO_SUPABASE_MAP).forEach((col) => {
      const current = sb[col];
      if (current !== null && current !== undefined && String(current).trim() !== '') {
        driftIssues.push(`${r.stoneId}: Supabase "${col}" already has a value ("${current}") — not null as required for a first write.`);
      }
    });
  });
  console.log(driftIssues.length ? driftIssues.map((m) => `  DRIFT: ${m}`).join('\n') : '  All 7 mapped columns are currently null on all target rows. PASS.');
  console.log('');

  // --- Proposed before/after ---
  console.log('=== Proposed before/after (7 mapped fields only) ===');
  pmRecords.forEach((r) => {
    const sb = supabaseById[r.stoneId] || {};
    console.log(`  ${r.stoneId} (${r.canonicalName}):`);
    Object.entries(PM_TO_SUPABASE_MAP).forEach(([pmField, sbCol]) => {
      console.log(`    ${sbCol}: before=${JSON.stringify(sb[sbCol] ?? null)}  after=${JSON.stringify(r.pm[pmField])}`);
    });
  });
  console.log(`\n  Not written (PM tracking only, no Supabase column): ${PM_ONLY_FIELDS.join(', ')}`);
  console.log(`  Not touched under any flag: sotd_enabled, sotd_ready, sotd_worth_noticing, stone_of_day_schedule, card_* fields, energetic_role_*, primary_chakra, photo/image fields, runtime code.\n`);

  // --- Row count ---
  console.log(`Expected row count: ${opts.stoneIds.length}`);
  console.log(`Matched workbook rows: ${pmRecords.length}`);
  console.log(`Matched Supabase rows: ${Object.keys(supabaseById).length}\n`);

  // --- Classification ---
  const allIssues = [...identityIssues, ...fieldIssues, ...duplicateIssues, ...supabaseIssues, ...driftIssues];
  const blocked = allIssues.length > 0;

  let classification;
  if (blocked) {
    classification = 'BLOCKED';
  } else if (pmRecords.length !== opts.stoneIds.length) {
    classification = 'BLOCKED';
  } else {
    classification = 'PASS';
  }

  console.log('=== Result ===');
  console.log(classification);
  if (blocked) {
    console.log('\nAll blocking issues:');
    allIssues.forEach((m) => console.log(`  - ${m}`));
  }

  if (!opts.apply) {
    console.log('\nDRY RUN — no Supabase write performed (pass --apply to write, only once this report is clean).');
    process.exitCode = blocked ? 1 : 0;
    return;
  }

  if (blocked) {
    console.log('\nRESULT: BLOCKED — refusing to write due to the issues above.');
    process.exitCode = 1;
    return;
  }

  // --- Live write path (only reached with --apply and a clean report) ---
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  console.log('\n=== LIVE WRITE ===');
  let writeAllPass = true;
  for (const r of pmRecords) {
    const updatePayload = {};
    Object.entries(PM_TO_SUPABASE_MAP).forEach(([pmField, sbCol]) => { updatePayload[sbCol] = r.pm[pmField]; });
    const { data, error } = await supabase.from('stones').update(updatePayload).eq('id', r.stoneId).select();
    if (error) {
      writeAllPass = false;
      console.log(`  ${r.stoneId}: WRITE FAILED — ${error.message}`);
      continue;
    }
    if (!data || data.length !== 1) {
      writeAllPass = false;
      console.log(`  ${r.stoneId}: WRITE returned ${data ? data.length : 0} row(s), expected exactly 1.`);
      continue;
    }
    const after = data[0];
    let rowPass = true;
    const mismatches = [];
    Object.entries(PM_TO_SUPABASE_MAP).forEach(([pmField, col]) => {
      const expected = r.pm[pmField];
      const actual = normalizeStr(after[col]);
      // sotd_reviewed_at is timestamptz — Postgres reformats any valid input
      // (e.g. "2026-07-10 20:49 CDT" -> "2026-07-11 01:49:00+00"), so compare
      // by parsed instant, not literal string, for this column only.
      const isMatch = col === 'sotd_reviewed_at'
        ? (expected !== null && actual !== null && new Date(expected).getTime() === new Date(actual).getTime())
        : actual === expected;
      if (!isMatch) { rowPass = false; mismatches.push(`${col}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`); }
    });
    if (!rowPass) writeAllPass = false;
    console.log(`  ${r.stoneId}: ${rowPass ? 'WRITE + VERIFY PASS' : 'WRITE SUCCEEDED BUT VERIFY MISMATCH — ' + mismatches.join('; ')}`);
  }

  console.log(writeAllPass ? '\nRESULT: PASS' : '\nRESULT: FAIL — one or more rows did not verify after write.');
  process.exitCode = writeAllPass ? 0 : 1;
}

run().catch((err) => {
  if (err instanceof ToolFailure) {
    console.error(`FAIL: ${err.message}`);
  } else {
    console.error('UNEXPECTED ERROR:', err);
  }
  process.exitCode = 1;
});
