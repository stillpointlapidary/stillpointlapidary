# Still Point Lapidary Encyclopedia Workspace

This directory contains the active documentation and editorial workspace for the Still Point Lapidary encyclopedia.

## Quick Navigation

- [`standards/`](standards/) — current approved encyclopedia standards
- [`workflow/`](workflow/) — repeatable cohort and editorial workflow tools
- [`entries/`](entries/) — canonical stone MD files
- [`batches/`](batches/) — combined batch records and review packages
- [`archive/`](archive/) — superseded standards, historical handoffs, snapshots, and retained reference files

## Current Standards

- [`standards/ENCYCLOPEDIA-PAGE-STRUCTURE.md`](standards/ENCYCLOPEDIA-PAGE-STRUCTURE.md)
- [`standards/ENCYCLOPEDIA-CONTENT-FIELDS.md`](standards/ENCYCLOPEDIA-CONTENT-FIELDS.md)
- [`standards/ENCYCLOPEDIA-WRITING-AND-RESEARCH.md`](standards/ENCYCLOPEDIA-WRITING-AND-RESEARCH.md)
- [`standards/ENCYCLOPEDIA-APPROVED-SOURCES.md`](standards/ENCYCLOPEDIA-APPROVED-SOURCES.md)
- [`standards/ENCYCLOPEDIA-CATALOG-DECISIONS.md`](standards/ENCYCLOPEDIA-CATALOG-DECISIONS.md)
- [`standards/ENCYCLOPEDIA-DATABASE-REFERENCE.md`](standards/ENCYCLOPEDIA-DATABASE-REFERENCE.md)
- [`standards/ENCYCLOPEDIA-PHOTO-STANDARD.md`](standards/ENCYCLOPEDIA-PHOTO-STANDARD.md)
- [`standards/ENCYCLOPEDIA-ICON-REGISTRY.md`](standards/ENCYCLOPEDIA-ICON-REGISTRY.md)
- [`standards/ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html`](standards/ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html)

## Workflow Files

- [`workflow/ENCYCLOPEDIA-COHORT-PREFLIGHT.md`](workflow/ENCYCLOPEDIA-COHORT-PREFLIGHT.md)
- [`workflow/stone-md-planner.csv`](workflow/stone-md-planner.csv)

## Live Implementation

The live encyclopedia implementation remains outside this documentation directory:

- `../../stones/stone.html` — operational dynamic page implementation
- `../../stones/enc-icons.css` — centralized production icon mapping
- `../../stones/` — published or retained stone-page files
- `../../supabase/` — database migrations, functions, queries, and verification files

## Active Structured Data

- `../../data/catalog/final-tier-roster-06.19.2026.csv`
- `../../data/navigation/Stones Catalog with Previous - Next Slugs.csv`

## Working Rules

- Do not place live runtime files in `docs/`.
- Do not place active production datasets in `docs/`.
- Do not save canonical single-stone MDs outside `entries/`.
- Do not save combined cohort or batch packages inside `entries/`.
- Do not use archived standards as current authority.
- Do not move or rename runtime files without a separate approved implementation change.
