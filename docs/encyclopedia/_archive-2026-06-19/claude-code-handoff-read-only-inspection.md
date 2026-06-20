# Claude Code Handoff — Read-Only Repository Inspection

**Date:** June 19, 2026
**Status of architecture documents:** PROVISIONALLY APPROVED FOR CITRINE PILOT
**This task:** Read-only inspection only. No repository edits, no uploads, no HTML generation.

---

## Context

The encyclopedia production system has two newly provisionally-approved canonical documents:

- `docs/encyclopedia/enc-architecture-contract.md`
- `docs/encyclopedia/enc-editorial-schema.md`

Before the Citrine pilot HTML is built, one open item from the architecture contract must be resolved: a proposed Supabase icon storage path was drafted without verification against the actual repository or Supabase bucket contents, because no repository access was available at drafting time. This task closes that gap.

**Do not proceed to pilot HTML generation after this task. Report findings only.**

---

## Task 1 — Read-Only Repository Inspection

Inspect the repository structure relevant to the encyclopedia. Report:

- Overall repository layout relevant to `stones/` and any `docs/encyclopedia/` paths
- Location and contents of `stones/enc-nav.js`
- Any existing build, template, or asset-reference scripts touching stone pages

Make no edits during this step.

---

## Task 2 — Identify Current SVG / Icon Storage and Reference Conventions

Specifically determine:

1. Where are the approved 57 icon SVGs currently stored?
   - In the Supabase `stone-images` bucket?
   - Under a different bucket name?
   - As local repository assets (e.g., `/assets/icons/`, `/public/icons/`)?
   - Inline within HTML files (embedded `<svg>` markup)?
2. If stored in Supabase, what is the **actual current path convention** — does anything already exist at or near `encyclopedia/icons/{icon-slug}.svg` in the `stone-images` bucket?
3. How do existing stone HTML files currently reference icons?
   - `<img src="...">` pointing at a URL?
   - Inline `<svg>` markup copied per page?
   - CSS `background-image` / `mask-image`?
   - A JS-driven mapping object or helper function?
4. Is there already a centralized icon-mapping layer of any kind (a JSON/JS object mapping icon names to paths or URLs), even a partial or outdated one?
5. Confirm whether the approved icons use `stroke="currentColor"` as stated in the architecture contract — verify against actual SVG file contents if accessible, rather than assuming.

**Report findings, including direct quotes/snippets of relevant code, file paths, and any existing icon-path values found in the repository or referenced in code.**

---

## Task 3 — Identify Existing Canonical Stone-Page HTML/Template Files

1. List every HTML file in the repository that appears to be a stone page or a stone-page template (including any in `stones/`, root-level, or elsewhere).
2. For each, note:
   - Filename
   - Whether it matches deprecated architecture (Known For section, 4-tile Hero, 7-box At a Glance, Pairs Well With or Primary Chakra as Hero tiles) — flag specifically if found
   - Whether it appears to be a live/published page, a draft, or an abandoned attempt
3. Explicitly check for and report on the presence/contents of:
   - `GOLD-STANDARD-STONE-PAGE.html`
   - `citrine_FINAL.html`
   - `selenite_FINAL.html`
   - `black-tourmaline_FINAL.html`
   - Any `*_NEW_FORMAT.html` or `*_NEW_FORMAT.md` files
4. Identify whether any file currently functions as the de facto template being referenced elsewhere in the codebase (e.g., linked from a build script, a generator, or `enc-nav.js`).

**Do not treat any of these files as a current architecture source. This is inventory only.**

---

## Task 4 — Report Conflicts With the Proposed Supabase Icon Path

The architecture contract (§12.5) proposes, as **unverified**:

```text
Supabase bucket:
stone-images

Path:
encyclopedia/icons/{icon-slug}.svg

Public URL pattern:
https://vxujlgyhgnihnqrxzefw.supabase.co/storage/v1/object/public/stone-images/encyclopedia/icons/{icon-slug}.svg
```

Based on Tasks 1–3, report:

1. Does anything already exist at this exact path in the `stone-images` bucket?
2. Does any other part of the codebase already reference a *different* icon path convention that this would conflict with or duplicate?
3. Is `stone-images` the correct/expected bucket for icons, or are icons conventionally stored separately from stone photography in this project?
4. Any naming collisions between proposed icon slugs (e.g., `celestial.svg`, `color-range.svg`, `grounding.svg`, `protection.svg`, `vitality.svg`, `heart-healing.svg`, `calm-peace.svg`, `emotional-regulation.svg`, `clarity-focus.svg`, `intuition.svg`, `spiritual-connection.svg`, `transformation.svg`, `manifestation.svg`, `amplification.svg`) and any existing filenames already in use.
5. A clear recommendation: **confirmed safe to use as proposed**, **needs modification** (and what modification), or **cannot determine from available access** (and what additional access or information would be needed).

---

## Task 5 — Explicit Constraints

- **No repository edits.**
- **No file uploads of any kind**, including no SVG uploads to Supabase.
- **No HTML generation**, including no Citrine pilot HTML.
- **No changes to `stones/enc-nav.js`.**
- If anything discovered during inspection appears to contradict the architecture contract or editorial schema, **report it — do not silently resolve it or proceed past it.**
- If repository or Supabase access is insufficient to answer any task above, state plainly what is missing rather than guessing.

---

## Deliverable

A single read-only findings report covering Tasks 1–4, returned to Christie before any pilot work begins. Once findings are reviewed and the icon path is confirmed or corrected, the Gate 3 blocker in the architecture contract can be cleared and the Citrine pilot phase can begin under separate instruction.
