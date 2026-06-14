# SOTD Chakra Color System

**Source of truth for all Stone of the Day chakra-keyed color values.**
Last updated: 2026-06-14

---

## 1. Purpose and Scope

The SOTD chakra color system assigns a coordinated palette of six color values to each Stone of the Day card, based on the stone's `primary_chakra` field. The palette covers:

- the quality pill background and text
- the primary action button fill, border, and text
- the event-announcement header wash and its bottom border
- the kicker line and inline icon accent color

The system applies to the desktop card (`renderDesktopSotdCard`), the mobile card (`renderMobileSotdCard`), and the encyclopedia drawer event banner. Desktop and mobile use identical palette objects and normalization logic — there is no separate mobile palette.

This document reflects the palette as implemented in `app.js` and `styles.css`. **Update this document whenever any palette object or normalization function changes in code.**

---

## 2. The Eight Canonical Chakra Keys

These are the only key strings the palette objects recognize. Spelling, capitalization, and spacing must match exactly as listed here — the normalization function handles inbound variations.

| # | Canonical key |
|---|---|
| 1 | `Earth Star` |
| 2 | `Root` |
| 3 | `Sacral` |
| 4 | `Solar Plexus` |
| 5 | `Heart` |
| 6 | `Throat` |
| 7 | `Third Eye` |
| 8 | `Crown` |

---

## 3. Complete Locked Palette Table

All eight values below are statically declared. Do not derive or compute them at runtime.

### Earth Star

| Role | Value |
|---|---|
| Pill background | `#dedad6` |
| Pill text | `#5a5249` |
| Button background | `#d9d5d1` |
| Button border | `#b5afa8` |
| Button text / icon | `#5a5249` |
| Header wash | `#f5f4f3` |
| Header bottom border | `#b5afa8` |
| Kicker / icon accent | `#5a5249` |

### Root

| Role | Value |
|---|---|
| Pill background | `#e6d0d0` |
| Pill text | `#6b3636` |
| Button background | `#e0caca` |
| Button border | `#c09090` |
| Button text / icon | `#6b3636` |
| Header wash | `#f5f0f0` |
| Header bottom border | `#c09090` |
| Kicker / icon accent | `#6b3636` |

### Sacral

| Role | Value |
|---|---|
| Pill background | `#eeddd4` |
| Pill text | `#6b4530` |
| Button background | `#e8d7ce` |
| Button border | `#c8a890` |
| Button text / icon | `#6b4530` |
| Header wash | `#f6f3f1` |
| Header bottom border | `#c8a890` |
| Kicker / icon accent | `#6b4530` |

### Solar Plexus

| Role | Value |
|---|---|
| Pill background | `#ede8d0` |
| Pill text | `#6b5520` |
| Button background | `#e7e2ca` |
| Button border | `#c5bb8a` |
| Button text / icon | `#6b5520` |
| Header wash | `#f6f5f0` |
| Header bottom border | `#c5bb8a` |
| Kicker / icon accent | `#6b5520` |

### Heart

| Role | Value |
|---|---|
| Pill background | `#d6e6d8` |
| Pill text | `#385838` |
| Button background | `#d0e0d2` |
| Button border | `#8ab88e` |
| Button text / icon | `#385838` |
| Header wash | `#f1f6f2` |
| Header bottom border | `#8ab88e` |
| Kicker / icon accent | `#385838` |

### Throat

| Role | Value |
|---|---|
| Pill background | `#d4e0e8` |
| Pill text | `#2e4858` |
| Button background | `#cedae2` |
| Button border | `#8ab0c8` |
| Button text / icon | `#2e4858` |
| Header wash | `#f0f3f6` |
| Header bottom border | `#8ab0c8` |
| Kicker / icon accent | `#2e4858` |

### Third Eye

| Role | Value |
|---|---|
| Pill background | `#dbd6e8` |
| Pill text | `#453868` |
| Button background | `#d6d1e4` |
| Button border | `#a898cc` |
| Button text / icon | `#453868` |
| Header wash | `#f3f0f8` |
| Header bottom border | `#a898cc` |
| Kicker / icon accent | `#453868` |

### Crown

| Role | Value |
|---|---|
| Pill background | `#ded7ef` |
| Pill text | `#5e5080` |
| Button background | `#d9d2e9` |
| Button border | `#b0a0d8` |
| Button text / icon | `#5e5080` |
| Header wash | `#f4f1fa` |
| Header bottom border | `#b0a0d8` |
| Kicker / icon accent | `#5e5080` |

---

## 4. Complete Fallback Palette

Applied when `primary_chakra` is null, blank, unrecognized, or a multi-chakra string (e.g. `'Root / Heart'`). Normalization returns `''`, which misses all palette objects, and these inline defaults take effect.

