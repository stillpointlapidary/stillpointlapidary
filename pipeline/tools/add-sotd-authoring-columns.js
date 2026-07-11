#!/usr/bin/env node
'use strict';

/**
 * One-time (idempotent) Production Master schema addition: appends the nine
 * SOTD authoring columns as new trailing columns on the "Catalog Master"
 * sheet, under a new "Group L — SOTD Authoring" header group, following the
 * workbook's existing "Group X — Label | Field Name" convention.
 *
 * Does not touch any existing column, row, style, data validation, freeze
 * pane, or autoFilter range beyond extending autoFilter/dimension to include
 * the new trailing columns (required for the new columns to filter/scroll
 * correctly — everything else about those ranges is preserved as-is).
 *
 * Safe to re-run: if all nine target headers already exist (by stripped
 * field name), this is a no-op that reports the existing column letters. If
 * some but not all nine exist, it refuses rather than guessing.
 *
 * Uses the same surgical zip-XML-patch approach as update-production-master-row.js
 * (see that file for why: a plain xlsx read/write round trip corrupts data
 * validations and shrinks styles.xml on this workbook).
 *
 * Usage:
 *   node pipeline/tools/add-sotd-authoring-columns.js --path "<production_master_path>"
 *   node pipeline/tools/add-sotd-authoring-columns.js --path "<...>" --dry-run
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const XLSX = require('xlsx');

const SHEET_NAME = 'Catalog Master';
const GROUP_LABEL = 'SOTD Authoring';

// Order defines column order (appended left-to-right in this sequence).
const NEW_FIELDS = [
  'SOTD Essence',
  'SOTD Energy Label',
  'SOTD Question',
  'SOTD Takeaway',
  'SOTD Review Status',
  'SOTD Review Source',
  'SOTD Reviewed By',
  'SOTD Reviewed At',
  'SOTD Notes / Blocker',
];

// Column width per new field, modeled on existing precedent in this sheet:
// short status/name values ~16, short phrases ~20, full sentences/free text 42
// (matching "Best For"/"Use When"/"Affirmation" at 42 and "Notes" at 42).
const NEW_FIELD_WIDTH = {
  'SOTD Essence': 20,
  'SOTD Energy Label': 20,
  'SOTD Question': 42,
  'SOTD Takeaway': 42,
  'SOTD Review Status': 16,
  'SOTD Review Source': 16,
  'SOTD Reviewed By': 16,
  'SOTD Reviewed At': 20,
  'SOTD Notes / Blocker': 42,
};

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function stripGroupPrefix(header) {
  const parts = String(header).split('|');
  return parts[parts.length - 1].trim();
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { path: null, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path') opts.path = args[++i];
    else if (args[i] === '--dry-run') opts.dryRun = true;
  }
  if (!opts.path) fail('Usage: --path "<production_master_path>" [--dry-run]');
  return opts;
}

// ---------------------------------------------------------------------------
// Column letter <-> index (A1 notation) — same algorithm as update-production-master-row.js
// ---------------------------------------------------------------------------

function colIndexToLetter(index) {
  let n = index + 1;
  let s = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// ---------------------------------------------------------------------------
// Zip helpers (same approach as update-production-master-row.js)
// ---------------------------------------------------------------------------

const READ_ENTRY_PS = `
param([string]$ArchivePath, [string]$EntryName, [string]$OutPath)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($ArchivePath)
try {
  $entry = $archive.GetEntry($EntryName)
  if ($null -eq $entry) { Write-Output "ENTRY_NOT_FOUND"; exit 2 }
  [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $OutPath, $true)
} finally {
  $archive.Dispose()
}
Write-Output "READ_OK"
`;

const WRITE_ENTRY_PS = `
param([string]$ArchivePath, [string]$EntryName, [string]$ContentPath)
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$archive = [System.IO.Compression.ZipFile]::Open($ArchivePath, [System.IO.Compression.ZipArchiveMode]::Update)
try {
  $existing = $archive.GetEntry($EntryName)
  if ($null -ne $existing) { $existing.Delete() }
  $newEntry = $archive.CreateEntry($EntryName, [System.IO.Compression.CompressionLevel]::Optimal)
  $bytes = [System.IO.File]::ReadAllBytes($ContentPath)
  $stream = $newEntry.Open()
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Close()
} finally {
  $archive.Dispose()
}
Write-Output "WRITE_OK"
`;

function runPowerShellFile(scriptBody, args) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-add-cols-'));
  const psPath = path.join(tmpDir, 'op.ps1');
  fs.writeFileSync(psPath, scriptBody, 'utf8');
  try {
    return execFileSync('powershell.exe', [
      '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', psPath, ...args,
    ]).toString('utf8');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function readZipEntry(archivePath, entryName) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-add-cols-read-'));
  const outPath = path.join(tmpDir, 'entry.xml');
  try {
    const output = runPowerShellFile(READ_ENTRY_PS, [archivePath, entryName, outPath]);
    if (!output.includes('READ_OK')) fail(`Could not read zip entry "${entryName}". Output: ${output.trim()}`);
    return fs.readFileSync(outPath, 'utf8');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function writeZipEntry(archivePath, entryName, content) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-add-cols-write-'));
  const contentPath = path.join(tmpDir, 'entry.xml');
  fs.writeFileSync(contentPath, content, 'utf8');
  try {
    const output = runPowerShellFile(WRITE_ENTRY_PS, [archivePath, entryName, contentPath]);
    if (!output.includes('WRITE_OK')) fail(`Zip entry write did not report success for "${entryName}". Output: ${output.trim()}`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function resolveWorksheetPart(archivePath, sheetName) {
  const workbookXml = readZipEntry(archivePath, 'xl/workbook.xml');
  const sheetElRe = /<sheet\b[^>]*\/>/g;
  let m;
  let rId = null;
  while ((m = sheetElRe.exec(workbookXml)) !== null) {
    const el = m[0];
    const nameMatch = el.match(/\bname="([^"]*)"/);
    if (nameMatch && nameMatch[1] === sheetName) {
      const ridMatch = el.match(/\br:id="([^"]*)"/);
      if (ridMatch) rId = ridMatch[1];
      break;
    }
  }
  if (!rId) fail(`Could not find sheet "${sheetName}" in xl/workbook.xml.`);

  const relsXml = readZipEntry(archivePath, 'xl/_rels/workbook.xml.rels');
  const relElRe = /<Relationship\b[^>]*\/>/g;
  let target = null;
  while ((m = relElRe.exec(relsXml)) !== null) {
    const el = m[0];
    const idMatch = el.match(/\bId="([^"]*)"/);
    if (idMatch && idMatch[1] === rId) {
      const targetMatch = el.match(/\bTarget="([^"]*)"/);
      if (targetMatch) target = targetMatch[1];
      break;
    }
  }
  if (!target) fail(`Could not resolve worksheet target for relationship id "${rId}".`);
  if (target.startsWith('/')) target = target.slice(1);
  if (!target.startsWith('xl/')) target = `xl/${target}`;
  return target;
}

// ---------------------------------------------------------------------------
// Backup
// ---------------------------------------------------------------------------

function backupWorkbook(sourcePath) {
  const dir = path.join(path.dirname(sourcePath), 'snapshots');
  fs.mkdirSync(dir, { recursive: true });
  const ext = path.extname(sourcePath);
  const base = path.basename(sourcePath, ext);
  const ts = new Date().toISOString().replace(/:/g, '-').replace(/\..+Z$/, 'Z');
  const backupPath = path.join(dir, `${base}-${ts}-pre-add-sotd-columns${ext}`);
  fs.copyFileSync(sourcePath, backupPath);
  return backupPath;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function run() {
  const opts = parseArgs();
  const pmPath = opts.path;
  if (!fs.existsSync(pmPath)) fail(`Workbook not found at: ${pmPath}`);

  // Read-only inspection via xlsx (safe, matches project convention).
  const workbook = XLSX.readFile(pmPath);
  if (!workbook.SheetNames.includes(SHEET_NAME)) {
    fail(`Workbook is missing the expected sheet "${SHEET_NAME}". Found: ${workbook.SheetNames.join(', ')}`);
  }
  const sheet = workbook.Sheets[SHEET_NAME];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  if (rows.length < 2) fail(`Sheet "${SHEET_NAME}" has no data rows.`);
  const header = rows[0];
  const dataRowCount = rows.length - 1;

  const strippedHeaders = header.map((h) => (h == null ? null : stripGroupPrefix(h)));
  const existingIdx = {};
  NEW_FIELDS.forEach((f) => {
    const idx = strippedHeaders.findIndex((h) => h === f);
    existingIdx[f] = idx; // -1 if not found
  });
  const presentCount = NEW_FIELDS.filter((f) => existingIdx[f] !== -1).length;

  if (presentCount === NEW_FIELDS.length) {
    console.log('All nine SOTD authoring columns already exist. No action taken.');
    NEW_FIELDS.forEach((f) => {
      console.log(`  ${f}: column ${colIndexToLetter(existingIdx[f])} (index ${existingIdx[f]})`);
    });
    console.log('\nRESULT: PASS (no-op, already present)');
    process.exit(0);
  }
  if (presentCount > 0) {
    fail(
      `Inconsistent state: ${presentCount} of ${NEW_FIELDS.length} target SOTD columns already exist, ` +
      `not all of them. Refusing to guess. Existing: ${NEW_FIELDS.filter((f) => existingIdx[f] !== -1).join(', ')}`
    );
  }

  const originalColCount = header.length;
  const newColStartIdx = originalColCount; // 0-based index of first new column
  const newColLetters = NEW_FIELDS.map((_, i) => colIndexToLetter(newColStartIdx + i));

  console.log(`Sheet "${SHEET_NAME}": ${originalColCount} existing columns (A..${colIndexToLetter(originalColCount - 1)}), ${dataRowCount} data rows.`);
  console.log(`Adding ${NEW_FIELDS.length} new columns: ${newColLetters[0]}..${newColLetters[newColLetters.length - 1]}`);
  NEW_FIELDS.forEach((f, i) => console.log(`  ${newColLetters[i]}: Group L — ${GROUP_LABEL} | ${f}`));

  if (opts.dryRun) {
    console.log('\nRESULT: DRY RUN COMPLETE — no changes written.');
    process.exit(0);
  }

  const backupPath = backupWorkbook(pmPath);
  console.log(`\nBackup created: ${backupPath}`);

  const worksheetPart = resolveWorksheetPart(pmPath, SHEET_NAME);
  let sheetXml = readZipEntry(pmPath, worksheetPart);

  // --- 1. Extend header row (row 1) with 9 new header cells, style s="2" (matches every existing header cell) ---
  const row1Re = /<row r="1"([^>]*)>([\s\S]*?)<\/row>/;
  const row1Match = sheetXml.match(row1Re);
  if (!row1Match) fail('Could not locate header row (row 1) in the worksheet XML.');
  const newHeaderCells = NEW_FIELDS.map((f, i) => {
    const addr = `${newColLetters[i]}1`;
    const text = `Group L — ${GROUP_LABEL} | ${f}`
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<c r="${addr}" s="2" t="inlineStr"><is><t>${text}</t></is></c>`;
  }).join('');
  const patchedRow1 = `<row r="1"${row1Match[1]}>${row1Match[2]}${newHeaderCells}</row>`;
  sheetXml = sheetXml.slice(0, row1Match.index) + patchedRow1 + sheetXml.slice(row1Match.index + row1Match[0].length);

  // --- 2. Extend <dimension> ref ---
  const lastColLetter = newColLetters[newColLetters.length - 1];
  const lastRowNum = rows.length; // Excel row number of last data row
  const dimRe = /<dimension ref="[^"]*"\/>/;
  sheetXml = sheetXml.replace(dimRe, `<dimension ref="A1:${lastColLetter}${lastRowNum}"/>`);

  // --- 3. Extend <autoFilter> ref (so filtering still spans the full sheet) ---
  const afRe = /<autoFilter ref="[^"]*"\/>/;
  if (afRe.test(sheetXml)) {
    sheetXml = sheetXml.replace(afRe, `<autoFilter ref="A1:${lastColLetter}${lastRowNum}"/>`);
  }

  // --- 4. Append 9 new <col> entries to <cols> (existing entries untouched) ---
  const colsCloseRe = /<\/cols>/;
  const newColEntries = NEW_FIELDS.map((f, i) => {
    const colNum = newColStartIdx + i + 1; // 1-based
    const width = NEW_FIELD_WIDTH[f];
    return `<col width="${width}" customWidth="1" min="${colNum}" max="${colNum}"/>`;
  }).join('');
  if (!colsCloseRe.test(sheetXml)) fail('Could not locate </cols> in the worksheet XML.');
  sheetXml = sheetXml.replace(colsCloseRe, `${newColEntries}</cols>`);

  writeZipEntry(pmPath, worksheetPart, sheetXml);
  console.log(`Worksheet part written: ${worksheetPart}`);

  // --- Reopen / reread / verify ---
  const reopened = XLSX.readFile(pmPath);
  const reopenedSheet = reopened.Sheets[SHEET_NAME];
  const reopenedRows = XLSX.utils.sheet_to_json(reopenedSheet, { header: 1, defval: null });
  const reopenedHeader = reopenedRows[0];

  console.log('\nSave/reopen/reread verification:');
  let allPass = true;

  const expectedColCount = originalColCount + NEW_FIELDS.length;
  const colCountPass = reopenedHeader.length === expectedColCount;
  if (!colCountPass) allPass = false;
  console.log(`  Column count: expected ${expectedColCount}, reread ${reopenedHeader.length} — ${colCountPass ? 'MATCH' : 'MISMATCH'}`);

  const rowCountPass = reopenedRows.length === rows.length;
  if (!rowCountPass) allPass = false;
  console.log(`  Row count: expected ${rows.length}, reread ${reopenedRows.length} — ${rowCountPass ? 'MATCH' : 'MISMATCH'}`);

  // Confirm the first 46 (original) headers are byte-identical to before.
  let originalHeadersPass = true;
  for (let i = 0; i < originalColCount; i++) {
    if (reopenedHeader[i] !== header[i]) { originalHeadersPass = false; break; }
  }
  if (!originalHeadersPass) allPass = false;
  console.log(`  Original ${originalColCount} headers unchanged: ${originalHeadersPass ? 'MATCH' : 'MISMATCH'}`);

  // Confirm each new header resolves to the expected stripped field name at the expected column.
  NEW_FIELDS.forEach((f, i) => {
    const expectedIdx = newColStartIdx + i;
    const actualRaw = reopenedHeader[expectedIdx];
    const actualStripped = actualRaw == null ? null : stripGroupPrefix(actualRaw);
    const pass = actualStripped === f;
    if (!pass) allPass = false;
    console.log(`  ${newColLetters[i]} (index ${expectedIdx}): expected "${f}", reread "${actualStripped}" — ${pass ? 'MATCH' : 'MISMATCH'}`);
  });

  // Re-verify data validations were not touched.
  const reopenedXml = readZipEntry(pmPath, worksheetPart);
  const dvMatch = reopenedXml.match(/<dataValidations[^>]*count="(\d+)"/);
  const dvCountPass = dvMatch && dvMatch[1] === '17';
  if (!dvCountPass) allPass = false;
  console.log(`  Data validations count: expected 17, reread ${dvMatch ? dvMatch[1] : 'NOT FOUND'} — ${dvCountPass ? 'MATCH' : 'MISMATCH'}`);

  if (allPass) {
    console.log('\nRESULT: PASS');
    process.exit(0);
  } else {
    console.log(`\nRESULT: FAIL — one or more checks did not match after save/reopen/reread. Backup preserved at: ${backupPath}`);
    process.exit(1);
  }
}

if (require.main === module) run();

module.exports = { NEW_FIELDS, colIndexToLetter, stripGroupPrefix };
