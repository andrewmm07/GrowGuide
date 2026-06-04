-- Phase 2: Create zone-aware plant timelines table
-- This replaces hardcoded PLANT_TIMELINES object in app/my-garden/page.tsx
-- One row per (plant_name, au_hardiness_zone) combination allows zone-specific lookups

CREATE TABLE IF NOT EXISTS plant_timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_name TEXT NOT NULL,
  au_hardiness_zone TEXT NOT NULL,
  sow_to_seedling INTEGER NOT NULL,
  seedling_to_harvest INTEGER NOT NULL,
  harvest_window INTEGER NOT NULL,
  growth_multiplier NUMERIC NOT NULL,
  watering_frequency INTEGER NOT NULL,
  extra_care TEXT[] NOT NULL DEFAULT '{}',
  key_activities JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plant_name, au_hardiness_zone)
);

-- Create index for fast lookups by plant_name and zone
CREATE INDEX idx_plant_timelines_plant_zone
ON plant_timelines(plant_name, au_hardiness_zone);

-- Create index for queries like "get all plants for zone 9b"
CREATE INDEX idx_plant_timelines_zone
ON plant_timelines(au_hardiness_zone);

-- Enable RLS if needed (optional, adjust based on security requirements)
-- ALTER TABLE plant_timelines ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_plant_timelines_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS plant_timelines_updated_at ON plant_timelines;
CREATE TRIGGER plant_timelines_updated_at
BEFORE UPDATE ON plant_timelines
FOR EACH ROW
EXECUTE FUNCTION update_plant_timelines_updated_at();
