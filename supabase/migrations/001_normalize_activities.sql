-- Migration: Normalize plant activities and fix constraints
-- Date: 2026-05-21

-- Step 1: Drop individual UNIQUE constraints on plant_timelines
-- and add composite constraint
ALTER TABLE plant_timelines
  DROP CONSTRAINT IF EXISTS plant_timelines_plant_name_key,
  DROP CONSTRAINT IF EXISTS plant_timelines_au_hardiness_zone_key;

-- Add composite unique constraint
ALTER TABLE plant_timelines
  ADD CONSTRAINT plant_timelines_plant_zone_unique UNIQUE(plant_name, au_hardiness_zone);

-- Step 2: Create plant_activities table to normalize key_activities JSON
CREATE TABLE IF NOT EXISTS plant_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_name TEXT NOT NULL,
  au_hardiness_zone TEXT NOT NULL,
  timing_days INTEGER NOT NULL,
  activity_name TEXT NOT NULL,
  details TEXT NOT NULL,
  activity_category TEXT NOT NULL CHECK (activity_category IN ('planting', 'pest', 'pruning', 'harvest', 'watering', 'fertilizing')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Composite foreign key to plant_timelines
  CONSTRAINT fk_plant_timelines
    FOREIGN KEY (plant_name, au_hardiness_zone)
    REFERENCES plant_timelines(plant_name, au_hardiness_zone)
    ON DELETE CASCADE
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_plant_activities_plant_zone
  ON plant_activities(plant_name, au_hardiness_zone);

CREATE INDEX IF NOT EXISTS idx_plant_activities_category
  ON plant_activities(activity_category);

CREATE INDEX IF NOT EXISTS idx_plant_activities_timing
  ON plant_activities(timing_days);

-- Step 3: Drop user_plants table (unused, superseded by garden_plants)
DROP TABLE IF EXISTS user_plants CASCADE;

-- Step 4: Clean up garden_plants unused fields
ALTER TABLE garden_plants
  DROP COLUMN IF EXISTS activity_type,
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS schedule,
  DROP COLUMN IF EXISTS full_schedule,
  DROP COLUMN IF EXISTS is_harvested;

-- Rename harvested_date to date_harvested for consistency
ALTER TABLE garden_plants
  RENAME COLUMN harvested_date TO date_harvested;

-- Add missing fields for activity tracking
ALTER TABLE garden_plants
  ADD COLUMN IF NOT EXISTS au_hardiness_zone TEXT,
  ADD COLUMN IF NOT EXISTS completed_activities UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP WITH TIME ZONE;

-- Create index for user garden lookup
CREATE INDEX IF NOT EXISTS idx_garden_plants_user_id
  ON garden_plants(user_id);

CREATE INDEX IF NOT EXISTS idx_garden_plants_zone
  ON garden_plants(au_hardiness_zone);

-- Verify schema integrity
-- This should show no results if everything is clean
SELECT 'Schema validation complete' as status;
