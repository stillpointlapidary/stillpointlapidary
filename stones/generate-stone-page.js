#!/usr/bin/env node
/**
 * Still Point Lapidary — Encyclopedia Stone Page Generator
 * Architecture: 2026-06-20-canonical
 *
 * Usage:
 *   node stones/generate-stone-page.js <path-to-approved-md>
 *
 * Input:  Approved canonical MD file (docs/encyclopedia/entries/{stone}.md)
 * Output: stones/{slug}.html  (dry-run printed to console with --dry-run flag)
 *
 * The generator reads the canonical template, parses the approved MD, and
 * substitutes all content fields. It makes no editorial decisions. All content,
 * chakra palette tokens, and Energetic Role icons must be registered in the
 * lookup tables below before a page can be generated.
 *
 * Stone dot gradients are auto-derived from Supabase color_hex at startup.
 * Stones absent from Supabase or requiring a fixed gradient are listed in
 * GRADIENT_OVERRIDES below.
 *
 * To add a new chakra palette:   extend CHAKRA_PALETTES
 * To add a new Energetic Role:   extend ENERGETIC_ROLE_ICONS
 * To override a stone gradient:  extend GRADIENT_OVERRIDES
 */

'use strict';

const fs    = require('fs');
const path  = require('path');
const https = require('https');

// ── PATHS ────────────────────────────────────────────────────────────────────

const TEMPLATE_PATH = path.join(__dirname, '..', 'docs', 'encyclopedia', 'CANONICAL-STONE-PAGE-TEMPLATE.html');
const ROSTER_PATH   = path.join(__dirname, '..', 'data', 'navigation', 'Stones Catalog with Previous - Next Slugs.csv');
const OUTPUT_DIR    = __dirname; // stones/

// ── Supabase credentials (anon key — read-only, already public in codebase) ──
const SUPABASE_URL  = 'https://vxujlgyhgnihnqrxzefw.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dWpsZ3loZ25paG5xcnh6ZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjQwNDQsImV4cCI6MjA5NDkwMDA0NH0.1qWY2MsxbiNsS6zzJ1y9amD_KIVwxvoFzODbH5RJoI8';

// ── Stone color maps (populated at startup) ───────────────────────────────────
// STONE_COLOR_MAP: auto-derived from Supabase color_hex. slug → CSS gradient string.
const STONE_COLOR_MAP = new Map();

// GRADIENT_OVERRIDES: manual entries that cannot be auto-derived.
// Override takes precedence over STONE_COLOR_MAP for the same slug.
const GRADIENT_OVERRIDES = {
  // Slug confirmed post-rename from "Gold Tiger's Eye" → "Tiger's Eye" (Work Order 2026-06-22-C).
  // Supabase has this stone as "Tiger's Eye" after rename; kept manual until Supabase entry is verified.
  'tigers-eye':           'linear-gradient(135deg, #c8a040, #7a5018)',
  // Yellow Aventurine is off-roster: absent from the 333-stone catalog.
  // Pending Gate 0 formal addition decision. Do not move to auto-derivation until roster status is resolved.
  'yellow-aventurine':    'linear-gradient(135deg, #f0e080, #c0a830)',
  // Golden Healer Quartz: added for Citrine page swap (Work Order 2026-06-22-C).
  'golden-healer-quartz': 'linear-gradient(135deg, #f7e4a0, #d4a820)',
};

// ── Load canonical slug roster, nav data, and slug→display-name map ──────────
// All three parsed once at startup from the same CSV.
// CSV columns (0-based): id, name, slug, display_order,
//   previous_stone, previous_slug, next_stone, next_slug
function loadRosterAndNav() {
  if (!fs.existsSync(ROSTER_PATH)) {
    process.stderr.write('ERROR: Canonical roster not found: ' + ROSTER_PATH + '\n');
    process.exit(1);
  }
  const lines    = fs.readFileSync(ROSTER_PATH, 'utf8').split('\n').slice(1); // skip header
  const roster   = new Set();
  const navMap   = new Map(); // slug → { prevName, prevSlug, nextName, nextSlug }
  const slugName = new Map(); // slug → display name (for Supabase cross-reference)
  const seen     = new Set(); // for duplicate-slug detection

  for (const line of lines) {
    if (!line.trim()) continue;
    const cols      = line.split(',');
    const slug      = cols[2]?.trim();
    const name      = cols[1]?.trim();
    if (!slug) continue;

    roster.add(slug);

    if (seen.has(slug)) {
      process.stderr.write('ERROR: Duplicate slug "' + slug + '" found in canonical roster CSV.\n');
      process.exit(1);
    }
    seen.add(slug);

    if (name) slugName.set(slug, name);

    navMap.set(slug, {
      prevName: cols[4]?.trim() || '',
      prevSlug: cols[5]?.trim() || '',
      nextName: cols[6]?.trim() || '',
      nextSlug: cols[7]?.trim() || '',
    });
  }
  return { roster, navMap, slugName };
}

const { roster: CANONICAL_ROSTER, navMap: NAV_MAP, slugName: SLUG_NAME } = loadRosterAndNav();

// ── Supabase HTTP helper ──────────────────────────────────────────────────────
function httpsGetJson(urlStr, headers) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    https.get(
      { hostname: u.hostname, path: u.pathname + u.search, headers },
      res => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error('Supabase JSON parse error: ' + e.message)); }
        });
      }
    ).on('error', reject);
  });
}

