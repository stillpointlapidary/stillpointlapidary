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

function scErrors(overrides) {
  const packet = { enc_stone_content: { published: false, ...overrides } };
  return validatePacket(packet, null).filter(e => e.startsWith('enc_stone_content.collection_label'));
}

test('validatePacket rejects a missing collection_label', () => {
  const errors = scErrors({ collection_label: null });
  assert.ok(errors.some(e => e.includes('is null or missing')));
});

test('validatePacket rejects a collection_label outside the controlled vocabulary', () => {
  const errors = scErrors({ collection_label: 'Bargain Bin' });
  assert.ok(errors.some(e => e.includes('is not in the controlled vocabulary')));
});

test('validatePacket accepts each of the four valid collection_label values', () => {
  for (const label of ['Essentials', 'Shelf Builders', 'Collector Favorites', 'Rare Finds']) {
    const errors = scErrors({ collection_label: label });
    assert.deepEqual(errors, []);
  }
});

// ---------------------------------------------------------------------------
// Hard icon validation: CSS existence, Storage existence, retired assignments
// ---------------------------------------------------------------------------

function themeIconErrors(iconSlug, cssClasses, storageFiles) {
  const packet = {
    enc_stone_content: { published: false },
    enc_themes: [{ tier: 'primary', title: 'Test Theme', icon_slug: iconSlug, display_order: 1 }],
  };
  return validatePacket(packet, null, cssClasses, storageFiles).filter(e => e.startsWith('enc_themes'));
}

function collectorNoteIconErrors(iconSlug, cssClasses, storageFiles) {
  const packet = {
    enc_stone_content: { published: false },
    enc_collector_notes: [{ title: 'Test Note', body: 'Body', icon_slug: iconSlug, display_order: 1 }],
  };
  return validatePacket(packet, null, cssClasses, storageFiles).filter(e => e.startsWith('enc_collector_notes > Test Note'));
}

test('validatePacket rejects a known icon slug missing from enc-icons.css', () => {
  const cssClasses = new Set(['grounding']); // 'manifestation' deliberately absent
  const errors = themeIconErrors('icon-manifestation', cssClasses, null);
  assert.ok(errors.some(e => e.includes('no matching class in stones/enc-icons.css')));
});

test('validatePacket accepts a known icon slug present in enc-icons.css', () => {
  const cssClasses = new Set(['manifestation']);
  const errors = themeIconErrors('icon-manifestation', cssClasses, null);
  assert.deepEqual(errors, []);
});

test('validatePacket rejects a known icon slug missing from Supabase Storage', () => {
  const cssClasses = new Set(['manifestation']);
  const storageFiles = new Set(['grounding']); // 'manifestation' deliberately absent
  const errors = themeIconErrors('icon-manifestation', cssClasses, storageFiles);
  assert.ok(errors.some(e => e.includes('will render blank')));
});

test('validatePacket accepts a known icon slug present in Supabase Storage', () => {
  const cssClasses = new Set(['manifestation']);
  const storageFiles = new Set(['manifestation']);
  const errors = themeIconErrors('icon-manifestation', cssClasses, storageFiles);
  assert.deepEqual(errors, []);
});

test('validatePacket rejects icon-care-cleaning on an Energetic Theme', () => {
  const errors = themeIconErrors('icon-care-cleaning', null, null);
  assert.ok(errors.some(e => e.includes('reserved for a different section')));
});

test('validatePacket rejects icon-pair-with on an Energetic Theme', () => {
  const errors = themeIconErrors('icon-pair-with', null, null);
  assert.ok(errors.some(e => e.includes('reserved for a different section')));
});

test('validatePacket rejects icon-tag-label on an Energetic Theme', () => {
  const errors = themeIconErrors('icon-tag-label', null, null);
  assert.ok(errors.some(e => e.includes('reserved for a different section')));
});

test('validatePacket rejects icon-care-cleaning on a Collector Note', () => {
  const errors = collectorNoteIconErrors('icon-care-cleaning', null, null);
  assert.ok(errors.some(e => e.includes('reserved for the fixed Care & Cleaning row')));
});

test('validatePacket accepts an approved topic icon on a Collector Note', () => {
  const errors = collectorNoteIconErrors('icon-tradition', null, null);
  assert.deepEqual(errors, []);
});

test('validatePacket rejects an energetic_role_icon that does not match the approved role mapping', () => {
  const packet = { enc_stone_content: { published: false, energetic_role: 'Manifestation', energetic_role_icon: 'icon-grounding' } };
  const errors = validatePacket(packet, null).filter(e => e.startsWith('enc_stone_content.energetic_role_icon'));
  assert.ok(errors.some(e => e.includes('does not match the approved icon for role')));
});
