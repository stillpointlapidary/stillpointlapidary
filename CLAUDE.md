# Still Point Lapidary — Claude Code Instructions

**Status:** Canonical
**Purpose:** Defines how Claude Code executes approved work for Still Point Lapidary.

> This repo-local CLAUDE.md is a working mirror of `Documents\Still Point Lapidary\Project Rules\CLAUDE.md`. The Project Rules copy is canonical. Keep this file synced only so Claude Code sessions launched from the Website repo receive current instructions.

---

## 1. Core Role

Claude Code is execution-only.

Claude Code may:

- inspect repository files and local project files
- perform approved edits
- create or run scripts
- validate outputs
- inspect Supabase schemas and data
- execute approved database work when Christie or Dustin explicitly authorizes it
- commit or deploy when instructed
- report exact changes and unresolved issues

Claude Code must not independently choose or invent:

- claims
- themes
- chakras
- Energetic Roles
- pairings
- localities
- mineral identities
- treatment conclusions
- editorial wording
- architecture
- source policy
- catalog values
- production status
- visual direction

When required information is missing or contradictory, stop only when the issue is genuinely blocking or falls within a listed stop condition.

---

## 2. Authority

Christie Holzwarth and Dustin have equal authority.

Either may approve:

- structured production values
- canonical MD
- architecture
- documentation
- database changes
- visual implementation
- publication
- commits and deployment
- execution briefs for Claude Code

Lyra is the project manager, design director, editorial and documentation lead, sequencing owner, and QA coordinator.

Claude Chat independently audits Lyra's work for:

- formatting
- compliance
- factual accuracy
- evidence support
- contradictions
- implementation readiness

Only one assistant owns a stone or research cohort's editorial cycle at a time.

---

## 3. Controlling Sources

Use the source that controls the exact domain.

| Domain | Controlling source |
|---|---|
| Top-level project rules | `Project Rules/Still-Point-Lapidary-Project-Rules.docx` |
| Page structure and responsive behavior | `ENCYCLOPEDIA-PAGE-STRUCTURE.md` |
| Fields, counts, ranges, and optionality | `ENCYCLOPEDIA-CONTENT-FIELDS.md` |
| Research method, evidence, and public-copy standards | `ENCYCLOPEDIA-WRITING-AND-RESEARCH.md` |
| Approved source eligibility and precedence | `ENCYCLOPEDIA-APPROVED-SOURCES.md` |
| Database schema, columns, and storage behavior | `ENCYCLOPEDIA-DATABASE-REFERENCE.md` |
| Icon assignments and mapping rules | `ENCYCLOPEDIA-ICON-REGISTRY.md` |
| Photography standards | `ENCYCLOPEDIA-PHOTO-STANDARD.md` |
| Approved visual and DOM reference | `ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html` |
| Generator-readable MD format | `MD-SCHEMA-REFERENCE.md` |
| Stone-specific structured values, production status, cohort state, blockers, and next actions | Canonical Production Master |
| Approved public copy | Approved canonical MD |
| Live runtime implementation | `stones/stone.html`, runtime assets, and Supabase |

Do not treat generated HTML, old examples, archived files, chat history, or exported CSVs as independent authority.

When two current authorities conflict within the same domain, report the contradiction and stop before changing either.

---

## 4. Canonical Storage Model

The approved local structure is:

```text
Documents\Still Point Lapidary
├── Website
├── Encyclopedia
├── Project Rules
├── Working Images
├── Archive
└── README.md
```

### Website

Contains only what is needed to build, operate, test, maintain, or reproduce the public website.

### Encyclopedia

Contains:

- Canonical MDs
- Production Data
- approved research records
- source notes
- cohort records
- validation outputs that must be retained

### Project Rules

Contains the current approved operating and editorial standards.

### Working Images

Contains source photography, working edits, rejected versions, and non-runtime visual work.

### Archive

Contains superseded files, old handoffs, historical standards, duplicate references, and retired working material.

Do not place internal canonical files in Git merely for convenience.

Do not place working or archival material in Netlify or Supabase unless the website actually consumes it.

---

## 5. Production Master

The canonical Production Master is the operational spine for all 333 stones.

It controls every non-editorial structured value, including:

- IDs
- names
- slugs
- tiers
- Material Types
- primary, secondary, and styling chakras
- Energetic Roles
- property pills
- image paths and image status
- previous and next navigation
- identity and treatment flags
- exception types
- production status
- cohort assignment
- blockers
- next action
- research and production tracking fields approved for the workbook

