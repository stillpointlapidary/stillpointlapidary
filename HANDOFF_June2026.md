# Still Point Lapidary — Session Handoff
**Date:** June 3, 2026

---

## ⚠️ Before Next Session
- **Claude Code must be opened from:** `C:\Users\chris\Documents\Claude\Still Point Lapidary\Website\`
- Do NOT use `C:\Users\chris\OneDrive\...` — OneDrive was abandoned, folder moved to local drive
- Do NOT use `C:\Users\chris\Documents\Woo\...` — stale old clone

---

## Current State
- **Live at:** stillpointlapidary.com (GitHub Pages, auto-deploys on push to main)
- **Supabase project:** vxujlgyhgnihnqrxzefw.supabase.co
- **370 stones** in the encyclopedia (363 original + 7 added via Supabase)
- **Stones live in Supabase** — `stones` table, loaded async on app startup
- **Single file:** index.html (~7,000 lines — CSS + HTML + JS combined)
- **Node/npm present** in the Website folder (used for migration scripts)

---

## Supabase Migration — COMPLETE ✅

### What was done
- `stones` table created and populated with all 370 stones
- App replaced `const CRYSTALS=[...]` (hardcoded) with async loader from Supabase
- Loader checks localStorage cache (`spl_stones_cache v2`) first → instant repeat loads
- Background refresh keeps cache current
- Loading spinner shown on first visit only (no cache)
- Stone count in all UI labels is now dynamic (updates automatically as stones are added)

### Key Supabase facts
- **Anon key (JWT):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dWpsZ3loZ25paG5xcnh6ZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjQwNDQsImV4cCI6MjA5NDkwMDA0NH0.1qWY2MsxbiNsS6zzJ1y9amD_KIVwxvoFzODbH5RJoI8`
- **Service role key** is in `supabase/migrate_stones.js` (do not commit)
- **Publishable key** (`sb_publishable_...`) is in index.html for auth — this is NOT a valid JWT for edge functions; use the anon key above
- Stone IDs: `C-0001` through `C-0395` (with gaps)
- `collection_items` and `wishlist_items` tables have FK references to `stones.id` — never drop `stones` directly

### Migration scripts (keep, don't delete)
- `supabase/migrate_stones.js` — bulk insert from index.html into Supabase
- `supabase/patch_index.js` — replaced hardcoded CRYSTALS with async loader
- `supabase/fix_loader.js` — moved loader call to after `_supa` is defined

### Field mapping (Supabase → JS short keys)
`id→i, name→n, alternate_names→a, family→fam, species→sp, material_type→mt, crystal_system→sy, formation→fo, transparency→tr, color→c, color_hex→ch, color_cause→cc, mohs→m, geo_notes→g, energetic_role→er, use_when→uw, affirmation→aff, color_categories→col_cats, chakras→chakras, element→element, zodiac→zodiac, primary_theme→primary_theme, all_themes→all_themes`

---

## Edge Functions (Supabase)

### claude-mood-match
- Powers the "Use When" / mood search tab
- Uses Haiku model, returns 6–8 matching stone IDs with reasons
- JWT verification: OFF — uses `sb_publishable_...` key

### claude-stone-lookup
- Powers "✦ Auto-fill with AI" on the Add Encyclopedia Entry form
- Uses Sonnet model, returns all encyclopedia fields for a stone name
- JWT verification: OFF — must use anon JWT key (not publishable key)
- **STATUS: Deployed but 401 errors still occurring** — the `sb_publishable_...` key is not a valid JWT for this function even with JWT verification off. Fix: ensure the fetch in index.html uses the anon JWT key above. Search for `claude-stone-lookup` fetch call in index.html and verify the Authorization header uses the anon key.

---

## What Was Built This Session (June 2–3)

### Supabase Stone Migration (Steps 1–4)
- Created `stones` table schema, migrated 370 stones, updated app
- Stone count is now dynamic everywhere

