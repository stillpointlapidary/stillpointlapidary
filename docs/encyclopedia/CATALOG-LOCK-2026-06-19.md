# Still Point Lapidary — Catalog Lock Record
**Date locked:** 2026-06-19  
**Authority:** Final Catalog Lock Execution Packet 2026-06-19

This document records all locked decisions and policies established during the June 2026 catalog lock. It is a permanent reference for encyclopedia production, Supabase management, and future catalog-review decisions.

---

## Final Locked Counts

| Tier | Name | Count |
|------|------|-------|
| 1 | Essentials | 30 |
| 2 | Shelf Builders | 132 |
| 3 | Collector Favorites | 123 |
| 4 | Rare Finds | 48 |
| — | **Total** | **333** |

These counts are locked. No additions or removals may be made without a new explicit catalog-review decision.

---

## Final Roster Changes

### Removed

| ID | Name | Reason |
|----|------|--------|
| C-0083 | Grape Chalcedony | Merged into C-0076 Grape Agate as alternate name. Applied in a prior session. |
| C-0093 | Lion Skin Jasper | Deleted outright. Not merged into Leopard Skin Jasper. Not renamed to Nellite. |
| C-0270 | Agni Manitite | Deleted outright. |

### Added

| ID | Name | Tier |
|----|------|------|
| C-0402 | Aegirine | 3 |
| C-0403 | Tiffany Stone | 3 |
| C-0404 | Goshenite | 4 |

Encyclopedia slugs:
- C-0402: `aegirine`
- C-0403: `tiffany-stone`
- C-0404: `goshenite`

Encyclopedia pages for these three stones have not yet been created. Do not add their slugs to `stones/enc-nav.js` until the HTML pages are complete, approved, and ready to publish.

---

## Tier Changes Applied

### Tier 1 Changes (applied in prior session — must not be reversed)

**Promoted to Tier 1:** C-0029 Sunstone, C-0060 Unakite, C-0063 Black Kyanite, C-0095 Ocean Jasper  
**Demoted to Tier 2:** C-0007 Blue Calcite, C-0016 Orange Calcite, C-0143 Snowflake Obsidian, C-0186 Goldstone

### Tier 2 → Tier 3 Demotions (12 stones)

C-9002 Chocolate Calcite, C-0295 Clear Fluorite, C-0124 Crackle Quartz, C-0073 Druzy Agate, C-0125 Milky Quartz, C-0179 Pink Aventurine, C-0033 Pink Fluorite, C-0180 Red Aventurine, C-0365 Super Seven, C-0086 White Chalcedony, C-0176 White Dolomite, C-0036 Yellow Fluorite

### Tier 3 → Tier 2 Promotions (21 stones)

C-0120 Ametrine, C-0006 Azurite, C-0150 Black Amethyst, C-0008 Bumblebee Jasper, C-0249 Charoite, C-0037 Copper, C-0074 Fire Agate, C-0122 Golden Healer Quartz, C-0076 Grape Agate, C-0050 Infinite, C-0059 K2 Jasper, C-0253 Larimar, C-0024 Morganite, C-0397 Phoenix Stone, C-0192 Pietersite, C-0055 Pink Tourmaline, C-0066 Ruby in Kyanite, C-0039 Sapphire, C-0265 Seraphinite, C-0401 Unicorn Stone, C-0204 Jet

---

## Locked: Option C Identity Architecture

Every catalog stone may retain its own encyclopedia page regardless of whether it is a mineral species, variety, trade name, rock, composite, treated material, organic material, or man-made material.

Required: Overview paragraph 1 must establish the subject's physical identity and the relevant relationship immediately. It must not present a variety, trade name, commercial identity, rock, composite, or manufactured material as though it were a separate mineral species.

Relationships that must be stated when applicable:
- mineral variety of a broader species
- trade name for another mineral or material
- patterned or included variety
- rock composed of multiple minerals
- volcanic glass
- organic material
- composite material
- man-made glass or manufactured material

Parent and variety pages must not repeat the same family-level prose. The variety or trade-name page includes only enough shared geology to establish identity, then focuses on what is visually, historically, commercially, mineralogically, or traditionally distinct.

---

## Locked: No-Merge Decisions

The following stones must be kept as separate catalog entries. No additional merges are approved.

