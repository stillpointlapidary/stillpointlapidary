#!/usr/bin/env node
'use strict';

/**
 * Gate 0 — Cohort/Stone Preflight
 *
 * Read-only. Production-Master-only. Reads the canonical Production Master
 * workbook directly (via the `xlsx` package — this project's Node pipeline
 * equivalent of a direct openpyxl read: same guarantee of a read-only,
 * header-mapped, no-write open, see Project Rules/CLAUDE.md §6 "Gate 0 —
 * Cohort Preflight"). Makes no workbook, file, database, or Supabase writes,
 * does not consult Supabase, and does not search the filesystem beyond
 * opening the one canonical workbook path.
 *
 * Replaces ad hoc one-off openpyxl-style scripts with a single repeatable
 * command that answers "is this stone (or these stones) ready for Gate 1
 * research?" — not "is this stone ready to publish" (that is Gate 4
 * precheck's job — see gate4-precheck.js).
 *
 * Usage:
 *   node pipeline/gate0.js --stone ocean-jasper
 *   node pipeline/gate0.js --stone "Ocean Jasper"
 *   node pipeline/gate0.js --stones ocean-jasper,moss-agate
 *   node pipeline/gate0.js --stone ocean-jasper --source <path>
 *
 * A stone may be identified by canonical name or slug, case-insensitively.
 */

const XLSX = require('xlsx');
const {
  stripGroupPrefix, normalize, loadWorkbook,
  DEFAULT_SOURCE, SHEET_NAME,
} = require('./export-structured-values');

// ---------------------------------------------------------------------------
// Gate 0 field map — required Gate 0 field -> exact Production Master header
// (after the "Group X — Label | " prefix is stripped). `null` means no
// dedicated column exists for that field in the current Production Master;
// this is reported explicitly rather than guessed at.
// ---------------------------------------------------------------------------
const FIELD_MAP = {
  'Stone ID': 'Stone ID',
  'Stone Name': 'Canonical Name',
  'Slug': 'Slug',
  'Collection Tier': 'Collection Tier',
  'Material Type': 'Material Type',
  'Primary Chakra': 'Primary Chakra',
  'Secondary Chakra': 'Secondary Chakra',
  'Styling Chakra': 'Styling Chakra',
  'Energetic Role': 'Encyclopedia Energetic Role',
  'Color Energy': 'Color Energy',
  'Image Status': 'Image Status',
  'Image Path': 'Image URL',
  'Image Filename': 'Image Filename',
  'Previous Stone': 'Previous Stone',
  'Previous Slug': 'Previous Slug',
  'Next Stone': 'Next Stone',
  'Next Slug': 'Next Slug',
  'Exception / Identity Flag': 'Exception / Identity Flag',
  'Exception Review Required': 'Exception Review Required',
  'Structured Data Status': 'Structured Data Status',
  'Production Status': 'Encyclopedia Production Status',
  'Blocker': 'Blocker',
  'Notes': 'Notes',
  'Next Action': null, // No dedicated column in the current Production Master.
  'Production Data Version': 'Production Data Version',
};

const REQUIRED_HEADERS = Object.values(FIELD_MAP).filter(Boolean);

// Approved Energetic Roles — ENCYCLOPEDIA-CONTENT-FIELDS.md §4.1.
const ENERGETIC_ROLES = new Set([
  'Grounding', 'Protection', 'Vitality', 'Heart Healing', 'Calm & Peace',
  'Emotional Regulation', 'Clarity & Focus', 'Intuition', 'Spiritual Connection',
  'Transformation', 'Manifestation', 'Amplification',
]);

// Controlled Material Type vocabulary — ENCYCLOPEDIA-CONTENT-FIELDS.md §4.6.
const MATERIAL_TYPES = new Set([
  'Mineral', 'Mineral variety', 'Rock', 'Mineraloid', 'Organic material',
  'Mineral aggregate', 'Composite', 'Man-made', 'Fossil',
]);

