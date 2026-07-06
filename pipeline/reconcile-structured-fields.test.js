'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  expectedValues, diffFields, resolveStoneId, reconcileStone, isBlank, RECONCILE_FIELDS,
} = require('./reconcile-structured-fields');

test('expectedValues derives energetic_role_icon from energetic_role, not an export column', () => {
  const exportRow = {
    chakra_primary: 'Root', chakra_secondary: null, element: 'Earth', zodiac: 'Aries',
    material_type: 'Mineral', energetic_role: 'Grounding', color_energy: 'Earthy Brown',
    nav_prev_slug: 'a', nav_prev_name: 'A', nav_next_slug: 'b', nav_next_name: 'B',
  };
  const expected = expectedValues(exportRow);
  assert.equal(expected.energetic_role_icon, 'icon-grounding');
  assert.equal(expected.chakra_primary, 'Root');
  assert.equal(expected.nav_next_name, 'B');
});

test('expectedValues returns null energetic_role_icon when energetic_role is missing', () => {
  const expected = expectedValues({});
  assert.equal(expected.energetic_role_icon, null);
});

test('diffFields reports only fields that differ, in RECONCILE_FIELDS only', () => {
  const existing = {
    chakra_primary: 'Root', chakra_secondary: 'Sacral', element: 'Earth', zodiac: 'Aries',
    material_type: 'Mineral', energetic_role: 'Grounding', energetic_role_icon: 'icon-grounding',
    color_energy: 'Earthy Brown', nav_prev_slug: 'a', nav_prev_name: 'A',
    nav_next_slug: 'b', nav_next_name: 'B',
    signature_line: 'unrelated public-copy value that must never be touched',
  };
  const expected = expectedValues({
    chakra_primary: 'Root', chakra_secondary: null, element: 'Earth', zodiac: 'Aries',
    material_type: 'Mineral', energetic_role: 'Grounding', color_energy: 'Earthy Brown',
    nav_prev_slug: 'a', nav_prev_name: 'A', nav_next_slug: 'b', nav_next_name: 'B',
  });
  const diffs = diffFields(existing, expected);
  assert.deepEqual(diffs, [{
    field: 'chakra_secondary', current: 'Sacral', expected: null, blocked: true,
  }]);
  for (const d of diffs) {
    assert.ok(RECONCILE_FIELDS.includes(d.field));
  }
});

test('diffFields reports no diffs when every reconcile field already matches', () => {
  const row = {
    chakra_primary: 'Root', chakra_secondary: null, element: 'Earth', zodiac: 'Aries',
    material_type: 'Mineral', energetic_role: 'Grounding', energetic_role_icon: 'icon-grounding',
    color_energy: 'Earthy Brown', nav_prev_slug: 'a', nav_prev_name: 'A',
    nav_next_slug: 'b', nav_next_name: 'B',
  };
  const expected = expectedValues(row);
  assert.deepEqual(diffFields(row, expected), []);
});

test('resolveStoneId matches by stone_id key or by slug', () => {
  const exportStones = {
    'C-0099': { stone_id: 'C-0099', slug: 'red-jasper' },
  };
  assert.equal(resolveStoneId('C-0099', exportStones), 'C-0099');
  assert.equal(resolveStoneId('red-jasper', exportStones), 'C-0099');
  assert.equal(resolveStoneId('not-a-stone', exportStones), null);
});

test('isBlank treats null, undefined, and empty string as blank; everything else as populated', () => {
  assert.equal(isBlank(null), true);
  assert.equal(isBlank(undefined), true);
  assert.equal(isBlank(''), true);
  assert.equal(isBlank('Root'), false);
  assert.equal(isBlank(0), false);
  assert.equal(isBlank(false), false);
});

const fullRow = {
  chakra_primary: 'Root', chakra_secondary: null, element: 'Earth', zodiac: 'Aries',
  material_type: 'Mineral', energetic_role: 'Grounding', energetic_role_icon: 'icon-grounding',
  color_energy: 'Earthy Brown', nav_prev_slug: 'a', nav_prev_name: 'A',
  nav_next_slug: 'b', nav_next_name: 'B',
};

