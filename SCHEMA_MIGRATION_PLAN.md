# GrowGuide Schema Migration Plan

## Objective
Normalize plant activity data and fix schema constraints to support the corrected plant_timelines CSV data.

## Changes Summary

### 1. Schema Fixes (plant_timelines table)
**Current Problem:** Individual UNIQUE constraints on `plant_name` and `au_hardiness_zone` prevent:
- Same plant in multiple zones
- Multiple plants per zone

**Fix:** Replace with composite UNIQUE constraint on `(plant_name, au_hardiness_zone)`

**Impact:** Migration already prepared in `supabase/migrations/001_normalize_activities.sql`

### 2. New Table: plant_activities
**Purpose:** Normalize key_activities JSON array into queryable rows

**Schema:**
```sql
plant_activities (
  id UUID PRIMARY KEY,
  plant_name TEXT NOT NULL,
  au_hardiness_zone TEXT NOT NULL,
  timing_days INTEGER,
  activity_name TEXT,
  details TEXT,
  activity_category TEXT ('planting' | 'pest' | 'pruning' | 'harvest' | 'watering' | 'fertilizing'),
  created_at TIMESTAMP,
  FOREIGN KEY (plant_name, au_hardiness_zone) REFERENCES plant_timelines
)
```

**Benefits:**
- Query activities by category across plants
- Index by timing for "what's due today" queries
- Proper referential integrity
- Easier to track user progress on activities

### 3. Removed: user_plants table
**Reason:** Never used in codebase, superseded by `garden_plants`

**Action:** Drop entirely

**Verification:** grep confirms zero references in codebase

### 4. Cleaned: garden_plants table
**Removed fields:** activity_type, type, schedule, full_schedule, is_harvested
**Reason:** Unused, confusing schema bloat

**Added fields:**
- `au_hardiness_zone TEXT` - Links user's plant to correct timeline
- `completed_activities UUID[]` - Track which activities user has done
- `last_activity_date TIMESTAMP` - For activity sequencing

## Execution Steps

### Step 1: Apply Schema Migration
```bash
# Option A: Via Supabase Dashboard SQL Editor
# Copy entire contents of supabase/migrations/001_normalize_activities.sql
# Paste into SQL editor and execute

# Option B: Via Supabase CLI
supabase migration up --local
supabase db push
```

**Expected output:**
- Constraints updated on plant_timelines
- plant_activities table created with 3 indexes
- user_plants dropped
- garden_plants cleaned
- No errors

### Step 2: Load Plant Data
```bash
npx ts-node scripts/load-plant-data.ts
```

**Input:** `plant_timelines_corrected.csv`
**Outputs:**
- 769 rows in plant_timelines
- 3,500+ rows in plant_activities (parsed from key_activities JSON)

**Verification:**
```sql
-- Should return plant name + zone combinations
SELECT DISTINCT plant_name, au_hardiness_zone FROM plant_activities LIMIT 10;

-- Should show activity category distribution
SELECT activity_category, COUNT(*) FROM plant_activities GROUP BY activity_category;
```

### Step 3: Verify Application Logic
Code changes already implemented:
- ✅ `plantTimelineService.ts` updated to fetch from plant_activities
- ✅ Activities fetched from database instead of parsing JSONB
- ✅ Extra_care array handling fixed
- ✅ Backward compatible with scheduleService.ts

### Step 4: Update garden_plants on User Planting
When user plants something, also store:
```sql
INSERT INTO garden_plants (
  id, user_id, plant_name, date_planted, au_hardiness_zone, ...
)
```

Update `gardenService.ts` to capture zone when user plants.

### Step 5: Test Full Flow
```bash
# Test existing functionality
npx ts-node scripts/test-plant-load.ts

# Verify a plant can be planted and schedule generated
```

## Migration Checklist

- [ ] Read entire plant_timelines_corrected.csv (769 rows)
- [ ] Apply schema migration (001_normalize_activities.sql)
- [ ] Run load-plant-data.ts script
- [ ] Verify both tables populated correctly
- [ ] Test plantTimelineService.getPlantTimeline() 
- [ ] Test scheduleService.generatePlantSchedule()
- [ ] Verify plant_activities queries work
- [ ] Update frontend to handle garden_plants.au_hardiness_zone
- [ ] Test gardening workflow end-to-end

## Rollback Plan

If something goes wrong:

```sql
-- Restore UNIQUE constraints individually (old way)
ALTER TABLE plant_timelines
  ADD CONSTRAINT plant_timelines_plant_name_key UNIQUE(plant_name),
  ADD CONSTRAINT plant_timelines_au_hardiness_zone_key UNIQUE(au_hardiness_zone);

-- Drop new table
DROP TABLE IF EXISTS plant_activities CASCADE;

-- Restore user_plants
CREATE TABLE user_plants (...); -- Use previous schema
```

## Files Modified

**New Files:**
- `supabase/migrations/001_normalize_activities.sql` - Schema migration
- `scripts/load-plant-data.ts` - CSV loader
- `SCHEMA_MIGRATION_PLAN.md` - This file

**Updated Files:**
- `lib/plantTimelineService.ts` - Fetch activities from plant_activities table

**To Update (next phase):**
- `lib/gardenService.ts` - Capture au_hardiness_zone on plant creation
- `app/components/GardenPlannerView.tsx` - May need zone selection on planting

## Data Integrity Checks

After migration, run these queries to verify:

```sql
-- 1. Check for orphaned activities
SELECT COUNT(*) FROM plant_activities pa
WHERE NOT EXISTS (
  SELECT 1 FROM plant_timelines pt
  WHERE pt.plant_name = pa.plant_name AND pt.au_hardiness_zone = pa.au_hardiness_zone
);
-- Should return: 0

-- 2. Verify all timelines have activities
SELECT pt.plant_name, pt.au_hardiness_zone, COUNT(pa.id) as activity_count
FROM plant_timelines pt
LEFT JOIN plant_activities pa ON (pt.plant_name = pa.plant_name AND pt.au_hardiness_zone = pa.au_hardiness_zone)
GROUP BY pt.plant_name, pt.au_hardiness_zone
HAVING COUNT(pa.id) = 0;
-- Should return: 0 rows (all timelines should have activities)

-- 3. Activity category distribution
SELECT activity_category, COUNT(*) as count
FROM plant_activities
GROUP BY activity_category
ORDER BY count DESC;

-- 4. Zone distribution
SELECT au_hardiness_zone, COUNT(DISTINCT plant_name) as plant_count
FROM plant_timelines
GROUP BY au_hardiness_zone
ORDER BY au_hardiness_zone;
```

## Questions & Answers

**Q: Why remove user_plants instead of garden_plants?**
A: `garden_plants` is actively used by `gardenService.ts`. `user_plants` has zero references in codebase and appears to be legacy.

**Q: What if I need plant_care_activities table?**
A: Can be left as-is. It tracks logged user activities (when they watered, pruned, etc.). `plant_activities` is reference data (what should be done). They serve different purposes once linked properly.

**Q: How do I track user progress on activities?**
A: Use `garden_plants.completed_activities` (UUID array) to store which plant_activities.id have been completed by the user.

**Q: Will existing garden_plants data break?**
A: No. The removed columns (activity_type, schedule, etc.) were unused. Existing rows continue to work.

**Q: What about the climate_note field from CSV?**
A: Stored in `plant_timelines.climate_note` but not used yet. Visible in API response, ready for future features.
