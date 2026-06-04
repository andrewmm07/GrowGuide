# Cursor prompt: Verify My Garden plant picker accuracy

Copy **everything below the horizontal rule** into a new Cursor chat (Agent mode). Attach or @-mention the audit CSVs if the model cannot read large files from disk.

---

You are an expert Australian horticulture reviewer and QA engineer. Your job is to **verify that GrowGuide’s My Garden “add plant” picker classifications are accurate**, using the pre-generated audit exports and the source code—not guesswork.

Be sceptical. Flag false positives (too generous) and false negatives (too harsh). Prefer **spot-checks backed by code traces** over vague “seems fine”.

## Product context

**GrowGuide** (Next.js) lets users add plants to **My Garden**. When adding a plant, **PlantPicker** (`app/components/PlantPicker.tsx`) groups every plant in the user’s hardiness zone into sections:

| UI section | Logic |
|------------|--------|
| **Good seasonal timing** | `seasonalTiming === 'ideal'` |
| **Acceptable seasonal timing** | `seasonalTiming === 'good'` (tier exists in code but is **rarely/never assigned** by current fortnight rules—flag if you see non-zero counts) |
| **Timing caution** | `seasonalTiming === 'timing_caution'` |
| **Not advised for this season** | `seasonalTiming === 'not_advised'` (timing only; plant still listed if climate OK) |
| **Not suitable for this climate** | `climateSuitability === 'not_advised'` (from DB `unsuitable_zone` / very low `growth_multiplier`; **removed** from timing groups) |

Users toggle **Seed** vs **Seedling**. Timing depends on **today’s date** (fortnight) and **location** (zone + microclimate tags → planting profile). Climate depends on **zone metadata** from Supabase `plant_timelines`.

**This is decision support, not hard blocking**—but wrong labels erode trust.

## Audit artefacts (generated; treat as ground truth for “what the app computes”)

Path: `scripts/audit-output/plant-picker/`

| File | Rows (approx.) | Use for |
|------|----------------|---------|
| `plant-picker-everywhere-summary.csv` | 32,436 | Scan counts: 306 places × 53 ISO weeks × 2 methods |
| `plant-picker-everywhere-plants.csv` | ~2.96M | **Verify individual plant labels** (filter by `place_id`, `iso_week`, `method`, `plant_name`) |

**Regenerate** (Windows: use `npm.cmd` if PowerShell blocks `npm.ps1`):

```text
npm.cmd run audit:plant-picker
npm.cmd run audit:plant-picker:matrix          # 10-city sample, faster
npx tsx scripts/audit-plant-picker-matrix.ts -- --place "Sydney" --state NSW --detail
```

Audit script: `scripts/audit-plant-picker-matrix.ts`  
Uses **`evaluatePlantSuitability`** + **`getPlantZoneMetaForZone`** (Supabase when `.env.local` present)—same stack as PlantPicker.

### CSV columns (plants file)

- `place_id`, `city`, `state`, `zone`, `profile`, `microclimate_tags`
- `year`, `iso_week`, `reference_date` (Wednesday of that ISO week), `fortnight`, `method`
- `plant_name`, `seasonal_tier`, `seasonal_label`, `climate_tier`, `distance_fortnights`, `method_match`

### CSV columns (summary file)

Same location/week keys plus counts: `ideal`, `good`, `timing_caution`, `not_advised`, `climate_not_suitable`, `total_plants`

## How classification works (read these files)

1. **Timing** — `lib/planting/fortnightTiming.ts`  
   - Year split into **24 fortnights** (early/late per month).  
   - Planting matrices from `resolvePlantingProfileWithContext` → `getPlantingGuideForProfile` per month.  
   - **Tiers** (`tierFromDistance`):
     - `ideal`: distance 0 to correct window (sow for seed, plant for seedling)
     - `timing_caution`: distance 1, OR `wrong_method` (other window exists this fortnight)
     - `not_advised`: distance ≥ 2, or `no_window` in matrix
   - Special cases: direct-sow-only crops + seedling; indoors-sow partial match for seedlings.

2. **Climate** — `lib/plantSuitabilityService.ts` → `assessClimateSuitability`  
   - `not_advised` only if `unsuitable_zone` or `growth_multiplier <= 0.05`.  
   - Otherwise `thrives` / `grows_well` (not shown as separate picker sections except the climate block).

3. **Grouping** — `groupPlantsByTimingOnly` excludes climate-not-suitable from timing sections.

## Your task

Verify **accuracy** of the audit data against **Australian gardening reality** and **internal consistency**.

### Phase 1 — Structural sanity (code + CSV)

1. Confirm summary row count ≈ `306 × weeks_in_year × 2` (53 for 2026).  
2. Confirm `total_plants` per row matches zone plant count in DB for that `zone`.  
3. Confirm `ideal + good + timing_caution + not_advised + climate_not_suitable === total_plants` for sample rows.  
4. Confirm plants with `climate_tier === not_advised` never appear as timing “ideal” in the same row (they should still appear in plants CSV with both columns; UI hides them from timing groups).  
5. Note weeks that share the same `fortnight` label—counts should match within that fortnight for a given place/method.  
6. Recompute **5–10 random rows** by running the audit for one `--place` / `--state` or tracing `evaluatePlantSuitability` in code; report any mismatch with the CSV.

