'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const XLSX = require('xlsx');
const {
  hasStopLanguage, buildGate0ColumnIndex, loadCatalog, findStoneRows,
  findNearMatches, evaluateStone,
} = require('./gate0');

const HEADER = [
  'Group A | Stone ID', 'Group A | Canonical Name', 'Group D | Slug',
  'Group B | Collection Tier',
  'Group F | Primary Chakra', 'Group F | Secondary Chakra', 'Group F | Styling Chakra',
  'Group F | Material Type', 'Group F | Encyclopedia Energetic Role', 'Group F | Color Energy',
  'Group C | Previous Stone', 'Group C | Previous Slug', 'Group C | Next Stone', 'Group C | Next Slug',
  'Group I | Image Status', 'Group I | Image URL', 'Group I | Image Filename',
  'Group J | Exception / Identity Flag', 'Group J | Exception Review Required', 'Group J | Structured Data Status',
  'Group E | Encyclopedia Production Status',
  'Group K | Blocker', 'Group K | Notes', 'Group K | Production Data Version',
];

function row(overrides) {
  const base = {
    'Stone ID': 'C-0001', 'Canonical Name': 'Test Stone', 'Slug': 'test-stone',
    'Collection Tier': 1,
    'Primary Chakra': 'Heart', 'Secondary Chakra': 'Root', 'Styling Chakra': 'Heart',
    'Material Type': 'Mineral', 'Encyclopedia Energetic Role': 'Grounding', 'Color Energy': 'Earthy Brown',
    'Previous Stone': 'Prev Stone', 'Previous Slug': 'prev-stone', 'Next Stone': 'Next Stone', 'Next Slug': 'next-stone',
    'Image Status': null, 'Image URL': null, 'Image Filename': null,
    'Exception / Identity Flag': null, 'Exception Review Required': null, 'Structured Data Status': 'Unreviewed',
    'Encyclopedia Production Status': 'Not Started',
    'Blocker': null, 'Notes': null, 'Production Data Version': 'v1',
  };
  const fields = { ...base, ...overrides };
  const map = {
    'Stone ID': 0, 'Canonical Name': 1, 'Slug': 2, 'Collection Tier': 3,
    'Primary Chakra': 4, 'Secondary Chakra': 5, 'Styling Chakra': 6,
    'Material Type': 7, 'Encyclopedia Energetic Role': 8, 'Color Energy': 9,
    'Previous Stone': 10, 'Previous Slug': 11, 'Next Stone': 12, 'Next Slug': 13,
    'Image Status': 14, 'Image URL': 15, 'Image Filename': 16,
    'Exception / Identity Flag': 17, 'Exception Review Required': 18, 'Structured Data Status': 19,
    'Encyclopedia Production Status': 20,
    'Blocker': 21, 'Notes': 22, 'Production Data Version': 23,
  };
  const out = new Array(HEADER.length).fill(null);
  for (const [field, idx] of Object.entries(map)) out[idx] = fields[field];
  return out;
}

function buildRowsAndCol(dataRows) {
  const rows = [HEADER, ...dataRows];
  const { index: col, missing } = buildGate0ColumnIndex(rows[0]);
  assert.deepEqual(missing, [], 'fixture header should satisfy all required Gate 0 columns');
  return { rows, col };
}

test('hasStopLanguage does not match ordinary restart/status prose', () => {
  assert.equal(hasStopLanguage('No current research/synthesis file found; restart under current workflow.'), false);
  assert.equal(hasStopLanguage('Resolved 2026-07-05 per Christie: superseded by current workflow.'), false);
});

test('hasStopLanguage matches genuine stop-research language', () => {
  assert.equal(hasStopLanguage('Do not proceed with research until identity is resolved.'), true);
  assert.equal(hasStopLanguage('Research cannot proceed pending locality dispute.'), true);
  assert.equal(hasStopLanguage('Identity conflict between two candidate species.'), true);
});

test('evaluateStone: clean row passes with no blockers', () => {
  const { rows, col } = buildRowsAndCol([row({})]);
  const [match] = findStoneRows(rows, col, 'test-stone');
  const result = evaluateStone(rows, col, match);
  assert.equal(result.blocker.length, 0);
});

test('evaluateStone: duplicate Stone ID is a blocker', () => {
  const { rows, col } = buildRowsAndCol([
    row({ 'Canonical Name': 'Stone A', 'Slug': 'stone-a' }),
    row({ 'Canonical Name': 'Stone B', 'Slug': 'stone-b' }), // same Stone ID C-0001
  ]);
  const [match] = findStoneRows(rows, col, 'stone-a');
  const result = evaluateStone(rows, col, match);
  assert.ok(result.blocker.some(b => /Stone ID "C-0001" is duplicated/.test(b.what)));
});

test('evaluateStone: duplicate Slug is a blocker', () => {
  const { rows, col } = buildRowsAndCol([
    row({ 'Stone ID': 'C-0001', 'Canonical Name': 'Stone A', 'Slug': 'dup-slug' }),
    row({ 'Stone ID': 'C-0002', 'Canonical Name': 'Stone B', 'Slug': 'dup-slug' }),
  ]);
  const [match] = findStoneRows(rows, col, 'Stone A');
  const result = evaluateStone(rows, col, match);
  assert.ok(result.blocker.some(b => /Slug "dup-slug" is duplicated/.test(b.what)));
});

