# Still Point Lapidary — Encyclopedia Architecture Contract

**Version:** 2026-06-22-canonical  
**Status:** LOCKED — Citrine pilot approved and published 2026-06-20. All architectural rules are canonical and apply to all subsequent production.  
**Post-lock amendment process:** All further amendments must follow §19 and include Christie's explicit approval. See amendment log in §19 for full history.  
**Supersedes:** All prior architecture documents, including `GOLD-STANDARD-STONE-PAGE.html` and any file named `*_NEW_FORMAT.*`

---

## 0. Status Sequence

This contract moves through three states. The current state is recorded above and must be updated as the project progresses.

1. **DRAFT** — under review, not yet used for production.
2. **PROVISIONALLY APPROVED FOR CITRINE PILOT** — Christie approved this contract as the basis for building the Citrine pilot page. *(completed 2026-06-19)*
3. **LOCKED** — Christie approved the rendered Citrine pilot 2026-06-20. The contract governs all subsequent production. Amendments follow §19. *(current state)*

<!-- ARCHITECTURE VERSION: 2026-06-22-canonical | Status: LOCKED | Hero: 3 sections | AtaGlance: 6 boxes | Icon path: VERIFIED — Gate 3 CLOSED -->

---

## Conflict Resolution Rule

When any file, template, or instruction conflicts with this document:

1. This contract wins.
2. Stop. Do not proceed by choosing a side silently.
3. Flag the conflict to Christie before generating anything.

If this contract itself is ambiguous, flag the ambiguity before writing copy or code.

---

## 1. Page Architecture Overview

Every encyclopedia entry page uses this exact section order, top to bottom:

1. Hero
2. At a Glance
3. Overview
4. Why People Reach For It
5. Energetic Themes
6. Mineral Profile
7. Collector & Curiosity Notes
8. Care & Cleansing
9. Related Stones
10. Previous / Random / Next Navigation
11. Bottom CTA

No sections may be added, removed, reordered, or renamed without a new approved version of this contract.

### 1.1 Two-Column Flex Stack Layout (canonical 2026-06-20)

The page sections listed in §1 must appear in that order in the document, in screen-reader reading order, and in the sidebar navigation and scroll-spy arrays. Desktop visual two-column layout is achieved via two independent flex stacks inside a single `.content-grid` container.

**Container:**
```css
.content-grid {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: stretch;
}
```

**Left stack** (`.content-stack-left`, `flex: 1`):
Overview · Why People Reach For It · Mineral Profile · Related Stones

**Right stack** (`.content-stack-right`, `width: 340px; flex: 0 0 340px`):
Energetic Themes · Collector & Curiosity Notes · Care & Cleansing

The two stacks are independent of each other. A card in one stack does not determine the vertical position of a card in the other. Unequal total stack heights are expected and acceptable.

**Care & Cleansing is a direct child of `.content-stack-right`**, positioned below Collector & Curiosity Notes. It is not a full-width section and does not appear outside the right stack.

**Responsive behavior** (`max-width: 1100px`): Both `.content-stack-left` and `.content-stack-right` apply `display: contents`, collapsing the stack wrappers and making all seven child sections direct participants in the `.content-grid` flex context. CSS `order` values then control the single-column reading sequence.

**Approved mobile order:**
```css
#overview { order: 1; }
#reach    { order: 2; }
#themes   { order: 3; }
#mineral  { order: 4; }
#notes    { order: 5; }
#care     { order: 6; }
#related  { order: 7; }
```

Sidebar navigation links and scroll-spy section-id arrays must follow this same sequence. The canonical scroll-spy array is:
`['hero', 'glance', 'overview', 'reach', 'themes', 'mineral', 'notes', 'care', 'related']`

---

## 2. Hero

The Hero is the first visible section of every page. It contains exactly the following elements, in this order:

### 2.1 Collection Label
- The public collection tier name, one of:
  - `Essentials`
  - `Shelf Builders`
  - `Collector Favorites`
  - `Rare Finds`
- Displayed subtly — small type, muted styling
- Value comes from the locked production workbook or CSV
- Must not be invented or approximated

### 2.2 Stone Name
- The canonical stone name from the locked roster
- Displayed as the primary heading

### 2.3 Signature Line
- One sentence, displayed directly beneath the stone name
- Unlabeled — no heading, no icon, no label prefix
- States the stone's memorable essence
- Must be specific to this stone — not a generic description that could apply to several stones
- Must be supported by the locked properties and research
- Must not repeat verbatim language from Best For, Use When, or Affirmation
- **Limit: 1 sentence, maximum 20 words**

### 2.4 Property Pills
- Exactly three pills
- One to three words each
- Values come from the locked production workbook
- Must not be invented during copy writing

### 2.5 Hero Content Sections
Exactly three sections, in this order.

> **PROVISIONAL LIMITS NOTICE:** The word and line limits below are provisional targets, not final. They are based on the recovery handoff's stated principles but have not yet been calibrated against a rendered page. After the Citrine pilot is built and visually reviewed, these limits will be adjusted to match actual rendered-line behavior at the approved desktop reference width, then locked per §19.

