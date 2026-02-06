-- Add location and zone columns if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS zone TEXT; 