#!/usr/bin/env node
'use strict';

/**
 * 2F — Rendered-Page Smoke Test
 *
 * Deterministic checks only — no subjective layout judgment:
 *   - required selectors exist
 *   - required text fields are non-blank
 *   - expected row/section counts render
 *   - all images load (HTTP 200)
 *   - no console errors
 *   - no null, undefined, or fallback states visible
 *   - icon mask URLs resolve
 *   - swatch tokens resolve (no red-dot fallback triggered)
 *
 * Requires: npm install puppeteer
 *
 * Usage:
 *   node pipeline/smoke-test.js --packet <path> --base-url <url> [--packet <path> ...]
 *
 * Example:
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... \
 *   node pipeline/smoke-test.js \
 *     --packet tests/fixtures/rose-quartz.packet.json \
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
    '.hero-image img',
    '.hero-name',
    '.hero-signature',
    '.property-pill',
    '.hero-tile.best-for',
    '.hero-tile.use-when',
    '.hero-tile.affirmation',
    '.glance-grid',
    '[data-section="overview"]',
    '[data-section="reach"]',
    '[data-section="themes"]',
    '[data-section="mineral"]',
    '[data-section="notes"]',
    '[data-section="care"]',
    '[data-section="related"]',
  ];

  for (const sel of requiredSelectors) {
    const el = await page.$(sel);
    if (!el) errors.push(`Selector not found: ${sel}`);
  }

  // Required text fields non-blank
  const textChecks = [
    { sel: '.hero-name', label: 'hero name' },
    { sel: '.hero-signature', label: 'signature line' },
    { sel: '.overview-p1', label: 'overview paragraph 1' },
    { sel: '.overview-p2', label: 'overview paragraph 2' },
  ];

  for (const { sel, label } of textChecks) {
    const text = await page.$eval(sel, el => el.textContent?.trim()).catch(() => null);
    if (!text) errors.push(`${label} is blank or selector missing: ${sel}`);
    if (text && (text.includes('null') || text.includes('undefined'))) {
      errors.push(`${label} contains literal "null" or "undefined": ${sel}`);
    }
  }

  // Property pills: exactly 3
  const pillCount = await page.$$eval('.property-pill', els => els.length).catch(() => 0);
  if (pillCount !== 3) errors.push(`Property pills: expected 3, found ${pillCount}`);

  // Hero tiles: exactly 3
  const tileCount = await page.$$eval('.hero-tile', els => els.length).catch(() => 0);
  if (tileCount !== 3) errors.push(`Hero tiles: expected 3, found ${tileCount}`);

  // At a Glance: exactly 6 fields
  const glanceCount = await page.$$eval('.glance-field', els => els.length).catch(() => 0);
  if (glanceCount !== 6) errors.push(`At a Glance fields: expected 6, found ${glanceCount}`);

  // Why People Reach For It: 3-5 rows
  const reachCount = await page.$$eval('.reach-row', els => els.length).catch(() => 0);
  if (reachCount < 3 || reachCount > 5) errors.push(`Why People Reach For It rows: expected 3-5, found ${reachCount}`);

  // Mineral facts: exactly 8 rows
  const factCount = await page.$$eval('.mineral-fact', els => els.length).catch(() => 0);
  if (factCount !== 8) errors.push(`Mineral fact rows: expected 8, found ${factCount}`);

  // Care rows: exactly 4
  const careCount = await page.$$eval('.care-row', els => els.length).catch(() => 0);
  if (careCount !== 4) errors.push(`Care rows: expected 4, found ${careCount}`);

  // Related stones: exactly 4
  const relatedCount = await page.$$eval('.related-stone-card', els => els.length).catch(() => 0);
  if (relatedCount !== 4) errors.push(`Related stones: expected 4, found ${relatedCount}`);

  // No red-dot swatch fallback
  const hasRedDot = await page.evaluate(() => {
    return [...document.querySelectorAll('.swatch-dot, .related-dot')].some(el => {
      const bg = getComputedStyle(el).backgroundColor;
      return bg === 'rgb(255, 0, 0)' || bg === 'red';
    });
  }).catch(() => false);
  if (hasRedDot) errors.push('Red-dot swatch fallback detected — missing swatch values for at least one stone');

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
