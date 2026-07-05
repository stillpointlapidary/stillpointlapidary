'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const XLSX = require('xlsx');
const { exportStructuredValues, stripGroupPrefix } = require('./export-structured-values');

test('stripGroupPrefix removes the "Group X — Label | " prefix', () => {
  assert.equal(stripGroupPrefix('Group A — Roster Identity | Stone ID'), 'Stone ID');
  assert.equal(stripGroupPrefix('Slug'), 'Slug');
});

function writeFixtureWorkbook(rows) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'structured-values-test-'));
  const wb = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, sheet, 'Catalog Master');
  const file = path.join(dir, 'fixture.xlsx');
  XLSX.writeFile(wb, file);
  return { dir, file };
}

const HEADER = [
  'Group A | Stone ID', 'Group A | Canonical Name', 'Group D | Slug',
  'Group B | Collection Tier', 'Group C | Previous Stone', 'Group C | Previous Slug',
  'Group C | Next Stone', 'Group C | Next Slug',
  'Group F | Primary Chakra', 'Group F | Secondary Chakra', 'Group F | Element',
  'Group F | Zodiac', 'Group F | Material Type', 'Group K | Production Data Version',
];

test('exportStructuredValues produces a stone_id-keyed, gitignore-friendly export', () => {
  const rows = [
    HEADER,
    ['C-0001', 'Test Stone', 'test-stone', 1, 'Prev Stone', 'prev-stone', 'Next Stone', 'next-stone',
      'Root', null, 'Earth', 'Aries', 'Mineral', 'v1'],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null], // blank spacer row
  ];
  const { dir, file } = writeFixtureWorkbook(rows);
  const out = path.join(dir, 'out.json');
  try {
    const result = exportStructuredValues({ source: file, out });
    assert.equal(result._warning, 'GENERATED FILE — do not hand-edit. Source is the canonical Production Master.');
    assert.ok(fs.existsSync(out));
    const written = JSON.parse(fs.readFileSync(out, 'utf8'));
    assert.deepEqual(written.stones['C-0001'], {
      stone_id: 'C-0001',
      slug: 'test-stone',
      stone_name: 'Test Stone',
      collection_label: 'Essentials',
      chakra_primary: 'Root',
      chakra_secondary: null,
      element: 'Earth',
      zodiac: 'Aries',
      material_type: 'Mineral',
      nav_prev_slug: 'prev-stone',
      nav_prev_name: 'Prev Stone',
      nav_next_slug: 'next-stone',
      nav_next_name: 'Next Stone',
      production_data_version: 'production-master',
    });
    assert.equal(Object.keys(written.stones).length, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('exportStructuredValues halts on an unmapped Collection Tier', () => {
  const rows = [
    HEADER,
    ['C-0002', 'Bad Tier Stone', 'bad-tier', 99, 'A', 'a', 'B', 'b', 'Root', null, 'Earth', 'Aries', 'Mineral', 'v1'],
  ];
  const { dir, file } = writeFixtureWorkbook(rows);
  const out = path.join(dir, 'out.json');
  const originalExit = process.exit;
  let exitCode = null;
  process.exit = (code) => { exitCode = code; throw new Error('__EXIT__'); };
  try {
    assert.throws(() => exportStructuredValues({ source: file, out }), /__EXIT__/);
    assert.equal(exitCode, 2);
  } finally {
    process.exit = originalExit;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
