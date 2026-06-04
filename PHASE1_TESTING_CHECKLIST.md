# Phase 1 Testing Checklist

## 1. Database Schema (Must Complete First)

**Action:** Run this SQL in your Supabase dashboard:
```sql
ALTER TABLE public.profiles
ADD COLUMN location jsonb NULL DEFAULT NULL;

CREATE INDEX idx_profiles_location ON public.profiles USING gin(location);
```

**Verify:** 
- Go to Supabase Dashboard → SQL Editor
- Run the SQL above
- Check Tables → profiles → columns
- You should see a new `location` column (type: json)

---

## 2. Code Changes (Check These Were Applied)

### ✅ AuthContext Updated
- [ ] File: `app/context/AuthContext.tsx`
- [ ] Imports new location service: `import { getUserLocationFromDB, updateUserLocation, LocationError }`
- [ ] Added state: `detectedLocation`, `locationError`
- [ ] `loadLocationFromDB()` uses `getUserLocationFromDB(user.id)`
- [ ] `confirmLocation()` and `updateLocation()` methods added

### ✅ LocationConfirmation Component Created
- [ ] File: `app/components/LocationConfirmation.tsx` exists
- [ ] Uses `detectLocationOnce()` to get geolocation
- [ ] Falls back to manual suburb picker on permission denial
- [ ] Calls `confirmLocation()` after user confirms

### ✅ Location Select Page Updated
- [ ] File: `app/location-select/page-new.tsx` (or rename to `page.tsx`)
- [ ] Has "Use My Location" button calling `detectLocationOnce()`
- [ ] Has suburb dropdown with all 70+ suburbs
- [ ] Both options call `updateLocation()` and redirect to `/dashboard`

### ✅ Root Layout Updated
- [ ] File: `app/layout.tsx`
- [ ] Imports `LocationConfirmation` component
- [ ] Component rendered in JSX (appears before `{children}`)

---

## 3. Test Scenario A: New User Signup (Happy Path)

**Setup:** Clear browser data / use incognito window

**Steps:**
1. Navigate to `/auth/signup`
2. Fill form: name, email, password
3. Click "Create Account"
4. **Expected:** Redirected to `/auth/verify-email`
5. Verify email (in Supabase Auth console or via link)
6. Log back in
7. **Expected:** Browser requests location permission
8. **Allow** permission
9. **Expected:** Modal shows "Location Detected" with city, state, zone
   - Example: "Hobart, TAS - Zone 8b - Cold climate"
10. Click **Confirm**
11. **Expected:** Toast: "Location set to Hobart, TAS (Zone 8b)"
12. Redirected to dashboard
13. **Verify in DB:** 
    - Supabase Dashboard → Table Browser → profiles
    - Find your user row
    - Check `location` column has JSON:
      ```json
      {
        "lat": -42.8821,
        "lon": 147.3272,
        "city": "Hobart",
        "state": "TAS",
        "auHardinessZone": "8b",
        "climate": "cool"
      }
      ```

---

## 4. Test Scenario B: Permission Denied

**Setup:** Same as above, but **Deny** location permission

**Steps:**
1-8. Follow steps 1-8 from Scenario A
9. Click **Deny** on browser location permission
10. **Expected:** Modal closes, then suburb picker appears
11. Select "Sydney" from dropdown
12. Click "Confirm Location"
13. **Expected:** Toast: "Location set to Sydney, NSW"
14. **Verify in DB:** location has Sydney coords and Zone 10b

---

## 5. Test Scenario C: Returning User (No Geolocation)

**Setup:** Already have a logged-in user

**Steps:**
1. Close and reopen the app
2. Log in
3. **Expected:** NO location permission dialog
4. Dashboard loads instantly
5. Navigate to settings/profile
6. **Expected:** Shows your location: "Sydney, NSW (Zone 10b)"

**Why?** Location is fetched from DB, no geolocation on subsequent logins.

---

## 6. Test Scenario D: Location Select Page

**Setup:** After signup, before dashboard

**Steps:**
1. Navigate to `/location-select`
2. Click "📍 Use My Location"
3. **Expected:** Button shows "Detecting Location..."
4. Browser requests permission
5. Allow → location confirmed → redirect to dashboard
6. OR click "Select Suburb" dropdown, pick "Brisbane"
7. Click "Set Location"
8. **Expected:** Redirect to dashboard