#### Visual Layout (locked 2026-06-19, refined 2026-06-19)
The three Hero content sections display as **three equal-width tiles in a single horizontal row** at desktop reference width — not a stacked vertical list. This references the pre-recovery row-tile visual treatment, with the tile count reduced from four to three (Pairs Well With and Primary Chakra removed per §2.6) and the remaining three tiles (Best For, Use When, Affirmation) retained in that horizontal format.

- Desktop: exactly 3 equal-width tiles in one row
- Narrower breakpoint: stack to exactly 1 column (3 tiles, full width, vertically stacked)
- **Do not introduce a 2+1 wrapped intermediate state.** The layout is binary — 3-across or fully stacked — unless the Citrine pilot visual review later demonstrates that a wrapped state is genuinely preferable, in which case it must be confirmed by Christie and added to this contract before use on any other stone.
- Tile content order remains Best For → Use When → Affirmation at both states

#### Best For
- Describes the practical use case or intention category
- **Up to 20 words**
- Begins with a gerund (e.g., "Focusing intentions…") or a noun phrase — not a full sentence with a subject
- Must not duplicate Affirmation or Use When language

#### Use When
- Describes the circumstances or inner state that makes reaching for this stone appropriate
- **Up to 25 words**
- May use full sentences
- Must not duplicate Best For or Affirmation language

#### Affirmation
- A first-person present-tense statement
- **Provisional limit: 1 sentence, maximum 15 words**
- Must be specific to this stone's central theme
- Must not be a generic affirmation applicable to any stone

### 2.6 Hero: What Is Absent
The following elements must never appear in the Hero:

- Known For section
- Pairs Well With tile
- Primary Chakra tile
- Four-tile Hero layout *(a row containing Pairs Well With or Primary Chakra alongside the three approved sections — not to be confused with the approved three-tile row format defined in §2.5)*
- Any At a Glance data embedded in the Hero
- Any section beyond Best For, Use When, and Affirmation

---

## 3. At a Glance

The At a Glance section contains exactly six boxes, in this order:

| Box | Field | Notes |
|---|---|---|
| 1 | Energetic Role | One to three words; the stone's defining energetic function — leads the panel as the clearest immediate statement of the stone's energetic identity |
| 2 | Chakra | See §3.1 for display rules |
| 3 | Element | Locked value from workbook |
| 4 | Planet | Locked or defensible value only — do not invent |
| 5 | Zodiac | One or two signs; locked or defensible value only |
| 6 | Color Energy | Reflects the stone's visual and energetic color identity |

> **Order revised 2026-06-19** (Christie). Previous order was Chakra, Element, Planet, Zodiac, Energetic Role, Color Energy. Rationale: Energetic Role leads as the clearest immediate statement of the stone's energetic identity; Chakra follows as its primary energetic center; then the broader elemental and celestial correspondences; Color Energy closes the panel. See Amendment Log, §19.

### 3.1 Chakra Display Rules
- Display the primary chakra prominently
- When secondary chakras exist, display them below in smaller type using the format: `Also: Root · Sacral`
- When no secondary chakra exists, display only the primary
- Clear Quartz uses `All Chakras` as its categorical value; the styling chakra is Crown
- Do not add a third tier of chakras unless explicitly locked in the production workbook

### 3.2 At a Glance: What Is Absent
The following fields must never appear in At a Glance:

- Primary Themes
- Formation
- Hardness
- Color Range
- Any field not listed in §3 above

### 3.3 Invented Values Are Forbidden
Do not assign a Planet, Zodiac, Energetic Role, or Color Energy value to fill a box. If a value is not locked or defensible from the approved source set, flag it to Christie before proceeding.

Exception: Christie has delegated routine planetary assignment to Lyra when the value is defensible from the approved source set and no meaningful conflict exists. Lyra must stop and flag Christie before assigning a planet when: approved sources materially conflict; support is weak or absent; multiple substantially different values are equally defensible; the assignment would change an existing locked production value; or the choice has unusual catalog-wide, architectural, or identity implications. Christie retains final authority and may revise any assignment.

### 3.4 At a Glance Source Rule
All six values must be locked in the production workbook before MD approval. Missing values must be researched and approved, never invented during writing.

Planet values may be locked by Lyra without separate Christie approval when the value meets the delegation criteria in §3.3.

---

## 4. Overview

- Exactly two paragraphs
- No heading beyond the section label `Overview`
- **Order is locked: metaphysical first (P1), mineral second (P2). Do not revert under any circumstances.**

### Paragraph 1 — Metaphysical Identity
Cover:
- Principal traditional associations
- How the main themes fit together
- Relevant nuance or common misconceptions
- Treatment or naming implications when they affect metaphysical understanding

### Paragraph 2 — Physical and Mineralogical Identity
Cover, as relevant to the stone:
- What the material actually is (mineral, rock, mineraloid, variety, trade name, composite, synthetic, or organic)
- Appearance, color, and formation
- Treatments, trade-name issues, or authenticity distinctions
- The most important distinguishing physical facts

**P2 rule:** Must not open with the stone name. Open with a descriptive noun phrase (e.g., "A sodium-rich aluminosilicate mineral best known for..." not "Sodalite is a sodium-rich...").