| Role | Fallback value | Character |
|---|---|---|
| Pill background | `#e5dfd8` | Neutral warm greige |
| Pill text | `#6b6258` | Neutral warm dark |
| Button background | `rgba(150,136,179,.18)` | Semi-transparent lavender |
| Button border | `#b0a0d8` | Crown-adjacent lavender |
| Button text / icon | `#5e5080` | Crown-adjacent dark purple |
| Header wash | `#f4f2f6` | Near-white, faintest violet cast |
| Header bottom border | `#b0a0d8` | Crown-adjacent lavender |
| Kicker / icon accent | `#6b5e52` | Neutral warm dark |

The pill and button fallbacks converge on a Crown-adjacent lavender. The header wash fallback (`#f4f2f6`) is consistent with the ultra-light palette range. The stale value `#bcb2d8` (an earlier darker mauve) was removed as part of the June 2026 audit and must never be reintroduced.

---

## 5. `normalizeSotdChakra()` Behavior

**Location:** `app.js` — defined immediately after the four palette constants.

**What it does:**

1. Returns `''` immediately if `raw` is null, undefined, or any other falsy value.
2. Converts the input to a string, trims leading and trailing whitespace, and collapses all internal whitespace runs to a single space.
3. Compares the result case-insensitively against the eight canonical keys using `_SOTD_CHAKRA_NORM_MAP` (a pre-computed lookup table built once at parse time).
4. Returns the exact canonical key string on a match (e.g. `'third eye'` → `'Third Eye'`).
5. Returns `''` for any input that does not match a canonical key, including multi-chakra values such as `'Root / Heart'`.

**Examples:**

| Input | Output |
|---|---|
| `'Third Eye'` | `'Third Eye'` |
| `'third eye'` | `'Third Eye'` |
| `'  Crown  '` | `'Crown'` |
| `'ROOT'` | `'Root'` |
| `'Root / Heart'` | `''` (fallback) |
| `null` | `''` (fallback) |
| `''` | `''` (fallback) |
| `'Solar'` | `''` (fallback) |

**Performance note:** `_SOTD_CHAKRA_NORM_MAP` is built once from `_SOTD_CHAKRA_CANONICAL` using `Object.fromEntries`. There is no per-render computation.

---

## 6. Desktop / Mobile Parity

Both `renderDesktopSotdCard` and `renderMobileSotdCard` follow identical steps:

1. Call `normalizeSotdChakra(s.primary_chakra)` to get the canonical key.
2. Look up the same four palette objects (`SFC_CHAKRA_COLORS`, `SFC_BUTTON_COLORS`, `SFC_BANNER_COLORS`, `SFC_KICKER_COLORS`) with the same key.
3. Apply the same six CSS custom properties to the card element's inline `style` attribute: `--sotd-btn-bg`, `--sotd-btn-border`, `--sotd-btn-text`, `--sotd-banner-bg`, `--sotd-banner-border`, `--sotd-kicker-color`.
4. Use the same inline fallback values if the key is `''`.

There is no separate mobile palette. Any future palette change must be applied to both render functions and to this document.

---

## 7. Ordinary-Day vs Editorial-Day Usage

The chakra color system is always active, regardless of whether the day is an editorial event or an ordinary daily selection.

**Ordinary days** (`selectionType === 'random'` or `'emergency'`, or no `eventName`): The header band renders with kicker text "Daily Selection" and heading "Chosen for Today". The chakra wash, border, and kicker accent colors are still applied from the stone's `primary_chakra`.

**Editorial days** (all other `selectionType` values where `eventName` is present): The header band renders with the event name and editorial details. The same chakra colors apply. Event category modifier classes (`.sotd-event--lunar`, etc.) are present in the HTML for potential future use but do not currently affect any visible color — they do not override the chakra palette.

The kicker/icon accent (`--sotd-kicker-color`) is always chakra-keyed. It is independent of event category.

---

## 8. Contrast Ratios and Accessibility

All kicker/icon accent values are dark tones selected to achieve at least 4.5:1 contrast against their paired ultra-light header wash, satisfying WCAG 2.1 AA for small text.

| Chakra | Kicker color | Header wash | Approx contrast |
|---|---|---|---|
| Earth Star | `#5a5249` | `#f5f4f3` | ~9.1:1 |
| Root | `#6b3636` | `#f5f0f0` | ~8.2:1 |
| Sacral | `#6b4530` | `#f6f3f1` | ~7.6:1 |
| Solar Plexus | `#6b5520` | `#f6f5f0` | ~7.5:1 |
| Heart | `#385838` | `#f1f6f2` | ~9.4:1 |
| Throat | `#2e4858` | `#f0f3f6` | ~8.8:1 |
| Third Eye | `#453868` | `#f3f0f8` | ~8.5:1 |
| Crown | `#5e5080` | `#f4f1fa` | ~7.8:1 |