---

## 7. Testing with 3 Zones (Critical)

Test with these 3 locations to verify zone accuracy:

### Zone 8b (Cold/Hobart)
- **City:** Hobart, TAS
- **Lat/Lon:** -42.8821, 147.3272
- **Hardiness Zone:** 8b
- **Climate:** cool
- **Last Frost Date:** May 1
- **First Frost Date:** October 15

### Zone 10b (Temperate/Sydney)
- **City:** Sydney, NSW
- **Lat/Lon:** -33.8688, 151.2093
- **Hardiness Zone:** 10b
- **Climate:** temperate
- **Last Frost Date:** April 1
- **First Frost Date:** November 15

### Zone 11a (Warm/Brisbane)
- **City:** Brisbane, QLD
- **Lat/Lon:** -27.4698, 153.0251
- **Hardiness Zone:** 11a
- **Climate:** warm
- **Last Frost Date:** March 15
- **First Frost Date:** December 1

**How to test:**
1. Create test accounts with each location (or use location picker)
2. Verify DB has correct zone for each
3. Verify frost dates differ (check in dashboard or debug component)

---

## 8. Verify Distances (Haversine)

**Test in browser console:**
```javascript
// Import haversine (or test in Node)
import { haversine } from '@/lib/utils/haversine';

// Hobart to Melbourne: ~730km
console.log(haversine(-42.88, 147.33, -37.81, 144.96)); 

// Should print: ~730
```

---

## 9. Check Error Handling

### Permission Denied
- Allow → geolocation works
- Deny → suburb picker appears (fallback works)

### GPS Timeout
- If GPS takes >10s → LocationError("TIMEOUT")
- UI should fallback to manual picker

### Invalid Location
- Simulate by trying to "detect" in Antarctica
- Should throw SUBURB_NOT_FOUND (no suburb within 100km)

### DB Error
- Stop Supabase momentarily
- Try to save location
- Should show error toast, not crash

---

## 10. Browser Dev Tools Checks

**Open DevTools → Console, expect NO errors:**

```javascript
// Check location data in local storage (optional, for debugging)
localStorage.getItem('userLocation')
// Should be deprecated, but might still exist from old code

// Check that getUserLocationFromDB works
import { getUserLocationFromDB } from '@/lib/locationService';
await getUserLocationFromDB('YOUR_USER_ID');
// Should return { lat, lon, city, state, auHardinessZone, climate }
```

**Network tab:**
- No geolocation API calls (device-side only)
- One Supabase query on app open: `GET /rest/v1/profiles?id=eq.{userId}`
- No reverse-geocoding API calls

---

## 11. Regression Testing (Old Features)

Make sure you didn't break anything:

- [ ] Login still works
- [ ] Signup still works
- [ ] Dashboard loads
- [ ] Weather API still works (should now use user location, not hardcoded Hobart)
- [ ] Plants still display
- [ ] No console errors

---

## 12. What Success Looks Like

✅ New user signs up → location detected → zone shown → saved to DB  
✅ Returning user logs in → location loaded from DB instantly (no geolocation)  
✅ User can manually change location from settings  
✅ Weather API uses user location, not hardcoded Hobart  
✅ 3 zones tested: Hobart (8b), Sydney (10b), Brisbane (11a) — all correct  
✅ No geolocation API calls (device-side only)  
✅ No reverse-geocoding costs  

---

## 13. Troubleshooting

### "User not logged in" error
- Check that user is set in AuthContext
- Add debug log: `console.log('User:', user);` in LocationConfirmation

### "Profile not found" error  
- New user: expected, location will be set on first confirmation
- Existing user: check Supabase profiles table exists and has correct columns

### "Suburb not found" error
- City name must match exactly: "Sydney", not "sydney" or "SYDNEY"
- Check `getAllSuburbs()` returns 70+ entries

### "Network error during refresh"
- This is a Supabase session issue, not location-related
- Likely needs session recovery (already handled in AuthContext)

### Geolocation takes too long
- Timeout is 10s
- Some browsers/OS are slower
- Fallback to manual picker still works

---

## 14. Next Steps After Testing

Once this passes:
1. ✅ Phase 1 is complete: location detection, storage, zone mapping
2. → Phase 2: Plant timeline data migration (zone-keyed)
3. → Phase 3: Weather API integration with user location
4. → Phase 4: Zone-aware plant schedules
