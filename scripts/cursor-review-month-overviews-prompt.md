# Cursor prompt: Review planting calendar month overview accuracy (full coverage)

Copy **everything below the horizontal rule** into a new Cursor chat (Agent mode). @-mention the audit files and source modules.

**Scope: exhaustive.** You must review **every row** in the audit CSV (306 places × 12 months = **3,672** overviews). **No spot-checking, no sampling, no “representative places”.** If you cannot finish in one session, batch by location and resume until row count = 3,672.

---

You are an expert Australian horticulture reviewer and QA engineer. Your job is to **verify that GrowGuide’s Planting Guide year-view month overviews are accurate for every app location**, using the pre-generated audit exports and source code—not guesswork.

Be sceptical. Flag copy that is wrong for the climate, too generic, contradicts the sow/plant lists on the same month card, or ignores obvious local patterns (wet season in Darwin, Mediterranean winter sow in Perth, frost in Tasmania). Every flagged row must cite **CSV fields** (`place`, `state`, `climate`, `zone`, `tags`, `month`, `overview`).

## Product context

**GrowGuide** (Next.js) shows a **Planting Guide** at `/planting-calendar/` — a Jan–Dec scroll with one card per month. Each card has:

| Section | Source |
|---------|--------|
| **Overview** (paragraph) | `getRichMonthOverviewForLocation()` — **this review** |
| **Sow / Plant lists** | `buildClimatePlantingGuideForLocation()` → climate planting matrices (separate data; must not contradict overview) |

The overview is **planning context**, not a task list. It should read like a knowledgeable local gardener describing what the month feels like and what to prioritise.

**Constraints for user-facing copy:**
- Australian English
- Southern hemisphere seasons (Summer Dec–Feb, Autumn Mar–May, Winter Jun–Aug, Spring Sep–Nov)
- No em dashes
- Climate-first (not state-first) when the user has a resolved climate

## How overview text is built (read these files first)

1. **`app/data/planting-calendar/helpers.ts`** — `getRichMonthOverviewForLocation()`
2. **`app/data/planting-calendar/month-guidance.ts`** — `getMonthGuidance()`, `monthGuidanceToRichOverview()`
3. **Climate matrices** (12 months each, structured `focus` + `tasks` + `risks` + optional `avoid`):
   - `month-guidance-cold.ts`
   - `month-guidance-cool.ts`
   - `month-guidance-temperate.ts`
   - `month-guidance-warm.ts`
   - `month-guidance-tropical.ts`
4. **`lib/microclimate/guidanceModifiers.ts`** — may tweak the **opening sentence only** via `getMonthGuidanceForUser()`
5. **`app/components/planting-calendar/PlantingGuideYearView.tsx`** — renders overview on each month card
6. **Legacy fallback** (only when climate unknown): `rich-state-month-summaries.ts` + `DEFAULT_RICH_MONTH_SUMMARIES`

**Rich overview formula:**  
`focus` (1 sentence) + up to 3 `tasks` (joined as second sentence) + up to 2 `risks` (prefixed “Watch for …”).  
Microclimate tags adjust `focus` only; tasks/risks stay from the base climate row.

## Audit artefacts (ground truth for “what the app computes”)

Path: `scripts/audit-output/month-overviews/`

| File | Rows | Use for |
|------|------|---------|
| `climate-baseline.txt` | 5 climates × 12 months = 60 | Canonical matrix (review all 60) |
| `all-locations.csv` | **3,672** (306 places × 12 months) | **Review every row** |
| `all-locations.txt` | Same data, grouped by location | Human reading while batching |

**Regenerate inputs:**

```text
npm run dump:month-overviews
```

Script: `scripts/dump-month-overviews.ts`  
Uses **`getRichMonthOverviewForLocation()`** + **`AU_PLACES`** from `lib/places`.

### CSV columns (input)

`place`, `state`, `climate`, `zone`, `tags`, `month`, `overview`

**Note:** ~52 unique overview strings exist across 3,672 rows. You may **derive verdicts efficiently** by reviewing each unique `(climate, tags, month, overview)` combination once, then **propagate** to all places sharing that string—but the **deliverable must still contain exactly 3,672 row-level verdicts** (one per place per month). Do not skip rows because they duplicate another place.

