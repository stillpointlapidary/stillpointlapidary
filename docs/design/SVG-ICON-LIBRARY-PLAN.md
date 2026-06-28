# SVG Icon Library Plan
**Version:** 2026-06-28
**Status:** Future controlled project — do not build during ordinary stone production

## Purpose
Replace the current mixed icon set with a cohesive custom SVG library designed as one
visual system.

## Architecture
- Each icon exists as an individual canonical SVG source file in the repository
- All icons share one consistent viewBox, stroke language, line weight, corner
  treatment, and sizing convention
- Icons use `currentColor` so the site's chakra and accent colors can control them
- Stable semantic filenames and IDs
- A build script compiles individual SVG source files into one generated sprite for
  site delivery
- Source SVGs are the source of truth; the compiled sprite is generated output,
  not manually maintained
- Icons are reusable concepts, not unique artwork per stone
- No icon should be designed ad hoc during ordinary stone production

## Required Inventory

### Fixed page-section icons
- Introduction / top anchor
- At a Glance (panel)
- Overview
- Why People Reach For It
- Energetic Themes
- Mineral Profile
- Collector & Curiosity Notes
- Market & Buying Notes
- Care & Cleansing
- Related Stones

### At a Glance fields
- Energetic Role (resolved dynamically per stone — see Energetic Role icons below)
- Chakra
- Element
- Zodiac
- Color Energy
- Material Type (currently using icon-encyclopedia as temporary placeholder)

### Energetic Role icons (12)
Grounding · Protection · Vitality · Heart Healing · Calm & Peace ·
Emotional Regulation · Clarity & Focus · Intuition · Spiritual Connection ·
Transformation · Manifestation · Amplification

### Care & Cleansing categories (4)
Cleaning · Water · Light & Heat · Storage

### Collection and utility actions
- Save to Collection
- Add to Wishlist
- Random / Surprise me

### Navigation and UI
- Previous
- Next
- Back to Encyclopedia

### Recurring Energetic Theme concepts
(inventory to be built as theme patterns emerge across stone production)

### Recurring Collector & Curiosity Note concepts
(inventory to be built as note patterns emerge across stone production)

## Temporary Icon Assignments Pending Library

| Field | Current icon | Replace when library ships |
|---|---|---|
| Material Type | icon-encyclopedia | Dedicated classification/identity icon |

## Trigger for Build
When the icon inventory is sufficiently defined and Christie authorizes the design
project. Do not begin without explicit approval.
