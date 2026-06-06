# Planting calendar — canonical sources

One entry point per concern. Do not add parallel matrices.

## Sow / plant lists (dashboard, weekly brief, calendar year + month)

| Module | Role |
|--------|------|
| `lib/plantingRecommendations.ts` | **Public API** — import this only |
| `lib/planting/plantingByClimate.ts` | Climate-keyed sow/plant matrix |
| `app/data/planting-calendar/helpers.ts` | `plantingActivitiesForMonth`, `buildClimatePlantingGuideForLocation` — thin wrappers over `getPlantingRecommendationsForMonth` |

Calendar and dashboard **must** show the same sow/plant lists for a location + month.  
Tests: `lib/planting/calendarAlignment.test.ts`.

## Month overview prose (calendar UI)

| Priority | Module |
|----------|--------|
| 1 | `app/data/planting-calendar/month-overview-lookup.ts` — sharp-voice CSV (when available) |
| 2 | `app/data/planting-calendar/month-guidance-*.ts` — climate-keyed focus/tasks/risks |
| 3 | Generic fallback in `month-guidance.ts` |

**Do not** use state-specific legacy prose (`rich-state-month-summaries`, `state-month-summaries-calendar`) for new features.

## Plant picker (My Garden add-plant)

| Module | Role |
|--------|------|
| `lib/plantSuitabilityService.ts` | “Plant now / wait / frost” grouping |
| `lib/planting/fortnightTiming.ts` | **Seasonal timing** — same `PLANTING_BY_CLIMATE` matrix as dashboard/calendar |
| `lib/planting/plantTimingAliases.ts` | Maps matrix labels (e.g. `Early Peas`) → `plant_timelines` names (`Peas`) |
| `lib/plantTimelineService.ts` | Which plants exist in the user’s zone + climate suitability |
| `lib/scheduleService.ts` | Per-plant care schedule after add |

**Timing** for the picker comes from the climate matrix (fortnight windows), not from `plant_timelines` sow dates.  
**Availability** comes from `plant_timelines` (zone plant list).  
Monthly sow/plant lists and picker “Good seasonal timing” should agree when names align.  
Tests: `lib/planting/pickerMonthAlignment.test.ts`, `lib/planting/plantTimingAliases.test.ts`.

## Deprecated (do not extend)

| Module | Status |
|--------|--------|
| `app/data/state-month-summaries.ts` | Legacy — archived path only |
| `app/data/planting-calendar/rich-state-month-summaries.ts` | Legacy — no longer used in helpers |
| `app/data/planting-calendar/helpers-legacy-summaries.ts` | Legacy |
| `app/utils/plantingGuide.ts` | Deprecated shim |
| `app/data/planting-calendar/climate-planting-guide.ts` | Deprecated — use `helpers.buildClimatePlantingGuideForLocation` |
