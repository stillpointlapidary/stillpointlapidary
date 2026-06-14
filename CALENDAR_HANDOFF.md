# SOTD Calendar — Feature Handoff
**Project:** Still Point Lapidary — Encyclopedia / Admin
**Last updated:** 2026-06-14
**Status:** Read-only calendar working; scheduling and editing features not yet built

---

## What This Document Is For

Starting point for a new session focused on refining and extending the Stone of the Day Calendar feature. The read-only calendar view is fully functional. The next phase is building the scheduling and editing workflow.

---

## What Exists Today

### Entry point
`encyclopedia.html` line 1872 — admin-only button in the Manage popup:
```html
<button ... onclick="openSotdCalendar();closePopup('manage')">📅 Stone of the Day Calendar</button>
```
Visible only to admin users (controlled by `isAdminUser(_currentUser)` check inside `openSotdCalendar`).

### HTML overlay
`encyclopedia.html` lines 1898–1933 — `#sotd-cal-overlay`

Contains:
- Month nav (`_sotdCalNav(-1)` / `_sotdCalNav(1)`)
- Month title (`#sotd-cal-title`)
- Today button (`_sotdCalGoToday`)
- Close button (`closeSotdCalendar`)
- Day-of-week header row
- Grid container (`#sotd-cal-grid`) — filled by JS
- Legend: history swatch, scheduled swatch

### JS — `encyclopedia.js` lines 1041–1335

| Function | Purpose |
|---|---|
| `getSotdCalendarMonth(year, month)` | Async RPC call — reads `get_sotd_calendar_month` Supabase function; returns array of `SotdCalendarEntry` or null on error |
| `openSotdCalendar(year, month)` | Admin-gated open; sets state, shows overlay, calls `_sotdCalRenderMonth` |
| `closeSotdCalendar()` | Removes overlay classes, returns focus to manage button |
| `_sotdCalRenderMonth(year, month)` | Async render coordinator — serves from cache or fetches; calls `_sotdCalBuildGrid` |
| `_sotdCalBuildGrid(entries, year, month, today)` | Renders all day cells into `#sotd-cal-grid` |
| `_sotdCalRetry()` | Clears cache for current month and re-renders |
| `_sotdCalNav(dir)` | Advances month by +1 or -1 |
| `_sotdCalGoToday()` | Jumps to current Chicago month |
| `_sotdCalOpenStone(stoneId, dateStr, year, month)` | Opens encyclopedia detail drawer for a calendar date; sets `detailReturnContext` so back-navigation returns to the calendar at the same month |
| `_sotdCalStoneName(stoneId)` | Looks up stone name from global `CRYSTALS` array |
| `_sotdCalMonthLabel(month)` | Returns full month name string |
| `_sotdCalChicagoToday()` | Returns today's date string in `YYYY-MM-DD` format, Chicago timezone |

### State variables
```js
let _sotdCalYear  = null;      // currently displayed year
let _sotdCalMonth = null;      // currently displayed month (1-indexed)
const _sotdCalCache     = new Map(); // 'YYYY-MM' → entries[] | null
const _sotdCalEntryStore = new Map(); // 'YYYY-MM-DD' → entry (for passing to drawer)
```

### SotdCalendarEntry shape
```js
{
  date:          'YYYY-MM-DD',
  stoneId:       string,
  source:        'history' | 'schedule',
  selectionType: string | null,
  eventName:     string | null,
  eventCategory: string | null,
  eventPriority: number | null,
  eventLocation: string | null,
  editorialNote: string | null,
  sourceUrl:     string | null,
  isToday:       boolean,
  isPast:        boolean,
  isFuture:      boolean,
}
```

### Cell rendering rules (current)
- **Empty date** → grey non-interactive cell with day number
- **History entry** (`source === 'history'`) → interactive button, blue-toned swatch
- **Scheduled entry** (`source === 'schedule'`, non-editorial) → interactive button, purple/scheduled dot
- **Editorial entry** (`_isSotdEditorial(entry)` true) → interactive button, event icon from `getSotdEventPresentation(eventCategory)`, colored by event family

### Dependencies from app.js (always available since app.js loads first)
- `isAdminUser(_currentUser)` — admin gate
- `CRYSTALS` — stone name lookup
- `_isSotdEditorial(entry)` — editorial flag logic
- `getSotdEventPresentation(eventCategory)` — returns `{ icon, family }` for event styling
- `setSotdContext('calendar', entry)` — sets SOTD drawer context
- `detailReturnContext` — global for drawer back-nav
- `openDetail(stoneId)` — opens encyclopedia detail drawer

---

## Supabase Layer

### RPC used by the calendar
`get_sotd_calendar_month(p_year, p_month)` — reads both `stone_of_day_history` and `stone_of_day_schedule`, merges them, returns sorted rows.

### Tables relevant to SOTD scheduling
| Table | Purpose |
|---|---|
| `stone_of_day_history` | Resolved past/present dates — source of truth for what actually ran |
| `stone_of_day_schedule` | Future (and editorial) scheduled dates — admin edits go here |
| `stone_of_day_context` | Editorial context for scheduled entries (event metadata) |

### Current write path
None in the calendar yet. The existing `renderSotd` flow in app.js writes to `stone_of_day_history` when it resolves a date. The calendar is read-only.

---

## What Is Not Built Yet

### 1. Schedule a stone on a future date
Clicking an empty future date should allow an admin to assign a stone. Currently empty cells are non-interactive divs.

### 2. Edit an existing scheduled entry
Clicking a `source === 'schedule'` cell should let an admin change the stone or add/edit event metadata.

### 3. Unschedule / clear a future date
Remove a scheduled entry from `stone_of_day_schedule`.

### 4. Schedule an editorial / event entry
Assign a stone to a date with event metadata (`eventName`, `eventCategory`, `eventLocation`, etc.). Currently the editorial display logic exists (`_isSotdEditorial`, `getSotdEventPresentation`) but there is no UI to create editorial entries.

### 5. Cache invalidation after writes
After any write, the relevant month's cache entry (`_sotdCalCache`) must be cleared and the grid re-rendered.

---

## Design Decisions Still Open

- **Inline editing vs. modal:** Should clicking a cell open an inline edit form inside the calendar, or a separate modal/overlay?
- **Stone picker:** The combobox pattern (`comboRender`, `comboFilter`, `comboSelect`) from app.js is the established pattern — reuse it rather than building a new one.
- **Optimistic vs. confirmed updates:** Re-render after confirmed Supabase write or optimistically?
- **History dates:** Past `source === 'history'` entries probably should not be editable from the calendar (they are the resolved truth). Needs Christie's decision.
- **Event metadata form:** How much of the `stone_of_day_context` / editorial fields should be editable from the calendar UI?

---

## Refactor Rules (carry forward from JS refactor phase)

- Do **not** convert to ES modules
- Do **not** alter the Supabase schema without explicit approval
- Do **not** add calendar write functions to app.js — they belong in encyclopedia.js
- Do **not** push without Christie's explicit approval
- Any new functions follow the `_sotdCal*` naming prefix

---

## File Reference

| File | Relevant lines | What's there |
|---|---|---|
| `encyclopedia.js` | 1041–1335 | All calendar JS |
| `encyclopedia.html` | 1872 | Admin trigger button |
| `encyclopedia.html` | 1898–1933 | Calendar overlay HTML + legend |
| `app.js` | ~1097–1845 | SOTD rendering, `_isSotdEditorial`, `getSotdEventPresentation`, `setSotdContext` |
| `HANDOFF.md` | — | Full JS refactor context; do not modify during calendar work |
