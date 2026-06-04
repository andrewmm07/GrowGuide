-- Optional: document project_id as uuid when it references user_projects.id
-- Safe no-op if column already exists with a different type (text uuid strings still work in app).

comment on column user_tasks.project_id is
  'Optional user_projects.id (uuid as text). Set via useTasks / tasks UI.';

create index if not exists user_tasks_project_id_idx
  on user_tasks (user_id, project_id)
  where project_id is not null;
