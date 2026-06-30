# Still Point Lapidary — Encyclopedia Database Reference

**Status:** Draft for Christie review  
**Purpose:** Defines the current Supabase tables, columns, relationships, storage rules, and operational constraints for the encyclopedia.

---

## 1. Authority and Scope

This document controls:

- encyclopedia table names
- column names and meanings
- table relationships
- required row counts
- storage and mapping rules
- publication behavior
- RLS expectations
- SQL handling notes

This document does **not** control:

- page layout
- editorial voice
- research standards
- source eligibility
- stone-specific approved copy
- final visual approval

Related authorities:

- `ENCYCLOPEDIA-CONTENT-FIELDS.md` controls which editorial fields exist
- `ENCYCLOPEDIA-PAGE-STRUCTURE.md` controls where fields render
- `ENCYCLOPEDIA-WRITING-AND-RESEARCH.md` controls what the content must do
- canonical MD is the approved source for public copy
- Supabase is the operational website copy after approval

When the database and the editorial field model conflict, stop and ask Christie or Dustin before changing either.

---

## 2. Master Roster

### `stones`

The shared master roster for all 333 encyclopedia entries.

All encyclopedia child tables reference `stones.id` through `stone_id`.

| Column | Type | Purpose |
|---|---|---|
| `id` | text | Stable stone ID, for example `C-0041`. Primary key. |
| `name` | text | Canonical display name. |
| `slug` | text | Canonical URL slug. UNIQUE, NOT NULL after backfill. Authoritative slug location. `enc_stone_content.slug` is a synchronized convenience copy. |
| `enc_production_status` | text | Six-value production status. NOT NULL after backfill. Primary public visibility gate. See approved values below. |
| `enc_energetic_role` | text, nullable | Approved Energetic Role. Twelve-value controlled vocabulary. |
| `color_energy` | text, nullable | Approved Color Energy value. |
| `styling_chakra` | text | Design token selector. NOT NULL after backfill. |
| additional columns | varies | Existing roster data. Do not modify without approval. |

Approved `enc_production_status` values, in order:

- `Not Started`
- `Foundation Live`
- `Research Complete`
- `MD Approved`
- `Supabase Entered`
- `Full Entry Live`

Rules:

- do not create duplicate IDs
- do not infer missing IDs
- do not modify unrelated roster columns during encyclopedia work
- use `stones.id` as the foreign-key value in all `enc_` tables
- `stones.slug` is the authoritative slug; keep `enc_stone_content.slug` synchronized

---

## 3. Primary Encyclopedia Content

### `enc_stone_content`

One row per stone.

A live stone page requires two conditions simultaneously: `stones.enc_production_status = 'Full Entry Live'` AND a matching row in this table with `published = true`. Neither condition alone is sufficient.

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `slug` | text | Convenience copy of the canonical slug |
| `collection_label` | text | Essentials, Shelf Builders, Collector Favorites, or Rare Finds |
| `signature_line` | text | Hero signature line |
| `pill_1` | text | Property pill 1 |
| `pill_2` | text | Property pill 2 |
| `pill_3` | text | Property pill 3 |
| `best_for` | text | Hero Best For |
| `use_when` | text | Hero Use When |
| `affirmation` | text | Hero Affirmation |
| `image_alt` | text | Stone image alt text |
| `overview_p1` | text | Metaphysical identity paragraph |
| `overview_p2` | text | Mineral and physical identity paragraph |
| `formation` | text | Geological formation only |
| `collector_context_p1` | text | Quality Indicators |
| `collector_context_p2` | text | Identification |
| `collector_context_p3` | text | Market & Buying Notes |
| `collector_context_p4` | text, nullable | Locality Variations |
| `collector_context_p5` | text, nullable | Physical Handling |
| `chakra_primary` | text | Primary chakra |
| `chakra_secondary` | text, nullable | Secondary chakra or chakras |
| `element` | text | Classical element |
| `planet` | text, nullable | Legacy metadata only; preserved, not displayed, and not required for new production |
| `material_type` | text | Controlled Material Type value |
| `zodiac` | text | One or two zodiac signs |
| `energetic_role` | text | Exactly one approved Energetic Role |
| `energetic_role_icon` | text | Full CSS class name: `icon-{slug}` — e.g., `icon-grounding`, not `grounding` |
| `color_energy` | text | Approved Color Energy value |
| `nav_prev_slug` | text | Previous stone slug |
| `nav_prev_name` | text | Previous stone display name |
| `nav_next_slug` | text | Next stone slug |
| `nav_next_name` | text | Next stone display name |
| `published` | boolean | Secondary publication lock. Must be `true` for a live page. Not the sole gate — see §11. |
| `created_at` | timestamptz | Creation timestamp |
| `updated_at` | timestamptz | Last update timestamp |

