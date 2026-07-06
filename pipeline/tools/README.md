# Pipeline Tools

Small, guarded, single-purpose scripts that support the encyclopedia pipeline
but aren't part of the Gate 0 → Gate 7 sequence documented in `pipeline/README.md`.

## `update-production-master-row.js`

Updates a small set of **approved administrative columns** on exactly one
stone row in the canonical Production Master, identified by exact Stone ID.
Built for the fast path of a single already-approved edit (e.g. flipping
`Encyclopedia Production Status` after a successful import), not for
catalog-wide or structural changes.

### What it does

1. Opens the canonical workbook and the `Catalog Master` sheet.
2. Matches the target row by **exact, normalized Stone ID only** — refuses if
   zero or more than one row matches.
3. Validates every requested column against a fixed allow-list, using exact
   header matching (after stripping the `Group X — Label | ` prefix) — no
   substring or fuzzy matching. Refuses if a header is missing, ambiguous, or
   not on the allow-list.
4. Prints before/after values for every field.
5. Creates a timestamped backup of the workbook in `snapshots/` (next to the
   live file) before writing anything.
6. Writes the new values as a **surgical edit of the raw worksheet XML**
   inside the .xlsx zip — only the target cell(s) change; every other byte
   of the archive (styles, data-validation dropdowns, other rows, other
   sheets) is left alone. See the comment at the top of the script for why
   this doesn't just use `XLSX.readFile()` / `XLSX.writeFile()` — a plain
   round trip through the `xlsx` package was tested against the real
   Production Master and silently dropped all 17 data-validation dropdowns
   and collapsed `styles.xml`.
7. Reopens the saved workbook and rereads the row to confirm every value
   matches exactly what was written.
8. Prints a final `PASS`/`FAIL` and exits nonzero on any failure.

### What it must NOT be used for

- Choosing or inferring any value — it only writes what you put in `updates`.
- Editorial decisions of any kind.
- Multiple stones in one run, or matching by name/slug instead of Stone ID.
- Any column outside the allow-list below.
- Supabase, canonical MDs, packet generation, or imports — this script only
  ever touches the Production Master workbook.

### Allowed columns

```
Element
Zodiac
Encyclopedia Energetic Role
Energetic Role Icon
Color Energy
Encyclopedia Production Status
Research Status
Canonical MD Status
Supabase Status
Structured Data Status
Blocker
Notes
```

If a requested column isn't on this list, or isn't found in the workbook
under its exact expected header, the script reports the problem and stops —
it never guesses.

### Example input

```json
{
  "production_master_path": "C:\\Users\\chris\\Documents\\Still Point Lapidary\\Encyclopedia\\Production Data\\Still-Point-Lapidary-Production-Master.xlsx",
  "stone_id": "C-0188",
  "updates": {
    "Encyclopedia Production Status": "Full Entry Live",
    "Notes": "Full Entry Live — Gate 4 atomic import and publication completed successfully on 2026-07-05."
  }
}
```

### Example command

```
node pipeline/tools/update-production-master-row.js --input path/to/update.json
```

Or inline:

```
node pipeline/tools/update-production-master-row.js --json "{\"production_master_path\":\"...\",\"stone_id\":\"C-0188\",\"updates\":{\"Notes\":\"...\"}}"
```

Add `--dry-run` to see the before/after report and validation result without
writing anything (no backup is created in this mode, since nothing is
written).

### Before running against the real Production Master

**Christie, Dustin, or Lyra must approve the exact values** in `updates`
before Claude Code runs this script. This tool does not judge whether a
value is correct — it only writes it safely.

If you want to try the script risk-free first, copy the workbook to a
temporary path outside `Encyclopedia/Production Data/` and point
`production_master_path` at the copy.

### Recovery

If a run reports `FAIL` after the write step, or the workbook looks wrong
afterward, restore from the backup the script printed under
`Encyclopedia/Production Data/snapshots/` — the original is never modified
until after that backup is written.
