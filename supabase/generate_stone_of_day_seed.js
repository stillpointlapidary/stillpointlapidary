#!/usr/bin/env node
/*
  Generate Stone of the Day seed SQL.

  Usage:
    node supabase/generate_stone_of_day_seed.js --days 90 --start 2026-06-11 --out supabase/stone_of_day_seed.sql

  Environment:
    SUPABASE_URL defaults to the production project URL in app.js.
    SUPABASE_KEY should be an anon, publishable, or service-role key that can read stones.
*/

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const args = process.argv.slice(2);
function argValue(name, fallback) {
  const idx = args.indexOf(name);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}

const days = Math.max(1, parseInt(argValue('--days', '90'), 10) || 90);
const start = argValue('--start', new Date().toISOString().slice(0, 10));
const out = argValue('--out', '');
const requireImage = !args.includes('--allow-no-image');
const supabaseUrl = process.env.SUPABASE_URL || 'https://vxujlgyhgnihnqrxzefw.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('Missing SUPABASE_KEY, SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

function loadPhotoIds() {
  const appPath = path.resolve(__dirname, '..', 'app.js');
  const app = fs.readFileSync(appPath, 'utf8');
  const match = app.match(/const\s+ENCYCLOPEDIA_PHOTOS\s*=\s*(\{[\s\S]*?\n\};)/);
  if (!match) return new Set();
  const objectSource = match[1].replace(/;\s*$/, '');
  const photos = Function(`"use strict"; return (${objectSource});`)();
  return new Set(Object.keys(photos).filter(id => Array.isArray(photos[id]) && photos[id].length));
}

function addDays(dateKey, offset) {
  const d = new Date(`${dateKey}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

function sqlString(value) {
  return String(value).replace(/'/g, "''");
}

async function main() {
  const photoIds = loadPhotoIds();
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('stones')
    .select('id,name,collection_tier,internal_tier')
    .order('name');

  if (error) throw error;

  let stones = (data || []).filter(s => s && s.id);
  const withImages = stones.filter(s => photoIds.has(s.id));
  if (requireImage && withImages.length) stones = withImages;

  stones.sort((a, b) => {
    const ai = String(a.internal_tier ?? '') === '0' ? 0 : 1;
    const bi = String(b.internal_tier ?? '') === '0' ? 0 : 1;
    if (ai !== bi) return ai - bi;
    const at = Number(a.collection_tier ?? 99);
    const bt = Number(b.collection_tier ?? 99);
    const ar = (at === 0 || at === 1) ? 0 : 1;
    const br = (bt === 0 || bt === 1) ? 0 : 1;
    if (ar !== br) return ar - br;
    if (at !== bt) return at - bt;
    return String(a.name || a.id).localeCompare(String(b.name || b.id));
  });

  if (!stones.length) throw new Error('No eligible stones found.');

  const rows = Array.from({ length: days }, (_, i) => {
    const stone = stones[i % stones.length];
    return `('${sqlString(stone.id)}', '${addDays(start, i)}', true)`;
  });

  const sql = [
    '-- Generated Stone of the Day schedule seed.',
    `-- Start: ${start}`,
    `-- Days: ${days}`,
    `-- Image required: ${requireImage}`,
    '',
    'insert into public.stone_of_day_schedule (stone_id, feature_date, is_active)',
    'values',
    rows.join(',\n'),
    'on conflict (feature_date) do update',
    'set stone_id = excluded.stone_id,',
    '    is_active = excluded.is_active;',
    ''
  ].join('\n');

  if (out) {
    fs.writeFileSync(path.resolve(out), sql);
    console.log(`Wrote ${out}`);
  } else {
    console.log(sql);
  }
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
