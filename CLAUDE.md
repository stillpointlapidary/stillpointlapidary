# Still Point Lapidary — Encyclopedia Production Instructions

## 1. Purpose

This file tells Claude Code how to work safely and efficiently on the Still Point Lapidary encyclopedia.

Claude Code is execution-only.

It may:

- inspect repository files
- perform approved edits
- create or run scripts
- inspect Supabase schemas and data, prepare SQL, and execute SQL when Christie explicitly authorizes
- validate outputs
- commit or deploy when instructed
- report exact changes

It must not independently choose or invent:

- claims
- themes
- chakras
- Energetic Roles
- pairings
- localities
- mineral identities
- wording
- architecture
- source policy
- production status

When required information is missing or contradictory, stop and ask Christie or Dustin.

---

## 2. Authority by Purpose

Use the controlling source for the exact task.

| Question | Controlling source |
|---|---|
| Who may approve or change direction? | Christie or Dustin |
| What sections exist and where? | `ENCYCLOPEDIA-PAGE-STRUCTURE.md` |
| What fields, counts, and limits are required? | `ENCYCLOPEDIA-CONTENT-FIELDS.md` |
| How should research and public copy be written? | `ENCYCLOPEDIA-WRITING-AND-RESEARCH.md` |
| Which sources are allowed? | `ENCYCLOPEDIA-APPROVED-SOURCES.md` |
| What tables and columns exist? | `ENCYCLOPEDIA-DATABASE-REFERENCE.md` |
| What should the approved page look like? | `ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html` |
| What values belong to a specific stone? | locked production data |
| What public copy is approved? | approved canonical MD |
| What renders live? | `stones/stone.html` and Supabase |

Do not assume one document controls another document’s domain.

When two authorities conflict within the same domain, stop and ask.

---

## 3. Current Production Model

The encyclopedia uses:

- one shared dynamic template: `stones/stone.html`
- Supabase `enc_` tables for operational content
- canonical MD as the approved source for public copy
- locked production data for stone-specific structured values
- one approved HTML visual standard for visual and DOM reference

Do not treat individual published stone pages as reusable standards.

Do not use Citrine or any other stone-specific page as the canonical implementation reference.

---

## 4. Workflow Gates

### Gate 0 — Catalog and Cohort Preflight

Confirm or flag:

- stone ID
- canonical name
- slug
- collection tier
- Material Type
- primary chakra
- secondary chakra, if any
- styling chakra
- Energetic Role
- Color Energy
- image status
- navigation
- exception status
- production-data version

Do not invent missing values.

Planet is not required and must not be researched for new production.

### Gate 1 — Cohort Research

Research is performed by Lyra or Claude Chat.

Claude Code does not conduct editorial research unless explicitly assigned a narrow technical verification task.

### Gate 2 — Canonical MD Drafting

Lyra or Claude Chat drafts canonical MD.

Claude Code does not independently draft public copy.

### Gate 3 — MD Approval

Christie or Dustin explicitly approves the canonical MD.

No Supabase SQL preparation begins before approval.

### Gate 4 — Supabase SQL Preparation and Verification

Dustin or Christie normally runs SQL. Claude Code prepares verified SQL statements and reports them. Claude Code may execute SQL when Christie explicitly authorizes the exact task or migration step.

Claude Code:

1. maps every approved MD field to its exact table and column
2. prepares SQL containing the approved content exactly as written
3. sets `published = false` in the prepared SQL
4. prepares verification queries for every affected table
5. reports expected row counts and fields
6. flags any field that does not map cleanly

After Dustin or Christie runs the SQL, Claude Code may review the returned results or screenshots and compare them with the expected values.

### Gate 5 — Visual and Editorial QA

Christie or Dustin reviews the dynamic page.

Lyra or Claude Chat may assist with editorial or implementation review.

### Gate 6 — Controlled Correction

Any approved correction must update:

- canonical MD
- the prepared Supabase SQL, followed by manual execution by Dustin or Christie

Both must match at the end of the same controlled pass.

Do not update one and defer the other.

### Gate 7 — Publication

Claude Code:

1. confirms approval to publish
2. prepares the SQL that sets `published = true`
3. provides the SQL to Dustin or Christie for manual execution
4. verifies the live page after execution
5. updates production status where instructed
6. reports completion

Claude Code does not execute the publication query.

Do not update `enc-nav.js` for dynamic page navigation.

---

## 5. Task Preflight

Use the lightest preflight that safely fits the task.

### Full Preflight

Required for:

- new stone production
- new cohort setup
- architecture changes
- field-model changes
- database changes
- publication
- broad documentation rewrites

Report only:

- exact task
- controlling files
- missing or conflicting inputs
- intended files or tables to change

### Targeted Preflight

Use for:

- CSS changes
- label updates
- parser updates
- scoped documentation corrections
- controlled copy synchronization

Report only:

- exact task
- exact files affected
- one relevant risk or dependency check, if any

### No Ceremonial Preflight

For:

- read-only inspection
- grep or search
- verification query
- current-state report

Perform the check and report the result.

Do not recite every governing document when only one or two are relevant.

---

## 6. Supabase Rules

Claude Code may inspect Supabase schemas and data, run read-only queries, prepare migrations, validate results, and execute SQL when Christie explicitly authorizes the task or exact change. Claude Code must not independently invent schema design, editorial values, catalog values, destructive data changes, or business rules. Unexpected findings and any material deviation from an approved plan must be reported to Christie before corrective or destructive action is taken.