// Recognized chakra values — Production Master "Controlled Vocabularies" sheet.
// Unrecognized values are flagged for review (WARN), not blocked, since chakra
// controlled-vocabulary enforcement is not a listed Gate 0 blocker class.
const CHAKRAS = new Set([
  'Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown',
  'All Chakras', 'Earth Star', 'Soul Star',
]);

// Actual stop-research / contradiction language. Ordinary status prose (e.g.
// "restart under current workflow", "resolved per Christie") must not match —
// only genuine "do not proceed" language should. See CLAUDE.md §6 Gate 0 rule
// and the task's own BLOCKER/WARN examples.
const STOP_LANGUAGE_PATTERNS = [
  /\bdo not (begin|start|proceed)\b/i,
  /\bcannot (proceed|begin|start)\b/i,
  /\bresearch (cannot|must not|should not) proceed\b/i,
  /\b(stop|halt) research\b/i,
  /\bresearch (is )?blocked\b/i,
  /\bidentity conflict\b/i,
  /\bdisputed identity\b/i,
  /\b(name|slug) mismatch\b/i,
];

function hasStopLanguage(text) {
  return STOP_LANGUAGE_PATTERNS.some(re => re.test(text));
}

function parseArgs(argv) {
  const opts = { source: DEFAULT_SOURCE, stones: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--stone') opts.stones.push(argv[++i]);
    else if (argv[i] === '--stones') opts.stones.push(...argv[++i].split(',').map(s => s.trim()).filter(Boolean));
    else if (argv[i] === '--source') opts.source = argv[++i];
  }
  return opts;
}

function buildGate0ColumnIndex(headerRow) {
  const index = {};
  headerRow.forEach((cell, i) => {
    if (cell == null) return;
    index[stripGroupPrefix(cell)] = i;
  });
  const missing = REQUIRED_HEADERS.filter(name => !(name in index));
  return { index, missing };
}

function loadCatalog(source) {
  const workbook = loadWorkbook(source);
  const sheet = workbook.Sheets[SHEET_NAME];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  if (rows.length < 2) {
    throw new Error(`Production Master "${SHEET_NAME}" sheet has no data rows.`);
  }
  const { index: col, missing } = buildGate0ColumnIndex(rows[0]);
  return { rows, col, missing };
}

function findStoneRows(rows, col, query) {
  const needle = normalize(query).toLowerCase();
  const matches = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const name = normalize(row[col['Canonical Name']]);
    const slug = normalize(row[col['Slug']]);
    if ((name && name.toLowerCase() === needle) || (slug && slug.toLowerCase() === needle)) {
      matches.push({ row, rowNumber: r + 1 });
    }
  }
  return matches;
}

function findNearMatches(rows, col, query) {
  const needle = normalize(query).toLowerCase();
  const near = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const name = normalize(row[col['Canonical Name']]);
    const slug = normalize(row[col['Slug']]);
    if ((name && name.toLowerCase().includes(needle)) || (slug && slug.toLowerCase().includes(needle))) {
      near.push(`${name} (${slug})`);
    }
  }
  return near.slice(0, 10);
}

function countMatches(rows, col, field, value) {
  if (!value) return 0;
  let count = 0;
  for (let r = 1; r < rows.length; r++) {
    if (normalize(rows[r][col[field]])?.toLowerCase() === value.toLowerCase()) count++;
  }
  return count;
}

function blocker(what, source, why, fix) {
  return { what, source, why, fix };
}