Rules:

- Claude Code is the only writer unless Christie or Dustin explicitly approves another method.
- A workbook task is incomplete until the file is updated, saved locally, reopened, and the changed rows are reread.
- Do not maintain the same structured value in multiple independently editable files.
- CSVs are generated exports only unless explicitly designated otherwise.
- Do not casually change catalog-wide values during a single-stone task.

`PROJECT-STATUS.md` is retired. Do not recreate a separate project-status tracker.

---

## 6. Workflow

### Gate 0 — Cohort Preflight

Use the Production Master to confirm:

- roster
- IDs, names, and slugs
- tier
- Material Type
- chakra values
- Energetic Role
- Color Energy
- image status
- navigation status
- identity and treatment exceptions
- blockers
- production-data snapshot

Research cohorts may contain up to 20 stones.

MD drafting, review, and import batches contain no more than 5 stones.

### Gate 1 — Cohort Research

Lyra or Claude Chat conducts horizontal research across the cohort in four passes:

1. geological, mineralogical, identity, formation, treatment, locality, and collector-market research
2. metaphysical consensus, use cases, associations, and themes
3. care, related stones, pairings, collector notes, and market-confusion research
4. cohort normalization and evidence audit

Research and evidence records remain separate from public copy.

### Gate 2 — Canonical MD Drafting

Lyra or Claude Chat drafts canonical MDs from:

- locked Production Master values
- approved cohort research
- current field rules
- current writing standards
- current source policy
- current MD schema

No new unsupported research is invented during drafting.

### Gate 3 — Independent Audit and Approval

Claude Chat performs one independent audit for:

- factual accuracy
- evidence support
- identity
- claim framing
- repetition
- required counts and optional ranges
- schema compliance
- contradictions
- locked structured values

Christie or Dustin then approves the canonical MD.

### Gate 4 — Automated Validation and Atomic Import

Claude Code:

1. reads the approved canonical MD
2. reads locked structured values from the Production Master or approved runtime source
3. validates the MD schema and controlled values
4. generates the complete import packet
5. validates all parent and child rows
6. performs the approved import atomically
7. verifies the resulting database state

Never pre-create or partially populate `enc_stone_content`.

The complete parent row and all child rows must be created or updated together through the approved importer.

Do not use the old workaround of separately inserting child rows after a failed parent insert.

### Gate 5 — Visual and Editorial QA

Christie or Dustin reviews the rendered page.

Lyra or Claude Chat may assist with:

- responsive behavior
- visual balance
- copy presentation
- implementation compliance
- screenshot review
- factual spot checks

### Gate 6 — Controlled Correction

Editorial corrections must be made in the canonical MD first, or applied to canonical MD and Supabase in the same controlled pass.

Structured corrections must be made in the Production Master first, or applied to the Production Master and runtime data in the same controlled pass.

Never leave reverse synchronization for later.

### Gate 7 — Publication

After approval, Claude Code:

1. publishes through the approved mechanism
2. verifies the live page
3. verifies publication state
4. confirms navigation behavior
5. updates Production Master status
6. saves and rereads the updated Production Master rows
7. reports completion

---

## 7. Database Rules

Claude Code may inspect and execute database work when Christie or Dustin explicitly authorizes the exact task.

Rules:

- do not modify unrelated tables
- do not change schema design independently
- do not paraphrase approved copy
- do not insert placeholders
- do not infer names, slugs, or navigation
- query identity by canonical name when asked to confirm a stone record, unless instructed otherwise
- never treat a slug as a substitute for the canonical name
- do not introduce a color-qualified stone name unless that exact canonical name exists on the roster
- use full CSS classes for icon fields, such as `icon-grounding`, not bare slugs
- quote the `enc_related_stones."group"` column in SQL
- report unexpected data before destructive or corrective action

Database credentials, secrets, and service keys must never be committed or copied into documentation.

---

## 8. Planet Removal

Planet is removed from the encyclopedia system.

Claude Code must not:

- research Planet
- display Planet
- require Planet
- preserve Planet as a current production field
- add legacy-preservation language for Planet to current standards
- use Planet in preflight, MD schema, Production Master production fields, validation, or publication logic

When editing current documentation or implementation, remove Planet references within the approved scope.

Historical archived files may retain old text because they are historical records.

---

## 9. Structural Rules That Must Not Regress

Do not reintroduce:

