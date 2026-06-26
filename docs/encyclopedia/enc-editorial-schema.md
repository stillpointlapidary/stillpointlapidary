# enc-editorial-schema.md
# Still Point Lapidary — Encyclopedia Editorial Schema
# Version: 2026-06-22 | Aligned to CANONICAL-STONE-PAGE-TEMPLATE.html

This document defines the content rules, field counts, and editorial constraints for every
encyclopedia stone page. All rules here must match the canonical HTML template exactly.
Do not update one without updating the other.

---

## Identity & Metadata

| Field | Rule |
|---|---|
| `STONE_SLUG` | URL-safe lowercase slug (e.g. `tigers-eye`). Matches filename and `data-stone-slug`. |
| `STONE_NAME` | Display name as it appears in the page title, h1, breadcrumb, and meta. |
| `THEME_COLOR_HEX` | Hex color for `<meta name="theme-color">`. Should match `--ck-accent`. |

---

## Chakra Design Tokens (CSS)

One set of `--ck-*` CSS custom properties per stone, keyed to the stone's primary chakra.
All nine token values are required. Derive from the chakra's canonical palette.

| Token | Purpose |
|---|---|
| `--ck-pill-bg` | Background for property pills |
| `--ck-pill-text` | Text color for property pills |
| `--ck-btn-bg` | Primary button background |
| `--ck-btn-border` | Primary button border |
| `--ck-btn-text` | Primary button text |
| `--ck-wash` | Wash background (glance tiles, care grid, theme tiles) |
| `--ck-wash-border` | Wash border |
| `--ck-accent` | Primary accent color (icons, active states, affirmation text) |
| `--ck-deep` | Deep text color for primary button text |

---

## Hero Section

| Field | Rule |
|---|---|
| `STONE_IMAGE_URL` | Supabase storage URL for the stone's `.webp` image. |
| `STONE_IMAGE_ALT` | Descriptive alt text for the stone photo. |
| `COLLECTION_LABEL` | Short label above the stone name (e.g. `Essentials`). |
| `STONE_SIGNATURE` | One italic sentence. The stone's defining character in plain terms. No metaphysical mechanism language. |
| `PILL_1`, `PILL_2`, `PILL_3` | Exactly 3 property pills. Single words or short phrases. |
| `BEST_FOR` | One concise gerund phrase or noun phrase describing the stone's primary uses. A complete sentence is not required. |
| `USE_WHEN` | One sentence. Begins with the situation, not with the stone name. Does not start "Reach for [Stone] when…". |
| `AFFIRMATION` | One sentence, first person, italic. Icon matches `ENERGETIC_ROLE_ICON` exactly. |

---

## At a Glance

Six fixed boxes in this order: Energetic Role · Chakra · Element · Planet · Zodiac · Color Energy.
Layout is fixed. Do not reorder or remove boxes.

| Field | Rule |
|---|---|
| `ENERGETIC_ROLE_ICON` | Icon class for the Energetic Role. Dynamic per stone (e.g. `icon-manifestation`, `icon-protection`, `icon-heart-healing`). Also drives the Affirmation icon. |
| `ENERGETIC_ROLE` | Exactly 1 value. A single role label (e.g. `Manifestation`, `Protection`, `Grounding`). Never split into primary/secondary. |
| `CHAKRA_PRIMARY` | The stone's primary chakra. Required. |
| `CHAKRA_SECONDARY` | **Optional.** Secondary chakra(s), displayed in a smaller span. If no secondary chakra is supported by the research, remove the entire `.chakra-secondary` span. Do not leave it blank. Do not invent a secondary chakra. |
| `ELEMENT` | Classical element association. |
| `PLANET` | Primary planetary association. |
| `ZODIAC` | Primary zodiac sign(s). |
| `COLOR_ENERGY` | Color energy label. |

---

## Overview

Two paragraphs. Required.

- **Paragraph 1:** Metaphysical identity. Who this stone is, what tradition says about it, what it is for. Lead with the stone's character and central energetic purpose. Manifestation and similar claims must be framed as directed effort or tradition, not as literal mechanisms. This paragraph should be compelling and readable — not a list of properties, but a clear statement of the stone's identity and role.
- **Paragraph 2:** Mineral and physical identity. What it is made of, how it forms, appearance, treatments, trade-name issues, and authenticity distinctions that matter to a reader.

**Order is locked: metaphysical first, mineral second.** This applies to all encyclopedia entries including the approved pilot stones.

Avoid repetitive stone-name openings. The first sentence of P1 should lead with the stone's name and its defining role — e.g. "Hematite is the stone of grounding..." — then develop from there. Use natural alternatives elsewhere when they read naturally.

---

## Why People Reach For It

Exactly 5 rows. Each row has a short label and a one-to-two sentence description.
Rows are keyed to distinct use cases, not to theme repetition.
Avoid repeating the stone name across rows. Prefer direct constructions and natural alternatives.

---

## Mineral Profile

### Facts Table

Exactly eight rows. The label and value in each row are adaptable per entry.

**Standard default labels for true minerals (use whenever they accurately apply):**

1. Mineral Family
2. Chemical Formula
3. Crystal System
4. Mohs Hardness
5. Cleavage
6. Fracture
7. Luster
8. Transparency

