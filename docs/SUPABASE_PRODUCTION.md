# Supabase production checklist

Complete this before pointing external users at a production Supabase project.

---

## 1. Database

- [ ] All migrations in `supabase/migrations/` applied in filename order ([supabase/README.md](../supabase/README.md))
- [ ] Plant timeline seed data loaded if required (`supabase/seeds/`)
- [ ] RLS enabled on user tables: `profiles`, `garden_plants`, `user_tasks`, `user_projects`, `notifications`, `push_device_tokens`
- [ ] Confirm `plant_timelines` public read is intentional (reference data only)

---

## 2. Authentication

### URL configuration

Dashboard → **Authentication → URL Configuration**

| Setting | Example |
|---------|---------|
| Site URL | `https://your-production-domain.com` |
| Redirect URLs | `https://your-production-domain.com/**`, `http://localhost:3000/**` |

For Capacitor Android, add your custom URL scheme or deep link if configured.

### Email

- [ ] Email provider configured (Supabase default or custom SMTP)
- [ ] **Confirm email** enabled if you require verified accounts
- [ ] Email templates customized (sender name, support contact)
- [ ] Test signup flow end-to-end in production

### Security

- [ ] Strong password policy acceptable for your audience
- [ ] Rate limiting reviewed (Auth settings)
- [ ] Service role key stored only in server secrets — never in client or git

---

## 3. Edge functions

Deploy and configure secrets in Supabase Dashboard → **Edge Functions → Secrets**:

| Secret | Used by |
|--------|---------|
| `WEATHER_API_KEY` | `weather`, `notification-digest` |
| `CRON_SECRET` | `notification-digest` (cron auth) |
| `FIREBASE_PROJECT_ID` | `send-push`, `notification-digest` |
| `FIREBASE_CLIENT_EMAIL` | `send-push`, `notification-digest` |
| `FIREBASE_PRIVATE_KEY` | `send-push`, `notification-digest` |

Functions:

```bash
# Deploy digest (includes bundle build)
npm run deploy:notification-digest

# Deploy others as needed
npx supabase functions deploy weather
npx supabase functions deploy send-push
```

- [ ] Cron schedules for `notification-digest` (three schedules — see [PUSH_NOTIFICATIONS.md](PUSH_NOTIFICATIONS.md))
- [ ] Cron `Authorization: Bearer <CRON_SECRET>` header set on each schedule

---

## 4. Client environment (hosting / build)

Set at build time on Vercel/Netlify/etc.:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_WEATHER_API_KEY=...
NEXT_PUBLIC_SENTRY_DSN=...   # optional
```

- [ ] Rebuild after changing any `NEXT_PUBLIC_*` variable

---

## 5. Verification queries (SQL editor)

Run as authenticated test user via client, or verify RLS with two test accounts:

```sql
-- Should return only current user's rows
SELECT count(*) FROM garden_plants;
SELECT count(*) FROM notifications;
```

- [ ] User A cannot read User B's `garden_plants` (test with two sessions)
- [ ] Anonymous users cannot insert into user-owned tables

---

## 6. Backups & ops

- [ ] Supabase project on appropriate plan for expected users
- [ ] Point-in-time recovery / backups understood (Supabase dashboard)
- [ ] Know how to rotate anon key or service role if leaked

---

## 7. Legal & compliance

- [ ] Privacy policy published and linked ([PRIVACY_POLICY.md](PRIVACY_POLICY.md))
- [ ] Terms of service published if required ([TERMS_OF_SERVICE.md](TERMS_OF_SERVICE.md))
- [ ] Data retention approach documented (account deletion process)

---

## Post-setup smoke test

1. Production URL → sign up → verify email → set location
2. Add plant → confirm in Supabase Table Editor under `garden_plants`
3. Sign out → sign in → data still present

**Completed by:** _______________ **Date:** _______________
