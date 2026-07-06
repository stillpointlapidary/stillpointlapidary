'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  expectedValues, diffFields, resolveStoneId, RECONCILE_FIELDS,
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
  assert.deepEqual(diffs, [{ field: 'chakra_secondary', current: 'Sacral', expected: null }]);
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
