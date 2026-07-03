# Still Point Lapidary Encyclopedia Workspace

This directory contains the active documentation and editorial workspace for the Still Point Lapidary encyclopedia.

## Quick Navigation

- Canonical Project Rules (standards, database reference, page structure, content fields, writing/research, approved sources, catalog decisions, photo standard, icon registry, visual standard) now live in `Documents\Still Point Lapidary\Project Rules` — not in this repository. See `CLAUDE.md` §2 for the authority table.
- [`entries/`](entries/) — canonical stone MD files
- [`batches/`](batches/) — combined batch records and review packages
- [`archive/`](archive/) — superseded standards, historical handoffs, snapshots, and retained reference files

## Workflow Files

- [`workflow/stone-md-planner.csv`](workflow/stone-md-planner.csv) — unreferenced by current tooling; pending classification for archive or removal

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
