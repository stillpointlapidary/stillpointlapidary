# Still Point Lapidary — Encyclopedia MD Schema Reference

**Status:** Canonical  
**Purpose:** Defines the exact generator-readable Markdown format for canonical encyclopedia entries.

---

## 1. Scope

This document controls:

- front matter field names and types
- top-level section headings and order
- required subheadings and block patterns
- optional-section behavior
- count validation
- icon and slug formatting
- validation failures
- exception-stone schema behavior

This document does not control:

- editorial voice
- research quality
- field meaning
- database design
- stone-specific structured values
- page layout
- publication approval

Use:

- `ENCYCLOPEDIA-CONTENT-FIELDS.md` for counts, ranges, and optionality
- `ENCYCLOPEDIA-WRITING-AND-RESEARCH.md` for prose standards
- `ENCYCLOPEDIA-DATABASE-REFERENCE.md` for storage mapping
- the Production Master for locked structured values
- the approved parser and validator for implementation behavior

When this schema conflicts with another current governing document, stop and ask Christie or Dustin.

---

## 2. Canonical File Location

Canonical MD files live outside the Website repository under:

```text
Documents\Still Point Lapidary\Encyclopedia\Canonical MDs\{stone-slug}.md
```

This is the canonical long-term home for all approved MD.

Automated test fixtures remain inside the Website repository under:

```text
tests/fixtures/{stone-slug}.md
```

Pipeline code must read the canonical MD directory from one approved configuration source.

Do not hard-code the same canonical path independently in multiple scripts.

### Transitional Pipeline Rule

If the Website pipeline currently requires MD files inside the repository (for example `docs/encyclopedia/entries/`) because it has not yet been updated to read the external canonical path, those repo-local files are **working mirrors or staging inputs only**. They are not an independent canonical source and do not carry authority of their own.

Any conflict between a repo-local mirror and the canonical file above is resolved in favor of the canonical file. Update the pipeline to read the external path as soon as this is confirmed safe; do not extend the transitional exception indefinitely.

---

## 3. File Boundaries

Generator-readable MD contains public copy only.

Do not place these inside the canonical MD:

- research notes
- source tables
- evidence records
- compliance reports
- gate markers
- approval notes
- audit notes
- amendment history
- session handoffs
- current project status

The parser must reject unrecognized top-level headings rather than silently ignoring them.

---

## 4. Front Matter

Every canonical MD begins with YAML front matter.

```yaml
---
stone_id: C-XXXX
stone_name: Rose Quartz
stone_slug: rose-quartz
production_data_version: "1.0"
---
```

| Field | Type | Required | Rule |
|---|---|---|---|
| `stone_id` | string | Yes | Must match the canonical roster. |
| `stone_name` | string | Yes | Must match the canonical display name exactly. |
| `stone_slug` | string | Yes | Must match the canonical slug exactly. |
| `production_data_version` | string | Yes | Identifies the Production Master snapshot used. |

Do not add structured production fields to front matter.

The following come from the Production Master or approved runtime source:

- collection tier
- Material Type
- chakra values
- Styling Chakra
- Energetic Role
- Color Energy
- image path
- navigation
- exception flags
- production status

Property Pills are not in this list. They are authored directly in the canonical MD (`# Hero > ## Property Pills`) and are not a Production Master field.

Planet does not appear in front matter or anywhere else in the current MD schema.

---

## 5. Top-Level Sections

Top-level sections use `#` headings in this exact order:

1. `# Hero`
2. `# Overview`
3. `# Why People Reach For It`
4. `# Energetic Themes`
5. `# Mineral Profile`
6. `# Collector & Curiosity Notes`
7. `# Market & Buying Notes` — optional
8. `# Care & Cleaning`
9. `# Related Stones`

Rules:

- required sections must be present
- section order is fixed
- renamed sections fail validation
- empty required sections fail validation
- optional sections must be omitted entirely when unused
- empty optional sections fail validation
- unknown top-level sections fail validation

---

## 6. Hero

```markdown
# Hero

## Signature Line
{one sentence}

## Property Pills
- {pill_1}
- {pill_2}
- {pill_3}

## Best For
{text}

## Use When
{text}

## Affirmation
{text}
```

Rules:

