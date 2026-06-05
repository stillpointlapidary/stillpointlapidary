# Still Point Lapidary — Session Handoff
**Date:** June 5, 2026  
**Next session picks up here.**

---

## ✅ COMPLETED THIS SESSION

### Hero Section (LOCKED)
- Georgia serif, 30px, weight 400
- Background: `#f5f3ef`
- Gold accent: `#c8a96e` throughout
- Headline: "Your curated reference for *intuitive work* / *and practical collecting*"
- Sub text: "363 stones. AI-powered mood matching. Your personal collection — tracked, searchable, and always with you."
- Buttons: START EXPLORING (gold `#c8a96e`, dark text) + IDENTIFY A STONE (outlined)
- Stone of the Day card: 340px wide, 130px photo, label in card body (Option A), no pill/badge
- SOTD rotates daily from FEATURED_STONES array based on date
- Hero is live and approved ✓

### Global Typography Pass
- `--ink` lightened to `#524d47` (less stark on headings)
- `--ink2: #6b6560`, `--ink3: #9a948e` adjusted proportionally
- `--accent2` updated to `#c8a96e` (vibrant gold, consistent)
- Base font: 16px
- All 36 Cormorant Garamond instances → Georgia site-wide
- font-weight 300 → 400 on all serif display elements
- Wordmark: Georgia 20px weight 400
- Mood intro: 28px → 22px
- Nav tabs, buttons, filters, search, cards, drawer — all bumped for readability

### Use When Tab
- Option C implemented: hint text replaces "& Subtitle" on category tiles
  - Grounding: *Presence, stability, / inner calm*
  - Heart: *Love, compassion, forgiveness*
  - Mind: *Mental clarity, motivation, fresh perspective*
  - Spirit: *Intuition, inner wisdom, spiritual awareness*
  - Body: *Energy, resilience, vitality*
- hint text: italic, 10px, opacity 0.75
- All live ✓

