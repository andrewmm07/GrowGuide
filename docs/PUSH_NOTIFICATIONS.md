# Push notifications

Garden tips are delivered **from the server on a schedule**, not when the user opens the app.

## Send times (user's local timezone)

| When | What |
|------|------|
| **Tuesday 8:00am** | What to plant (if forecast workable) |
| **Every day 8:00am** | Weather warnings (only if tips exist) |
| **Friday 5:30pm** | Weekend garden tasks |

## Why cron is not every hour

Users are in different Australian timezones (`Australia/Sydney`, `Perth`, etc.). A single UTC time cannot hit “8:00am everywhere” at once, so the edge function checks **each user’s local clock** when cron runs.

Cron only needs to fire during **UTC windows** when 8:00 or 17:30 can occur in Australia — about **17 short runs per day**, not 24 hourly runs:

| Cron expression | Covers |
|-----------------|--------|
| `0,30 21,22,23 * * *` | ~8:00am in eastern/central AU |
| `0,30 0,1 * * *` | ~8:00am in western AU |
| `30 6,7,8,9,10 * * 5` | ~5:30pm Friday across AU |

Add **all three** schedules in Supabase Dashboard → Edge Functions → `notification-digest` → Schedules (same URL and `Authorization: Bearer <CRON_SECRET>` for each).

## Flow

1. Cron hits `notification-digest` during one of the windows above.
2. For each user with notifications enabled, compute local time.
3. If it matches a slot (Tue 8:00, daily 8:00, or Fri 17:30), compose → save inbox → FCM push.

## Setup checklist

### 1. Database

Apply `20250531_notifications.sql` and `20250601_push_device_tokens.sql`.

### 2. Firebase (Android)

`google-services.json` in `android/app/`.

### 3. Supabase secrets

`WEATHER_API_KEY`, `CRON_SECRET`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.

### 4. Deploy function

```bash
npm run deploy:notification-digest
```

### 5. Three cron schedules (required)

See table above — not `0 * * * *`.

### 6. Device registration

Settings → enable notifications → **Register this device for push**.

## Local test

```bash
# Tuesday 8am Sydney (example — adjust ISO to your test user TZ)
$env:DIGEST_TEST_NOW="2026-06-02T22:00:00.000Z"
npm run digest:notifications
```

## Troubleshooting

| Issue | Check |
|-------|--------|
| No push | All 3 crons added? `CRON_SECRET` correct? |
| Wrong time | `notifications_timezone` or state on profile |
| Friday tasks missing | Fri cron `30 6,7,8,9,10 * * 5` deployed? Local time ~17:30? |
