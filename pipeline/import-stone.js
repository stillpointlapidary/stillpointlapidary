#!/usr/bin/env node
'use strict';

/**
 * 2D — Atomic Stone Importer
 *
 * Takes validated packet(s) and imports each stone atomically via the
 * import_stone_atomic Postgres function (called through Supabase RPC).
 * Per-stone atomicity: if any insert/update fails, that stone rolls back
 * entirely. Stones that fail validation are held and skipped. Valid stones
 * proceed independently.
 *
 * Create-or-update: the SQL function inserts a first-time stone_id (no
 * existing enc_stone_content row) and updates a previously-imported/
 * previously-live stone_id (existing row) in place, fully resynchronizing
 * every child table from the packet either way
 * (ENCYCLOPEDIA-DATABASE-REFERENCE.md §12). This script does not decide
 * which path runs — it only reports what the function did, via the
 * returned `operation` field ('insert' or 'update').
 *
 * Publication is driven entirely by the packet (set at generate-packet.js
 * time via --hold). The SQL function sets enc_stone_content.published and
 * stones.enc_production_status together in the same transaction: default
 * path publishes ('Full Entry Live'); an explicit hold leaves the stone
 * imported but unpublished ('Supabase Entered'). This script does not decide
 * publish state — it only reports what the function did.
 *
 * --all-or-nothing flag: NOT implemented in v1. True cohort-wide rollback would
 * require all stones to commit inside a single transaction scope, which is not
 * achievable with sequential per-stone RPC calls once earlier stones have committed.
 * This limitation is flagged here for Christie's review before implementation.
 *
 * Usage:
 *   node pipeline/import-stone.js --packet <path> [--packet <path> ...]
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 *
 * Prerequisites:
 *   - supabase/migrations/import_stone_atomic.sql must be applied to the target database
 *   - All packets must pass validate-packet.js before import
 */

const fs = require('fs');

function parseArgs() {
  const args = process.argv.slice(2);
  const packets = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--packet') packets.push(args[++i]);
  }
  if (packets.length === 0) {
    console.error('Usage: node pipeline/import-stone.js --packet <path> [--packet <path> ...]');
    process.exit(1);
  }
  return packets;
}

async function importStone(supabase, packet) {
  const name = packet.meta.stone_name;
  const { data, error } = await supabase.rpc('import_stone_atomic', { packet });
  if (error) {
    return { stone: name, status: 'held', reason: error.message };
  }
  if (!data?.success) {
    return { stone: name, status: 'held', reason: 'RPC returned success=false with no error' };
  }
  return {
    stone: name,
    status: 'imported and verified pending',
    stone_id: data.stone_id,
    operation: data.operation,
    published: data.published,
    production_status: data.production_status,
  };
}

// Exported for testing; the two fields are set together in the same
// transaction (import_stone_atomic.sql) and must always agree.
function describePublishState(published, productionStatus) {
  return `published=${published}, stones.enc_production_status='${productionStatus}'`;
}

async function main() {
  const packetPaths = parseArgs();

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY env vars are required.');
    process.exit(1);
  }
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const results = [];

  for (const packetPath of packetPaths) {
    let packet;
    try {
      packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
    } catch (err) {
      results.push({ stone: packetPath, status: 'held', reason: `Could not read packet file: ${err.message}` });
      continue;
    }

    const result = await importStone(supabase, packet);
    results.push(result);
  }

  // Report
  console.log('\n--- Import Report ---');
  for (const r of results) {
    if (r.status === 'imported and verified pending') {
      console.log(`imported and verified pending  ${r.stone}  (${r.stone_id})  [${r.operation}]  [${describePublishState(r.published, r.production_status)}]`);
    } else {
      console.error(`held: ${r.reason}  ${r.stone}`);
    }
  }

  const held = results.filter(r => r.status !== 'imported and verified pending');
  if (held.length > 0) {
    console.error(`\n${held.length} stone(s) held. Run verify-stone.js only for the imported ones.`);
    process.exit(1);
  }

  console.log('\nAll stones imported. Run verify-stone.js next to confirm field-by-field accuracy.');
}

if (require.main === module) {
  main().catch(err => {
    console.error('Unexpected error:', err.message);
    process.exit(1);
  });
}

module.exports = { describePublishState };