## Climate → zone mapping (verify every place’s `climate` column matches `zone`)

From `lib/types/location.ts` → `mapZoneToClimate()`:

| Zone | Climate |
|------|---------|
| 8a, 8b | cold |
| 9a, 9b | cool |
| 10a, 10b | temperate |
| 11a, 11b | warm |
| 12a, 12b | tropical |

Flag any CSV row where `climate` disagrees with `zone`.

## Your task

Verify **horticultural accuracy** and **internal consistency** for **all 3,672 place-month overviews**.

### Phase 1 — Structural sanity (full file)

1. Confirm `climate-baseline.txt` has exactly **60** non-empty entries.
2. Confirm `all-locations.csv` has exactly **3,672** data rows (plus header).
3. Confirm **306 unique** `(place, state)` pairs, each with exactly **12** months (Jan–Dec, no gaps, no duplicates).
4. Recompute **all 3,672** overviews via script (`getRichMonthOverviewForLocation`) and diff against CSV; report any mismatch.
5. Confirm **zero rows** use legacy state-keyed prose when `climate` is set (no QLD “wet season” copy on `temperate` rows, etc.).
6. For every row where `overview` differs from that row’s climate-only baseline, confirm the difference is explained by `tags` in `guidanceModifiers.ts`.

### Phase 2 — Climate baseline (all 60)

Review **every row** in `climate-baseline.txt`.

| Climate | Must reflect | Common failure modes |
|---------|--------------|-------------------|
| **cold** | Short summer, early frosts, protected sowing, brief spring | Sounds like Sydney; ignores frost; outdoor tomatoes in winter |
| **cool** | Mild summer, frost-aware spring/autumn | Too hot/dry; missing frost caution |
| **temperate** | Distinct seasons, Sydney/Melbourne-style patterns | Generic; ignores summer heat or winter frost |
| **warm** | Subtropical humidity, storms, dry winter growing | Sounds temperate; ignores humidity/build-up |
| **tropical** | Wet/dry seasons, drainage, fungal pressure | Temperate four-season language; wrong wet/dry timing |

Verdict per row: **Correct / Minor wording / Wrong / Uncertain** + one-line reasoning.

### Phase 3 — Full location review (all 3,672 rows)

For **each row** in `all-locations.csv`:

1. Read `place`, `state`, `climate`, `zone`, `tags`, `month`, `overview`.
2. Judge whether the overview is **accurate for that place in that month** given climate, zone, tags, and state.
3. Optionally cross-check sow/plant lists for that place-month via `buildClimatePlantingGuideForLocation` — flag **contradictions** (overview says “peak summer planting” while lists are empty or winter-only).
4. Assign verdict: **Correct / Minor wording / Wrong / Uncertain**.
5. If not **Correct**, add `issue` (one line) and `suggested_fix` (one line, tagged `data` | `code` | `content`).

**Batching (required for completion):** Process locations alphabetically by `state`, then `place`. After each batch of ~25 places (300 rows), append to the output file and report progress (`rows_done / 3672`).

**Efficiency rule:** You may review a unique overview string once, but you must still emit **3,672 output rows**. When propagating a shared verdict, verify the tag/zone/climate context truly matches (e.g. do not assume all `temperate` rows share Perth’s Mediterranean tweak).

### Phase 4 — Full-file pattern scan (all rows)

Run programmatic scans over **all 3,672 rows** (script or CSV filter) and list **every matching row** (not samples):

1. Tropical `climate` + overview mentions **frost** (except valid “cool nights on elevated inland sites”).
2. `climate` in {cool, cold, temperate} + June–August overview reads like **peak summer planting**.
3. `tags` contains `mediterranean` + winter months missing **winter-rain / Mediterranean grow window** themes where expected.
4. `tags` contains `tropical_wet_dry` + wrong season language (wet vs dry month).
5. Overview **contradicts** sow/plant list for same place-month (requires generated cross-check file or inline script).
6. Any row still using **legacy state prose** instead of climate-first copy.

### Phase 5 — Copy quality (all unique strings)

