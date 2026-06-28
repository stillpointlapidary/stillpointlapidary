# Still Point Lapidary — Encyclopedia Icon Registry

**Status:** Draft for Christie review  
**Purpose:** Defines the current icon assignments, semantic filenames, mapping rules, and future-library boundaries for encyclopedia pages.

---

## 1. Authority and Scope

This document controls:

- approved icon slugs
- fixed component assignments
- dynamic Energetic Role assignments
- Care & Cleaning icon assignments
- icon mapping behavior
- deprecated icon assignments
- future custom-library boundaries

This document does **not** control:

- page layout
- SVG artwork design
- database columns
- public copy
- stone-specific editorial values
- visual sizing outside approved component rules

Related authorities:

- `ENCYCLOPEDIA-PAGE-STRUCTURE.md` controls where icons appear
- `ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html` controls approved visual treatment
- `stones/enc-icons.css` is the centralized production mapping layer
- `assets/SVGs/` contains local source SVG files
- Supabase stores published icon assets

When an icon slug is missing or ambiguous, stop and ask Christie or Dustin.

Do not invent a near-match.

---

## 2. Canonical Icon Architecture

The encyclopedia uses:

- one semantic icon slug per approved concept
- external SVG assets
- centralized mapping through `stones/enc-icons.css`
- CSS masking
- `currentColor` inheritance
- stable semantic filenames
- no duplicated inline SVG markup

Approved Supabase path:

`stone-images/icons/encyclopedia/{icon-slug}.svg`

Approved public URL pattern:

`https://vxujlgyhgnihnqrxzefw.supabase.co/storage/v1/object/public/stone-images/icons/encyclopedia/{icon-slug}.svg`

Local source path:

`assets/SVGs/{icon-slug}.svg`

---

## 3. Fixed Page Component Icons

| Component | Icon slug | CSS class |
|---|---|---|
| Best For | `best-for` | `icon-best-for` |
| Use When | `todays-practice` | `icon-todays-practice` |
| Save to Collection | `add-piece` | `icon-add-piece` |
| Add to Wishlist | `wishlist` | `icon-wishlist` |
| At a Glance | `encyclopedia` | `icon-encyclopedia` |
| Overview | `book-reference` | `icon-book-reference` |
| Why People Reach For It | `target-bullseye` | `icon-target-bullseye` |
| Mineral Profile | `geology` | `icon-geology` |
| Related Stones | `stones-row` | `icon-stones-row` |
| Energetic Themes | `upward-spark` | `icon-upward-spark` |
| Collector & Curiosity Notes | `bookmark` | `icon-bookmark` |
| Market & Buying Notes | `encyclopedia` | `icon-encyclopedia` |
| Care & Cleaning | `care-cleansing` | `icon-care-cleansing` |

Temporary shared placeholder: Both Material Type (At a Glance) and Market & Buying Notes currently use `icon-encyclopedia` as a temporary placeholder. Both will receive dedicated icons when the custom SVG library ships. Do not substitute or invent alternatives in the meantime.

---

## 4. At a Glance Icons

The At a Glance fields appear in this order:

1. Energetic Role
2. Chakra
3. Element
4. Zodiac
5. Color Energy
6. Material Type

| Field | Icon rule |
|---|---|
| Energetic Role | Dynamic; resolved from the role map in §5 |
| Chakra | `chakra` |
| Element | `element` |
| Zodiac | `zodiac` |
| Color Energy | `color-range` |
| Material Type | `encyclopedia` temporarily |

### Material Type Temporary Assignment

`encyclopedia` is the temporary Material Type icon.

It may be replaced centrally when the future custom SVG library is complete.

Do not change it ad hoc on individual pages.

---

## 5. Energetic Role Icons

Each stone has exactly one Energetic Role.

The role label and icon slug must match this table exactly.

| Energetic Role | Icon slug | CSS class |
|---|---|---|
| Grounding | `grounding` | `icon-grounding` |
| Protection | `protection` | `icon-protection` |
| Vitality | `vitality` | `icon-vitality` |
| Heart Healing | `heart-healing` | `icon-heart-healing` |
| Calm & Peace | `calm-peace` | `icon-calm-peace` |
| Emotional Regulation | `emotional-regulation` | `icon-emotional-regulation` |
| Clarity & Focus | `clarity-focus` | `icon-clarity-focus` |
| Intuition | `intuition` | `icon-intuition` |
| Spiritual Connection | `spiritual-connection` | `icon-spiritual-connection` |
| Transformation | `transformation` | `icon-transformation` |
| Manifestation | `manifestation` | `icon-manifestation` |
| Amplification | `amplification` | `icon-amplification` |

The Affirmation icon uses the same role icon.

If a production value does not match one of these 12 roles, stop and ask.

