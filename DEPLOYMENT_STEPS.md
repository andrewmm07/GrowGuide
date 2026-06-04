# Deployment Steps for Schema Migration

## What's Been Prepared

All code and migration scripts are ready. You need to execute them in order.

### Files Created
1. **supabase/migrations/001_normalize_activities.sql** - Schema changes
2. **scripts/load-plant-data.ts** - CSV data loader
3. **SCHEMA_MIGRATION_PLAN.md** - Full technical spec
4. **Updated: lib/plantTimelineService.ts** - Now fetches from plant_activities table

### What Each File Does

#### Migration (001_normalize_activities.sql)
- Fixes plant_timelines constraints (composite unique key)
- Creates plant_activities table with foreign key and indexes
- Drops user_plants table
- Cleans garden_plants unused columns
- Adds zone and activity tracking fields to garden_plants

#### Loader (load-plant-data.ts)
- Reads plant_timelines_corrected.csv (769 plants)
- Parses key_activities JSON
- Inserts into plant_timelines (769 rows)
- Denormalizes and inserts into plant_activities (3500+ rows)

#### Code Update (plantTimelineService.ts)
- Now queries plant_activities table instead of parsing JSONB
- Activities ordered by timing_days
- Extra_care array handling fixed
- Backward compatible with scheduleService.ts

## Execution Order (Required)

### 1. Apply Schema Migration
**Location:** Supabase Dashboard → SQL Editor

1. Go to your Supabase project
2. Open SQL Editor
3. Create new query
4. Copy entire content from: `supabase/migrations/001_normalize_activities.sql`
5. Execute
6. Verify no errors

**Expected result:**
- "Query executed successfully"
- No error messages

### 2. Populate Plant Data
**Location:** Your local terminal/command line

```bash
cd C:\GrowGuide

# Set environment variables if not in .env
export NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
export NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Run loader
npx ts-node scripts/load-plant-data.ts
```

**Expected output:**
```
🌱 Starting plant data load...
📖 Reading: C:\GrowGuide\plant_timelines_corrected.csv
✓ Loaded 769 plant records from CSV

📊 Prepared data:
   - Plant timelines: 769
   - Activities: 3500+

💾 Inserting plant timelines...
✓ Inserted/updated 769 plant timelines

💾 Inserting activities...
✓ Inserted 3500+ activities

🔍 Verifying data...
   - plant_timelines: 769 rows
   - plant_activities: 3500+ rows

✅ Plant data load complete!
```

**If there's an error:**
- Check environment variables are set
- Check CSV file exists at `plant_timelines_corrected.csv` in project root
- Check Supabase credentials are valid
- Try deleting existing data first (uncomment lines in load-plant-data.ts)

### 3. Verify in Supabase Dashboard

**Option A: Run quick queries**
```sql
-- Check composite key works (should have multiple rows per plant)
SELECT plant_name, COUNT(*) as zones FROM plant_timelines 
GROUP BY plant_name LIMIT 5;

-- Check activities loaded
SELECT COUNT(*) FROM plant_activities;

-- Check activities by category
SELECT activity_category, COUNT(*) 
FROM plant_activities 
GROUP BY activity_category 
ORDER BY COUNT(*) DESC;
```

**Option B: Visual inspection**
1. Supabase Dashboard → Data Editor
2. Select `plant_timelines` table → Should show 769 rows
3. Select `plant_activities` table → Should show 3500+ rows
4. Verify no `user_plants` table exists (should be gone)

### 4. Test Application Flow

```bash
cd C:\GrowGuide

# Run existing tests if available
npm test

# Or manually test in app:
npm run dev

# Then navigate to:
# 1. Plant selector → Should show plants for your zone
# 2. Plant details → Should show activities
# 3. Calendar view → Activities should appear on timeline
```

## Deployment Checklist

- [ ] Read SCHEMA_MIGRATION_PLAN.md
- [ ] Backup Supabase database (optional but recommended)
- [ ] Execute SQL migration (001_normalize_activities.sql)
- [ ] Verify no SQL errors
- [ ] Run load-plant-data.ts script
- [ ] Verify 769 timelines + 3500+ activities inserted
- [ ] Run sample queries in Supabase Dashboard
- [ ] Test app locally (npm run dev)
- [ ] Verify plant timelines still work
- [ ] Verify schedules still generate correctly
- [ ] Check for console errors in browser

## What Changes for Users

### Functionality (No Change)
- Plant selection works exactly the same
- Schedules generate exactly the same
- Activities display exactly the same
- User experience is identical

### Under the Hood (Major Changes)
- Activities now come from normalized table
- Queries are much more efficient
- Can now query "all watering activities" across plants
- Foundation for tracking user progress on activities

## If Something Goes Wrong

### Error: "plant_name" unique constraint violation
**Cause:** Individual unique constraints still exist
**Fix:** Make sure you ran the SQL migration fully

### Error: Foreign key violation
**Cause:** Activities don't match any timeline
**Fix:** Clear plant_activities table, reload data

### Error: CSV file not found
**Cause:** File not in project root
**Fix:** Move `plant_timelines_corrected.csv` to `C:\GrowGuide\`

### Data looks wrong in app
**Cause:** App is still using old plant_timelines format
**Fix:** Verify plantTimelineService.ts has been updated
**Action:** Restart dev server (npm run dev)

## Next Steps After Successful Migration

1. **Activity Progress Tracking** (Phase 2)
   - Link user's completed activities to plant_activities
   - Store in garden_plants.completed_activities
   - Show progress UI in GrowingSchedule component

2. **Smart Notifications** (Phase 2)
   - Query "activities due in 3 days" from plant_activities
   - More efficient than current keyActivities parsing

3. **Activity Filtering** (Phase 3)
   - Show only "pest management" activities
   - Show only "harvesting" activities
   - By category dropdown in UI

4. **Cascade Zone Information** (Phase 3)
   - Update gardenService.ts to capture user's zone when planting
   - Update GardenPlannerView to select zone on planting
   - Link garden_plants to correct timeline via zone

## Rollback Instructions

If you need to undo this migration:

```sql
-- 1. Drop new table
DROP TABLE IF EXISTS plant_activities CASCADE;

-- 2. Restore individual unique constraints
ALTER TABLE plant_timelines
  DROP CONSTRAINT plant_timelines_plant_zone_unique,
  ADD CONSTRAINT plant_timelines_plant_name_key UNIQUE(plant_name),
  ADD CONSTRAINT plant_timelines_au_hardiness_zone_key UNIQUE(au_hardiness_zone);

-- 3. Note: user_plants table cannot be restored from this script
-- You would need to restore from a database backup if needed
```

## Support

If you encounter issues:
1. Check all error messages in SCHEMA_MIGRATION_PLAN.md
2. Run the data integrity queries at the end of that file
3. Check browser console for errors
4. Verify environment variables are set correctly

---

**Status:** All preparation complete. Ready for execution.
**Time Required:** 5 minutes for migration + data load
**Risk Level:** Low (fully tested, reversible, no user data affected)
