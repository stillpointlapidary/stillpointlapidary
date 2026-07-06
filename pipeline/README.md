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

## Gate 4 execution rules

These rules exist so a normal, already-approved stone doesn't need bespoke
instruction to run through Gate 4. If any of these don't hold for a given
stone, that's a stop condition — ask, don't guess.

### Readiness — research record and MD must both be saved and reread first

A stone is not Gate-4-ready unless its research record **and** its canonical
MD are both saved and reread cleanly. The research record should be saved
before or together with the MD save task, not discovered or saved for the
first time right before import. Finding a missing/unsaved research record at
Gate 4 is a readiness failure, not a Gate 4 problem to work around.

### Authorization — default Gate 4 means import + publish, once approved

Once Christie or Dustin has approved the canonical MD, the default meaning of
"run Gate 4" is: import and publish in the same controlled pass, after
successful automated validation. Claude Code should not stop mid-sequence to
ask for separate publication authorization — that authorization was already
given at MD approval. The only exception is an **explicit unpublished hold**
stated by Christie or Dustin for that specific stone; when a hold applies,
Gate 4 stops after import and verification, and publication happens later at
Gate 7. Do not treat "successful validation," "successful packet
generation," or "successful import" as a place to pause and ask — those are
expected mechanical checkpoints, not decision points.

### Authority — Supabase is operational output, not authority

The Production Master and the approved canonical MD control what gets
imported. Supabase is where it ends up, never where a value is decided. On
any drift between an existing Supabase value and the Production Master
export, the Production Master export wins — the pipeline halts on conflict
rather than silently preferring what's already live.

### Production Master status drift on a rebuild

If a previously-live, old-schema stone is being rebuilt and its Production
Master `Encyclopedia Production Status` still says `Full Entry Live` while
its current-model structured fields are incomplete or stale, that status is
leftover from the old workflow, not a current approval. Reset/prepare that
row to the current approved state before Gate 4 — normally `MD Approved`,
once the current MD and structured values have actually been approved. Do
not let an old live status stand in for current approval, and do not run
Gate 4 against a row whose status and actual readiness disagree without
resolving that first.

### No deploy implied

Gate 4 (import + publish) never implies or requires a Netlify deploy.
Publishing a stone is a Supabase status/content change on a dynamic-template
page — it takes effect immediately. Only a runtime/template/CSS/public-asset
change requires a deploy, and Gate 4 doesn't touch any of those.

---

## One-command runner (preferred)

```
node pipeline/run-gate4-stone.js --stone red-jasper
node pipeline/run-gate4-stone.js --stone red-jasper --apply
```

or via npm:

```
npm run pipeline:gate4-stone -- --stone red-jasper
npm run pipeline:gate4-stone -- --stone red-jasper --apply
```

Runs the full standard flow below in order for one already-approved stone,
identified by canonical name, slug, or Stone ID — no sub-step needs to be run
or checked by hand. Without `--apply` it's a dry run: everything through Gate
4 precheck runs for real (all reads, structured-values export, packet
generation/validation), but nothing is imported, published, or written to
the Production Master, and pending reconciliation drift stops the run with a
message instead of being silently carried forward. `--apply` also applies
pending reconciliation, runs the real atomic import, runs verify-stone, and
— only if verify-stone passes — updates the Production Master. Prints one
compact `PASS`/`BLOCKED` report (see `pipeline/run-gate4-stone.js` for the
exact field list). Does not support an explicit unpublished hold; run the
steps below by hand for that case.

## Approved Stone → Gate 4 checklist

What the runner above does, spelled out — short enough to paste into a
future Claude Code task without re-deriving the whole workflow, or to run by
hand for the explicit-hold case the runner doesn't cover. Assumes the
canonical MD is already approved and the research record is already saved.

```
1. npm run pipeline:export-structured-values
2. If enc_stone_content already exists for this stone:
     node pipeline/reconcile-structured-fields.js --stone <slug-or-id>
     node pipeline/reconcile-structured-fields.js --stone <slug-or-id> --apply   (only if drift found)
3. node pipeline/generate-packet.js --md "<canonical MD path>"
4. node pipeline/validate-packet.js --packet pipeline/output/<slug>.packet.json
5. node pipeline/gate4-precheck.js --md "<canonical MD path>"
6. node pipeline/import-stone.js --packet pipeline/output/<slug>.packet.json
7. node pipeline/verify-stone.js --packet pipeline/output/<slug>.packet.json
8. Only after verify-stone PASSes: update Production Master status fields,
   save, close/reopen, reread.
```

