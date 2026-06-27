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
- Production data and Supabase `enc_` tables control locked stone-specific values
- Approved research controls factual and metaphysical claims
- Older stone MD or HTML files do not override these canonical documents where they conflict

## Supabase Table Naming Convention
All encyclopedia content tables use the `enc_` prefix.

| Table | Purpose |
|---|---|
| `enc_stone_content` | Flat editorial fields per stone. Includes `collector_context_p1`–`p3` (always required) and `collector_context_p4`–`p5` (nullable, M4/M5 — omit INSERT when not used) |
| `enc_themes` | Repeating theme rows |
| `enc_collector_notes` | Repeating collector note rows |
| `enc_mineral_facts` | Mineral fact table rows |
| `enc_localities` | Locality list rows |
| `enc_related_stones` | Related stone pairings |
| `enc_care` | Care & Cleansing rows |
| `enc_reach_for` | Why People Reach For It rows |

All `enc_` tables reference `stones.id` as a foreign key. Do not modify the `stones` table or any other existing table.

## Task-Specific Reference Files
- Navigation: sourced from `enc_stone_content` (`nav_prev_slug`, `nav_prev_name`, `nav_next_slug`, `nav_next_name`)
- Random navigation: `stones/enc-nav.js` — retained for the 10 existing static pages only

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
- No Supabase data entry may begin before approval.

**Gate 4 — Supabase Data Entry and Verification**

- Claude Code enters approved content into the `enc_` Supabase tables.
- Source is the approved canonical MD only — do not invent, infer, or substitute values.
- Every field must map to its exact column as specified in the MD.
- After entry, verify every field is populated correctly by querying the relevant tables.
- Confirm the dynamic page renders without missing data or structural errors.
- Report any field that could not be mapped or populated.
- Claude Code makes no independent content decisions during data entry.

**Gate 5 — Visual and Editorial QA**

- Dustin or Christie performs final visual and editorial QA against the live dynamic page.
- Lyra or Claude Chat may assist with implementation and content review.

**Gate 6 — Controlled Correction**

- Corrections must be made in both the canonical MD and Supabase together in one controlled pass.
- The canonical MD and Supabase must always match after any correction.
- Do not update Supabase without also updating the canonical MD, and vice versa.

**Gate 7 — Publication**

- Set `published = true` in `enc_stone_content` for the approved stone.
- Verify the live dynamic page is rendering correctly.
- Update production status to PUBLISHED and close the gate.
- Do not update `enc-nav.js` — navigation is handled by the dynamic template via Supabase.

## Production Status Values

```
RESEARCH COMPLETE
MD DRAFT COMPLETE
GATE 0 NORMALIZATION PENDING
APPROVED FOR SUPABASE ENTRY
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
- Supabase data entry and verification
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

## Supabase Data Entry

All encyclopedia content is entered into the `enc_` tables after Gate 3 approval.

Before entering data, Claude Code must:
1. Confirm the approved canonical MD is the source being used
2. Confirm all `enc_` tables exist and are accessible
3. Map every MD field to its exact Supabase column before writing any data
4. Report any field that cannot be cleanly mapped before proceeding

During entry:
- Enter data exactly as written in the approved MD
- Do not paraphrase, trim, or reformat content
- Do not make content decisions
- Populate `published = false` on initial entry — publication is a Gate 7 action
- For `collector_context_p4` and `collector_context_p5`: only INSERT when the approved MD includes M4 or M5 content. If absent from the MD, omit the column from the INSERT statement entirely (do not insert NULL explicitly).

After entry:
- Query each table to verify all rows are present and correctly populated
- Report exact tables and row counts written
- Flag any missing or malformed values

When verifying multiple enc_ tables in one pass, use a single UNION ALL query with a consistent four-column shape. Place ORDER BY once at the end only — never inside an individual SELECT block. Example structure:

```sql
SELECT 'table_name' AS tbl, col1, col2, col3 FROM enc_table WHERE stone_id = '[id]'
UNION ALL
SELECT 'table_name', col1, col2, col3 FROM enc_table WHERE stone_id = '[id]'
ORDER BY tbl, col1;
```

## Standing Rules
- Never infer, fabricate, or silently substitute missing values.
- Stop and ask when required data is unavailable, unclear, or contradictory.
- Preserve approved public copy unless Christie explicitly authorizes a rewrite.
- Do not modify existing tables, columns, or data outside the `enc_` tables.
- Use only sources allowed by `APPROVED-SOURCE-HIERARCHY.md`.
- Never infer navigation order from memory or alphabetical sorting — use `nav_prev_slug` and `nav_next_slug` from the approved MD.
- Use the canonical Supabase encyclopedia image URL based on the stone slug.
- Do not claim PASS unless every required check was actually completed.
- Report exact tables changed and exact fields added or modified.
- The canonical MD and Supabase must always match. Never update one without the other.
- Formation describes geology only. Do not include treatment disclosures, authenticity warnings, or imitation notes in the `formation` field. That content belongs in M2 (`collector_context_p2`) or `enc_collector_notes`.
- The standard mineral facts label in position 6 is Specific Gravity, not Fracture.
- The `group` column in `enc_related_stones` is a reserved word in PostgreSQL. Always wrap it in double quotes: `"group"`. This applies to all INSERT, UPDATE, SELECT, and DELETE statements referencing that column.

## Session Preflight
Before any encyclopedia work:
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