Rules:

- `stone_id` must match `stones.id`
- `enc_stone_content.slug` must match `stones.slug`; `stones.slug` is the authoritative location
- initial entry uses `published = false`
- publication occurs only at Gate 7
- `collector_context_p4` and `collector_context_p5` are omitted when unused
- do not overwrite existing Planet data, but do not research or require new Planet values
- `material_type` is required for new production
- allowed values are `Mineral`, `Mineral variety`, `Rock`, `Mineraloid`, `Organic material`, `Mineral aggregate`, `Composite`, `Man-made`, and `Fossil`
- `Trade name` is not a Material Type value; it is a valid identity and exception flag
- `Mineral aggregate` describes a naturally occurring multi-mineral material without sufficient coherence or standardization to be classified as a defined rock type
- `Composite` is reserved for manufactured assembled stones

---

## 4. Mineral Facts

### `enc_mineral_facts`

Exactly 8 rows per published stone.

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `label` | text | Fact label |
| `value` | text | Fact value |
| `display_order` | integer | Render order, 1–8 |
| `created_at` | timestamptz | Creation timestamp |

Default true-mineral labels:

1. Mineral Family
2. Chemical Formula
3. Crystal System
4. Mohs Hardness
5. Cleavage
6. Specific Gravity
7. Luster
8. Transparency

Labels may be adapted for non-mineral materials.

Rules:

- exactly 8 rows
- unique `display_order` values from 1 through 8
- do not force true-mineral labels where they do not apply
- preserve approved MD wording exactly

---

## 5. Common Localities

### `enc_localities`

One row per approved locality.

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `locality` | text | Concise locality label |
| `display_order` | integer | Render order |
| `created_at` | timestamptz | Creation timestamp |

Rules:

- target 3–6 rows
- up to 8 by justified exception
- fewer allowed when only one or two meaningful sources exist
- no duplicate localities
- no exhaustive occurrence lists
- display order must match canonical MD

---

## 6. Why People Reach For It

### `enc_reach_for`

Exactly 5 rows per published stone.

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `label` | text | Row heading |
| `description` | text | Row description |
| `display_order` | integer | Render order, 1–5 |
| `created_at` | timestamptz | Creation timestamp |

Rules:

- exactly 5 rows
- unique `display_order` values from 1 through 5
- preserve approved wording exactly

---

## 7. Energetic Themes

### `enc_themes`

One row per theme or occasional association.

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `tier` | text | `primary`, `secondary`, or `occasional` |
| `title` | text | Theme title or occasional label |
| `description` | text, nullable | Theme description; null for occasional associations |
| `display_order` | integer | Order within tier |
| `icon_slug` | text, nullable | Full CSS class name: `icon-{slug}` — e.g., `icon-transformation`; null for occasional associations |
| `created_at` | timestamptz | Creation timestamp |

Count rules:

- Primary: 1–2
- Secondary: 0–2
- Occasional: 0–2

Rules:

- occasional rows do not require descriptions
- remove unsupported optional rows rather than inserting blanks
- icon slugs must map through the centralized icon system
- `tier` values must use the exact lowercase vocabulary above

