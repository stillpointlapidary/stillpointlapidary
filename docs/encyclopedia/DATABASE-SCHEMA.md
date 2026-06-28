# DATABASE-SCHEMA.md
# Still Point Lapidary — Supabase Database Schema Reference
# Version: 2026-06-28 | Status: CANONICAL

This document maps every table and column in the Still Point Lapidary Supabase database.
Use this as the authoritative reference before writing any SQL query or data entry instruction.
Update this document whenever a table or column is added, removed, or renamed.

---

## Master Roster

### `stones`
The shared master roster for all 333 encyclopedia entries. Referenced by all `enc_` tables via `stone_id`.

| Column | Type | Notes |
|---|---|---|
| `id` | text | Stone ID (e.g. `C-0041`). Primary key. Used as `stone_id` in all child tables. |
| `name` | text | Canonical display name (e.g. `Hematite`) |
| `slug` | text | URL-safe slug (e.g. `hematite`) |
| *(additional columns)* | — | Has 4 existing RLS policies. Do not modify without Christie's approval. |

---

## Encyclopedia Tables (`enc_`)

All `enc_` tables use `stone_id` (text) to reference `stones.id`. They do not store the slug directly — join to `stones` when you need the slug.

**Exception:** `enc_stone_content` stores both `stone_id` and `slug` as a convenience for the dynamic template query.

---

### `enc_stone_content`
The primary content table. One row per stone. The dynamic template (`stone.html`) gates all page rendering on this table — a stone will not display unless `published = true`.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `slug` | text | URL-safe slug. Must match `stones.slug`. Used by `stone.html?slug=` |
| `collection_label` | text | Tier label (Essentials, Shelf Builders, Collector Favorites, Rare Finds) |
| `signature_line` | text | One italic sentence. Max 20 words. |
| `pill_1` | text | Property pill 1 |
| `pill_2` | text | Property pill 2 |
| `pill_3` | text | Property pill 3 |
| `best_for` | text | Hero Best For. Gerund or noun phrase. Max 20 words. |
| `use_when` | text | Hero Use When. One sentence. Max 25 words. |
| `affirmation` | text | Hero Affirmation. First person. Max 15 words. |
| `image_alt` | text | Alt text for the stone photo |
| `overview_p1` | text | Overview paragraph 1 — metaphysical identity. Who the stone is, what tradition says, what it is for. Leads with stone name and defining role. |
| `overview_p2` | text | Overview paragraph 2 — mineral and physical identity. Composition, formation, appearance, treatments, trade names. |
| `formation` | text | Formation paragraph. Geological context only. See Formation Rule below. |
| `collector_context_p1` | text | Collector's Guide M1 — quality and value indicators |
| `collector_context_p2` | text | Collector's Guide M2 — identification and confusion stones |
| `collector_context_p3` | text | Collector's Guide M3 — market availability and pricing. **Rendered in the right rail as Market & Buying Notes (2026-06-28), not inside Mineral Profile.** |
| `collector_context_p4` | text | Collector's Guide M4 — locality variations. Nullable. Omit when not meaningful. |
| `collector_context_p5` | text | Collector's Guide M5 — physical handling notes. Nullable. Omit when not compelling. |
| `chakra_primary` | text | Primary chakra |
| `chakra_secondary` | text | Secondary chakra(s), or null if none |
| `element` | text | Classical element |
| `planet` | text | Planetary association. **Column preserved but display-label superseded by Material Type in the rendered template (2026-06-28).** |
| `material_type` | text | Material Type. Controlled vocabulary: Mineral · Mineral variety · Rock · Mineraloid · Organic material · Composite · Synthetic · Fossil · Trade name. Column confirmed added 2026-06-28. |
| `zodiac` | text | Zodiac sign(s) |
| `energetic_role` | text | Exactly 1 locked Energetic Role value |
| `energetic_role_icon` | text | Icon slug for the Energetic Role (e.g. `grounding`) |
| `color_energy` | text | Color energy label |
| `nav_prev_slug` | text | Previous stone slug for encyclopedia navigation |
| `nav_prev_name` | text | Previous stone display name |
| `nav_next_slug` | text | Next stone slug for encyclopedia navigation |
| `nav_next_name` | text | Next stone display name |
| `published` | boolean | Gates public visibility. `false` = invisible to browser. `true` = live. |
| `created_at` | timestamptz | Auto-set on insert |
| `updated_at` | timestamptz | Update manually or via trigger when content changes |

**RLS Policy:** anon SELECT restricted to `published = true`. Unpublished rows are invisible to the browser.

**material_type column confirmed added and populated as of 2026-06-28.** Column exists in `enc_stone_content`. Hematite value: `Mineral`. No further SQL action required. Planet column preserved and must not be renamed or dropped.

---

### `enc_mineral_facts`
The 8-row mineral facts table displayed in the Mineral Profile section. One row per fact per stone.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `label` | text | Fact label (e.g. `Mineral Family`, `Mohs Hardness`) |
| `value` | text | Fact value (e.g. `Oxide mineral`, `5–6`) |
| `display_order` | integer | Controls render order. 1–8. |
| `created_at` | timestamptz | Auto-set on insert |

**Standard default labels (in order):** Mineral Family · Chemical Formula · Crystal System · Mohs Hardness · Cleavage · Specific Gravity · Luster · Transparency. Labels are adaptable for non-minerals — see `enc-editorial-schema.md`.

