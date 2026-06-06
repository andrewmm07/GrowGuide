-- GrowGuide: schedule notification-digest (pg_cron + pg_net)
-- Run once in Supabase Dashboard → SQL Editor
--
-- BEFORE RUNNING:
-- 1. Edge secret CRON_SECRET must match the bearer token below (same value).
-- 2. Replace YOUR_CRON_SECRET_HERE with that value (keep the word Bearer in the header).
-- 3. Project URL is already set for soxpxdosyrvnqptmwmon — change if different.

-- Enable schedulers (safe to re-run)
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- Remove old jobs if re-running (ignore errors if none exist)
select cron.unschedule(jobid)
from cron.job
where jobname in (
  'growguide-digest-morning-east',
  'growguide-digest-morning-west',
  'growguide-digest-friday-pm'
);

-- Morning ~8:00am eastern/central Australia (UTC 21–23 at :00 and :30)
select cron.schedule(
  'growguide-digest-morning-east',
  '0,30 21,22,23 * * *',
  $$
  select net.http_post(
    url := 'https://soxpxdosyrvnqptmwmon.supabase.co/functions/v1/notification-digest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer 9v735X2-cwHg-M.'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  ) as request_id;
  $$
);

-- Morning ~8:00am western Australia (UTC 0–1 at :00 and :30)
select cron.schedule(
  'growguide-digest-morning-west',
  '0,30 0,1 * * *',
  $$
  select net.http_post(
    url := 'https://soxpxdosyrvnqptmwmon.supabase.co/functions/v1/notification-digest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer 9v735X2-cwHg-M.'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  ) as request_id;
  $$
);

-- Friday ~5:30pm across Australia (UTC Fri 06:30–10:30)
select cron.schedule(
  'growguide-digest-friday-pm',
  '30 6,7,8,9,10 * * 5',
  $$
  select net.http_post(
    url := 'https://soxpxdosyrvnqptmwmon.supabase.co/functions/v1/notification-digest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer 9v735X2-cwHg-M.'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  ) as request_id;
  $$
);

-- Verify (should show 3 rows)
select jobid, jobname, schedule, active from cron.job
where jobname like 'growguide-digest-%'
order by jobname;