### Overview Rules
- Supports the Signature Line; does not repeat it verbatim
- Does not repeat facts that belong exclusively to the Mineral Profile
- Does not contain bullet points or subheadings
- Preserves specific, interesting geology, naming nuance, and treatment context — do not flatten to generic prose
- **Up to approximately 120 words per paragraph.** There is no minimum beyond exactly two substantive paragraphs that fulfill their assigned jobs (§4 Paragraph 1 and Paragraph 2).

---

## 5. Why People Reach For It

- Exactly five rows
- Each row has a short heading and one to two sentences of explanation
- Headings describe practical intentions or use cases
- Copy is specific and actionable — not generic affirmation language
- **Limit per row: up to 30 words of body copy**
- Rows must be distinct from one another and from Best For / Use When

---

## 6. Energetic Themes

### Structure
- 1 or 2 Primary themes, evidence-supported. At least 1 required.
- 0, 1, or 2 Secondary themes, evidence-supported. If 0: remove entire Secondary group including divider and label.
- 1 or 2 Occasional associations, only when supported by the approved source set
- 0 Occasional associations is acceptable; do not invent to fill the pattern

### Theme Descriptions
- Primary and Secondary themes each have a heading and a description paragraph
- **Limit: 3 visual lines at desktop reference width per Primary or Secondary description**
- Occasional associations are listed as labeled pills only — no description paragraphs
- Theme placement must follow the evidence confidence levels from the synthesis workbook

### What Is Absent
- No fourth Primary or Secondary theme
- No Occasional association without source support
- No theme invented to create variety

---

## 7. Mineral Profile

- Formation: 2–3 sentences covering geological environment, crystal system, chemical composition, and color origin. **Geology only — no treatment disclosures, authenticity warnings, or imitation notes in Formation.**
- Collector's Guide: M1 (quality), M2 (identification), M3 (market) always required; M4 (locality variations) and M5 (physical handling) optional — include only when content earns its place. Treatment disclosures and authenticity warnings belong in M2, not in Formation.
- Major localities listed (bulleted list is acceptable here)
- Standard facts table: Mineral Family · Chemical Formula · Crystal System · Mohs Hardness · Cleavage · **Specific Gravity** · Luster · Transparency (labels adaptable for non-minerals — see `enc-editorial-schema.md`)
- Piezoelectricity or other relevant physical properties included when they apply
- **Mineral facts must not be repeated across Mineral Profile and Overview** unless the angle is genuinely different
- Technical framing: physical properties are presented as physical properties, not as proof of metaphysical claims

---

## 8. Collector & Curiosity Notes

- **3 or 4 notes.** Publish 4 when all four are distinct and strong. Publish 3 when the fourth note is weak, repetitive, or creates poor balance — remove the fourth `.note-row` block cleanly. Fewer than 3 strong notes must not be published; return to research.
- Each note has a short heading and a body paragraph
- Notes cover distinct topics — no two notes on the same subject
- **Word limit: up to 55 words per note**
- Notes may cover: historical naming, cultural context, scientific discovery, geological curiosity, authenticity or trade-name history, collector distinctions, notable specimens or localities
- Notes must be accurate and sourced; do not fabricate curiosities

---

## 9. Related Stones

### Structure
- Exactly 2 Similar Energy entries
- Exactly 2 Pairs Well With entries
- All 4 entries must be different stones

### Per Entry
- Stone name and slug
- A reason statement explaining the relationship or distinction
- **Reason word limit: 30 words maximum**
- Slugs must be confirmed against the live stone roster before approval
- Paired stones must exist on the site

---

## 10. Navigation

- Previous stone: name and slug
- Next stone: name and slug
- Navigation values come from the locked production workbook
- Slugs must be verified before HTML generation
- Do not add any slug to `stones/enc-nav.js` until the page passes visual approval

---

## 11. Image Behavior

The stone image is placed within the Hero section alongside the Hero content.

### Required Behavior
- The image must remain fully contained within its intended photo frame
- No uncontrolled zooming or dominant cropping
- No distortion at any breakpoint
- The frame must feel visually balanced with the Hero text content

### Prohibited
- `object-fit: cover` used without visual testing and Christie approval
- Any image CSS locked before Christie approves a rendered example

### Testing Required
Image behavior must be verified at three breakpoints before template approval:
- Desktop (reference width TBD at pilot review)
- Tablet
- Mobile

---

## 12. Icons and Icon Asset Architecture

Icons are assigned per section using the approved 57-icon system.

### 12.1 Fixed Page Component Icons (from icon map v1.0)

| Section or Component | Icon Name |
|---|---|
| Best For | `best-for` |
| Use When | `todays-practice` |
| Pairs Well With (Related Stones) | `pair-with` |
| Save to Collection | `add-piece` |
| Add to Wishlist | `wishlist` |
| At a Glance (section) | `encyclopedia` |
| Overview | `book-reference` |
| Why People Reach For It | `target-bullseye` |
| Mineral Profile | `geology` |
| Related Stones (section) | `stones-row` |
| Energetic Themes | `upward-spark` |
| Collector & Curiosity Notes | `bookmark` |
| Care & Cleansing | `care-cleansing` — SVG: `https://vxujlgyhgnihnqrxzefw.supabase.co/storage/v1/object/public/stone-images/icons/encyclopedia/care-cleansing.svg` |