test('evaluateStone: invalid Material Type is a blocker', () => {
  const { rows, col } = buildRowsAndCol([row({ 'Material Type': 'Igneous' })]);
  const [match] = findStoneRows(rows, col, 'test-stone');
  const result = evaluateStone(rows, col, match);
  assert.ok(result.blocker.some(b => /Material Type "Igneous" is not one of the approved/.test(b.what)));
});

test('evaluateStone: blank Material Type is a blocker (cannot route research)', () => {
  const { rows, col } = buildRowsAndCol([row({ 'Material Type': null })]);
  const [match] = findStoneRows(rows, col, 'test-stone');
  const result = evaluateStone(rows, col, match);
  assert.ok(result.blocker.some(b => /Material Type is blank/.test(b.what)));
});

test('evaluateStone: invalid Energetic Role is a blocker', () => {
  const { rows, col } = buildRowsAndCol([row({ 'Encyclopedia Energetic Role': 'Balance' })]);
  const [match] = findStoneRows(rows, col, 'test-stone');
  const result = evaluateStone(rows, col, match);
  assert.ok(result.blocker.some(b => /Encyclopedia Energetic Role "Balance" is not one of the 12 approved roles/.test(b.what)));
});

test('evaluateStone: blank Energetic Role, Color Energy, and Secondary Chakra are warnings, not blockers', () => {
  const { rows, col } = buildRowsAndCol([row({ 'Encyclopedia Energetic Role': null, 'Color Energy': null, 'Secondary Chakra': null })]);
  const [match] = findStoneRows(rows, col, 'test-stone');
  const result = evaluateStone(rows, col, match);
  assert.equal(result.blocker.length, 0);
  assert.ok(result.warn.some(w => /Encyclopedia Energetic Role is blank/.test(w)));
  assert.ok(result.warn.some(w => /Color Energy is blank/.test(w)));
  assert.ok(result.warn.some(w => /Secondary Chakra is blank/.test(w)));
});

test('evaluateStone: Blocker field with non-stop legacy language is a warning, not a blocker', () => {
  const { rows, col } = buildRowsAndCol([
    row({ 'Blocker': 'No current research/synthesis file found; restart under current workflow.' }),
  ]);
  const [match] = findStoneRows(rows, col, 'test-stone');
  const result = evaluateStone(rows, col, match);
  assert.equal(result.blocker.length, 0);
  assert.ok(result.warn.some(w => /does not contain stop-research language/.test(w)));
});

test('evaluateStone: Blocker field with genuine stop language is a blocker', () => {
  const { rows, col } = buildRowsAndCol([
    row({ 'Blocker': 'Do not proceed with research until locality is confirmed.' }),
  ]);
  const [match] = findStoneRows(rows, col, 'test-stone');
  const result = evaluateStone(rows, col, match);
  assert.ok(result.blocker.some(b => /stop-research language/.test(b.what)));
});

test('evaluateStone: partial navigation pointer (name without slug) is a blocker', () => {
  const { rows, col } = buildRowsAndCol([row({ 'Previous Slug': null })]);
  const [match] = findStoneRows(rows, col, 'test-stone');
  const result = evaluateStone(rows, col, match);
  assert.ok(result.blocker.some(b => /Previous navigation has a name but no slug/.test(b.what)));
});

test('evaluateStone: fully blank navigation (roster boundary) is a warning, not a blocker', () => {
  const { rows, col } = buildRowsAndCol([row({ 'Previous Stone': null, 'Previous Slug': null })]);
  const [match] = findStoneRows(rows, col, 'test-stone');
  const result = evaluateStone(rows, col, match);
  assert.equal(result.blocker.length, 0);
  assert.ok(result.warn.some(w => /Previous navigation is blank/.test(w)));
});

test('findStoneRows matches by canonical name or slug, case-insensitively', () => {
  const { rows, col } = buildRowsAndCol([row({ 'Canonical Name': 'Ocean Jasper', 'Slug': 'ocean-jasper' })]);
  assert.equal(findStoneRows(rows, col, 'OCEAN JASPER').length, 1);
  assert.equal(findStoneRows(rows, col, 'ocean-jasper').length, 1);
  assert.equal(findStoneRows(rows, col, 'nonexistent-stone').length, 0);
});

test('findNearMatches returns substring candidates without asserting identity', () => {
  const { rows, col } = buildRowsAndCol([row({ 'Canonical Name': 'Ocean Jasper', 'Slug': 'ocean-jasper' })]);
  const near = findNearMatches(rows, col, 'ocean');
  assert.ok(near.some(n => n.includes('Ocean Jasper')));
});

test('loadCatalog reports missing expected headers instead of guessing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate0-test-'));
  const wb = XLSX.utils.book_new();
  const badHeader = ['Group A | Stone ID', 'Group A | Canonical Name']; // most Gate 0 columns absent
  const sheet = XLSX.utils.aoa_to_sheet([badHeader, ['C-0001', 'Test Stone']]);
  XLSX.utils.book_append_sheet(wb, sheet, 'Catalog Master');
  const file = path.join(dir, 'fixture.xlsx');
  XLSX.writeFile(wb, file);
  try {
    const { missing } = loadCatalog(file);
    assert.ok(missing.includes('Slug'));
    assert.ok(missing.includes('Material Type'));
    assert.ok(missing.includes('Encyclopedia Energetic Role'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
