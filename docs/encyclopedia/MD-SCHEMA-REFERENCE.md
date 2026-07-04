# Still Point Lapidary — Encyclopedia MD Schema Reference

**Purpose:** Defines the exact file format that the Cohort 4 packet generator reads. Every canonical MD file the generator processes must conform to this schema. Deviations that do not match a recognized optional pattern are validation failures, not silent skips.

> This file is implementation-facing documentation for the Website pipeline only. The canonical authority is `Documents\Still Point Lapidary\Project Rules\MD-SCHEMA-REFERENCE.md`. This file must not contradict the Project Rules copy. Where the two ever disagree, the Project Rules copy controls and this file is out of date.

---

## 1. Authority and Scope

This document controls:

- front matter field names and types
- top-level section headings and their order
- required internal subheadings and patterns within each section
- optionality rules for optional sections and blocks
- validation failure definitions
- exception stone rules

This document does **not** control:

- editorial voice or prose content — see `ENCYCLOPEDIA-WRITING-AND-RESEARCH.md`
- field counts and optionality beyond what the parser must enforce — see `ENCYCLOPEDIA-CONTENT-FIELDS.md`
- database columns — see `ENCYCLOPEDIA-DATABASE-REFERENCE.md`
- what structured values the generator reads from Supabase — see the generator implementation

When this schema and a governing editorial document conflict, stop and ask Christie. Do not resolve silently.

---

## 2. File Location

The canonical long-term home for approved MD is:

```
Documents\Still Point Lapidary\Encyclopedia\Canonical MDs\{stone-slug}.md
```

**Transitional pipeline rule:** until the packet generator is updated (or confirmed) to read that external path, the pipeline may temporarily read MD files staged inside the repository at:

```
docs/encyclopedia/entries/{stone-slug}.md
```

Files at this repo-local path are working mirrors or staging inputs for the pipeline only. They are not an independent canonical source, and any conflict with the external canonical file resolves in favor of the external file. Do not treat this transitional path as permanent.

Automated test fixtures must live at:

```
tests/fixtures/{stone-slug}.md
```

Do not place research notes, compliance reports, or approval markers in the generator-readable file. Those belong in separate research documents. The generator reads only the sections defined in this schema and treats any unrecognized heading as a validation failure.

---

## 3. Front Matter

Every MD file begins with a YAML front matter block.

```yaml
---
stone_id: C-XXXX
stone_name: Rose Quartz
stone_slug: rose-quartz
production_data_version: "1.0"
---
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `stone_id` | string | Yes | Stable ID from the `stones` table, e.g. `C-0108`. Must match the live `stones` table. |
| `stone_name` | string | Yes | Canonical display name. Must match `stones.name` exactly. |
| `stone_slug` | string | Yes | Canonical URL slug. Must match `stones.slug` exactly. |
| `production_data_version` | string | Yes | Version tag for the production data snapshot this MD was generated against, e.g. `"1.0"`. |

Do not add any other fields to front matter. Chakras, energetic role, navigation, icons, swatches, tier, zodiac, element, color energy, and material type are not front matter fields — they come from canonical structured sources (Supabase `stones` table and `enc_stone_content`).

Planet does not appear in front matter or anywhere else in the current MD schema.

---

## 4. Top-Level Sections

Top-level sections use `#` headings. They must appear in this exact order:

1. `# Hero`
2. `# Overview`
3. `# Why People Reach For It`
4. `# Energetic Themes`
5. `# Mineral Profile`
6. `# Collector & Curiosity Notes`
7. `# Market & Buying Notes` — optional; omit the heading entirely when absent
8. `# Care & Cleaning`
9. `# Related Stones`

The parser validates section order. A missing required section is a validation failure. A renamed section is a validation failure. An empty required section is a validation failure. An omitted optional section (`# Market & Buying Notes`) is a valid skip.

---

## 5. Hero

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

- Exactly three property pills. A list of two or four is a validation failure.
- All five subheadings are required. A missing or renamed subheading is a validation failure.
- Subheadings must appear in the order above.

---

## 6. Overview

```markdown
# Overview

## Paragraph 1
{Metaphysical identity paragraph. Opens with the stone's name and defining role.}

## Paragraph 2
{Mineral and physical identity paragraph. Opens with a descriptive noun phrase, not the stone name.}
```

Rules:

- Both paragraphs are required.
- `## Paragraph 1` maps to `enc_stone_content.overview_p1`.
- `## Paragraph 2` maps to `enc_stone_content.overview_p2`.
- A missing or renamed subheading is a validation failure.

---

## 7. Why People Reach For It

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

- 3 to 5 `## ` blocks. Fewer than 3 or more than 5 is a validation failure.
- Each block has a label (the `## ` heading text) and a description (the paragraph body).
- Labels and descriptions map in order to `enc_reach_for` rows 1–5.
- Duplicate labels fail validation.
- An empty block fails validation.
- Do not add weak filler merely to reach 5.

---

## 8. Energetic Themes

```markdown
# Energetic Themes

## Primary

### {Theme Title}
**Icon:** `icon-{slug}`

{Description}

### {Theme Title}
**Icon:** `icon-{slug}`

{Description}

## Secondary

### {Theme Title}
**Icon:** `icon-{slug}`

{Description}

### {Theme Title}
**Icon:** `icon-{slug}`

{Description}

## Occasional Associations

- {Label}
- {Label}
```

Rules:

