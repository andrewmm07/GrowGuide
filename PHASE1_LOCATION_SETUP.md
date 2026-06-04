# Phase 1: Location & Climate Setup

## Files Created

### 1. `lib/types/location.ts`
Core type definitions and utilities for Australian hardiness zones.

**Exports:**
- `UserLocation` — interface with lat, lon, city, state, auHardinessZone, climate
- `AUHardinessZone` — union type '8a' to '12b'
- `Climate` — 'cold' | 'cool' | 'temperate' | 'warm' | 'tropical'
- `mapZoneToClimate(zone)` — converts zone to climate category
- `getMinWinterTemp(zone)` — returns minimum temperature for frost planning
- `getFrostDates(zone)` — returns first/last frost dates for planting

**Hardiness Zones Covered:**
- 8a/8b (cold): Hobart, Tasmania
- 9a/9b (cool): Melbourne, southern NSW, Victoria
- 10a/10b (temperate): Sydney, central NSW, Adelaide, Perth
- 11a/11b (warm): Brisbane, north QLD
- 12a/12b (tropical): Darwin, far north QLD

---

### 2. `lib/utils/haversine.ts`
Distance calculation for finding nearest suburb from device GPS.

**Exports:**
- `haversine(lat1, lon1, lat2, lon2)` → distance in km
- `findNearest(userLat, userLon, points)` → nearest point + distance

**Why haversine:**
- No API calls (device-side only)
- Accurate for Australian scale (matches suburb to user location within 100km)
- Lightweight, proven algorithm

---

### 3. `lib/auSuburbData.ts`
Complete Australian suburb database with coordinates and hardiness zones.

**Coverage:**
- 70+ suburbs across all 8 Australian states/territories
- Organized by state: TAS, VIC, NSW, QLD, SA, WA, NT, ACT
- Zones 8a–12b represented
- Major cities + regional towns + suburbs

**Utility functions:**
- `findSuburbByName(name)` — case-insensitive lookup
- `findSuburbsByState(state)`
- `findSuburbsByZone(zone)`
- `getAllStates()`, `getAllZones()`

**Why local data, not API:**
- Zero reverse-geocoding costs (no Google Maps API)
- Instant lookup (no network latency)
- Extensible: add suburbs as needed
- Offline support (data bundled in app)

---

### 4. `lib/locationService.ts`
Main service handling location detection, DB storage, and user queries.

**Key Functions:**

#### `detectLocationOnce()` → Promise<UserLocation>
- Requests permission (one-time on signup)
- Calls Capacitor Geolocation (device-side)
- Finds nearest suburb using haversine
- Validates coordinates (must be within Australia bounds)
- Throws `LocationError` with type if fails

**Error Handling:**
- `PERMISSION_DENIED` — user rejected location access
- `TIMEOUT` — GPS took >10s
- `SUBURB_NOT_FOUND` — no suburbs within 100km
- `INVALID_COORDINATES` — outside Australia or corrupted data

#### `getUserLocationFromDB(userId)` → Promise<UserLocation | null>
- Fast path: queries Supabase `profiles.location` column
- Used on every app open (no geolocation, instant)
- Returns null if location not set (e.g., new user)
- Returns null if profile doesn't exist yet

#### `updateUserLocation(userId, location)` → Promise<void>
- Saves location to Supabase after user confirms
- Validates all fields before saving
- Idempotent (safe to call multiple times)

#### `lookupSuburbByName(suburbName)` → UserLocation
- Manual fallback when geolocation denied
- Used by UI suburb picker
- Case-insensitive search

#### `getAllSuburbs()` → Array
- Returns all suburbs sorted by state, then name
- Used to populate dropdown/picker UI

---

## Integration with Existing Codebase

### 1. Update `app/context/AuthContext.tsx`

After user signup, trigger location detection:

```typescript
// In signup handler
try {
  const location = await detectLocationOnce();
  // Show confirmation UI
  setDetectedLocation(location); // state for user review
} catch (error) {
  // If permission denied, show manual suburb picker
  setShowSuburbPicker(true);
}
```

### 2. Update `app/components/ProfileForm.tsx`

Replace hardcoded Hobart with user's detected location:

```typescript
import { getUserLocationFromDB, updateUserLocation } from '@/lib/locationService';

// On component mount
useEffect(() => {
  const loadLocation = async () => {
    const loc = await getUserLocationFromDB(user.id);
    if (loc) {
      setDisplayLocation(loc);
    }
  };
  loadLocation();
}, [user.id]);

// In form, show location from context
<div>
  <p>📍 {location.city}, {location.state} (Zone {location.auHardinessZone})</p>
  <p>Climate: {location.climate}</p>
  <button onClick={() => setShowLocationPicker(true)}>
    Change Location
  </button>
</div>
```

### 3. Update `src/services/weatherApi.ts`

Replace hardcoded Hobart coordinates:

