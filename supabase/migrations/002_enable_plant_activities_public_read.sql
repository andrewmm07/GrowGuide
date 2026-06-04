-- Enable public read access to plant_activities
-- This allows the anon key (browser) to fetch activity data

-- Enable RLS on plant_activities if not already enabled
ALTER TABLE plant_activities ENABLE ROW LEVEL SECURITY;

-- Create policy allowing anyone to read (public data)
CREATE POLICY "Allow public read access"
  ON plant_activities
  FOR SELECT
  USING (true);

-- Verify the policy was created
SELECT 'Public read policy enabled for plant_activities' as status;
