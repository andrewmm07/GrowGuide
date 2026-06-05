-- =============================================================================
-- GrowGuide — ONE-TIME Supabase setup (minimal beta)
-- Run in: Supabase Dashboard → SQL Editor → New query → paste ALL → Run
-- Safe to re-run (uses IF NOT EXISTS / DROP POLICY IF EXISTS where possible)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PROFILES (login + location + notification prefs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  state TEXT,
  city TEXT,
  location JSONB,
  notifications_enabled BOOLEAN DEFAULT false,
  planting_tips_enabled BOOLEAN DEFAULT true,
  weekend_tasks_enabled BOOLEAN DEFAULT true,
  weather_alerts_enabled BOOLEAN DEFAULT true,
  notifications_timezone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS planting_tips_enabled BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weekend_tasks_enabled BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weather_alerts_enabled BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notifications_timezone VARCHAR(50);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users access own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 2. GARDEN PLANTS (My Garden) — columns match the app (GardenContext)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS garden_plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_planted TIMESTAMPTZ NOT NULL,
  type TEXT,
  location TEXT,
  notes TEXT,
  estimated_harvest TIMESTAMPTZ,
  full_schedule JSONB,
  harvested_date TIMESTAMPTZ,
  au_hardiness_zone TEXT,
  completed_activities UUID[] DEFAULT '{}',
  last_activity_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE garden_plants ADD COLUMN IF NOT EXISTS full_schedule JSONB;
ALTER TABLE garden_plants ADD COLUMN IF NOT EXISTS harvested_date TIMESTAMPTZ;
ALTER TABLE garden_plants ADD COLUMN IF NOT EXISTS au_hardiness_zone TEXT;
ALTER TABLE garden_plants ADD COLUMN IF NOT EXISTS completed_activities UUID[] DEFAULT '{}';
ALTER TABLE garden_plants ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMPTZ;

ALTER TABLE garden_plants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own garden plants" ON garden_plants;
CREATE POLICY "Users can manage their own garden plants"
  ON garden_plants FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS garden_plants_user_id_idx ON garden_plants(user_id);

-- -----------------------------------------------------------------------------
-- 3. PLANT REFERENCE DATA (timelines + activities)
-- -----------------------------------------------------------------------------
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plant_name, au_hardiness_zone)
);

CREATE INDEX IF NOT EXISTS idx_plant_timelines_plant_zone
  ON plant_timelines(plant_name, au_hardiness_zone);

CREATE TABLE IF NOT EXISTS plant_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_name TEXT NOT NULL,
  au_hardiness_zone TEXT NOT NULL,
  timing_days INTEGER NOT NULL,
  activity_name TEXT NOT NULL,
  details TEXT NOT NULL,
  activity_category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_plant_timelines
    FOREIGN KEY (plant_name, au_hardiness_zone)
    REFERENCES plant_timelines(plant_name, au_hardiness_zone)
    ON DELETE CASCADE
);

ALTER TABLE plant_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON plant_activities;
CREATE POLICY "Allow public read access"
  ON plant_activities FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- 4. TASKS & PROJECTS (optional UI — cheap to add)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#10b981',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own projects" ON user_projects;
CREATE POLICY "Users can manage their own projects"
  ON user_projects FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  plant_id TEXT,
  project_id TEXT,
  category TEXT,
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_tasks ADD COLUMN IF NOT EXISTS project_id TEXT;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own tasks" ON user_tasks;
CREATE POLICY "Users can manage their own tasks"
  ON user_tasks FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 5. NOTIFICATIONS (in-app inbox + push tokens)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  dedupe_key TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  push_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS push_sent_at TIMESTAMPTZ;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS push_device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform VARCHAR(20) NOT NULL DEFAULT 'android',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, token)
);

ALTER TABLE push_device_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own push tokens" ON push_device_tokens;
CREATE POLICY "Users manage own push tokens"
  ON push_device_tokens FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- DONE — verify
-- -----------------------------------------------------------------------------
SELECT 'Setup complete' AS status;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles', 'garden_plants', 'plant_timelines', 'plant_activities',
    'user_tasks', 'user_projects', 'notifications', 'push_device_tokens'
  )
ORDER BY table_name;
