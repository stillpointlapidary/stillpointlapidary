# Still Point Lapidary — Session Handoff
**Date:** June 3, 2026 (updated end of session 2)

---

## ⚠️ Before Next Session
- **Claude Code must be opened from:** `C:\Users\chris\Documents\Claude\Still Point Lapidary\Website\`
- Do NOT use `C:\Users\chris\OneDrive\...` — OneDrive was abandoned, folder moved to local drive
- Do NOT use `C:\Users\chris\Documents\Woo\...` — stale old clone

---

## Current State
- **Live at:** stillpointlapidary.com (GitHub Pages, auto-deploys on push to main)
- **Supabase project:** vxujlgyhgnihnqrxzefw.supabase.co
- **363 stones** in the encyclopedia (cleaned up this session)
- **Stones live in Supabase** — `stones` table, loaded async on app startup
- **Single file:** index.html (~7,000 lines — CSS + HTML + JS combined)
- **Node/npm present** in the Website folder (used for migration scripts)

---

## Supabase Migration — COMPLETE ✅

### What was done
- `stones` table created and populated with all stones
- App replaced `const CRYSTALS=[...]` (hardcoded) with async loader from Supabase
- Loader checks localStorage cache (`spl_stones_cache v2`) first → instant repeat loads
- Background refresh keeps cache current
- Loading spinner shown on first visit only (no cache)
- Stone count in all UI labels is now dynamic

### Key Supabase facts
- **Anon key (JWT):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dWpsZ3loZ25paG5xcnh6ZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjQwNDQsImV4cCI6MjA5NDkwMDA0NH0.1qWY2MsxbiNsS6zzJ1y9amD_KIVwxvoFzODbH5RJoI8`
- **Service role key** is in `supabase/migrate_stones.js` (do not commit)
- **Publishable key** (`sb_publishable_...`) is in index.html for auth — NOT a valid JWT for edge functions; use the anon key above
- Stone IDs: `C-0001` through `C-0395` (with gaps — deleted entries not reused)
- `collection_items` and `wishlist_items` tables have FK references to `stones.id` — never drop `stones` directly

### Migration scripts (keep, don't delete)
- `supabase/migrate_stones.js` — bulk insert from index.html into Supabase
- `supabase/patch_index.js` — replaced hardcoded CRYSTALS with async loader
- `supabase/fix_loader.js` — moved loader call to after `_supa` is defined

### Field mapping (Supabase → JS short keys)
`id→i, name→n, alternate_names→a, family→fam, species→sp, material_type→mt, crystal_system→sy, formation→fo, transparency→tr, color→c, color_hex→ch, color_cause→cc, mohs→m, geo_notes→g, energetic_role_1→er1, energetic_role_2→er2, energetic_role_3→er3, use_when→uw, affirmation→aff, color_categories→col_cats, chakras→chakras, element→element, zodiac→zodiac, primary_theme→primary_theme, all_themes→all_themes`

The app uses `energetic_role_1`, `energetic_role_2`, `energetic_role_3`. The old `energetic_role` column has been dropped from Supabase (June 3, 2026).

---

## Energetic Role System — COMPLETE ✅

### What was done this session
- Replaced free-text `energetic_role` field with three clean columns: `energetic_role_1`, `energetic_role_2`, `energetic_role_3`
- Each holds one of the 16 standardized theme names (er1 always filled, er2/er3 nullable)
- All ~270 unique free-text values mapped and bulk-updated via SQL
- All app code updated to use `er1/er2/er3` — cards, drawer tags, theme filter, search, mood match, wishlist cards, collection detail, CSV export

### The 16 standardized themes
**Grounded & Protected:** Grounding · Protection
**Heart & Emotions:** Heart Healing · Emotional Balance · Calm & Peace · Self-Love · Joy
**Mind & Spirit:** Clarity & Focus · Communication · Intuition · Spiritual Connection
**Energy & Change:** Vitality · Amplification · Transformation · Manifestation · Confidence