### Misc
- "Browse all 363 stones →" link: darker, more readable
- Stone detail drawer photo: white background (awaiting Christie's final background color decision)
- Crystals 101 callout boxes: "Key point" label removed — gold border speaks for itself

---

## 🔧 APPROVED IN MOCKUP — NOT YET IMPLEMENTED

### Footer (audit-mockup.html has Before + Option A + Option B)
- **Decision needed:** Option A (two-column, studio prominent) vs Option B (minimal, centered)
- **Christie's direction:** "Still Point Lapidary as standalone resource, but drives business to Dustin"
- **My recommendation:** Option A simplified — leads with SPL identity, gives Still Point {technodelic} Studio its own column with description + "Visit stillpoint.studio →" CTA
- **Do NOT include:** links to Encyclopedia/tabs in footer
- **DO include:** © 2025 Still Point {technodelic} Studio, Dallas/Fort Worth

---

## 📋 NEXT SESSION TASK LIST

### 1. Site Architecture — BIG DECISION
**Proposal:** Split Encyclopedia into its own page/URL
- **Homepage** (what logo click lands on): Hero + Stone of the Day + Ten Stones only
  - Name: "Home" tab, or no tab (logo = home, nav starts at Encyclopedia)
  - Ten Stones gets "Browse all 363 →" CTA linking to Encyclopedia
- **Encyclopedia** (`/encyclopedia`): Full search + filters + 363-card grid
  - Becomes a purposeful destination, not overwhelming landing experience
- **Questions to answer next session:**
  - Does Encyclopedia stay as a tab or get its own URL?
  - Does homepage tab get named "Home" or "Discover"?
  - Navigation order after split?

### 2. Stone of the Day — Expanded View
- Currently: clicking card opens the stone's detail drawer
- **Proposed upgrade:** Dedicated SOTD experience
  - Today's date displayed prominently
  - Large stone photo
  - "Why today" — brief note (moon phase / season / rotating intention)
  - Stone's affirmation: *"I trust my perception."*
  - Key properties + Use When text
  - "Add to my collection" CTA
  - Social share card: "Today's stone is Labradorite — Still Point Lapidary"
- **Strategic note:** This is the #1 driver of daily return visits. SOTD as morning ritual = habit = word of mouth

### 3. Stone of the Day Calendar (through end of 2027)
- Pre-planned calendar, not just date-based rotation
- Overrides for: moon phases, seasons, holidays, crystal-relevant events
- Stones can repeat when contextually appropriate
- Monthly reminder set to re-evaluate the calendar
- Currently: rotates through FEATURED_STONES array by day number

### 4. Use When Tab — UX Overhaul
- **Initial state:** Show ONLY the two-panel top section (AI search + category tiles)
- **30-mood list:** Hidden on load
- **On tile click:** Reveal ONLY the cards for that selected category
- **Reset button:** Appears after selection; collapses cards, returns to clean state
- Don't change the visual design of the tiles — just the show/hide behavior

### 5. Identifier — Heft Filter
- Add "appropriate for its size" option alongside light/heavy
- Represents average weight for the stone type (not unusually light or heavy)

### 6. Crystal Shapes — Navigation Arrows
- Current: arrows sit on top of the photo, overlapping
- Fix: move arrows outside the photo borders (in the margins/gutters)
- Photo should always be unobstructed

### 7. Mobile Site Pass
- Full audit incorporating all design changes from this session
- Hero responsive behavior (SOTD hidden below 768px already done)
- Navigation, cards, drawer, Use When — all need mobile review

### 8. Collection / Wishlist Layout
- Revisit AFTER Encyclopedia page architecture is finalized
- Current: 4-column card grid
- Consider: photo size, card proportions, sort/filter placement

### 9. Empty States — Redesign
- Collection empty: ◇ icon + warmer messaging
- Search no results: warmer, more on-brand
- Already mocked up in audit-mockup.html — needs implementation

### 10. Loading States
- Subtle skeleton loader instead of blank flash
- Affects: encyclopedia grid, collection, mood results

### 11. Stone Detail Drawer — Photo Background
- Christie to confirm final background color for stone photos
- Currently: white `#ffffff` placeholder in audit mockup
- Once confirmed, update `.sotd-card-photo` and drawer photo background

### 12. Footer — Implementation
- See "Approved in Mockup" above
- Implement chosen option after decision

### 13. Full Site Audit Pass (Remaining)
- Encyclopedia card layout (photo height, card padding fine-tuning)
- Collection tab (stats bar, card names, metadata)
- Identify tab
- Crystals 101 (section headers, body text, callout boxes — key point removed ✓)
- All already visible in audit-mockup.html

---

## 🚀 STRATEGIC NOTES (for traffic + growth)

1. **Daily ritual** — SOTD as morning practice. Shareable "Today's stone" social card = Instagram/TikTok/Pinterest traffic
2. **SEO goldmine** — 363 individual stone pages with real URLs. "What does Labradorite mean?" = 8,000+ searches/month. Architecture change (step 1) unlocks this.
3. **Use When is unique** — AI mood-to-stone matching. Nobody else does this. Shareable, press-worthy.
4. **Still Point Studio bridge** — Visitors are pre-qualified leads for Dustin's in-person work. Footer CTA + natural language: "This resource is free. The in-person work is where it goes deeper."

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `index.html` | Live site — main app |
| `styles.css` | All site styles |
| `app.js` | All site logic, FEATURED_STONES, SOTD |
| `hero-mockup.html` | Approved hero reference (LOCKED) |
| `audit-mockup.html` | Full site component audit — before/after |
| `usewhen-mockup.html` | Use When options A/B/C — Option C approved |

---

## 🎨 DESIGN TOKENS (current approved values)

```
--ink:     #524d47   (main text, headings)
--ink2:    #6b6560   (body text)
--ink3:    #9a948e   (labels, captions)
--accent:  #8b7355   (buttons, active states)
--accent2: #c8a96e   (gold — italics, labels, highlights)
--stone:   #f7f5f2   (page background)
--white:   #faf8f6   (card backgrounds)
--hero-bg: #f5f3ef   (hero section background)

Hero headline: Georgia, 30px, weight 400
Body font: Jost, sans-serif, 16px base
All serif display: Georgia, 'Times New Roman', serif, weight 400
```

---

## ⚠️ KNOWN ISSUES / WATCH LIST

- Screenshot tool in preview server times out frequently — use `preview_eval` to verify instead
- `hero-mockup.html` is the LOCKED approved reference — do not overwrite without explicit approval
- Stone detail drawer photo background is a placeholder — Christie will provide final color
- Cloudflare deploys from GitHub main branch, ~1 min after push

---

*End of handoff. See you next session! 🌑*
