# Claude review prompt: GrowGuide weekly dashboard guidance (Blackmans Bay TAS)

Copy everything below the line into Claude.

---

You are reviewing **generated copy** for an Australian gardening app. Be critical, specific, and practical. Assume the reader is a home gardener on the Hobart coast, not a developer.

## Product context

**GrowGuide** is a Next.js app for Australian home gardeners. The **dashboard** shows a card titled like **"Autumn (Week 12)"** with one paragraph of seasonal guidance. It is **not** the planting list (sow/plant); that is a separate card from a different data source.

**Goal of this copy:** Timely, location-aware, motivating guidance for the current week. It should read as one coherent paragraph from a knowledgeable local gardener, not three stitched bullet points.

**Constraints for the app:**
- Southern hemisphere seasons (Summer Dec–Feb, Autumn Mar–May, Winter Jun–Aug, Spring Sep–Nov)
- No em dashes in user-facing text
- Location: suburb picker (~300 AU places), hardiness zone, climate, microclimate tags (e.g. coastal, inland, highland)

## Test location (fixed for this review)

| Field | Value |
|--------|--------|
| Place | Blackmans Bay, Tasmania (`tas-blackmans-bay`) |
| Zone | 8b |
| Resolved climate | **cold** (zone ≤ 8 maps to cold in code) |
| Microclimate tag | **coastal** |
| Planting profile (matrices) | `cool:coastal` (cold/cool + coastal uses coastal planting overrides) |
| Lat/lon | ~-43.0, 147.32 (Hobart channel coast) |

**Note:** Product docs sometimes describe this test site as "cool"; runtime guidance for week bands uses **`cold`** templates unless the user profile overrides `climate` to `cool`.

## How the paragraph is built (technical)

Pipeline: `buildWeeklySeasonGuidance()` in `lib/weeklyGuidanceService.ts`

1. **Title:** `computeSeasonDisplay()` → season label + `weekInSeason` (week index within the current season, not ISO week 1–52)
2. **Week band:** weeks 1–4 = early, 5–8 = mid, 9+ = late (within that season)
3. **Paragraph inputs:**
   - Month focus from `getMonthGuidanceForUser()` → climate month files (`month-guidance-cold.ts` for cold) + microclimate tweaks
   - Week-of-season line from `BAND_TEMPLATES` in `lib/weeklyGuidanceBands.ts` (keyed by climate × season × band)
   - Optional frost line from `frostHint()` in weeklyGuidanceService
4. **Modifiers:** `applyGuidanceModifiers()` in `lib/microclimate/guidanceModifierRules.ts` (coastal/inland/urban etc.). Some rules set a full precomposed `overview` string (used for coastal cool/cold autumn mid/late).
5. **Stitching:** `composeWeeklyOverview()` in `lib/overviewProse.ts` merges fragments or uses precomposed overview.

**Known implementation quirks to factor into your review:**
- Same paragraph often repeats for several calendar weeks until the week band changes
- December is meteorological **Summer** but `weekInSeason` can show very high numbers (e.g. Week 45–48) due to season week math anchoring on January
- Composer can produce awkward joins (e.g. "so so", repeated "plan spring", triple frost advice)

## Your task

Critically analyse the **full year of rendered output** below for Blackmans Bay.

### Analyse across these dimensions

1. **Horticultural accuracy** for coastal Hobart / Channel climate (8b, frost timing, what to plant/prune/harvest when)
2. **Coastal vs inland framing** (is "trust local conditions" right? anything wrong for Derwent estuary coast?)
3. **Prose quality** (rhythm, repetition, contradictions, flat tone, grammar glitches)
4. **UX / trust** (would a gardener find this helpful weekly? confusing titles? December "Summer Week 48"?)
5. **Season/week structure** (do early/mid/late bands match real garden rhythm on this coast?)
6. **Cold vs cool** (is treating 8b as "cold" copy defensible for Blackmans Bay, or should it read more "cool maritime"?)

### Output format

Return:

**A. Executive summary** (5–8 bullets: top issues and strengths)

**B. Season-by-season table** with columns: Season band | Verdict (Good / OK / Poor) | Main problems | Suggested fix direction (content vs code)

**C. Worst 5 weeks** (calendar week + title + quote the bad phrase + why)

**D. Best 3 weeks** (what works well)

**E. Recommended rewrite** for any band you rate Poor (one polished paragraph each, Australian English, no em dashes)

**F. Code/content architecture notes** (only if structural changes needed beyond editing strings)

Do not be polite about weak copy. Flag repetition and bugs explicitly.

---

## Full rendered output (52 sample weeks, 2026)

Location: Blackmans Bay TAS | Climate: cold | Tags: coastal

