-- Migration: Add notes column to garden_plants table
-- This column stores variety, location, and other gardening observations

-- Add notes column if it doesn't exist
ALTER TABLE garden_plants
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing records to have empty string instead of null (optional)
UPDATE garden_plants SET notes = '' WHERE notes IS NULL;

-- Add index for potential future queries
CREATE INDEX IF NOT EXISTS idx_garden_plants_notes ON garden_plants(notes);

-- Verify the migration
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'garden_plants' AND column_name = 'notes';