### Theme System Overhaul
- **16 unified themes** replacing the old inconsistent THEME_OPTS:
  - Grounded & Protected: Grounding, Protection
  - Heart & Emotions: Heart Healing, Emotional Regulation, Calm & Peace, Self-Love, Joy
  - Mind & Spirit: Clarity & Focus, Communication, Intuition, Spiritual Connection
  - Energy & Change: Vitality, Amplification, Transformation, Manifestation, Confidence
- Theme filter panel shows themes in 4 bucketed groups with category headers
- Crystals 101 role tiles updated to match (Amplification tile fixed, Shadow Work replaced with Emotional Regulation)
- **NOTE:** The `er` (energetic role) free-text field on individual stones has NOT been updated to match these themes — that's a data cleanup task for a future session

### Stone Drawer Redesign
- Two smart pills replacing the old toggle switches:
  - `+ Add to collection` → opens add piece form; `♥ In your collection` when owned (click to remove)
  - `♡ Add to wishlist` → adds instantly with ✓ confirmation; `♥ On your wishlist` when wishlisted (click to remove)
- `View collection →` / `View wishlist →` links appear when stone is in that state
- Wishlist/collection now saves to Supabase (requires login) — localStorage is cleared on each load by design

### Encyclopedia Lightbox
- Photo click → lightbox (fixed — was being intercepted by global click handler)
- Lightbox shows stone name caption
- All encyclopedia photos are reference images — labeled in collection reports, footer credit in wishlist reports

### Crystal Systems Popup
- Now shows SVG line drawings for all 7 crystal systems alongside descriptions
- Popup is wider (600px)

### Reports
- Fixed broken photos — switched from `document.write()` to Blob URLs (Chrome blocked cross-origin images in document.write popups)
- "Reference image" pill label on collection report photos
- Wishlist reports: no per-photo label, single footer credit instead: *Crystal reference images courtesy of Still Point Lapidary*
- Reference images option shown for collection reports only (not wishlist)
- "Use reference images" checkbox now always visible for collection reports

### Reference Image Badge
- Centered on encyclopedia cards (using CSS transform)
- Removed from wishlist cards in My Pieces view (not needed — wishlist context is clear)
- Removed from encyclopedia lightbox caption

### My Collection — Family View Fix
- Clicking a family tile now scrolls to the collection grid instead of page top

### Misc Polish
- "On wishlist · tap to view" → "On wishlist" (removed tap to view)
- Report photos use Blob URLs — fixed cross-origin image loading in print window

---

## Key Facts to Remember
- **Formspree URL:** https://formspree.io/f/xeedwkly
- **Tower and Point are separate shapes. Cabochon is deleted.**
- **Shapes tab order:** Tumbled, Palm, Raw, Freeform, Tower, Point, Sphere, Egg, Cluster, Geode, Slice, Heart, Moon, Star, Wand (then extras: Worry Stone, Pyramid, Cube, Druzy)
- **Admin emails:** kikiholz31@duck.com, christieholzwarth@gmail.com, dustin@stillpointdfw.com
- **Collection/wishlist requires login** — data lives in Supabase, not localStorage
- **CRYSTALS is now a global `let` array** populated async — never assume it's populated at script parse time; it's ready by the time `init()` runs
- **`_supa` client is defined at line ~6209** — the loader call is placed just after it; any new code that uses `_supa` should also go after this line

---

## Remaining Work

### 🔧 High Priority
1. **AI Auto-fill 401 fix** — `claude-stone-lookup` edge function returns 401. The fetch in index.html needs to use the anon JWT key (see above). Search for `claude-stone-lookup` and verify the Authorization header.

2. **`er` field data alignment** — The `energetic_role` field on stones uses free-text like "Grounding / Stabilizing" but the new theme filter uses exact values like "Grounding". These should be aligned so that `er` values match the 16 THEME_OPTS exactly. This is a bulk data update in Supabase — update the `energetic_role` column on all 370 stones to use the standardized theme names.

### 📱 Medium Priority
3. **Mobile QA pass** — full test on real phone

### 🗂 Low Priority / Future Sessions
4. **File structure cleanup (Step 5)** — extract CSS → `styles.css`, app logic → `app.js`
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

*The Supabase migration is complete. The app is in great shape. Main priorities: fix the AI auto-fill auth header, then align the er field data with the new theme system.*
