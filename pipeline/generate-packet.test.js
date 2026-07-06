'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { parseArgs, resolvePublished, resolveImageAlt, resolveOutPath } = require('./generate-packet');
const { PIPELINE_OUTPUT_DIR } = require('./lib/paths');

// ---------------------------------------------------------------------------
// Default Gate 4 path publishes in the same pass; --hold is the explicit,
// Christie/Dustin-requested unpublished-import exception
// (ENCYCLOPEDIA-PRODUCTION-WORKFLOW.md §2).
// ---------------------------------------------------------------------------

test('resolvePublished defaults to true when --hold is not passed', () => {
  assert.equal(resolvePublished({ hold: false }), true);
});

test('resolvePublished is false when --hold is passed', () => {
  assert.equal(resolvePublished({ hold: true }), false);
});

test('parseArgs defaults hold to false', () => {
  const opts = parseArgs(['--md', 'tests/fixtures/rose-quartz.md']);
  assert.equal(opts.hold, false);
  assert.equal(opts.md, 'tests/fixtures/rose-quartz.md');
});

test('parseArgs sets hold to true when --hold is present', () => {
  const opts = parseArgs(['--md', 'tests/fixtures/rose-quartz.md', '--hold']);
  assert.equal(opts.hold, true);
});

test('parseArgs sets hold to true regardless of --hold position', () => {
  const opts = parseArgs(['--hold', '--md', 'tests/fixtures/rose-quartz.md', '--out', 'x.json']);
  assert.equal(opts.hold, true);
  assert.equal(opts.md, 'tests/fixtures/rose-quartz.md');
  assert.equal(opts.out, 'x.json');
});

// ---------------------------------------------------------------------------
// image_alt interim behavior (Christie-approved 2026-07-05): not a blocker at
// any gate. An existing approved value is preserved; otherwise a generic
// fallback is used until real photo QA supplies specimen-specific alt text.
// ---------------------------------------------------------------------------

test('resolveImageAlt preserves an existing approved image_alt', () => {
  const result = resolveImageAlt('Ocean Jasper', 'Polished Ocean Jasper sphere with green and cream orbicular pattern');
  assert.deepEqual(result, {
    value: 'Polished Ocean Jasper sphere with green and cream orbicular pattern',
    isFallback: false,
  });
});

test('resolveImageAlt falls back to a generic description when no existing value', () => {
  const result = resolveImageAlt('Ocean Jasper', null);
  assert.deepEqual(result, {
    value: 'Ocean Jasper specimen for the Still Point Lapidary encyclopedia.',
    isFallback: true,
  });
});

test('resolveImageAlt falls back when existing value is undefined', () => {
  const result = resolveImageAlt('Ocean Jasper', undefined);
  assert.equal(result.isFallback, true);
});

// ---------------------------------------------------------------------------
// Output path (2026-07-06 cleanup): default output must never land next to
// the source MD or the repo root — only explicit --out should override it.
// ---------------------------------------------------------------------------

test('resolveOutPath defaults to pipeline/output/, not the MD directory or repo root', () => {
  const result = resolveOutPath({}, 'red-jasper');
  assert.equal(result, path.join(PIPELINE_OUTPUT_DIR, 'red-jasper.packet.json'));
});

test('resolveOutPath honors an explicit --out over the default', () => {
  const result = resolveOutPath({ out: 'somewhere/else.json' }, 'red-jasper');
  assert.equal(result, 'somewhere/else.json');
});
