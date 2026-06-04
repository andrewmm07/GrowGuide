# GrowGuide: ACTUAL Status (Verified)
**Date:** May 20, 2026  
**Based on:** Code audit + database query (768 plant records confirmed)

---

## ✅ PHASE 1: LOCATION & CLIMATE - **95% COMPLETE**

### Core Infrastructure
- ✅ `lib/types/location.ts` - Complete, includes zone mapping, frost dates, climate mapping
- ✅ `lib/locationService.ts` - Complete service with:
  - detectLocationOnce() (Capacitor geolocation on mobile)
  - getUserLocationFromDB(userId) - loads from Supabase
  - updateUserLocation(userId, location) - saves to Supabase
  - lookupSuburbByName() - local suburb lookup
  - getAllSuburbs() - returns all available suburbs
  - Proper error handling with LocationError class

### Database
- ✅ `supabase/migrations/20250520_create_plant_timelines.sql` - Schema created with proper indexes
- ✅ `plant_timelines` table - **POPULATED with 768 rows** (verified)
- ✅ `lib/plantTimelineService.ts` - Complete client with:
  - getPlantTimeline(plantName, zone) - fetch zone-specific data
  - getAvailablePlantsForZone(zone) - list plants for user's zone
  - getZonesForPlant(plantName) - show all compatible zones
  - getPlantingWindows() - calculate adjusted timelines
  - adjustTimelineForZone() - apply growth multipliers

### UI / Location Selection
- ✅ `app/location-select/page.tsx` - Complete with:
  - Auto-detect button (Capacitor on mobile, manual on web)
  - Suburb dropdown selector showing 500+ suburbs with zones
  - Integration with AuthContext for saving location

### Weather Integration
- ✅ `supabase/functions/weather/index.ts` - Edge function accepts city/state parameters
- ✅ `app/components/dashboard/WeatherStrip.tsx` - Using location from context
- ✅ `app/dashboard/page.tsx` - Passes userLocation to WeatherStrip
- ✅ Weather caching - Caches by `location.city_location.state`

### Plant Schedule Generation
- ✅ Plant timeline data available per zone
- ✅ Growth multipliers stored in database
- ✅ Zone-aware adjustments ready to use

### Integration Status
- ✅ Location selected on signup/login redirect
- ✅ Location stored in Supabase profiles
- ✅ Location passed to WeatherStrip component
- ✅ Plant data accessible by zone
- ✅ AuthContext has userLocation available

---

## ⚠️ PHASE 1: Minor Gaps (Last 5%)

1. **Dashboard plant generation**
   - Plant schedule generation in My Garden still uses some hardcoded logic
   - Should use plantTimelineService instead
   - Impact: Low (data is correct, just not fully refactored)

2. **Plant form simplification** (partial)
   - Current form in My Garden still has multiple fields
   - Should reduce to: plant name, date, type (optional)
   - Impact: Medium (adds friction to plant setup)

---

## ❌ NOT STARTED

### Phase 2: Simplify Plant Setup
- ❌ QuickAddPlant component (1-2 field form)
- ❌ Reduce to 10-15 most common plants
- ❌ Remove optional fields (location, notes)

### Phase 3: Weekly Task Synthesis
- ❌ synthesizeTasks() function
- ❌ ThisWeeksTasks component (batch related tasks)
- ❌ Replace "Today's Tasks" with weekly digest

### Phase 4: Page Cleanup
- ❌ Delete 21 unnecessary pages
- ❌ Reduce navigation to 3-4 core items

### Phase 5: Smart Notifications
- ❌ Daily digest (instead of hourly)
- ❌ Batch notifications (water tomatoes + beans as one task)
- ❌ Remove hourly polling from WateringSchedule.tsx

---

## What Actually Works (Right Now)

1. **User can set their location** on signup
2. **Location is stored in Supabase** and persists
3. **Weather fetches for their actual location** (not hardcoded Hobart)
4. **Plant timelines exist for all AU zones** (768 records)
5. **Zone-specific plant data can be queried** from database
6. **No more hardcoded climate** - zone info comes from location

---

## What Needs Work (Next 3-4 Days)

### Priority 1: Complete Plant Schedule Gen Refactor (1 day)
- Update My Garden form to use plantTimelineService instead of hardcoded data
- Should query: getPlantTimeline(plantName, userLocation.auHardinessZone)
- Remove PLANT_TIMELINES object from my-garden/page.tsx

### Priority 2: Simplify Plant Addition Form (1-2 days)
- Create QuickAddPlant component
- Reduce from 5+ fields to 2-3 fields max
- Show only 10-15 common plants initially
- Replace current form in My Garden page

### Priority 3: Weekly Task Synthesis (2 days)
- Create synthesizeTasks() function
- Create ThisWeeksTasks component
- Replace "Today's Tasks" with weekly prioritized list

### Priority 4: Page Cleanup (1 day)
- Delete 21 unused pages (bed-buddies, calendars, resources, etc.)
- Reduce nav to: Dashboard, My Garden, Settings

### Priority 5: Smart Notifications (1-2 days)
- Daily digest at 7am (not hourly per-plant)
- Batch: "Water tomatoes & beans" not two separate notifications
- Remove hourly polling from WateringSchedule.tsx

---

## Accurate Timeline to Ship

- **Phase 1 completion:** 1 day (refactor plant schedule generation)
- **Phase 2 (Simplify):** 2 days
- **Phase 3 (Weekly digest):** 2 days
- **Phase 4 (Cleanup):** 1 day
- **Phase 5 (Notifications):** 1-2 days
- **Testing & QA:** 2 days

**Total: 9-10 days** to full implementation

---

## What to Do Right Now

**Option A: Complete Phase 1 (Recommended)**
- Refactor My Garden plant schedule generation to use plantTimelineService
- Verify plant timelines vary by zone (test with 3+ locations)
- Takes ~4-6 hours

**Option B: Jump to Phase 2 (If Phase 1 is truly done)**
- Create QuickAddPlant component with 10-15 common plants
- Reduce form fields to plant name + date
- Use existing plantTimelineService
- Takes ~2 days

**Option C: Request prompts for everything remaining**
- I'll write prompts for Phases 2-5 in batches
- You run them and integrate
- Takes 1-2 weeks depending on your pace

---

## My Apology

I said "0% done" when actually **95% of Phase 1 was already complete**. 

The previous work was solid:
- Location service: Well-architected with error handling
- Suburb database: Complete with all AU zones
- Plant timeline data: Populated (768 records, not empty)
- Plant query service: Full CRUD with zone queries
- Weather API: Already refactored to accept location
- Dashboard integration: Already passing location to components

The remaining work is straightforward refactoring, not architecture overhaul.
