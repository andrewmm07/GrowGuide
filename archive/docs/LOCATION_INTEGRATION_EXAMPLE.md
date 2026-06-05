# Location Integration Example

This shows concrete code for integrating the location service into existing components.

---

## 1. AuthContext Integration (Signup Flow)

**File:** `app/context/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/app/lib/supabase';
import { 
  detectLocationOnce, 
  updateUserLocation, 
  LocationError 
} from '@/lib/locationService';
import { UserLocation } from '@/lib/types/location';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  userLocation: UserLocation | null;
  detectedLocation: UserLocation | null; // Pending confirmation
  locationError: LocationError | null;
  confirmLocation: (location: UserLocation) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [detectedLocation, setDetectedLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<LocationError | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        // After signup, detect location
        if (event === 'SIGNED_IN' && session?.user?.id) {
          await detectAndSaveLocation(session.user.id);
        }

        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function detectAndSaveLocation(userId: string) {
    try {
      const location = await detectLocationOnce();
      setDetectedLocation(location); // Show to user for confirmation
      setLocationError(null);
    } catch (error) {
      if (error instanceof LocationError) {
        setLocationError(error);
        // If permission denied, user will select manually
        // If geolocation unavailable, show fallback
      }
    }
  }

  async function confirmLocation(location: UserLocation) {
    if (!session?.user?.id) return;

    try {
      await updateUserLocation(session.user.id, location);
      setUserLocation(location);
      setDetectedLocation(null); // Clear pending
      setLocationError(null);
    } catch (error) {
      if (error instanceof LocationError) {
        setLocationError(error);
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        userLocation,
        detectedLocation,
        locationError,
        confirmLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## 2. Signup Confirmation Component

**File:** `app/components/LocationConfirmation.tsx`

```typescript
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { lookupSuburbByName, getAllSuburbs } from '@/lib/locationService';
import { UserLocation } from '@/lib/types/location';
import toast from 'react-hot-toast';

