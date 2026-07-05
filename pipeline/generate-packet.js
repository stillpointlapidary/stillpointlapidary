#!/usr/bin/env node
'use strict';

/**
 * 2B — Packet Generator
 *
 * Reads one canonical MD file + canonical structured sources and outputs a
 * database-ready JSON packet for one stone. Never hand-edit the output.
 * Regenerate fresh on every run; the packet is transport only.
 *
 * Usage:
 *   node pipeline/generate-packet.js --md <path> [--out <path>]
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY   (service role key — needed for stones table read)
 *
 * Requires: npm install gray-matter @supabase/supabase-js
 * (gray-matter handles YAML front matter; @supabase/supabase-js is already a dep)
 */

const fs = require('fs');
const path = require('path');
const { parseMD } = require('./lib/parse-md');
const iconMap = require('./lib/icon-map.json');

// ---------------------------------------------------------------------------
// Structured Production Master export (generated, gitignored)
// ---------------------------------------------------------------------------
const STRUCTURED_EXPORT_PATH = path.join(__dirname, 'data', 'structured-values.generated.json');

// Fields locked by the Production Master. These may also exist in
// enc_stone_content for previously-imported stones; the export is the
// required source of truth and existing DB values are only ever compared
// for conflicts, never silently preferred.
const STRUCTURED_FIELDS = [
  'collection_label', 'chakra_primary', 'chakra_secondary', 'element', 'zodiac', 'material_type',
  'nav_prev_slug', 'nav_prev_name', 'nav_next_slug', 'nav_next_name',
];
const HARD_REQUIRED_STRUCTURED_FIELDS = [
  'collection_label', 'chakra_primary', 'element', 'zodiac', 'material_type',
  'nav_prev_slug', 'nav_prev_name', 'nav_next_slug', 'nav_next_name',
];

function loadStructuredExport() {
  if (!fs.existsSync(STRUCTURED_EXPORT_PATH)) {
    console.error(`Structured values export not found at ${STRUCTURED_EXPORT_PATH}.\nRun "npm run pipeline:export-structured-values" first.\nGeneration stopped.`);
    process.exit(2);
  }
  const raw = JSON.parse(fs.readFileSync(STRUCTURED_EXPORT_PATH, 'utf8'));
  return raw.stones || {};
}

