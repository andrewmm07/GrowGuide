-- Legacy: originally altered public.users (not used on Supabase).
-- GrowGuide stores location on profiles (see 20240321, 20250522_profiles_location_jsonb.sql).
-- No-op on fresh projects.

SELECT '20240320: skipped (location is on profiles, not users)' AS status;
