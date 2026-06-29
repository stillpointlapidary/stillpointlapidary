# Still Point Lapidary — Encyclopedia Page Structure

**Status:** Draft for Christie review  
**Purpose:** Defines the approved structure, layout behavior, section order, and implementation boundaries for every encyclopedia stone page.

---

## 1. Authority and Scope

This document controls:

- page sections and their order
- desktop and responsive layout behavior
- fixed structural counts
- placement of cards and navigation
- required visual relationships
- page-level implementation invariants

This document does **not** control:

- prose style or research standards
- source eligibility
- database columns or SQL
- stone-specific production values
- final approved public copy
- exact implementation code beyond required behavior

Authority by purpose:

1. Christie-approved project governance and explicit decisions
2. `ENCYCLOPEDIA-PAGE-STRUCTURE.md` for structure and responsive behavior
3. `ENCYCLOPEDIA-CONTENT-FIELDS.md` for fields, counts, and optionality
4. `ENCYCLOPEDIA-WRITING-AND-RESEARCH.md` for research, evidence, and prose
5. `ENCYCLOPEDIA-APPROVED-SOURCES.md` for source eligibility
6. `ENCYCLOPEDIA-DATABASE-REFERENCE.md` for Supabase storage and mapping
7. `ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html` for approved visual and DOM reference
8. Locked production data for stone-specific structured values
9. Approved canonical MD for public copy
10. `stones/stone.html` and Supabase for live operational rendering

When two sources conflict within the same authority area, stop and ask Christie. Do not choose silently.

---

## 2. Canonical Page Model

Every encyclopedia entry uses this section sequence:

1. Hero
2. At a Glance
3. Overview
4. Why People Reach For It
5. Energetic Themes
6. Mineral Profile
7. Collector & Curiosity Notes
8. Market & Buying Notes, when present
9. Care & Cleaning
10. Related Stones
11. Previous / Random / Next navigation
12. Bottom call to action

The desktop layout may place sections in two visual columns, but mobile reading order, sidebar order, and scroll-spy order must preserve the sequence above.

No section may be added, removed, renamed, or reordered without Christie’s approval and an update to this document.

---

## 3. Desktop Layout

The page uses a left sidebar and a main content area.

### 3.1 Sidebar

The sidebar contains:

- breadcrumb
- “On this page” navigation
- editorial standards note and link

Sidebar labels, in order:

1. Introduction
2. At a Glance
3. Overview
4. Why People Reach For It
5. Energetic Themes
6. Mineral Profile
7. Collector Notes
8. Market & Buying Notes, only when present
9. Care & Cleaning
10. Related Stones

The top link label is `Introduction`; its anchor remains `#top`.

### 3.2 Main Content

The main content contains:

- Hero
- At a Glance
- a two-column content area
- entry navigation
- bottom CTA

The two-column content area uses independent vertical stacks.

**Left stack:**

1. Overview
2. Why People Reach For It
3. Mineral Profile
4. Related Stones

**Right stack:**

1. Energetic Themes
2. Collector & Curiosity Notes
3. Market & Buying Notes, when present
4. Care & Cleaning

The two stacks size naturally and independently. Unequal ending heights are acceptable. Do not use forced equal-height cards, spacer blocks, fixed heights, or JavaScript height matching.

---

## 4. Responsive Behavior

At the approved tablet breakpoint, the sidebar disappears and the two content stacks collapse into one sequence.

Approved single-column order:

1. Overview
2. Why People Reach For It
3. Energetic Themes
4. Mineral Profile
5. Collector & Curiosity Notes
6. Market & Buying Notes, when present
7. Care & Cleaning
8. Related Stones

The scroll-spy section array must follow the same order:

`hero`, `glance`, `overview`, `reach`, `themes`, `mineral`, `notes`, `market` when present, `care`, `related`

At mobile widths:

- the route back to Encyclopedia remains visible and tappable
- the Hero image and Hero content stack vertically
- the three Hero tiles stack into one column
- At a Glance remains legible without horizontal scrolling
- Related Stones collapses to one column
- Common Localities remains a single readable row or wraps naturally
- buttons may wrap, but content order must not change

---

## 5. Hero

The Hero contains exactly these elements, in order:

