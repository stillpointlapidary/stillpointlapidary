# Still Point Lapidary — Encyclopedia Content Fields

**Status:** Draft for Christie review  
**Purpose:** Defines the required fields, counts, optionality, controlled vocabularies, and content limits for every encyclopedia stone entry.

---

## 1. Authority and Scope

This document controls:

- which editorial fields exist
- which fields are required or optional
- exact counts and approved ranges
- controlled vocabularies
- maximum lengths for compact fields
- field-to-section relationships
- removal behavior for optional content

This document does **not** control:

- page layout or responsive behavior
- prose voice or research methodology
- source eligibility
- database column types
- exact HTML or CSS implementation
- stone-specific approved values

Related authorities:

- `ENCYCLOPEDIA-PAGE-STRUCTURE.md` controls placement and page order
- `ENCYCLOPEDIA-WRITING-AND-RESEARCH.md` controls evidence, voice, and section jobs
- `ENCYCLOPEDIA-DATABASE-REFERENCE.md` controls storage and field mapping
- `ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html` controls approved visual and DOM reference
- locked production data controls approved structured values
- canonical MD controls approved public copy

When a field rule conflicts with another file, stop and ask Christie or Dustin. Do not invent a resolution.

---

## 2. Identity and Metadata

| Field | Requirement |
|---|---|
| `STONE_ID` | Required. Stable catalog ID. |
| `STONE_SLUG` | Required. URL-safe lowercase slug. Must match the catalog and Supabase. |
| `STONE_NAME` | Required. Canonical display name. |
| `COLLECTION_LABEL` | Required. One of: Essentials, Shelf Builders, Collector Favorites, Rare Finds. |
| `MATERIAL_TYPE` | Required. Use the controlled vocabulary in §6. |
| `STONE_IMAGE_URL` | Required before publication. |
| `STONE_IMAGE_ALT` | Required. Clear, descriptive alt text. |
| `PUBLISHED_STATUS` | Required operational field. Draft entries remain unpublished until Gate 7. |

Planet is not a required production field. Existing values may remain stored, but new encyclopedia production does not require planet research or assignment.

---

## 3. Hero Fields

### 3.1 Signature Line

| Rule | Requirement |
|---|---|
| Count | Exactly 1 |
| Form | One sentence |
| Maximum | 20 words |
| Display | Italic, unlabeled |
| Job | Distill the stone’s defining character |
| Source | Approved research and locked identity |

The Signature Line must not repeat Best For, Use When, or Affirmation verbatim.

### 3.2 Property Pills

| Rule | Requirement |
|---|---|
| Count | Exactly 3 |
| Length | 1–3 words each |
| Source | Locked production data |
| Style | Short, distinct, non-repetitive |

Property pills are not written ad hoc during HTML or Supabase entry.

### 3.3 Best For

| Rule | Requirement |
|---|---|
| Count | Exactly 1 |
| Maximum | 20 words |
| Form | Gerund phrase or noun phrase |
| Sentence | Complete sentence not required |

### 3.4 Use When

| Rule | Requirement |
|---|---|
| Count | Exactly 1 |
| Maximum | 25 words |
| Form | One sentence |
| Opening | Begins with the situation or need |

Do not begin with “Use [Stone] when” or “Reach for [Stone] when.”

### 3.5 Affirmation

| Rule | Requirement |
|---|---|
| Count | Exactly 1 |
| Maximum | 15 words |
| Form | First person, present tense |
| Sentence | One sentence |
| Icon | Uses the Energetic Role icon |

---

## 4. At a Glance Fields

At a Glance contains exactly six fields in this order:

1. Energetic Role
2. Chakra
3. Element
4. Zodiac
5. Color Energy
6. Material Type

### 4.1 Energetic Role

| Rule | Requirement |
|---|---|
| Count | Exactly 1 |
| Value | One approved role |
| Icon | Must match the role exactly |

Approved Energetic Roles:

- Grounding
- Protection
- Vitality
- Heart Healing
- Calm & Peace
- Emotional Regulation
- Clarity & Focus
- Intuition
- Spiritual Connection
- Transformation
- Manifestation
- Amplification

Energetic Role is distinct from Energetic Themes.

### 4.2 Chakra

| Field | Requirement |
|---|---|
| `CHAKRA_PRIMARY` | Required |
| `CHAKRA_SECONDARY` | Optional |
| `STYLING_CHAKRA` | Required for design-token selection; may differ from public display only by approved exception |

When no secondary chakra is supported, remove the secondary display completely.

Clear Quartz exception:

- public Chakra value: `All Chakras`
- styling chakra: Crown
- no secondary line unless separately approved