**RLS Policy:** Open anon SELECT.

---

### `enc_localities`
Common localities listed in the Mineral Profile. One row per locality per stone.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `locality` | text | Locality name (e.g. `Brazil`, `Madagascar`) |
| `display_order` | integer | Controls render order |
| `created_at` | timestamptz | Auto-set on insert |

**RLS Policy:** Open anon SELECT.

---

### `enc_reach_for`
The 5 "Why People Reach For It" rows. One row per use case per stone.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `label` | text | Short use case heading (e.g. `Building Abundance`) |
| `description` | text | One to two sentence explanation. Max 30 words. |
| `display_order` | integer | Controls render order. Exactly 5 rows required. |
| `created_at` | timestamptz | Auto-set on insert |

**RLS Policy:** Open anon SELECT.

---

### `enc_themes`
Energetic Themes rows. One row per theme per stone.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `tier` | text | `primary`, `secondary`, or `occasional` |
| `title` | text | Theme heading |
| `description` | text | Theme description paragraph. 3 visual lines max for primary/secondary. Null for occasional (pills only). |
| `display_order` | integer | Controls render order within tier |
| `icon_slug` | text | Icon class for the theme (e.g. icon-grounding). Nullable. Defaults to icon-upward-spark in the template. **Column confirmed added 2026-06-28 per Session 4 handoff.** |
| `created_at` | timestamptz | Auto-set on insert |

**Counts:** 1–2 primary · 0–2 secondary · 0–2 occasional. See `enc-editorial-schema.md`.

**RLS Policy:** Open anon SELECT.

---

### `enc_collector_notes`
Collector & Curiosity Notes. One row per note per stone.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `title` | text | Bold note heading |
| `body` | text | Note body paragraph. Max 55 words. |
| `icon_slug` | text | Icon slug for the note icon (e.g. `bookmark`, `geology`) |
| `display_order` | integer | Controls render order |
| `created_at` | timestamptz | Auto-set on insert |

**Count:** 3 or 4 notes published. See `enc-editorial-schema.md`.

**RLS Policy:** Open anon SELECT.

---

### `enc_care`
Care & Cleaning section. One row per category per stone. Always exactly 4 rows. *(Table name unchanged — public section heading renamed from "Care & Cleansing" to "Care & Cleaning" on 2026-06-28.)*

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `category` | text | Fixed category label: `Cleaning`, `Water`, `Light & Heat`, or `Storage` |
| `body` | text | Care guidance for this category |
| `display_order` | integer | Controls render order. 1–4. |
| `created_at` | timestamptz | Auto-set on insert |

**Fixed categories in order:** Cleaning · Water · Light & Heat · Storage.

**RLS Policy:** Open anon SELECT.

---

### `enc_related_stones`
Related Stones section. One row per related stone per entry.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `stone_id` | text | References `stones.id` |
| `group` | text | `similar_energy` or `pairs_well_with` |
| `related_slug` | text | Slug of the related stone |
| `related_name` | text | Display name of the related stone |
| `reason` | text | Relationship explanation. Max 30 words. |
| `display_order` | integer | Controls render order within group |
| `created_at` | timestamptz | Auto-set on insert |

**Count:** Exactly 2 similar_energy + 2 pairs_well_with = 4 total.

**RLS Policy:** Open anon SELECT.

---

## RLS Policy Summary

| Table | Policy |
|---|---|
| `enc_stone_content` | anon SELECT where `published = true` only |
| `enc_mineral_facts` | anon SELECT open |
| `enc_localities` | anon SELECT open |
| `enc_reach_for` | anon SELECT open |
| `enc_themes` | anon SELECT open |
| `enc_collector_notes` | anon SELECT open |
| `enc_care` | anon SELECT open |
| `enc_related_stones` | anon SELECT open |
| `stones` | 4 existing policies — do not modify |

The child table policies are safe because the browser can only reach them after passing through the `enc_stone_content` published gate in `stone.html`.

---

## Formation Rule

**Formation describes geology only. Treatment information does not belong in the Formation field.**

- Cover: how the stone forms, geological environment, color origin, crystal habits, relevant physical context.
- Do not include: treatment disclosures, market authenticity warnings, imitation or fraud notes.
- Treatment and authenticity information belongs in Collector's Guide M2 (`collector_context_p2`) or `enc_collector_notes`.

This rule applies to the `formation` column in `enc_stone_content` and to the Formation paragraph in every canonical MD.

---

## Useful Reference Queries

**Check a stone's published status:**
```sql
SELECT slug, published FROM enc_stone_content WHERE slug = 'hematite';
```

**Flip a stone to published:**
```sql
UPDATE enc_stone_content SET published = true WHERE slug = 'hematite';
```

**Get stone IDs by name:**
```sql
SELECT id, name FROM stones WHERE name IN ('Moonstone', 'Sodalite', 'Malachite', 'Sunstone');
```

**Read all mineral facts for a stone:**
```sql
SELECT label, value, display_order FROM enc_mineral_facts WHERE stone_id = 'C-0041' ORDER BY display_order;
```

**Read formation for multiple stones:**
```sql
SELECT slug, formation FROM enc_stone_content WHERE slug IN ('hematite', 'moonstone', 'sodalite', 'malachite', 'sunstone');
```
