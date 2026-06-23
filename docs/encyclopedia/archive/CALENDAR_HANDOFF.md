# SOTD Calendar — Feature Handoff
**Project:** Still Point Lapidary — Encyclopedia / Admin
**Last updated:** 2026-06-14
**Current HEAD:** a230fd4
**Status:** Single-date scheduler complete and verified. Mobile my collection work not yet started.

---

## What Was Completed This Session

### Calendar read-only (previously complete)
Full month grid with history (blue) and scheduled (gold) cells, today highlight, month navigation, cache, legend. Entry point: admin-only button in the Manage popup.

### SOTD Scheduler Modal — fully implemented and verified

Clicking any calendar date opens a dedicated modal. Mode depends on the date and entry type:

| Date type | Modal mode |
|---|---|
| Empty future date | Editable form — assign stone + optional editorial fields |
| Existing scheduled (`source='schedule'`) | Editable form pre-filled + Remove Schedule |
| History date (`source='history'`) | Read-only detail view + View stone button |
| Any other populated future | Read-only detail view |

**Form fields (editable mode):**
- Stone (combobox with alias search)
- Stone preview: photo thumbnail or color dot (mapped `crystal.ch`)
- Optional editorial details: Event name, Event category, Event location, Editorial note

**Event category dropdown — approved labels (10 options):**
Moon & Lunar Phases, Eclipses, Meteor Showers, Planetary & Orbital Events, Seasons & Solar Turning Points, Holidays & Traditions, Geology & Earth History, Location Spotlight, Still Point Milestone, Other Editorial

**Save behavior:**
- INSERT uses `selection_type: 'fixed'`, `is_active: true`, `feature_date`
- UPDATE patches the same fields on the existing row
- Both wait for Supabase confirmation before refreshing
- Cache for the affected month is cleared; grid re-renders
- Plain dates (no event fields) save correctly with no editorial banner
- `_isSotdEditorial` requires non-empty `eventName` — `fixed` + no name = ordinary cell

**Remove Schedule:**
- Clicking reveals inline confirmation row (scrolls into view smoothly)
- `Keep it` hides the row again
- `Yes, remove` DELETEs the row, clears cache, re-renders

**Keyboard / focus:**
- Escape closes the stone combobox only; does NOT close the scheduler modal
- Calendar's own Escape listener defers when the scheduler is open
- Close button (✕) and Cancel button dismiss the scheduler

**Calendar cell visuals:**
- Every populated cell shows a small photo thumbnail (bottom-left, 20×20) or color dot
- Empty future cells show a `+` indicator and are interactive buttons

---

## Supabase State

### Schema confirmed
```
stone_of_day_schedule:
  id            uuid PK
  stone_id      text (references stones.id)
  feature_date  date UNIQUE NOT NULL
  is_active     boolean default true
  created_at    timestamptz
  selection_type text
  event_name    text
  event_category text
  event_priority integer
  event_location text
  editorial_note text
  source_url    text
```

All event fields (`event_priority`, `event_location`, `editorial_note`, `source_url`) are physical columns on `stone_of_day_schedule`. No separate `stone_of_day_context` table is used by any JS.

### RLS — action required before first write
RLS is enabled on `stone_of_day_schedule` but no admin write policies exist yet. Christie must add:

```sql
create policy "Admins can manage schedule"
  on public.stone_of_day_schedule
  for all
  using (
    auth.jwt() ->> 'email' in (
      'kikiholz31@duck.com',
      'christieholzwarth@gmail.com',
      'dustin@stillpointdfw.com'
    )
  )
  with check (
    auth.jwt() ->> 'email' in (
      'kikiholz31@duck.com',
      'christieholzwarth@gmail.com',
      'dustin@stillpointdfw.com'
    )
  );
```

### selection_type values
- `fixed` — all 182 existing schedule rows; used for new scheduler inserts
- `random` / `emergency` — written by the server-side resolver to history
- `_isSotdEditorial` excludes `random` and `emergency`; accepts anything else with a non-empty `eventName`

---

## Mobile Magic-Link Fix (also complete)

**File:** `auth.js` — `submitMagicLink`
**Change:** `emailRedirectTo: window.location.href` → `window.location.origin + window.location.pathname`

**Christie must also verify** in Supabase Auth → URL Configuration that both origins are whitelisted:
- `https://stillpointlapidary.com`
- `https://www.stillpointlapidary.com`

---

## What Is Not Built Yet

### Mobile My Collection (full spec in previous session transcript)
Implement in this order:

1. **Count spacing and wording** — `24 pieces in your collection` / `7 stones on your wishlist`
2. **Collapsed tier summary** — slim segmented color bar preserving tier colors
3. **Expanded tier rows** — tier name, count, percentage, color, proportional bar; handle zero collection
4. **Report/export placement** — move to bottom section under "Reports & export" heading, not sticky
5. **Report field audit + selection UI** — audit which fields exist on stone object vs. collection entry vs. current report generator before adding anything
6. **Wishlist notes** — audit `wishlist_items` for a `notes` field; wire through if present, provide SQL if not

### Phoenix Stone alias
Deferred. `comboRender` already searches `c.a` (alternate_names). If Phoenix Stone doesn't appear, it is a data issue — add "Phoenix Stone" to that stone's `alternate_names` in Supabase. No code change needed.

### Next calendar phase (not designed yet)
Bulk scheduling, sequence generation, reroll, lock/unlock, approve generated dates — not started. Design after single-date scheduler is verified in production.

---

## Key File Reference

| File | What's there |
|---|---|
| `encyclopedia.js` lines 1124–1147 | `_sotdCalCellThumbHTML`, `_sotdCalStoneName`, `_sotdCalMonthLabel` |
| `encyclopedia.js` lines 1149–1350 | All calendar UI: open/close, render, build grid, nav, today, openDay |
| `encyclopedia.js` lines 1351–1750 | Full scheduler: state, open, close, form HTML, history view, save, delete, Escape |
| `encyclopedia.html` lines ~1898–1935 | Calendar overlay HTML |
| `encyclopedia.html` lines ~1936–1948 | Scheduler modal shell |
| `styles.css` lines ~2273–2540 | All calendar + scheduler CSS |
| `app.js` line 2035 | `ADMIN_EMAILS` array |
| `app.js` lines 1283–1314 | `SOTD_EVENT_PRESENTATION`, `getSotdEventPresentation`, `_isSotdEditorial` |
| `auth.js` line 235 | `submitMagicLink` — magic link redirect fix |
| `supabase/stone_of_day_schedule.sql` | Table schema + public read policy |
| `supabase/get_sotd_calendar_month.sql` | RPC that powers the calendar read |

---

## Scope Rules (carry forward)
- Calendar-specific JS stays in `encyclopedia.js`
- Shared SOTD presentation (`_isSotdEditorial`, `getSotdEventPresentation`, `setSotdContext`) stays in `app.js`
- Do not create `core.js`
- Do not convert to ES modules
- Do not alter `stone_of_day_schedule` schema without explicit approval
- Do not push without Christie's explicit approval
- Christie handles all Supabase queries, browser testing, screenshots, console review, commit, and push
