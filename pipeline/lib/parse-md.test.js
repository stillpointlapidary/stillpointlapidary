'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseReachFor } = require('./parse-md');

function block(n) {
  let out = '';
  for (let i = 1; i <= n; i++) {
    out += `## Reason ${i}\nDescription for reason ${i}.\n\n`;
  }
  return out;
}

test('parseReachFor accepts 5 rows (existing baseline case)', () => {
  const result = parseReachFor(block(5));
  assert.equal(result.length, 5);
});

test('parseReachFor accepts 3 rows', () => {
  const result = parseReachFor(block(3));
  assert.equal(result.length, 3);
});

test('parseReachFor accepts 4 rows', () => {
  const result = parseReachFor(block(4));
  assert.equal(result.length, 4);
});

test('parseReachFor rejects 2 rows', () => {
  assert.throws(() => parseReachFor(block(2)), /expected 3-5 rows, found 2/);
});

test('parseReachFor rejects 6 rows', () => {
  assert.throws(() => parseReachFor(block(6)), /expected 3-5 rows, found 6/);
});

test('parseReachFor rejects duplicate labels', () => {
  const text = '## Same Label\nFirst description.\n\n## Same Label\nSecond description.\n\n## Third\nThird description.\n';
  assert.throws(() => parseReachFor(text), /duplicate label "Same Label"/);
});

test('parseReachFor rejects an empty description', () => {
  const text = '## Reason 1\nDescription one.\n\n## Reason 2\n\n## Reason 3\nDescription three.\n';
  assert.throws(() => parseReachFor(text), /label or description is empty/);
});
