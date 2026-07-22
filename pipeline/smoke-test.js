#!/usr/bin/env node
'use strict';

/**
 * 2F — Rendered-Page Smoke Test
 *
 * Deterministic checks only — no subjective layout judgment:
 *   - required selectors exist (matched against the current stones/stone.html DOM)
 *   - required text fields are non-blank
 *   - expected row/section counts render
 *   - all images load (HTTP 200)
 *   - no console errors
 *   - no null, undefined, or fallback states visible
 *   - icon mask URLs resolve
 *   - related-stone color dots resolve (no gray fallback triggered)
 *
 * Requires: npm install puppeteer
 *
 * Usage:
 *   node pipeline/smoke-test.js --packet <path> --base-url <url> [--packet <path> ...]
 *
 * Example:
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... \
 *   node pipeline/smoke-test.js \
 *     --packet pipeline/output/citrine.packet.json \
 *     --base-url https://stillpointlapidary.com
 */

const fs = require('fs');

function parseArgs() {
  const args = process.argv.slice(2);
  const packets = [];
  let baseUrl = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--packet') packets.push(args[++i]);
    if (args[i] === '--base-url') baseUrl = args[++i];
  }
  if (packets.length === 0 || !baseUrl) {
    console.error('Usage: node pipeline/smoke-test.js --packet <path> [--packet <path> ...] --base-url <url>');
    process.exit(1);
  }
  return { packets, baseUrl };
}

async function smokeTestStone(page, stoneSlug, stoneName, baseUrl) {
  const url = `${baseUrl}/stones/stone.html?slug=${stoneSlug}`;
  const errors = [];
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Required selectors
  const requiredSelectors = [
    '.stone-photo-wrap img',
    '.stone-name',
    '.stone-signature',
    '.theme-pill',
    '.hero-section',
    '.glance-grid',
    '#overview',
    '#reach',
    '#themes',
    '#mineral',
    '#notes',
    '#care',
    '#related',
  ];

  for (const sel of requiredSelectors) {
    const el = await page.$(sel);
    if (!el) errors.push(`Selector not found: ${sel}`);
  }

  // Required text fields non-blank
  const textChecks = [
    { sel: '.stone-name', label: 'hero name' },
    { sel: '.stone-signature', label: 'signature line' },
  ];

  for (const { sel, label } of textChecks) {
    const text = await page.$eval(sel, el => el.textContent?.trim()).catch(() => null);
    if (!text) errors.push(`${label} is blank or selector missing: ${sel}`);
    if (text && (text.includes('null') || text.includes('undefined'))) {
      errors.push(`${label} contains literal "null" or "undefined": ${sel}`);
    }
  }

  // Overview: exactly 2 paragraphs, both non-blank
  const overviewParagraphs = await page.$$eval('#overview p', els => els.map(el => el.textContent?.trim() || ''))
    .catch(() => []);
  if (overviewParagraphs.length !== 2) {
    errors.push(`Overview paragraphs: expected 2, found ${overviewParagraphs.length}`);
  }
  overviewParagraphs.forEach((text, i) => {
    if (!text) errors.push(`Overview paragraph ${i + 1} is blank`);
    if (text.includes('null') || text.includes('undefined')) {
      errors.push(`Overview paragraph ${i + 1} contains literal "null" or "undefined"`);
    }
  });

  // Property pills: exactly 3
  const pillCount = await page.$$eval('.theme-pill', els => els.length).catch(() => 0);
  if (pillCount !== 3) errors.push(`Property pills: expected 3, found ${pillCount}`);

  // Hero sections (Best For / Use When / Affirmation): exactly 3
  const heroSectionCount = await page.$$eval('.hero-section', els => els.length).catch(() => 0);
  if (heroSectionCount !== 3) errors.push(`Hero sections: expected 3, found ${heroSectionCount}`);

  // At a Glance: exactly 6 fields
  const glanceCount = await page.$$eval('.glance-item', els => els.length).catch(() => 0);
  if (glanceCount !== 6) errors.push(`At a Glance fields: expected 6, found ${glanceCount}`);

  // Why People Reach For It: 3-5 rows
  const reachCount = await page.$$eval('.reach-row', els => els.length).catch(() => 0);
  if (reachCount < 3 || reachCount > 5) errors.push(`Why People Reach For It rows: expected 3-5, found ${reachCount}`);

  // Mineral facts: exactly 8 rows
  const factCount = await page.$$eval('.mineral-fact', els => els.length).catch(() => 0);
  if (factCount !== 8) errors.push(`Mineral fact rows: expected 8, found ${factCount}`);

  // Care rows: exactly 4
  const careCount = await page.$$eval('.care-cell', els => els.length).catch(() => 0);
  if (careCount !== 4) errors.push(`Care rows: expected 4, found ${careCount}`);

  // Related stones: exactly 4
  const relatedCount = await page.$$eval('.stone-link-row', els => els.length).catch(() => 0);
  if (relatedCount !== 4) errors.push(`Related stones: expected 4, found ${relatedCount}`);

  // No gray fallback on related-stone color dots (indicates missing color_hex/color_categories)
  const hasGrayFallback = await page.evaluate(() => {
    return [...document.querySelectorAll('.stone-dot-circle')].some(el =>
      (el.getAttribute('style') || '').includes('#c8c8c8')
    );
  }).catch(() => false);
  if (hasGrayFallback) errors.push('Related-stone color dot using gray fallback — missing color_hex/color_categories for at least one related stone');

  // Icon mask URLs: at least one icon must have a mask-image set (not empty)
  const iconsMissing = await page.evaluate(() => {
    const icons = [...document.querySelectorAll('.enc-icon')];
    return icons.filter(el => {
      const mask = getComputedStyle(el).maskImage || getComputedStyle(el).webkitMaskImage || '';
      return !mask || mask === 'none';
    }).length;
  }).catch(() => 0);
  if (iconsMissing > 0) errors.push(`${iconsMissing} icon(s) have no mask-image — possible missing SVG asset`);

  // Image load check
  const imageErrors = await page.evaluate(() => {
    return [...document.querySelectorAll('img')].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
  }).catch(() => []);
  for (const src of imageErrors) {
    errors.push(`Image failed to load: ${src}`);
  }

  // Console errors
  for (const ce of consoleErrors) {
    errors.push(`Console error: ${ce}`);
  }

  return { stone: stoneName, url, errors };
}

async function main() {
  const { packets, baseUrl } = parseArgs();

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (_) {
    console.error('puppeteer is not installed. Run: npm install --save-dev puppeteer');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  let allPass = true;

  for (const packetPath of packets) {
    const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
    const result = await smokeTestStone(page, packet.meta.stone_slug, packet.meta.stone_name, baseUrl);

    if (result.errors.length === 0) {
      console.log(`PASS  ${result.stone}  ${result.url}`);
    } else {
      allPass = false;
      console.error(`FAIL  ${result.stone}  ${result.url}`);
      for (const e of result.errors) console.error(`  ${e}`);
    }
  }

  await browser.close();
  process.exit(allPass ? 0 : 1);
}

main().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