function evaluateStone(rows, col, rowInfo) {
  const { row, rowNumber } = rowInfo;
  const get = (field) => normalize(row[col[field]]);
  const result = { pass: [], warn: [], blocker: [], rowNumber };

  const stoneId = get('Stone ID');
  const stoneName = get('Canonical Name');
  const slug = get('Slug');
  result.stoneId = stoneId;
  result.stoneName = stoneName;
  result.slug = slug;

  // --- Required identity fields ---
  if (!stoneId) {
    result.blocker.push(blocker('Stone ID is blank', `Production Master row ${rowNumber}, column "Stone ID"`,
      'Every other Gate 0/Gate 1 lookup keys off Stone ID; without it the row cannot be tracked through research.',
      'Assign a Stone ID in the Production Master before research begins.'));
  }
  if (!stoneName) {
    result.blocker.push(blocker('Canonical Name is blank', `Production Master row ${rowNumber}, column "Canonical Name"`,
      'Research cannot be scoped or reported without a canonical name.',
      'Fill in Canonical Name in the Production Master.'));
  }
  if (!slug) {
    result.blocker.push(blocker('Slug is blank', `Production Master row ${rowNumber}, column "Slug"`,
      'Slug is required for routing, navigation, and roster lookups.',
      'Fill in Slug in the Production Master.'));
  }
  if (stoneId && stoneName && slug) {
    result.pass.push('Stone ID, Canonical Name, and Slug are all present');
  }

  // --- Duplicates (checked against the full catalog, scoped to this stone) ---
  if (stoneId) {
    const n = countMatches(rows, col, 'Stone ID', stoneId);
    if (n > 1) {
      result.blocker.push(blocker(`Stone ID "${stoneId}" is duplicated (${n} rows)`, 'Production Master, column "Stone ID"',
        'A duplicate Stone ID makes it impossible to know which row research findings belong to.',
        'Resolve the duplicate Stone ID in the Production Master before research begins.'));
    } else {
      result.pass.push(`Stone ID "${stoneId}" is unique in the catalog`);
    }
  }
  if (stoneName) {
    const n = countMatches(rows, col, 'Canonical Name', stoneName);
    if (n > 1) {
      result.blocker.push(blocker(`Canonical Name "${stoneName}" is duplicated (${n} rows)`, 'Production Master, column "Canonical Name"',
        'A duplicate canonical name creates ambiguity about which row research and publication apply to.',
        'Resolve the duplicate canonical name in the Production Master before research begins.'));
    } else {
      result.pass.push(`Canonical Name "${stoneName}" is unique in the catalog`);
    }
  }
  if (slug) {
    const n = countMatches(rows, col, 'Slug', slug);
    if (n > 1) {
      result.blocker.push(blocker(`Slug "${slug}" is duplicated (${n} rows)`, 'Production Master, column "Slug"',
        'A duplicate slug breaks routing and navigation and cannot be resolved during research.',
        'Resolve the duplicate slug in the Production Master before research begins.'));
    } else {
      result.pass.push(`Slug "${slug}" is unique in the catalog`);
    }
  }

  // --- Collection Tier / Label ---
  const tierRaw = get('Collection Tier');
  if (!tierRaw) {
    result.warn.push('Collection Tier is blank (pending research)');
  } else {
    try {
      const label = resolveCollectionLabelSafe(tierRaw);
      result.pass.push(`Collection Tier "${tierRaw}" resolves to "${label}"`);
    } catch (err) {
      result.blocker.push(blocker(`Collection Tier "${tierRaw}" has no documented label mapping`, 'Production Master, column "Collection Tier"',
        'An unmapped tier value cannot be routed to a catalog label.',
        'Set Collection Tier to 1-4 per PRODUCTION-DATA-README.md §4, or mark Pending Research.'));
    }
  }

  // --- Material Type (required to route research) ---
  const materialType = get('Material Type');
  if (!materialType) {
    result.blocker.push(blocker('Material Type is blank', 'Production Master, column "Material Type"',
      'Material Type determines how identity/geological research is routed and cannot be deferred like Color Energy or Energetic Role.',
      'Set Material Type to one approved value (ENCYCLOPEDIA-CONTENT-FIELDS.md §4.6) before research begins.'));
  } else if (!MATERIAL_TYPES.has(materialType)) {
    result.blocker.push(blocker(`Material Type "${materialType}" is not one of the approved controlled-vocabulary values`, 'Production Master, column "Material Type"',
      'An unrecognized Material Type cannot reliably route identity/geological research.',
      'Update Production Master Material Type to one of: ' + [...MATERIAL_TYPES].join(', ') + '.'));
  } else {
    result.pass.push(`Material Type "${materialType}" is an approved value`);
  }

  // --- Energetic Role ---
  const energeticRole = get('Encyclopedia Energetic Role');
  if (!energeticRole) {
    result.warn.push('Encyclopedia Energetic Role is blank (pending research)');
  } else if (!ENERGETIC_ROLES.has(energeticRole)) {
    result.blocker.push(blocker(`Encyclopedia Energetic Role "${energeticRole}" is not one of the 12 approved roles`, 'Production Master, column "Encyclopedia Energetic Role"',
      'An unapproved Energetic Role value would carry an invalid classification into research and eventually publication.',
      'Update Production Master to one approved role (ENCYCLOPEDIA-CONTENT-FIELDS.md §4.1) or mark Pending Research if appropriate.'));
  } else {
    result.pass.push(`Encyclopedia Energetic Role "${energeticRole}" is an approved value`);
  }

  // --- Chakras ---
  for (const [field, required] of [['Primary Chakra', true], ['Secondary Chakra', false], ['Styling Chakra', false]]) {
    const val = get(field);
    if (!val) {
      result.warn.push(`${field} is blank (pending research${required ? '' : ' or legitimately optional'})`);
    } else if (!CHAKRAS.has(val)) {
      result.warn.push(`${field} "${val}" is not a recognized chakra value — review before research relies on it`);
    } else {
      result.pass.push(`${field} "${val}" is a recognized value`);
    }
  }

  // --- Color Energy ---
  const colorEnergy = get('Color Energy');
  if (!colorEnergy) {
    result.warn.push('Color Energy is blank (pending research)');
  } else {
    result.pass.push(`Color Energy "${colorEnergy}" is present`);
  }

  // --- Navigation ---
  for (const [label, nameField, slugField] of [
    ['Previous', 'Previous Stone', 'Previous Slug'],
    ['Next', 'Next Stone', 'Next Slug'],
  ]) {
    const navName = get(nameField);
    const navSlug = get(slugField);
    if (navName && navSlug) {
      result.pass.push(`${label} navigation has both name ("${navName}") and slug ("${navSlug}")`);
    } else if (!navName && !navSlug) {
      result.warn.push(`${label} navigation is blank — legitimate only if this stone is the roster boundary; not a research blocker`);
    } else {
      result.blocker.push(blocker(`${label} navigation has ${navName ? 'a name but no slug' : 'a slug but no name'}`,
        `Production Master, columns "${nameField}" / "${slugField}"`,
        'A partial navigation pointer indicates a data inconsistency that blocks publication routing and cannot be resolved during research.',
        `Fill in the missing ${navName ? slugField : nameField} in the Production Master.`));
    }
  }

  // --- Image status/path (never a Gate 0 blocker, per accepted photo-QA policy) ---
  const imageStatus = get('Image Status');
  const imageUrl = get('Image URL');
  const imageFilename = get('Image Filename');
  if (!imageStatus && !imageUrl && !imageFilename) {
    result.warn.push('No Image Status/URL/Filename yet — expected pre-photo-QA state, not a Gate 0 blocker');
  } else {
    result.pass.push(`Image Status "${imageStatus || '(blank)'}"${imageUrl ? `, Image URL "${imageUrl}"` : ''}${imageFilename ? `, Image Filename "${imageFilename}"` : ''}`);
  }

  // --- Exception / identity / treatment flags (informational only) ---
  const exceptionFlag = get('Exception / Identity Flag');
  const exceptionReview = get('Exception Review Required');
  const structuredDataStatus = get('Structured Data Status');
  if (exceptionFlag) {
    result.warn.push(`Exception / Identity Flag: "${exceptionFlag}"${exceptionReview ? ` (Exception Review Required: ${exceptionReview})` : ''} — review before research relies on identity being settled`);
  } else {
    result.pass.push('No Exception / Identity Flag set');
  }
  if (structuredDataStatus) {
    result.warn.push(`Structured Data Status: "${structuredDataStatus}" — informational, not a Gate 0 blocker`);
  }

  // --- Production Status ---
  const productionStatus = get('Encyclopedia Production Status');
  result.pass.push(`Encyclopedia Production Status: "${productionStatus || '(blank)'}"`);

  // --- Blocker / Notes: only genuine stop-research/contradiction language blocks ---
  const blockerText = get('Blocker');
  const notesText = get('Notes');
  if (blockerText) {
    if (hasStopLanguage(blockerText)) {
      result.blocker.push(blocker(`Production Master Blocker contains stop-research language: "${blockerText}"`, 'Production Master, column "Blocker"',
        'The Blocker field explicitly says research should not proceed.',
        'Resolve the stated blocking condition, or have Christie/Dustin clear the Blocker field, before research begins.'));
    } else {
      result.warn.push(`Production Master Blocker is non-empty but does not contain stop-research language — review, not a hard stop: "${blockerText}"`);
    }
  } else {
    result.pass.push('Production Master Blocker is empty');
  }
  if (notesText) {
    if (hasStopLanguage(notesText)) {
      result.blocker.push(blocker(`Production Master Notes contains stop-research/contradiction language: "${notesText}"`, 'Production Master, column "Notes"',
        'The Notes field explicitly describes a stop condition or unresolved contradiction.',
        'Resolve the noted condition, or have Christie/Dustin update Notes, before research begins.'));
    } else {
      result.warn.push(`Production Master Notes is non-empty — review for currency, not auto-resolved: "${notesText}"`);
    }
  }

  // --- Next Action (no dedicated column) ---
  result.warn.push('Next Action has no dedicated Production Master column — tracked informally in Notes, if at all');

  // --- Production Master snapshot/version ---
  const version = get('Production Data Version');
  result.pass.push(`Production Data Version: "${version || '(blank)'}"`);

  return result;
}

