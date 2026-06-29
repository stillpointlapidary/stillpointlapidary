# Still Point Lapidary — Project Status

**Last updated:** 2026-06-29
**Maintained by:** Claude Chat
**Update frequency:** At session close or after any gate advancement

---

## Project Overview

Still Point Lapidary is a 333-stone crystal encyclopedia at stillpointlapidary.com. The site uses a single dynamic template (`stones/stone.html`) served via Supabase with client-side rendering. All stone pages are delivered via `?slug=` parameter. No build step.

---

## Current Phase

**333-stone foundation and production rollout.**

Batch 1 (5 stones) is Full Entry Live. Foundation URL architecture is approved and awaiting implementation. Production Master v0.3 is complete and verified. Legacy Aggregate normalization is complete and the 10-value Material Type vocabulary is locked. Four Meteoritic records and two blank Material Type records remain open.

---

## What Is Complete

### Infrastructure
- Domain switchover to stillpointlapidary.com complete (Cloudflare DNS)
- Netlify auto-deploy from GitHub `stillpointlapidary` main branch active
- Netlify Prerender Extension installed and configured
- Single dynamic template `stones/stone.html` serving all stone pages
- Global canonical header applied to `stones/stone.html`
- `ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html` created and committed as canonical visual/DOM reference
- Full `ENCYCLOPEDIA-*` document set created and reviewed; latest Mineral aggregate synchronization awaits repository write and commit

### Published Stones (Batch 1 — Full Entry Live)
All five fully QA'd, approved, and published via Gate 7 SQL:
- Hematite (C-0041)
- Malachite (C-0020)
- Moonstone (C-0162)
- Sodalite (C-0218)
- Sunstone (C-0029)

### Production Master
- `Still-Point-Lapidary-333-Foundation-Production-Master-v0.3.xlsx` complete and verified (333 stones, 46 columns, 32 cohorts)
- All slugs valid and unique
- Legacy Aggregate normalization complete — 10-value Material Type vocabulary locked
- Foundation Live Checklist sheet with formula-driven readiness checks

### Vocabulary Locks
- Material Type: 10 approved values (see `ENCYCLOPEDIA-CONTENT-FIELDS.md` §4.6)
- Encyclopedia Energetic Role: 12 approved values — CHECK constraint planned in pending Supabase migration
- `enc_production_status`: 6 approved values — CHECK constraint planned in pending Supabase migration
- Element: `Air` canonical; `Wind` retired from public copy
- `Composite` reserved for manufactured assembled stones only
- `Mineral aggregate` approved for naturally occurring multi-mineral material without sufficient coherence to be classified as a defined rock type

### Foundation URL Architecture
Approved design covers:
- One stable `stone.html?slug=` URL per stone
- Status-driven public gating via `enc_production_status`
- Four named render states
- Bidirectional mismatch detection
- SEO: canonical tags, robots meta, Open Graph, static HTML fallbacks, sitemap
- Foundation URL architecture design: approved in project planning; not yet committed as a named repository document. Repository filename TBD.
- Full implementation brief to be written and reviewed by Christie before any code is touched

---

## Current Blockers

### 1. Supabase schema migration not yet run
Five new columns approved for the `stones` table. Dustin runs this SQL — not Claude Code.

| Column | Type | Notes |
|---|---|---|
| `stones.slug` | text, UNIQUE, NOT NULL | Canonical URL slug for all 333 stones |
| `stones.enc_production_status` | text, NOT NULL, DEFAULT 'Not Started' | CHECK constraint on 6 values — planned |
| `stones.enc_energetic_role` | text, nullable | CHECK constraint on 12 values — planned |
| `stones.color_energy` | text, nullable | Established during cohort research |
| `stones.styling_chakra` | text, NOT NULL | Controls design token selection |

Migration SQL exists in the approved foundation architecture planning record and must be placed in a named, reviewable implementation or migration document before execution.

### 2. Foundation URL architecture implementation not yet started
Claude Code implementation brief has not been written. Must be written and reviewed by Christie before anything goes to Claude Code.

### 3. No additional stone is currently Foundation Live ready
The five Batch 1 stones are Full Entry Live. All remaining records fail the Foundation Live checklist on at least these fields: Affirmation, Element, Zodiac, Encyclopedia Energetic Role, Color Energy. This is expected. These advance stone by stone through Gate 0 normalization and cohort research.

---

## Open Data Gaps