---

## 6. Care & Cleaning Icons

Care & Cleaning contains four fixed rows.

| Category | Current icon slug | CSS class |
|---|---|---|
| Cleaning | `care-cleansing` | `icon-care-cleansing` |
| Water | `element` | `icon-element` |
| Light & Heat | `celestial` | `icon-celestial` |
| Storage | `geology` | `icon-geology` |

These assignments are interim.

They remain valid until the future custom icon library provides dedicated category icons.

Do not create category icons during ordinary stone production.

---

## 7. Collector Note and Theme Icons

Collector Notes and Energetic Themes may use approved semantic icons from the available icon library.

Rules:

- use the icon slug approved in canonical MD or production data
- choose icons during editorial approval, not during Supabase entry
- do not invent a slug
- do not use decorative variation merely to avoid repetition
- reuse is acceptable when the concept is genuinely the same
- visual consistency matters more than forcing every row to be unique

Missing mappings must be resolved before publication.

---

## 8. Related Stones

The Related Stones section heading uses:

- slug: `stones-row`
- class: `icon-stones-row`

The two group labels do not require separate icons in the current approved page structure.

`pair-with` may remain in the asset library for future use, but it is not required in the current Related Stones layout.

---

## 9. No-Icon Areas

Do not add icons to:

- sidebar navigation links
- breadcrumb text
- collection label
- property pills
- occasional-association pills
- individual mineral fact rows
- Common Localities
- Previous / Random / Next navigation
- bottom CTA
- footer

Do not decorate empty space with icons.

---

## 10. Deprecated Assignments

Do not use these as current field assignments:

| Deprecated field or component | Old icon | Status |
|---|---|---|
| Known For | `star` | Field removed |
| Primary Themes in At a Glance | `tag-label` | Field removed |
| Formation in At a Glance | `geology` | Field removed from At a Glance |
| Hardness in At a Glance | `crystal-single` | Field removed from At a Glance |
| Color Range as a field | `color-range` | Field removed; artwork reassigned to Color Energy |
| Planet | `celestial` | Field removed from display |
| Pairs Well With Hero tile | `pair-with` | Hero tile removed |
| Primary Chakra Hero tile | `chakra` | Hero tile removed |

The asset may remain available even when the old assignment is retired.

---

## 11. CSS Mapping Rules

Each icon class maps to one external SVG through `stones/enc-icons.css`.

Required pattern:

```css
.enc-icon {
  background-color: currentColor;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
}
```

Each semantic class sets its icon URL through a custom property or equivalent centralized rule.

Do not:

- place full Supabase URLs throughout page HTML
- use `<img>` for icons that must inherit `currentColor`
- duplicate the same mapping in multiple files
- hide missing mappings with a generic fallback

A missing icon should be visible during validation.

---

## 12. SVG Source Standards

Future and replacement SVGs should use:

- stable semantic filenames
- consistent `viewBox`
- consistent line weight
- consistent corner treatment
- consistent optical sizing
- `currentColor`
- no embedded raster content
- no unnecessary metadata
- no hard-coded theme color
- clean paths suitable for CSS masking

Do not edit the public asset without updating the canonical source file.

The repository source is the truth.

The published Supabase file is delivery output.

---

## 13. Future Custom SVG Library

A future controlled icon project will create a cohesive custom library.

The library should cover:

- fixed page-section icons
- all six At a Glance fields
- all 12 Energetic Roles
- four Care & Cleaning categories
- collection and wishlist actions
- recurring theme concepts
- recurring collector-note concepts
- any approved navigation icons

Architecture:

- individual canonical SVG source files
- shared design language
- stable semantic names
- build process for delivery assets
- centralized mapping
- no ad hoc page-level icon design

Do not begin or expand this library during ordinary stone production.

---

## 14. Validation

Before publication or icon-system changes, verify:

- every used slug exists locally
- every used slug exists in Supabase
- `enc-icons.css` contains the mapping
- the CSS class matches the approved slug
- currentColor inheritance works
- the icon is legible at approved sizes
- no deprecated field assignment has returned
- no icon is blank
- no generic fallback hides an error
- Material Type still uses the approved temporary icon
- Affirmation matches Energetic Role

For a narrow icon change, validate only the affected component and one representative page.

---

## 15. Change Control

Changes to:

- fixed icon assignments
- Energetic Role mappings
- icon slugs
- Supabase paths
- CSS mapping architecture
- SVG style standards
- no-icon rules

require:

1. Christie or Dustin approval
2. update to this document
3. update to `stones/enc-icons.css`
4. source-file update where needed
5. Supabase asset update where needed
6. targeted visual validation

This document reflects the current approved icon system only.

Do not maintain an amendment archive inside this file.