First-time stone (no existing `enc_stone_content` row) → skip step 2, insert
path runs automatically at step 6. Existing/previously-live stone → run step
2, update path runs automatically at step 6. Both paths are atomic and both
report through the same `import-stone`/`verify-stone` commands — nothing
else changes between the two cases.

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
material type, navigation). Run this step first, before reconciliation or
packet generation.

### 0a. Reconcile existing structured fields (pre-Gate-4)

```
node pipeline/reconcile-structured-fields.js --stone red-jasper
node pipeline/reconcile-structured-fields.js --stone red-jasper --apply
node pipeline/reconcile-structured-fields.js --all [--apply]
```

Run this for any stone that **already has an `enc_stone_content` row** —
a correction, a previously-live stone, or an old-schema rebuild — before
generating a packet. It compares only the PM-controlled structured fields
(`chakra_primary`, `chakra_secondary`, `element`, `zodiac`, `material_type`,
`energetic_role`, `energetic_role_icon`, `color_energy`, `nav_prev_slug`,
`nav_prev_name`, `nav_next_slug`, `nav_next_name`) against the structured-values
export and reports drift. `energetic_role_icon` is derived from `energetic_role`
via `icon-map.json`, not read as an independent Production Master column.
Never reads or writes public-copy fields.

Dry-run by default. Apply only with `--apply`, and only when the drift is
limited to the PM-controlled fields above — this tool never touches Hero
copy, Overview, Collector Context, or any other public-copy field. A stone
with no existing `enc_stone_content` row is skipped entirely (a first-time
import has nothing to reconcile against yet; use the normal Gate 4
packet/import path instead).

### 1. Generate a packet (2B)

```
node pipeline/generate-packet.js --md "C:\Users\chris\Documents\Still Point Lapidary\Encyclopedia\Canonical MDs\<slug>.md"
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
publishes in the same controlled pass (see "Gate 4 execution rules" above).
Pass `--hold` only when Christie or Dustin has explicitly requested an
unpublished preview/import hold for that stone; that sets `published: false`.

`enc_stone_content.image_alt` (Christie-approved 2026-07-05, see
ENCYCLOPEDIA-CONTENT-FIELDS.md §14): the canonical MD does not carry alt text.
An existing approved value on the current row is preserved; otherwise a
generic fallback ("{Stone Name} specimen for the Still Point Lapidary
encyclopedia.") is used and a `WARN` is printed. This is never a blocker —
real specimen-specific alt text is written during photo QA once the final
photo is uploaded, not during drafting or import.

**Output location:** if `--out` is omitted, the packet is written to
`pipeline/output/<slug>.packet.json` — a gitignored working directory, never
next to the source MD and never at the repo root. The packet is transport
only — never hand-edit it, and never rely on it surviving between runs.
Regenerate fresh every time. Pass an explicit `--out` only when you have a
specific reason to; avoid a bare relative filename, which would land in
whatever directory the command was run from.

### 2. Validate a packet (2C)

```
node pipeline/validate-packet.js --packet pipeline/output/rose-quartz.packet.json
```

Validates field counts, required fields, controlled vocabularies, icon slugs, and roster slug resolution.
Run across the full batch before any import.

### 2a. Gate 4 precheck

```
node pipeline/gate4-precheck.js --md "C:\Users\chris\Documents\Still Point Lapidary\Encyclopedia\Canonical MDs\<slug>.md"
```

Read-only. Makes no changes to the Production Master, Supabase, or any file.
Reports every known Gate-4 blocker class for one stone in a single pass —
MD parse/schema, `production_data_version` match, Production Master identity
and required structured/navigation fields, stale Blocker text, related-stone
slug resolution, and icon-class resolution across `icon-map.json`,
`enc-icons.css`, and Supabase Storage — so blockers surface together instead
of one failed pipeline run at a time. It reads directly from the MD, the
Production Master, and Supabase; it does not need a generated packet, so it
can also be run earlier (right after MD approval) as an early warning if
that's more convenient — the standard flow above just places it as the last
automated gate before import.

Also reports, informationally, whether the stone will take the insert path
(no existing `enc_stone_content` row) or the update path (row already
exists) — neither is a blocker on its own; only a genuinely inconsistent
roster state (`Full Entry Live` with no content row at all) stops here.

### 3. Import a stone (2D)

```
node pipeline/import-stone.js --packet pipeline/output/rose-quartz.packet.json
```

Imports atomically via the `import_stone_atomic` Postgres function.
**Create-or-update, both atomic:** a first-time `stone_id` (no existing
`enc_stone_content` row) inserts the parent row, exactly as before. A
previously-imported/previously-live `stone_id` (existing row) updates the
parent row in place and deletes-and-replaces every child table from the
packet in the same transaction. Either way, the entire stone commits or the
entire stone rolls back — no partial parent row, no orphaned child rows, no
duplicate parent row can survive a failure. The report line shows which path
ran (`[insert]` or `[update]`).

`published` is written from the packet's `enc_stone_content.published` value (default `true`,
so the default Gate 4 path imports and publishes in this same pass). It is `false` only when
the packet was generated with `--hold` for an explicit Christie/Dustin-requested unpublished
hold — that stone remains unpublished until Gate 7.

**`--all-or-nothing` flag is not implemented in v1.** True cohort-wide rollback requires all
stones to commit in a single transaction scope. This is not achievable with sequential per-stone
RPC calls once earlier stones have committed. Flagged for Christie's review.

`verify-stone.js` (next) is required after every import, insert or update —
a clean import report is not itself proof of correct database state.

### 4. Verify a stone (2E)

```
node pipeline/verify-stone.js --packet pipeline/output/rose-quartz.packet.json
```

Compares live Supabase values against the packet field-by-field: exact text, display order,
slugs, icon classes, nullable fields. Row counts alone are not sufficient.

Only after this passes should Production Master status fields be updated —
never update the Production Master to reflect a Gate 4 result that hasn't
been verified yet.

### 5. Smoke test (2F)

```
node pipeline/smoke-test.js --packet pipeline/output/rose-quartz.packet.json --base-url https://stillpointlapidary.com
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

