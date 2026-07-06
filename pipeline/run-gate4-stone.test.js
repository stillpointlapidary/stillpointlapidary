'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const {
  parseArgs, resolveMdPath, resolveResearchRecordPath, resolvePacketPath,
  buildPmUpdatePayload, parseImportReportLine, parsePmUpdateResult,
  formatReport,
} = require('./run-gate4-stone');
const { CANONICAL_MDS_ROOT, RESEARCH_ROOT, PIPELINE_OUTPUT_DIR, PRODUCTION_MASTER_PATH } = require('./lib/paths');

test('parseArgs defaults apply to false', () => {
  const opts = parseArgs(['--stone', 'red-jasper']);
  assert.equal(opts.stone, 'red-jasper');
  assert.equal(opts.apply, false);
});

test('parseArgs sets apply to true when --apply is present, in either order', () => {
  assert.equal(parseArgs(['--stone', 'red-jasper', '--apply']).apply, true);
  assert.equal(parseArgs(['--apply', '--stone', 'red-jasper']).apply, true);
});

test('parseArgs leaves stone null when not provided', () => {
  assert.equal(parseArgs(['--apply']).stone, null);
});

test('resolveMdPath builds the exact canonical MD path from a slug', () => {
  assert.equal(resolveMdPath('red-jasper'), path.join(CANONICAL_MDS_ROOT, 'red-jasper.md'));
});

test('resolveResearchRecordPath builds the exact Stone Records path from a slug', () => {
  assert.equal(resolveResearchRecordPath('red-jasper'), path.join(RESEARCH_ROOT, 'Stone Records', 'red-jasper-research.md'));
});

test('resolvePacketPath builds the exact gitignored pipeline/output path from a slug', () => {
  assert.equal(resolvePacketPath('red-jasper'), path.join(PIPELINE_OUTPUT_DIR, 'red-jasper.packet.json'));
});

test('buildPmUpdatePayload only ever requests the default-publish status, never a hold state', () => {
  const payload = buildPmUpdatePayload('C-0099', 'update', '2026-07-06');
  assert.equal(payload.production_master_path, PRODUCTION_MASTER_PATH);
  assert.equal(payload.stone_id, 'C-0099');
  assert.equal(payload.updates['Encyclopedia Production Status'], 'Full Entry Live');
  assert.match(payload.updates.Notes, /Full Entry Live — Gate 4 atomic import \(update\)/);
  assert.deepEqual(Object.keys(payload.updates).sort(), ['Encyclopedia Production Status', 'Notes'].sort());
});

test('parseImportReportLine extracts operation and published from the import-stone.js report line', () => {
  const stdout = "\n--- Import Report ---\nimported and verified pending  Red Jasper  (C-0099)  [update]  [published=true, stones.enc_production_status='Full Entry Live']\n";
  assert.deepEqual(parseImportReportLine(stdout), { operation: 'update', published: true });
});

test('parseImportReportLine recognizes an insert operation and a false published value', () => {
  const stdout = "imported and verified pending  Rose Quartz  (C-0001)  [insert]  [published=false, stones.enc_production_status='Supabase Entered']";
  assert.deepEqual(parseImportReportLine(stdout), { operation: 'insert', published: false });
});

test('parseImportReportLine returns null when the report line is not present', () => {
  assert.equal(parseImportReportLine('held: something went wrong'), null);
});

test('parsePmUpdateResult recognizes PASS and treats anything else as FAIL', () => {
  assert.equal(parsePmUpdateResult('...\nRESULT: PASS'), 'PASS');
  assert.equal(parsePmUpdateResult('...\nRESULT: FAIL — mismatch'), 'FAIL');
  assert.equal(parsePmUpdateResult('garbage output'), 'FAIL');
});

test('formatReport includes every required field label and the No commit / No deploy footer', () => {
  const report = formatReport({
    overall: 'PASS',
    stone: 'Red Jasper / C-0099 / red-jasper',
    researchRecord: 'found',
    canonicalMd: 'found',
    structuredExport: 'PASS',
    existingRow: 'yes',
    reconciliation: 'not needed',
    packet: '/path/to/red-jasper.packet.json',
    validation: 'PASS',
    precheck: 'PASS',
    import: 'update, published=true',
    verifyStone: 'PASS',
    productionMasterUpdate: 'PASS',
    blockerReason: null,
  });
  const lines = report.split('\n');
  assert.equal(lines[0], 'PASS');
  assert.equal(lines[lines.length - 1], 'No deploy');
  assert.equal(lines[lines.length - 2], 'No commit');
  for (const label of [
    'Stone', 'Research record', 'Canonical MD', 'Structured export', 'Existing row',
    'Reconciliation', 'Packet', 'Validation', 'Precheck', 'Import', 'Verify-stone',
    'Production Master update',
  ]) {
    assert.ok(report.includes(`${label}: `), `expected report to contain "${label}: "`);
  }
  assert.ok(!report.includes('Blocker:'));
});

test('formatReport surfaces the blocker reason and marks unreached steps', () => {
  const report = formatReport({
    overall: 'BLOCKED',
    stone: 'Red Jasper / C-0099 / red-jasper',
    researchRecord: 'found',
    canonicalMd: null,
    structuredExport: null,
    existingRow: null,
    reconciliation: null,
    packet: null,
    validation: null,
    precheck: null,
    import: null,
    verifyStone: null,
    productionMasterUpdate: null,
    blockerReason: 'Canonical MD not found at ...',
  });
  assert.equal(report.split('\n')[0], 'BLOCKED');
  assert.ok(report.includes('Canonical MD: not reached'));
  assert.ok(report.includes('Blocker: Canonical MD not found at ...'));
});
