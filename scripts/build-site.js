'use strict';

const fs   = require('fs');
const path = require('path');

// ── PATHS ────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// ── ALLOWLIST ────────────────────────────────────────────────────────────────

// Top-level files to copy (must exist unless marked optional)
const TOP_LEVEL_FILES = [
  { src: 'index.html',          required: true  },
  { src: 'encyclopedia.html',   required: true  },
  { src: 'credits.html',        required: true  },
  { src: 'beyond-the-basics.html', required: true  },
  { src: 'styles.css',          required: true  },
  { src: 'app.js',              required: true  },
  { src: 'auth.js',             required: true  },
  { src: '101.js',              required: true  },
  { src: 'collection.js',       required: true  },
  { src: 'encyclopedia.js',     required: true  },
  { src: 'family-guide.js',     required: true  },
  { src: 'identify.js',         required: true  },
  { src: 'mood.js',             required: true  },
  { src: 'favicon.svg',         required: true  },
  { src: 'apple-touch-icon.png',required: true  },
  { src: 'social-preview.png',  required: true  },
  { src: 'robots.txt',          required: true  },
  { src: 'sitemap.xml',         required: true  },
];

// Top-level directories to copy recursively (no filtering)
const TOP_LEVEL_DIRS = [
  { src: 'assets', required: true },
  { src: 'beyond-the-basics', required: true },
];

// Exact data files (no other data/ contents)
const DATA_FILES = [
  'data/mood-theme-map.json',
  'data/sub-filter-kw.json',
  'data/sub-filters.json',
  'data/family-guides.json',
  'data/encyclopedia-photo-credits.json',
];

// From stones/: copy *.html and this file; explicitly never generate-stone-page.js
const STONES_EXPLICIT = [
  'stones/enc-icons.css',
];
// stones/*.html is discovered dynamically

// ── HELPERS ──────────────────────────────────────────────────────────────────

function abort(msg) {
  console.error(`\nBUILD ERROR: ${msg}`);
  process.exit(1);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  // Reject symlinks that escape the repository
  const real = fs.realpathSync(src);
  if (!real.startsWith(ROOT + path.sep) && real !== ROOT) {
    abort(`Symlink escapes repository: ${src} → ${real}`);
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

// Files within assets/ that are design artifacts, not runtime dependencies
const ASSETS_EXCLUDE = new Set([
  'all-57-icons-contact-sheet.png',
  'all-57-svgs.zip',
  'manifest.json',
  'manifest-extension.json',
  'preview-final-complete-set.html',
  'preview-icon-extension.html',
  // Unresolved design-option candidates, never wired into any page — kept as
  // source history, not shipped. Re-include here (or remove this note) if one
  // is ever chosen and referenced from a page.
  'Identify Option 1.png',
  'Identify Option 2.png',
  'Identify Option 3.png',
  'Identify4.png',
  'Identify5.png',
  'hero1.png',
  'hero2.png',
  'grid-alternate.png',
]);

function copyDirRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (!stat.isDirectory()) {
    copyFile(src, dest);
    return 1;
  }
  ensureDir(dest);
  let count = 0;
  for (const entry of fs.readdirSync(src)) {
    if (ASSETS_EXCLUDE.has(entry)) {
      console.log(`  SKIP (design artifact)   ${path.relative(ROOT, path.join(src, entry))}`);
      continue;
    }
    count += copyDirRecursive(path.join(src, entry), path.join(dest, entry));
  }
  return count;
}

// ── BUILD ────────────────────────────────────────────────────────────────────

console.log('Building dist/ from allowlist…\n');

// 1. Wipe and recreate dist/
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST);

let totalFiles = 0;

// 2. Top-level files
console.log('Top-level files:');
for (const { src, required } of TOP_LEVEL_FILES) {
  const srcPath  = path.join(ROOT, src);
  const destPath = path.join(DIST, src);
  if (!fs.existsSync(srcPath)) {
    if (required) abort(`Required source missing: ${src}`);
    console.log(`  SKIP (optional, absent)  ${src}`);
    continue;
  }
  copyFile(srcPath, destPath);
  totalFiles++;
  console.log(`  OK  ${src}`);
}

