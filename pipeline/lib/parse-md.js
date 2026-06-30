'use strict';

/**
 * Parses a canonical encyclopedia MD file into structured sections.
 * Throws a descriptive error on any validation failure.
 * Returns null on a valid optional-section omission (caller handles).
 */

function parseFrontMatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error('Missing or malformed YAML front matter block.');
  const fm = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
    fm[key] = val;
  }
  for (const required of ['stone_id', 'stone_name', 'stone_slug', 'production_data_version']) {
    if (!fm[required]) throw new Error(`Front matter missing required field: ${required}`);
  }
  return { frontMatter: fm, body: text.slice(match[0].length) };
}

function splitTopLevelSections(body) {
  const sections = {};
  const pattern = /^# (.+)$/gm;
  const matches = [...body.matchAll(pattern)];
  for (let i = 0; i < matches.length; i++) {
    const heading = matches[i][1].trim();
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : body.length;
    sections[heading] = body.slice(start, end).trim();
  }
  return sections;
}

const REQUIRED_SECTIONS = [
  'Hero',
  'Overview',
  'Why People Reach For It',
  'Energetic Themes',
  'Mineral Profile',
  'Collector & Curiosity Notes',
  'Care & Cleaning',
  'Related Stones',
];
const OPTIONAL_SECTIONS = ['Market & Buying Notes'];
const ALL_KNOWN = new Set([...REQUIRED_SECTIONS, ...OPTIONAL_SECTIONS]);

function validateSectionSet(sections) {
  for (const key of Object.keys(sections)) {
    if (!ALL_KNOWN.has(key)) throw new Error(`Unrecognized top-level section: "# ${key}"`);
  }
  for (const req of REQUIRED_SECTIONS) {
    if (!sections[req]) throw new Error(`Required section missing: "# ${req}"`);
    if (!sections[req].trim()) throw new Error(`Required section is empty: "# ${req}"`);
  }
}

function splitSubsections(text, level = '##') {
  const pattern = new RegExp(`^${level} (.+)$`, 'gm');
  const matches = [...text.matchAll(pattern)];
  const subs = {};
  for (let i = 0; i < matches.length; i++) {
    const heading = matches[i][1].trim();
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    subs[heading] = text.slice(start, end).trim();
  }
  return subs;
}

function extractIconAndBody(text, context) {
  const iconMatch = text.match(/^\*\*Icon:\*\*\s*`(icon-[a-z0-9-]+)`/m);
  if (!iconMatch) throw new Error(`Missing **Icon:** line in: ${context}`);
  const icon = iconMatch[1];
  const body = text.replace(/^\*\*Icon:\*\*\s*`.+`\n?/, '').trim();
  if (!body) throw new Error(`Empty body in: ${context}`);
  return { icon, body };
}

function extractSlugAndBody(text, context) {
  const slugMatch = text.match(/^\*\*Slug:\*\*\s*`([a-z0-9-]+)`/m);
  if (!slugMatch) throw new Error(`Missing **Slug:** line in: ${context}`);
  const slug = slugMatch[1];
  const body = text.replace(/^\*\*Slug:\*\*\s*`.+`\n?/, '').trim();
  if (!body) throw new Error(`Empty reason in: ${context}`);
  return { slug, body };
}

function parseHero(text) {
  const subs = splitSubsections(text);
  const required = ['Signature Line', 'Property Pills', 'Best For', 'Use When', 'Affirmation'];
  for (const r of required) {
    if (!subs[r]) throw new Error(`Hero missing required subheading: "## ${r}"`);
  }
  const pills = subs['Property Pills']
    .split('\n')
    .filter(l => l.startsWith('- '))
    .map(l => l.slice(2).trim());
  if (pills.length !== 3) throw new Error(`Hero Property Pills: expected 3, found ${pills.length}`);
  return {
    signature_line: subs['Signature Line'].trim(),
    pill_1: pills[0],
    pill_2: pills[1],
    pill_3: pills[2],
    best_for: subs['Best For'].trim(),
    use_when: subs['Use When'].trim(),
    affirmation: subs['Affirmation'].trim(),
  };
}

function parseOverview(text) {
  const subs = splitSubsections(text);
  if (!subs['Paragraph 1']) throw new Error('Overview missing "## Paragraph 1"');
  if (!subs['Paragraph 2']) throw new Error('Overview missing "## Paragraph 2"');
  return {
    overview_p1: subs['Paragraph 1'].trim(),
    overview_p2: subs['Paragraph 2'].trim(),
  };
}

function parseReachFor(text) {
  const subs = splitSubsections(text);
  const entries = Object.entries(subs);
  if (entries.length !== 5) {
    throw new Error(`Why People Reach For It: expected 5 rows, found ${entries.length}`);
  }
  return entries.map(([label, desc], i) => ({
    label: label.trim(),
    description: desc.trim(),
    display_order: i + 1,
  }));
}

