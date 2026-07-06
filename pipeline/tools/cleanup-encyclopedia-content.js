#!/usr/bin/env node
'use strict';

/**
 * Targeted Encyclopedia Content Cleanup — single stone, Supabase only
 *
 * Deletes all encyclopedia rows for exactly one stone_id, so it can re-enter
 * the pipeline as a clean first-time import. Plan-only by default — prints
 * every row that would be deleted, by table, and does nothing else unless
 * --apply is also passed.
 *
 * Deletes, in child-then-parent order (same dependency order
 * import_stone_atomic.sql uses, reversed):
 *   enc_mineral_facts, enc_localities, enc_reach_for, enc_themes,
 *   enc_collector_notes, enc_care, enc_related_stones, enc_stone_content
 *
 * enc_related_stones is filtered by stone_id = target only — this deletes
 * the target stone's own "related stones" list, never another stone's row
 * that merely names the target as one of ITS related stones (those are
 * matched by related_slug, a different column, and are left untouched by
 * design).
 *
 * Never touches the `stones` roster row itself (name, slug, tier, nav,
 * image, or enc_production_status) — this script only clears encyclopedia
 * content tables. Resetting stones.enc_production_status is a separate,
 * explicit decision outside this script's scope.
 *
 * Never touches the Production Master, canonical MDs, or research records.
 *
 * Usage:
 *   node pipeline/tools/cleanup-encyclopedia-content.js --stone <stone_id-or-slug>              (plan only)
 *   node pipeline/tools/cleanup-encyclopedia-content.js --stone <stone_id-or-slug> --apply       (delete)
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

const CHILD_TABLES = [
  'enc_mineral_facts',
  'enc_localities',
  'enc_reach_for',
  'enc_themes',
  'enc_collector_notes',
  'enc_care',
  'enc_related_stones',
];

function parseArgs(argv) {
  const args = argv || process.argv.slice(2);
  const opts = { stone: null, apply: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--stone') opts.stone = args[++i];
    if (args[i] === '--apply') opts.apply = true;
  }
  return opts;
}

async function resolveStone(supabase, input) {
  const { data: byId } = await supabase.from('stones').select('id, name, slug, enc_production_status').eq('id', input).maybeSingle();
  if (byId) return byId;
  const { data: bySlug } = await supabase.from('stones').select('id, name, slug, enc_production_status').eq('slug', input).maybeSingle();
  if (bySlug) return bySlug;
  return null;
}

async function countChildRows(supabase, stoneId) {
  const counts = {};
  for (const table of CHILD_TABLES) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('stone_id', stoneId);
    if (error) throw new Error(`Count failed for ${table}: ${error.message}`);
    counts[table] = count ?? 0;
  }
  return counts;
}

async function countExternalReferences(supabase, slug, stoneId) {
  const { data, error } = await supabase
    .from('enc_related_stones')
    .select('stone_id, related_slug, related_name')
    .eq('related_slug', slug)
    .neq('stone_id', stoneId);
  if (error) throw new Error(`External reference check failed: ${error.message}`);
  return data || [];
}

async function fetchContentRow(supabase, stoneId) {
  const { data } = await supabase.from('enc_stone_content').select('*').eq('stone_id', stoneId).maybeSingle();
  return data;
}

function printPlan({ stone, contentExists, contentPublished, childCounts, externalRefs }) {
  console.log(`\n=== Encyclopedia Content Cleanup Plan — ${stone.id} (${stone.slug} / ${stone.name}) ===\n`);
  console.log(`stones.enc_production_status (current, NOT changed by this script): ${stone.enc_production_status}`);
  console.log(`enc_stone_content: ${contentExists ? `EXISTS (published=${contentPublished}) — 1 row planned for delete` : 'no row'}`);
  for (const table of CHILD_TABLES) {
    console.log(`${table}: ${childCounts[table]} row(s) planned for delete`);
  }
  const totalChild = CHILD_TABLES.reduce((sum, t) => sum + childCounts[t], 0);
  const totalRows = totalChild + (contentExists ? 1 : 0);
  console.log(`\nTotal rows planned for delete: ${totalRows}`);

  console.log(`\nOther stones' enc_related_stones rows referencing "${stone.slug}" (NOT touched by this script): ${externalRefs.length}`);
  for (const ref of externalRefs) {
    console.log(`  stone_id=${ref.stone_id} related_slug=${ref.related_slug} related_name=${ref.related_name}`);
  }

  console.log(`\nNot touched by this script: stones.${stone.id} roster row (name/slug/tier/nav/image/enc_production_status), Production Master, canonical MDs, research records, any other stone's rows.`);
}

async function applyDeletes(supabase, stone) {
  const results = [];
  for (const table of CHILD_TABLES) {
    const { error, count } = await supabase
      .from(table)
      .delete({ count: 'exact' })
      .eq('stone_id', stone.id);
    if (error) throw new Error(`Delete failed for ${table}: ${error.message}`);
    results.push({ table, deleted: count ?? null });
  }
  const { error: parentError, count: parentCount } = await supabase
    .from('enc_stone_content')
    .delete({ count: 'exact' })
    .eq('stone_id', stone.id);
  if (parentError) throw new Error(`Delete failed for enc_stone_content: ${parentError.message}`);
  results.push({ table: 'enc_stone_content', deleted: parentCount ?? null });
  return results;
}

async function verifyClean(supabase, stone) {
  const childCounts = await countChildRows(supabase, stone.id);
  const content = await fetchContentRow(supabase, stone.id);
  const allZero = Object.values(childCounts).every((c) => c === 0) && !content;
  return { childCounts, contentExists: !!content, allZero };
}

async function main() {
  const opts = parseArgs();
  if (!opts.stone) {
    console.error('Usage: node pipeline/tools/cleanup-encyclopedia-content.js --stone <stone_id-or-slug> [--apply]');
    process.exit(1);
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY env vars are required.');
    process.exit(1);
  }
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const stone = await resolveStone(supabase, opts.stone);
  if (!stone) {
    console.error(`"${opts.stone}" was not found in the stones table by id or slug. Cleanup stopped.`);
    process.exit(2);
  }

  const content = await fetchContentRow(supabase, stone.id);
  const childCounts = await countChildRows(supabase, stone.id);
  const externalRefs = await countExternalReferences(supabase, stone.slug, stone.id);

  printPlan({
    stone,
    contentExists: !!content,
    contentPublished: content ? content.published : null,
    childCounts,
    externalRefs,
  });

  if (!opts.apply) {
    console.log('\nMode: PLAN ONLY — no rows were deleted. Re-run with --apply to delete exactly the rows listed above.');
    process.exitCode = 0;
    return;
  }

  console.log('\nMode: APPLY — deleting now.');
  const results = await applyDeletes(supabase, stone);
  console.log('\nDelete results:');
  for (const r of results) {
    console.log(`  ${r.table}: deleted ${r.deleted === null ? '(count unavailable)' : r.deleted}`);
  }

  const verification = await verifyClean(supabase, stone);
  console.log('\nPost-delete verification:');
  for (const table of CHILD_TABLES) {
    console.log(`  ${table}: ${verification.childCounts[table]} row(s) remaining`);
  }
  console.log(`  enc_stone_content: ${verification.contentExists ? 'ROW STILL EXISTS' : 'no row'}`);

  if (verification.allZero) {
    console.log('\nRESULT: PASS — no encyclopedia content or child rows remain for this stone.');
    process.exitCode = 0;
  } else {
    console.log('\nRESULT: FAIL — some rows remain after delete. Investigate before re-running.');
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('FATAL:', err.message);
    process.exitCode = 1;
  });
}

module.exports = {
  parseArgs,
  resolveStone,
  countChildRows,
  countExternalReferences,
  fetchContentRow,
  applyDeletes,
  verifyClean,
  CHILD_TABLES,
};