1. stone image
2. collection label
3. stone name
4. signature line
5. three property pills
6. Best For
7. Use When
8. Affirmation
9. Save to Collection
10. Add to Wishlist

### 5.1 Hero Tiles

Best For, Use When, and Affirmation appear as exactly three equal-width tiles on desktop.

Behavior is binary:

- desktop: three tiles in one row
- narrow layout: three tiles stacked in one column

Do not introduce a two-plus-one wrapped state.

The internal order never changes:

1. Best For
2. Use When
3. Affirmation

The Affirmation icon uses the stone’s Energetic Role icon.

### 5.2 Hero Exclusions

The Hero must not contain:

- Known For
- Pairs Well With
- Primary Chakra
- a fourth Hero tile
- any At a Glance field
- any additional summary block

---

## 6. Stone Image

The image appears in a square Hero frame.

Canonical behavior:

- square frame
- background `#FAF7F2`
- very light border
- soft, restrained shadow
- no internal padding
- no inner frame
- `object-fit: contain`
- `object-position: center`
- full specimen visible
- no distortion
- no default edge cropping

The image treatment must remain neutral and specimen-focused.

Per-stone image-position overrides require Christie’s approval when they materially change framing.

---

## 7. At a Glance

At a Glance contains exactly six fields in this order:

1. Energetic Role
2. Chakra
3. Element
4. Zodiac
5. Color Energy
6. Material Type

Planet does not appear.

### 7.1 Chakra

- primary chakra displays prominently
- secondary chakra displays below in smaller type when supported
- no empty secondary line
- Clear Quartz may display `All Chakras` while using Crown styling tokens

### 7.2 Material Type

Material Type uses this controlled vocabulary:

- Mineral
- Mineral variety
- Rock
- Mineraloid
- Organic material
- Composite
- Synthetic
- Fossil
- Trade name

Material Type describes the material’s fundamental identity, not treatment status.

### 7.3 Visual Treatment

Each field contains:

- one icon tile
- one uppercase label
- one value

Vertical separators between fields remain light but clearly visible.

---

## 8. Overview

Overview contains exactly two paragraphs:

1. metaphysical identity
2. mineral and physical identity

The order is fixed.

Paragraph 1 opens with the stone’s name and defining role.

Paragraph 2 opens with a descriptive noun phrase or compelling physical fact, not the stone name.

No bullets, subheadings, or duplicate fact-table treatment appear inside Overview.

---

## 9. Why People Reach For It

This section contains exactly five rows.

Each row contains:

- one short label
- one description

Rows use divider separation rather than individual boxes.

---

## 10. Energetic Themes

Energetic Themes appears in the right rail on desktop.

Groups:

- Primary
- Secondary, optional
- Occasional Associations, optional

Rules:

- at least one Primary theme
- remove empty groups completely
- no blank labels or placeholders
- Occasional Associations render as pills
- divider lines separate groups when more than one group is present

Energetic Role and Energetic Themes are separate systems and must not be merged.

---

## 11. Mineral Profile

Mineral Profile has two phases.

### 11.1 Phase 1

- eight fact rows in a 4×2 grid
- one full-width Common Localities label/value row beneath the facts
- one hairline divider after Common Localities

Common Localities:

- uses centered dots between entries
- targets 3–6 meaningful entries
- permits up to 8 by justified exception
- does not render as a bullet list

### 11.2 Phase 2

Subsections appear in this order:

1. Formation
2. Quality Indicators
3. Identification
4. Locality Variations, optional
5. Physical Handling, optional

Market and pricing content does not appear in Mineral Profile.

Do not render:

- a `COLLECTOR'S GUIDE` label
- M1–M5 labels
- Market & Pricing as a Mineral Profile subsection

---

## 12. Collector & Curiosity Notes

This card appears in the right rail on desktop.

It contains 3 or 4 notes.

Each note uses:

- one icon
- one heading
- one short body paragraph
- one bottom divider, except the last note

Notes do not use separate card backgrounds or borders.

---

## 13. Market & Buying Notes

Market & Buying Notes is a standalone right-rail card.

It renders only when approved content exists.

It is sourced from the approved market-context field and does not duplicate Mineral Profile content.