// ── Tint derivation: blend hex color 60% toward white ────────────────────────
function tintHex(hex) {
  const r  = parseInt(hex.slice(1, 3), 16);
  const g  = parseInt(hex.slice(3, 5), 16);
  const b  = parseInt(hex.slice(5, 7), 16);
  const tr = Math.round(r + (255 - r) * 0.60);
  const tg = Math.round(g + (255 - g) * 0.60);
  const tb = Math.round(b + (255 - b) * 0.60);
  return '#' + [tr, tg, tb].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ── initStoneColors: fetch color_hex from Supabase, build STONE_COLOR_MAP ────
// Must be awaited before generate() is called.
async function initStoneColors() {
  process.stdout.write('🔍  Fetching stone color_hex from Supabase...\n');
  let rows;
  try {
    rows = await httpsGetJson(
      SUPABASE_URL + '/rest/v1/stones?select=name,color_hex&limit=400',
      { apikey: SUPABASE_ANON, Authorization: 'Bearer ' + SUPABASE_ANON }
    );
  } catch (err) {
    process.stderr.write(
      'WARN: Supabase color fetch failed (' + err.message + '). ' +
      'Dot gradients will fall back to GRADIENT_OVERRIDES only.\n'
    );
    return;
  }

  // Build name → hex map from Supabase response
  const nameToHex = new Map();
  for (const row of rows) {
    if (row.name && row.color_hex) nameToHex.set(row.name, row.color_hex);
  }

  // Cross-reference: slug → display name → hex, then derive gradient
  let derived = 0;
  for (const [slug, displayName] of SLUG_NAME) {
    if (GRADIENT_OVERRIDES[slug]) continue; // manual override takes precedence
    const hex = nameToHex.get(displayName);
    if (!hex) continue; // stone not in Supabase or missing color_hex
    const tint = tintHex(hex);
    STONE_COLOR_MAP.set(slug, 'linear-gradient(135deg, ' + tint + ', ' + hex + ')');
    derived++;
  }
  process.stdout.write('   ' + derived + ' stone gradients auto-derived from Supabase.\n');
}

// ── Gradient lookup (override → Supabase → missing) ─────────────────────────
function getGradient(slug) {
  return GRADIENT_OVERRIDES[slug] || STONE_COLOR_MAP.get(slug) || null;
}

// ────────────────────────────────────────────────────────────────────────────
// LOOKUP TABLES
// All values are production-locked. Do not modify without Christie's approval.
// Add new entries as more pages enter production.
// ────────────────────────────────────────────────────────────────────────────

/**
 * Chakra design token palettes.
 * Key: styling_chakra name exactly as it appears in the MD At a Glance table.
 * themeColor: used for <meta name="theme-color">.
 * desc: used in the CSS comment line inside the generated page.
 */
const CHAKRA_PALETTES = {
  'Solar Plexus': {
    pillBg: '#FFF8E1', pillText: '#8B6314',
    btnBg:  '#FEF3C7', btnBorder: '#D4A017', btnText: '#7A5200',
    wash:   '#FFFAED', washBorder: '#E2C960',
    accent: '#C89B0A', deep: '#7A5500',
    themeColor: '#C89B0A',
    desc: 'warm yellow/gold palette',
  },
  'Earth Star': {
    pillBg: '#F2F0EE', pillText: '#3D3530',
    btnBg:  '#EDEAE7', btnBorder: '#8C7F74', btnText: '#2E2824',
    wash:   '#F5F3F1', washBorder: '#C0B8B0',
    accent: '#4A3F38', deep: '#1A1614',
    themeColor: '#3D3530',
    desc: 'deep earth/charcoal palette',
  },
  'Crown': {
    pillBg: '#F5F0FF', pillText: '#5B3FA0',
    btnBg:  '#EDE8FF', btnBorder: '#9B80D4', btnText: '#3A2070',
    wash:   '#F8F5FF', washBorder: '#C4B0E8',
    accent: '#7B5CC8', deep: '#2D1860',
    themeColor: '#7B5CC8',
    desc: 'violet/purple palette',
  },
  'Heart': {
    pillBg: '#F0FAF0', pillText: '#2D7A3A',
    btnBg:  '#E4F5E4', btnBorder: '#68B870', btnText: '#1A5222',
    wash:   '#F4FBF4', washBorder: '#9FD4A4',
    accent: '#3A9445', deep: '#1A4820',
    themeColor: '#3A9445',
    desc: 'green palette',
  },
  'Third Eye': {
    pillBg: '#EEF0FF', pillText: '#3A3890',
    btnBg:  '#E4E6FF', btnBorder: '#7A78D4', btnText: '#28268A',
    wash:   '#F2F4FF', washBorder: '#B0AEED',
    accent: '#5552B8', deep: '#1E1C6A',
    themeColor: '#5552B8',
    desc: 'indigo palette',
  },
  'Throat': {
    pillBg: '#EAF4FF', pillText: '#1A5C88',
    btnBg:  '#D8EDFF', btnBorder: '#5AA0C8', btnText: '#0E3C60',
    wash:   '#F0F8FF', washBorder: '#90C8E8',
    accent: '#2A80B4', deep: '#0A2C50',
    themeColor: '#2A80B4',
    desc: 'blue palette',
  },
  'Sacral': {
    pillBg: '#FFF3E8', pillText: '#8B4410',
    btnBg:  '#FEECD8', btnBorder: '#D4820A', btnText: '#6A3008',
    wash:   '#FFF6EE', washBorder: '#E8B060',
    accent: '#C06818', deep: '#5A2800',
    themeColor: '#C06818',
    desc: 'warm orange palette',
  },
  'Root': {
    pillBg: '#FFF0F0', pillText: '#8B1A1A',
    btnBg:  '#FFE4E4', btnBorder: '#D45050', btnText: '#6A1010',
    wash:   '#FFF4F4', washBorder: '#E89090',
    accent: '#B83030', deep: '#580808',
    themeColor: '#B83030',
    desc: 'deep red palette',
  },
};

/**
 * Energetic Role label → icon CSS class.
 * Locked to the canonical 12-role set. Add entries only with Christie's approval.
 */
const ENERGETIC_ROLE_ICONS = {
  'Grounding':             'icon-grounding',
  'Protection':            'icon-protection',
  'Vitality':              'icon-vitality',
  'Heart Healing':         'icon-heart-healing',
  'Calm & Peace':          'icon-calm-peace',
  'Emotional Regulation':  'icon-emotional-regulation',
  'Clarity & Focus':       'icon-clarity-focus',
  'Intuition':             'icon-intuition',
  'Spiritual Connection':  'icon-spiritual-connection',
  'Transformation':        'icon-transformation',
  'Manifestation':         'icon-manifestation',
  'Amplification':         'icon-amplification',
};

// (Stone dot gradients are now auto-derived from Supabase via initStoneColors().
//  Manual overrides remain in GRADIENT_OVERRIDES above.)

/**
 * Theme icon assignments by group position (0-based across all theme groups).
 * Index 0 = Primary theme 1 → uses the stone's Energetic Role icon (set at runtime).
 * Index 1 = Primary theme 2 → upward-spark
 * Index 2 = Secondary theme 1 → todays-practice
 * Index 3 = Secondary theme 2 → best-for
 */
const THEME_ICONS_BY_POS = [
  null,                   // 0: Primary 1 — replaced with energetic role icon
  'icon-upward-spark',    // 1: Primary 2
  'icon-todays-practice', // 2: Secondary 1
  'icon-best-for',        // 3: Secondary 2
];

/**
 * Collector note icon rotation order.
 */
const NOTE_ICONS = [
  'icon-encyclopedia',
  'icon-geology',
  'icon-bookmark',
  'icon-book-reference',
];

// ────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ────────────────────────────────────────────────────────────────────────────

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function warn(msg) {
  process.stderr.write('  WARNING: ' + msg + '\n');
}

/**
 * Strips standalone thematic-break lines (---) from a parsed field value.
 * These leak in when a section ends with a separator before the next ## heading.
 */
function cleanField(text) {
  if (!text) return text;
  return text
    .split('\n')
    .filter(line => !/^---+\s*$/.test(line))
    .join('\n')
    .trim();
}

// ────────────────────────────────────────────────────────────────────────────
// MD PARSER
// ────────────────────────────────────────────────────────────────────────────

/**
 * Returns the text content of a ## Section, stopping at the next ## or # heading.
 */
function getH2Section(text, title) {
  const re = new RegExp('## ' + escapeRe(title) + '\\n([\\s\\S]*?)(?=\\n## |\\n# |$)');
  const m  = text.match(re);
  return m ? m[1].trim() : '';
}

/**
 * Returns the text content of a ### SubSection within a block,
 * stopping at the next ### or ## heading.
 */
function getH3Field(block, title) {
  const re = new RegExp('### ' + escapeRe(title) + '\\n([\\s\\S]*?)(?=\\n### |\\n## |$)');
  const m  = block.match(re);
  return m ? cleanField(m[1]) : '';
}

/**
 * Returns [{title, body}] for each #### block within text.
 */
function getH4Blocks(text) {
  const blocks = [];
  const re     = /#### ([^\n]+)\n([\s\S]*?)(?=\n#### |\n### |\n## |\n# |$)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    blocks.push({ title: m[1].trim(), body: cleanField(m[2]) });
  }
  return blocks;
}