### 12.2 At a Glance Icon Assignments

| Box | Icon Source | Notes |
|---|---|---|
| Energetic Role | **dynamic** — resolved from the stone's locked Energetic Role value | see §12.3 |
| Chakra | existing approved Chakra icon (`chakra`) | static |
| Element | existing approved Element icon (`element`) | static |
| Planet | `celestial.svg` | static |
| Zodiac | existing approved Zodiac icon (`zodiac`) | static |
| Color Energy | `color-range.svg` | static — see §12.4 on reassignment |

> **Table order revised 2026-06-19** to match the §3 box order. Icon assignments themselves are unchanged — only the row order in this table was updated for consistency.

### 12.3 Energetic Role — Dynamic Icon Resolution

The Energetic Role box label always reads "Energetic Role." Only the displayed icon changes, resolved from the stone's single locked Energetic Role value.

| Locked Energetic Role Value | Icon Slug |
|---|---|
| Grounding | `grounding.svg` |
| Protection | `protection.svg` |
| Vitality | `vitality.svg` |
| Heart Healing | `heart-healing.svg` |
| Calm & Peace | `calm-peace.svg` |
| Emotional Regulation | `emotional-regulation.svg` |
| Clarity & Focus | `clarity-focus.svg` |
| Intuition | `intuition.svg` |
| Spiritual Connection | `spiritual-connection.svg` |
| Transformation | `transformation.svg` |
| Manifestation | `manifestation.svg` |
| Amplification | `amplification.svg` |

This table reflects all 12 approved Energetic Role values. If a stone's locked Energetic Role value does not appear in this table, **stop and flag to Christie** — do not generate a new icon and do not substitute a near-match icon silently.

Do not generate new icons for Planet, Energetic Role, or Color Energy. The existing approved icon set covers all three fields.

### 12.4 Color Energy — Reassigned Asset, Not a New Icon

Important distinction:
- The **old `Color Range` architecture field** (formerly part of a 7-box At a Glance) is deprecated and forbidden — see §3.2 and §14.
- The **existing `color-range.svg` artwork** is retained and reassigned to the new `Color Energy` box.
- This is an icon reuse, not new icon creation. Do not modify the physical SVG file to perform this reassignment — the mapping layer (§12.6) handles it.

### 12.5 SVG Storage Architecture

Approved SVG icon files are stored as external assets in Supabase rather than duplicated as inline SVG markup across every encyclopedia page.

**Purpose:**
- Allows icons to be replaced later without rewriting all stone HTML files
- Keeps one canonical asset per icon
- Avoids inconsistent copied SVG markup across pages
- Preserves caching and centralized asset management

**Verified canonical structure** (confirmed by Claude Code read-only repository inspection):

```text
Supabase bucket:
stone-images

Path:
icons/encyclopedia/{icon-slug}.svg
```

**Examples:**

```text
icons/encyclopedia/celestial.svg
icons/encyclopedia/color-range.svg
icons/encyclopedia/amplification.svg
icons/encyclopedia/grounding.svg
icons/encyclopedia/protection.svg
```

**Verified canonical public URL pattern:**

```text
https://vxujlgyhgnihnqrxzefw.supabase.co/storage/v1/object/public/stone-images/icons/encyclopedia/{icon-slug}.svg
```

**Confirmed via Claude Code read-only repository inspection (Gate 3 — CLOSED):**
- Local SVG source files live at `assets/SVGs/{icon-slug}.svg`
- The centralized icon mapping layer is `stones/enc-icons.css`
- Published stone pages already link `enc-icons.css`
- CSS masking with `mask-image` and `-webkit-mask-image` is already implemented and verified in production (see §12.7)
- All 14 required At a Glance and Energetic Role icon slugs already exist
- No new SVG upload is required for the Citrine pilot

### 12.6 Centralized Icon Mapping Layer (Architecture Behavior)

The HTML template must reference icon URLs through a centralized mapping layer rather than hard-coding full URLs separately in every card.

**Verified:** This mapping layer already exists in production as `stones/enc-icons.css`. Published stone pages already link this file. The pattern below describes its required behavior; it does not need to be built from scratch.

**Required pattern:**
- A canonical icon slug is stored per field in the icon map (not a full URL)
- The base Supabase icon path is defined once, in one place
- HTML or CSS resolves the full URL from the slug at render time
- Energetic Role resolves its slug dynamically from the stone's locked role value (§12.3)
- Missing or invalid icon mappings must **fail visibly during validation** — surfaced as an error to catch before publication, never silently substituted or left blank

**Prohibited:**
- Embedding raw SVG source separately into every stone page, unless a documented technical reason is discovered during the Citrine pilot (e.g., a caching or rendering limitation that requires inline SVG). Any such exception must be documented in this contract before it becomes standard practice.
- Hard-coding full Supabase URLs per card instead of resolving through the slug + base-path pattern

### 12.7 External SVG Rendering — Color Inheritance

