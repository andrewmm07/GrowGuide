# Phase 2 Migration Instructions

## Overview
This document guides executing the Phase 2 plant timeline migration from hardcoded data to Supabase.

## Prerequisites
- Supabase project set up with PostgreSQL database
- `supabase` CLI installed: https://supabase.com/docs/guides/cli
- Project credentials configured

## Step 1: Apply the Migration

Run the schema migration to create the `plant_timelines` table:

```bash
supabase migration up
```

Or manually via Supabase dashboard:
1. Go to SQL Editor in your Supabase project
2. Open file: `supabase/migrations/20250520_create_plant_timelines.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click "Run"

Expected output: Table created with 3 indexes and 1 trigger.

## Step 2: Seed the Database

Execute the plant data INSERT statements:

```bash
cat supabase/seeds/plant_timelines_complete.sql | supabase sql
```

Or manually:
1. Go to SQL Editor in Supabase dashboard
2. Open file: `supabase/seeds/plant_timelines_complete.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click "Run"

Expected output: 200 rows inserted (20 plants × 10 zones).

## Verification

Verify the migration succeeded:

```sql
-- Check table structure
\d plant_timelines

-- Count rows
SELECT COUNT(*) FROM plant_timelines;
-- Expected: 200

-- Check a specific plant
SELECT * FROM plant_timelines 
WHERE plant_name = 'Tomatoes' 
AND au_hardiness_zone = '9b';

-- Check available plants for a zone
SELECT DISTINCT plant_name FROM plant_timelines
WHERE au_hardiness_zone = '10a'
ORDER BY plant_name;
```

## Troubleshooting

**Issue: "relation already exists"**
- Table was already created in Phase 1 testing
- Safe to ignore, migration is idempotent

**Issue: "column location of relation profiles already exists"**
- Expected from Phase 1. Location column already exists in profiles table
- Safe to skip that part of the migration

**Issue: Foreign key violations**
- Ensure profiles table exists with correct schema
- Run: `SELECT * FROM information_schema.tables WHERE table_name='profiles';`

## Next Steps

After successful migration:
1. Create PlantPicker component that queries available plants for user's zone
2. Update schedule generation to use `plantTimelineService.getPlantTimeline()`
3. Test with actual location selection and plant selection
4. Deploy changes

## Rollback (if needed)

To remove plant_timelines table:

```bash
supabase migration down
```

Or manually delete via SQL Editor:

```sql
DROP TABLE IF EXISTS plant_timelines CASCADE;
```
