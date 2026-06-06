# Push notifications — setup steps (operator)

The app code is ready. You must complete these **external** steps once.

---

## What you get when done

| When (user local time) | Notification |
|------------------------|--------------|
| Tuesday 8:00am | Planting tip (if weather OK) |
| Daily 8:00am | Weather alert (only when relevant) |
| Friday 5:30pm | Weekend garden tasks |

---

## Step 1 — Firebase (Android)

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Add project** (or use existing).
2. **Add app** → **Android**
   - Package name: `au.org.pivot.growguide` (must match `capacitor.config.ts`)
3. Download **`google-services.json`**
4. Copy it to:

   ```
   android/app/google-services.json
   ```

5. Do **not** commit this file if your repo is public (it's in `android/.gitignore`).

---

## Step 2 — Supabase secrets

Dashboard → **Project Settings** → **Edge Functions** → **Secrets**

| Secret | Where to get it |
|--------|-----------------|
| `WEATHER_API_KEY` | weatherapi.com (you likely have this) |
| `CRON_SECRET` | Generate a long random string (e.g. `openssl rand -hex 32`) |
| `FIREBASE_PROJECT_ID` | Firebase project settings |
| `FIREBASE_CLIENT_EMAIL` | Firebase → Project settings → Service accounts → Generate key → JSON field `client_email` |
| `FIREBASE_PRIVATE_KEY` | Same JSON → `private_key` (keep `\n` newlines) |

`SUPABASE_SERVICE_ROLE_KEY` is auto-available to edge functions — do not add manually.

---

## Step 3 — Deploy edge functions

```powershell
cd c:\GrowGuide
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npm run deploy:notification-digest
```

(`send-push` deploys with digest bundle — see `package.json`.)

Verify **Edge Functions** lists `notification-digest` and `send-push`.

---

## Step 4 — Three cron schedules (required)

Many Supabase projects **do not** have an Edge Functions “Schedules” tab. Use **SQL + pg_cron** instead:

1. Dashboard → **SQL Editor** → **New query**
2. Open **`supabase/sql/notification-digest-cron.sql`** in this repo
3. Replace **`YOUR_CRON_SECRET_HERE`** (3 places) with the same value as Edge secret `CRON_SECRET`
4. **Run** the whole script

Verify:

```sql
select jobid, jobname, schedule, active from cron.job
where jobname like 'growguide-digest-%';
```

You should see **3 jobs**. All times are **UTC** (the digest converts to each user’s Australian timezone).

| Cron expression | Purpose |
|-----------------|---------|
| `0,30 21,22,23 * * *` | ~8:00am eastern/central AU |
| `0,30 0,1 * * *` | ~8:00am western AU |
| `30 6,7,8,9,10 * * 5` | ~5:30pm Friday across AU |

Do **not** use a single hourly `0 * * * *` job.

---

## Step 5 — Rebuild the Android app

In `.env.local` add (only after `google-services.json` is in place):

```
NEXT_PUBLIC_FCM_CONFIGURED=true
```

Then:

```powershell
npm run build:mobile
npm run mobile:sync
```

Build APK in Android Studio → install on device.

---

## Step 6 — Test on device

1. Sign in → **Settings** → enable **Garden notifications**
2. Allow Android notification permission when prompted
3. No error under the toggle (if you see “needs google-services.json”, Step 1 or 5 failed)

**Local digest test** (creates inbox rows; push needs device token):

```powershell
$env:DIGEST_TEST_NOW="2026-06-03T22:00:00.000Z"   # Tuesday 8am Sydney example
npm run digest:notifications
```

Check **notifications** table in Supabase and in-app **Notifications** inbox.

---

## Readiness check (repo)

```powershell
npm run check:notifications
```

Reports what's missing before you deploy.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Toggle saves but “needs google-services.json” | Step 1 + 5 |
| No push, inbox works | Cron schedules or `CRON_SECRET` wrong |
| Wrong send time | Profile `notifications_timezone` or state; see `docs/PUSH_NOTIFICATIONS.md` |
| App crashes on open after enabling push | Rebuild without FCM until `google-services.json` exists |