The approved SVG icons use `stroke="currentColor"`, which means their color is meant to inherit from the surrounding CSS context (e.g., the chakra or theme color of the card they sit in). A plain `<img>` element pointing at an externally hosted Supabase SVG **cannot** inherit CSS `color` this way — the SVG will render in whatever color it was authored with, fixed, regardless of card context.

**CSS masking is the verified production implementation** for externally hosted icons, confirmed already live in `stones/enc-icons.css`. It preserves both centralized external assets and correct color inheritance:

```css
.icon {
  width: 24px;
  height: 24px;
  background-color: currentColor;
  mask-image: var(--icon-url);
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-image: var(--icon-url);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
}
```

The `--icon-url` custom property is set per-icon from the resolved slug + base path (§12.6), keeping the mapping layer centralized while letting `currentColor` — and therefore the surrounding chakra or theme color — control the rendered icon color.

**A plain `<img src="...">` implementation must not be substituted for the verified masking implementation** without a documented technical reason and Christie's approval.

### 12.8 Icon Gaps and Deprecated Assignments

**Deprecated — must not be used as icon assignments for any current field:**

| Old Assignment | Icon Name | Disposition |
|---|---|---|
| Known For | `star` | Deprecated — section no longer exists |
| Primary Themes | `tag-label` | Deprecated — field no longer in At a Glance |
| Hardness | `crystal-single` | Deprecated — field no longer in At a Glance |
| Color Range (old field) | `color-range` | **Field deprecated; artwork reassigned** — see §12.4 |

**Do not guess or invent icon names.** Flag missing or ambiguous icon assignments to Christie before HTML generation.

### 12.9 No-Icon Areas
Sidebar links, Previous/Random/Next navigation, theme pills, occasional-association pills, individual mineral fact rows, bottom CTA, and footer carry no icons.

---

## 13. Content Depth Principle

### Compact Fields
The following fields must fit their visual component without overflow. Write to the word or line limit, not to the limit of what could be said:

- Signature Line (20 words max)
- Property pills (1–3 words each)
- Best For (up to 20 words)
- Use When (up to 25 words)
- Affirmation (15 words max — **provisional**, subject to recalibration after Citrine pilot; see §2.5)
- All six At a Glance values (1–4 words each)
- Why People Reach For It row copy (up to 30 words per row)
- Energetic Theme descriptions (3 visual lines per Primary or Secondary)
- Related Stone reasons (30 words max)

### Rich Fields
The following fields must preserve specific, useful, and interesting content. Do not flatten to generic fragments to solve a layout problem:

- Overview (both paragraphs)
- Mineral Profile (formation paragraph and lower note)
- Treatments, trade names, and authenticity distinctions
- Collector & Curiosity Notes
- Geological identity and formation context
- Distinctive metaphysical nuance and misconception corrections

**The correct response to a layout problem is to fix the layout or the specific overlong copy — not to strip rich sections of their useful content.**

---

## 14. Forbidden Elements

The following must never appear on any encyclopedia page:

- Known For section
- Four-tile Hero layout
- Pairs Well With as a Hero tile
- Primary Chakra as a Hero tile
- Seven-box At a Glance layout
- Primary Themes in At a Glance
- Formation in At a Glance
- Hardness in At a Glance
- Color Range as an At a Glance field (the `color-range.svg` artwork itself is retained and reassigned to Color Energy — see §12.4)
- Any placeholder text in a published file
- Research notes in any public-facing section
- Source attribution in public copy
- Medical claims of any kind
- Unsupported metaphysical claims presented as fact

---

## 15. Vocabulary Rules

- Do not describe metaphysical properties as scientifically proven
- Do not cite piezoelectricity or other physical properties as evidence of metaphysical effects
- Do not use language that implies diagnostic, therapeutic, or medical benefit
- Framing such as "traditionally associated with" or "used in crystal traditions for" is acceptable
- "Programmability" claims should be reframed as intention-setting and sustained attention
- Broad healing claims must be omitted or reframed
- Physical properties and metaphysical associations must not be conflated in the same sentence

---

## 16. Validation Gates

### Gate 1 — Before MD Drafting Begins
All of the following must be locked in the production workbook:

- [ ] Collection label
- [ ] Stone name and slug
- [ ] Primary chakra
- [ ] Secondary chakras (or confirmed absent)
- [ ] Element
- [ ] Planet (locked by Christie or by Lyra under the §3.3 delegation rule)
- [ ] Zodiac
- [ ] Energetic Role
- [ ] Color Energy
- [ ] Three property pills
- [ ] Image URL
- [ ] Previous and next navigation slugs
- [ ] Approved pairings and paired-stone slugs

### Gate 2 — Before MD Is Submitted for Approval
All of the following must pass:

