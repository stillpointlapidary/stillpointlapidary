'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validatePacket } = require('./validate-packet');

function reachRows(n) {
  const rows = [];
  for (let i = 1; i <= n; i++) {
    rows.push({ label: `Reason ${i}`, description: `Description ${i}`, display_order: i });
  }
  return rows;
}

function reachErrors(reach) {
  const errors = validatePacket({ enc_reach_for: reach }, null);
  return errors.filter(e => e.startsWith('enc_reach_for'));
}

test('validatePacket accepts 5 reach-for rows (existing baseline case)', () => {
  assert.deepEqual(reachErrors(reachRows(5)), []);
});

test('validatePacket accepts 3 reach-for rows', () => {
  assert.deepEqual(reachErrors(reachRows(3)), []);
});

test('validatePacket accepts 4 reach-for rows', () => {
  assert.deepEqual(reachErrors(reachRows(4)), []);
});

test('validatePacket rejects 2 reach-for rows', () => {
  const errors = reachErrors(reachRows(2));
  assert.ok(errors.some(e => e.includes('expected 3-5 rows, found 2')));
});

test('validatePacket rejects 6 reach-for rows', () => {
  const errors = reachErrors(reachRows(6));
  assert.ok(errors.some(e => e.includes('expected 3-5 rows, found 6')));
});

test('validatePacket rejects duplicate reach-for labels', () => {
  const rows = reachRows(3);
  rows[1].label = rows[0].label;
  const errors = reachErrors(rows);
  assert.ok(errors.some(e => e.includes('duplicate label values')));
});

test('validatePacket rejects an empty reach-for label or description', () => {
  const rows = reachRows(3);
  rows[2].description = '';
  const errors = reachErrors(rows);
  assert.ok(errors.some(e => e.includes('label or description is empty')));
});