function versionMismatch(stoneName, mdVersion, exportVersion) {
  console.error(`
${stoneName}:
production_data_version mismatch
MD front matter: ${mdVersion}
Production Master export: ${exportVersion}
Generation stopped. Re-run the structured-values export or confirm the canonical MD version, then retry.
`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--md') opts.md = args[++i];
    if (args[i] === '--out') opts.out = args[++i];
  }
  if (!opts.md) {
    console.error('Usage: node pipeline/generate-packet.js --md <path> [--out <path>]');
    process.exit(1);
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Conflict-halt helper
// ---------------------------------------------------------------------------
function conflict(stoneName, field, mdValue, canonicalValue, source) {
  console.error(`
${stoneName}:
${field} mismatch
MD value: ${mdValue}
Canonical value: ${canonicalValue}
Source: ${source}
Generation stopped.
`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Supabase lookup
// ---------------------------------------------------------------------------
async function fetchStoneRecord(supabase, stoneId, stoneName) {
  const { data, error } = await supabase
    .from('stones')
    .select('id, name, slug, enc_energetic_role, color_energy, styling_chakra, color_hex, color_categories')
    .eq('id', stoneId)
    .single();

  if (error || !data) {
    console.error(`${stoneName}:\nstones table lookup failed for id=${stoneId}\n${error?.message || 'no row found'}\nGeneration stopped.`);
    process.exit(2);
  }
  return data;
}

async function fetchExistingContent(supabase, stoneId) {
  const { data } = await supabase
    .from('enc_stone_content')
    .select('collection_label, chakra_primary, chakra_secondary, element, zodiac, material_type, nav_prev_slug, nav_prev_name, nav_next_slug, nav_next_name')
    .eq('stone_id', stoneId)
    .single();
  return data; // null if no row exists yet
}

async function fetchRelatedStoneColor(supabase, slug, stoneName) {
  const { data } = await supabase
    .from('stones')
    .select('slug, color_hex, color_categories')
    .eq('slug', slug)
    .single();

  if (!data) {
    console.error(`${stoneName}:\nrelated stone slug "${slug}" not found in stones roster\nGeneration stopped.`);
    process.exit(2);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
function validateIconSlug(slug, context) {
  if (!slug.startsWith('icon-')) {
    throw new Error(`Icon slug must start with "icon-": "${slug}" in ${context}`);
  }
  const bare = slug.slice(5);
  if (!iconMap.knownSlugs.includes(bare)) {
    throw new Error(`Icon slug "${slug}" is not in the known-slugs list. Update icon-map.json or check for a typo. Context: ${context}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const opts = parseArgs();

  // Load Supabase client
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY env vars are required.');
    process.exit(1);
  }
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  // Parse MD
  const mdText = fs.readFileSync(opts.md, 'utf8');
  let parsed;
  try {
    parsed = parseMD(mdText);
  } catch (err) {
    const stoneSlug = opts.md.split(/[/\\]/).pop().replace('.md', '');
    console.error(`${stoneSlug}:\nMD parse error: ${err.message}\nGeneration stopped.`);
    process.exit(2);
  }

  const { frontMatter, hero, overview, reachFor, themes, mineralProfile, collectorNotes, marketNotes, care, relatedStones } = parsed;
  const stoneName = frontMatter.stone_name;
  const stoneId = frontMatter.stone_id;
  const stoneSlug = frontMatter.stone_slug;

  // Load the Production Master structured-values export (required source for
  // locked structured fields — see pipeline/README.md Gate 4 order).
  const structuredExport = loadStructuredExport();
  const exportRow = structuredExport[stoneId];
  if (!exportRow) {
    console.error(`${stoneName}:\nNo Production Master export row found for stone_id "${stoneId}".\nGeneration stopped.`);
    process.exit(2);
  }

  // Cross-check slug/name against the Production Master export
  if (exportRow.slug !== stoneSlug) {
    conflict(stoneName, 'slug', stoneSlug, exportRow.slug, 'Production Master export');
  }
  if (exportRow.stone_name !== frontMatter.stone_name) {
    conflict(stoneName, 'stone_name', frontMatter.stone_name, exportRow.stone_name, 'Production Master export');
  }

  // Staleness protection: MD front matter and export must be generated
  // against the exact same production data version. No inference or bypass.
  if (frontMatter.production_data_version !== exportRow.production_data_version) {
    versionMismatch(stoneName, frontMatter.production_data_version, exportRow.production_data_version);
  }

  // Fetch canonical structured data from Supabase
  const stoneRow = await fetchStoneRecord(supabase, stoneId, stoneName);
  const existingContent = await fetchExistingContent(supabase, stoneId);

  // Cross-check slug
  if (stoneRow.slug !== stoneSlug) {
    conflict(stoneName, 'slug', stoneSlug, stoneRow.slug, 'stones table');
  }
  if (stoneRow.name !== frontMatter.stone_name) {
    conflict(stoneName, 'stone_name', frontMatter.stone_name, stoneRow.name, 'stones table');
  }

  // Resolve locked structured fields: Production Master export is the
  // required source. If enc_stone_content already has a conflicting value,
  // halt — never silently prefer Supabase over the Production Master.
  const structured = {};
  for (const field of STRUCTURED_FIELDS) {
    const exportValue = exportRow[field] ?? null;
    const existingValue = existingContent ? (existingContent[field] ?? null) : null;
    if (existingValue !== null && existingValue !== exportValue) {
      conflict(stoneName, field, existingValue, exportValue, 'enc_stone_content vs Production Master export');
    }
    structured[field] = exportValue;
  }
  for (const field of HARD_REQUIRED_STRUCTURED_FIELDS) {
    if (!structured[field]) {
      console.error(`${stoneName}:\nRequired structured field "${field}" is missing or blank in the Production Master export.\nGeneration stopped.`);
      process.exit(2);
    }
  }

  // Energetic role icon
  const energeticRole = stoneRow.enc_energetic_role;
  if (!energeticRole) {
    console.error(`${stoneName}:\nstones.enc_energetic_role is null — must be set before generation\nGeneration stopped.`);
    process.exit(2);
  }
  const energeticRoleIcon = iconMap.energeticRoles[energeticRole];
  if (!energeticRoleIcon) {
    console.error(`${stoneName}:\nEnergetic role "${energeticRole}" has no icon mapping in icon-map.json\nGeneration stopped.`);
    process.exit(2);
  }

  // Validate all icon slugs in themes
  for (const theme of themes) {
    if (theme.icon_slug) validateIconSlug(theme.icon_slug, `Energetic Themes > ${theme.title}`);
  }

  // Validate all icon slugs in collector notes
  for (const note of collectorNotes) {
    validateIconSlug(note.icon_slug, `Collector Notes > ${note.title}`);
  }

  // Validate care icons (these come from icon-map, not MD)
  for (const row of care) {
    const careIcon = iconMap.care[row.category];
    if (!careIcon) {
      console.error(`${stoneName}:\nCare category "${row.category}" has no icon mapping in icon-map.json\nGeneration stopped.`);
      process.exit(2);
    }
    row.icon_slug = careIcon;
  }

  // Validate related stone slugs exist in the roster
  for (const rs of relatedStones) {
    await fetchRelatedStoneColor(supabase, rs.related_slug, stoneName);
  }

  // Build the packet
  const packet = {
    meta: {
      stone_id: stoneId,
      stone_name: stoneName,
      stone_slug: stoneSlug,
      production_data_version: frontMatter.production_data_version,
      generated_at: new Date().toISOString(),
    },
    enc_stone_content: {
      stone_id: stoneId,
      slug: stoneSlug,
      ...hero,
      ...overview,
      ...mineralProfile,
      collector_context_p3: marketNotes || null,
      collection_label: structured.collection_label,
      chakra_primary: structured.chakra_primary,
      chakra_secondary: structured.chakra_secondary,
      element: structured.element,
      zodiac: structured.zodiac,
      material_type: structured.material_type,
      energetic_role: energeticRole,
      energetic_role_icon: energeticRoleIcon,
      color_energy: stoneRow.color_energy,
      nav_prev_slug: structured.nav_prev_slug,
      nav_prev_name: structured.nav_prev_name,
      nav_next_slug: structured.nav_next_slug,
      nav_next_name: structured.nav_next_name,
      published: false,
    },
    enc_mineral_facts: mineralProfile.mineralFacts,
    enc_localities: mineralProfile.localities.map(l => ({ ...l, stone_id: stoneId })),
    enc_reach_for: reachFor.map(r => ({ ...r, stone_id: stoneId })),
    enc_themes: themes.map(t => ({ ...t, stone_id: stoneId })),
    enc_collector_notes: collectorNotes.map(n => ({ ...n, stone_id: stoneId })),
    enc_care: care.map(c => ({ ...c, stone_id: stoneId })),
    enc_related_stones: relatedStones.map(rs => ({ ...rs, stone_id: stoneId })),
  };

  // Output
  const outPath = opts.out || path.join(path.dirname(opts.md), `${stoneSlug}.packet.json`);
  fs.writeFileSync(outPath, JSON.stringify(packet, null, 2));
  console.log(`Packet generated: ${outPath}`);
}

main().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
