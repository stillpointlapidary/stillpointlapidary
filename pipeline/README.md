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

### 0. Export structured values from the Production Master (Gate 4)

```
npm run pipeline:export-structured-values
```

Reads the canonical Production Master workbook directly from
`Encyclopedia/Production Data/Still-Point-Lapidary-Production-Master.xlsx` and writes
`pipeline/data/structured-values.generated.json`, keyed by `stone_id`.

This file is **generated, gitignored, and non-authoritative — never hand-edit it.**
Regenerate it whenever the Production Master changes. Packet generation for a
first-time import (no existing `enc_stone_content` row) requires this file as the
source of locked structured values (collection label, chakra, element, zodiac,
material type, navigation). Run this step before generating a packet.

### 1. Generate a packet (2B)

```
node pipeline/generate-packet.js --md tests/fixtures/rose-quartz.md --out rose-quartz.packet.json
```

Reads the canonical MD, the structured-values export, and live Supabase data, and
outputs a database-ready JSON packet. Locked structured fields (collection label,
chakra, element, zodiac, material type, navigation) come from the Production
Master export — this is required, not optional, and generation halts if the
export is missing, has no row for the stone, or its `production_data_version`
doesn't exactly match the canonical MD's front matter. If `enc_stone_content`
already holds a value for one of these fields and it conflicts with the export,
generation halts rather than guessing which source is right.

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

## Typical batch workflow (Gate 4 order)

```bash
# 1. Export locked structured values from the canonical Production Master:
npm run pipeline:export-structured-values

# 2. Generate a packet from the approved canonical MD (docs/encyclopedia/entries/
#    is a staging mirror; canonical MDs live at
#    Documents\Still Point Lapidary\Encyclopedia\Canonical MDs):
node pipeline/generate-packet.js --md docs/encyclopedia/entries/stone-slug.md --out stone-slug.packet.json

# 3. Validate all packets before importing any:
node pipeline/validate-packet.js --packet stone1.packet.json --packet stone2.packet.json ...

# 4. Import atomically, then verify database state:
node pipeline/import-stone.js --packet stone1.packet.json
node pipeline/verify-stone.js --packet stone1.packet.json

# Smoke test after Gate 7 publication:
node pipeline/smoke-test.js --packet stone1.packet.json --base-url https://stillpointlapidary.com
```

---

## File structure

```
pipeline/
  export-structured-values.js  Gate 4: Production Master → generated structured-values JSON
  generate-packet.js    2B: MD + structured-values export + Supabase → JSON packet
  validate-packet.js    2C: Packet validation
  import-stone.js       2D: Atomic import via Postgres RPC
  verify-stone.js       2E: Round-trip field-by-field verification
  smoke-test.js         2F: Rendered-page deterministic checks
  rehearse-cohort3.js   2G: Read-only Cohort 3 rehearsal
  lib/
    parse-md.js         MD schema parser
    icon-map.json       Structured icon map (source of truth for generator)
  data/
    structured-values.generated.json   GENERATED, gitignored — do not hand-edit.
                                        Source is the canonical Production Master.

tests/
  fixtures/
    rose-quartz.md      Canonical clean-path test fixture (baseline)

docs/encyclopedia/
  MD-SCHEMA-REFERENCE.md    Formal schema definition

supabase/migrations/
  import_stone_atomic.sql   Postgres function for atomic import
```
