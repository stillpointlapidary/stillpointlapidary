#!/usr/bin/env node
'use strict';

/**
 * Structured Values Export — Production Master → generated JSON
 *
 * Reads the canonical Production Master workbook directly and writes a
 * generated, gitignored JSON file that packet generation uses as the
 * required source for locked structured values on first-time imports.
 *
 * This script never writes back to the Production Master and never touches
 * Supabase. It is a read-only export.
 *
 * Usage:
 *   node pipeline/export-structured-values.js
 *   node pipeline/export-structured-values.js --source <path> --out <path>
 *
 * Requires: npm install --save-dev xlsx
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const DEFAULT_SOURCE = 'C:\\Users\\chris\\Documents\\Still Point Lapidary\\Encyclopedia\\Production Data\\Still-Point-Lapidary-Production-Master.xlsx';
const DEFAULT_OUT = path.join(__dirname, 'data', 'structured-values.generated.json');
const SHEET_NAME = 'Catalog Master';

// Documented in Encyclopedia/Production Data/PRODUCTION-DATA-README.md section 4
// ("Catalog Counts"). This is a fixed, documented mapping — not inferred.
const COLLECTION_TIER_LABELS = {
  1: 'Essentials',
  2: 'Shelf Builders',
  3: 'Collector Favorites',
  4: 'Rare Finds',
};

// Column names as they appear after the "Group X — Label | " prefix is stripped.
const REQUIRED_COLUMNS = [
  'Stone ID',
  'Canonical Name',
  'Slug',
  'Collection Tier',
  'Primary Chakra',
  'Secondary Chakra',
  'Element',
  'Zodiac',
  'Material Type',
  'Previous Stone',
  'Previous Slug',
  'Next Stone',
  'Next Slug',
  'Production Data Version',
];

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { source: DEFAULT_SOURCE, out: DEFAULT_OUT };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source') opts.source = args[++i];
    if (args[i] === '--out') opts.out = args[++i];
  }
  return opts;
}

function stripGroupPrefix(header) {
  const parts = String(header).split('|');
  return parts[parts.length - 1].trim();
}

function loadWorkbook(sourcePath) {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Production Master not found at: ${sourcePath}\nExport stopped.`);
    process.exit(2);
  }
  let workbook;
  try {
    workbook = XLSX.readFile(sourcePath);
  } catch (err) {
    console.error(`Failed to read Production Master workbook: ${err.message}\nExport stopped.`);
    process.exit(2);
  }
  if (!workbook.SheetNames.includes(SHEET_NAME)) {
    console.error(`Production Master is missing the expected sheet "${SHEET_NAME}".\nFound sheets: ${workbook.SheetNames.join(', ')}\nExport stopped.`);
    process.exit(2);
  }
  return workbook;
}

function buildColumnIndex(headerRow) {
  const index = {};
  headerRow.forEach((cell, i) => {
    if (cell == null) return;
    index[stripGroupPrefix(cell)] = i;
  });
  const missing = REQUIRED_COLUMNS.filter(name => !(name in index));
  if (missing.length > 0) {
    console.error(`Production Master "${SHEET_NAME}" sheet is missing expected column(s): ${missing.join(', ')}\nColumn names do not clearly map to the required fields. Export stopped.`);
    process.exit(2);
  }
  return index;
}

function normalize(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }
  return value;
}

function resolveCollectionLabel(tierValue, stoneId) {
  const tier = normalize(tierValue);
  if (tier === null) return null;
  const label = COLLECTION_TIER_LABELS[Number(tier)];
  if (!label) {
    console.error(`Stone ${stoneId}: Collection Tier "${tierValue}" has no documented label mapping (expected 1-4).\nExport stopped.`);
    process.exit(2);
  }
  return label;
}

function exportStructuredValues(opts) {
  const workbook = loadWorkbook(opts.source);
  const sheet = workbook.Sheets[SHEET_NAME];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  if (rows.length < 2) {
    console.error(`Production Master "${SHEET_NAME}" sheet has no data rows.\nExport stopped.`);
    process.exit(2);
  }

  const col = buildColumnIndex(rows[0]);
  const stones = {};

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const stoneId = normalize(row[col['Stone ID']]);
    if (!stoneId) continue; // blank spacer row

    if (stones[stoneId]) {
      console.error(`Duplicate Stone ID "${stoneId}" found in Production Master at row ${r + 1}.\nExport stopped.`);
      process.exit(2);
    }

    stones[stoneId] = {
      stone_id: stoneId,
      slug: normalize(row[col['Slug']]),
      stone_name: normalize(row[col['Canonical Name']]),
      collection_label: resolveCollectionLabel(row[col['Collection Tier']], stoneId),
      chakra_primary: normalize(row[col['Primary Chakra']]),
      chakra_secondary: normalize(row[col['Secondary Chakra']]),
      element: normalize(row[col['Element']]),
      zodiac: normalize(row[col['Zodiac']]),
      material_type: normalize(row[col['Material Type']]),
      nav_prev_slug: normalize(row[col['Previous Slug']]),
      nav_prev_name: normalize(row[col['Previous Stone']]),
      nav_next_slug: normalize(row[col['Next Slug']]),
      nav_next_name: normalize(row[col['Next Stone']]),
      production_data_version: normalize(row[col['Production Data Version']]),
    };
  }

  const output = {
    _warning: 'GENERATED FILE — do not hand-edit. Source is the canonical Production Master.',
    _source: opts.source,
    _sheet: SHEET_NAME,
    _generated_at: new Date().toISOString(),
    stones,
  };

  fs.mkdirSync(path.dirname(opts.out), { recursive: true });
  fs.writeFileSync(opts.out, JSON.stringify(output, null, 2));
  console.log(`Structured values exported: ${opts.out}`);
  console.log(`Stones exported: ${Object.keys(stones).length}`);
  return output;
}

if (require.main === module) {
  const opts = parseArgs();
  exportStructuredValues(opts);
}

module.exports = { exportStructuredValues, stripGroupPrefix };
