# Still Point Lapidary Encyclopedia Workspace

This directory contains implementation-facing encyclopedia documentation: the MD schema reference for the pipeline.

## Quick Navigation

- Canonical Project Rules (standards, database reference, page structure, content fields, writing/research, approved sources, catalog decisions, photo standard, icon registry, visual standard) live in `Documents\Still Point Lapidary\Project Rules` — not in this repository. See `CLAUDE.md` §2 for the authority table.
- [`MD-SCHEMA-REFERENCE.md`](MD-SCHEMA-REFERENCE.md) — generator-readable MD schema definition
- `entries/` (repo-local staging mirrors of canonical stone MDs) was archived 2026-07-22: no active pipeline script ever read this path, and the mirrors were stale (some still carried the retired `Planet` field). Preserved at `C:\Users\chris\Documents\Still Point Lapidary\Archive\GitHub Cleanup Preservation\Website encyclopedia-entries archival 2026-07-22\`. The approved canonical MDs live in `Documents\Still Point Lapidary\Encyclopedia\Canonical MDs\`.

## Current Structured and Canonical Authority

- **Production Master** (stone IDs, canonical names, slugs, collection tiers, Material Types, navigation, production statuses, and all other structured production values) is no longer stored in this repo. It lives at `C:\Users\chris\Documents\Still Point Lapidary\Encyclopedia\Production Data\Still-Point-Lapidary-Production-Master.xlsx`.
- **Canonical MDs** (approved public copy) live at `C:\Users\chris\Documents\Still Point Lapidary\Encyclopedia\Canonical MDs\`.

## Historical Material

Historical handoffs, superseded standards, old exemplar/schema/source-hierarchy docs, old review workbooks, old CSV exports, retired batch records, and retired planning docs are no longer stored in this repo. They were copied and SHA256-verified into `C:\Users\chris\Documents\Still Point Lapidary\Archive\GitHub Cleanup Preservation\Website docs cleanup 2026-07-04\` before removal and are preserved there for reference only — not current authority.

The `entries/` staging mirrors (19 files) were archived the same way on 2026-07-22 into `C:\Users\chris\Documents\Still Point Lapidary\Archive\GitHub Cleanup Preservation\Website encyclopedia-entries archival 2026-07-22\`.

## Live Implementation

The live encyclopedia implementation remains outside this documentation directory:

- `../../stones/stone.html` — operational dynamic page implementation
- `../../stones/enc-icons.css` — centralized production icon mapping
- `../../stones/` — published or retained stone-page files
- `../../supabase/` — database migrations, functions, queries, and verification files

## Working Rules

- Do not place live runtime files in `docs/`.
- Do not place active production datasets in `docs/`.
- Do not save canonical single-stone MDs in this repo; save them to `Documents\Still Point Lapidary\Encyclopedia\Canonical MDs\` only.
- Do not use archived standards as current authority.
- Do not move or rename runtime files without a separate approved implementation change.
