# Activity Calendar (archived)

Month-grid calendar with activity dots and a weekly sidebar. Archived because it duplicated:

- `/weekly-brief` — weekly plant care tasks (canonical)
- `/planting-calendar` — monthly planting guidance
- `/tasks` — user task management

The route `/calendar/activity-month/` now redirects to `/weekly-brief/`.

Restore by moving `page.tsx` back to `app/calendar/activity-month/` and removing the redirect stub.
