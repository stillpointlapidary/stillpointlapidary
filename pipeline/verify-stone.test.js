'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { expectedProductionStatus, mismatch, compareField } = require('./verify-stone');

// ---------------------------------------------------------------------------
// enc_stone_content.published and stones.enc_production_status are set
// together, in the same transaction, by import_stone_atomic.sql, and must
// never disagree. This is the pure mapping the verifier checks against.
// ---------------------------------------------------------------------------

test('expectedProductionStatus is "Full Entry Live" for the default publish path', () => {
  assert.equal(expectedProductionStatus(true), 'Full Entry Live');
});

test('expectedProductionStatus is "Supabase Entered" for an explicit unpublished hold', () => {
  assert.equal(expectedProductionStatus(false), 'Supabase Entered');
});

test('compareField reports no error when both values are null', () => {
  const errors = [];
  compareField(errors, 'field', null, null);
  assert.deepEqual(errors, []);
});

test('compareField reports a mismatch when values differ', () => {
  const errors = [];
  compareField(errors, 'field', 'expected', 'actual');
  assert.equal(errors.length, 1);
  assert.match(errors[0], /MISMATCH  field/);
});

test('mismatch formats expected/actual as JSON', () => {
  const msg = mismatch('enc_stone_content.published', true, false);
  assert.match(msg, /expected: true/);
  assert.match(msg, /actual:   false/);
});