| Keep separate |
|--------------|
| Kambaba Jasper and Stromatolite |
| Lodestone and Magnetite |
| Banded Carnelian and Carnelian |
| Cinnabrite and Thulite |
| Indigo Gabbro and Merlinite |
| Arkansas Quartz and Clear Quartz |
| Quantum Quattro and Phoenix Stone |
| Leopard Skin Jasper (retained); Lion Skin Jasper (deleted) |

---

## Locked: Aura Quartz Treatment Policy

Keep all four Aura Quartz entries as separate catalog stones at Tier 3:
- Angel Aura Quartz
- Aqua Aura Quartz
- Titanium Aura Quartz
- Tanzan Aura Quartz

All four must be classified as treated material (treated quartz), not natural mineral varieties. Parent material is Clear Quartz. Overview paragraph 1 must state that the quartz is coated using a metallic vapor-deposition treatment. Do not imply the iridescent color formed naturally. Verify coating-metal details during encyclopedia research; do not hard-code unsupported claims. Do not add more Aura Quartz color entries.

---

## Locked: Color Variety Policy

Do not delete color varieties simply because they share a parent mineral.

**Fluorite:** Keep all current color entries. Rainbow, Blue, Green, Purple are stronger/common varieties. Clear, Pink, and Yellow remain at Tier 3. Every page must identify itself as Fluorite and must not invent material differences between colors.

**Quartz:** Keep current breadth. Clearly separate natural varieties, inclusion varieties, locality varieties, growth forms, treated products, and unstable trade names. Strawberry Quartz remains Tier 3 with authenticity/provenance caution. Do not add further Aura Quartz colors.

**Calcite:** Keep current color and commercial varieties with accurate parent framing and trade-name clarification.

**Aventurine:** Pink and Red Aventurine remain Tier 3 pending identity and authenticity scrutiny during encyclopedia research.

**Chalcedony/Agate:** Keep current family after Grape Chalcedony deletion. Do not add redundant color synonyms.

**Jasper:** Keep recognized commercial entries but correct all false jasper identities in encyclopedia copy.

---

## Identity Corrections Applied to Supabase (June 2026 Migration)

These corrections were applied in `supabase/migrations/catalog_lock_june_2026.sql`:

| Stone | Field | Old value | New value |
|-------|-------|-----------|-----------|
| Opalite (C-0262) | `material_type` | Mineral | Synthetic |
| Dalmatian Jasper (C-0088) | `material_type` | Mineral | Rock |
| Dalmatian Jasper (C-0088) | `alternate_names` | (existing or null) | appended: Dalmatian Stone |

---

## Identity Corrections Requiring Research Before Encyclopedia Production

These corrections are locked in principle but require specimen/provenance verification or encyclopedia-level research before they can be applied to Supabase data fields or public copy. Do not apply without completing that research.

