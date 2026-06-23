# Still Point Lapidary — Encyclopedia Production

## Required Instructions
@docs/encyclopedia/enc-editorial-schema.md
@docs/encyclopedia/EDITORIAL-RESEARCH-STANDARDS.md
@docs/encyclopedia/APPROVED-SOURCE-HIERARCHY.md

## Canonical Source Documents
These five files are the authoritative sources for all encyclopedia production. Read them when beginning any page, template, or schema work.

| File | Authority |
|---|---|
| `stones/citrine.html` | Approved visual and rendered DOM pilot — controls approved implementation |
| `docs/encyclopedia/CANONICAL-STONE-PAGE-TEMPLATE.html` | Reusable HTML/CSS architecture — controls DOM/CSS structure for all pages |
| `docs/encyclopedia/enc-editorial-schema.md` | Field rules, counts, and editorial constraints |
| `docs/encyclopedia/EDITORIAL-RESEARCH-STANDARDS.md` | Research, evidence, claim, and writing standards |
| `docs/encyclopedia/enc-architecture-contract.md` | Locked structural and responsive contract |

**Authority boundaries:**
- `citrine.html` controls approved visual implementation
- The canonical template controls reusable DOM/CSS structure
- The editorial schema controls fields and counts
- Production data (workbook/CSV) controls locked stone-specific values
- Approved research controls factual and metaphysical claims
- Older stone MD or HTML files do not override these canonical documents where they conflict

## Task-Specific Reference Files
- Navigation: `docs/encyclopedia/Stones Catalog with Previous - Next Slugs.csv`
- Random navigation: `stones/enc-nav.js`

## Production Workflow — Gates 0–7

All scaled encyclopedia production follows this gate sequence. Do not skip or reorder gates.

**Gate 0 — Catalog Data and Cohort Preflight**

- Establish and maintain the canonical master production workbook for all 333 stones.
- Load all currently available structured production data.
- Validate stable IDs, canonical names, exact slugs, tiers, material types, controlled vocabularies, navigation, and other available global fields.
- Flag unresolved, conflicting, or research-dependent values rather than inventing them.
- A research cohort may not proceed until its required Gate 0 inputs are complete or explicitly identified for resolution during research.

**Gate 1 — Cohort Research**

- Research cohorts generally contain approximately 10 stones.
- Research is conducted horizontally across the cohort by domain:
  1. geological, mineralogical, identity, formation, treatment, locality, and collector-market research
  2. metaphysical consensus, use cases, associations, and theme research
  3. Collector Notes, care, related stones, pairings, and market-confusion research
  4. normalization and evidence audit
- Do not draft MD until the cohort research packet has been normalized and reviewed.

**Gate 2 — Canonical MD Drafting**

- Lyra or Claude Chat drafts canonical MD in batches of no more than 5 stones.
- Claude Code does not conduct editorial research or independently draft canonical MD.

**Gate 3 — MD Review and Approval**

- Dustin or Christie reviews and explicitly approves canonical MD.
- No HTML generation may begin before approval.

**Gate 4 — Scripted HTML Generation and Technical Validation**

- Claude Code performs repository execution only.
- HTML generation uses the approved MD, locked production data, and canonical template.
- The canonical generator must be used once it exists and has been validated.
- Manual construction or patching of individual stone HTML is not the intended scaled workflow.
- Claude Code must report if the canonical generator is missing, incomplete, or unable to process the approved inputs.
- Claude Code makes no independent content decisions during generation.

**Gate 5 — Visual and Editorial QA**

- Dustin or Christie performs final visual and editorial QA.
- Lyra or Claude Chat may assist with implementation and content review.

**Gate 6 — Controlled Correction and Regeneration**

- Corrections must be made in the authoritative source: canonical MD, locked production data, generator, or template.
- Regenerate HTML after correction.
- Public MD and HTML must match before publication.

**Gate 7 — Publication**

- Publish the approved HTML.
- Verify the live page.
- Add the slug to `stones/enc-nav.js` only after the page is approved and publish-ready.
- Update production status and close the gate.

## Production Status Values

```
RESEARCH COMPLETE
MD DRAFT COMPLETE
GATE 0 NORMALIZATION PENDING
APPROVED FOR HTML
PUBLISHED
```

## Channel Roles

**Dustin / Christie**
- Project owner and final approval authority
- Approves structured production decisions, canonical MD, visual implementation, and publication

**Lyra — Editorial lead**
- MD drafting and research synthesis
- Compliance reporting
- Overlaps with Claude Chat on strategy, documentation, and editorial review

**Claude Chat**
- Strategy and editorial review
- Documentation and briefing
- MD drafting when needed
- Instructions and briefs for Claude Code

Only one assistant should own a cohort or stone's editorial cycle at a time.

**Claude Code**
- Repository inspection
- Approved file writes
- Scripts and generation
- Technical validation
- Commits and deployment when explicitly instructed
- Exact completion reporting

Claude Code is execution-only. It must not independently choose or invent claims, themes, chakras, Energetic Roles, pairings, localities, mineral identities, wording, or architecture.

Research and canonical MD drafting are out of scope for Claude Code unless explicitly authorized as a narrowly defined exception.

## Research Prerequisites

Before a cohort begins research:
- Consult the canonical master production workbook.
- Confirm the cohort's stable IDs and exact slugs.
- Confirm or flag tier, material type, chakra data, Energetic Role, image data, navigation, and exception status.
- Record the production-data version or snapshot used.
- Identify missing or contradictory inputs.

Non-standard materials must be flagged before drafting, including:
- rocks
- composites
- mineraloids
- organics
- synthetics
- treated materials
- disputed trade names
- mixtures sold under one market name
- materials requiring specialist nomenclature review

Do not force these entries through true-mineral assumptions.

## HTML Generation

Scaled HTML production is intended to be script-driven using a canonical generator.

Before generating HTML, Claude Code must confirm whether the canonical generator exists and is production-ready. When it exists, Claude Code runs it using: (1) approved canonical MD, (2) locked production data, and (3) the canonical template.

If no validated generator exists, report that as a prerequisite gap. Do not silently substitute manual HTML production as the permanent workflow.

## Standing Rules
- Never infer, fabricate, or silently substitute missing values.
- Stop and ask when required data is unavailable, unclear, or contradictory.
- Preserve approved public copy unless Christie explicitly authorizes a rewrite.
- Do not change existing HTML layout, styling, classes, spacing, or order.
- Use only sources allowed by `APPROVED-SOURCE-HIERARCHY.md`.
- Read the navigation CSV before assigning previous or next values.
- Never infer navigation order from memory or alphabetical sorting.
- Use the canonical Supabase encyclopedia image URL based on the stone slug.
- Do not claim PASS unless every required check was actually completed.
- Report exact files changed and exact fields added or modified.

## Session Preflight
Before any encyclopedia MD or HTML work:
1. Confirm these instructions are loaded.
2. State the exact task.
3. Confirm all five canonical documents have been consulted:
   - `docs/encyclopedia/CANONICAL-STONE-PAGE-TEMPLATE.html`
   - `docs/encyclopedia/enc-editorial-schema.md`
   - `docs/encyclopedia/enc-architecture-contract.md`
   - `docs/encyclopedia/EDITORIAL-RESEARCH-STANDARDS.md`
   - `docs/encyclopedia/APPROVED-SOURCE-HIERARCHY.md`
4. State which task-specific files will additionally be used.
5. Identify missing inputs.
6. Do not edit until preflight is complete.