test('diffFields flags blank-PM-over-populated-Supabase diffs as blocked', () => {
  const existing = { ...fullRow, element: 'Air' };
  const expected = { ...fullRow, element: null };
  const diffs = diffFields(existing, expected);
  assert.deepEqual(diffs, [{
    field: 'element', current: 'Air', expected: null, blocked: true,
  }]);
});

test('diffFields does not flag a populated-PM-over-stale-populated-Supabase diff as blocked', () => {
  const existing = { ...fullRow, element: 'Air' };
  const expected = { ...fullRow, element: 'Fire' };
  const diffs = diffFields(existing, expected);
  assert.deepEqual(diffs, [{
    field: 'element', current: 'Air', expected: 'Fire', blocked: false,
  }]);
});

test('diffFields does not flag a populated-PM-over-blank-Supabase diff as blocked', () => {
  const existing = { ...fullRow, element: null };
  const expected = { ...fullRow, element: 'Fire' };
  const diffs = diffFields(existing, expected);
  assert.deepEqual(diffs, [{
    field: 'element', current: null, expected: 'Fire', blocked: false,
  }]);
});

test('diffFields reports no diff when both PM and Supabase are blank for a field', () => {
  const existing = { ...fullRow, element: null };
  const expected = { ...fullRow, element: null };
  assert.deepEqual(diffFields(existing, expected), []);
});

// --- reconcileStone integration tests against a fake Supabase client ---

function fakeSupabase({ existingRow, updateError = null } = {}) {
  const updateCalls = [];
  const supabase = {
    from() {
      return {
        select() {
          return {
            eq() {
              return {
                async single() {
                  if (!existingRow) return { data: null, error: { message: 'not found' } };
                  return { data: existingRow, error: null };
                },
              };
            },
          };
        },
        update(payload) {
          updateCalls.push(payload);
          return {
            eq() {
              return { error: updateError };
            },
          };
        },
      };
    },
  };
  return { supabase, updateCalls };
}

const baseExportRow = {
  stone_id: 'C-0060',
  slug: 'unakite',
  stone_name: 'Unakite',
  chakra_primary: 'Heart',
  chakra_secondary: null,
  element: null,
  zodiac: null,
  material_type: 'Rock',
  energetic_role: null,
  color_energy: null,
  nav_prev_slug: 'ulexite',
  nav_prev_name: 'Ulexite',
  nav_next_slug: 'unicorn-stone',
  nav_next_name: 'Unicorn Stone',
};

test('reconcileStone: blank PM value + populated Supabase value = BLOCKED, no apply, in dry-run', async () => {
  const existingRow = {
    stone_id: 'C-0060',
    chakra_primary: 'Heart',
    chakra_secondary: null,
    element: 'Earth', // populated live value; PM export has element: null
    zodiac: null,
    material_type: 'Rock',
    energetic_role: null,
    energetic_role_icon: null,
    color_energy: null,
    nav_prev_slug: 'ulexite',
    nav_prev_name: 'Ulexite',
    nav_next_slug: 'unicorn-stone',
    nav_next_name: 'Unicorn Stone',
  };
  const { supabase, updateCalls } = fakeSupabase({ existingRow });
  const result = await reconcileStone(supabase, 'C-0060', baseExportRow, false);
  assert.equal(result.status, 'blocked');
  assert.equal(result.slug, 'unakite');
  assert.equal(result.stoneName, 'Unakite');
  assert.deepEqual(result.blocked, [{
    field: 'element', current: 'Earth', expected: null, blocked: true,
  }]);
  assert.equal(updateCalls.length, 0);
});

test('reconcileStone: blank PM value + populated Supabase value = BLOCKED, no apply, with --apply', async () => {
  const existingRow = {
    stone_id: 'C-0060',
    chakra_primary: 'Heart',
    chakra_secondary: null,
    element: 'Earth',
    zodiac: null,
    material_type: 'Rock',
    energetic_role: null,
    energetic_role_icon: null,
    color_energy: null,
    nav_prev_slug: 'ulexite',
    nav_prev_name: 'Ulexite',
    nav_next_slug: 'unicorn-stone',
    nav_next_name: 'Unicorn Stone',
  };
  const { supabase, updateCalls } = fakeSupabase({ existingRow });
  const result = await reconcileStone(supabase, 'C-0060', baseExportRow, true);
  assert.equal(result.status, 'blocked');
  assert.equal(updateCalls.length, 0, 'apply must never write when a field is blocked');
});