/**
 * Returns [{title, body}] for each ### block within text,
 * stopping before ## headings.
 */
function getH3Blocks(text) {
  const blocks = [];
  const re     = /### ([^\n]+)\n([\s\S]*?)(?=\n### |\n## |\n# |$)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    blocks.push({ title: m[1].trim(), body: cleanField(m[2]) });
  }
  return blocks;
}

/**
 * Returns string array of bullet list items (- item).
 */
function getBullets(text) {
  return text.split('\n')
    .filter(l => /^- /.test(l))
    .map(l => l.replace(/^- /, '').trim())
    .filter(Boolean);
}

/**
 * Returns [{label, value}] rows from a markdown table.
 * Skips the header row (first |... row) and separator rows (|---|...).
 */
function getTableRows(text) {
  const lines = text.split('\n').filter(l => l.startsWith('|'));
  // Data rows start after the first separator line (|---|...|)
  const sepIdx  = lines.findIndex(l => /^\|[-:| ]+\|$/.test(l));
  const dataLines = sepIdx >= 0 ? lines.slice(sepIdx + 1) : lines.slice(1);
  return dataLines
    .filter(l => !/^\|[-:| ]+\|$/.test(l))
    .map(l => {
      const parts = l.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(p => p.trim());
      return { label: parts[0] || '', value: parts[1] || '' };
    })
    .filter(r => r.label && r.value);
}

/**
 * Parses the canonical MD and returns a structured data object.
 */
