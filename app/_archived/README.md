# Archived routes

Pages moved here are excluded from the Next.js App Router (folders prefixed with `_` are private). They are kept for reference and easy restoration.

Archived **June 2026** as part of MVP nav simplification (Dashboard · My Garden · Settings).

| Folder | Former URL | Notes |
|--------|------------|--------|
| `bed-buddies` | `/bed-buddies` | Companion planting reference |
| `common-issues` | `/common-issues` | Pest/disease encyclopedia |
| `flowers` | `/flowers` | Flower browse page |
| `resources` | `/resources` | External resource links |
| `debug` | `/debug/location` | Dev location tools |
| `calendar` | `/calendar/*` | Legacy calendar UIs |
| `edible-plants` | `/edible-plants/planting-calendar` | Duplicate calendar |
| `propagation` | `/propagation` | Orphan page |
| `what-not-to-do` | `/what-not-to-do` | Orphan page |
| `any-page` | `/any-page` | Scaffold / test page |
| `weather` | `/weather` | Standalone weather (dashboard has `WeatherPanel`) |
| `legacy-month-route` | `/[month]` | Legacy month slug route |
| `tasks` | `/tasks` | Task list (archived May 2026) |

**Still active (not in nav, reachable from dashboard):** `/planting-calendar`, `/weekly-brief`, `/plants/[id]`, `/profile`, `/notifications`, auth and location flows.

## Restore a page

1. Move the folder from `_archived/<name>` back to `app/<name>`.
2. Re-add any nav links in `BottomNav.tsx` or `Sidebar.tsx` if desired.
