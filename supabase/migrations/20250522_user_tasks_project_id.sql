-- Optional project grouping for user tasks (project metadata may remain client-side until projects table exists)
alter table user_tasks add column if not exists project_id text;
