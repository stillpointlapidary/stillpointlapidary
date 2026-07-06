#!/usr/bin/env node
'use strict';

/**
 * Guarded Production Master row-update tool.
 *
 * Updates a small set of approved administrative columns on exactly one
 * stone row in the canonical Production Master workbook, identified by
 * exact normalized Stone ID. Refuses to run on anything ambiguous.
 *
 * Why this doesn't just use XLSX.readFile()/XLSX.writeFile():
 * A plain read/write round trip through the `xlsx` package (SheetJS
 * Community Edition) was tested against the real Production Master and
 * silently drops every data-validation dropdown (17 of them) and collapses
 * xl/styles.xml to a fraction of its size — it does not preserve everything
 * it doesn't parse. That would violate "must not change formatting or
 * unrelated cells" on every save. Instead, this script:
 *   1. Uses the `xlsx` package only to READ (safe, matches the rest of the
 *      pipeline's convention) — to find the header row, resolve columns,
 *      and locate the target row.
 *   2. Performs the actual write as a surgical edit of the raw worksheet
 *      XML inside the .xlsx zip: only the target cell(s) in the target row
 *      are replaced; every other byte of the archive (styles, data
 *      validations, merges, other sheets, other rows) is left untouched.
 *      The zip surgery goes through .NET's System.IO.Compression.ZipArchive
 *      (via a throwaway PowerShell process) rather than any Node zip
 *      library, since none is currently a project dependency and this
 *      avoids adding one just for this.
 *
 * Usage:
 *   node pipeline/tools/update-production-master-row.js --input path/to/update.json
 *   node pipeline/tools/update-production-master-row.js --json "{...}"
 *   node pipeline/tools/update-production-master-row.js --input update.json --dry-run
 *
 * Input JSON shape:
 *   {
 *     "production_master_path": "C:\\...\\Still-Point-Lapidary-Production-Master.xlsx",
 *     "stone_id": "C-0188",
 *     "updates": { "Notes": "..." }
 *   }
 *
 * Exit code 0 on PASS, nonzero on any refusal or FAIL.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const XLSX = require('xlsx');

const SHEET_NAME = 'Catalog Master';
const ID_HEADER = 'Stone ID';

// Only these columns may be written. Exact, case-sensitive header match
// (after stripping the "Group X — Label | " prefix) — no substring/alias
// matching. If the workbook's actual header differs, this tool stops and
// reports the mismatch rather than guessing.
const ALLOWED_COLUMNS = [
  'Element',
  'Zodiac',
  'Encyclopedia Energetic Role',
  'Energetic Role Icon',
  'Color Energy',
  'Encyclopedia Production Status',
  'Blocker',
  'Notes',
];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function stripGroupPrefix(header) {
  const parts = String(header).split('|');
  return parts[parts.length - 1].trim();
}

function normalizeId(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function normalizeValue(value) {
  if (value === undefined || value === null) return null;
  const str = typeof value === 'string' ? value : String(value);
  const trimmed = str.trim();
  return trimmed === '' ? null : trimmed;
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { input: null, json: null, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input') opts.input = args[++i];
    else if (args[i] === '--json') opts.json = args[++i];
    else if (args[i] === '--dry-run') opts.dryRun = true;
  }
  return opts;
}

function loadInput(opts) {
  if (!opts.input && !opts.json) {
    fail("Provide --input <path-to-json-file> or --json '<json>'.");
  }
  let raw;
  if (opts.input) {
    if (!fs.existsSync(opts.input)) fail(`Input file not found: ${opts.input}`);
    raw = fs.readFileSync(opts.input, 'utf8');
  } else {
    raw = opts.json;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    fail(`Input is not valid JSON: ${err.message}`);
  }
  return parsed;
}

function validateInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    fail('Input must be a JSON object.');
  }
  if (!input.production_master_path || typeof input.production_master_path !== 'string') {
    fail('Input is missing required field "production_master_path".');
  }
  const stoneId = normalizeId(input.stone_id);
  if (!stoneId) fail('Input is missing required field "stone_id" (Stone ID cannot be blank).');
  if (!input.updates || typeof input.updates !== 'object' || Array.isArray(input.updates)) {
    fail('Input is missing required field "updates" (object).');
  }
  const updateKeys = Object.keys(input.updates);
  if (updateKeys.length === 0) fail('"updates" is empty — nothing to do.');
  const forbidden = updateKeys.filter((k) => !ALLOWED_COLUMNS.includes(k));
  if (forbidden.length > 0) {
    fail(
      `Requested column(s) are not in the allowed list: ${forbidden.join(', ')}.\n` +
      `Allowed columns: ${ALLOWED_COLUMNS.join(', ')}`
    );
  }
  return {
    productionMasterPath: input.production_master_path,
    stoneId,
    updates: input.updates,
  };
}

// ---------------------------------------------------------------------------
// Workbook read (safe, read-only, via the xlsx package)
// ---------------------------------------------------------------------------

function loadWorkbook(sourcePath) {
  if (!fs.existsSync(sourcePath)) fail(`Workbook not found at: ${sourcePath}`);
  let workbook;
  try {
    workbook = XLSX.readFile(sourcePath);
  } catch (err) {
    fail(`Failed to read workbook: ${err.message}`);
  }
  if (!workbook.SheetNames.includes(SHEET_NAME)) {
    fail(`Workbook is missing the expected sheet "${SHEET_NAME}". Found sheets: ${workbook.SheetNames.join(', ')}`);
  }
  return workbook;
}

function buildColumnIndex(headerRow) {
  const index = {};
  headerRow.forEach((cell, i) => {
    if (cell == null) return;
    const stripped = stripGroupPrefix(cell);
    if (Object.prototype.hasOwnProperty.call(index, stripped)) {
      index[stripped] = 'AMBIGUOUS';
    } else {
      index[stripped] = i;
    }
  });
  return index;
}

function findMatchingRows(rows, idColIndex, stoneId) {
  const matches = [];
  for (let r = 1; r < rows.length; r++) {
    if (normalizeId(rows[r][idColIndex]) === stoneId) matches.push(r);
  }
  return matches;
}

// ---------------------------------------------------------------------------
// Column letter <-> index (A1 notation)
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

function letterToColIndex(letters) {
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

// ---------------------------------------------------------------------------
// Raw worksheet XML surgery
// ---------------------------------------------------------------------------

function escapeXmlText(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-row-update-'));
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
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-row-update-read-'));
  const outPath = path.join(tmpDir, 'entry.xml');
  try {
    const output = runPowerShellFile(READ_ENTRY_PS, [archivePath, entryName, outPath]);
    if (!output.includes('READ_OK')) {
      fail(`Could not read zip entry "${entryName}" from ${archivePath}. Output: ${output.trim()}`);
    }
    return fs.readFileSync(outPath, 'utf8');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function writeZipEntry(archivePath, entryName, content) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-row-update-write-'));
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

// Resolves the sheet-name -> worksheet-part mapping (e.g. "Catalog Master"
// -> "xl/worksheets/sheet1.xml") from the workbook's own manifest, rather
// than assuming sheet order/file naming.
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

function extractRowBlock(sheetXml, excelRowNum) {
  const pairedRe = new RegExp(`<row r="${excelRowNum}"([^>]*)>([\\s\\S]*?)</row>`);
  let m = sheetXml.match(pairedRe);
  if (m) return { fullMatch: m[0], attrs: m[1], content: m[2], index: m.index };
  const selfClosingRe = new RegExp(`<row r="${excelRowNum}"([^>]*)/>`);
  m = sheetXml.match(selfClosingRe);
  if (m) return { fullMatch: m[0], attrs: m[1], content: '', index: m.index };
  return null;
}

function extractCell(rowContent, addr) {
  const pairedRe = new RegExp(`<c r="${addr}"([^>]*)>([\\s\\S]*?)</c>`);
  let m = rowContent.match(pairedRe);
  if (m) return { exists: true, fullMatch: m[0], attrs: m[1], index: m.index };
  const selfClosingRe = new RegExp(`<c r="${addr}"([^>]*)/>`);
  m = rowContent.match(selfClosingRe);
  if (m) return { exists: true, fullMatch: m[0], attrs: m[1], index: m.index };
  return { exists: false };
}

function buildCellXml(addr, styleAttr, value) {
  const styleStr = styleAttr ? ` s="${styleAttr}"` : '';
  return `<c r="${addr}"${styleStr} t="inlineStr"><is><t xml:space="preserve">${escapeXmlText(value)}</t></is></c>`;
}

// Replaces, removes, or inserts exactly one cell within a row's XML content,
// preserving that cell's existing style ref (s="N") if it had one, and
// preserving the sparse-cell convention (blank fields have no <c> element)
// used throughout this workbook. Leaves every other cell untouched.
function applyCellUpdate(rowContent, addr, targetColIdx, value) {
  const existing = extractCell(rowContent, addr);
  let styleAttr = null;
  if (existing.exists) {
    const sMatch = existing.attrs.match(/\ss="(\d+)"/);
    styleAttr = sMatch ? sMatch[1] : null;
  }

  if (value === null) {
    if (!existing.exists) return rowContent;
    return rowContent.slice(0, existing.index) + rowContent.slice(existing.index + existing.fullMatch.length);
  }

  const newCellXml = buildCellXml(addr, styleAttr, value);

  if (existing.exists) {
    return rowContent.slice(0, existing.index) + newCellXml + rowContent.slice(existing.index + existing.fullMatch.length);
  }

  const cellRe = /<c r="([A-Z]+)\d+"/g;
  let insertAt = rowContent.length;
  let m;
  while ((m = cellRe.exec(rowContent)) !== null) {
    if (letterToColIndex(m[1]) > targetColIdx) { insertAt = m.index; break; }
  }
  return rowContent.slice(0, insertAt) + newCellXml + rowContent.slice(insertAt);
}

function patchWorksheetXml(sheetXml, excelRowNum, cellUpdates) {
  const row = extractRowBlock(sheetXml, excelRowNum);
  if (!row) fail(`Could not locate row ${excelRowNum} in the worksheet XML — refusing to write.`);

  let newContent = row.content;
  for (const { addr, colIdx, value } of cellUpdates) {
    newContent = applyCellUpdate(newContent, addr, colIdx, value);
  }

  const newRow = `<row r="${excelRowNum}"${row.attrs}>${newContent}</row>`;
  return sheetXml.slice(0, row.index) + newRow + sheetXml.slice(row.index + row.fullMatch.length);
}

// ---------------------------------------------------------------------------
// Backup
// ---------------------------------------------------------------------------

function backupWorkbook(sourcePath, stoneId) {
  const dir = path.join(path.dirname(sourcePath), 'snapshots');
  fs.mkdirSync(dir, { recursive: true });
  const ext = path.extname(sourcePath);
  const base = path.basename(sourcePath, ext);
  const ts = new Date().toISOString().replace(/:/g, '-').replace(/\..+Z$/, 'Z');
  const backupPath = path.join(dir, `${base}-${ts}-pre-update-${stoneId}${ext}`);
  fs.copyFileSync(sourcePath, backupPath);
  return backupPath;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function run() {
  const opts = parseArgs();
  const input = loadInput(opts);
  const { productionMasterPath, stoneId, updates } = validateInput(input);

  const workbook = loadWorkbook(productionMasterPath);
  const sheet = workbook.Sheets[SHEET_NAME];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  if (rows.length < 2) fail(`Sheet "${SHEET_NAME}" has no data rows.`);

  const colIndex = buildColumnIndex(rows[0]);

  if (colIndex[ID_HEADER] === undefined) fail(`Workbook is missing the expected "${ID_HEADER}" header.`);
  if (colIndex[ID_HEADER] === 'AMBIGUOUS') fail(`"${ID_HEADER}" header is ambiguous in the workbook.`);

  const requestedCols = Object.keys(updates);
  for (const col of requestedCols) {
    if (colIndex[col] === undefined) {
      const near = Object.keys(colIndex).filter(
        (h) => h.toLowerCase().includes(col.toLowerCase()) || col.toLowerCase().includes(h.toLowerCase())
      );
      fail(`Column header "${col}" was not found in the workbook.${near.length ? ` Nearby header(s): ${near.join(', ')}` : ''}`);
    }
    if (colIndex[col] === 'AMBIGUOUS') {
      fail(`Column header "${col}" is ambiguous in the workbook (matches more than one column after group-prefix stripping).`);
    }
  }

  const idColIndex = colIndex[ID_HEADER];
  const matches = findMatchingRows(rows, idColIndex, stoneId);
  if (matches.length === 0) fail(`Stone ID "${stoneId}" matches zero rows.`);
  if (matches.length > 1) {
    fail(`Stone ID "${stoneId}" matches ${matches.length} rows (Excel row(s) ${matches.map((r) => r + 1).join(', ')}). Refusing to proceed.`);
  }

  const rowIndex = matches[0];
  const excelRowNum = rowIndex + 1;

  const before = {};
  const plannedAfter = {};
  for (const col of requestedCols) {
    before[col] = normalizeValue(rows[rowIndex][colIndex[col]]);
    plannedAfter[col] = normalizeValue(updates[col]);
  }

  console.log(`Stone ID: ${stoneId}  (Excel row ${excelRowNum}, sheet "${SHEET_NAME}")`);
  console.log(opts.dryRun ? 'Mode: DRY RUN — no changes will be written.\n' : 'Mode: LIVE WRITE\n');
  for (const col of requestedCols) {
    console.log(`  ${col}:`);
    console.log(`    before: ${JSON.stringify(before[col])}`);
    console.log(`    after:  ${JSON.stringify(plannedAfter[col])}`);
  }

  if (opts.dryRun) {
    console.log('\nRESULT: DRY RUN COMPLETE — no changes written.');
    process.exit(0);
  }

  const backupPath = backupWorkbook(productionMasterPath, stoneId);
  console.log(`\nBackup created: ${backupPath}`);

  const worksheetPart = resolveWorksheetPart(productionMasterPath, SHEET_NAME);
  const sheetXml = readZipEntry(productionMasterPath, worksheetPart);

  const cellUpdates = requestedCols.map((col) => ({
    addr: `${colIndexToLetter(colIndex[col])}${excelRowNum}`,
    colIdx: colIndex[col],
    value: plannedAfter[col],
  }));

  const patchedXml = patchWorksheetXml(sheetXml, excelRowNum, cellUpdates);
  writeZipEntry(productionMasterPath, worksheetPart, patchedXml);
  console.log(`Worksheet part written: ${worksheetPart}`);

  const reopened = XLSX.readFile(productionMasterPath);
  const reopenedSheet = reopened.Sheets[SHEET_NAME];
  const reopenedRows = XLSX.utils.sheet_to_json(reopenedSheet, { header: 1, defval: null });
  const reopenedColIndex = buildColumnIndex(reopenedRows[0]);
  const reopenedMatches = findMatchingRows(reopenedRows, reopenedColIndex[ID_HEADER], stoneId);

  if (reopenedMatches.length !== 1) {
    console.log(`\nRESULT: FAIL — after saving, Stone ID "${stoneId}" matched ${reopenedMatches.length} row(s) on reread instead of exactly 1.`);
    console.log(`Backup preserved at: ${backupPath}`);
    process.exit(1);
  }

  const reopenedRowIndex = reopenedMatches[0];
  let allPass = true;
  console.log('\nSave/reopen/reread verification:');
  for (const col of requestedCols) {
    const expected = plannedAfter[col];
    const actual = normalizeValue(reopenedRows[reopenedRowIndex][reopenedColIndex[col]]);
    const pass = actual === expected;
    if (!pass) allPass = false;
    console.log(`  ${col}: expected ${JSON.stringify(expected)}, reread ${JSON.stringify(actual)} — ${pass ? 'MATCH' : 'MISMATCH'}`);
  }

  if (allPass) {
    console.log('\nRESULT: PASS');
    process.exit(0);
  } else {
    console.log(`\nRESULT: FAIL — one or more fields did not match after save/reopen/reread. Backup preserved at: ${backupPath}`);
    process.exit(1);
  }
}

if (require.main === module) run();

module.exports = {
  ALLOWED_COLUMNS,
  stripGroupPrefix,
  normalizeId,
  normalizeValue,
  buildColumnIndex,
  findMatchingRows,
  colIndexToLetter,
  letterToColIndex,
  escapeXmlText,
  extractRowBlock,
  extractCell,
  applyCellUpdate,
  patchWorksheetXml,
  resolveWorksheetPart,
};
