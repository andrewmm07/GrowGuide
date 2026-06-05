# Supabase migrations

Apply in filename order. All statements are idempotent where possible (`IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`).

| Migration | Purpose |
|-----------|---------|
| `001_normalize_activities.sql` | Plant activities normalization (**run after** `20250520_create_plant_timelines` + `20240324`) |
| `002_enable_plant_activities_public_read.sql` | Public read for plant activities |
| `20240320_add_location_fields.sql` | No-op (legacy; was `ALTER TABLE users`) |
| `20240321_create_profiles_table.sql` | `profiles` table with `location` jsonb |
| `20240322_setup_profiles_rls.sql` | Profiles RLS |
| `20240323_cleanup_profiles_rls.sql` | RLS cleanup |
| `20240324_create_garden_plants.sql` | Garden plants table |
| `20250520_add_full_schedule_to_garden_plants.sql` | `full_schedule` on garden plants |
| `20250520_create_plant_timelines.sql` | Plant timelines |
| `20250520_user_tasks.sql` | `user_tasks` table |
| `20250522_user_projects.sql` | `user_projects` table |
| `20250522_user_tasks_project_id.sql` | `project_id` on tasks |
| `20250522_profiles_location_jsonb.sql` | Cast `profiles.location` to jsonb |
| `20250531_notifications.sql` | In-app `notifications` + profile preference columns |
| `20250601_push_device_tokens.sql` | FCM device tokens + `notifications.push_sent_at` |

## Push (FCM)

See [docs/PUSH_NOTIFICATIONS.md](../docs/PUSH_NOTIFICATIONS.md). Edge function: `supabase/functions/send-push`.

## Canonical client writes

- **Location:** `lib/locationService.updateUserLocation()` → `profiles.location` (`UserLocation` jsonb)
- **Tasks:** `app/hooks/useTasks.ts` → `user_tasks`
- **Projects:** `app/hooks/useProjects.ts` → `user_projects`
- **Garden:** `app/context/GardenContext.tsx` → `garden_plants`

`profiles.location` stores `placeId`, `microclimateTags`, `climate`, and coordinates. No separate microclimate column is required.

## Fresh database (SQL Editor order)

Do **not** use filename order starting with `001`. On an empty project, run:

1. `20240321_create_profiles_table.sql`
2. `20240322_setup_profiles_rls.sql`
3. `20240323_cleanup_profiles_rls.sql`
4. `20240324_create_garden_plants.sql`
5. `20250520_create_plant_timelines.sql`
6. `001_normalize_activities.sql`
7. `002_enable_plant_activities_public_read.sql`
8. `20250520_add_full_schedule_to_garden_plants.sql`
9. `20250520_user_tasks.sql` through `20250602_notification_digest_cron.sql`
10. Seed: `supabase/seeds/plant_timelines_seed.sql` (or complete seed)