function parseMD(mdText) {
  // Exclude research notes (everything after # RESEARCH NOTES)
  const publicText = mdText.split(/\n# RESEARCH NOTES/)[0];

  const pageData   = getH2Section(publicText, 'Page Data');
  const hero       = getH2Section(publicText, 'Hero');
  const glance     = getH2Section(publicText, 'At a Glance');
  const overview   = getH2Section(publicText, 'Overview');
  const reach      = getH2Section(publicText, 'Why People Reach For It');
  const themes     = getH2Section(publicText, 'Energetic Themes');
  const mineral    = getH2Section(publicText, 'Mineral Profile');
  const notes      = getH2Section(publicText, 'Collector & Curiosity Notes');
  const care       = getH2Section(publicText, 'Care & Cleansing');
  const related    = getH2Section(publicText, 'Related Stones');

  // ── Page Data ──
  const name            = getH3Field(pageData, 'Name');
  const slug            = getH3Field(pageData, 'Slug');
  const collectionLabel = getH3Field(pageData, 'Collection Label');
  const imageUrl        = getH3Field(pageData, 'Image URL');
  const imageAlt        = getH3Field(pageData, 'Image Alt');

  const navBlock   = getH3Field(pageData, 'Navigation');
  const prevName   = (navBlock.match(/#### Previous Stone[\s\S]*?- Name:\s*(.+)/) || [])[1]?.trim() || '';
  const prevSlug   = (navBlock.match(/#### Previous Stone[\s\S]*?- Slug:\s*(.+)/) || [])[1]?.trim() || '';
  const nextName   = (navBlock.match(/#### Next Stone[\s\S]*?- Name:\s*(.+)/)     || [])[1]?.trim() || '';
  const nextSlug   = (navBlock.match(/#### Next Stone[\s\S]*?- Slug:\s*(.+)/)     || [])[1]?.trim() || '';

  // ── Hero ──
  const signature   = getH3Field(hero, 'Signature Line');
  const pills       = getBullets(getH3Field(hero, 'Property Pills'));
  const bestFor     = getH3Field(hero, 'Best For');
  const useWhen     = getH3Field(hero, 'Use When');
  const affirmation = getH3Field(hero, 'Affirmation');

  // ── At a Glance ──
  const glanceMap = {};
  getTableRows(glance).forEach(r => { glanceMap[r.label] = r.value; });

  const energeticRole   = glanceMap['Energetic Role']  || '';
  const chakraPrimary   = glanceMap['Chakra']           || '';
  const chakraSecondary = glanceMap['Secondary Chakra'] || null; // null = absent
  // Styling Chakra is optional. When present, overrides the palette lookup while
  // leaving the public-facing chakra fields (CHAKRA_NAME / CHAKRA_PRIMARY) unchanged.
  const rawStylingChakra = glanceMap['Styling Chakra'] || null;
  let stylingChakra;
  if (!rawStylingChakra) {
    process.stdout.write('  INFO: No Styling Chakra in MD — palette lookup defaulting to primary chakra "' + chakraPrimary + '".\n');
    stylingChakra = chakraPrimary;
  } else if (!CHAKRA_PALETTES[rawStylingChakra]) {
    process.stderr.write('ERROR: Styling Chakra "' + rawStylingChakra + '" is not a recognized chakra palette. Fix the MD or add the palette.\n');
    process.exit(1);
  } else {
    stylingChakra = rawStylingChakra;
  }
  const element         = glanceMap['Element']          || '';
  const planet          = glanceMap['Planet']           || '';
  const zodiac          = glanceMap['Zodiac']           || '';
  const colorEnergy     = glanceMap['Color Energy']     || '';

  // ── Overview (exactly 2 paragraphs) ──
  const overviewParas = overview
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p && !p.startsWith('#') && !/^---+$/.test(p));

  // ── Why People Reach For It (5 rows, each a ### heading + paragraph) ──
  const reachBlocks = getH3Blocks(reach);

  // ── Energetic Themes ──
  const primaryBlock    = getH3Field(themes, 'Primary');
  const secondaryBlock  = getH3Field(themes, 'Secondary');
  const occasionalBlock = getH3Field(themes, 'Occasional Associations');

  const primaryThemes   = getH4Blocks(primaryBlock);
  const secondaryThemes = secondaryBlock  ? getH4Blocks(secondaryBlock)  : [];
  const occasionalTags  = occasionalBlock ? getBullets(occasionalBlock)   : [];

  // ── Mineral Profile ──
  const factsBlock    = getH3Field(mineral, 'Mineral Facts');
  const mineralFacts  = getTableRows(factsBlock);
  const formation     = getH3Field(mineral, 'Formation');
  const localitiesRaw = getH3Field(mineral, 'Common Localities');
  const localities    = getBullets(localitiesRaw);
  const collectorCtx  = getH3Field(mineral, 'Collector Context');
  const collectorParas = collectorCtx
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p && !/^---+$/.test(p));

  // ── Collector & Curiosity Notes (3 or 4) ──
  // MD uses ### headings for note titles
  const noteBlocks = getH3Blocks(notes);

  // ── Care & Cleansing ──
  const careCleaning  = getH3Field(care, 'Cleaning');
  const careWater     = getH3Field(care, 'Water');
  const careLightHeat = getH3Field(care, 'Light & Heat');
  const careStorage   = getH3Field(care, 'Storage');

  // ── Related Stones ──
  function parseRelated(sectionText) {
    return getH4Blocks(sectionText).map(b => {
      const slugMatch   = b.body.match(/- Slug:\s*(.+)/);
      const reasonMatch = b.body.match(/- Reason:\s*([\s\S]+?)(?=\n- |$)/);
      return {
        name:   b.title,
        slug:   slugMatch   ? slugMatch[1].trim()   : '',
        reason: reasonMatch ? reasonMatch[1].trim()  : '',
      };
    });
  }

  const similarStones = parseRelated(getH3Field(related, 'Similar Energy'));
  const pairsStones   = parseRelated(getH3Field(related, 'Pairs Well With'));

  return {
    name, slug, collectionLabel, imageUrl, imageAlt,
    navPrevName: prevName, navPrevSlug: prevSlug,
    navNextName: nextName, navNextSlug: nextSlug,
    signature, pills, bestFor, useWhen, affirmation,
    energeticRole, chakraPrimary, chakraSecondary, stylingChakra,
    element, planet, zodiac, colorEnergy,
    overviewParas,
    reachBlocks,
    primaryThemes, secondaryThemes, occasionalTags,
    mineralFacts, formation, localities, collectorParas,
    noteBlocks,
    careCleaning, careWater, careLightHeat, careStorage,
    similarStones, pairsStones,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// HTML SECTION BUILDERS
// ────────────────────────────────────────────────────────────────────────────

function buildThemesBody(data, resolvedRoleIcon) {
  const { primaryThemes, secondaryThemes, occasionalTags } = data;
  const roleIcon = resolvedRoleIcon;

  function themeRow(theme, iconClass) {
    return (
      '\n              <div class="theme-row">' +
      '\n                <div class="theme-icon-tile">' +
      '\n                  <span aria-hidden="true" class="enc-icon ' + iconClass + '"></span>' +
      '\n                </div>' +
      '\n                <div>' +
      '\n                  <h3>' + escapeHtml(theme.title) + '</h3>' +
      '\n                  <p>' + escapeHtml(theme.body) + '</p>' +
      '\n                </div>' +
      '\n              </div>'
    );
  }

  let html = '';

  // Primary group (always present, 1–2 themes)
  html += '\n            <div class="theme-tier-group">';
  html += '\n              <div class="theme-tier-label">Primary</div>';
  primaryThemes.forEach((t, i) => {
    const icon = i === 0 ? roleIcon : (THEME_ICONS_BY_POS[i] || 'icon-upward-spark');
    html += themeRow(t, icon);
  });
  html += '\n            </div><!-- /theme-tier-group Primary -->';

  // Secondary group (conditional)
  if (secondaryThemes.length > 0) {
    html += '\n            <div class="theme-tier-group">';
    html += '\n              <hr class="theme-divider"/>';
    html += '\n              <div class="theme-tier-label">Secondary</div>';
    secondaryThemes.forEach((t, i) => {
      const posIdx = 2 + i;
      const icon   = THEME_ICONS_BY_POS[posIdx] || 'icon-upward-spark';
      html += themeRow(t, icon);
    });
    html += '\n            </div><!-- /theme-tier-group Secondary -->';
  }

  // Occasional group (conditional)
  if (occasionalTags.length > 0) {
    html += '\n            <div class="theme-tier-group">';
    html += '\n              <hr class="theme-divider"/>';
    html += '\n              <div class="theme-tier-label">Occasional Associations</div>';
    html += '\n              <div class="occasional-tags">';
    occasionalTags.forEach(tag => {
      html += '\n                <span class="occ-tag">' + escapeHtml(tag) + '</span>';
    });
    html += '\n              </div>';
    html += '\n            </div><!-- /theme-tier-group Occasional -->';
  }

  return html;
}

function buildNotesBody(noteBlocks) {
  return noteBlocks.map((note, i) => {
    const icon = NOTE_ICONS[i % NOTE_ICONS.length];
    return (
      '\n              <div class="note-row">' +
      '\n                <div class="note-icon">' +
      '\n                  <span aria-hidden="true" class="enc-icon ' + icon + '"></span>' +
      '\n                </div>' +
      '\n                <div>' +
      '\n                  <strong>' + escapeHtml(note.title) + '</strong>' +
      '\n                  <p>' + escapeHtml(note.body) + '</p>' +
      '\n                </div>' +
      '\n              </div>'
    );
  }).join('');
}

function buildDotGradientsCss(stoneName, allRelated) {
  let css = '/* Stone dot gradients for ' + stoneName + "'s related stones */\n";
  allRelated.forEach(stone => {
    const gradient = getGradient(stone.slug);
    if (!gradient) {
      warn('No dot gradient for slug "' + stone.slug + '". Add to GRADIENT_OVERRIDES or verify Supabase color_hex for that stone.');
      css += '/* WARNING: gradient for ' + stone.slug + ' not registered */\n';
    } else {
      css += '.stone-dot-' + stone.slug + ' { background: ' + gradient + '; }\n';
    }
  });
  return css.trimEnd();
}

function buildRelatedStoneLink(stone) {
  return (
    '\n              <a class="stone-link-row" href="' + stone.slug + '.html">' +
    '\n                <span class="stone-dot-circle stone-dot-' + stone.slug + '"></span>' +
    '\n                <div>' +
    '\n                  <b>' + escapeHtml(stone.name) + '</b>' +
    '\n                  <span class="stone-reason">' + escapeHtml(stone.reason) + '</span>' +
    '\n                </div>' +
    '\n              </a>'
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN GENERATOR
// ────────────────────────────────────────────────────────────────────────────

function generate(mdPath, dryRun) {
  // ── Read inputs ──
  if (!fs.existsSync(mdPath)) {
    process.stderr.write('ERROR: MD file not found: ' + mdPath + '\n');
    process.exit(1);
  }
  if (!fs.existsSync(TEMPLATE_PATH)) {
    process.stderr.write('ERROR: Canonical template not found: ' + TEMPLATE_PATH + '\n');
    process.exit(1);
  }

  const mdText       = fs.readFileSync(mdPath, 'utf8');
  const templateText = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const data         = parseMD(mdText);

  const {
    name, slug, collectionLabel, imageUrl, imageAlt,
    signature, pills, bestFor, useWhen, affirmation,
    energeticRole, chakraPrimary, chakraSecondary, stylingChakra,
    element, planet, zodiac, colorEnergy,
    overviewParas, reachBlocks,
    primaryThemes, secondaryThemes, occasionalTags,
    mineralFacts, formation, localities, collectorParas,
    noteBlocks,
    careCleaning, careWater, careLightHeat, careStorage,
    similarStones, pairsStones,
  } = data;

  // ── Source Previous/Next navigation from CSV (sole authority) ──
  if (!NAV_MAP.has(slug)) {
    process.stderr.write('ERROR: Slug "' + slug + '" is absent from the canonical nav CSV.\n');
    process.exit(1);
  }
  const navEntry = NAV_MAP.get(slug);
  // Duplicate-slug check already done at startup in loadRosterAndNav().
  const navPrevName = navEntry.prevName;
  const navPrevSlug = navEntry.prevSlug;
  const navNextName = navEntry.nextName;
  const navNextSlug = navEntry.nextSlug;

  if (!navPrevSlug && navPrevName && navPrevName.toLowerCase() !== 'null') {
    process.stderr.write('ERROR: Previous stone name is present but previous slug is missing for "' + slug + '" in the nav CSV.\n');
    process.exit(1);
  }
  if (!navNextSlug && navNextName && navNextName.toLowerCase() !== 'null') {
    process.stderr.write('ERROR: Next stone name is present but next slug is missing for "' + slug + '" in the nav CSV.\n');
    process.exit(1);
  }
  // For stones that are not at the edges of the catalog, both prev and next are required.
  if (navPrevName && navPrevName.toLowerCase() !== 'null' && !navPrevSlug) {
    process.stderr.write('ERROR: Missing previous slug for "' + slug + '" in the nav CSV.\n');
    process.exit(1);
  }
  if (navNextName && navNextName.toLowerCase() !== 'null' && !navNextSlug) {
    process.stderr.write('ERROR: Missing next slug for "' + slug + '" in the nav CSV.\n');
    process.exit(1);
  }
  if (navPrevSlug && navPrevSlug.toLowerCase() !== 'null' && !CANONICAL_ROSTER.has(navPrevSlug)) {
    process.stderr.write('ERROR: Previous nav slug "' + navPrevSlug + '" is referenced in nav CSV but is not present in the 333-stone roster.\n');
    process.exit(1);
  }
  if (navNextSlug && navNextSlug.toLowerCase() !== 'null' && !CANONICAL_ROSTER.has(navNextSlug)) {
    process.stderr.write('ERROR: Next nav slug "' + navNextSlug + '" is referenced in nav CSV but is not present in the 333-stone roster.\n');
    process.exit(1);
  }

  // ── Validate required lookups ──
  const palette = CHAKRA_PALETTES[stylingChakra];
  if (!palette) {
    process.stderr.write('ERROR: No chakra palette registered for "' + stylingChakra + '". Add it to CHAKRA_PALETTES.\n');
    process.exit(1);
  }

  const resolvedRoleIcon = ENERGETIC_ROLE_ICONS[energeticRole];
  if (!resolvedRoleIcon) {
    process.stderr.write('ERROR: No icon registered for Energetic Role "' + energeticRole + '". Add it to ENERGETIC_ROLE_ICONS.\n');
    process.exit(1);
  }

  // ── Structural-count hard failures ──
  function hardFail(msg) {
    process.stderr.write('ERROR: ' + msg + '\n');
    process.exit(1);
  }

  if (pills.length !== 3)
    hardFail('Property Pills: expected exactly 3, found ' + pills.length + '.');
  if (overviewParas.length !== 2)
    hardFail('Overview: expected exactly 2 paragraphs, found ' + overviewParas.length + '.');
  if (reachBlocks.length !== 5)
    hardFail('Why People Reach For It: expected exactly 5 rows, found ' + reachBlocks.length + '.');
  if (mineralFacts.length !== 8)
    hardFail('Mineral Profile facts: expected exactly 8 rows, found ' + mineralFacts.length + '.');
  if (collectorParas.length !== 3)
    hardFail('Collector Context: expected exactly 3 paragraphs, found ' + collectorParas.length + '.');
  if (noteBlocks.length < 3 || noteBlocks.length > 4)
    hardFail('Collector Notes: expected 3 or 4, found ' + noteBlocks.length + '.');
  if (similarStones.length !== 2)
    hardFail('Similar Energy: expected exactly 2 stones, found ' + similarStones.length + '.');
  if (pairsStones.length !== 2)
    hardFail('Pairs Well With: expected exactly 2 stones, found ' + pairsStones.length + '.');
  if (primaryThemes.length < 1 || primaryThemes.length > 2)
    hardFail('Primary Themes: expected 1 or 2, found ' + primaryThemes.length + '.');
  if (secondaryThemes.length > 2)
    hardFail('Secondary Themes: expected 0 to 2, found ' + secondaryThemes.length + '.');
  if (occasionalTags.length > 2)
    hardFail('Occasional Associations: expected 0 to 2, found ' + occasionalTags.length + '.');
  if (!careCleaning || !careWater || !careLightHeat || !careStorage) {
    const missing = ['Cleaning', 'Water', 'Light & Heat', 'Storage']
      .filter((_, i) => ![careCleaning, careWater, careLightHeat, careStorage][i]);
    hardFail('Care & Cleansing: missing or empty fields: ' + missing.join(', ') + '.');
  }

  // ── Related Stones uniqueness ──
  const allRelated      = [...similarStones, ...pairsStones];
  const relatedSlugs    = allRelated.map(s => s.slug);
  const uniqueRelated   = new Set(relatedSlugs);
  if (uniqueRelated.size !== relatedSlugs.length)
    hardFail('Related Stones: duplicate slug found among the 4 related stones (' + relatedSlugs.join(', ') + ').');
  if (relatedSlugs.includes(slug))
    hardFail('Related Stones: a related stone slug matches the page\'s own slug "' + slug + '".');

  // ── Canonical roster slug validation ──
  if (!CANONICAL_ROSTER.has(slug))
    hardFail('Slug "' + slug + '" is not in the canonical roster (' + ROSTER_PATH + ').');
  for (const stone of allRelated) {
    if (stone.slug && !CANONICAL_ROSTER.has(stone.slug))
      hardFail('Related stone slug "' + stone.slug + '" is not in the canonical roster.');
  }

  // ── Build section HTML ──
  const themesBodyHtml    = buildThemesBody(data, resolvedRoleIcon);
  const notesBodyHtml     = buildNotesBody(noteBlocks);
  const localitiesHtml    = localities.map(l => '\n                <li>' + escapeHtml(l) + '</li>').join('');
  const dotGradientsCss   = buildDotGradientsCss(name, allRelated);

  const chakraSecondaryHtml = chakraSecondary
    ? '\n            <span class="chakra-secondary">Also: ' + escapeHtml(chakraSecondary) + '</span>'
    : '';

  // ── Simple token map ──
  function r(i) { return reachBlocks[i]  || { title: '', body: '' }; }
  function f(i) { return mineralFacts[i] || { label: '', value: '' }; }

  const tokens = {
    '{{STONE_SLUG}}':           slug,
    '{{STONE_NAME}}':           escapeHtml(name),
    '{{THEME_COLOR_HEX}}':      palette.themeColor,
    '{{CHAKRA_NAME}}':          escapeHtml(chakraPrimary),
    '{{CHAKRA_PALETTE_DESCRIPTION}}': palette.desc,
    '{{CK_PILL_BG}}':           palette.pillBg,
    '{{CK_PILL_TEXT}}':         palette.pillText,
    '{{CK_BTN_BG}}':            palette.btnBg,
    '{{CK_BTN_BORDER}}':        palette.btnBorder,
    '{{CK_BTN_TEXT}}':          palette.btnText,
    '{{CK_WASH}}':              palette.wash,
    '{{CK_WASH_BORDER}}':       palette.washBorder,
    '{{CK_ACCENT}}':            palette.accent,
    '{{CK_DEEP}}':              palette.deep,
    '{{STONE_IMAGE_URL}}':      imageUrl,
    '{{STONE_IMAGE_ALT}}':      escapeHtml(imageAlt),
    '{{COLLECTION_LABEL}}':     escapeHtml(collectionLabel),
    '{{STONE_SIGNATURE}}':      escapeHtml(signature),
    '{{PILL_1}}':               escapeHtml(pills[0] || ''),
    '{{PILL_2}}':               escapeHtml(pills[1] || ''),
    '{{PILL_3}}':               escapeHtml(pills[2] || ''),
    '{{BEST_FOR}}':             escapeHtml(bestFor),
    '{{USE_WHEN}}':             escapeHtml(useWhen),
    '{{ENERGETIC_ROLE_ICON}}':  resolvedRoleIcon,
    '{{AFFIRMATION}}':          escapeHtml(affirmation),
    '{{ENERGETIC_ROLE}}':       escapeHtml(energeticRole),
    '{{CHAKRA_PRIMARY}}':       escapeHtml(chakraPrimary),
    '{{ELEMENT}}':              escapeHtml(element),
    '{{PLANET}}':               escapeHtml(planet),
    '{{ZODIAC}}':               escapeHtml(zodiac),
    '{{COLOR_ENERGY}}':         escapeHtml(colorEnergy),
    '{{OVERVIEW_PARAGRAPH_1}}': escapeHtml(overviewParas[0] || ''),
    '{{OVERVIEW_PARAGRAPH_2}}': escapeHtml(overviewParas[1] || ''),
    '{{REACH_LABEL_1}}':        escapeHtml(r(0).title),
    '{{REACH_DESC_1}}':         escapeHtml(r(0).body),
    '{{REACH_LABEL_2}}':        escapeHtml(r(1).title),
    '{{REACH_DESC_2}}':         escapeHtml(r(1).body),
    '{{REACH_LABEL_3}}':        escapeHtml(r(2).title),
    '{{REACH_DESC_3}}':         escapeHtml(r(2).body),
    '{{REACH_LABEL_4}}':        escapeHtml(r(3).title),
    '{{REACH_DESC_4}}':         escapeHtml(r(3).body),
    '{{REACH_LABEL_5}}':        escapeHtml(r(4).title),
    '{{REACH_DESC_5}}':         escapeHtml(r(4).body),
    '{{MINERAL_FACT_1_LABEL}}': escapeHtml(f(0).label),
    '{{MINERAL_FACT_1_VALUE}}': escapeHtml(f(0).value),
    '{{MINERAL_FACT_2_LABEL}}': escapeHtml(f(1).label),
    '{{MINERAL_FACT_2_VALUE}}': escapeHtml(f(1).value),
    '{{MINERAL_FACT_3_LABEL}}': escapeHtml(f(2).label),
    '{{MINERAL_FACT_3_VALUE}}': escapeHtml(f(2).value),
    '{{MINERAL_FACT_4_LABEL}}': escapeHtml(f(3).label),
    '{{MINERAL_FACT_4_VALUE}}': escapeHtml(f(3).value),
    '{{MINERAL_FACT_5_LABEL}}': escapeHtml(f(4).label),
    '{{MINERAL_FACT_5_VALUE}}': escapeHtml(f(4).value),
    '{{MINERAL_FACT_6_LABEL}}': escapeHtml(f(5).label),
    '{{MINERAL_FACT_6_VALUE}}': escapeHtml(f(5).value),
    '{{MINERAL_FACT_7_LABEL}}': escapeHtml(f(6).label),
    '{{MINERAL_FACT_7_VALUE}}': escapeHtml(f(6).value),
    '{{MINERAL_FACT_8_LABEL}}': escapeHtml(f(7).label),
    '{{MINERAL_FACT_8_VALUE}}': escapeHtml(f(7).value),
    '{{FORMATION_PARAGRAPH}}':  escapeHtml(formation),
    '{{COMMON_LOCALITIES_ITEMS}}': localitiesHtml,
    '{{MINERAL_NOTE_1}}':       escapeHtml(collectorParas[0] || ''),
    '{{MINERAL_NOTE_2}}':       escapeHtml(collectorParas[1] || ''),
    '{{MINERAL_NOTE_3}}':       escapeHtml(collectorParas[2] || ''),
    '{{CARE_CLEANING}}':        escapeHtml(careCleaning),
    '{{CARE_WATER}}':           escapeHtml(careWater),
    '{{CARE_LIGHT_HEAT}}':      escapeHtml(careLightHeat),
    '{{CARE_STORAGE}}':         escapeHtml(careStorage),
    '{{NAV_PREV_SLUG}}':        navPrevSlug,
    '{{NAV_PREV_NAME}}':        escapeHtml(navPrevName),
    '{{NAV_NEXT_SLUG}}':        navNextSlug,
    '{{NAV_NEXT_NAME}}':        escapeHtml(navNextName),
    // Related stone tokens (similar 1 & 2, pairs 3 & 4)
    '{{RELATED_STONE_1_SLUG}}':   similarStones[0]?.slug   || '',
    '{{RELATED_STONE_1_NAME}}':   escapeHtml(similarStones[0]?.name   || ''),
    '{{RELATED_STONE_1_REASON}}': escapeHtml(similarStones[0]?.reason || ''),
    '{{RELATED_STONE_2_SLUG}}':   similarStones[1]?.slug   || '',
    '{{RELATED_STONE_2_NAME}}':   escapeHtml(similarStones[1]?.name   || ''),
    '{{RELATED_STONE_2_REASON}}': escapeHtml(similarStones[1]?.reason || ''),
    '{{RELATED_STONE_3_SLUG}}':   pairsStones[0]?.slug     || '',
    '{{RELATED_STONE_3_NAME}}':   escapeHtml(pairsStones[0]?.name     || ''),
    '{{RELATED_STONE_3_REASON}}': escapeHtml(pairsStones[0]?.reason   || ''),
    '{{RELATED_STONE_4_SLUG}}':   pairsStones[1]?.slug     || '',
    '{{RELATED_STONE_4_NAME}}':   escapeHtml(pairsStones[1]?.name     || ''),
    '{{RELATED_STONE_4_REASON}}': escapeHtml(pairsStones[1]?.reason   || ''),
    // Gradient placeholders in CSS (handled by block replacement below, but included as safety)
    '{{RELATED_STONE_1_GRADIENT}}': getGradient(similarStones[0]?.slug) || '',
    '{{RELATED_STONE_2_GRADIENT}}': getGradient(similarStones[1]?.slug) || '',
    '{{RELATED_STONE_3_GRADIENT}}': getGradient(pairsStones[0]?.slug)   || '',
    '{{RELATED_STONE_4_GRADIENT}}': getGradient(pairsStones[1]?.slug)   || '',
  };

  // ── Apply simple token substitutions (outside HTML comments only) ──
  // Extract all HTML comments first so tokens inside doc-comments don't expand.
  const extractedComments = [];
  let html = templateText.replace(/<!--[\s\S]*?-->/g, (match) => {
    const idx = extractedComments.length;
    extractedComments.push(match);
    return `<!--__COMMENT_${idx}__-->`;
  });

  for (const [token, value] of Object.entries(tokens)) {
    // Replace all occurrences (some tokens like STONE_NAME appear multiple times)
    html = html.split(token).join(value);
  }

  // Reinsert original (unmodified) comments
  extractedComments.forEach((comment, idx) => {
    html = html.replace(`<!--__COMMENT_${idx}__-->`, comment);
  });

  // ── Handle chakra secondary span ──
  // Template: <span class="chakra-secondary">{{CHAKRA_SECONDARY}}</span>
  // After token substitution, {{CHAKRA_SECONDARY}} is replaced by '' (empty string from above)
  // But we need to handle the span itself conditionally.
  // We keep {{CHAKRA_SECONDARY}} out of the simple token map and handle it here:
  if (chakraSecondary) {
    html = html.replace(
      /<span class="chakra-secondary">\{\{CHAKRA_SECONDARY\}\}<\/span>/,
      '<span class="chakra-secondary">Also: ' + escapeHtml(chakraSecondary) + '</span>'
    );
  } else {
    // Remove the span entirely (including surrounding newline/whitespace)
    html = html.replace(
      /\s*<span class="chakra-secondary">\{\{CHAKRA_SECONDARY\}\}<\/span>/,
      ''
    );
  }

  // ── Replace stone dot gradient CSS block ──
  // The template has a 5-line block: one comment + 4 gradient lines.
  // We replace the entire block (comment through end of last gradient line).
  html = html.replace(
    /\/\* Stone dot gradients for[^*]*\*\/\n(?:\.stone-dot-[^\n]+\n){0,4}/,
    dotGradientsCss + '\n'
  );

  // ── Replace Energetic Themes rail-card-body ──
  // Target: content between <div class="rail-card-body"> and </div><!-- /rail-card-body -->
  // inside the #themes section. We use the section ID anchor to scope this.
  html = html.replace(
    /(<section class="rail-card" id="themes">[\s\S]*?<div class="rail-card-body">)([\s\S]*?)(<\/div><!-- \/rail-card-body -->[\s\S]*?<\/section><!-- \/ENERGETIC THEMES -->)/,
    (_, before, _inner, after) => before + '\n' + themesBodyHtml + '\n\n          ' + after
  );

  // ── Replace Collector Notes note-list ──
  // Target: content between <div class="note-list"> and </div><!-- /note-list -->
  // inside the #notes section.
  html = html.replace(
    /(<section class="rail-card" id="notes">[\s\S]*?<div class="note-list">)([\s\S]*?)(<\/div><!-- \/note-list -->)/,
    (_, before, _inner, after) => before + '\n' + notesBodyHtml + '\n\n            ' + after
  );

  // ── Hard validation (outside HTML comments only) ──
  const htmlRenderedOnly = html.replace(/<!--[\s\S]*?-->/g, '');

  const remainingTokens = htmlRenderedOnly.match(/\{\{[A-Z_]+\}\}/g);
  if (remainingTokens) {
    const unique = [...new Set(remainingTokens)];
    process.stderr.write('ERROR: Unresolved placeholders in generated HTML: ' + unique.join(', ') + '\n');
    process.exit(1);
  }

  if (/^---\s*$/m.test(htmlRenderedOnly)) {
    process.stderr.write('ERROR: Standalone --- separator leaked into rendered content.\n');
    process.exit(1);
  }

  // ── Update architecture comment to include stone name ──
  html = html.replace(
    '<!-- ARCHITECTURE VERSION: 2026-06-20-canonical | CANONICAL TEMPLATE — derived from final citrine.html -->',
    '<!-- ARCHITECTURE VERSION: 2026-06-20-canonical | ' + name.toUpperCase() + ' -->'
  );

  return html;
}

// ────────────────────────────────────────────────────────────────────────────
// ENTRY POINT
// ────────────────────────────────────────────────────────────────────────────

(async function main() {
  const args    = process.argv.slice(2).filter(a => a !== '--dry-run');
  const dryRun  = process.argv.includes('--dry-run');
  const mdPath  = args[0];

  if (!mdPath) {
    process.stderr.write(
      'Usage: node stones/generate-stone-page.js <path-to-md> [--dry-run]\n' +
      '\n' +
      'Examples:\n' +
      '  node stones/generate-stone-page.js docs/encyclopedia/entries/black-tourmaline.md\n' +
      '  node stones/generate-stone-page.js docs/encyclopedia/entries/black-tourmaline.md --dry-run\n'
    );
    process.exit(1);
  }

  await initStoneColors();

  process.stdout.write('📖  Reading ' + path.basename(mdPath) + '...\n');

  let html;
  try {
    html = generate(path.resolve(mdPath), dryRun);
  } catch (err) {
    process.stderr.write('ERROR: ' + err.message + '\n');
    process.exit(1);
  }

  // Re-parse slug from the MD for the output filename
  const slugMatch = fs.readFileSync(path.resolve(mdPath), 'utf8').match(/### Slug\n([^\n]+)/);
  const slug      = slugMatch ? slugMatch[1].trim() : path.basename(mdPath, '.md');
  const outPath   = path.join(OUTPUT_DIR, slug + '.html');

  if (dryRun) {
    process.stdout.write('✅  Dry run — output NOT written.\n');
    process.stdout.write('   Would write: ' + outPath + '\n');
    process.stdout.write('   Output length: ' + html.length + ' characters\n');
    // Print first 60 lines for a sanity check
    process.stdout.write('\n── First 60 lines of generated output ──\n\n');
    html.split('\n').slice(0, 60).forEach((line, i) => {
      process.stdout.write((i + 1).toString().padStart(3) + '  ' + line + '\n');
    });
  } else {
    fs.writeFileSync(outPath, html, 'utf8');
    process.stdout.write('✅  Written: ' + outPath + '\n');
    process.stdout.write('   ' + html.split('\n').length + ' lines | ' + html.length + ' characters\n');
  }

  process.stdout.write('\n⚠️   REMINDER: Do not add "' + slug + '" to enc-nav.js until Christie approves the output.\n');
})();