### W01 · 2025-12-31 · January · early
**Summer (Week 1)**
Keep up with harvests and maintain steady watering on warm days. Mid-summer growth is short-lived in cold areas; harvest often and protect tender crops from heat spikes.

### W02 · 2026-01-07 · January · early
**Summer (Week 2)**
Keep up with harvests and maintain steady watering on warm days. Mid-summer growth is short-lived in cold areas; harvest often and protect tender crops from heat spikes.

### W03 · 2026-01-14 · January · early
**Summer (Week 3)**
Keep up with harvests and maintain steady watering on warm days. Mid-summer growth is short-lived in cold areas; harvest often and protect tender crops from heat spikes.

### W04 · 2026-01-21 · January · early
**Summer (Week 4)**
Keep up with harvests and maintain steady watering on warm days. Mid-summer growth is short-lived in cold areas; harvest often and protect tender crops from heat spikes.

### W05 · 2026-01-28 · January · mid
**Summer (Week 5)**
Maintain leafy greens and roots, and watch for wind damage on exposed sites. Mid-summer growth is short-lived in cold areas; harvest often and protect tender crops from heat spikes.

### W06 · 2026-02-04 · February · mid
**Summer (Week 5)**
Maintain leafy greens and roots, and watch for wind damage on exposed sites, so late summer is the pivot to autumn; clear tired beds and plan for a narrow frost-free window.

### W07 · 2026-02-11 · February · mid
**Summer (Week 6)**
Maintain leafy greens and roots, and watch for wind damage on exposed sites, so late summer is the pivot to autumn; clear tired beds and plan for a narrow frost-free window.

### W08 · 2026-02-18 · February · mid
**Summer (Week 7)**
Maintain leafy greens and roots, and watch for wind damage on exposed sites, so late summer is the pivot to autumn; clear tired beds and plan for a narrow frost-free window.

### W09 · 2026-02-25 · February · mid
**Summer (Week 8)**
Maintain leafy greens and roots, and watch for wind damage on exposed sites, so late summer is the pivot to autumn; clear tired beds and plan for a narrow frost-free window.

### W10 · 2026-03-04 · March · early
**Autumn (Week 1)**
Cooling is quick, so prioritise garlic, onions, and frost-hardy greens.

### W11 · 2026-03-11 · March · early
**Autumn (Week 2)**
Cooling is quick, so prioritise garlic, onions, and frost-hardy greens.

### W12 · 2026-03-18 · March · early
**Autumn (Week 3)**
Cooling is quick, so prioritise garlic, onions, and frost-hardy greens.

### W13 · 2026-03-25 · March · early
**Autumn (Week 4)**
Cooling is quick, so prioritise garlic, onions, and frost-hardy greens.

### W14 · 2026-04-01 · April · mid
**Autumn (Week 5)**
Growth is still steady, but watch for the first cold nights on the coast and cover tender crops when forecasts dip, even if you have not seen a hard frost yet. Coastal frosts often arrive later than inland, so trust local conditions over regional calendars.

### W15 · 2026-04-08 · April · mid
**Autumn (Week 6)**
Growth is still steady, but watch for the first cold nights on the coast and cover tender crops when forecasts dip, even if you have not seen a hard frost yet. Coastal frosts often arrive later than inland, so trust local conditions over regional calendars.

### W16 · 2026-04-15 · April · mid
**Autumn (Week 7)**
Growth is still steady, but watch for the first cold nights on the coast and cover tender crops when forecasts dip, even if you have not seen a hard frost yet. Coastal frosts often arrive later than inland, so trust local conditions over regional calendars.

### W17 · 2026-04-22 · April · mid
**Autumn (Week 8)**
Growth is still steady, but watch for the first cold nights on the coast and cover tender crops when forecasts dip, even if you have not seen a hard frost yet. Coastal frosts often arrive later than inland, so trust local conditions over regional calendars.

### W18 · 2026-04-29 · April · late
**Autumn (Week 9)**
Growth is slowing, so finish remaining planting and ease back on watering. On the coast, conditions run a few weeks behind inland: evenings are cooling but frosts arrive later and land lighter, so use what you observe rather than inland frost calendars. Protect tender crops when cold nights are forecast, delay dormant pruning until leaves have actually fallen, and favour frost-hardy vegetables while the season still has momentum.

### W19 · 2026-05-06 · May · late
**Autumn (Week 10)**
Growth is slowing, so finish remaining planting and ease back on watering. On the coast, conditions run a few weeks behind inland: evenings are cooling but frosts arrive later and land lighter, so use what you observe rather than inland frost calendars. Protect tender crops when cold nights are forecast, delay dormant pruning until leaves have actually fallen, and favour frost-hardy vegetables while the season still has momentum.

