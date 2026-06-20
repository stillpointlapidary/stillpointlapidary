# Approved Reusable MD Schema v1.1

# {STONE NAME} — Encyclopedia Entry

## Page Data
### Name
### Slug
### Tier
### Collection Tier
### Image URL
### Navigation
#### Previous Stone
- Name:
- Slug:
#### Next Stone
- Name:
- Slug:

## Hero
### Property Pills
- exactly 3
### Best For
- 3 visual lines preferred; 4 maximum at the approved desktop reference width
### Use When
- 3 visual lines preferred; 4 maximum at the approved desktop reference width
### Pairs With
- exactly 3 stones
### Primary Chakra
- exactly one, except Clear Quartz may use `All Chakras`
### Secondary Chakras
- list or None
### Styling Chakra

> **HTML display — Hero tile:** Label is `Primary Chakra`. Display the approved Primary Chakra only. Do not display Secondary Chakras in the Hero. Clear Quartz may display `All Chakras` as its single categorical value. Do not add a new tile.

## Known For
### Label
### Description
- stone-specific, not generic
- 3 visual lines ideal; 4 maximum at the approved desktop reference width

## Overview
- exactly 2 paragraphs
- each paragraph should remain within approximately 5 visual lines at the approved desktop reference width
- concise but distinctive: include stone-specific mineral, historical, practical, or energetic detail
- avoid generic crystal-directory language and repeated claims from surrounding sections
- Paragraph 1: physical identity — establish what the subject is and its relevant mineral relationship (variety, trade name, rock, composite, etc.) immediately; do not present a non-species material as a distinct mineral species
- Paragraph 2: metaphysical identity — themes, nuance, traditional use, and any meaningful misconceptions

## Why People Reach For It
- exactly 5 use cases
- each description must fit within 3 visual lines at the approved desktop reference width
- one clear function per row; no repeated phrasing

## At a Glance
| Category | Detail |
|---|---|
| Primary Themes | |
| Chakras | |
| Element | |
| Zodiac | |
| Formation | |
| Hardness | |
| Color Range | |

> **HTML display — At a Glance:** The chakra glance item label is always `Chakras`. Never change it to `Chakra`, even when only one chakra is displayed. Display the complete approved chakra set: Primary Chakra first, followed by Secondary Chakras when present. If Secondary Chakras is `None`, display the Primary Chakra only. Clear Quartz displays `All Chakras`. Do not add a separate Secondary Chakras item or a new glance column. Do not inspect another stone page to infer this label or pattern.

## Energetic Themes
### Primary
- exactly 2
- each description must fit within 3 visual lines at the approved desktop reference width
### Secondary
- exactly 2
- each description must fit within 3 visual lines at the approved desktop reference width
### Occasional
- 1 or 2 when supported
- label only; no explanatory paragraph unless specifically approved

## Mineral Profile
Cover relevant composition, family, crystal system, formation, color cause, hardness, durability, treatments, imitations, trade names, and care.

Public presentation must remain concise:
- use factual rows for compact technical data
- Formation prose should be one focused paragraph
- the lower mineral note should be one focused paragraph
- avoid repeating localities, hardness, treatments, or care across multiple places
- do not preserve research-note length in public copy

### Common Localities Layout
In the HTML Mineral Profile, the Common Localities list must use a two-column bulleted layout on desktop.

Required behavior:
- desktop: two equal columns
- mobile: one natural column
- preserve normal bullet styling
- apply the two-column layout only to Common Localities
- do not apply it to other lists
- do not use manual `<br>` tags to create columns
- do not split the list into two separate `<ul>` elements
- use one semantic `<ul>` with class `.common-localities`

Approved CSS pattern:
```css
.mineral-formation .common-localities {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 0;
  padding-left: 18px;
}

@media (max-width: 600px) {
  .mineral-formation .common-localities {
    grid-template-columns: 1fr;
  }
}
```

This is the canonical format for all future encyclopedia pages.

## Collector Notes
- exactly 4 verified notes
- each note must contribute a distinct, compelling fact or collecting insight
- 35–55 words per note; 60-word hard maximum
- one idea per note
- avoid repetitive treatment, formation, locality, or trade-name coverage
- do not repeat Mineral Profile, care, treatment, or formation content unless the collector angle is genuinely different
- titles should be 2–5 words
- the four-note set must remain visually balanced in the desktop rail

## Related Stones
### Similar Energy
- exactly 2
- canonical name
- canonical slug
- one concise sentence explaining similarity and distinction
- 30-word maximum; target approximately 3 visual lines and do not exceed 3 visual lines at the approved desktop reference width

### Pairs Well With
- exactly 2
- canonical name
- canonical slug
- one concise sentence explaining complementary function
- 30-word maximum; target approximately 3 visual lines and do not exceed 3 visual lines at the approved desktop reference width

# RESEARCH NOTES — NOT FOR PUBLICATION

## Complete Metaphysical Source List
## Complete Geological and Technical Source List
## Theme Decisions
## Pairing Decisions
## Historical and Cultural Verification
## Treatments, Trade Names, Imitations, and Care
## Chakra and Styling Decision
## Element and Zodiac
## Claims Rejected or Omitted

## Mineral Identity and Relationship Fields
(Workbook fields only — not live Supabase columns or CSV schema. For research structure and source-of-truth workbook use only.)

- identity_type:
- parent_material:
- parent_page_slug:
- relationship_note:
- related_varieties:
- trade_name_status:
- man_made_status:

### Controlled Vocabulary — identity_type
- Mineral
- Mineral variety
- Rock
- Mineraloid
- Volcanic glass
- Organic material
- Trade name
- Composite material
- Man-made material

## COMPLIANCE REPORT
Check:
- research minimums
- technical verification
- historical verification
- public authority voice
- required sections
- tier data
- image URL
- chakra rules
- navigation
- hero pairings
- related-stone counts
- relationship uniqueness
- related slugs
- counts and word limits
- placeholders
- medical/psychological claims
- source hierarchy
- repetition
- em dashes
- identity_type confirmed
- mineral relationship stated in Overview paragraph 1 (when applicable)
- sibling pages identified and cross-linked (when applicable)
- variety or trade-name page does not repeat family-level prose from parent page

## Public Copy and Visual-Fit Rules
- Accuracy is required, but public copy is not a research dump.
- Visual fit outranks inherited wording and raw word count.
- Rewrite approved draft language when needed to meet the locked visual limits without changing meaning.
- Do not shrink type, expand cards, reduce spacing, clip copy, add internal scrollbars, or preserve verbose legacy wording to force a fit.
- Validate all line limits in the browser at the approved desktop reference width after final copy is inserted.

## Desktop Column Alignment
- On desktop, the main article column and the Collector & Curiosity Notes rail must end on the same horizontal baseline.
- Use the approved stretch-and-flex layout pattern so the final card in the shorter column absorbs remaining height.
- In the right rail, only the final Collector & Curiosity Notes card may stretch.
- Known For and Energetic Themes must always remain natural height.
- Extra space may appear only inside the final card of the shorter column.
- Do not use spacer elements, fixed heights, clipped content, internal scrollbars, smaller typography, or page-specific padding to force alignment.
- At mobile widths, remove the stretch behavior and return both columns and final cards to natural height.
- Browser validation is required after editorial copy is final.