**Adaptable labels rule:** Use the standard eight labels whenever they accurately apply. For rocks, composites, mineraloids, organic materials, synthetic materials, or trade-name mixtures, substitute scientifically appropriate labels while keeping exactly eight rows. Do not force a single chemical formula, crystal system, or mineral-family label when the material does not have one.

Examples of acceptable label substitutions (select according to the verified identity of each entry):
- Material Type
- Composition
- Primary Components
- Structure
- Origin
- Manufacturing Status
- Treatment Status

Do not prescribe one universal alternate set. Labels must be selected according to the verified identity of each entry.

The rendered structure, classes, order, styling, and number of rows remain fixed at eight on every page.

### Formation

One paragraph. Covers how the stone forms, color origin, geological environment, and crystal habits.

**Formation describes geology only. Do not include treatment disclosures, authenticity warnings, or imitation notes.** Treatment and market authenticity information belongs in the Collector Context paragraphs or Collector & Curiosity Notes. Do not end a Formation paragraph with a treatment sentence even when the transition feels natural.

### Common Localities

`COMMON_LOCALITIES_ITEMS` is a repeatable HTML block containing the complete approved set of `<li>...</li>` elements for that stone. The number of items is editorially determined per entry.

**No fixed minimum or maximum.**
Include only the most commercially important, historically significant, or collector-relevant localities supported by the research.

- A stone with two dominant sources may list only two.
- A broadly distributed mineral may list more when each locality is meaningful.
- Do not pad the list.
- Do not list every country where the mineral has ever been reported.

### Collector-Context Paragraphs

Exactly 3 paragraphs below the mineral layout (`mineral-note` class):

1. What to look for / quality and value indicators.
2. Identification / potential confusion with other stones.
3. Market availability and pricing context.

---

## Energetic Themes

### Energetic Role vs Energetic Themes

These are distinct fields.

**Energetic Role** (At a Glance):
- Exactly 1 per stone.
- A single locked role label.
- Drives the Affirmation icon.
- Never split into primary or secondary.

**Energetic Themes** (right rail section):
- Separate from Energetic Role.
- Never invent a theme to fill the template.
- Remove unused rows or groups cleanly.

### Theme Counts

| Group | Count rule |
|---|---|
| Primary | 1 or 2, evidence-supported. At least 1 required. |
| Secondary | 0, 1, or 2, evidence-supported. If 0: remove entire Secondary group including divider and label. If 1: remove unused second `.theme-row`. |
| Occasional Associations | 0, 1, or 2, evidence-supported. If 0: remove entire Occasional group including divider and label. If 1: remove unused second `.occ-tag` span. |

Each theme row has an icon, a title, and a description paragraph.

---

## Collector & Curiosity Notes

**Research target:** Collect 4 strong, distinct note candidates.
**Published page:** 3 or 4 notes.

| Condition | Action |
|---|---|
| All 4 notes are distinct and useful | Publish 4 |
| Fourth note is weak, repetitive, or creates poor balance | Publish 3; remove the fourth `.note-row` block |
| Fewer than 3 strong notes found | Do not publish; return to research |

Do not fabricate or pad a fourth note. The final count may also reflect an editorial layout-balancing decision after visual review.

Each note row has an icon, a bold title, and a body paragraph.

---

## Care & Cleansing

Always exactly **4 fixed categories** in this order:

1. **Cleaning** — Physical cleaning method. Evidence-based.
2. **Water** — Water safety. Derived from mineral properties (hardness, solubility, cleavage).
3. **Light & Heat** — Sensitivity to light or heat. State ordinary stability if no unusual precaution applies.
4. **Storage** — Storage guidance. Keyed to Mohs hardness and cleavage.

Category labels and four-tile layout are fixed on every page. Do not make categories optional or interchangeable.

Content rules:
- Change guidance according to the stone's verified mineral properties.
- Remain practical and evidence-based.
- Avoid invented spiritual cleansing instructions.
- Avoid unsupported warnings.
- State ordinary stability where no unusual precaution applies.

---

## Related Stones

Always exactly 4 related stones in 2 groups:

| Group | Label | Count |
|---|---|---|
| Left card | Similar Energy | 2 stones |
| Right card | Pairs Well With | 2 stones |

Each stone has: slug (for href and dot class), name, reason, dot gradient CSS class.
Reasons must avoid stone-name repetition. Use "this stone", "the emphasis here", etc.

---

## Navigation

| Field | Rule |
|---|---|
| `NAV_PREV_SLUG` | Slug of the previous encyclopedia entry. |
| `NAV_PREV_NAME` | Display name of the previous entry. |
| `NAV_NEXT_SLUG` | Slug of the next encyclopedia entry. |
| `NAV_NEXT_NAME` | Display name of the next entry. |

---

## Stone-Name Repetition Control

Do not repeatedly begin nearby paragraphs, rows, cards, or notes with the stone name. The first clear mineral-identity sentence may use the canonical stone name when doing so improves clarity or precision. Avoid forced alternatives such as "this material" when the name is the clearest construction.
The `Use When` field must begin with the situation, not with "Reach for [Stone] when…".

See `EDITORIAL-RESEARCH-STANDARDS.md` §Stone-Name Repetition Control for the full 10-rule set.

---

## Sidebar Navigation

The sidebar nav label for the top anchor reads `Introduction`.
The `href` remains `#top`. Do not change either.
