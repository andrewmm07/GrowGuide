# Deployment Guide for GrowGuide

GrowGuide production builds are **static exports** (`output: 'export'`). The build output is the **`out/`** directory — not `.next/`. There is no Node.js server at runtime; the app talks to Supabase (and the `weather` Edge Function for forecasts).

## Prerequisites

- Node.js 18+
- Supabase project with migrations applied ([supabase/README.md](supabase/README.md))
- WeatherAPI.com API key (Supabase secret `WEATHER_API_KEY`, not in the client bundle)
- GitHub repository (recommended for CI/CD)

---

## Environment variables

Copy [.env.example](../.env.example) to `.env.local` for local builds. For hosting, set the same variables in your platform's dashboard.

**Required for web/mobile client builds:**

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `NEXT_PUBLIC_WEATHER_API_KEY` | Optional — **local dev only**; production uses Edge Function |

**Optional:**

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_SENTRY_DSN` | Client error reporting ([Sentry](https://sentry.io)) |

**Server-only (Supabase Edge Function secrets, local scripts — never in client build):**

`SUPABASE_SERVICE_ROLE_KEY`, `WEATHER_API_KEY`, `CRON_SECRET`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

---

## Verify build locally

```bash
npm install
npm test
npm run lint
npm run build
```

Success produces an **`out/`** folder. Serve it locally to smoke-test:

```bash
npx serve out
```

---

## Option 1: Vercel (recommended for web)

1. Push the repo to GitHub.
2. Import the project at [vercel.com](https://vercel.com).
3. **Environment variables:** add all `NEXT_PUBLIC_*` vars from `.env.example`.
4. **Build command:** `npm run build` (default)
5. **Output directory:** `out` (important — not `.next`)
6. Deploy.

### Supabase Auth for production

In Supabase Dashboard → **Authentication → URL Configuration**:

| Setting | Value |
|---------|-------|
| Site URL | `https://your-app.vercel.app` |
| Redirect URLs | `https://your-app.vercel.app/**`, `http://localhost:3000/**` |

Enable email confirmation if you require verified accounts. Customize email templates under Authentication → Email Templates.

See [docs/SUPABASE_PRODUCTION.md](SUPABASE_PRODUCTION.md) for the full checklist.

---

## Option 2: Netlify

1. Connect your GitHub repo at [netlify.com](https://netlify.com).
2. **Build command:** `npm run build`
3. **Publish directory:** `out` (not `.next`)
4. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_WEATHER_API_KEY`).
5. Configure Supabase redirect URLs with your Netlify domain.

---

## Option 3: Any static host (Cloudflare Pages, S3 + CloudFront, etc.)

```bash
npm run build
# Upload contents of out/ to your CDN
```

Ensure HTTPS and set Supabase Auth redirect URLs to match your domain.

---

## Option 4: Android (Capacitor)

```bash
npm run build:mobile    # EXPORT_STATIC=true → out/
npm run mobile:sync     # cap sync android
npm run mobile:android  # open Android Studio
```

### Android release checklist

- [ ] `android/app/google-services.json` (Firebase) for push notifications
- [ ] Supabase edge function `notification-digest` deployed with cron schedules ([PUSH_NOTIFICATIONS.md](PUSH_NOTIFICATIONS.md))
- [ ] App signing key configured in Android Studio
- [ ] Privacy policy URL linked in Play Console ([PRIVACY_POLICY.md](PRIVACY_POLICY.md))
- [ ] Internal testing track before public release

App ID: `au.org.pivot.growguide`

---

## Post-deployment checklist

- [ ] Environment variables set on host (and in Supabase secrets for edge functions)
- [ ] Supabase Site URL and Redirect URLs include production domain
- [ ] Sign up, email verification, login, and logout work
- [ ] Location selection persists and updates guidance
- [ ] Weather loads for a non-default city
- [ ] Run [docs/QA_CHECKLIST.md](QA_CHECKLIST.md) for at least one city in your target region
- [ ] Optional: Sentry DSN configured and test error appears in dashboard

---

## Troubleshooting

### Build fails

- Run `npm run build` locally first; fix TypeScript errors.
- Ensure `npm run build:month-overviews` succeeds (runs automatically via `prebuild`).
- Check CI logs on GitHub Actions.

### Blank page or missing env

- Missing `NEXT_PUBLIC_SUPABASE_*` causes the app to throw on load. Check host env vars and rebuild.

### Authentication not working

- Supabase redirect URLs must include your exact production origin.
- Email links must use HTTPS in production.
- Check browser console for CORS or redirect errors.

### Weather not loading

- Deploy Edge Function: `npx supabase functions deploy weather`
- Set secret `WEATHER_API_KEY` in Supabase Dashboard → Edge Functions → Secrets
- Client needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` at build time
- Local dev only: optional `NEXT_PUBLIC_WEATHER_API_KEY` in `.env.local` (direct API, not for production APK)

### Netlify/Vercel serves 404 on routes

- Static export uses trailing slashes (`trailingSlash: true`). Ensure your host respects `out/` structure or configure SPA fallback if needed.

---

## CI/CD

Every push to `main` runs lint, tests, and build via GitHub Actions (`.github/workflows/ci.yml`). Fix failing checks before deploying.

---

## Need help?

- [Next.js static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Supabase docs](https://supabase.com/docs)
- [Capacitor Android](https://capacitorjs.com/docs/android)
