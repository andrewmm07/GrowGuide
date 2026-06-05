# GrowGuide

Australian climate-aware gardening assistant: weekly planting guidance, garden tracking, and optional push notifications. Built as a **static Next.js app** backed by **Supabase**, with an optional **Android** build via Capacitor.

## Quick start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with migrations applied (see [supabase/README.md](supabase/README.md))
- Supabase Edge Function `weather` deployed with `WEATHER_API_KEY` secret (or dev-only key below)

### Setup

```bash
git clone <repo-url>
cd GrowGuide
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
# Edit .env.local with your Supabase keys (see .env.example)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development server |
| `npm run dev:phone` | Dev server on `0.0.0.0` (test from phone on same network) |
| `npm run build` | Production static export → `out/` |
| `npm run build:mobile` | Static export for Capacitor Android |
| `npm test` | Run all unit tests |
| `npm run lint` | ESLint (Next.js) |
| `npm run validate:preview` | Validate planting preview output |
| `npm run audit:plant-picker:summary` | Audit plant picker matrix |

## Architecture

Authoritative rules: **[ARCHITECTURE_CANON.md](ARCHITECTURE_CANON.md)**

| Topic | Document |
|-------|----------|
| Fresh Supabase setup | [docs/SUPABASE_SETUP_SIMPLE.md](docs/SUPABASE_SETUP_SIMPLE.md) |
| Pre-release QA | [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md) |
| Planting calendar sources | [docs/PLANTING_CALENDAR.md](docs/PLANTING_CALENDAR.md) |

- **Frontend:** Next.js 14 App Router, React Context, Tailwind
- **Backend:** Supabase (Auth, Postgres, Edge Functions)
- **Mobile:** Capacitor 8 → `out/` bundled in Android WebView
- **Domain logic:** `lib/` — planting, microclimate, weather, notifications

```
app/          Pages, components, hooks, React context
lib/          Core domain logic (planting, weather, schedules)
supabase/     Migrations, edge functions, seeds
android/      Capacitor Android project
scripts/      Data pipelines, audits, digest runner
```

## Environment variables

Copy [.env.example](.env.example) to `.env.local`. Required for local dev:

| Variable | Scope | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Yes |
| `NEXT_PUBLIC_WEATHER_API_KEY` | Client | No — dev only; production uses Edge `weather` + `WEATHER_API_KEY` secret |
| `NEXT_PUBLIC_SENTRY_DSN` | Client | No (error reporting) |
| `SUPABASE_SERVICE_ROLE_KEY` | Scripts only | For seeding / admin scripts |
| `WEATHER_API_KEY` | Edge / scripts | Server-side weather proxy & digest |

Never commit `.env.local` or service role keys.

## Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for web (Vercel/Netlify) and Android release steps.

Production builds use **static export** (`out/`). There is no Node server in production.

### Supabase production checklist

Before sharing with external users, complete **[docs/SUPABASE_PRODUCTION.md](docs/SUPABASE_PRODUCTION.md)**.

## Testing & QA

- **Automated:** `npm test` (unit tests in `lib/**/*.test.ts`), CI on every push
- **Manual beta QA:** **[docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md)**

## Push notifications (Android)

See **[docs/PUSH_NOTIFICATIONS.md](docs/PUSH_NOTIFICATIONS.md)** for Firebase, cron schedules, and edge function deployment.

## Legal

- [Privacy Policy](docs/PRIVACY_POLICY.md)
- [Terms of Service](docs/TERMS_OF_SERVICE.md)

Link these from your app settings or store listing before public distribution.

## Documentation index

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE_CANON.md](ARCHITECTURE_CANON.md) | Canonical architecture rules |
| [docs/SUPABASE_SETUP_SIMPLE.md](docs/SUPABASE_SETUP_SIMPLE.md) | Minimal beta DB setup |
| [docs/QA_CHECKLIST.md](docs/QA_CHECKLIST.md) | Pre-release manual testing |
| [docs/SUPABASE_PRODUCTION.md](docs/SUPABASE_PRODUCTION.md) | Auth, RLS, edge functions, rate limits |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Hosting & release |
| [docs/ARCHIVE_INDEX.md](docs/ARCHIVE_INDEX.md) | Historical / obsolete root docs |

## License

Private — all rights reserved unless otherwise specified.