function resolveCollectionLabelSafe(tierRaw) {
  // resolveCollectionLabel() calls process.exit(2) on an unmapped tier, which
  // is correct for the export script but not for a single-stone Gate 0 report.
  // Re-implement the same documented mapping without the process.exit side effect.
  const COLLECTION_TIER_LABELS = { 1: 'Essentials', 2: 'Shelf Builders', 3: 'Collector Favorites', 4: 'Rare Finds' };
  const label = COLLECTION_TIER_LABELS[Number(tierRaw)];
  if (!label) throw new Error('unmapped tier');
  return label;
}

function printStoneReport(query, sourcePath, result, notFound, nearMatches) {
  console.log(`\n=== Gate 0: ${query} ===`);
  console.log(`Production Master: ${sourcePath}`);
  console.log(`Sheet: ${SHEET_NAME}`);

  if (notFound) {
    console.log(`\nBLOCKER (1)`);
    console.log(`  - BLOCKER: No row found for "${query}" by canonical name or slug`);
    console.log(`    Source: Production Master, columns "Canonical Name" / "Slug"`);
    console.log(`    Why it matters: research cannot be scoped to a stone that cannot be located on the roster.`);
    console.log(`    Fix target: confirm the exact canonical name or slug. Do not guess.`);
    if (nearMatches.length > 0) {
      console.log(`    Possible roster matches (substring match, not confirmed): ${nearMatches.join('; ')}`);
    } else {
      console.log(`    No substring-similar roster entries found.`);
    }
    return { pass: 0, warn: 0, blocker: 1 };
  }

  console.log(`Row: ${result.rowNumber} | Stone ID: ${result.stoneId} | Name: ${result.stoneName} | Slug: ${result.slug}`);

  console.log(`\nPASS (${result.pass.length})`);
  for (const p of result.pass) console.log(`  - ${p}`);

  console.log(`\nWARN (${result.warn.length})`);
  for (const w of result.warn) console.log(`  - ${w}`);

  console.log(`\nBLOCKER (${result.blocker.length})`);
  for (const b of result.blocker) {
    console.log(`  - BLOCKER: ${b.what}`);
    console.log(`    Source: ${b.source}`);
    console.log(`    Why it matters: ${b.why}`);
    console.log(`    Fix target: ${b.fix}`);
  }

  if (result.blocker.length === 0) {
    console.log(`\nResult: PASS${result.warn.length > 0 ? ' WITH WARNINGS' : ''} — OK to begin Gate 1 research.`);
  } else {
    console.log(`\nResult: BLOCKED — do not begin Gate 1 research until the ${result.blocker.length} blocker(s) above are resolved.`);
  }

  return { pass: result.pass.length, warn: result.warn.length, blocker: result.blocker.length };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.stones.length === 0) {
    console.error('Usage: node pipeline/gate0.js --stone <name-or-slug> [--stone <name-or-slug> ...]');
    console.error('       node pipeline/gate0.js --stones <name-or-slug>,<name-or-slug>,...');
    console.error('       node pipeline/gate0.js --stone <name-or-slug> --source <path-to-production-master.xlsx>');
    process.exitCode = 1;
    return;
  }

  let rows, col, missing;
  try {
    ({ rows, col, missing } = loadCatalog(opts.source));
  } catch (err) {
    console.error(`Could not read Production Master: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  if (missing.length > 0) {
    console.error(`\nProduction Master "${SHEET_NAME}" sheet is missing expected column(s), cannot proceed:`);
    for (const m of missing) console.error(`  - ${m}`);
    console.error(`\nGate 0 field map in use (Gate 0 field -> Production Master header):`);
    for (const [field, header] of Object.entries(FIELD_MAP)) {
      console.error(`  - ${field} -> ${header === null ? '(no dedicated column)' : `"${header}"`}`);
    }
    process.exitCode = 1;
    return;
  }

  let totalBlocker = 0;
  const summary = [];
  for (const query of opts.stones) {
    const matches = findStoneRows(rows, col, query);
    if (matches.length === 0) {
      const near = findNearMatches(rows, col, query);
      const counts = printStoneReport(query, opts.source, null, true, near);
      totalBlocker += counts.blocker;
      summary.push({ query, ...counts, status: 'NOT FOUND' });
      continue;
    }
    // Report every matching row (a duplicate name/slug shows up as more than
    // one match here, and is separately flagged as a BLOCKER within each row's
    // own evaluation).
    for (const m of matches) {
      const result = evaluateStone(rows, col, m);
      const counts = printStoneReport(query, opts.source, result, false, []);
      totalBlocker += counts.blocker;
      summary.push({ query, ...counts, status: counts.blocker > 0 ? 'BLOCKED' : (counts.warn > 0 ? 'PASS (warnings)' : 'PASS') });
    }
  }

  console.log(`\n=== Gate 0 Summary ===`);
  for (const s of summary) {
    console.log(`  ${s.query}: ${s.status} — PASS ${s.pass}, WARN ${s.warn}, BLOCKER ${s.blocker}`);
  }

  process.exitCode = totalBlocker > 0 ? 1 : 0;
}

if (require.main === module) {
  main();
}

module.exports = {
  FIELD_MAP, ENERGETIC_ROLES, MATERIAL_TYPES, CHAKRAS, STOP_LANGUAGE_PATTERNS,
  hasStopLanguage, parseArgs, buildGate0ColumnIndex, loadCatalog, findStoneRows,
  findNearMatches, evaluateStone,
};