It appears:

- after Collector & Curiosity Notes
- before Care & Cleaning

---

## 14. Care & Cleaning

Care & Cleaning appears in the right rail on desktop.

It always contains exactly four rows in this order:

1. Cleaning
2. Water
3. Light & Heat
4. Storage

Each row uses:

- one 26px icon
- one label
- one body sentence
- one bottom divider, except the last row

Care & Cleaning does not use:

- a 2×2 tile grid
- an outer wash panel
- spiritual cleansing instructions
- the public heading `Care & Cleansing`

The database table name `enc_care` remains unchanged.

---

## 15. Related Stones

Related Stones contains exactly four entries in two groups:

**Similar Energy**
- 2 stones

**Pairs Well With**
- 2 stones

The desktop layout uses two side-by-side groups. Mobile uses one column.

Each entry contains:

- stone indicator
- stone name
- relationship reason
- verified slug

---

## 16. Navigation and CTA

### 16.1 Entry Navigation

The entry navigation contains:

- Previous
- Random
- Next

Previous and Next values come from approved navigation data.

Dynamic pages do not depend on `enc-nav.js` for primary navigation.

### 16.2 Bottom CTA

The bottom CTA appears after entry navigation and links back to the Encyclopedia.

No extra section may appear between entry navigation and the CTA.

---

## 17. Icons

The page uses centralized icon mapping through `stones/enc-icons.css`.

Required behavior:

- external SVG assets
- CSS masking
- `currentColor` inheritance
- no repeated inline SVG library
- no per-card hard-coded full URLs
- invalid or missing mappings must fail visibly during validation

Fixed component icon assignments belong in the icon registry, not in this document.

No-icon areas:

- sidebar links
- Previous / Random / Next navigation
- property pills
- occasional-association pills
- mineral fact rows
- bottom CTA
- footer

---

## 18. Typography and Weight

- Georgia is the encyclopedia serif
- Jost is the encyclopedia sans serif
- Lora is not used
- `font-weight: 600` is prohibited
- 500 is the maximum weight

The signature line uses:

- Georgia
- italic
- 400
- 17px
- line-height 1.5

---

## 19. Borders and Dividers

Structural dividers remain light, but must be visible enough to organize the page.

The approved divider treatment applies consistently to:

- Hero tile separators
- At a Glance field separators
- section-heading rules
- Why People Reach For It rows
- Mineral Profile fact rows
- Phase 1 / Phase 2 divider
- Energetic Themes groups
- Collector Notes rows
- Care & Cleaning rows
- Related Stones rows

Use one shared divider token wherever practical.

Do not solve divider visibility by darkening card outlines or creating heavier boxes.

---

## 20. Visual Standard and Live Implementation

`ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html` is the approved visual and DOM example.

`stones/stone.html` is the operational dynamic implementation.

The two must remain aligned.

When they conflict:

1. confirm the intended approved behavior with Christie
2. update the controlling standard
3. update the implementation
4. validate both
5. do not preserve a known mismatch

The visual standard must not contain:

- mockup comparison variants
- experiment labels
- duplicate Hero options
- Hematite-specific review scaffolding
- obsolete Citrine-derived treatments
- placeholder sections not supported by the current page

---

## 21. Validation

Before a structural change is considered complete, verify only the checks relevant to that change.

### Full validation

Required for:

- new page structure
- responsive changes
- visual-standard changes
- major card or section changes

Check:

- desktop
- tablet
- mobile
- sidebar order
- mobile order
- scroll-spy order
- missing data behavior
- no placeholders
- no horizontal overflow
- image containment
- divider visibility
- navigation behavior

### Targeted validation

For narrow changes, verify:

- the affected selectors or sections
- the nearest responsive breakpoint
- one representative rendered page
- no collateral change to shared tokens or layout

Do not perform ceremonial checks unrelated to the change.

---

## 22. Change Control

Structural changes require:

1. Christie or Dustin approval
2. update to this document
3. update to the visual standard when presentation or DOM changes
4. update to `stones/stone.html`
5. targeted or full validation, depending on scope

This document always reflects the current approved structure.

Do not maintain an amendment archive inside this file. Historical decisions belong in project history or version control.