### 4.3 Element

Exactly one approved public-facing value.

Use `Air`, not `Wind`, in public production data and copy.

### 4.4 Zodiac

- 1 or 2 signs
- use approved production values
- do not add signs to fill space

### 4.5 Color Energy

- exactly 1 approved display value
- may contain multiple physical colors when needed
- use canonical catalog vocabulary
- prefer dominant or defining colors over vague labels such as `Multicolored`

### 4.6 Material Type

Use exactly one value from this controlled vocabulary:

- Mineral
- Mineral variety
- Rock
- Mineraloid
- Organic material
- Mineral aggregate
- Composite
- Synthetic
- Fossil
- Trade name

`Mineral aggregate` describes a naturally occurring multi-mineral material without sufficient coherence or standardization to be classified as a defined rock type. It is distinct from `Composite`, which in gemological usage refers to manufactured assembled stones.

Material Type describes fundamental identity, not treatment status.

Treatment, trade-name, and identity flags may be stored separately in production data.

---

## 5. Overview

Overview contains exactly two paragraphs.

### Paragraph 1: Metaphysical Identity

Required.

- opens with the stone name and defining role
- establishes why the stone matters to people
- develops one clear central identity
- may include supporting energetic nuance
- must not read as a property list

Maximum target: approximately 120 words.

### Paragraph 2: Mineral and Physical Identity

Required.

- does not open with the stone name
- opens with a descriptive noun phrase or compelling physical fact
- explains what the material actually is
- may cover composition, appearance, formation, treatment, trade-name issues, and authenticity distinctions
- must not duplicate the fact table without a genuinely different angle

Maximum target: approximately 120 words.

---

## 6. Why People Reach For It

Exactly 5 rows.

Each row contains:

| Field | Requirement |
|---|---|
| Label | Required, short, distinct |
| Description | Required, 1–2 sentences |
| Maximum | 30 words |

Rows must represent different situations or needs.

Do not repeat Best For or Use When in five slightly different forms.

---

## 7. Energetic Themes

Energetic Themes contain three possible groups.

### 7.1 Primary

- 1 or 2 themes
- at least 1 required
- each theme contains icon, title, and description

### 7.2 Secondary

- 0, 1, or 2 themes
- optional
- remove the entire group when empty

### 7.3 Occasional Associations

- 0, 1, or 2 associations
- optional
- render as pills only
- remove the entire group when empty

### 7.4 Theme Fields

For each Primary or Secondary theme:

| Field | Requirement |
|---|---|
| Title | Required |
| Description | Required |
| Icon slug | Required |
| Maximum description | One sentence; target 3 visual lines |

Do not invent themes to create symmetry.

---

## 8. Mineral Profile

Mineral Profile contains:

1. exactly 8 fact rows
2. Common Localities
3. Formation
4. Quality Indicators
5. Identification
6. Locality Variations, optional
7. Physical Handling, optional

### 8.1 Facts Table

Exactly 8 rows.

Default labels for true minerals:

1. Mineral Family
2. Chemical Formula
3. Crystal System
4. Mohs Hardness
5. Cleavage
6. Specific Gravity
7. Luster
8. Transparency

For rocks, mineral aggregates, composites, mineraloids, organics, synthetics, fossils, or trade-name materials, labels may be adapted to the verified identity.

Possible substitutes include:

- Composition
- Primary Components
- Structure
- Origin
- Manufacturing Status
- Treatment Status
- Material Type

Do not force a chemical formula or crystal system onto a material that does not have one.

Specific Gravity values must use the verified value or range directly. Do not prefix the value with `Approximately` in canonical MD or Supabase content.

### 8.2 Common Localities

- target 3–6 entries
- up to 8 by justified exception
- fewer than 3 allowed when the material has only one or two dominant, meaningful sources
- no padding
- no exhaustive occurrence list
- use concise locality names
- rendered with centered-dot separators

### 8.3 Formation

- required
- 2–3 sentences
- geology only
- may include natural color origin and crystal habit
- must not include treatment, imitation, fraud, or market warnings

### 8.4 Quality Indicators

- required
- explains what separates strong specimens from mediocre ones
- may distinguish quality criteria by form when needed

### 8.5 Identification

- required
- covers confusion stones, imitations, treatments, mislabeling, and authentication clues

### 8.6 Locality Variations

- optional
- include only when source location changes appearance, quality, habit, or collector significance
- remove when not meaningful

### 8.7 Physical Handling

- optional
- include only when weight, texture, fragility, surface, or tactile character is genuinely useful
- remove when generic

---

## 9. Market & Buying Notes