### Phase 2 — Horticultural spot-checks (stratified sample)

Pick **at least 40 plant-week-location checks** across:

| Stratum | Examples to include |
|---------|---------------------|
| **Cold coast** | Blackmans Bay TAS (`8b`, `cool:coastal`) — May & Aug, seed + seedling |
| **Cool inland** | Canberra ACT (`9a`, `cool`) |
| **Temperate coast** | Sydney, Melbourne — Oct–Nov (tomato/corn pressure), Jun |
| **Mediterranean** | Adelaide, Perth, Fremantle — summer dormancy / winter sow |
| **Subtropical / highland** | Toowoomba (`10b`, highland tags) |
| **Tropical** | Darwin (`12b`, wet-dry) — “not advised” vs year-round tropics |
| **Climate-blocked** | Banana in Hobart, temperate crops in Darwin — `climate_not_suitable` |
| **Method mismatch** | Garlic/shallot seed vs seedling; direct-sow-only as seedling |
| **Edge names** | Tomatoes vs Tomato, Carrots vs Carrot, duplicate matrix entries |

For each check, state: **Expected tier** (your expert judgement) vs **CSV `seasonal_label` + `climate_tier`** vs **Verdict: Correct / Wrong / Uncertain** and why.

Use planting calendars, COOL/Temperate/Tropical conventions, and the app’s own month matrices (`lib/planting/plantingProfileData`, profile resolved per location) as references.

### Phase 3 — Systematic risk patterns

Search the plants CSV (or sample via scripts) for:

1. **Popular crops “ideal” in clearly wrong months** (e.g. tomato `ideal` in June in Melbourne; pumpkin `ideal` in winter temperate).  
2. **Winter crops “not advised” in peak sow windows** (broad beans, peas, garlic in cool regions).  
3. **Coastal vs inland same zone** — same `zone` but different `profile`/tags: should timings differ where matrices differ?  
4. **`no_window` plants** — always `not_advised`; are they missing from planting matrices or intentionally absent?  
5. **`wrong_method` always caution** — is that UX-fair (e.g. sow month but user chose seedling)?  
6. **Zone 8a / 11a / 11b / 12a** — ensure places using those zones appear in the audit (not only 8b–10b).  
7. **Supabase vs matrices** — plants in DB but never in profile sow/plant lists.

### Phase 4 — UX / trust

- Would a competent local gardener agree with the **section** placement?  
- Are **Darwin** and **Tasmania** lists sensibly different?  
- Is **“Not suitable for this climate”** reserved for true zone mismatches (not just “hard to grow”)?  
- Any labels that contradict the **planting calendar** pages for the same location?

## Output format (required)

Return these sections:

**A. Executive summary** (8–12 bullets: overall trust level, top bugs, top strengths)

**B. Structural QA** (table: check | pass/fail | notes)

**C. Spot-check log** (table: place | week | method | plant | CSV label | expected | verdict | reasoning)

**D. High-priority errors** (numbered list; each with evidence: CSV row fields or code path)

**E. Medium / low issues** (grouped: timing logic, climate flags, naming/aliases, data gaps)

**F. Recommended fixes** (each tagged: `data` | `code` | `content` | `test`)

**G. Suggested regression tests** (5–10 concrete cases to lock in fixes)

Do not approve the system without completing Phase 2 spot-checks. If you cannot read the 474MB plants CSV whole, use `grep`, small scripts, or `audit-plant-picker-matrix.ts --place X --state Y --detail` to sample.

## Reference locations (quick filters)

| place_id (example) | City | Zone | Profile |
|--------------------|------|------|---------|
| tas-blackmans-bay | Blackmans Bay | 8b | cool:coastal |
| act-canberra | Canberra | 9a | cool |
| vic-melbourne | Melbourne | 9b | cool:coastal |
| sa-adelaide | Adelaide | 9b | cool:coastal (+ mediterranean tag) |
| nt-darwin | Darwin | 12b | tropical:wet_dry |
| qld-toowoomba | Toowoomba | 10b | temperate (+ highland) |
| wa-perth | Perth | 10a | temperate |
| nsw-sydney | Sydney | 10b | temperate |

## Known implementation notes (verify, don’t assume)

- Timing uses **fortnight**, not day-of-week; ISO “weekly” audit can duplicate within the same fortnight.  
- `good` tier may appear in CSV counts but current `tierFromDistance` never returns `good`—if `good > 0`, investigate.  
- Climate `thrives` / `grows_well` does not change picker section except via `not_advised`.  
- Old `scripts/audit-hobart-late-may.ts` used zone **9a** for Hobart; production places use **8b** for Blackmans Bay—do not use that script as truth.

## Constraints

- Australian English.  
- No em dashes in suggested user-facing copy.  
- Do not propose new npm packages unless essential.  
- If you change code, run `npm.cmd run audit:plant-picker:matrix` and note diffs in summary counts.

---

**Start by reading:** `lib/planting/fortnightTiming.ts`, `lib/plantSuitabilityService.ts`, `app/components/PlantPicker.tsx`, and the header + 20 random lines of `plant-picker-everywhere-summary.csv`. Then proceed with Phase 1.