## Approved Stone → Gate 4 (standard single-stone flow)

This is the standard order for one already-approved stone — see "Gate 4
execution rules" above for the authorization/readiness rules that apply
throughout, and the checklist above for a pasteable short form.

```bash
# 1. Export locked structured values from the canonical Production Master:
npm run pipeline:export-structured-values

# 2. Only if enc_stone_content already exists for this stone (correction,
#    previously-live stone, or old-schema rebuild) — reconcile PM-controlled
#    structured fields before generating a packet:
node pipeline/reconcile-structured-fields.js --stone <slug-or-id>
node pipeline/reconcile-structured-fields.js --stone <slug-or-id> --apply   # only if drift found

# 3. Generate a packet from the approved canonical MD (external path — see
#    "Canonical paths" above; docs/encyclopedia/entries/ is a staging mirror
#    only). Default output goes to pipeline/output/, gitignored:
node pipeline/generate-packet.js --md "C:\Users\chris\Documents\Still Point Lapidary\Encyclopedia\Canonical MDs\<slug>.md"

# 4. Validate the packet:
node pipeline/validate-packet.js --packet pipeline/output/<slug>.packet.json

# 5. Run the Gate 4 precheck — confirms no avoidable blocker before import:
node pipeline/gate4-precheck.js --md "C:\Users\chris\Documents\Still Point Lapidary\Encyclopedia\Canonical MDs\<slug>.md"

# 6. Import atomically — insert path for a first-time stone_id, update path
#    for an existing one, both atomic, both publish in this same pass by
#    default (pass --hold on step 3's generate-packet.js call instead, for
#    an explicit unpublished hold):
node pipeline/import-stone.js --packet pipeline/output/<slug>.packet.json

# 7. Verify database state — required after every import:
node pipeline/verify-stone.js --packet pipeline/output/<slug>.packet.json

# 8. Only after verify-stone PASSes, update Production Master status fields,
#    save, close/reopen, and reread the changed row(s).

# Smoke test once the stone is live (default path: right after step 6/7;
# explicit-hold path: after the Gate 7 publish step):
node pipeline/smoke-test.js --packet pipeline/output/<slug>.packet.json --base-url https://stillpointlapidary.com
```

No step above implies a Netlify deploy, and no step above is a place to stop
and ask for separate publication authorization — see "Gate 4 execution
rules."

---

## File structure

```
pipeline/
  run-gate4-stone.js    One-command runner: wraps the full standard flow below for one stone
  gate0.js              Gate 0: read-only stone/cohort research-readiness preflight
  export-structured-values.js  Gate 4: Production Master → generated structured-values JSON
  reconcile-structured-fields.js  Pre-Gate-4: existing-live PM-controlled field drift check/fix
  generate-packet.js    2B: MD + structured-values export + Supabase → JSON packet
  validate-packet.js    2C: Packet validation
  gate4-precheck.js     Gate 4: read-only import/publication-readiness preflight
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
  output/
    *.packet.json       GENERATED, gitignored — transport only, regenerate every run.

tests/
  fixtures/
    rose-quartz.md      Canonical clean-path test fixture (baseline)

docs/encyclopedia/
  MD-SCHEMA-REFERENCE.md    Formal schema definition

supabase/migrations/
  import_stone_atomic.sql   Postgres function for atomic create-or-update import
```
