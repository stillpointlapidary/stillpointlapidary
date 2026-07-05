#!/usr/bin/env node
'use strict';

/**
 * 2E — Round-Trip Verifier
 *
 * After import, compares live Supabase values against the source packet
 * field-by-field: exact text, display order, slugs, icon classes, nullable fields.
 * Row counts alone are not sufficient — this checks every field value.
 * Uses the UNION ALL pattern from DATABASE-REFERENCE §15.
 *
 * Also confirms stones.enc_production_status agrees with enc_stone_content.published
 * (both are set together, in the same transaction, by import_stone_atomic.sql):
 * published: true <-> 'Full Entry Live'; published: false (explicit hold) <-> 'Supabase Entered'.
 *
 * Usage:
 *   node pipeline/verify-stone.js --packet <path> [--packet <path> ...] [--expected-published true|false]
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

const fs = require('fs');

function parseArgs() {
  const args = process.argv.slice(2);
  const packets = [];
  // Default true: default Gate 4 publishes in the same pass, so the packet's
  // baked-in `published: false` (always true for a freshly generated packet)
  // is expected to differ from the post-publication live value. Pass
  // --expected-published false only for an explicit unpublished hold.
  let expectedPublished = true;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--packet') packets.push(args[++i]);
    if (args[i] === '--expected-published') {
      const val = args[++i];
      if (val !== 'true' && val !== 'false') {
        console.error(`--expected-published must be "true" or "false", got "${val}"`);
        process.exit(1);
      }
      expectedPublished = val === 'true';
    }
  }
  if (packets.length === 0) {
    console.error('Usage: node pipeline/verify-stone.js --packet <path> [--packet <path> ...] [--expected-published true|false]');
    process.exit(1);
  }
  return { packets, expectedPublished };
}

function mismatch(field, expected, actual) {
  return `MISMATCH  ${field}\n           expected: ${JSON.stringify(expected)}\n           actual:   ${JSON.stringify(actual)}`;
}

function compareField(errors, field, expected, actual) {
  if (expected === null && actual === null) return;
  if (expected !== actual) {
    errors.push(mismatch(field, expected, actual));
  }
}

// import_stone_atomic.sql sets these two fields together in the same
// transaction, driven by one publish flag, so they must never disagree:
// published: true <-> 'Full Entry Live'; published: false (explicit hold)
// <-> 'Supabase Entered' (ENCYCLOPEDIA-CONTENT-FIELDS.md §17).
function expectedProductionStatus(expectedPublished) {
  return expectedPublished ? 'Full Entry Live' : 'Supabase Entered';
}

async function verifyStone(supabase, packet, expectedPublished) {
  const name = packet.meta.stone_name;
  const stoneId = packet.meta.stone_id;
  const errors = [];

  // --- enc_stone_content ---
  const { data: sc } = await supabase
    .from('enc_stone_content')
    .select('*')
    .eq('stone_id', stoneId)
    .single();

  if (!sc) {
    return { stone: name, status: 'FAIL', errors: ['enc_stone_content: no row found'] };
  }

  const scExpected = packet.enc_stone_content;
  const scFields = [
    'slug', 'signature_line', 'pill_1', 'pill_2', 'pill_3',
    'best_for', 'use_when', 'affirmation', 'image_alt',
    'overview_p1', 'overview_p2', 'formation',
    'collector_context_p1', 'collector_context_p2', 'collector_context_p3',
    'collector_context_p4', 'collector_context_p5',
    'chakra_primary', 'chakra_secondary', 'element', 'zodiac', 'material_type',
    'energetic_role', 'energetic_role_icon', 'color_energy',
    'nav_prev_slug', 'nav_prev_name', 'nav_next_slug', 'nav_next_name',
  ];
  for (const f of scFields) {
    compareField(errors, `enc_stone_content.${f}`, scExpected[f] ?? null, sc[f] ?? null);
  }
  if (sc.published !== expectedPublished) errors.push(`enc_stone_content.published should be ${expectedPublished}`);

  // --- stones.enc_production_status (Gate 4 step 8; must agree with published) ---
  const { data: stoneRow } = await supabase
    .from('stones')
    .select('enc_production_status')
    .eq('id', stoneId)
    .single();

  const expectedStatus = expectedProductionStatus(expectedPublished);
  if (!stoneRow) {
    errors.push('stones: no row found');
  } else if (stoneRow.enc_production_status !== expectedStatus) {
    errors.push(`stones.enc_production_status should be '${expectedStatus}', found '${stoneRow.enc_production_status}'`);
  }

  // --- enc_mineral_facts ---
  const { data: facts } = await supabase
    .from('enc_mineral_facts')
    .select('label, value, display_order')
    .eq('stone_id', stoneId)
    .order('display_order');

  if (!facts || facts.length !== 8) {
    errors.push(`enc_mineral_facts: expected 8 rows, found ${facts?.length ?? 0}`);
  } else {
    for (let i = 0; i < 8; i++) {
      const expected = packet.enc_mineral_facts[i];
      const actual = facts[i];
      compareField(errors, `enc_mineral_facts[${i + 1}].label`, expected.label, actual.label);
      compareField(errors, `enc_mineral_facts[${i + 1}].value`, expected.value, actual.value);
      compareField(errors, `enc_mineral_facts[${i + 1}].display_order`, expected.display_order, actual.display_order);
    }
  }

  // --- enc_localities ---
  const { data: locs } = await supabase
    .from('enc_localities')
    .select('locality, display_order')
    .eq('stone_id', stoneId)
    .order('display_order');

  const locExpected = packet.enc_localities;
  if (!locs || locs.length !== locExpected.length) {
    errors.push(`enc_localities: expected ${locExpected.length} rows, found ${locs?.length ?? 0}`);
  } else {
    for (let i = 0; i < locExpected.length; i++) {
      compareField(errors, `enc_localities[${i + 1}].locality`, locExpected[i].locality, locs[i].locality);
    }
  }

  // --- enc_reach_for ---
  const { data: reach } = await supabase
    .from('enc_reach_for')
    .select('label, description, display_order')
    .eq('stone_id', stoneId)
    .order('display_order');

  if (!reach || reach.length !== packet.enc_reach_for.length) {
    errors.push(`enc_reach_for: expected ${packet.enc_reach_for.length} rows, found ${reach?.length ?? 0}`);
  } else {
    for (let i = 0; i < packet.enc_reach_for.length; i++) {
      compareField(errors, `enc_reach_for[${i + 1}].label`, packet.enc_reach_for[i].label, reach[i].label);
      compareField(errors, `enc_reach_for[${i + 1}].description`, packet.enc_reach_for[i].description, reach[i].description);
    }
  }

  // --- enc_themes ---
  const { data: themes } = await supabase
    .from('enc_themes')
    .select('tier, title, description, icon_slug, display_order')
    .eq('stone_id', stoneId)
    .order('tier')
    .order('display_order');

  const themesExpected = packet.enc_themes;
  if (!themes || themes.length !== themesExpected.length) {
    errors.push(`enc_themes: expected ${themesExpected.length} rows, found ${themes?.length ?? 0}`);
  } else {
    const byTierOrder = (a, b) => a.tier.localeCompare(b.tier) || a.display_order - b.display_order;
    const sortedExpected = [...themesExpected].sort(byTierOrder);
    const sortedActual = [...themes].sort(byTierOrder);
    for (let i = 0; i < sortedExpected.length; i++) {
      const key = `enc_themes[tier=${sortedExpected[i].tier},order=${sortedExpected[i].display_order}]`;
      compareField(errors, `${key}.title`, sortedExpected[i].title, sortedActual[i].title);
      compareField(errors, `${key}.icon_slug`, sortedExpected[i].icon_slug ?? null, sortedActual[i].icon_slug ?? null);
      compareField(errors, `${key}.description`, sortedExpected[i].description ?? null, sortedActual[i].description ?? null);
    }
  }

  // --- enc_collector_notes ---
  const { data: notes } = await supabase
    .from('enc_collector_notes')
    .select('title, body, icon_slug, display_order')
    .eq('stone_id', stoneId)
    .order('display_order');

  const notesExpected = packet.enc_collector_notes;
  if (!notes || notes.length !== notesExpected.length) {
    errors.push(`enc_collector_notes: expected ${notesExpected.length} rows, found ${notes?.length ?? 0}`);
  } else {
    for (let i = 0; i < notesExpected.length; i++) {
      compareField(errors, `enc_collector_notes[${i + 1}].title`, notesExpected[i].title, notes[i].title);
      compareField(errors, `enc_collector_notes[${i + 1}].body`, notesExpected[i].body, notes[i].body);
      compareField(errors, `enc_collector_notes[${i + 1}].icon_slug`, notesExpected[i].icon_slug, notes[i].icon_slug);
    }
  }

  // --- enc_care ---
  const { data: care } = await supabase
    .from('enc_care')
    .select('category, body, display_order')
    .eq('stone_id', stoneId)
    .order('display_order');

  if (!care || care.length !== 4) {
    errors.push(`enc_care: expected 4 rows, found ${care?.length ?? 0}`);
  } else {
    for (let i = 0; i < 4; i++) {
      compareField(errors, `enc_care[${i + 1}].category`, packet.enc_care[i].category, care[i].category);
      compareField(errors, `enc_care[${i + 1}].body`, packet.enc_care[i].body, care[i].body);
    }
  }

  // --- enc_related_stones ---
  const { data: related } = await supabase
    .from('enc_related_stones')
    .select('"group", related_slug, related_name, reason, display_order')
    .eq('stone_id', stoneId)
    .order('"group"')
    .order('display_order');

  const relatedExpected = packet.enc_related_stones;
  if (!related || related.length !== 4) {
    errors.push(`enc_related_stones: expected 4 rows, found ${related?.length ?? 0}`);
  } else {
    const byGroupOrder = (a, b) => a.group.localeCompare(b.group) || a.display_order - b.display_order;
    const srtE = [...relatedExpected].sort(byGroupOrder);
    const srtA = [...related].sort(byGroupOrder);
    for (let i = 0; i < 4; i++) {
      const key = `enc_related_stones[group=${srtE[i].group},order=${srtE[i].display_order}]`;
      compareField(errors, `${key}.related_slug`, srtE[i].related_slug, srtA[i].related_slug);
      compareField(errors, `${key}.related_name`, srtE[i].related_name, srtA[i].related_name);
      compareField(errors, `${key}.reason`, srtE[i].reason, srtA[i].reason);
    }
  }

  if (errors.length === 0) {
    return { stone: name, status: 'PASS' };
  }
  return { stone: name, status: 'FAIL', errors };
}

async function main() {
  const { packets: packetPaths, expectedPublished } = parseArgs();

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY env vars are required.');
    process.exit(1);
  }
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  let allPass = true;

  for (const packetPath of packetPaths) {
    const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
    const result = await verifyStone(supabase, packet, expectedPublished);

    if (result.status === 'PASS') {
      console.log(`PASS  ${result.stone}`);
    } else {
      allPass = false;
      console.error(`FAIL  ${result.stone}`);
      for (const e of result.errors) console.error(`  ${e}`);
    }
  }

  process.exit(allPass ? 0 : 1);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Unexpected error:', err.message);
    process.exit(1);
  });
}

module.exports = { parseArgs, mismatch, compareField, expectedProductionStatus, verifyStone };