---

## Edge Functions (Supabase)

### claude-mood-match
- Powers the "Use When" / mood search tab
- Uses Haiku model, returns 6–8 matching stone IDs with reasons
- JWT verification: OFF — uses `sb_publishable_...` key

### claude-stone-lookup
- Powers "✦ Auto-fill with AI" on the Add Encyclopedia Entry form
- Uses Sonnet model, returns all encyclopedia fields for a stone name
- JWT verification: OFF — uses anon JWT key (confirmed working ✅)

---

## Stone Cleanup — COMPLETE ✅
- Deleted 6 null/incomplete stones: Microcline (C-0026), Orthoclase (C-0027), Quartz Striated (C-0116), Quartz Aura Aqua (C-0118), Rathbunite (C-0194), Sedonalite (C-0197)
- Deleted duplicate Prehnite (C-0364) — C-0211 is the correct entry with full photos
- Removed C-0364 photo entry from `ENCYCLOPEDIA_PHOTOS` in index.html
- Filled in full data for Peach Moonstone (C-0395)
- **Current count: 363 stones**

---

## What Was Built Session 1 (June 2–3)

### Supabase Stone Migration (Steps 1–4)
- Created `stones` table schema, migrated stones, updated app
- Stone count is now dynamic everywhere

### Theme System Overhaul
- 16 unified themes in 4 bucketed groups with category headers in filter panel
- Crystals 101 role tiles updated to match

### Stone Drawer Redesign
- Two smart pills: `+ Add to collection` and `♡ Add to wishlist`
- Collection/wishlist saves to Supabase (requires login)

### Encyclopedia Lightbox
- Photo click → lightbox with stone name caption

### Crystal Systems Popup
- SVG line drawings for all 7 crystal systems, wider popup (600px)

### Reports
- Fixed broken photos — switched from `document.write()` to Blob URLs
- Reference image pill on collection reports; single footer credit on wishlist reports

### Reference Image Badge
- Centered on encyclopedia cards; removed from wishlist cards and lightbox

### My Collection — Family View Fix
- Clicking family tile scrolls to collection grid

---

## Key Facts to Remember
- **Formspree URL:** https://formspree.io/f/xeedwkly
- **Tower and Point are separate shapes. Cabochon is deleted.**
- **Shapes tab order:** Tumbled, Palm, Raw, Freeform, Tower, Point, Sphere, Egg, Cluster, Geode, Slice, Heart, Moon, Star, Wand (then extras: Worry Stone, Pyramid, Cube, Druzy)
- **Admin emails:** kikiholz31@duck.com, christieholzwarth@gmail.com, dustin@stillpointdfw.com
- **Collection/wishlist requires login** — data lives in Supabase, not localStorage
- **CRYSTALS is now a global `let` array** populated async — never assume it's populated at script parse time; ready by the time `init()` runs
- **`_supa` client is defined at line ~6209** — loader call placed just after it; new code using `_supa` should go after this line
- **Old `energetic_role` column** still in Supabase but unused — safe to drop anytime

---

## Remaining Work

### 📱 Medium Priority
1. **Mobile QA pass** — full test on real phone

### 🗂 Low Priority / Future Sessions
2. **File structure cleanup (Step 5)** — extract CSS → `styles.css`, app logic → `app.js`
5. **Move to Cloudflare Pages (Step 6)** — connect GitHub repo, configure domain, remove CNAME
6. **Collection empty state** — improve first-time user experience
7. **Per-stone tier data** — rarity filter (needs to be set per stone)

---

## App Vision (for future reference)
- Native iOS/Android app using Expo + Supabase
- Free tier: full encyclopedia
- Paid ($2.99 IAP): My Collection + AI stone search ("find my stone by feeling")
- AI search is already live on the website and confirmed as a paid feature

---

*Session 2 complete. Energetic role system fully rebuilt with clean 3-column schema. 363 stones, data is clean. Push to GitHub is the next action.*
