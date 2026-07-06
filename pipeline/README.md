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

## Canonical paths

`pipeline/lib/paths.js` is the single source for canonical paths outside this
repo (Production Master, Canonical MDs root, Research root) and for the two
generated/working pipeline paths (`pipeline/data/structured-values.generated.json`,
`pipeline/output/`). Scripts import from there instead of hard-coding a second
copy — see Project Rules/CLAUDE.md §4 for the paths themselves. Canonical MD
paths are still passed explicitly per invocation (`--md <path>`), per the MD
handoff rule; `paths.js` does not guess which MD to use.

---

## Scripts

### Gate 0 — Cohort/stone preflight (research readiness)

```
npm run pipeline:gate0 -- --stone ocean-jasper
npm run pipeline:gate0 -- --stone "Ocean Jasper"
npm run pipeline:gate0 -- --stones ocean-jasper,moss-agate
```

Read-only. Production-Master-only — no Supabase, no other files, no broad
filesystem search. Opens the canonical Production Master workbook directly
(via the `xlsx` package; this project's Node pipeline has no Python/openpyxl
dependency, so `xlsx` is the equivalent direct, read-only, header-mapped
open), maps columns by header name (not fixed position), and reports whether
a stone is ready for **Gate 1 research** — not whether it is ready to
publish (that's `gate4-precheck.js`, below).

Identify a stone by canonical name or slug, case-insensitively. Accepts one
`--stone` per flag (repeatable) or a comma-separated `--stones` list.

Checks: duplicate Stone ID/name/slug, missing identity fields, Material Type
and Encyclopedia Energetic Role against their controlled vocabularies,
chakra/Color Energy presence, navigation pointer completeness, image
status/path (informational only — never a blocker), Exception/Identity Flag
and Structured Data Status (informational), and the Blocker/Notes fields —
which only become a `BLOCKER` if they contain actual stop-research or
identity-contradiction language (e.g. "do not proceed"), not ordinary status
prose (e.g. "restart under current workflow"). Planet is not a Gate 0 field
and is never read.

**PASS / WARN / BLOCKER:**
- `PASS` — present, valid, no action needed before research.
- `WARN` — needs awareness (e.g. a field pending research, a non-final
  image) but does not stop Gate 1.
- `BLOCKER` — research should not begin. Each blocker reports what failed,
  where it was checked, why it matters, and a fix target.

If a stone can't be found by the given name/slug, Gate 0 reports the exact
lookup failure and any roster entries that substring-match the query — it
does not guess an identity. If the workbook is missing an expected header,
Gate 0 reports the missing header(s) and the full Gate 0 field map (Gate 0
field -> Production Master header) instead of guessing a column.

Exit code is `0` when no stone in the run has a blocker, `1` otherwise.

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

`enc_stone_content.published` defaults to `true` — default Gate 4 imports and
publishes in the same controlled pass (ENCYCLOPEDIA-PRODUCTION-WORKFLOW.md §2).
Pass `--hold` only when Christie or Dustin has explicitly requested an
unpublished preview/import hold for that stone; that sets `published: false`.

`enc_stone_content.image_alt` (Christie-approved 2026-07-05, see
ENCYCLOPEDIA-CONTENT-FIELDS.md §14): the canonical MD does not carry alt text.
An existing approved value on the current row is preserved; otherwise a
generic fallback ("{Stone Name} specimen for the Still Point Lapidary
encyclopedia.") is used and a `WARN` is printed. This is never a blocker —
real specimen-specific alt text is written during photo QA once the final
photo is uploaded, not during drafting or import.

The packet is transport only — never hand-edit it. Regenerate fresh on every run.

### 2. Validate a packet (2C)

```
node pipeline/validate-packet.js --packet rose-quartz.packet.json
```

Validates field counts, required fields, controlled vocabularies, icon slugs, and roster slug resolution.
Run across the full batch before any import.

### 2a. Reconcile structured fields on an existing-live row (pre-Gate-4)

```
node pipeline/reconcile-structured-fields.js --stone red-jasper
node pipeline/reconcile-structured-fields.js --stone red-jasper --apply
node pipeline/reconcile-structured-fields.js --all [--apply]
```

For a stone that already has an `enc_stone_content` row (a correction or reimport),
compares only the PM-controlled structured fields (`chakra_primary`, `chakra_secondary`,
`element`, `zodiac`, `material_type`, `energetic_role`, `energetic_role_icon`, `color_energy`,
`nav_prev_slug`, `nav_prev_name`, `nav_next_slug`, `nav_next_name`) against the structured-values
export and reports drift. `energetic_role_icon` is derived from `energetic_role` via `icon-map.json`,
not read as an independent Production Master column. Never reads or writes public-copy fields.

Dry-run by default — run `pipeline:export-structured-values` first, then this. Apply only with
`--apply`. A stone with no existing `enc_stone_content` row is skipped (use the normal Gate 4
packet/import path for a first-time import instead).

### 3. Import a stone (2D)

```
node pipeline/import-stone.js --packet rose-quartz.packet.json
```

Imports atomically via the `import_stone_atomic` Postgres function.
Per-stone atomicity: if any insert/update fails, the entire stone rolls back at the database level.
Create-or-update: a first-time `stone_id` (no existing `enc_stone_content` row) inserts; a
previously-imported/previously-live `stone_id` (existing row) updates the parent row in place and
fully resynchronizes every child table from the packet. The report line shows which path ran
(`[insert]` or `[update]`).
`published` is written from the packet's `enc_stone_content.published` value (default `true`,
so the default Gate 4 path imports and publishes in this same pass). It is `false` only when
the packet was generated with `--hold` for an explicit Christie/Dustin-requested unpublished
hold — that stone remains unpublished until Gate 7.

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

# 4. Import atomically (publishes in this same pass by default; pass --hold on
#    step 2's generate-packet.js call for an explicit unpublished hold instead),
#    then verify database state:
node pipeline/import-stone.js --packet stone1.packet.json
node pipeline/verify-stone.js --packet stone1.packet.json

# Smoke test once the stone is live (default path: right after step 4;
# explicit-hold path: after the Gate 7 publish step):
node pipeline/smoke-test.js --packet stone1.packet.json --base-url https://stillpointlapidary.com
```

---

## File structure

```
pipeline/
  gate0.js              Gate 0: read-only stone/cohort research-readiness preflight
  export-structured-values.js  Gate 4: Production Master → generated structured-values JSON
  gate4-precheck.js     Gate 4: read-only import/publication-readiness preflight
  reconcile-structured-fields.js  Pre-Gate-4: existing-live PM-controlled field drift check/fix
  generate-packet.js    2B: MD + structured-values export + Supabase → JSON packet
  validate-packet.js    2C: Packet validation
  import-stone.js       2D: Atomic create-or-update import via Postgres RPC
  verify-stone.js       2E: Round-trip field-by-field verification
  smoke-test.js         2F: Rendered-page deterministic checks
  rehearse-cohort3.js   2G: Read-only Cohort 3 rehearsal
  lib/
    paths.js            Single source for canonical paths (see "Canonical paths" above)
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
  import_stone_atomic.sql   Postgres function for atomic create-or-update import
```
