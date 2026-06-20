# Master Stone Page Contract v1.1

## Source of Truth
- Approved MD is the source of truth.
- HTML is generated only from approved MD.
- Never invent navigation, chakra hierarchy, image paths, related stones, pairings, URLs, or slugs.

## Navigation
- Copy exact previous/next names and slugs from the approved CSV.
- Do not calculate, infer, reorder, or alphabetize independently.
- Stop if a stone is missing.

## Random
- Random behavior lives only in `stones/enc-nav.js`.
- Individual pages contain no custom random logic.
- Random excludes the current stone.
- Add a slug only after its HTML is approved and publish-ready.

## Images
Use:
`https://vxujlgyhgnihnqrxzefw.supabase.co/storage/v1/object/public/stone-images/encyclopedia/{stone-slug}.webp`

Rules: lowercase canonical slug, `.webp`, no numbering, no alternate filename.

## Chakras
- Exactly one Primary Chakra.
- Clear Quartz may use `All Chakras` as one categorical value.
- Store Secondary Chakras separately.
- Styling Chakra ordinarily matches Primary Chakra.
- Clear Quartz uses Styling Chakra `Crown`.

### HTML Display
- Hero identity tile label: `Primary Chakra`
- Hero tile value: approved Primary Chakra only
- Do not display Secondary Chakras in the Hero
- Clear Quartz may display `All Chakras` as its single categorical value
- At a Glance label is always `Chakras`
- Never change the At a Glance label to `Chakra`, even when only one chakra is displayed
- At a Glance value: complete approved chakra set, with Primary first and Secondary values following
- If Secondary Chakras is `None`, display the Primary Chakra only
- Clear Quartz displays `All Chakras`
- Do not add a separate Secondary Chakras glance item
- Do not inspect another stone page to infer the chakra label or display pattern
- Do not change grid counts, shared CSS, or shared JavaScript

## Related Stones
Required:
- 2 Similar Energy
- 2 Pairs Well With
- all 4 unique
- canonical name and slug
- one-sentence reason
- no overlap
- each reason should target approximately 3 visual lines at the approved desktop reference width
- 30 words maximum per reason

## Mineral Identity and Relationships

Every entry must accurately identify what the subject physically is and how it relates to broader mineral families, species, varieties, trade names, rocks, mineraloids, composite materials, organic materials, volcanic glasses, or man-made materials.

Each catalog stone may retain its own encyclopedia page.

Overview paragraph 1 must establish the subject's physical identity and relevant relationship immediately. It must not present a variety, trade name, commercial identity, rock, composite, or manufactured material as though it were a separate mineral species.

Relationships that must be stated clearly when applicable:
- mineral variety of a broader species
- trade name for another mineral or material
- patterned or included variety
- rock composed of multiple minerals
- volcanic glass
- organic material
- composite material
- man-made glass or manufactured material

### Overview Structure
1. Paragraph 1: physical identity, including the relevant relationship
2. Paragraph 2: metaphysical identity, themes, nuance, and misconceptions

### Sibling Pages
When closely related encyclopedia entries exist:
- the parent or broad page explains the mineral family or material comprehensively
- the variety or trade-name page includes only enough shared geology to establish identity; the remainder focuses on what is visually, historically, commercially, mineralogically, or traditionally distinct
- sibling pages must not repeat the same family-level prose
- related pages should link to one another when those pages exist

## HTML
Preserve current layout, styling, classes, spacing, typography, section order, navigation cards, and related-stone cards.

Public copy must satisfy the approved visual-fit limits. Approved MD remains canonical, but verbose draft wording may be editorially tightened before final MD approval. Do not transfer research-note length or legacy wording into HTML merely for exact textual parity.

Do not shrink typography, expand cards, reduce spacing, clip copy, add internal scrollbars, or use page-specific spacing tricks to accommodate verbose content.

## Workflow
1. Create up to 5 MDs.
2. Review structure.
3. Review editorial/research content.
4. Approve MD.
5. Generate HTML.
6. Validate.
7. Add published slugs to `enc-nav.js`.

## Editorial Fit Limits
Validate at the approved desktop reference width:
- Best For: 3 visual lines preferred; 4 maximum
- Use When: 3 visual lines preferred; 4 maximum
- Known For: 3 visual lines ideal; 4 maximum
- Overview: exactly 2 paragraphs, approximately 5 visual lines maximum per paragraph
- Why People Reach For It: exactly 5 rows; 3 visual lines maximum per description
- Primary and Secondary Energetic Theme descriptions: 3 visual lines maximum
- Related Stone reasons: one sentence, 30 words maximum, 3 visual lines maximum
- Collector Notes: exactly 4; each note should be concise, distinct, and visually balanced; 35–55 words each with a 60-word hard maximum
- Mineral Profile: compact factual rows plus focused prose; no repeated technical content

## Common Localities Layout
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

Visual fit outranks inherited wording and raw word count. Maintain meaning and accuracy while rewriting for the approved component footprint.

## Desktop Column Alignment
On desktop, the main article column and the Collector & Curiosity Notes rail must end on the same horizontal baseline.

Required behavior:
- `.content-grid` stretches both columns
- the final card in the shorter column absorbs remaining height
- in the right rail, only the final `.rail-card` may stretch
- `Known For` and `Energetic Themes` must always remain natural height
- extra space may appear only inside that final card
- mobile layouts return to natural document flow

Forbidden alignment methods:
- spacer elements
- fixed card or column heights
- clipped content
- internal scrollbars
- smaller typography
- page-specific padding or margin hacks

Validate desktop alignment only after all public copy is final. Validate mobile separately.

### Approved CSS Pattern

```css
.content-grid {
  align-items: stretch;
}

.article-col,
.right-rail {
  height: 100%;
}

.article-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-col > .enc-card:last-child {
  flex: 1;
}

.right-rail {
  display: flex;
  flex-direction: column;
}

.right-rail > .rail-card:last-child {
  flex: 1;
}

@media (max-width: 980px) {
  .article-col,
  .right-rail {
    height: auto;
  }

  .article-col > .enc-card:last-child,
  .right-rail > .rail-card:last-child {
    flex: none;
  }
}
```