```typescript
// OLD (line 4):
const DEFAULT_LOCATION = { lat: -42.8821, lon: 147.3272 }; // Hobart hardcoded

// NEW:
// Use location from context or DB
const location = await getUserLocationFromDB(userId);
const coords = { lat: location.lat, lon: location.lon };

// Then fetch weather for user's location
const weather = await fetch(
  `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${coords.lat},${coords.lon}&days=7`
);
```

### 4. Database Schema Update

Add location column to `profiles` table:

```sql
-- Migration file: supabase/migrations/[timestamp]_add_location_to_profiles.sql
ALTER TABLE public.profiles
ADD COLUMN location jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Index for faster lookups
CREATE INDEX idx_profiles_location ON public.profiles USING gin(location);

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.location IS 'UserLocation: {lat, lon, city, state, auHardinessZone, climate}';
```

### 5. Update Plant Schedule Service

Once location is available, use zone for plant timing:

```typescript
// In src/services/wateringService.ts or generatePlantSchedule()

import { UserLocation } from '@/lib/types/location';
import { getFrostDates } from '@/lib/types/location';

function generateScheduleForPlant(plant: Plant, location: UserLocation) {
  // Get frost dates for user's zone
  const frostDates = getFrostDates(location.auHardinessZone);
  
  // Adjust planting dates based on frost dates
  const lastFrostDate = new Date(new Date().getFullYear(), frostDates.lastFrostDateMonth - 1, frostDates.lastFrostDateDay);
  
  // Use zone-aware plant data from DB (Phase 2)
  // For now, apply climate-based multiplier to hardcoded timelines
  const multiplier = getWateringMultiplier(location.climate, plant.type);
  
  return {
    ...plant,
    nextWateringDate: calculateNextWatering(plant, multiplier),
  };
}
```

---

## Signup Flow (UI)

1. **User taps "Create Account"** → AuthContext captures signup
2. **"Detecting location..."** → `detectLocationOnce()` runs in background
3. **Permission dialog appears** → User grants/denies location access
4. **If granted:**
   - Show detected location: "You're in Hobart, TAS (Zone 8b). Correct?"
   - Buttons: "✓ Yes" | "Change Location"
   - If Yes → `updateUserLocation(userId, location)` → done
   - If Change → Show suburb picker (sorted list of 70+ suburbs)
5. **If denied:**
   - Show suburb picker immediately
   - User selects manually

---

## Key Design Decisions

### Device-Side Location Only
- **Pro:** No API calls, instant, offline support, no costs
- **Con:** ±0.5km accuracy (acceptable for weekly tasks)
- **Why:** Reverse-geocoding APIs (Google, Here) cost $5–10 per 1000 calls. At scale, this is expensive.

### Haversine Distance (Not A*/KD-tree)
- **Pro:** Simple, fast for 70 suburbs, no dependencies
- **Con:** Slower if suburb DB grows to 1000+ entries
- **Why:** Current dataset is small. Revisit if expanding beyond 200 suburbs.

### JSONB Column in Supabase (Not Separate Table)
- **Pro:** Single round-trip query, no joins, flexible schema
- **Con:** Can't index individual fields efficiently
- **Why:** Users have exactly one location. Denormalization is fine.

### No Postcode Support (Yet)
- Australia has ~2400 unique postcodes
- Each maps to multiple suburbs (postcodes cross suburb boundaries)
- Added stub `lookupSuburbByPostcode()` for future expansion
- Current solution: suburb name picker (70 entries, sufficient)

---

## Testing Checklist

- [ ] Location detected on signup (Hobart/cool zone)
- [ ] Permission denied → fallback to manual picker works
- [ ] Location retrieved from DB (no geolocation on subsequent opens)
- [ ] Climate mapping correct for zones 8a, 10b, 12b
- [ ] Weather API uses user location, not hardcoded Hobart
- [ ] Frost dates differ by zone
- [ ] Suburb picker sorted and searchable
- [ ] Database stores location JSON correctly

---

## Files Modified/Created

**Created:**
- ✅ `lib/types/location.ts`
- ✅ `lib/locationService.ts`
- ✅ `lib/auSuburbData.ts`
- ✅ `lib/utils/haversine.ts`

**Next to Modify:**
- `app/context/AuthContext.tsx` — add location detection
- `app/components/ProfileForm.tsx` — show/edit location
- `src/services/weatherApi.ts` — use user location
- `supabase/migrations/[timestamp]_add_location_to_profiles.sql` — DB schema
- `src/services/wateringService.ts` — use zone-aware plant data

---

## Dependency Notes

**New Requirements:**
- `@capacitor/geolocation` — already listed in Capacitor setup
- `@supabase/supabase-js` — already in use

**No Breaking Changes:**
- Existing plant data remains functional (uses defaults)
- AuthContext changes are additive (don't break existing flow)
- Backward compatible: users without location get defaults

---

## Next Phase (Phase 2)

Once location is live:
1. Migrate plant_timelines to Supabase (zone-keyed)
2. Replace hardcoded plant data in `app/my-garden/page.tsx`
3. Generate schedules using zone-aware DB data
4. Verify timing accuracy across 3 zones (Hobart, Sydney, Brisbane)
