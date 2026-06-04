-- Canonical UserLocation is JSON (see lib/types/location.ts), not plain text.
-- Existing TEXT values that are valid JSON objects are cast to jsonb.

COMMENT ON COLUMN profiles.location IS
  'Canonical UserLocation JSON object (city, state, lat, lon, auHardinessZone, climate). Written only via lib/locationService.updateUserLocation().';

ALTER TABLE profiles
  ALTER COLUMN location TYPE jsonb
  USING (
    CASE
      WHEN location IS NULL OR btrim(location) = '' THEN NULL
      WHEN btrim(location) ~ '^[\{\[]' THEN location::jsonb
      ELSE NULL
    END
  );
