# Still Point Lapidary Documentation

This directory contains implementation-facing encyclopedia documentation for the Website repo: the MD schema reference.

## Current Documentation Areas

- [`encyclopedia/`](encyclopedia/) — MD schema reference (see `encyclopedia/README.md`)

## Runtime Files

Live website code remains outside `docs/`.

Important runtime locations include:

- `../stones/stone.html`
- `../stones/enc-icons.css`
- `../stones/`
- `../assets/`
- `../supabase/`

## Current Authority Lives Outside This Repo

This repo is not where structured production values, canonical MDs, project rules, or historical/archival material live. Current authority:

- **Production Master** (stone IDs, canonical names, slugs, collection tiers, Material Types, navigation, production statuses, and all other structured production values): `C:\Users\chris\Documents\Still Point Lapidary\Encyclopedia\Production Data\Still-Point-Lapidary-Production-Master.xlsx`
- **Canonical MDs** (approved public copy): `C:\Users\chris\Documents\Still Point Lapidary\Encyclopedia\Canonical MDs\`
- **Project Rules** (standards, database reference, page structure, content fields, writing/research, approved sources, photo standard, icon registry, visual standard): `C:\Users\chris\Documents\Still Point Lapidary\Project Rules\`
- **Historical/archival material** (old handoffs, superseded standards, old review workbooks, old CSV exports, retired planning docs): `C:\Users\chris\Documents\Still Point Lapidary\Archive\`

The `data/catalog/` and `data/navigation/` CSV exports that used to live in this repo are not active structured data. They were historical exports only — audited against the Production Master and found fully superseded by it — and have been removed from this repo and preserved in the external Archive above. Do not reactivate a CSV as authority unless Christie or Dustin explicitly does so.

Repo-local MD staging mirrors formerly under `docs/encyclopedia/entries/` were archived 2026-07-22 (unused by any pipeline script, never authority) — see `docs/encyclopedia/README.md`.