// 3. Top-level directories (recursive)
console.log('\nRuntime directories:');
for (const { src, required } of TOP_LEVEL_DIRS) {
  const srcPath  = path.join(ROOT, src);
  const destPath = path.join(DIST, src);
  if (!fs.existsSync(srcPath)) {
    if (required) abort(`Required directory missing: ${src}/`);
    console.log(`  SKIP (optional, absent)  ${src}/`);
    continue;
  }
  const n = copyDirRecursive(srcPath, destPath);
  totalFiles += n;
  console.log(`  OK  ${src}/  (${n} files)`);
}

// 4. stones/*.html
console.log('\nstones/ HTML:');
const stonesDir  = path.join(ROOT, 'stones');
const stonesHtml = fs.readdirSync(stonesDir)
  .filter(f => f.endsWith('.html'))
  .sort();
for (const f of stonesHtml) {
  const srcPath  = path.join(stonesDir, f);
  const destPath = path.join(DIST, 'stones', f);
  copyFile(srcPath, destPath);
  totalFiles++;
  console.log(`  OK  stones/${f}`);
}

// 5. stones/ explicit non-HTML runtime files
console.log('\nstones/ runtime files:');
for (const rel of STONES_EXPLICIT) {
  const srcPath  = path.join(ROOT, rel);
  const destPath = path.join(DIST, rel);
  if (!fs.existsSync(srcPath)) abort(`Required source missing: ${rel}`);
  copyFile(srcPath, destPath);
  totalFiles++;
  console.log(`  OK  ${rel}`);
}

// 6. Approved data files
console.log('\ndata/ files:');
for (const rel of DATA_FILES) {
  const srcPath  = path.join(ROOT, rel);
  const destPath = path.join(DIST, rel);
  if (!fs.existsSync(srcPath)) abort(`Required source missing: ${rel}`);
  copyFile(srcPath, destPath);
  totalFiles++;
  console.log(`  OK  ${rel}`);
}

// 7. sitemap.xml — add published encyclopedia stone URLs (shared dynamic
// template, so one URL per published slug; no static stone pages). Reads the
// public publishable key already shipped in stones/stone.html. If the fetch
// fails the committed static sitemap.xml is left as copied and a warning is
// printed — the build is not failed over SEO coverage.
async function addStoneSitemapUrls() {
  console.log('\nsitemap.xml stone URLs:');
  try {
    const tpl = fs.readFileSync(path.join(ROOT, 'stones', 'stone.html'), 'utf8');
    const url = tpl.match(/const SUPABASE_URL\s*=\s*'([^']+)'/)?.[1];
    const key = tpl.match(/const SUPABASE_KEY\s*=\s*'([^']+)'/)?.[1];
    if (!url || !key) throw new Error('could not read Supabase constants from stones/stone.html');
    const res = await fetch(`${url}/rest/v1/enc_stone_content?select=slug&published=eq.true&order=slug`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
    const slugs = (await res.json()).map(r => r.slug).filter(s => /^[a-z0-9-]+$/.test(s));
    const smPath = path.join(DIST, 'sitemap.xml');
    const entries = slugs.map(s =>
      `  <url>\n    <loc>https://stillpointlapidary.com/stones/stone.html?slug=${s}</loc>\n  </url>\n`).join('');
    fs.writeFileSync(smPath, fs.readFileSync(smPath, 'utf8').replace('</urlset>', `${entries}</urlset>`));
    console.log(`  OK  ${slugs.length} published stone URL(s) added`);
  } catch (err) {
    console.warn(`  WARN  stone URLs not added to sitemap: ${err.message}`);
  }
}

// ── DONE ─────────────────────────────────────────────────────────────────────

addStoneSitemapUrls().then(() => {
  console.log(`\nBuild complete. ${totalFiles} files written to dist/`);
});