- [ ] Signature Line: 1 sentence, ≤20 words, specific to this stone
- [ ] Property pills: exactly 3, from locked values
- [ ] Best For: ≤20 words, gerund or noun phrase opening
- [ ] Use When: ≤25 words
- [ ] Affirmation: 1 sentence, ≤15 words, first-person present tense
- [ ] At a Glance: exactly 6 boxes, all values from locked workbook
- [ ] Overview: exactly 2 paragraphs; P1 physical, P2 metaphysical
- [ ] Why People Reach For It: exactly 5 rows, each distinct
- [ ] Energetic Themes: 1–2 Primary (at least 1 required), 0–2 Secondary, 0–2 Occasional — all evidence-supported
- [ ] Mineral Profile: formation paragraph + lower note + localities
- [ ] Collector & Curiosity Notes: 3 or 4 notes, each ≤55 words
- [ ] Related Stones: exactly 2 Similar Energy, exactly 2 Pairs Well With, all 4 different
- [ ] Related Stone reasons: ≤30 words each
- [ ] No Known For section present
- [ ] No placeholder text present
- [ ] No research notes in public sections
- [ ] No medical claims
- [ ] No unsupported metaphysical claims stated as fact

### Gate 3 — Before HTML Generation Begins
- [ ] Christie has explicitly approved the MD in writing
- [ ] The canonical HTML template version token matches this contract's version
- [ ] No stale template files are present in the working session
- [x] Supabase icon path verified — `icons/encyclopedia/{icon-slug}.svg` in the `stone-images` bucket, confirmed via Claude Code read-only repository inspection (see §12.5). **CLOSED.**
- [ ] All required icon assets for this stone exist at the verified path, including the dynamically resolved Energetic Role icon *(verification confirmed all 14 At a Glance and Energetic Role slugs already exist; per-stone confirmation still applies at MD approval)*

### Gate 4 — Before Publication
- [ ] Visual review passed at desktop, tablet, and mobile
- [ ] Image is contained and balanced — no dominant cropping or distortion
- [ ] All card heights are visually balanced at desktop
- [ ] No placeholder text remains in any section
- [ ] All navigation slugs verified against live roster
- [ ] All pairing slugs verified against live roster
- [ ] Christie has explicitly said "approved to publish" in writing
- [ ] Slug added to `stones/enc-nav.js` only after this gate passes

---

## 17. Role Assignments

### Christie
- Approves all locked production values before MD drafting
- Approves MD before HTML generation
- Approves rendered HTML visually before publication
- Is the only person who can declare a template canonical or a page approved to publish

### Lyra
- Synthesizes research and drafts MD copy
- Edits copy to component-specific limits defined in §13
- Must receive this contract and the icon map at the start of every production session
- Must not generate HTML
- Must not make architecture decisions
- Must not proceed when a field limit is unclear — stop and flag to Christie
- Must review actual file content, not delivery reports alone

### Claude Code
- Builds HTML template from locked specification after Christie approval
- Populates HTML from approved MD (token substitution only)
- Handles repository operations (enc-nav.js, commit, push) after Gate 4 passes
- Must flag any MD field that appears to exceed its limit rather than silently trimming
- Makes no editorial decisions during HTML build

### Claude Chat
- Systems review, architecture drafting, and editorial questions between sessions
- Does not choose architecture, decide content depth, or rewrite approved copy without explicit instruction

---

## 18. Stale Files — Do Not Use

The following files are deprecated and must not be used as architecture sources:

- `GOLD-STANDARD-STONE-PAGE.html`
- `citrine_FINAL.html`
- `selenite_FINAL.html`
- `black-tourmaline_FINAL.html`
- Any file named `*_NEW_FORMAT.html`
- Any file named `*_NEW_FORMAT.md`
- Any HTML using a Known For section
- Any HTML using a four-tile Hero
- Any HTML using a seven-box At a Glance

---

## 19. Version and Amendment Process

This contract follows the three-state sequence defined in §0: DRAFT → PROVISIONALLY APPROVED FOR CITRINE PILOT → LOCKED.

**To move from DRAFT to PROVISIONALLY APPROVED FOR CITRINE PILOT:**
1. Christie reviews this contract and the editorial schema
2. Christie confirms the architecture, icon assignments, and provisional Hero limits are acceptable as a basis for building the pilot
3. Update the Status field to `PROVISIONALLY APPROVED FOR CITRINE PILOT`
4. Proceed to build the Citrine pilot HTML

**To move from PROVISIONALLY APPROVED FOR CITRINE PILOT to LOCKED:**
1. Complete the Citrine pilot HTML
2. Christie approves the rendered page, including Hero copy line behavior at actual desktop/tablet/mobile widths
3. Calibrate §2.5 Hero limits from provisional to final based on what the rendered pilot actually required
4. Update the version token to the approval date
5. Update the Status field to `LOCKED`
6. Reconcile `enc-editorial-schema.md` to match any changes made during the pilot
*(This step was completed 2026-06-20 — see amendment log and current Status field)*

**To amend a LOCKED contract:**
1. Christie identifies the change needed
2. The change is made to this document
3. The version token is updated (e.g., `2026-07-01`)
4. The editorial schema is updated to match
5. All AI assistants receive the updated contract at the start of their next session
6. Previously approved MDs do not need to be regenerated unless the change affects their content

### Amendment Log