test('reconcileStone: populated PM value + stale populated Supabase value = normal diff/apply behavior', async () => {
  const existingRow = {
    stone_id: 'C-0060',
    chakra_primary: 'Root', // stale — PM export says 'Heart'
    chakra_secondary: null,
    element: null,
    zodiac: null,
    material_type: 'Rock',
    energetic_role: null,
    energetic_role_icon: null,
    color_energy: null,
    nav_prev_slug: 'ulexite',
    nav_prev_name: 'Ulexite',
    nav_next_slug: 'unicorn-stone',
    nav_next_name: 'Unicorn Stone',
  };

  const dryRun = fakeSupabase({ existingRow });
  const dryResult = await reconcileStone(dryRun.supabase, 'C-0060', baseExportRow, false);
  assert.equal(dryResult.status, 'diff');
  assert.deepEqual(dryResult.diffs, [{
    field: 'chakra_primary', current: 'Root', expected: 'Heart', blocked: false,
  }]);
  assert.equal(dryRun.updateCalls.length, 0);

  const apply = fakeSupabase({ existingRow });
  const applyResult = await reconcileStone(apply.supabase, 'C-0060', baseExportRow, true);
  assert.equal(applyResult.status, 'applied');
  assert.equal(apply.updateCalls.length, 1);
  assert.deepEqual(apply.updateCalls[0], { chakra_primary: 'Heart' });
});

test('reconcileStone: both blank = in-sync, no diff, no apply', async () => {
  const existingRow = {
    stone_id: 'C-0060',
    chakra_primary: 'Heart',
    chakra_secondary: null,
    element: null,
    zodiac: null,
    material_type: 'Rock',
    energetic_role: null,
    energetic_role_icon: null,
    color_energy: null,
    nav_prev_slug: 'ulexite',
    nav_prev_name: 'Ulexite',
    nav_next_slug: 'unicorn-stone',
    nav_next_name: 'Unicorn Stone',
  };
  const { supabase, updateCalls } = fakeSupabase({ existingRow });
  const result = await reconcileStone(supabase, 'C-0060', baseExportRow, true);
  assert.equal(result.status, 'in-sync');
  assert.equal(updateCalls.length, 0);
});

test('reconcileStone: populated PM value + blank Supabase value = allowed, applies', async () => {
  const existingRow = {
    stone_id: 'C-0060',
    chakra_primary: 'Heart',
    chakra_secondary: null,
    element: null, // blank live value; PM export will supply a populated one
    zodiac: null,
    material_type: 'Rock',
    energetic_role: null,
    energetic_role_icon: null,
    color_energy: null,
    nav_prev_slug: 'ulexite',
    nav_prev_name: 'Ulexite',
    nav_next_slug: 'unicorn-stone',
    nav_next_name: 'Unicorn Stone',
  };
  const exportRow = { ...baseExportRow, element: 'Earth' };

  const dryRun = fakeSupabase({ existingRow });
  const dryResult = await reconcileStone(dryRun.supabase, 'C-0060', exportRow, false);
  assert.equal(dryResult.status, 'diff');
  assert.deepEqual(dryResult.diffs, [{
    field: 'element', current: null, expected: 'Earth', blocked: false,
  }]);

  const apply = fakeSupabase({ existingRow });
  const applyResult = await reconcileStone(apply.supabase, 'C-0060', exportRow, true);
  assert.equal(applyResult.status, 'applied');
  assert.deepEqual(apply.updateCalls[0], { element: 'Earth' });
});

test('reconcileStone skips stones with no existing enc_stone_content row, regardless of apply', async () => {
  const { supabase, updateCalls } = fakeSupabase({ existingRow: null });
  const result = await reconcileStone(supabase, 'C-9999', baseExportRow, true);
  assert.equal(result.status, 'skipped');
  assert.equal(updateCalls.length, 0);
});
