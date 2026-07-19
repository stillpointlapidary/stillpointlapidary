#!/usr/bin/env node
'use strict';

/**
 * One-time catalog-wide normalizer: sets "Production Data Version" to a
 * fixed literal value for every active row in the Production Master.
 *
 * Reuses the same surgical-XML-edit approach as
 * pipeline/tools/update-production-master-row.js (see that file's header
 * comment for why a plain XLSX.readFile()/writeFile() round trip is unsafe
 * against this workbook — it drops data-validation dropdowns and collapses
 * xl/styles.xml). This tool differs only in scope: many rows, one column,
 * one XML write instead of one row, many columns.
 *
 * Usage:
 *   node pipeline/tools/normalize-production-data-version.js --value "production-master" [--dry-run]
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const XLSX = require('xlsx');
const {
  buildColumnIndex,
  colIndexToLetter,
  extractRowBlock,
  extractCell,
  applyCellUpdate,
  resolveWorksheetPart,
} = require('./update-production-master-row.js');

const SHEET_NAME = 'Catalog Master';
const ID_HEADER = 'Stone ID';
const TARGET_HEADER = 'Production Data Version';
const DEFAULT_PATH = 'C:\\Users\\chris\\Documents\\Still Point Lapidary\\Encyclopedia\\Production Data\\Still-Point-Lapidary-Production-Master.xlsx';

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function normalizeValue(value) {
  if (value === undefined || value === null) return null;
  const str = typeof value === 'string' ? value : String(value);
  const trimmed = str.trim();
  return trimmed === '' ? null : trimmed;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { path: DEFAULT_PATH, value: null, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path') opts.path = args[++i];
    else if (args[i] === '--value') opts.value = args[++i];
    else if (args[i] === '--dry-run') opts.dryRun = true;
  }
  return opts;
}

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
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-pdv-normalize-'));
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
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-pdv-normalize-read-'));
  const outPath = path.join(tmpDir, 'entry.xml');
  try {
    const output = runPowerShellFile(READ_ENTRY_PS, [archivePath, entryName, outPath]);
    if (!output.includes('READ_OK')) {
      fail(`Could not read zip entry "${entryName}". Output: ${output.trim()}`);
    }
    return fs.readFileSync(outPath, 'utf8');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function writeZipEntry(archivePath, entryName, content) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-pdv-normalize-write-'));
  const contentPath = path.join(tmpDir, 'entry.xml');
  fs.writeFileSync(contentPath, content, 'utf8');
  try {
    const output = runPowerShellFile(WRITE_ENTRY_PS, [archivePath, entryName, contentPath]);
    if (!output.includes('WRITE_OK')) {
      fail(`Zip entry write did not report success for "${entryName}". Output: ${output.trim()}`);
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function backupWorkbook(sourcePath) {
  const dir = path.join(path.dirname(sourcePath), 'snapshots');
  fs.mkdirSync(dir, { recursive: true });
  const ext = path.extname(sourcePath);
  const base = path.basename(sourcePath, ext);
  const ts = new Date().toISOString().replace(/:/g, '-').replace(/\..+Z$/, 'Z');
  const backupPath = path.join(dir, `${base}-${ts}-pre-pdv-normalize${ext}`);
  fs.copyFileSync(sourcePath, backupPath);
  return backupPath;
}

function run() {
  const opts = parseArgs();
  if (!opts.value) fail('Provide --value "<literal value>".');
  if (!fs.existsSync(opts.path)) fail(`Workbook not found at: ${opts.path}`);

  const workbook = XLSX.readFile(opts.path);
  if (!workbook.SheetNames.includes(SHEET_NAME)) {
    fail(`Workbook is missing the expected sheet "${SHEET_NAME}".`);
  }
  const sheet = workbook.Sheets[SHEET_NAME];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  if (rows.length < 2) fail(`Sheet "${SHEET_NAME}" has no data rows.`);

  const colIndex = buildColumnIndex(rows[0]);
  if (colIndex[ID_HEADER] === undefined || colIndex[ID_HEADER] === 'AMBIGUOUS') {
    fail(`Could not resolve "${ID_HEADER}" header.`);
  }
  if (colIndex[TARGET_HEADER] === undefined || colIndex[TARGET_HEADER] === 'AMBIGUOUS') {
    fail(`Could not resolve "${TARGET_HEADER}" header.`);
  }
  const idColIdx = colIndex[ID_HEADER];
  const targetColIdx = colIndex[TARGET_HEADER];
  const targetColLetter = colIndexToLetter(targetColIdx);

  // Snapshot every row's full content (all columns) before writing, keyed by
  // Excel row number, so the post-write reread can confirm nothing else moved.
  const beforeSnapshot = {};
  let activeRowCount = 0;
  const beforeValues = {};
  for (let r = 1; r < rows.length; r++) {
    const stoneId = normalizeValue(rows[r][idColIdx]);
    if (!stoneId) continue; // skip trailing blank rows, if any
    activeRowCount++;
    const excelRowNum = r + 1;
    beforeSnapshot[excelRowNum] = rows[r].map((v) => normalizeValue(v));
    beforeValues[excelRowNum] = normalizeValue(rows[r][targetColIdx]);
  }

  console.log(`Active rows found (non-blank Stone ID): ${activeRowCount}`);
  console.log(`Target column: "${TARGET_HEADER}" (${targetColLetter})`);
  console.log(`Target value: ${JSON.stringify(opts.value)}`);
  console.log(opts.dryRun ? 'Mode: DRY RUN — no changes will be written.' : 'Mode: LIVE WRITE');

  const distinctBefore = {};
  Object.values(beforeValues).forEach((v) => { distinctBefore[v] = (distinctBefore[v] || 0) + 1; });
  console.log('Distinct values before:', JSON.stringify(distinctBefore));

  if (opts.dryRun) {
    console.log('\nRESULT: DRY RUN COMPLETE — no changes written.');
    return;
  }

  const backupPath = backupWorkbook(opts.path);
  console.log(`Backup created: ${backupPath}`);

  const worksheetPart = resolveWorksheetPart(opts.path, SHEET_NAME);
  let sheetXml = readZipEntry(opts.path, worksheetPart);

  let patchedCount = 0;
  for (const excelRowNumStr of Object.keys(beforeSnapshot)) {
    const excelRowNum = Number(excelRowNumStr);
    const row = extractRowBlock(sheetXml, excelRowNum);
    if (!row) fail(`Could not locate row ${excelRowNum} in the worksheet XML — aborting before any further writes.`);
    const addr = `${targetColLetter}${excelRowNum}`;
    const newContent = applyCellUpdate(row.content, addr, targetColIdx, opts.value);
    const newRow = `<row r="${excelRowNum}"${row.attrs}>${newContent}</row>`;
    sheetXml = sheetXml.slice(0, row.index) + newRow + sheetXml.slice(row.index + row.fullMatch.length);
    patchedCount++;
  }

  console.log(`Rows patched in memory: ${patchedCount}`);

  writeZipEntry(opts.path, worksheetPart, sheetXml);
  console.log(`Worksheet part written: ${worksheetPart}`);

  // Reopen and reread.
  const reopened = XLSX.readFile(opts.path);
  const reopenedSheet = reopened.Sheets[SHEET_NAME];
  const reopenedRows = XLSX.utils.sheet_to_json(reopenedSheet, { header: 1, defval: null });
  const reopenedColIndex = buildColumnIndex(reopenedRows[0]);

  let allPass = true;
  let mismatchCount = 0;
  let unexpectedRowChangeCount = 0;
  const unexpectedChanges = [];

  for (const excelRowNumStr of Object.keys(beforeSnapshot)) {
    const excelRowNum = Number(excelRowNumStr);
    const r = excelRowNum - 1;
    const reopenedRow = reopenedRows[r] || [];
    const afterTarget = normalizeValue(reopenedRow[reopenedColIndex[TARGET_HEADER]]);
    if (afterTarget !== opts.value) {
      allPass = false;
      mismatchCount++;
    }

    // Confirm every other column in this row is unchanged.
    const beforeRow = beforeSnapshot[excelRowNum];
    const maxLen = Math.max(beforeRow.length, reopenedRow.length);
    for (let c = 0; c < maxLen; c++) {
      if (c === targetColIdx) continue;
      const beforeVal = normalizeValue(beforeRow[c]);
      const afterVal = normalizeValue(reopenedRow[c]);
      if (beforeVal !== afterVal) {
        unexpectedRowChangeCount++;
        unexpectedChanges.push({ excelRowNum, col: c, before: beforeVal, after: afterVal });
      }
    }
  }

  const distinctAfter = {};
  for (const excelRowNumStr of Object.keys(beforeSnapshot)) {
    const excelRowNum = Number(excelRowNumStr);
    const r = excelRowNum - 1;
    const v = normalizeValue((reopenedRows[r] || [])[reopenedColIndex[TARGET_HEADER]]);
    distinctAfter[v] = (distinctAfter[v] || 0) + 1;
  }

  console.log('\nSave/reopen/reread verification:');
  console.log(`  Rows checked: ${Object.keys(beforeSnapshot).length}`);
  console.log(`  Mismatches on target column: ${mismatchCount}`);
  console.log(`  Unexpected changes in other columns: ${unexpectedRowChangeCount}`);
  if (unexpectedChanges.length) {
    console.log('  Unexpected change detail (first 20):', JSON.stringify(unexpectedChanges.slice(0, 20), null, 2));
  }
  console.log('  Distinct values after:', JSON.stringify(distinctAfter));
  console.log(`  Total row count after: ${reopenedRows.length - 1}`);

  if (allPass && unexpectedRowChangeCount === 0 && reopenedRows.length - 1 === activeRowCount) {
    console.log('\nRESULT: PASS');
  } else {
    console.log(`\nRESULT: FAIL — backup preserved at: ${backupPath}`);
    process.exit(1);
  }
}

run();
