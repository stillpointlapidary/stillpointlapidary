#!/usr/bin/env node
'use strict';

/**
 * 2C — Packet Validator
 *
 * Validates a generated JSON packet against field counts, required fields,
 * controlled vocabularies, icon slug format, related-stone slug resolution,
 * and swatch value presence.
 *
 * Runs against the full batch before any import begins.
 *
 * Usage:
 *   node pipeline/validate-packet.js --packet <path> [--packet <path> ...]
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

const fs = require('fs');
const iconMap = require('./lib/icon-map.json');

// ---------------------------------------------------------------------------
// Controlled vocabularies
// ---------------------------------------------------------------------------
const VALID_ENERGETIC_ROLES = new Set([
  'Grounding', 'Protection', 'Vitality', 'Heart Healing', 'Calm & Peace',
  'Emotional Regulation', 'Clarity & Focus', 'Intuition', 'Spiritual Connection',
  'Transformation', 'Manifestation', 'Amplification',
]);

const VALID_MATERIAL_TYPES = new Set([
  'Mineral', 'Mineral variety', 'Rock', 'Mineraloid', 'Organic material',
  'Mineral aggregate', 'Composite', 'Man-made', 'Fossil',
]);

const VALID_COLLECTION_LABELS = new Set([
  'Essentials', 'Shelf Builders', 'Collector Favorites', 'Rare Finds',
]);

const VALID_STATUSES = new Set([
  'Not Started', 'Foundation Live', 'Research Complete',
  'MD Approved', 'Supabase Entered', 'Full Entry Live',
]);

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  const packets = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--packet') packets.push(args[++i]);
  }
  if (packets.length === 0) {
    console.error('Usage: node pipeline/validate-packet.js --packet <path> [--packet <path> ...]');
    process.exit(1);
  }
  return packets;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function validateIconSlug(slug, context, errors) {
  if (typeof slug !== 'string' || !slug.startsWith('icon-')) {
    errors.push(`${context}: icon slug must start with "icon-", got "${slug}"`);
    return;
  }
  const bare = slug.slice(5);
  if (!iconMap.knownSlugs.includes(bare)) {
    errors.push(`${context}: unknown icon slug "${slug}"`);
  }
}

function validatePacket(packet, rosterSlugs) {
  const name = packet.meta?.stone_name || 'UNKNOWN';
  const errors = [];

  // --- Meta ---
  const required_meta = ['stone_id', 'stone_name', 'stone_slug', 'production_data_version', 'generated_at'];
  for (const f of required_meta) {
    if (!packet.meta?.[f]) errors.push(`meta.${f} is missing`);
  }

  // --- enc_stone_content ---
  const sc = packet.enc_stone_content;
  if (!sc) { errors.push('enc_stone_content block missing'); }
  else {
    // TODO (future enhancement): this block checks presence/vocabulary only.
    // It does not lint prose content (e.g. Signature Line color-adjacent
    // imagery, Energetic Theme opening phrasing) per the Gate 2 Known-Issue
    // Lint in ENCYCLOPEDIA-PRODUCTION-WORKFLOW.md. That check is currently
    // manual.
    const required_sc = [
      'stone_id', 'slug', 'signature_line', 'pill_1', 'pill_2', 'pill_3',
      'best_for', 'use_when', 'affirmation',
      'overview_p1', 'overview_p2', 'formation',
      'collector_context_p1', 'collector_context_p2',
      'collection_label', 'chakra_primary', 'element', 'zodiac', 'material_type',
      'energetic_role', 'energetic_role_icon', 'color_energy',
      'nav_prev_slug', 'nav_prev_name', 'nav_next_slug', 'nav_next_name',
    ];
    for (const f of required_sc) {
      if (!sc[f]) errors.push(`enc_stone_content.${f} is null or missing`);
    }
    if (sc.published !== false) errors.push('enc_stone_content.published must be false for new imports');
    if (sc.energetic_role && !VALID_ENERGETIC_ROLES.has(sc.energetic_role)) {
      errors.push(`enc_stone_content.energetic_role "${sc.energetic_role}" is not in the 12-value set`);
    }
    if (sc.material_type && !VALID_MATERIAL_TYPES.has(sc.material_type)) {
      errors.push(`enc_stone_content.material_type "${sc.material_type}" is not in the controlled vocabulary`);
    }
    if (sc.collection_label && !VALID_COLLECTION_LABELS.has(sc.collection_label)) {
      errors.push(`enc_stone_content.collection_label "${sc.collection_label}" is not in the controlled vocabulary`);
    }
    if (sc.energetic_role_icon) {
      validateIconSlug(sc.energetic_role_icon, 'enc_stone_content.energetic_role_icon', errors);
    }
    // Slug cross-check
    if (sc.slug !== packet.meta?.stone_slug) {
      errors.push(`enc_stone_content.slug "${sc.slug}" does not match meta.stone_slug "${packet.meta?.stone_slug}"`);
    }
    if (sc.stone_id !== packet.meta?.stone_id) {
      errors.push(`enc_stone_content.stone_id "${sc.stone_id}" does not match meta.stone_id "${packet.meta?.stone_id}"`);
    }
  }

  // --- enc_mineral_facts ---
  const facts = packet.enc_mineral_facts;
  if (!facts) { errors.push('enc_mineral_facts block missing'); }
  else {
    if (facts.length !== 8) errors.push(`enc_mineral_facts: expected 8 rows, found ${facts.length}`);
    const orders = facts.map(f => f.display_order);
    if (new Set(orders).size !== orders.length) errors.push('enc_mineral_facts: duplicate display_order values');
    for (const f of facts) {
      if (!f.label || !f.value) errors.push(`enc_mineral_facts row ${f.display_order}: label or value is empty`);
    }
  }

  // --- enc_localities ---
  const locs = packet.enc_localities;
  if (!locs || locs.length === 0) errors.push('enc_localities: at least one locality required');

  // --- enc_reach_for ---
  const reach = packet.enc_reach_for;
  if (!reach) { errors.push('enc_reach_for block missing'); }
  else {
    if (reach.length < 3 || reach.length > 5) errors.push(`enc_reach_for: expected 3-5 rows, found ${reach.length}`);
    const reachLabels = reach.map(r => r.label);
    if (new Set(reachLabels).size !== reachLabels.length) errors.push('enc_reach_for: duplicate label values');
    for (const r of reach) {
      if (!r.label || !r.description) errors.push(`enc_reach_for row ${r.display_order}: label or description is empty`);
    }
  }

  // --- enc_themes ---
  const themes = packet.enc_themes;
  if (!themes) { errors.push('enc_themes block missing'); }
  else {
    const primaryThemes = themes.filter(t => t.tier === 'primary');
    if (primaryThemes.length < 1 || primaryThemes.length > 2) {
      errors.push(`enc_themes: primary tier must have 1–2 rows, found ${primaryThemes.length}`);
    }
    const secondaryThemes = themes.filter(t => t.tier === 'secondary');
    if (secondaryThemes.length > 2) errors.push(`enc_themes: secondary tier may have at most 2 rows`);
    const occasionalThemes = themes.filter(t => t.tier === 'occasional');
    if (occasionalThemes.length > 2) errors.push(`enc_themes: occasional tier may have at most 2 rows`);
    for (const t of themes) {
      if (!['primary', 'secondary', 'occasional'].includes(t.tier)) {
        errors.push(`enc_themes: unknown tier "${t.tier}"`);
      }
      if ((t.tier === 'primary' || t.tier === 'secondary') && t.icon_slug) {
        validateIconSlug(t.icon_slug, `enc_themes > ${t.title}`, errors);
      }
    }
  }

  // --- enc_collector_notes ---
  const notes = packet.enc_collector_notes;
  if (!notes) { errors.push('enc_collector_notes block missing'); }
  else {
    if (notes.length < 3 || notes.length > 4) {
      errors.push(`enc_collector_notes: expected 3–4 rows, found ${notes.length}`);
    }
    for (const n of notes) {
      if (!n.title || !n.body) errors.push(`enc_collector_notes row ${n.display_order}: title or body is empty`);
      if (n.icon_slug) validateIconSlug(n.icon_slug, `enc_collector_notes > ${n.title}`, errors);
    }
  }

  // --- enc_care ---
  const careRows = packet.enc_care;
  if (!careRows) { errors.push('enc_care block missing'); }
  else {
    if (careRows.length !== 4) errors.push(`enc_care: expected exactly 4 rows, found ${careRows.length}`);
    const expectedCats = ['Cleaning', 'Water', 'Light & Heat', 'Storage'];
    for (let i = 0; i < expectedCats.length; i++) {
      if (!careRows[i] || careRows[i].category !== expectedCats[i]) {
        errors.push(`enc_care row ${i + 1}: expected category "${expectedCats[i]}", got "${careRows[i]?.category}"`);
      }
    }
  }

  // --- enc_related_stones ---
  const related = packet.enc_related_stones;
  if (!related) { errors.push('enc_related_stones block missing'); }
  else {
    if (related.length !== 4) errors.push(`enc_related_stones: expected exactly 4 rows, found ${related.length}`);
    const simEnergy = related.filter(r => r.group === 'similar_energy');
    const pairsWell = related.filter(r => r.group === 'pairs_well_with');
    if (simEnergy.length !== 2) errors.push(`enc_related_stones: expected 2 similar_energy rows, found ${simEnergy.length}`);
    if (pairsWell.length !== 2) errors.push(`enc_related_stones: expected 2 pairs_well_with rows, found ${pairsWell.length}`);
    const relatedSlugs = related.map(r => r.related_slug);
    if (new Set(relatedSlugs).size !== relatedSlugs.length) errors.push('enc_related_stones: duplicate related_slug values');
    for (const r of related) {
      if (!r.related_slug || !r.related_name || !r.reason) {
        errors.push(`enc_related_stones row ${r.display_order}: related_slug, related_name, or reason is empty`);
      }
      if (rosterSlugs && !rosterSlugs.has(r.related_slug)) {
        errors.push(`enc_related_stones: related_slug "${r.related_slug}" not found in stones roster`);
      }
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const packetPaths = parseArgs();

  // Load Supabase to get roster
  let rosterSlugs = null;
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
      const { data } = await supabase.from('stones').select('slug');
      if (data) rosterSlugs = new Set(data.map(s => s.slug));
    } catch (_) {
      console.warn('WARNING: Could not load stones roster from Supabase. Slug resolution will be skipped.');
    }
  } else {
    console.warn('WARNING: SUPABASE_URL/SUPABASE_SERVICE_KEY not set. Slug resolution against live roster skipped.');
  }

  let allPass = true;

  for (const packetPath of packetPaths) {
    const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
    const errors = validatePacket(packet, rosterSlugs);
    const name = packet.meta?.stone_name || packetPath;
    if (errors.length === 0) {
      console.log(`PASS  ${name}`);
    } else {
      allPass = false;
      console.error(`FAIL  ${name}`);
      for (const e of errors) console.error(`      - ${e}`);
    }
  }

  // Set the exit code and let Node drain naturally instead of calling
  // process.exit(): forcing exit immediately after a Supabase fetch response
  // races an in-flight socket teardown on Windows and crashes with a libuv
  // assertion (UV_HANDLE_CLOSING) even though validation already completed.
  process.exitCode = allPass ? 0 : 1;
}

if (require.main === module) {
  main().catch(err => {
    console.error('Unexpected error:', err.message);
    process.exitCode = 1;
  });
}

module.exports = { validatePacket };