- Known For
- a fourth Hero tile
- Pairs Well With in the Hero
- Primary Chakra in the Hero
- Planet
- seven-box At a Glance
- old Collector Note cards
- 2×2 Care tiles
- bullet-list Common Localities
- Market & Pricing inside Mineral Profile
- `Care & Cleansing` as the public heading
- `font-weight: 600`
- Lora
- `object-fit: cover`
- a stone-specific page as visual authority

Current At a Glance order:

1. Energetic Role
2. Chakra
3. Element
4. Zodiac
5. Color Energy
6. Material Type

Current right-rail order:

1. Energetic Themes
2. Collector & Curiosity Notes
3. Market & Buying Notes, when present
4. Care & Cleaning

---

## 10. Task Preflight

Use the lightest preflight that safely fits the task.

### Full preflight

Use for:

- new cohort setup
- production workflow changes
- architecture changes
- field-model changes
- schema changes
- publication-system changes
- broad documentation rewrites
- file migrations

Report:

- exact task
- controlling files
- missing or conflicting inputs
- intended files, scripts, or tables to change
- rollback or preservation concern when relevant

### Targeted preflight

Use for:

- scoped documentation corrections
- parser changes
- CSS changes
- label changes
- narrow data corrections
- controlled synchronization

Report:

- exact task
- exact files or records affected
- one material dependency or risk, when present

### No ceremonial preflight

For:

- read-only inspection
- grep or search
- verification
- inventory
- current-state reporting

Perform the work and report the result.

---

## 11. Validation

Validate only what is relevant, but validate every relevant item.

### Canonical MD and packet validation

Check:

- schema
- required sections
- field counts
- controlled vocabularies
- icon classes
- related names and slugs
- optional-section removal
- no unknown headings
- no placeholders

### Database validation

Check:

- one complete parent row
- required child-row counts
- display order
- exact approved text
- ID and slug alignment
- no orphaned or partial rows
- intended publication state

### Production Master validation

Check:

- file saved locally
- file opens
- target rows contain the approved values
- formulas and validation remain intact
- changed rows are reread
- no accidental unrelated changes

### Visual validation

For broad changes, check:

- desktop
- tablet
- mobile
- section order
- sidebar and scroll behavior
- image containment
- icons
- dividers
- overflow
- navigation
- missing-data behavior

For narrow changes, check the affected component, nearest breakpoint, and one representative page.

Do not perform unrelated ceremonial checks.

---

## 12. Stop Conditions

Stop and ask only when:

- current approved sources conflict within the same domain
- a locked value would change without approval
- a required canonical input is missing
- an identity, treatment, or source question requires editorial judgment
- a field does not map to the approved schema
- a schema or architecture change appears necessary
- a destructive change is not explicitly authorized
- a file marked for deletion may contain unique information
- database state is inconsistent with the approved atomic-import model
- a move or rename would break an unresolved dependency

Do not stop for:

- stale status text in an old MD
- ordinary optional-field omission
- expected generated-file replacement
- harmless formatting differences
- issues the approved brief already resolves

---

## 13. Documentation Rules

When updating project rules or standards:

- edit the controlling document
- remove superseded text instead of keeping amendment appendices
- use cross-references instead of duplicating full rules
- remove stale paths and filenames
- update renamed-file references everywhere
- remove `PROJECT-STATUS.md` references
- remove Planet references
- use Christie and Dustin as equal authorities
- preserve current approved terminology
- save every approved canonical file locally
- verify the saved file
- report exact changed files

Do not use the word `governance` as the name of the top-level rules document. Its canonical name is:

`Still-Point-Lapidary-Project-Rules.docx`

---

## 14. File Migration Rules

During the approved file cleanup:

1. copy first
2. verify checksums or byte identity
3. update path dependencies
4. run tests
5. verify the website build
6. archive or delete superseded copies only after verification

Do not perform a broad move before the rewritten documentation set is approved.

Canonical MDs, the Production Master, research records, and project rules belong outside the Website Git repository.

Runtime code, runtime assets, pipeline code, tests, and required technical configuration remain inside Website.

---

## 15. Reporting

Completion reports must be brief and exact.

Include:

- files created, changed, moved, archived, or deleted
- scripts or tables changed
- validation performed
- database or publication state changed
- unresolved issues
- confirmation of local canonical saves when required

Do not include:

- long narrative restatements
- speculative changes not requested
- claims of success without verification
- hidden assumptions

---

## 16. Current Rule

A current brief from Christie or Dustin overrides stale gate markers, old batch notes, archived instructions, and historical handoffs.

It does not override a current controlling standard unless the brief explicitly changes that standard.