All encyclopedia content tables use the `enc_` prefix.

Primary tables:

- `enc_stone_content`
- `enc_mineral_facts`
- `enc_localities`
- `enc_reach_for`
- `enc_themes`
- `enc_collector_notes`
- `enc_care`
- `enc_related_stones`

All child tables reference `stones.id` through `stone_id`.

Rules:

- do not modify unrelated tables
- do not modify `stones` without explicit approval
- do not paraphrase approved copy
- do not trim approved copy
- do not insert placeholders
- do not infer navigation
- do not add Planet as a completion requirement
- do not change Material Type without approved source data

The `group` column in `enc_related_stones` must always be quoted in SQL:

```sql
"group"
```

---

## 7. Canonical MD to Supabase SQL Mapping

The approved canonical MD is the source for public copy.

Before entry:

- confirm the correct approved MD
- confirm stone ID and slug
- map each field
- identify unmapped or contradictory fields

During SQL preparation:

- preserve exact approved wording
- preserve punctuation
- use `published = false`
- omit optional p4 and p5 fields when absent

After Dustin or Christie runs the SQL:

- review the results of verification queries for every affected table
- verify row counts
- verify display order
- verify exact text
- verify stone ID and slug
- report exact tables changed

Do not claim PASS unless the relevant checks were completed.

---

## 8. Structural Rules That Must Not Regress

Do not reintroduce:

- Planet in At a Glance
- Known For
- a fourth Hero tile
- Pairs Well With in the Hero
- Primary Chakra in the Hero
- seven-box At a Glance
- old Collector Note cards
- 2×2 Care tiles
- bullet-list Common Localities
- Market & Pricing inside Mineral Profile
- `Care & Cleansing` as the public heading
- `font-weight: 600`
- Lora
- `object-fit: cover`
- Citrine as visual authority

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
3. Market & Buying Notes
4. Care & Cleaning

---

## 9. Image Rules

Canonical image behavior:

- square frame
- `object-fit: contain`
- `object-position: center`
- full specimen visible
- no default edge cropping
- no inner image border
- no padding inside the frame
- neutral background treatment

Do not switch to `cover` without explicit approval.

---

## 10. Icon Rules

Use the centralized mapping layer:

- `stones/enc-icons.css`

Use:

- external SVG assets
- CSS masking
- `currentColor`

Do not:

- inline repeated SVG markup
- hard-code full icon URLs into individual cards
- invent icon slugs
- silently substitute missing icons

Missing mappings must fail visibly during validation.

---

## 11. Validation Rules

Use only checks relevant to the task.

### For a narrow CSS or label change

Verify:

- affected selector or section
- nearest relevant breakpoint
- one representative rendered page
- no unintended shared-token regression

### For a full page or template change

Verify:

- desktop
- tablet
- mobile
- sidebar order
- responsive order
- scroll-spy order
- image containment
- divider visibility
- no horizontal overflow
- no placeholders
- navigation behavior

### For Supabase SQL preparation and manual entry

Verify:

- SQL prepared for one primary content row
- 8 mineral facts
- 5 reach-for rows
- valid theme counts
- 3 or 4 collector notes
- 4 care rows
- 4 related rows
- locality rows match approved content
- Material Type populated
- navigation populated
- prepared published state intentional
- MD and Supabase match

Do not run unrelated checks merely to complete a checklist.

---

## 12. Documentation Rules

When updating standards:

- update the controlling document
- do not duplicate the full rule in multiple files
- use references instead of restating unrelated rules
- keep current rules in the document body
- do not maintain amendment archives inside living standards
- use version control for history
- remove stale file references
- update renamed-file references everywhere

The approved standards set is:

- `CLAUDE.md`
- `ENCYCLOPEDIA-PAGE-STRUCTURE.md`
- `ENCYCLOPEDIA-CONTENT-FIELDS.md`
- `ENCYCLOPEDIA-WRITING-AND-RESEARCH.md`
- `ENCYCLOPEDIA-APPROVED-SOURCES.md`
- `ENCYCLOPEDIA-DATABASE-REFERENCE.md`
- `ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html`

---

## 13. Roles

### Christie or Dustin

May approve:

- canonical MD
- structural changes
- field changes
- source-policy changes
- database changes
- visual implementation
- publication

### Lyra

May handle:

- strategy
- research synthesis
- canonical MD drafting
- editorial review
- documentation
- QA
- implementation instructions

### Claude Chat

May handle:

- strategy
- research synthesis
- canonical MD drafting
- editorial review
- documentation review
- implementation briefs

Only one assistant should own a stone or cohort editorial cycle at a time.

### Claude Code

Execution-only.

Claude Code must not independently choose or invent editorial content or architecture.

---

## 14. Reporting

Completion reports should be brief and exact.

Include:

- files changed
- tables changed
- fields or selectors changed
- validation performed
- unresolved issues
- whether publication state changed

Do not include:

- long narrative summaries
- repeated restatement of instructions
- speculative recommendations not requested
- claims of success without evidence

---

## 15. Stop Conditions

Stop and ask before proceeding when:

- approved files conflict
- a required field is missing
- a locked value would change
- a schema change appears necessary
- a migration affects unrelated data
- a source or identity question requires editorial judgment
- a content field does not map cleanly
- a visual change would alter approved architecture
- a file marked for deletion may contain unique data

Do not improvise through a stop condition.