export function LocationConfirmation() {
  const { detectedLocation, locationError, confirmLocation } = useAuth();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedSuburb, setSelectedSuburb] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);

  // If no pending location, don't show
  if (!detectedLocation && !locationError && !showPicker) {
    return null;
  }

  async function handleConfirmDetected() {
    setIsConfirming(true);
    try {
      await confirmLocation(detectedLocation!);
      toast.success(
        `Location set to ${detectedLocation?.city}, ${detectedLocation?.state}`
      );
    } catch (error) {
      toast.error('Failed to save location');
    } finally {
      setIsConfirming(false);
    }
  }

  async function handleSelectSuburb() {
    if (!selectedSuburb) {
      toast.error('Please select a suburb');
      return;
    }

    setIsConfirming(true);
    try {
      const location = lookupSuburbByName(selectedSuburb);
      await confirmLocation(location);
      toast.success(`Location set to ${location.city}, ${location.state}`);
      setShowPicker(false);
    } catch (error) {
      toast.error('Suburb not found');
    } finally {
      setIsConfirming(false);
    }
  }

  // Error state: show suburb picker
  if (locationError || showPicker) {
    const suburbs = getAllSuburbs();

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <h2 className="text-xl font-bold mb-2">Select Your Location</h2>
          <p className="text-gray-600 text-sm mb-4">
            {locationError
              ? `Could not detect location: ${locationError.message}`
              : 'Select your suburb from the list below'}
          </p>

          <select
            value={selectedSuburb}
            onChange={(e) => setSelectedSuburb(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
          >
            <option value="">-- Select a suburb --</option>
            {suburbs.map((s) => (
              <option key={`${s.state}-${s.name}`} value={s.name}>
                {s.name}, {s.state} (Zone {s.zone})
              </option>
            ))}
          </select>

          <button
            onClick={handleSelectSuburb}
            disabled={isConfirming || !selectedSuburb}
            className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {isConfirming ? 'Saving...' : 'Confirm Location'}
          </button>
        </div>
      </div>
    );
  }

  // Success state: show detected location for confirmation
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-2">📍 Location Detected</h2>

        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
          <p className="font-semibold text-lg">
            {detectedLocation?.city}, {detectedLocation?.state}
          </p>
          <p className="text-gray-600 text-sm">
            Hardiness Zone: {detectedLocation?.auHardinessZone}
          </p>
          <p className="text-gray-600 text-sm">
            Climate: {detectedLocation?.climate}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Latitude: {detectedLocation?.lat.toFixed(4)}, Longitude:{' '}
            {detectedLocation?.lon.toFixed(4)}
          </p>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Is this correct? We'll use this to give you gardening advice for your region.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPicker(true)}
            className="flex-1 border border-gray-300 py-2 rounded font-semibold hover:bg-gray-50"
          >
            Change
          </button>

          <button
            onClick={handleConfirmDetected}
            disabled={isConfirming}
            className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {isConfirming ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 3. Profile Form Update

**File:** `app/components/ProfileForm.tsx` (excerpt)

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getUserLocationFromDB, updateUserLocation, getAllSuburbs } from '@/lib/locationService';
import { UserLocation } from '@/lib/types/location';
import toast from 'react-hot-toast';

export function ProfileForm() {
  const { session } = useAuth();
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChangeLocation, setShowChangeLocation] = useState(false);
  const [selectedSuburb, setSelectedSuburb] = useState<string>('');

  useEffect(() => {
    if (!session?.user?.id) return;

    async function loadLocation() {
      try {
        const loc = await getUserLocationFromDB(session.user.id);
        setLocation(loc);
      } catch (error) {
        console.error('Failed to load location:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLocation();
  }, [session?.user?.id]);

  async function handleChangeLocation() {
    if (!session?.user?.id || !selectedSuburb) {
      toast.error('Please select a suburb');
      return;
    }

    try {
      const { lookupSuburbByName } = await import('@/lib/locationService');
      const newLocation = lookupSuburbByName(selectedSuburb);
      await updateUserLocation(session.user.id, newLocation);
      setLocation(newLocation);
      setShowChangeLocation(false);
      toast.success('Location updated');
    } catch (error) {
      toast.error('Failed to update location');
    }
  }

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {/* Location Display */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">📍 Your Location</h2>
        {location ? (
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
            <p className="font-semibold text-lg">
              {location.city}, {location.state}
            </p>
            <p className="text-gray-600">Zone {location.auHardinessZone}</p>
            <p className="text-gray-600 text-sm capitalize">{location.climate} climate</p>
          </div>
        ) : (
          <p className="text-gray-500">Location not set</p>
        )}

        {!showChangeLocation && (
          <button
            onClick={() => {
              setShowChangeLocation(true);
              setSelectedSuburb(location?.city || '');
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            Change Location
          </button>
        )}
      </div>

      {/* Change Location Modal */}
      {showChangeLocation && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Select New Location</h3>

          <select
            value={selectedSuburb}
            onChange={(e) => setSelectedSuburb(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
          >
            <option value="">-- Select suburb --</option>
            {getAllSuburbs().map((s) => (
              <option key={`${s.state}-${s.name}`} value={s.name}>
                {s.name}, {s.state} (Zone {s.zone})
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setShowChangeLocation(false)}
              className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleChangeLocation}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Weather API Update

**File:** `src/services/weatherApi.ts`

```typescript
import { getUserLocationFromDB } from '@/lib/locationService';
import { UserLocation } from '@/lib/types/location';

const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;

/**
 * Fetch weather for user's location (not hardcoded Hobart)
 */
export async function getWeatherForecast(
  userId: string,
  fallbackLocation?: UserLocation
): Promise<WeatherData> {
  try {
    // Get user's location from DB
    let location = await getUserLocationFromDB(userId);

    // If not found, use fallback or error
    if (!location) {
      if (fallbackLocation) {
        location = fallbackLocation;
      } else {
        throw new Error('User location not found');
      }
    }

    // Fetch weather for user's location
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location.lat},${location.lon}&days=7&aqi=no`,
      { next: { revalidate: 3600 } } // Cache 1 hour
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        lat: data.location.lat,
        lon: data.location.lon,
      },
      current: {
        tempC: data.current.temp_c,
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        windKph: data.current.wind_kph,
      },
      forecast: data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        maxTempC: day.day.maxtemp_c,
        minTempC: day.day.mintemp_c,
        condition: day.day.condition.text,
        chanceOfRain: day.day.daily_chance_of_rain,
      })),
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
}

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    tempC: number;
    condition: string;
    humidity: number;
    windKph: number;
  };
  forecast: Array<{
    date: string;
    maxTempC: number;
    minTempC: number;
    condition: string;
    chanceOfRain: number;
  }>;
}
```

---

## 5. Using Frost Dates in Plant Service

**File:** `src/services/wateringService.ts` (excerpt)

```typescript
import { getFrostDates } from '@/lib/types/location';
import { UserLocation } from '@/lib/types/location';

/**
 * Calculate frost-safe planting date for frost-sensitive crops
 */
export function getFirstPlantingDate(
  plant: PlantType,
  location: UserLocation
): Date {
  // Get frost dates for zone
  const frostDates = getFrostDates(location.auHardinessZone);

  // Convert to this year
  const year = new Date().getFullYear();
  const lastFrost = new Date(
    year,
    frostDates.lastFrostDateMonth - 1,
    frostDates.lastFrostDateDay
  );

  // Add safety margin (2 weeks after last frost)
  const safeDate = new Date(lastFrost);
  safeDate.setDate(safeDate.getDate() + 14);

  return safeDate;
}

/**
 * Get frost-sensitive planting window
 */
export function getPlantingWindow(
  plant: PlantType,
  location: UserLocation
): { start: Date; end: Date } {
  const frostDates = getFrostDates(location.auHardinessZone);
  const year = new Date().getFullYear();

  const lastFrost = new Date(
    year,
    frostDates.lastFrostDateMonth - 1,
    frostDates.lastFrostDateDay
  );

  const firstFrost = new Date(
    year,
    frostDates.firstFrostDateMonth - 1,
    frostDates.firstFrostDateDay
  );

  // Start: 2 weeks after last frost
  const start = new Date(lastFrost);
  start.setDate(start.getDate() + 14);

  // End: 8 weeks before first frost
  const end = new Date(firstFrost);
  end.setDate(end.getDate() - 56);

  return { start, end };
}
```

---

## Testing the Integration

```bash
# 1. Run type check
npx tsc --noEmit

# 2. Test location service in Node
node -e "
const { haversine } = require('./lib/utils/haversine');
console.log('Distance Hobart to Melbourne:', haversine(-42.88, 147.33, -37.81, 144.96), 'km');
"

# 3. Test suburb lookup
node -e "
const { lookupSuburbByName } = require('./lib/locationService');
const loc = lookupSuburbByName('Sydney');
console.log(JSON.stringify(loc, null, 2));
"
```

---

## What This Achieves

✅ Location detected on signup (device-side, no API)  
✅ Stored in Supabase (survives reinstall)  
✅ Retrieved instantly on app open (no geolocation)  
✅ User can confirm or change anytime from settings  
✅ Zone-aware frost dates for planting  
✅ Weather API uses user location, not hardcoded Hobart  
✅ Extensible: add more suburbs as needed  
✅ Zero reverse-geocoding costs