- exactly 1 paragraph when present
- required for standard production unless Christie or Dustin explicitly approves omission
- rendered as a standalone right-rail card
- covers availability, price calibration, value drivers, and market expectations
- must not become a live pricing table
- must not duplicate Quality Indicators or Identification

---

## 10. Collector & Curiosity Notes

Published count:

- 3 or 4 notes

Research target:

- 4 strong candidates

Each note contains:

| Field | Requirement |
|---|---|
| Icon slug | Required |
| Title | Required |
| Body | Required |
| Maximum body | 55 words |
| Sentence count | 1–2 sentences |

Publish 4 when all four are distinct and worthwhile.

Publish 3 when the fourth is weak, repetitive, or creates poor page balance.

Fewer than 3 strong notes blocks publication and returns the stone to research.

---

## 11. Care & Cleaning

Exactly 4 fixed rows in this order:

1. Cleaning
2. Water
3. Light & Heat
4. Storage

Each row contains one sentence.

### 11.1 Cleaning

Physical cleaning method.

### 11.2 Water

Water safety based on verified properties and specimen condition.

### 11.3 Light & Heat

Light, heat, and thermal-shock guidance.

### 11.4 Storage

Storage guidance based on hardness, cleavage, surface, matrix, or fragility.

Rules:

- practical and evidence-based
- no spiritual cleansing instructions
- no unsupported warnings
- state ordinary stability when no special precaution applies
- preserve uncertainty when the advice genuinely depends on treatment, matrix, coating, or specimen condition

---

## 12. Related Stones

Exactly 4 related stones.

### Similar Energy

- exactly 2
- each must explain shared character and meaningful distinction

### Pairs Well With

- exactly 2
- each must explain what the pairing adds or extends

Each entry contains:

| Field | Requirement |
|---|---|
| Related stone name | Required |
| Related slug | Required and verified |
| Reason | Required |
| Maximum reason | 30 words |

All four stones must be different.

---

## 13. Navigation

Required:

- previous stone name
- previous stone slug
- next stone name
- next stone slug

Values must come from approved navigation data.

Do not infer navigation from memory or local alphabetical sorting.

Random navigation is handled by the dynamic site implementation and is not a stone-specific editorial field.

---

## 14. Image Fields

Required before publication:

| Field | Requirement |
|---|---|
| Image URL | Supabase encyclopedia image URL |
| Image alt | Descriptive alt text |
| Image status | Confirmed uploaded and visually checked |

Image-production specifications belong in `ENCYCLOPEDIA-PHOTO-STANDARD.md`.

---

## 15. Optional-Field Removal

When optional content is unsupported:

- remove the full row, group, subsection, or card
- do not leave empty labels
- do not leave empty spans
- do not retain placeholder dividers
- do not invent content to preserve visual symmetry

Optional fields include:

- Secondary Chakra
- second Primary theme
- Secondary themes
- Occasional Associations
- Locality Variations
- Physical Handling
- fourth Collector Note
- Market & Buying Notes only by explicit approved exception

---

## 16. Compact-Field Limits

| Field | Maximum |
|---|---|
| Signature Line | 20 words |
| Property Pill | 3 words |
| Best For | 20 words |
| Use When | 25 words |
| Affirmation | 15 words |
| Why People Reach For It description | 30 words |
| Related Stone reason | 30 words |
| Collector Note body | 55 words |

These are ceilings, not targets.

Do not pad short, effective copy to approach a maximum.

---

## 17. Production Status Values

Use these statuses:

- RESEARCH COMPLETE
- MD DRAFT COMPLETE
- GATE 0 NORMALIZATION PENDING
- APPROVED FOR SUPABASE ENTRY
- PUBLISHED

A separate operational tracker may record additional workflow detail, but these are the standard public production statuses.

---

## 18. Validation

Before MD approval, verify:

- all required fields are present
- exact counts are correct
- optional fields are either complete or fully removed
- controlled vocabularies are valid
- all slugs are verified
- compact-field limits are met
- no Planet display field remains
- no Known For field remains
- no placeholders remain
- no unsupported extra sections exist

Before publication, verify:

- canonical MD and Supabase match
- image is present
- navigation values are correct
- related slugs resolve
- published status is intentionally changed
- the live page renders all required content

---

## 19. Change Control

Field additions, removals, count changes, vocabulary changes, and optionality changes require:

1. Christie or Dustin approval
2. update to this document
3. database review when storage is affected
4. visual-standard review when presentation is affected
5. implementation update
6. targeted validation

This document always reflects the current approved field model.

Do not keep superseded field rules in an amendment appendix.