---

## 8. Collector & Curiosity Notes

### `enc_collector_notes`

3 or 4 rows per published stone.

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `title` | text | Note title |
| `body` | text | Note body |
| `icon_slug` | text | Full CSS class name: `icon-{slug}` — e.g., `icon-geology`, not `geology` |
| `display_order` | integer | Render order |
| `created_at` | timestamptz | Creation timestamp |

Rules:

- publish 3 or 4 rows
- unique display order
- no blank note rows
- preserve approved wording exactly

---

## 9. Care & Cleaning

### `enc_care`

Exactly 4 rows per published stone.

The table name remains `enc_care`.

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `category` | text | Fixed category label |
| `body` | text | One-sentence guidance |
| `display_order` | integer | Render order, 1–4 |
| `created_at` | timestamptz | Creation timestamp |

Fixed values:

1. `Cleaning`
2. `Water`
3. `Light & Heat`
4. `Storage`

Rules:

- exactly 4 rows
- category and order must match the fixed list
- public section name is `Care & Cleaning`
- do not rename the table solely to match the public label

---

## 10. Related Stones

### `enc_related_stones`

Exactly 4 rows per published stone.

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `group` | text | `similar_energy` or `pairs_well_with` |
| `related_slug` | text | Related stone slug |
| `related_name` | text | Related stone display name |
| `reason` | text | Relationship explanation |
| `display_order` | integer | Order within group |
| `created_at` | timestamptz | Creation timestamp |

Count rules:

- 2 `similar_energy`
- 2 `pairs_well_with`

SQL rule:

- `group` is a PostgreSQL reserved word
- always reference it as `"group"` in SQL

Rules:

- all 4 related stones must be different
- slugs must exist in the canonical roster
- reasons must match approved MD exactly

---

## 11. Publication and RLS

### Publication Gate

A live stone page requires both conditions to be true simultaneously:

- `stones.enc_production_status = 'Full Entry Live'`
- a matching `enc_stone_content` row with `published = true`

Neither condition alone is sufficient.

**Mismatch behavior:**

- If `enc_production_status = 'Full Entry Live'` but the content row is missing or `published` is not `true`: render **Error** state, apply `noindex, nofollow`, and log the mismatch. Do not expose partial content.
- If `enc_stone_content.published = true` but `enc_production_status` is not `Full Entry Live`: render **Coming Soon** state, apply `noindex, follow`, and log the mismatch.

Any mismatch must be reported to Christie before corrective SQL is run.

Required Gate 7 sequence:

1. insert or update approved content with `published = false`
2. verify all child-table rows
3. review the dynamic page
4. complete visual and editorial QA
5. apply controlled corrections to both MD and Supabase
6. set `stones.enc_production_status = 'Full Entry Live'` and `enc_stone_content.published = true` together
7. verify the live page

### RLS Expectations

| Table | Expected public access |
|---|---|
| `enc_stone_content` | anon SELECT only where `published = true` |
| `enc_mineral_facts` | anon SELECT |
| `enc_localities` | anon SELECT |
| `enc_reach_for` | anon SELECT |
| `enc_themes` | anon SELECT |
| `enc_collector_notes` | anon SELECT |
| `enc_care` | anon SELECT |
| `enc_related_stones` | anon SELECT |
| `stones` | existing policies; do not modify without approval |

Do not alter RLS policies during routine stone production.

---

## 12. Canonical Data Flow

The approved flow is:

1. locked production data
2. approved cohort research
3. canonical MD
4. Supabase entry
5. dynamic rendering
6. visual and editorial QA
7. publication

Authority rules:

- canonical MD is the approved source for public copy
- Supabase is the operational website copy
- Supabase does not override approved MD
- after any correction, MD and Supabase must match
- do not update one and defer the other

---

## 13. Claude Code Supabase Authority