### W20 · 2026-05-13 · May · late
**Autumn (Week 11)**
Growth is slowing, so finish remaining planting and ease back on watering. On the coast, conditions run a few weeks behind inland: evenings are cooling but frosts arrive later and land lighter, so use what you observe rather than inland frost calendars. Protect tender crops when cold nights are forecast, delay dormant pruning until leaves have actually fallen, and favour frost-hardy vegetables while the season still has momentum.

### W21 · 2026-05-20 · May · late
**Autumn (Week 12)**
Growth is slowing, so finish remaining planting and ease back on watering. On the coast, conditions run a few weeks behind inland: evenings are cooling but frosts arrive later and land lighter, so use what you observe rather than inland frost calendars. Protect tender crops when cold nights are forecast, delay dormant pruning until leaves have actually fallen, and favour frost-hardy vegetables while the season still has momentum.

### W22 · 2026-05-27 · May · late
**Autumn (Week 13)**
Growth is slowing, so finish remaining planting and ease back on watering. On the coast, conditions run a few weeks behind inland: evenings are cooling but frosts arrive later and land lighter, so use what you observe rather than inland frost calendars. Protect tender crops when cold nights are forecast, delay dormant pruning until leaves have actually fallen, and favour frost-hardy vegetables while the season still has momentum.

### W23 · 2026-06-03 · June · early
**Winter (Week 1)**
This is a quieter season, so maintain covers, plan spring, and improve soil when workable. Outdoor growth slows; maintain overwintering crops and plan spring under cover; expect frequent frosts, and limit outdoor work to hardy crops and dormant pruning.

### W24 · 2026-06-10 · June · early
**Winter (Week 2)**
This is a quieter season, so maintain covers, plan spring, and improve soil when workable. Outdoor growth slows; maintain overwintering crops and plan spring under cover; expect frequent frosts, and limit outdoor work to hardy crops and dormant pruning.

### W25 · 2026-06-17 · June · early
**Winter (Week 3)**
This is a quieter season, so maintain covers, plan spring, and improve soil when workable. Outdoor growth slows; maintain overwintering crops and plan spring under cover; expect frequent frosts, and limit outdoor work to hardy crops and dormant pruning.

### W26 · 2026-06-24 · June · early
**Winter (Week 4)**
This is a quieter season, so maintain covers, plan spring, and improve soil when workable. Outdoor growth slows; maintain overwintering crops and plan spring under cover; expect frequent frosts, and limit outdoor work to hardy crops and dormant pruning.

### W27 · 2026-07-01 · July · mid
**Winter (Week 5)**
Prune deciduous fruit only once fully dormant; coastal trees may still be carrying leaves well into winter. Midwinter is for maintenance, protected starts, and rotation planning; expect frequent frosts, and limit outdoor work to hardy crops and dormant pruning.

### W28 · 2026-07-08 · July · mid
**Winter (Week 6)**
Prune deciduous fruit only once fully dormant; coastal trees may still be carrying leaves well into winter. Midwinter is for maintenance, protected starts, and rotation planning; expect frequent frosts, and limit outdoor work to hardy crops and dormant pruning.

### W29 · 2026-07-15 · July · mid
**Winter (Week 7)**
Prune deciduous fruit only once fully dormant; coastal trees may still be carrying leaves well into winter. Midwinter is for maintenance, protected starts, and rotation planning; expect frequent frosts, and limit outdoor work to hardy crops and dormant pruning.

### W30 · 2026-07-22 · July · mid
**Winter (Week 8)**
Prune deciduous fruit only once fully dormant; coastal trees may still be carrying leaves well into winter. Midwinter is for maintenance, protected starts, and rotation planning; expect frequent frosts, and limit outdoor work to hardy crops and dormant pruning.

### W31 · 2026-07-29 · July · late
**Winter (Week 9)**
As days lengthen, clean beds and start seeds indoors for spring. Midwinter is for maintenance, protected starts, and rotation planning.

### W32 · 2026-08-05 · August · late
**Winter (Week 9)**
As days lengthen, clean beds and start seeds indoors for spring, so so protected sowing beats rushing outdoors.

### W33 · 2026-08-12 · August · late
**Winter (Week 10)**
As days lengthen, clean beds and start seeds indoors for spring, so so protected sowing beats rushing outdoors.

### W34 · 2026-08-19 · August · late
**Winter (Week 11)**
As days lengthen, clean beds and start seeds indoors for spring, so so protected sowing beats rushing outdoors.