| Stone | Correction required | Research needed |
|-------|---------------------|-----------------|
| Kambaba Jasper | Trade-named volcanic rock; not true jasper; not stromatolite; do not describe as fossilized algae | Composition verification |
| Stromatolite | Genuine microbial sedimentary structure; fully separate from Kambaba Jasper | Source confirmation |
| Lodestone | Naturally magnetized Magnetite; retain separate page; cross-link to Magnetite | Cross-link |
| Cinnabrite | Mixed composite material; not a synonym for Thulite; components include wairakite and meionite with pink thulite; do not classify as mineral species | Composition verification |
| Indigo Gabbro / Mystic Merlinite | Keep alternate name Mystic Merlinite; explicitly distinguish from Merlinite/Psilomelane | Research |
| Arkansas Quartz | Locality variety of Clear Quartz from Arkansas; not a separate mineral species | Cross-link |
| Quantum Quattro | Trade-named copper-mineral association; keep separate from Phoenix Stone; use cautious composition wording | Provenance-based framing |
| Phoenix Stone | Trade-named copper-mineral composite; trade-name usage not fully standardized; keep separate from Quantum Quattro | Research |
| Blue Rose Quartz | Do not classify as synthetic or dyed without evidence; flag for provenance/composition verification; remain Tier 3 | Provenance/composition research |
| Unicorn Stone | Trade-named composite or pegmatitic rock; components generally include lepidolite, pink tourmaline, cleavelandite/albite, and smoky quartz; "Unicorn Jasper" is a commercial misnomer | Composition verification |
| Green Moonstone | Immediately identify as Garnierite; not true moonstone | Research |
| Rainbow Moonstone | Trade name for white Labradorite; distinguish from true Moonstone/Orthoclase | Research |
| Black Moonstone | Labradorite-related commercial name; distinguish from true Moonstone/Orthoclase | Research |
| Larvikite | Syenitic rock from Norway; "Norwegian Moonstone" and "Black Labradorite" are commercial misnomers | Research |
| Hypersthene | Orthopyroxene; "Velvet Labradorite" is a commercial misnomer | Research |
| Crackle Quartz | Treated quartz; generally heat-fractured and often dyed; classify as treated material, not natural variety | Research |
| Prasiolite | Green Quartz, commonly produced through treatment of Amethyst; treatment origin must be disclosed where applicable | Research |
| Bumblebee Jasper | Not jasper; mixed volcanic material; identity must be framed accurately and cautiously | Composition verification |
| K2 Jasper | Not jasper; granite containing azurite; keep familiar trade name with immediate correction | Research |
| Caribbean Calcite | Commercial name; origin is Pakistan, not the Caribbean; disclose in copy | Research |
| Jet | Fossilized wood/organic material; not amber; "Black Amber" is a misleading alternate name that must be clarified | Research |
| Buddstone | Fuchsite-related material; "Transvaal Jade" is a commercial misnomer | Research |
| Hackmanite | Tenebrescent variety of Sodalite; parent relationship must be explicit | Research |
| Elite Shungite | High-carbon variety/type of Shungite; link to parent Shungite entry | Cross-link |
| Selenite / Satin Spar | Do not present Satin Spar and Selenite as mineralogically identical habits; both are Gypsum; commercial grouping may be acknowledged | Research |
| Desert Rose | Gypsum formation containing sand; link to Gypsum/Selenite family | Cross-link |
| Lemurian Seed Crystal | Commercial/locality-growth designation of Clear Quartz; not a separate mineral species | Cross-link |
| Tibetan Quartz | Locality designation of Clear Quartz; not a separate mineral species | Cross-link |
| Smoky Citrine | Transitional or treated material between Smoky Quartz and Citrine; treatment/natural origin must be verified per specimen and source | Provenance research |
| Amegreen | Amethyst + Prasiolite zoning/combination; do not describe as an unrelated composite | Research |
| Aegirine (C-0402) | New entry; all identity and encyclopedia data to be established during production | Encyclopedia research |
| Tiffany Stone (C-0403) | New entry; composition confirmed as mixed mineral rock (bertrandite, opalized fluorite); all encyclopedia data to be established during production | Encyclopedia research |
| Goshenite (C-0404) | New entry; confirmed as colorless Beryl variety; all encyclopedia data to be established during production | Encyclopedia research |

---

## Navigation Rebuild Summary

The navigation CSV (`docs/encyclopedia/Stones Catalog with Previous - Next Slugs.csv`) was rebuilt for all 333 stones:

- C-0270 (Agni Manitite) removed; Adamite and Ajoite neighbor pointers updated.
- C-0093 (Lion Skin Jasper) removed; Libyan Desert Glass and Lithium Quartz neighbor pointers updated.
- C-0402 (Aegirine) inserted alphabetically between Adamite and Ajoite (row 3).
- C-0403 (Tiffany Stone) inserted alphabetically between Tibetan Quartz and Titanium Aura Quartz (row 301).
- C-0404 (Goshenite) inserted alphabetically between Goldstone and Grape Agate (row 128).

Final CSV row count verified: 333 data rows.

---

## Migration File

`supabase/migrations/catalog_lock_june_2026.sql`

This file must be executed manually in the Supabase SQL Editor. It is not run automatically. The migration:
- Wraps all changes in a single transaction
- Cleans up `stone_of_day_history` orphans before deleting removed stones
- Inserts new stones idempotently (ON CONFLICT DO NOTHING)
- Applies tier promotions and demotions
- Applies the three research-independent identity corrections
- Verifies 333 total stones, 30/132/123/48 tier breakdown, absence of deleted IDs, presence of new IDs, and no duplicate IDs before committing