- `## Primary` is required. `## Secondary` and `## Occasional Associations` are optional.
- `## Primary` must contain 1 or 2 `### ` theme blocks. Zero or three or more is a validation failure.
- `## Secondary` must contain 1 or 2 `### ` theme blocks when present.
- `## Occasional Associations` contains a bullet list of label-only items when present.
- Each `### ` block requires an `**Icon:** \`icon-{slug}\`` line immediately after the heading and before the description paragraph.
- Missing icon line is a validation failure.
- Icon slugs must begin with `icon-`. A bare slug (e.g. `heart-healing`) is a validation failure.
- Occasional association items do not have icons.
- An omitted optional tier (`## Secondary`, `## Occasional Associations`) is a valid skip. A renamed or empty tier is a validation failure.

---

## 9. Mineral Profile

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

- `## Mineral Facts` is required. Its table must have exactly 8 data rows (not counting the header row). Fewer or more is a validation failure.
- Table column headers must be `Label` and `Value` exactly.
- `## Common Localities` is required. It contains a bullet list of locality strings. At least one locality is required.
- `## Formation`, `## Quality Indicators`, and `## Identification` are required.
- `## Locality Variations` and `## Physical Handling` are optional. An omitted optional subheading is a valid skip. An empty one is a validation failure.
- Required subheadings must appear in the order above.
- Exception stones use the same outer structure and the same heading names. Only the Label values inside the `## Mineral Facts` table adapt. The schema does not bend for exception stones.

---

## 10. Collector & Curiosity Notes

```markdown
# Collector & Curiosity Notes

## {Title}
**Icon:** `icon-{slug}`

{Body paragraph}

## {Title}
**Icon:** `icon-{slug}`

{Body paragraph}

## {Title}
**Icon:** `icon-{slug}`

{Body paragraph}

## {Title}
**Icon:** `icon-{slug}`

{Body paragraph}
```

Rules:

- 3 or 4 `## ` blocks. Fewer than 3 or more than 4 is a validation failure.
- Each block requires an `**Icon:** \`icon-{slug}\`` line immediately after the heading and before the body paragraph.
- Missing icon line is a validation failure.
- Icon slugs must begin with `icon-`.
- Body paragraph must be non-empty.

---

## 11. Market & Buying Notes

```markdown
# Market & Buying Notes

{Single paragraph}
```

Rules:

- This section is optional. Omit the heading entirely when no market content is present.
- When present, exactly one paragraph. An empty heading is a validation failure.
- Maps to `enc_stone_content.collector_context_p3`.

---

## 12. Care & Cleaning

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

- All four subheadings are required in this order.
- Each subheading body must be non-empty.
- Missing, renamed, or reordered subheadings are validation failures.

---

## 13. Related Stones

```markdown
# Related Stones

## Similar Energy

### {Stone Name}
**Slug:** `{slug}`

{Reason sentence}

### {Stone Name}
**Slug:** `{slug}`

{Reason sentence}

## Pairs Well With

### {Stone Name}
**Slug:** `{slug}`

{Reason sentence}

### {Stone Name}
**Slug:** `{slug}`

{Reason sentence}
```

Rules:

- `## Similar Energy` and `## Pairs Well With` are both required.
- Each group requires exactly 2 `### ` stone blocks.
- Each block requires a `**Slug:** \`{slug}\`` line immediately after the heading and before the reason.
- Missing slug line is a validation failure.
- Slug values must not include backtick characters — the parser strips them. The slug must resolve against the live `stones` roster or the packet generation halts with a named error.
- All 4 related stone entries must be unique slugs.

---

## 14. Validation Failure vs. Valid Skip

| Situation | Classification |
|---|---|
| Required section missing | Validation failure |
| Required section renamed | Validation failure |
| Required section present but empty | Validation failure |
| Optional section omitted entirely | Valid skip |
| Optional section present but renamed | Validation failure |
| Optional section present but empty | Validation failure |
| Required subheading count wrong | Validation failure |
| Icon line missing on required block | Validation failure |
| Icon slug does not start with `icon-` | Validation failure |
| Slug does not resolve against roster | Generation halt (named error) |
| Source disagrees on a field value | Generation halt (named error) |

The parser does not silently skip unrecognized content. Any unrecognized top-level `# ` heading causes a validation failure.

---

## 15. Conflict Resolution

When sources disagree (for example, the MD names a related stone one way and the roster resolves its slug to a different canonical name), the generator halts for that stone with this output:

```
[Stone Name]:
[Field] mismatch
MD value: [x]
Canonical value: [y]
Source: [which canonical source]
Generation stopped.
```

The generator never silently picks one source over another.

---

## 16. Test Fixtures

The canonical test fixture is:

```
tests/fixtures/rose-quartz.md
```

This fixture represents the standard clean-path case: a single true mineral, no exception flags, all optional sections present, all icon slugs confirmed from published Supabase data.

Additional fixtures are added when the first exception-case stone is routed through the pipeline. Exception fixtures must be placed in the same directory with a clearly labeled filename.

---

## 17. Content Not Present in This File

The following are never present in a generator-readable MD file:

- Research notes
- Source evidence tables
- Compliance checklists
- Gate status markers
- Approval notes
- Internal decision logs
- Amendment histories

These belong in separate research documents. If the parser encounters a `# RESEARCH NOTES` or `## COMPLIANCE REPORT` heading, it is a validation failure (unrecognized top-level heading).

---

## 18. Change Control

Changes to front matter, section names, section order, subheading patterns, count rules, optionality, icon syntax, slug syntax, validation-failure behavior, or canonical file location require:

1. Christie or Dustin approval
2. update to `Documents\Still Point Lapidary\Project Rules\MD-SCHEMA-REFERENCE.md` (canonical)
3. matching update to this file
4. parser and validator review
5. fixture updates
6. targeted tests
7. review of active canonical MDs

This file must never disagree with the Project Rules copy. If a discrepancy is found, this file is wrong and must be corrected to match.