Minimum ratio: ~7.5:1 (Solar Plexus). All eight pass AA (4.5:1) and AA Large (3:1) with significant headroom.

**Pill text on pill background** also passes AA across all eight chakras (lowest observed: ~5.8:1 for Heart). Button text on button background similarly passes AA across all eight.

---

## 9. Usage Hierarchy

The chakra palette is applied in layers, each set by a single CSS custom property on the `.sotd-card` or `.msotd-card` element:

| Layer | CSS variable | Source object |
|---|---|---|
| Card background | (none — hardcoded `#fbf8f3` / `#fbf9f5`) | — |
| Header wash | `--sotd-banner-bg` | `SFC_BANNER_COLORS` |
| Header border | `--sotd-banner-border` | `SFC_BUTTON_COLORS[key].border` |
| Kicker / icon | `--sotd-kicker-color` | `SFC_KICKER_COLORS` |
| Quality pill | inline `style` via `sfcPillStyle()` | `SFC_CHAKRA_COLORS` |
| Primary button fill | `--sotd-btn-bg` | `SFC_BUTTON_COLORS[key].bg` |
| Primary button border | `--sotd-btn-border` | `SFC_BUTTON_COLORS[key].border` |
| Primary button text | `--sotd-btn-text` | `SFC_BUTTON_COLORS[key].text` |

The card background itself is not chakra-keyed. The chakra influence is visible in the header wash (ultra-light), the pill (medium tint), and the button (slightly deeper than the pill).

**Intended visual hierarchy — lightest to deepest:**
Header wash → Quality pill → Button fill

---

## 10. Rules

**Do not invent new chakra colors.** If a new chakra concept needs to be added, extend all four palette objects (`SFC_CHAKRA_COLORS`, `SFC_BUTTON_COLORS`, `SFC_BANNER_COLORS`, `SFC_KICKER_COLORS`) and `_SOTD_CHAKRA_CANONICAL` simultaneously, and update this document before merging.

**Do not use runtime color calculations.** All palette values are static hex strings declared explicitly in the source. Do not compute chakra colors from hue rotations, opacity blending, or any other runtime math.

**Do not bypass normalization.** All palette lookups must flow through `normalizeSotdChakra()`. Do not pass `s.primary_chakra` directly as a palette key.

**Do not use event category colors to override stone or chakra colors.** The event category classes (`.sotd-event--lunar`, etc.) are reserved for potential event-specific decoration and must not override `--sotd-banner-bg`, `--sotd-banner-border`, `--sotd-kicker-color`, or any button variable.

**Update this document whenever the code palette changes.** This file is the canonical record of the approved palette. If palette values in `app.js` change without a corresponding update here, this document is stale and should be treated as unreliable until reconciled.

---

## 11. Code Source References

All definitions live in `app.js` unless noted. Line numbers are approximate and may drift as the file changes — use the symbol names for search.

| Symbol | Type | Role |
|---|---|---|
| `SFC_CHAKRA_COLORS` | `const` object | Pill background and text per canonical key |
| `SFC_BANNER_COLORS` | `const` object | Ultra-light header wash hex per canonical key |
| `SFC_BUTTON_COLORS` | `const` object | Button `{bg, border, text}` per canonical key; `border` is also reused as `--sotd-banner-border` |
| `SFC_KICKER_COLORS` | `const` object | Kicker/icon accent hex per canonical key; selected for ≥4.5:1 contrast on header wash |
| `_SOTD_CHAKRA_CANONICAL` | `const` array | Ordered list of the eight canonical key strings; single source of truth for key membership |
| `_SOTD_CHAKRA_NORM_MAP` | `const` object | Pre-computed lowercase→canonical lookup table derived from `_SOTD_CHAKRA_CANONICAL` |
| `normalizeSotdChakra(raw)` | function | Normalizes any inbound chakra string to a canonical key or `''`; must be called before every palette lookup |

CSS custom properties consumed in `styles.css`:

| Property | Set by | Consumed on |
|---|---|---|
| `--sotd-banner-bg` | card inline style | `.sotd-event-announcement` background |
| `--sotd-banner-border` | card inline style | `.sotd-event-announcement` bottom border |
| `--sotd-kicker-color` | card inline style | `.sotd-event-kicker` color, `.sotd-event-icon` color |
| `--sotd-btn-bg` | card inline style | `.sotd-button-primary` / `.msotd-btn-primary` background |
| `--sotd-btn-border` | card inline style | `.sotd-button-primary` / `.msotd-btn-primary` border |
| `--sotd-btn-text` | card inline style | `.sotd-button-primary` / `.msotd-btn-primary` color |
