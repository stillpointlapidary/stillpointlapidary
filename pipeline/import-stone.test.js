'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { describePublishState } = require('./import-stone');

test('describePublishState reports the default publish path', () => {
  assert.equal(
    describePublishState(true, 'Full Entry Live'),
    "published=true, stones.enc_production_status='Full Entry Live'"
  );
});

test('describePublishState reports an explicit unpublished hold', () => {
  assert.equal(
    describePublishState(false, 'Supabase Entered'),
    "published=false, stones.enc_production_status='Supabase Entered'"
  );
});
