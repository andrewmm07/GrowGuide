-- Create garden_plants table for cloud-synced garden data
create table if not exists garden_plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  date_planted timestamptz not null,
  type text not null,
  activity_type text,
  location text,
  notes text,
  estimated_harvest timestamptz,
  schedule jsonb default '[]'::jsonb,
  is_harvested boolean default false,
  harvested_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table garden_plants enable row level security;

-- Policy: users can only access their own plants
create policy "Users can manage their own garden plants"
  on garden_plants for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for fast user lookups
create index garden_plants_user_id_idx on garden_plants(user_id);