- all five subheadings are required
- subheading order is fixed
- exactly 3 property pills
- missing or renamed subheadings fail validation
- empty values fail validation

The validator also checks compact-field limits from `ENCYCLOPEDIA-CONTENT-FIELDS.md`.

---

## 7. Overview

```markdown
# Overview

## Paragraph 1
{Metaphysical identity paragraph}

## Paragraph 2
{Mineral and physical identity paragraph}
```

Rules:

- both subheadings are required
- order is fixed
- both paragraphs must be non-empty
- `Paragraph 1` maps to `overview_p1`
- `Paragraph 2` maps to `overview_p2`

---

## 8. Why People Reach For It

```markdown
# Why People Reach For It

## {Label}
{Description}

## {Label}
{Description}

## {Label}
{Description}
```

A fourth and fifth block may be added.

Rules:

- Block count is controlled by `ENCYCLOPEDIA-CONTENT-FIELDS.md` §6. The Markdown structure uses one `## {Label}` block per approved row, and validation enforces the approved minimum and maximum from the content-field rule.
- each block requires a non-empty label and description
- blocks map in order to `enc_reach_for`
- duplicate labels should fail validation
- an empty block fails validation

Do not add weak filler merely to reach the maximum.

---

## 9. Energetic Themes

```markdown
# Energetic Themes

## Primary

### {Theme Title}
**Icon:** `icon-{slug}`

{Description}

## Secondary

### {Theme Title}
**Icon:** `icon-{slug}`

{Description}

## Occasional Associations

- {Label}
- {Label}
```

Rules:

- `## Primary` is required
- `## Secondary` is optional
- `## Occasional Associations` is optional
- Primary contains 1–2 `###` blocks
- Secondary contains 1–2 `###` blocks when present
- Occasional Associations contains 1–2 bullets when present
- each Primary and Secondary block requires one icon line
- icon values must be full CSS classes beginning with `icon-`
- descriptions are required for Primary and Secondary
- Occasional Associations have no descriptions or icons
- empty optional groups fail validation
- renamed groups fail validation
- group order is fixed

---

## 10. Mineral Profile

```markdown
# Mineral Profile

## Mineral Facts

| Label | Value |
|---|---|
| {label} | {value} |
| {label} | {value} |
| {label} | {value} |
| {label} | {value} |
| {label} | {value} |
| {label} | {value} |
| {label} | {value} |
| {label} | {value} |

## Common Localities

- {locality}
- {locality}

## Formation

{paragraph}

## Quality Indicators

{paragraph}

## Identification

{paragraph}

## Locality Variations

{paragraph}

## Physical Handling

{paragraph}
```

Rules:

- `## Mineral Facts` is required
- the table must use exact headers `Label` and `Value`
- the table must contain exactly 8 data rows
- `## Common Localities` is required
- Common Localities contains 1–8 bullets
- `## Formation` is required
- `## Quality Indicators` is required
- `## Identification` is required
- `## Locality Variations` is optional
- `## Physical Handling` is optional
- required subheading order is fixed
- optional subheadings appear only after Identification and in the order shown
- empty optional subheadings fail validation

Exception stones use the same outer structure.

Only the fact labels adapt to the verified material identity.

---

## 11. Collector & Curiosity Notes

```markdown
# Collector & Curiosity Notes

## {Title}
**Icon:** `icon-{slug}`

{Body}

## {Title}
**Icon:** `icon-{slug}`

{Body}

## {Title}
**Icon:** `icon-{slug}`

{Body}
```

A fourth note may be added.

Rules:

- 3 or 4 note blocks
- each note requires a non-empty title
- each note requires an icon line
- icon values must be full CSS classes beginning with `icon-`
- each body must be non-empty
- duplicate titles should fail validation

Research records may preserve 4–5 candidates, but only 3–4 appear in canonical MD.

---

## 12. Market & Buying Notes

```markdown
# Market & Buying Notes

{Single paragraph}
```

Rules:

- optional section
- omit the heading entirely when unused
- exactly 1 paragraph when present
- empty section fails validation
- additional subheadings are not allowed

---

## 13. Care & Cleaning

```markdown
# Care & Cleaning

## Cleaning
{one sentence}

## Water
{one sentence}

## Light & Heat
{one sentence}

## Storage
{one sentence}
```