function parseEnergeticThemes(text) {
  const subs = splitSubsections(text);
  if (!subs['Primary']) throw new Error('Energetic Themes missing "## Primary"');

  function parseThemeTier(tierText, tierName) {
    const themeSubs = splitSubsections(tierText, '###');
    return Object.entries(themeSubs).map(([title, body], i) => {
      const { icon, body: desc } = extractIconAndBody(body, `Energetic Themes > ${tierName} > ${title}`);
      return { title: title.trim(), icon_slug: icon, description: desc, display_order: i + 1, tier: tierName.toLowerCase() };
    });
  }

  function parseOccasional(tierText) {
    return tierText
      .split('\n')
      .filter(l => l.startsWith('- '))
      .map((l, i) => ({ title: l.slice(2).trim(), icon_slug: null, description: null, display_order: i + 1, tier: 'occasional' }));
  }

  const primary = parseThemeTier(subs['Primary'], 'Primary');
  if (primary.length < 1 || primary.length > 2) {
    throw new Error(`Energetic Themes Primary: expected 1–2 themes, found ${primary.length}`);
  }

  const secondary = subs['Secondary'] ? parseThemeTier(subs['Secondary'], 'Secondary') : [];
  const occasional = subs['Occasional Associations'] ? parseOccasional(subs['Occasional Associations']) : [];

  return [...primary, ...secondary, ...occasional];
}

function parseMineralProfile(text) {
  const subs = splitSubsections(text);
  for (const req of ['Mineral Facts', 'Common Localities', 'Formation', 'Quality Indicators', 'Identification']) {
    if (!subs[req]) throw new Error(`Mineral Profile missing required subheading: "## ${req}"`);
    if (!subs[req].trim()) throw new Error(`Mineral Profile subheading is empty: "## ${req}"`);
  }

  const tableLines = subs['Mineral Facts']
    .split('\n')
    .filter(l => l.startsWith('|') && !l.match(/^\|\s*Label\s*\|/i) && !l.match(/^\|\s*-/));
  const mineralFacts = tableLines.map((l, i) => {
    const parts = l.split('|').filter(p => p.trim() !== '');
    if (parts.length < 2) throw new Error(`Mineral Facts row ${i + 1} malformed: ${l}`);
    return { label: parts[0].trim(), value: parts[1].trim(), display_order: i + 1 };
  });
  if (mineralFacts.length !== 8) {
    throw new Error(`Mineral Facts: expected exactly 8 rows, found ${mineralFacts.length}`);
  }

  const localities = subs['Common Localities']
    .split('\n')
    .filter(l => l.startsWith('- '))
    .map((l, i) => ({ locality: l.slice(2).trim(), display_order: i + 1 }));
  if (localities.length === 0) throw new Error('Common Localities: at least one locality required');

  return {
    formation: subs['Formation'].trim(),
    collector_context_p1: subs['Quality Indicators'].trim(),
    collector_context_p2: subs['Identification'].trim(),
    collector_context_p4: subs['Locality Variations'] ? subs['Locality Variations'].trim() : null,
    collector_context_p5: subs['Physical Handling'] ? subs['Physical Handling'].trim() : null,
    mineralFacts,
    localities,
  };
}

function parseCollectorNotes(text) {
  const subs = splitSubsections(text);
  const entries = Object.entries(subs);
  if (entries.length < 3 || entries.length > 4) {
    throw new Error(`Collector & Curiosity Notes: expected 3–4 notes, found ${entries.length}`);
  }
  return entries.map(([title, body], i) => {
    const { icon, body: noteBody } = extractIconAndBody(body, `Collector Notes > ${title}`);
    return { title: title.trim(), icon_slug: icon, body: noteBody, display_order: i + 1 };
  });
}

function parseCare(text) {
  const subs = splitSubsections(text);
  const fixed = ['Cleaning', 'Water', 'Light & Heat', 'Storage'];
  for (const cat of fixed) {
    if (!subs[cat]) throw new Error(`Care & Cleaning missing required subheading: "## ${cat}"`);
    if (!subs[cat].trim()) throw new Error(`Care & Cleaning subheading is empty: "## ${cat}"`);
  }
  return fixed.map((cat, i) => ({ category: cat, body: subs[cat].trim(), display_order: i + 1 }));
}

function parseRelatedStones(text) {
  const subs = splitSubsections(text);
  if (!subs['Similar Energy']) throw new Error('Related Stones missing "## Similar Energy"');
  if (!subs['Pairs Well With']) throw new Error('Related Stones missing "## Pairs Well With"');

  function parseGroup(groupText, groupSlug) {
    const stoneSubs = splitSubsections(groupText, '###');
    const entries = Object.entries(stoneSubs);
    if (entries.length !== 2) {
      throw new Error(`Related Stones > ${groupSlug}: expected exactly 2 stones, found ${entries.length}`);
    }
    return entries.map(([name, body], i) => {
      const { slug, body: reason } = extractSlugAndBody(body, `Related Stones > ${groupSlug} > ${name}`);
      return { related_name: name.trim(), related_slug: slug, reason: reason.trim(), group: groupSlug, display_order: i + 1 };
    });
  }

  return [
    ...parseGroup(subs['Similar Energy'], 'similar_energy'),
    ...parseGroup(subs['Pairs Well With'], 'pairs_well_with'),
  ];
}

function parseMD(fileText) {
  const { frontMatter, body } = parseFrontMatter(fileText);
  const sections = splitTopLevelSections(body);
  validateSectionSet(sections);

  return {
    frontMatter,
    hero: parseHero(sections['Hero']),
    overview: parseOverview(sections['Overview']),
    reachFor: parseReachFor(sections['Why People Reach For It']),
    themes: parseEnergeticThemes(sections['Energetic Themes']),
    mineralProfile: parseMineralProfile(sections['Mineral Profile']),
    collectorNotes: parseCollectorNotes(sections['Collector & Curiosity Notes']),
    marketNotes: sections['Market & Buying Notes'] ? sections['Market & Buying Notes'].trim() : null,
    care: parseCare(sections['Care & Cleaning']),
    relatedStones: parseRelatedStones(sections['Related Stones']),
  };
}

module.exports = { parseMD };
