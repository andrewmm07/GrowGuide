-- Task projects (grouping for user_tasks.project_id)
create table if not exists user_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  color text not null default '#10b981',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_projects enable row level security;

create policy "Users can manage their own projects"
  on user_projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index user_projects_user_id_idx on user_projects(user_id);
