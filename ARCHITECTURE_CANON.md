# GrowGuide — Canonical Architecture (Non-Optional)

This document is the **only** authoritative rule-set for architecture, refactors, and new features.  
Violations are bugs, not style preferences.

## 1. Global Rules (Hard Constraints)

### 1.1 No duplicate sources of truth

For each domain there must be:

- **ONE** canonical implementation
- **ZERO** parallel write paths
- Any secondary implementation is **legacy / read-only** until explicitly migrated and removed

### 1.2 No new state systems

Forbidden without explicit architecture amendment:

- New `localStorage` keys for **domain** data
- New context providers that duplicate Supabase-backed domain state
- New helper stores that mirror DB entities
- New JSON datasets that duplicate database tables

Extend canonical systems; do not replace them.

### 1.3 No silent duplication

If a feature overlaps an existing domain:

1. Identify the canonical system (Section 2)
2. Reuse it
3. Do not re-implement logic in a new module

### 1.4 No schema drift

- All writes must match `supabase/migrations/`
- Client models must map to DB columns; no alternate field names in write paths

---

## 2. Canonical Domain Definitions

### 2.1 Location — CANONICAL

| Role | Path / store |
|------|----------------|
| **Persistence** | `profiles.location` (`jsonb` `UserLocation`) — Supabase |
| **Service** | `lib/locationService.ts` |
| **Runtime read** | `useAuth().userLocation` in `app/context/AuthContext.tsx` |

**Rules**

- Column type is **`jsonb`** (migration `20250522_profiles_location_jsonb.sql`); reads still accept legacy TEXT JSON strings until migrated
- All location **logic** reads from `userLocation` (loaded via `getUserLocationFromDB`)
- Writes only via `updateUserLocation()` / `AuthContext.updateLocation()`
- `localStorage` keys (`userLocation`, etc.) are **legacy** — no new reads/writes for domain logic
- `app/utils/location.ts` (`getNormalizedLocation`) is **deprecated** — use `lib/locationView.ts` + `useAuth()`
- `app/context/ProfileContext.tsx` is **not** a location source (UI preferences only until migrated)

**UI adapter (read-only mapping):** `lib/locationView.ts` — maps `UserLocation` → `GardenLocation` for calendar UI; does not persist.

---

### 2.2 Garden state — CANONICAL

| Role | Path / store |
|------|----------------|
| **Persistence** | `garden_plants` — Supabase |
| **Runtime** | `app/context/GardenContext.tsx` |

**Rules**

- All garden CRUD via `GardenContext` (`addPlant`, `updatePlant`, `removePlant`, `addToGarden`, …)
- `lib/gardenService.ts` is **deprecated / dead** — do not import
- `app/hooks/usePlantedItems.ts` / `localStorage` `plantedItems` are **legacy** — do not use for new features

**Writes must include** `full_schedule` when schedules are required (see `GardenPlannerView` pattern).

---

### 2.3 Plant data (timelines, zone metadata) — CANONICAL

| Role | Path / store |
|------|----------------|
| **Persistence** | `plant_timelines`, `plant_activities` — Supabase |
| **Service** | `lib/plantTimelineService.ts` |
| **Schedule generation** | `lib/scheduleService.ts` |

**Rules**

- Zone-aware timelines come from Supabase, not inline constants (except temporary fallbacks marked `@legacy`)
- `data/plants-definitions.json` is **seed input only**, not runtime truth
- `app/data/plantDatabase.ts` is **deprecated** (unused)
- Inline `PLANT_DATABASE` in pages is **legacy** — do not extend

---

### 2.4 Planting calendar logic — CANONICAL (transitional)

| Role | Path |
|------|------|
| **Climate/month “what to plant” (dashboard + weekly brief)** | `lib/plantingRecommendations.ts` + `lib/planting/plantingByClimate.ts` |
| **Primary UI data (current)** | `app/data/planting-calendar/` (climate month guidance, plant details), `lib/planting/plantingByClimate.ts`, `lib/plantingRecommendations.ts`, `app/data/state-month-summaries.ts` (deprecated shim, climate-derived), `app/utils/plantingGuide.ts` |
| **Weekly brief route** | `/weekly-brief` (`app/weekly-brief/page.tsx`) |

**Rules (until consolidation milestone)**

- Do **not** add a fourth planting-matrix source
- New calendar features must read **location** from Section 2.1 only
- Prefer extracting shared matrices into `app/data/` **one file per concern** before duplicating inline
- Target end state: single module (future `lib/plantingCalendarData.ts` or Supabase) — tracked as tech debt

---

### 2.5 Tasks — CANONICAL

| Role | Path / store |
|------|----------------|
| **Custom tasks** | `user_tasks` — Supabase |
| **Projects** | `user_projects` — Supabase |
| **Hooks** | `app/hooks/useTasks.ts`, `app/hooks/useProjects.ts` |
| **System suggestions** | `garden_plants.full_schedule` via `lib/taskListBuilders.ts` |

**Rules**

- New task features use `useTasks` / `user_tasks` and `useProjects` / `user_projects`
- `localStorage` prefs on `/tasks` (`hideCompletedSystem` only) are UI prefs, not domain state
- One-time imports: `customTasks`, `projects` → Supabase on first load (then removed)

---

### 2.6 Weather — CANONICAL (transitional)

| Role | Path |
|------|------|
| **Live data** | WeatherAPI.com via client fetch |
| **Cache** | `localStorage` `weather_{city}_{state}` — cache only, not domain state |
| **Location input** | Section 2.1 (`userLocation.city`, `userLocation.state`) |

**Rules**

- Weather widgets must take location from `useAuth().userLocation`, not `localStorage` `userLocation`
- Consolidate fetch/cache into one module (future `lib/weatherService.ts`)
- `supabase/functions/weather/index.ts` is optional proxy — if used, client must not duplicate raw API keys
- `src/utils/weather.ts`, `src/services/weatherApi.ts` are **legacy**

---

## 3. Deprecated / Legacy Index

| Asset | Status |
|-------|--------|
| `app/utils/location.ts` | Deprecated — use `lib/locationView.ts` + `useAuth()` |
| `lib/gardenService.ts` | Deprecated — wrong schema, zero consumers |
| `app/hooks/usePlantedItems.ts` | Legacy |
| `app/context/ProfileContext.tsx` | Not canonical for location |
| `src/**` | Legacy (excluded from `tsconfig.json`) |
| `garden-app/`, `garden-planner/` | Non-product scaffolds |
| `components/LocationSelector.tsx` (root) | Legacy duplicate of `app/components/LocationSelector.tsx` |

---

## 4. Enforcement Checklist (PR / agent)

- [ ] Which canonical domain(s) does this touch?
- [ ] Does it read/write only through canonical paths?
- [ ] No new `localStorage` domain keys?
- [ ] No duplicate provider or service for the same entity?
- [ ] DB writes match migration column names?

---

*Last updated: enforcement pass for Location (2.1).*
