#!/usr/bin/env node
'use strict';

/**
 * One-command Gate 4 runner for a single already-approved stone.
 *
 * Wraps the existing approved Gate 4 tools in the standard order documented
 * in pipeline/README.md ("Approved Stone → Gate 4"), so a normal approved
 * stone doesn't need each sub-step run and checked by hand:
 *
 *   export structured values -> detect existing row -> reconcile (if a row
 *   already exists) -> generate packet -> validate packet -> gate4 precheck
 *   -> atomic import (insert or update) -> verify-stone -> Production
 *   Master status update (only after verify-stone passes)
 *
 * This script does not reimplement any of those tools — it shells out to
 * each one in order and stops at the first failure, so none of their
 * validation is weakened or bypassed.
 *
 * Dry run (default): everything through Gate 4 precheck runs for real
 * (all reads — Production Master, canonical MD, research record, Supabase
 * reads, structured-values export, packet generation/validation/precheck).
 * Nothing is imported, nothing is published, the Production Master is not
 * touched. If existing-row reconciliation finds drift, the dry run reports
 * it and stops — it does not import a packet built against unreconciled
 * structured values.
 *
 * --apply: also applies pending reconciliation (if drift was found), runs
 * the real atomic import, runs verify-stone, and — only if verify-stone
 * passes — updates the Production Master status fields via the existing
 * approved pipeline/tools/update-production-master-row.js.
 *
 * Does not support an explicit unpublished hold (--hold on
 * generate-packet.js) — that is a Christie/Dustin-requested exception case,
 * not the normal path this runner automates. Run the individual pipeline
 * steps by hand for a hold.
 *
 * Usage:
 *   node pipeline/run-gate4-stone.js --stone red-jasper
 *   node pipeline/run-gate4-stone.js --stone red-jasper --apply
 *   node pipeline/run-gate4-stone.js --stone C-0099 --apply
 *   node pipeline/run-gate4-stone.js --stone "Red Jasper" --apply
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_KEY
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const { CANONICAL_MDS_ROOT, RESEARCH_ROOT, PIPELINE_OUTPUT_DIR, PRODUCTION_MASTER_PATH } = require('./lib/paths');
const { loadCatalog, findStoneRows } = require('./gate0');

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

class BlockerError extends Error {}

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const opts = { apply: false, stone: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--stone') opts.stone = argv[++i];
    else if (argv[i] === '--apply') opts.apply = true;
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Pure path/name helpers (exported for testing)
// ---------------------------------------------------------------------------

function resolveMdPath(slug) {
  return path.join(CANONICAL_MDS_ROOT, `${slug}.md`);
}

function resolveResearchRecordPath(slug) {
  return path.join(RESEARCH_ROOT, 'Stone Records', `${slug}-research.md`);
}

function resolvePacketPath(slug) {
  return path.join(PIPELINE_OUTPUT_DIR, `${slug}.packet.json`);
}

// Only ever sets the current default-Gate-4 (published=true) status. This
// runner does not support the explicit-unpublished-hold path — see header.
function buildPmUpdatePayload(stoneId, operation, dateIso) {
  return {
    production_master_path: PRODUCTION_MASTER_PATH,
    stone_id: stoneId,
    updates: {
      'Encyclopedia Production Status': 'Full Entry Live',
      Notes: `Full Entry Live — Gate 4 atomic import (${operation}) and publication completed successfully on ${dateIso}.`,
    },
  };
}

// Parses the one-line report import-stone.js prints for a successful
// import, e.g.:
//   imported and verified pending  Red Jasper  (C-0099)  [update]  [published=true, stones.enc_production_status='Full Entry Live']
function parseImportReportLine(stdout) {
  const match = stdout.match(/\[(insert|update)\]\s+\[published=(true|false)/);
  if (!match) return null;
  return { operation: match[1], published: match[2] === 'true' };
}

function parsePmUpdateResult(stdout) {
  if (/RESULT: PASS/.test(stdout)) return 'PASS';
  return 'FAIL';
}

// ---------------------------------------------------------------------------
// Report formatting (exported for testing)
// ---------------------------------------------------------------------------

function reportLine(label, value) {
  return `${label}: ${value ?? 'not reached'}`;
}

function formatReport(state) {
  const lines = [
    state.overall,
    reportLine('Stone', state.stone),
    reportLine('Research record', state.researchRecord),
    reportLine('Canonical MD', state.canonicalMd),
    reportLine('Structured export', state.structuredExport),
    reportLine('Existing row', state.existingRow),
    reportLine('Reconciliation', state.reconciliation),
    reportLine('Packet', state.packet),
    reportLine('Validation', state.validation),
    reportLine('Precheck', state.precheck),
    reportLine('Import', state.import),
    reportLine('Verify-stone', state.verifyStone),
    reportLine('Production Master update', state.productionMasterUpdate),
  ];
  if (state.blockerReason) lines.push(`Blocker: ${state.blockerReason}`);
  lines.push('No commit');
  lines.push('No deploy');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Identity resolution — reuses gate0.js's own Production Master name/slug
// lookup rather than re-implementing it.
// ---------------------------------------------------------------------------

function resolveStoneIdentity(query) {
  const { rows, col, missing } = loadCatalog(PRODUCTION_MASTER_PATH);
  if (missing.length > 0) {
    throw new BlockerError(`Production Master is missing expected column(s): ${missing.join(', ')}`);
  }
  const matches = findStoneRows(rows, col, query);
  if (matches.length === 0) {
    throw new BlockerError(`"${query}" was not found in the Production Master by canonical name or slug.`);
  }
  if (matches.length > 1) {
    throw new BlockerError(`"${query}" matches ${matches.length} Production Master rows — refusing to guess which one.`);
  }
  const row = matches[0].row;
  const get = (field) => (row[col[field]] == null ? null : String(row[col[field]]).trim());
  return {
    stoneId: get('Stone ID'),
    stoneName: get('Canonical Name'),
    slug: get('Slug'),
  };
}

// ---------------------------------------------------------------------------
// Child-process runner
// ---------------------------------------------------------------------------

function runNodeScript(scriptRelPath, args) {
  const scriptPath = path.join(__dirname, scriptRelPath);
  try {
    const stdout = execFileSync(process.execPath, [scriptPath, ...args], { encoding: 'utf8' });
    return { ok: true, code: 0, stdout, stderr: '' };
  } catch (err) {
    return {
      ok: false,
      code: typeof err.status === 'number' ? err.status : 1,
      stdout: err.stdout ? err.stdout.toString() : '',
      stderr: err.stderr ? err.stderr.toString() : (err.message || ''),
    };
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const state = {
    overall: 'BLOCKED',
    stone: null, researchRecord: null, canonicalMd: null, structuredExport: null,
    existingRow: null, reconciliation: null, packet: null, validation: null,
    precheck: null, import: null, verifyStone: null, productionMasterUpdate: null,
    blockerReason: null,
  };

  try {
    if (!opts.stone) {
      throw new BlockerError('Usage: node pipeline/run-gate4-stone.js --stone <name-or-slug-or-id> [--apply]');
    }
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new BlockerError('SUPABASE_URL and SUPABASE_SERVICE_KEY env vars are required.');
    }

    // --- Identity ---
    const identity = resolveStoneIdentity(opts.stone);
    state.stone = `${identity.stoneName} / ${identity.stoneId} / ${identity.slug}`;

    // --- 1. Canonical MD exists ---
    const mdPath = resolveMdPath(identity.slug);
    if (!fs.existsSync(mdPath)) {
      throw new BlockerError(`Canonical MD not found at ${mdPath}`);
    }
    state.canonicalMd = 'found';

    // --- 2. Research record exists ---
    const researchPath = resolveResearchRecordPath(identity.slug);
    if (!fs.existsSync(researchPath)) {
      throw new BlockerError(`Research record not found at ${researchPath}`);
    }
    state.researchRecord = 'found';

    // --- 3. Export/regenerate structured values ---
    const exportResult = runNodeScript('export-structured-values.js', []);
    if (!exportResult.ok) {
      throw new BlockerError(`export-structured-values.js failed: ${exportResult.stderr || exportResult.stdout}`);
    }
    state.structuredExport = 'PASS';

    // --- 4. Detect existing enc_stone_content row ---
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data: existingContent } = await supabase
      .from('enc_stone_content')
      .select('stone_id')
      .eq('stone_id', identity.stoneId)
      .maybeSingle();
    const rowExists = !!existingContent;
    state.existingRow = rowExists ? 'yes' : 'no';

    // --- 5/6. Reconcile existing structured fields ---
    if (!rowExists) {
      state.reconciliation = 'not needed';
    } else {
      const dryRun = runNodeScript('reconcile-structured-fields.js', ['--stone', identity.stoneId]);
      if (dryRun.code === 2) {
        throw new BlockerError(`reconcile-structured-fields.js could not run: ${dryRun.stderr || dryRun.stdout}`);
      }
      const driftFound = dryRun.code === 1;
      if (!driftFound) {
        state.reconciliation = 'not needed';
      } else if (!opts.apply) {
        throw new BlockerError('Structured-field reconciliation found drift against the Production Master export. Re-run with --apply to apply the correction before continuing (see pipeline/reconcile-structured-fields.js output above).');
      } else {
        const apply = runNodeScript('reconcile-structured-fields.js', ['--stone', identity.stoneId, '--apply']);
        if (!apply.ok) {
          throw new BlockerError(`Structured-field reconciliation --apply failed: ${apply.stderr || apply.stdout}`);
        }
        state.reconciliation = 'applied';
      }
    }

    // --- 7. Generate packet ---
    const genResult = runNodeScript('generate-packet.js', ['--md', mdPath]);
    if (!genResult.ok) {
      throw new BlockerError(`generate-packet.js failed: ${genResult.stderr || genResult.stdout}`);
    }
    const packetPath = resolvePacketPath(identity.slug);
    if (!fs.existsSync(packetPath)) {
      throw new BlockerError(`Expected packet not found at ${packetPath} after generate-packet.js ran.`);
    }
    state.packet = packetPath;

    // --- 8. Validate packet ---
    const validateResult = runNodeScript('validate-packet.js', ['--packet', packetPath]);
    if (!validateResult.ok) {
      throw new BlockerError(`validate-packet.js FAIL:\n${validateResult.stdout}${validateResult.stderr}`);
    }
    state.validation = 'PASS';

    // --- 9. Gate 4 precheck ---
    const precheckResult = runNodeScript('gate4-precheck.js', ['--md', mdPath]);
    if (!precheckResult.ok) {
      throw new BlockerError(`gate4-precheck.js reported blocker(s):\n${precheckResult.stdout}`);
    }
    state.precheck = 'PASS';

    if (!opts.apply) {
      state.import = 'DRY RUN — not executed (rerun with --apply)';
      state.verifyStone = 'DRY RUN — not executed (rerun with --apply)';
      state.productionMasterUpdate = 'DRY RUN — not executed (rerun with --apply)';
    } else {
      // --- 10. Atomic import (insert or update) ---
      const importResult = runNodeScript('import-stone.js', ['--packet', packetPath]);
      if (!importResult.ok) {
        throw new BlockerError(`import-stone.js failed:\n${importResult.stdout}${importResult.stderr}`);
      }
      const parsedImport = parseImportReportLine(importResult.stdout);
      if (!parsedImport) {
        throw new BlockerError(`import-stone.js succeeded but its report could not be parsed:\n${importResult.stdout}`);
      }
      state.import = `${parsedImport.operation}, published=${parsedImport.published}`;

      // --- 11. verify-stone ---
      const verifyResult = runNodeScript('verify-stone.js', ['--packet', packetPath]);
      if (!verifyResult.ok) {
        throw new BlockerError(`verify-stone.js FAIL:\n${verifyResult.stdout}${verifyResult.stderr}`);
      }
      state.verifyStone = 'PASS';

      // --- 12/13. Production Master status update, save/reopen/reread (only after verify passes) ---
      const payload = buildPmUpdatePayload(identity.stoneId, parsedImport.operation, new Date().toISOString().slice(0, 10));
      const tmpFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'gate4-stone-')), 'pm-update.json');
      fs.writeFileSync(tmpFile, JSON.stringify(payload));
      let pmResult;
      try {
        pmResult = runNodeScript('tools/update-production-master-row.js', ['--input', tmpFile]);
      } finally {
        fs.rmSync(path.dirname(tmpFile), { recursive: true, force: true });
      }
      if (!pmResult.ok || parsePmUpdateResult(pmResult.stdout) !== 'PASS') {
        throw new BlockerError(`Production Master update failed:\n${pmResult.stdout}${pmResult.stderr}`);
      }
      state.productionMasterUpdate = 'PASS';
    }

    state.overall = 'PASS';
  } catch (err) {
    state.overall = 'BLOCKED';
    state.blockerReason = err instanceof BlockerError ? err.message : `Unexpected error: ${err.message}`;
  }

  console.log('\n' + formatReport(state) + '\n');
  process.exitCode = state.overall === 'PASS' ? 0 : 1;
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  resolveMdPath,
  resolveResearchRecordPath,
  resolvePacketPath,
  buildPmUpdatePayload,
  parseImportReportLine,
  parsePmUpdateResult,
  reportLine,
  formatReport,
  resolveStoneIdentity,
  BlockerError,
};
