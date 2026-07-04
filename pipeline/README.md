# Encyclopedia Pipeline

Automated MD-to-database pipeline for Cohort 4 and beyond.

## Prerequisites

```
npm install
npm install --save-dev puppeteer
```

Environment variables required for all scripts:
```
SUPABASE_URL=https://...supabase.co
SUPABASE_SERVICE_KEY=...
```

The Postgres import function must be applied to the target database before importing:
```
supabase/migrations/import_stone_atomic.sql
```

---

## Scripts

### 1. Generate a packet (2B)

```
node pipeline/generate-packet.js --md tests/fixtures/rose-quartz.md --out rose-quartz.packet.json
```

Reads the canonical MD + live Supabase data and outputs a database-ready JSON packet.
The packet is transport only — never hand-edit it. Regenerate fresh on every run.

### 2. Validate a packet (2C)

```
node pipeline/validate-packet.js --packet rose-quartz.packet.json
```

Validates field counts, required fields, controlled vocabularies, icon slugs, and roster slug resolution.
Run across the full batch before any import.

### 3. Import a stone (2D)

```
node pipeline/import-stone.js --packet rose-quartz.packet.json
```

Imports atomically via the `import_stone_atomic` Postgres function.
Per-stone atomicity: if any insert fails, the entire stone rolls back at the database level.
`published` is always set to `false`. Publication only happens at Gate 7.

**`--all-or-nothing` flag is not implemented in v1.** True cohort-wide rollback requires all
stones to commit in a single transaction scope. This is not achievable with sequential per-stone
RPC calls once earlier stones have committed. Flagged for Christie's review.

### 4. Verify a stone (2E)

```
node pipeline/verify-stone.js --packet rose-quartz.packet.json
```

Compares live Supabase values against the packet field-by-field: exact text, display order,
slugs, icon classes, nullable fields. Row counts alone are not sufficient.

### 5. Smoke test (2F)

```
node pipeline/smoke-test.js --packet rose-quartz.packet.json --base-url https://stillpointlapidary.com
```

Deterministic rendered-page checks using Puppeteer. Requires `npm install --save-dev puppeteer`.

### 6. Cohort 3 rehearsal (2G)

```
node pipeline/rehearse-cohort3.js --base-url https://stillpointlapidary.com
```

READ-ONLY rehearsal against live Cohort 3 data. Generates packets from canonical MDs,
validates them, compares against live Supabase records, and runs the smoke test.
No writes, no imports, no publication changes.

Canonical MDs live at `Documents\Still Point Lapidary\Encyclopedia\Canonical MDs`. The
repo-local files under `docs/encyclopedia/entries/` are working mirrors / staging inputs
for the pipeline only — they are not an independent canonical source, and any conflict
resolves in favor of the external canonical file. The pipeline should be updated to read
the external canonical MD path from one approved configuration source.

**PREREQUISITE:** Cohort 3 MDs must be converted to the new schema format
(see `docs/encyclopedia/MD-SCHEMA-REFERENCE.md`) before this rehearsal can run.
The current staged MDs in `docs/encyclopedia/entries/` are in the old format and must be
converted and reviewed by Christie before the rehearsal executes.

---

## Typical batch workflow

```bash
# For each stone in the batch (docs/encyclopedia/entries/ is a staging mirror;
# canonical MDs live at Documents\Still Point Lapidary\Encyclopedia\Canonical MDs):
node pipeline/generate-packet.js --md docs/encyclopedia/entries/stone-slug.md --out stone-slug.packet.json

# Validate all before importing any:
node pipeline/validate-packet.js --packet stone1.packet.json --packet stone2.packet.json ...

# Import and verify each stone:
node pipeline/import-stone.js --packet stone1.packet.json
node pipeline/verify-stone.js --packet stone1.packet.json

# Smoke test after Gate 7 publication:
node pipeline/smoke-test.js --packet stone1.packet.json --base-url https://stillpointlapidary.com
```

---

## File structure

```
pipeline/
  generate-packet.js    2B: MD + Supabase → JSON packet
  validate-packet.js    2C: Packet validation
  import-stone.js       2D: Atomic import via Postgres RPC
  verify-stone.js       2E: Round-trip field-by-field verification
  smoke-test.js         2F: Rendered-page deterministic checks
  rehearse-cohort3.js   2G: Read-only Cohort 3 rehearsal
  lib/
    parse-md.js         MD schema parser
    icon-map.json       Structured icon map (source of truth for generator)

tests/
  fixtures/
    rose-quartz.md      Canonical clean-path test fixture (baseline)

docs/encyclopedia/
  MD-SCHEMA-REFERENCE.md    Formal schema definition

supabase/migrations/
  import_stone_atomic.sql   Postgres function for atomic import
```