### W35 · 2026-08-26 · August · late
**Winter (Week 12)**
As days lengthen, clean beds and start seeds indoors for spring, so so protected sowing beats rushing outdoors.

### W36 · 2026-09-02 · September · early
**Spring (Week 1)**
Soil is still slow to warm, so start seeds under cover and delay tender transplants. Spring begins cautiously; late frosts can still damage new growth in cold areas; coastal sites can still see late frosts in spring, so harden off seedlings and keep cover ready on clear, calm nights.

### W37 · 2026-09-09 · September · early
**Spring (Week 2)**
Soil is still slow to warm, so start seeds under cover and delay tender transplants. Spring begins cautiously; late frosts can still damage new growth in cold areas; coastal sites can still see late frosts in spring, so harden off seedlings and keep cover ready on clear, calm nights.

### W38 · 2026-09-16 · September · early
**Spring (Week 3)**
Soil is still slow to warm, so start seeds under cover and delay tender transplants. Spring begins cautiously; late frosts can still damage new growth in cold areas; coastal sites can still see late frosts in spring, so harden off seedlings and keep cover ready on clear, calm nights.

### W39 · 2026-09-23 · September · early
**Spring (Week 4)**
Soil is still slow to warm, so start seeds under cover and delay tender transplants. Spring begins cautiously; late frosts can still damage new growth in cold areas; coastal sites can still see late frosts in spring, so harden off seedlings and keep cover ready on clear, calm nights.

### W40 · 2026-09-30 · October · mid
**Spring (Week 5)**
Harden off cool-season seedlings and direct sow peas and broad beans where soil allows. Core spring planting window; potatoes and hardy greens lead, with tender crops only under cover; coastal sites can still see late frosts in spring, so harden off seedlings and keep cover ready on clear, calm nights.

### W41 · 2026-10-07 · October · mid
**Spring (Week 6)**
Harden off cool-season seedlings and direct sow peas and broad beans where soil allows. Core spring planting window; potatoes and hardy greens lead, with tender crops only under cover; coastal sites can still see late frosts in spring, so harden off seedlings and keep cover ready on clear, calm nights.

### W42 · 2026-10-14 · October · mid
**Spring (Week 7)**
Harden off cool-season seedlings and direct sow peas and broad beans where soil allows. Core spring planting window; potatoes and hardy greens lead, with tender crops only under cover; coastal sites can still see late frosts in spring, so harden off seedlings and keep cover ready on clear, calm nights.

### W43 · 2026-10-21 · October · mid
**Spring (Week 8)**
Harden off cool-season seedlings and direct sow peas and broad beans where soil allows. Core spring planting window; potatoes and hardy greens lead, with tender crops only under cover; coastal sites can still see late frosts in spring, so harden off seedlings and keep cover ready on clear, calm nights.

### W44 · 2026-10-28 · October · late
**Spring (Week 9)**
Growth is picking up, so transplant hardy crops and stake early climbers. Core spring planting window; potatoes and hardy greens lead, with tender crops only under cover.

### W45 · 2026-11-04 · November · late
**Spring (Week 9)**
Growth is picking up, so transplant hardy crops and stake early climbers, so late spring is brief; plant summer crops under cover and watch for surprise frosts.

### W46 · 2026-11-11 · November · late
**Spring (Week 10)**
Growth is picking up, so transplant hardy crops and stake early climbers, so late spring is brief; plant summer crops under cover and watch for surprise frosts.

### W47 · 2026-11-18 · November · late
**Spring (Week 11)**
Growth is picking up, so transplant hardy crops and stake early climbers, so late spring is brief; plant summer crops under cover and watch for surprise frosts.

### W48 · 2026-11-25 · November · late
**Spring (Week 12)**
Growth is picking up, so transplant hardy crops and stake early climbers, so late spring is brief; plant summer crops under cover and watch for surprise frosts.

### W49 · 2026-12-02 · December · late
**Summer (Week 45)**
Plan autumn beds by sowing brassicas and clearing spent summer crops. Early summer harvests are precious; stay ahead of pests and protect from heat and frost swings.

### W50 · 2026-12-09 · December · late
**Summer (Week 46)**
Plan autumn beds by sowing brassicas and clearing spent summer crops. Early summer harvests are precious; stay ahead of pests and protect from heat and frost swings.

### W51 · 2026-12-16 · December · late
**Summer (Week 47)**
Plan autumn beds by sowing brassicas and clearing spent summer crops. Early summer harvests are precious; stay ahead of pests and protect from heat and frost swings.

### W52 · 2026-12-23 · December · late
**Summer (Week 48)**
Plan autumn beds by sowing brassicas and clearing spent summer crops. Early summer harvests are precious; stay ahead of pests and protect from heat and frost swings.