Review all ~52 unique `overview` strings for length, repetition (focus vs tasks), actionable “Watch for”, Americanisms, em dashes, northern-hemisphere slips. Note which place-month rows inherit each issue.

## Required deliverable files

Write these under `scripts/audit-output/month-overviews/`:

### 1. `review-verdicts.csv` (mandatory)

**Exactly 3,672 data rows** + header:

```text
place,state,climate,zone,tags,month,overview,verdict,issue,suggested_fix,fix_tag,sow_plant_conflict
```

- `verdict`: Correct | Minor wording | Wrong | Uncertain
- `issue`: empty if Correct
- `suggested_fix`: empty if Correct
- `fix_tag`: empty if Correct; else `data` | `code` | `content`
- `sow_plant_conflict`: yes | no

### 2. `review-summary.txt` (mandatory)

- Total rows reviewed: must be **3672**
- Count by verdict
- Count by `fix_tag`
- List of **every** `(place, state, month)` with verdict **Wrong** or **Uncertain** (full list, not top N)
- Unique overview count and how many rows each unique string covers

### 3. Optional helper script

You may add `scripts/review-month-overviews.ts` to automate structural checks, recompute diff, and sow/plant conflict detection—but **horticultural verdicts must still cover all 3,672 rows**.

## Chat output format (summary only)

The chat response is a **summary**; the **authoritative full review is the CSV**.

**A. Executive summary** (8–12 bullets)

**B. Structural QA** (table: check | pass/fail | notes | rows_affected)

**C. Climate baseline** (table: all 60 rows | verdict | issue)

**D. Full review stats**

| Metric | Value |
|--------|-------|
| Rows reviewed | must be 3672 |
| Correct | n |
| Minor wording | n |
| Wrong | n |
| Uncertain | n |
| Sow/plant conflicts | n |

**E. All Wrong + Uncertain rows** (complete list: place, state, month, verdict, issue — or “see review-verdicts.csv” only if the CSV is attached and verified complete)

**F. Pattern scan results** (each pattern: match count + **full row list** or CSV line refs)

**G. Recommended fixes** (prioritised, tagged)

**H. Regression tests** (5–10 cases derived from Wrong rows)

## Approval criteria (strict)

Do **not** approve unless:

- [ ] `review-verdicts.csv` exists with **exactly 3,672** data rows
- [ ] Every place in `all-locations.csv` appears **12 times** in verdicts
- [ ] Phase 2 complete (60 climate baselines)
- [ ] Phase 4 pattern scans list **all** matching rows, not samples
- [ ] Recompute diff vs CSV is **zero** mismatches (or mismatches documented as export bug)

Partial reviews are **not acceptable**. Continue batching until done.

## Reference: seasonal anchors (cross-check only)

| Region type | Jan | Jun | Sep |
|-------------|-----|-----|-----|
| Cold/cool south | Harvest, heat spikes, quick greens | Frost, winter crops, planning | Late frost risk, early sowing |
| Temperate coast | Summer water/harvest | Winter brassicas, bare-root | Spring sow, frost watch |
| Mediterranean | Dry heat, water stress | Winter rain = main grow window | Spring warming |
| Subtropical/warm | Humidity, storms, mildew | Mild dry winter growing | Build-up humidity |
| Tropical wet-dry | Wet season, drainage | Dry season peak | Build-up, storms returning |

## Known implementation notes

- Year view orders months **January → December**.
- `monthGuidanceToRichOverview()` uses max 3 tasks and 2 risks.
- Microclimate modifiers adjust **`focus` only**.
- `rich-state-month-summaries.ts` is legacy; must not appear when `location.climate` is set.
- Toowoomba is zone **10b → temperate**, not warm.

## Constraints

- Australian English.
- No em dashes in suggested user-facing copy.
- Do not propose new npm packages unless essential.
- After content fixes: `npm run dump:month-overviews`, re-run full review, replace `review-verdicts.csv`.

---

**Start by:** reading `scripts/audit-output/month-overviews/all-locations.csv`, confirming row count 3,672, then begin Phase 1. Create `review-verdicts.csv` early and append batch by batch until every location and month is covered.
