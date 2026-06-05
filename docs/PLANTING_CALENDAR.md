# Planting calendar — canonical sources

One entry point per concern. Do not add parallel matrices.

## What to plant this month (dashboard, weekly brief)

| Module | Role |
|--------|------|
| `lib/plantingRecommendations.ts` | Public API for recommendations |
| `lib/planting/plantingByClimate.ts` | Climate-keyed planting logic |

Import recommendations through `plantingRecommendations.ts` only.

## Planting calendar UI (`/planting-calendar`)

| Module | Role |
|--------|------|
| `app/data/planting-calendar/helpers.ts` | Month guidance, overviews for UI |
| `app/data/planting-calendar/climate-planting-guide.ts` | Year-view sow/plant lists by climate |
| `app/data/planting-calendar/month-guidance-*.ts` | Per-climate month copy |

Route: `app/planting-calendar/page.tsx` — loads data via helpers above.

## Deprecated (migrate callers, do not extend)

| Module | Replacement |
|--------|-------------|
| `app/data/state-month-summaries.ts` | `app/data/planting-calendar/helpers.ts` (`getMonthGuidanceForUser`) |
| `app/utils/plantingGuide.ts` | `app/data/planting-calendar/climate-planting-guide.ts` |
| `app/data/planting-guides.ts` | `climate-planting-guide.ts` or `plantingByClimate.ts` |

`app/utils/climate.ts` still re-exports `STATE_MONTH_SUMMARIES` for legacy lowercase month keys — prefer `helpers.ts` for new code.
