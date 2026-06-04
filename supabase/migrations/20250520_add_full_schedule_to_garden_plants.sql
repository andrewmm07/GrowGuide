-- Add full_schedule column to store zone-aware plant timelines
alter table garden_plants add column if not exists full_schedule jsonb;

-- Create index for faster queries
create index if not exists garden_plants_full_schedule_idx on garden_plants using gin(full_schedule);
