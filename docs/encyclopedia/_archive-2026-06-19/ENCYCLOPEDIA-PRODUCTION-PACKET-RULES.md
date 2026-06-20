# Encyclopedia Production Packet and Stop Rules

## Purpose

Claude writes and implements encyclopedia pages. Claude does not invent or rediscover locked production data.

## Canonical Inputs

For each stone, load the exact matching row from:

- `docs/encyclopedia/ENCYCLOPEDIA-PRODUCTION-DATA.csv`
- `docs/encyclopedia/ENCYCLOPEDIA-MINERAL-DATA.csv`

Also load:

- `docs/encyclopedia/MASTER-STONE-PAGE-CONTRACT.md`
- `docs/encyclopedia/APPROVED-MD-SCHEMA.md`
- `docs/encyclopedia/ENCYCLOPEDIA-ICON-MAP.md`

The supplied book excerpts and approved online source roster control research synthesis.

## Locked Production Data

Copy these values exactly from the production-data row:

- stone name and slug
- tier and collection-tier label
- image URL
- previous and next names and slugs
- Primary, Secondary, and Styling Chakra values
- three property pills
- three Hero pairings and slugs
- two Similar Energy stones and slugs
- two Pairs Well With stones and slugs

Do not substitute, reinterpret, or independently select any locked value.

## Locked Mineral Data

Treat the mineral-data row as the factual baseline for:

- material type
- mineral family
- composition
- crystal-system wording
- formation
- transparency
- color range and color cause
- hardness
- localities
- treatments
- imitations
- care
- alternate names

Research may add nuance, but it may not contradict the canonical row silently. Report a conflict before drafting.

### Mineral Identity and Relationship Fields
These are workbook research fields, not live CSV columns. Populate them during research before drafting.

- `identity_type` — controlled vocabulary: Mineral, Mineral variety, Rock, Mineraloid, Volcanic glass, Organic material, Trade name, Composite material, Man-made material
- `parent_material` — the broader mineral, species, or material this subject belongs to or derives from
- `parent_page_slug` — slug of the parent encyclopedia page if one exists
- `relationship_note` — one sentence describing the relationship for Overview paragraph 1 framing
- `related_varieties` — other catalog entries that share the same parent material
- `trade_name_status` — whether this entry is a trade name and for what
- `man_made_status` — whether this entry is wholly or partly manufactured

Overview paragraph 1 must state the physical identity and relevant relationship clearly. Do not present a variety, trade name, rock, composite, or manufactured material as a distinct mineral species.

## Allowed Work

Claude may:

- synthesize the supplied books and approved online sources
- organize energetic themes using the locked standards
- write and refine public copy
- document evidence, disagreements, and omitted claims
- generate HTML only after the MD is explicitly approved

## Forbidden Guessing

Claude must not infer production data from:

- featured-stone status
- neighboring files
- alphabetical order
- existing page wording
- visual patterns on other pages
- source popularity
- general crystal conventions
- personal judgment

Existing live pages may be inspected only for implementation structure when the gold-standard template does not define a technical detail. They are not production-data sources.

## Mandatory Preflight

Before drafting, report:

- Production row found: yes/no
- Mineral row found: yes/no
- Tier confirmed: yes/no
- Navigation complete: yes/no
- Chakra data complete: yes/no
- Property pills complete: yes/no
- Hero pairings complete: yes/no
- Related stones complete: yes/no
- Book sources received: yes/no
- Identity type confirmed: yes/no
- Mineral relationship framing ready for Overview paragraph 1: yes/no/not applicable
- Sibling pages identified: yes/no/not applicable

If any required answer is `no`, stop. Do not draft and do not guess.

## Final Compliance Question

Every completion report must answer:

**Which locked production values did you select independently instead of receiving from a canonical source?**

The required answer is:

`None.`

Any other answer means the work is not ready for approval.