Rules:

- all four subheadings are required
- order is fixed
- each body must be non-empty
- renamed or reordered subheadings fail validation

---

## 14. Related Stones

```markdown
# Related Stones

## Similar Energy

### {Stone Name}
**Slug:** `{slug}`

{Reason}

### {Stone Name}
**Slug:** `{slug}`

{Reason}

## Pairs Well With

### {Stone Name}
**Slug:** `{slug}`

{Reason}

### {Stone Name}
**Slug:** `{slug}`

{Reason}
```

Rules:

- both groups are required
- each group contains exactly 2 stone blocks
- each block requires:
  - canonical stone name
  - slug line
  - non-empty reason
- all 4 names and slugs must resolve against the canonical roster
- all 4 slugs must be unique
- the rostered canonical name must match the slug
- color-qualified or market-qualified names fail when not present on the roster
- group order is fixed

---

## 15. Validation Failure vs. Valid Omission

| Situation | Result |
|---|---|
| Required section missing | Validation failure |
| Required section renamed | Validation failure |
| Required section empty | Validation failure |
| Required subheading missing | Validation failure |
| Required block count outside range | Validation failure |
| Optional section omitted | Valid omission |
| Optional group omitted | Valid omission |
| Optional section present but empty | Validation failure |
| Optional section renamed | Validation failure |
| Unknown top-level heading | Validation failure |
| Icon line missing | Validation failure |
| Icon value missing `icon-` prefix | Validation failure |
| Related slug unresolved | Generation halt |
| Related name and slug mismatch | Generation halt |
| Front matter conflicts with roster | Generation halt |
| Structured value conflicts with Production Master | Generation halt |

The parser must not silently skip unrecognized content.

---

## 16. Named Error Format

When generation halts, report:

```text
[Stone Name]
[Field or section]: [error type]
MD value: [value]
Canonical value: [value, when applicable]
Source: [controlling source]
Generation stopped.
```

Errors must identify the affected stone and field.

Do not silently choose one source over another.

---

## 17. Exception Stones

Exception stones use the same canonical MD structure.

The schema does not create separate outer formats for:

- rocks
- mineraloids
- mineral aggregates
- organics
- fossils
- composites
- man-made materials
- treated materials
- trade names
- locality varieties

Adapt:

- Mineral Fact labels
- identity wording
- treatment wording
- Identification
- Market & Buying Notes

Do not adapt:

- top-level section names
- section order
- required Hero structure
- Care categories
- Related Stones structure
- icon-class syntax

---

## 18. Test Fixtures

The clean-path fixture remains:

```text
tests/fixtures/rose-quartz.md
```

Add fixtures when needed for:

- an exception material
- optional Market omission
- 3-row Why People Reach For It
- omitted Secondary themes
- omitted Occasional Associations
- omitted Locality Variations
- omitted Physical Handling
- 3-note Collector section
- validation-failure cases

Fixtures remain test data, not public-copy authority.

---

## 19. Parser and Validator Requirements

The approved parser and validator must:

- read the configured canonical MD directory
- validate front matter
- validate section order
- validate required and optional blocks
- validate counts and ranges
- validate compact-field limits where implemented
- validate icon classes
- validate related names and slugs
- reject unknown headings
- reject empty required content
- produce named errors
- generate no packet when validation fails

Do not weaken validation to accommodate malformed legacy MD.

Convert legacy MD to the current schema first.

---

## 20. Change Control

Changes to:

- front matter
- section names
- section order
- subheading patterns
- count rules
- optionality
- icon syntax
- slug syntax
- validation-failure behavior
- canonical file location

require:

1. Christie or Dustin approval
2. update to this document (`Project Rules\MD-SCHEMA-REFERENCE.md`)
3. matching update to the Website repo's implementation-facing copy (`docs/encyclopedia/MD-SCHEMA-REFERENCE.md`)
4. parser and validator review
5. fixture updates
6. targeted tests
7. review of active canonical MDs

The two `MD-SCHEMA-REFERENCE.md` copies must never disagree. This document is canonical; the repo copy is implementation-facing documentation and must not contradict it.

This document contains only the current schema.

Use version history and Archive for prior formats.