Claude Code may inspect live schemas and data, run read-only queries, prepare migrations, validate results, and execute SQL when Christie or Dustin explicitly authorizes the task in a session brief. An explicit brief from Christie or Dustin is the controlling authority and supersedes any stale gate-status markers in MD files or batch notes. Claude Code does not require additional per-table or per-stone confirmation once a brief authorizes an entry run.

Claude Code may not independently choose schema design, catalog values, editorial values, identity decisions, or destructive changes. Unexpected findings — including missing slugs, unmapped fields, or schema mismatches — must be reported to Christie before proceeding. Production Master writes are also owned exclusively by Claude Code. See ENCYCLOPEDIA-COHORT-EXECUTION-PROTOCOL.md for full lane assignment and workflow sequencing rules.

---

## 14. Supabase Entry Rules

Before writing:

- confirm the canonical MD is approved
- confirm the stone ID and slug
- map every MD field to its exact table and column
- identify any field that does not map cleanly
- do not write until mapping conflicts are resolved

During writing:

- enter text exactly as approved
- do not paraphrase
- do not trim
- do not normalize punctuation without approval
- use `published = false`
- omit optional p4 and p5 columns when absent
- do not insert unrelated data

After writing:

- query every affected table
- verify row counts
- verify display order
- verify exact text
- verify slug and stone ID alignment
- report exact tables changed

---

## 15. Safe Verification Pattern

When checking multiple child tables in one query, use `UNION ALL` with a consistent output shape and a single final `ORDER BY`.

Example:

```sql
SELECT
  'enc_reach_for' AS table_name,
  display_order::text AS item_order,
  label AS field_1,
  description AS field_2
FROM enc_reach_for
WHERE stone_id = 'C-0041'

UNION ALL

SELECT
  'enc_care',
  display_order::text,
  category,
  body
FROM enc_care
WHERE stone_id = 'C-0041'

ORDER BY table_name, item_order;
```

Do not place `ORDER BY` inside each individual `SELECT` block.

Use only the columns needed for the verification task.

---

## 16. Useful Queries

### Check publication status

```sql
SELECT slug, published
FROM enc_stone_content
WHERE slug = 'hematite';
```

### Publish a stone

```sql
UPDATE enc_stone_content
SET published = true,
    updated_at = now()
WHERE slug = 'hematite';
```

### Confirm roster identity

```sql
SELECT id, name
FROM stones
WHERE id = 'C-0041';
```

### Read mineral facts

```sql
SELECT label, value, display_order
FROM enc_mineral_facts
WHERE stone_id = 'C-0041'
ORDER BY display_order;
```

### Read navigation

```sql
SELECT
  nav_prev_name,
  nav_prev_slug,
  nav_next_name,
  nav_next_slug
FROM enc_stone_content
WHERE stone_id = 'C-0041';
```

---

## 17. Database Change Control

Database changes include:

- new tables
- removed tables
- renamed tables
- added columns
- removed columns
- renamed columns
- type changes
- new constraints
- RLS changes

These require:

1. Christie or Dustin approval
2. repository inspection
3. migration plan
4. backup or rollback consideration
5. update to this document
6. review of the dynamic template and existing data
7. targeted validation

Routine content entry does not require a schema change.

Do not modify `stones` or unrelated tables during encyclopedia work.

---

## 18. Validation Checklist

Before declaring a stone ready to publish, verify:

- one `enc_stone_content` row exists
- stone ID and name match the roster
- exactly 8 mineral facts
- exactly 5 reach-for rows
- 1–2 Primary themes
- 0–2 Secondary themes
- 0–2 Occasional themes
- 3 or 4 collector notes
- exactly 4 care rows
- exactly 4 related-stone rows
- locality rows match the approved set
- Material Type is populated
- Planet is not required for completion
- optional p4 and p5 behavior is correct
- navigation fields are populated
- `published` changes only after approval
- canonical MD and Supabase match

Do not report PASS unless every relevant check was actually completed.

---

## 19. Change History

This document reflects the current database model only.

Do not maintain a narrative amendment archive here.

Use version control and migration files for technical history.
