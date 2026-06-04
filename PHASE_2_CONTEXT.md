# PROJECT CONTEXT: GrowGuide Phase 2 (Simplify Plant Setup)

## CURRENT STATE (What's Already Done)

### ✅ Phase 1: Location & Climate - COMPLETE
- Location detection service (lib/locationService.ts)
- AU suburb database with all hardiness zones (lib/auSuburbData.ts)
- Plant timeline database (plant_timelines table): 768 records, zone-aware
- Plant timeline service (lib/plantTimelineService.ts): getPlantTimeline, getAvailablePlantsForZone, etc.
- Schedule generation service (lib/scheduleService.ts): Generates zone-specific schedules
- Plant picker component (PlantPicker.tsx): Fetches available plants for user's zone
- Garden planner view (GardenPlannerView.tsx): Uses zone-aware schedule generation
- Weather integration: WeatherStrip passes userLocation to weather service
- Database: plant_timelines populated, location stored in profiles

**Result:** Users can set location → see zone-specific plants → get adjusted schedules per zone

---

## PHASE 2: SIMPLIFY PLANT SETUP
**Goal:** Reduce friction in adding plants. Currently multi-step, should be 1-2 minutes max.

**Current state:** GardenPlannerView + PlantPicker work but form has too many steps and options.

**Target outcome:**
- User taps "Add Plant"
- Sees 10-15 most common plants (searchable)
- Selects one
- Shows estimated harvest date
- Taps "Add" → done
- No optional fields, no type selector for v1

---

## TECH STACK (Relevant to Phase 2)
- Next.js 14 (App Router: /app directory)
- React 18, TypeScript strict mode
- Tailwind CSS (use core utilities only)
- Capacitor for Android
- Supabase (auth + database)
- PlantPicker.tsx already fetches from plantTimelineService ✅

---

## KEY FILES
- `app/my-garden/page.tsx` - Main garden view
- `app/components/GardenPlannerView.tsx` - Orchestrates plant management
- `app/components/PlantPicker.tsx` - Plant selection (ALREADY ZONE-AWARE)
- `lib/plantTimelineService.ts` - Fetch zone-specific plants
- `lib/scheduleService.ts` - Generate schedules per zone
- `app/context/GardenContext.tsx` - Manages plants array

---

## CONSTRAINT
- Plant selection already uses plantTimelineService (fetches from DB per zone)
- Schedule generation already zone-aware
- Don't duplicate logic, simplify existing components
- No new API calls needed (data already available)

---

## PHASE 3-5 Will Follow
- Phase 3: Weekly task synthesis (ThankYousTasks component)
- Phase 4: Page cleanup (delete 21 unused pages)
- Phase 5: Smart notifications (daily digest instead of hourly)

---

NOW: Read PROMPT 4 below
