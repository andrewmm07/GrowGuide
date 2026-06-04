# GrowGuide Implementation Status Report
**Date:** May 20, 2026  
**Last Updated:** Based on codebase audit

---

## ✅ COMPLETED

### Phase 1: Location & Climate (80% DONE)

#### Core Infrastructure
- ✅ `lib/types/location.ts` - Complete with UserLocation, Climate types, zone mapping functions, frost dates
- ✅ `lib/locationService.ts` - Complete with:
  - `detectLocationOnce()` (stub on web, implemented on mobile)
  - `getUserLocationFromDB(userId)` 
  - `updateUserLocation(userId, location)`
  - `lookupSuburbByName(suburbName)`
  - `getAllSuburbs()` 
  - LocationError class with proper error handling
- ✅ `lib/auSuburbData.ts` - Complete suburb database for AU zones
- ✅ `lib/utils/haversine.ts` - Haversine distance calculation
- ✅ `supabase/migrations/20250520_create_plant_timelines.sql` - Schema created with indexes and triggers

#### UI Components
- ✅ `app/location-select/page.tsx` - Location selection page (auto-detect + manual)
- ✅ `app/components/LocationSelector.tsx` - Reusable location picker
- ✅ `app/components/LocationConfirmation.tsx` - Confirmation UI
- ✅ `app/setup-location/page.tsx` - Setup flow

#### Integration
- ✅ AuthContext updated with location support
- ⚠️ **NOT DONE:** Plant timeline data migration to Supabase (scripts exist but not populated)
- ⚠️ **NOT DONE:** Weather API not yet updated to use user location

---

### Partial/In-Progress

#### Plant Data Management
- 🟡 `lib/plantTimelineService.ts` - Exists but unclear if fully integrated
- 🟡 `scripts/seed-plants-to-supabase.ts` - Migration script created but not confirmed run
- 🟡 `scripts/migrate-plants-to-supabase.ts` - Another migration script
- ❌ `lib/plantDataClient.ts` - **NOT CREATED** (needed to fetch from DB)

#### Weather & Climate
- ❌ `src/services/weatherApi.ts` - **STILL HARDCODED TO HOBART** (line 4: `city = 'Hobart'`)
- ⚠️ `supabase/functions/weather/index.ts` - Exists, needs verification if using location

#### Notifications
- ✅ `app/hooks/useGardenNotifications.ts` - Hook exists
- ⚠️ Unclear if hourly polling removed from WateringSchedule.tsx

---

## ❌ NOT YET DONE

### Phase 2: Simplify Plant Setup
- ❌ `QuickAddPlant.tsx` - Not created
- ❌ Simplified form (should be 1-2 fields, not 5+)
- ❌ Plant selection reduced to 10-15 common plants

### Phase 3: Weekly Task Synthesis  
- ❌ `synthesizeTasks()` function - Not created
- ❌ `ThisWeeksTasks.tsx` component - Not created
- ❌ Replace "Today's Tasks" with weekly view

### Phase 4: Page Cleanup
- ❌ 21 pages still exist (bed-buddies, calendar/*, common-issues, etc.)
- ❌ Navigation still shows all options
- ❌ No deletion script run

### Phase 5: Smart Notifications
- ❌ Daily digest at 7am - Not implemented
- ❌ Batch notifications - Not implemented
- ⚠️ Hourly polling still active in WateringSchedule.tsx

---

## Critical Blockers

### 1. **Plant Data Not in Database**
- Status: Migration scripts exist but table is EMPTY
- Impact: Plant timelines can't be fetched per zone
- Fix needed: Run `seed-plants-to-supabase.ts` to populate plant_timelines table

### 2. **Weather API Still Hardcoded**
- Status: `src/services/weatherApi.ts` line 4 still defaults to 'Hobart'
- Impact: Location detection works but weather is ignored
- Fix needed: Update getWeatherData(userLocation) to accept location parameter

### 3. **Plant Data Client Not Implemented**
- Status: No `plantDataClient.ts` exists
- Impact: No way to fetch zone-specific plant data from Supabase
- Fix needed: Create and integrate `lib/plantDataClient.ts`

---

## File Structure Analysis

### What's Working
- Location detection infrastructure (types, service, UI)
- Supabase schema for plant_timelines (created)
- Location storage in profiles (integrated)
- AU suburb database with zones and frost dates

### What's Broken/Missing
- Plant data not populated in Supabase
- Weather API not connected to user location
- No plant data client (can't query DB)
- No synthesis of weekly tasks
- No simplified add-plant form
- Still 26+ pages (no cleanup)
- Notifications still hourly/per-plant

### What's Partially Done
- Location selection (UI done, integration 80%)
- Plant timeline schema (created, not populated)
- Notification hooks (exist, not wired to synthesis)

---

## Actionable Next Steps (Priority Order)

### IMMEDIATE (1-2 hours)
1. Check if `seed-plants-to-supabase.ts` has been run
   - Query: `SELECT COUNT(*) FROM plant_timelines;`
   - If empty: need to run script to populate plant data
   
2. Update `src/services/weatherApi.ts`
   ```typescript
   // Change line 4 from:
   export async function getWeatherData(city: string = 'Hobart')
   // To:
   export async function getWeatherData(userLocation: UserLocation)
   ```
   - Then use `userLocation.city` instead of hardcoded 'Hobart'

### SHORT TERM (1-2 days)
3. Create `lib/plantDataClient.ts`
   - Function: fetchPlantTimeline(plantName, zone) from Supabase
   - Cache results in memory
   - Error handling for missing data

4. Update plant schedule generation
   - Change `app/my-garden/page.tsx` to use DB instead of hardcoded data
   - Remove PLANT_TIMELINES object (lines 69-894)

### MEDIUM TERM (2-3 days)
5. Create simplified add-plant form
   - QuickAddPlant component
   - 10-15 common plants only
   - Remove optional fields

6. Create weekly task synthesis
   - synthesizeTasks() function
   - ThisWeeksTasks component
   - Replace Today's Tasks

### LONGER TERM (2-3 days)
7. Page cleanup
   - Run deletion script for 21 pages
   - Simplify navigation

8. Notification overhaul
   - Daily digest instead of hourly
   - Batch related tasks
   - Remove hourly polling

---

## Questions to Answer

1. **Has `seed-plants-to-supabase.ts` been run?**
   - Check: SELECT COUNT(*) FROM plant_timelines;

2. **Which AuthContext is active?** 
   - There are multiple: `src/contexts/AuthContext.tsx` and `app/context/AuthContext.tsx`
   - Need to identify which one is used

3. **Is weather API being called anywhere?**
   - Check: Where is getWeatherData() called from?
   - Is it getting user location passed to it?

4. **What's the status of mobile Capacitor build?**
   - Is it building/deploying?
   - Is Capacitor geolocation permission being requested?

---

## Recommendation

**Don't start new work yet.** Complete Phase 1 blockers first:

1. Populate plant_timelines table (run seed script)
2. Update weather API to use userLocation parameter
3. Create plantDataClient to fetch from DB
4. Test: Verify plant timings change per zone

Only THEN move to Phase 2 (simplification). Doing phases 2-4 before Phase 1 is complete will create integration hell.

**Time to complete Phase 1 blockers:** ~4-6 hours