### Meteoritic Material Type (4 stones — individual decisions required)
| ID | Stone | Issue |
|---|---|---|
| C-0266 | Tektite | Natural impact glass; likely Mineraloid — specialist verification required |
| C-0255 | Libyan Desert Glass | Natural silica-rich impact glass; likely Mineraloid — formation terminology requires care |
| C-0257 | Meteorite | Broad market category spanning multiple meteorite types; highest complexity — do not assign until material scope is settled |
| C-0259 | Moldavite | Natural impact glass and tektite variety; likely Mineraloid — retain precise parent relationship |

None are Tier 1 stones.

### Missing Carried Foundation Fields (3 stones — new catalog additions)
All five carried fields missing for each:
| ID | Stone | Missing |
|---|---|---|
| C-0402 | Aegirine | Primary Chakra, Styling Chakra, Best For, Use When, Card Properties |
| C-0403 | Tiffany Stone | Primary Chakra, Styling Chakra, Best For, Use When, Card Properties |
| C-0404 | Goshenite | Primary Chakra, Styling Chakra, Best For, Use When, Card Properties |

### Missing Material Type (2 stones)
| ID | Stone |
|---|---|
| C-0401 | Unicorn Stone |
| C-0400 | Biotite |

---

## Next Actions

### Christie
1. Approve Meteoritic stone Material Type decisions after targeted specialist identity review
2. Review carried foundation field values for C-0402, C-0403, C-0404 once Lyra surfaces recommendations
3. Approve foundation implementation brief before it goes to Claude Code
4. Approve Supabase migration SQL before Dustin runs it

### Dustin
1. Run Supabase schema migration SQL once Christie approves
2. Review and authorize document commits and pushes completed by Claude Code

### Claude Chat
1. Complete Meteoritic stone identity research and surface recommendations
2. Surface carried foundation field recommendations for C-0402, C-0403, C-0404 (with Lyra)
3. Draft foundation URL architecture implementation brief for Christie review
4. Support Tier 1 Gate 0 normalization across Cohorts 1–3

### Claude Code
1. Write approved `PROJECT-STATUS.md` to repository root
2. Awaiting implementation brief — no foundation code work until brief is approved by Christie

### Lyra
1. Surface recommended values for C-0402, C-0403, C-0404 carried foundation fields
2. Support Tier 1 Gate 0 normalization across Cohorts 1–3 as directed

---

## Production Pipeline

### Gate Structure
Gate 0 (catalog data) → Gate 1 (cohort research) → Gate 2 (MD draft) → Gate 3 (MD approval) → Gate 4 (Supabase entry) → Gate 5 (visual QA) → Gate 6 (controlled correction) → Gate 7 (publish)

### Cohort Sequencing
| Cohorts | Tier | Stones | Size |
|---|---|---|---|
| 1–3 | Tier 1 — Essentials | 30 | 3 × 10 |
| 4–16 | Tier 2 — Shelf Builders | 132 | ~13 × 10 |
| 17–28 | Tier 3 — Collector Favorites | 123 | ~12 × 10 |
| 29–32 | Tier 4 — Rare Finds | 48 | 4 × 12 |

Research cohorts ~10 stones. MD drafting batches ≤5 stones.

### Production Status Vocabulary
`Not Started` → `Foundation Live` → `Research Complete` → `MD Approved` → `Supabase Entered` → `Full Entry Live`

---

## Key Files

| File | Purpose | Notes |
|---|---|---|
| `Still-Point-Lapidary-333-Foundation-Production-Master-v0.3.xlsx` | Active working production master | v0.2 superseded |
| `ENCYCLOPEDIA-PAGE-VISUAL-STANDARD.html` | Canonical visual and DOM reference | Do not modify without matching `stone.html` |
| `ENCYCLOPEDIA-CONTENT-FIELDS.md` | Field rules, counts, vocabularies | 10-value Material Type vocabulary current |
| `ENCYCLOPEDIA-CATALOG-DECISIONS.md` | Durable catalog decisions | Mineral aggregate added 2026-06-29 |
| `CATALOG-LOCK-2026-06-19.md` | Canonical catalog lock | Do not archive |
| `final-tier-roster-06.19.2026.csv` | Canonical roster source | Do not archive |
| Foundation URL architecture design | Approved in project planning | Not yet committed as a named repository document; filename TBD |

---

## Lane Discipline

- **Christie / Dustin** — all decisions, approvals, SQL execution; Christie and Dustin retain full decision and SQL authority
- **Claude Chat** — strategy, briefs, document drafts, editorial review
- **Lyra** — MD drafting, research synthesis, workbook updates, compliance reporting
- **Claude Code** — execution only; writes, commits, or pushes only when explicitly instructed through an approved brief; never runs SQL; never makes content decisions

SQL always goes to Christie or Dustin to run directly. Claude Code prepares statements only when explicitly asked through an approved brief.