| Date | Change | Section(s) | Authorized by |
|---|---|---|---|
| 2026-06-19 | Locked Hero tile visual layout (3 equal-width tiles in a horizontal row at desktop) | §2.5, §2.6 | Christie |
| 2026-06-19 | Locked section DOM-order rule: Overview through Related Stones must share one DOM order across all breakpoints, screen readers, and scroll-spy; desktop two-column layout via CSS Grid placement only, `order` property prohibited. *(Superseded by 2026-06-20 canonical consolidation — see final entry)* | §1.1 | Christie, instruction drafted by Lyra |
| 2026-06-19 | Refined Hero wrap behavior: binary 3-across-or-fully-stacked only, no 2+1 intermediate wrap state, unless pilot review later justifies an exception | §2.5 | Christie, refinement proposed by Lyra |
| 2026-06-19 | Locked preferred desktop grid implementation as named `grid-template-areas` (specific CSS provided). *(Superseded by 2026-06-20 canonical consolidation — flex stacks replace grid-template-areas)* | §1.1 | Christie, implementation proposed by Lyra |
| 2026-06-19 | Revised At a Glance box order: Energetic Role, Chakra, Element, Planet, Zodiac, Color Energy (was: Chakra, Element, Planet, Zodiac, Energetic Role, Color Energy). Field values, icon assignments, and all other rules unchanged — display order only. | §3, §12.2 | Christie |
| 2026-06-19 | Right-rail vertical space distribution (closes pilot review item #5 — row-height balance). `.rail-card` made a flex column (`display: flex; flex-direction: column`). New `.rail-card-body` wrapper (`flex: 1; display: flex; flex-direction: column; justify-content: space-between`) holds all card content below `<h2>`, distributing leftover height evenly across tier groups or note rows instead of pooling at the bottom. For `#themes`: content grouped into three `<div class="theme-tier-group">` siblings (Primary, Secondary, Occasional), each a flex child receiving equal leftover space. For `#notes`: `.note-list` changed from `display: grid; gap: 8px` to `flex: 1; display: flex; flex-direction: column; justify-content: space-between`, distributing space across the 4 note rows. `<h2>` remains a direct child of `.rail-card`, outside `.rail-card-body`, and keeps its existing position and border-bottom. Applies to all future stone pages. | §6 (`#themes`), §8 (`#notes`) | Christie |
| 2026-06-19 | Replaced named `grid-template-areas` layout with two independent vertical flex stacks. `.content-grid` is now `display: flex; flex-direction: row; gap: 20px; align-items: flex-start`. Left stack (`.content-stack-left`, `flex: 1`): Overview, Why People Reach For It, Mineral Profile, Related Stones. Right stack (`.content-stack-right`, `width: 340px; flex: 0 0 340px`): Energetic Themes, Collector & Curiosity Notes, Care & Cleansing. Stacks are independent — a card in one stack never determines the vertical position of a card in the other. Unequal total stack heights are expected and acceptable. At `max-width: 1100px`, stacks flatten with `display: contents` and sections follow canonical mobile reading order via explicit CSS `order` values (1–7: Overview, Reach, Themes, Mineral, Notes, Care, Related). No fixed heights, balancing spacers, min-height values, or JS height matching are permitted. | §1.1 | Christie |
| 2026-06-19 | Layout and typography reset (locked canonical behavior). (1) Natural content flow: `align-items: stretch` removed from `.content-grid`; `flex: 1` and `justify-content: space-between` removed from `.rail-card-body` and `.note-list`. Each card sizes to its own content; right rail finishing above left column bottom is acceptable and expected. (2) Energetic Themes item spacing: consistent `margin-top: 16px` via `.theme-row + .theme-row`; section labels retain their existing top margin for visual grouping but no large empty zones between items. (3) Signature Line typography restored to `Georgia, serif; italic; 17px; weight 400`. (4) Care & Cleansing heading uses identical typography to all other rail card headings — `#care h2` size override removed. (5) Page-wide minimum body text size set to 14px (matching `.reach-desc`), applied to: `.glance-value`, `.theme-row p`, `.mineral-fact`, `.note-row p`, `#care .care-list`, `.stone-reason`. | §1.1, §2 (signature line), §3 (glance), §6 (themes), §7 (mineral), §8 (notes), §8a (care), §9 (related) | Christie |
| 2026-06-19 | Added Care & Cleansing as a permanent right-rail section. Section ID: `#care`. Grid area name: `care`. Position: right rail, below Collector & Curiosity Notes — `grid-template-areas` row added: `"related care"`. Icon: `icon-care-cleansing` (SVG at `icons/encyclopedia/care-cleansing.svg` in `stone-images` Supabase bucket; local source at `assets/SVGs/care-cleansing.svg`). Content rule: 3–4 items drawn from the stone's Mineral Profile care information only — no new editorial content; items are short and scannable, one line each. Sidebar nav: `<a href="#care">Care & Cleansing</a>` added after Collector Notes. Scroll-spy sections array updated to include `'care'` after `'notes'`. Mobile single-column `grid-template-areas` updated to include `"care"` after `"notes"`. Affirmation icon rule also added this session: Affirmation tile uses the stone's locked Energetic Role icon (canonical template uses `{{ENERGETIC_ROLE_ICON}}` placeholder). | §1.1 (grid), §8a (new section), sidebar nav, scroll-spy | Christie |
| 2026-06-19 | Care & Cleansing moved to full-width utility section. `#care` removed from `.content-stack-right` and placed as a direct sibling of `.content-grid`, immediately after its closing tag and before `.entry-nav-wrap`. CSS: `#care { margin-top: 16px; }` added; `#care { order: 6; }` removed from the mobile responsive block (section is outside `.content-grid` so `order` has no effect). `.rail-card` styling retained as-is — the card renders full-width in the document flow. `#related` mobile order value updated from 7 to 6. Care & Cleansing is not part of either stack and carries no `grid-area` assignment. *(Superseded by 2026-06-20 canonical consolidation — Care & Cleansing is confirmed inside .content-stack-right)* | §1.1, §8a | Christie |
| 2026-06-20 | Canonical architecture reconciliation and lock. Replaces §1.1 body entirely with the approved two-column flex-stack implementation. All earlier conflicting §1.1 rules are superseded, including: named `grid-template-areas` as preferred implementation (2026-06-19); prohibition on CSS `order` property (2026-06-19); full-width Care & Cleansing placement outside `.content-stack-right` (2026-06-19). Confirms `#care` as a permanent direct child of `.content-stack-right`, below Collector & Curiosity Notes. Inserts Care & Cleansing as page section 8 in the §1 master list; Related Stones renumbered to 9; Previous / Random / Next Navigation to 10; Bottom CTA to 11. Updates contract version from `2026-06-19-provisional` to `2026-06-20-canonical` and status from PROVISIONALLY APPROVED to LOCKED, following Christie's approval of the Citrine pilot. | §0, §1, §1.1 | Christie |
| 2026-06-22 | Locked Formation field scope: Formation contains only geological formation information. Treatments, commercial processing, care, market practices, imitations, and collector guidance must not appear in the Formation paragraph. Natural color-producing processes may be included only when they are part of natural formation. | §7 | Christie |
| 2026-06-22 | Christie delegates routine planetary assignment to Lyra under defined criteria. Lyra must flag Christie when sources conflict, support is weak, multiple values are equally defensible, an existing locked value would change, or the assignment has catalog-wide implications. Christie retains final authority. | §3.3, §3.4, §16 Gate 1 | Christie |
| 2026-06-22 | Aligned §6 and §16 Gate 2 theme counts to schema evidence-based ranges: Primary 1–2 (at least 1 required), Secondary 0–2. Contract previously hard-coded exactly 2 Primary and exactly 2 Secondary. Schema controls field counts; contract now matches. | §6, §16 | Christie |
| 2026-06-22 | Removed word-count floors from all prose fields. Only ceilings remain. Affected: Collector Notes (≤55 words), Why People Reach For It rows (≤30 words), Hero Best For (≤20 words), Hero Use When (≤25 words), Overview (≤~120 words per paragraph). Rationale: natural brevity is preferable to padded copy. | §2.5, §4, §5, §8, §13 | Christie |
| 2026-06-27 | Corrected §4 Overview paragraph order. P1 is now Metaphysical Identity; P2 is Physical and Mineralogical Identity. Added locked-order rule and P2 must-not-open-with-stone-name rule. Prior §4 had the paragraphs in reverse order (physical first, metaphysical second), which contradicted `enc-editorial-schema.md` and `EDITORIAL-RESEARCH-STANDARDS.md`. | §4 | Christie |
| 2026-06-27 | Updated §7 Mineral Profile: Formation is now 2–3 sentences, geology only (no treatment or authenticity content). Collector's Guide updated to M1–M5 model with M4 and M5 optional. Standard facts table now uses Specific Gravity in position 6 (was Fracture). Treatment disclosures and authenticity warnings locked to M2. | §7 | Christie |
| 2026-06-27 | Corrected §8 Collector & Curiosity Notes count from "Exactly 4" to "3 or 4." Publish 4 when all four are strong; publish 3 when the fourth is weak or repetitive. Aligned to `enc-editorial-schema.md` which already specified 3 or 4. | §8 | Christie |
| 2026-06-19 | Hero photo fit and frame confinement. Stone photo `object-fit` changed from provisional `contain` to locked `cover`, approved by Christie after visual review of the Citrine pilot (matches established treatment on prior pages like Clear Quartz). `object-position` defaults to `center`, overridable per-stone via `--stone-photo-position` (e.g., `#hero .stone-photo-wrap { --stone-photo-position: center 30%; }`) without editing this file or the canonical template. Concurrently fixed: the global `styles.css` rule (line 1821: `.enc-hero { position: relative; overflow: hidden; }`) was causing the stone photo to bleed outside `.stone-photo-wrap` into the Hero content area when the stone page reset `.enc-hero` to `position: static; overflow: visible` — removing the containment context `.stone-photo-wrap` was implicitly relying on. Resolved with a scoped reset confined to `.enc-hero .stone-photo-wrap`: added `position: relative; isolation: isolate; overflow: hidden` on the wrapper; added `position: static; inset: auto; transform: none; max-width: none` on the img; added `position: relative; z-index: 1` on `.hero-right`. | §2, photo frame | Christie |

---

*Contract locked 2026-06-20. Prepared from Citrine pilot review — June 19–20, 2026.*
