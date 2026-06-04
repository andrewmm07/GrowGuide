-- User tasks table
create table if not exists user_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  due_date timestamptz,
  completed boolean default false,
  completed_at timestamptz,
  plant_id text, -- reference to plant name/id
  category text,
  priority text default 'normal',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_tasks enable row level security;

create policy "Users can manage their own tasks"
  on user_tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index user_tasks_user_id_idx on user_tasks(user_id);
create index user_tasks_due_date_idx on user_tasks(user_id, due_date);
