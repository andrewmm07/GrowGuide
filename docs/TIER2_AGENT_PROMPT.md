# Tier 2 agent prompt (copy everything below the line)

---

You are implementing **GrowGuide Tier 2** — improvements for the first 50–500 users. **Tier 1 is done** (README, CI, tests, privacy/terms, optional Sentry client, Supabase DB with ~818 `plant_timelines` rows). Do not redo Tier 1 unless you find a regression.

## Product context

- **Repo:** `c:\GrowGuide` (Windows) — Next.js **static export** (`output: 'export'`) → build output is **`out/`**, not `.next/`
- **Primary ship target:** **Android via Capacitor** (`npm run build:mobile`, `webDir: 'out'`, `appId: au.org.pivot.growguide`)
- **Backend:** Supabase (auth, profiles, garden_plants, plant_timelines, etc.)
- **Fresh DB path used in prod:** `supabase/setup-minimal-beta.sql` (not the full migrations folder chain)
- **Legal:** FrankHouse Ltd (registration pending), support **`andrew@pivot.org.au`** — see `lib/legal/constants.ts`, `docs/PRIVACY_POLICY.md`, `docs/TERMS_OF_SERVICE.md`

## Non-negotiable rules

1. Read and obey **`ARCHITECTURE_CANON.md`** for every change. One canonical source per domain; no new parallel write paths or domain `localStorage`.
2. **Minimize scope** — smallest correct diff; no drive-by refactors; avoid new npm packages unless justified.
3. Match existing patterns (imports, naming, Supabase client usage in `app/context/`).
4. Run before finishing: `npm test`, `npm run lint`, `npm run build` (CI uses placeholder env vars — see `.github/workflows/ci.yml`).
5. **Do not commit** unless the user asks. **Do not force-push.**

## Tier 2 work items (priority order)

Implement in this order unless the user reprioritizes. Mark each item done in your final summary with what you changed.

### 1. Consistent auth UX (`RequireAuth`)

**Problem:** Protected routes inconsistently check auth; no shared redirect-with-return-URL pattern.

**Goal:**

- Add `app/components/RequireAuth.tsx` (or equivalent) that:
  - Uses `useAuth()` from `app/context/AuthContext.tsx`
  - While `loading`, show a minimal loading state (match existing app style)
  - If no `user`, redirect to `/auth/login` (or `/` if that’s the login entry) with **`?next=`** (or similar) preserving the current path
  - After login, return user to `next` when safe (same-origin path only)
- Wrap protected app sections in `app/layout.tsx` or route layouts — coordinate with existing **`RequireProfileName`** (`app/components/RequireProfileName.tsx`, `app/setup-name/`) so order is: auth → profile name → content
- Do **not** duplicate signup/login logic; reuse `AuthContext`

**Acceptance:** Logged-out user hitting `/dashboard` or `/my-garden` lands on login and returns after sign-in. `npm test` + `npm run lint` pass.

---

### 2. Route weather through Supabase Edge (remove API key from APK)

**Problem:** `lib/weatherService.ts` embeds `NEXT_PUBLIC_WEATHER_API_KEY` in the static bundle (visible in APK). Comment says `/api/weather` is a stub under static export.

**Existing asset:** `supabase/functions/weather/index.ts` (expects `WEATHER_API_KEY` secret, `city` + `state` query params).

**Goal:**

- Client fetches weather via Supabase Edge Function URL + **anon key** in `Authorization` header (standard pattern), not direct WeatherAPI from the browser
- Keep **one** fetch/cache module in `lib/weatherService.ts`; update `ARCHITECTURE_CANON.md` §2.6 when done
- `.env.example`: document client needs `NEXT_PUBLIC_SUPABASE_URL` + anon key; **remove or deprecate** `NEXT_PUBLIC_WEATHER_API_KEY` for production mobile builds
- `DEPLOYMENT.md` + `docs/SUPABASE_PRODUCTION.md`: note deploying `weather` function and setting `WEATHER_API_KEY` secret
- Handle static export: no reliance on Next `/api/weather` route for production

**Acceptance:** Grep shows no production path requiring `NEXT_PUBLIC_WEATHER_API_KEY` for forecast fetch (dev-only fallback OK if documented). Weekly brief / dashboard weather still works with location from `useAuth().userLocation`.

---

### 3. Plant detail pages (`app/plants/[id]`)

**Problem:** `generateStaticParams()` in `app/plants/[id]/page.tsx` only returns `{ id: 'tomatoes' }`.

**Goal (pick smallest viable approach):**

- **Option A:** Expand static params from canonical plant list (e.g. `data/plants-definitions.json` names slugified) — watch static export build time
- **Option B:** Client-only dynamic route pattern compatible with `output: 'export'` (e.g. single `plants/[id]` page that reads `id` from URL on client via `PageClient.tsx` — already exists)

Prefer Option B if it avoids exploding `out/` size. Plant data at runtime should come from **`lib/plantTimelineService.ts`** / Supabase where applicable, not duplicate `PLANT_DATABASE` constants.

**Acceptance:** User can open multiple plants from plant picker / garden links without 404 on mobile build.

---

### 4. Consolidate planting calendar sources

**Problem:** Multiple matrices per `ARCHITECTURE_CANON.md` §2.4 (transitional tech debt).

**Canonical targets today:**

- Climate/month recommendations: `lib/plantingRecommendations.ts`, `lib/planting/plantingByClimate.ts`
- UI data: `app/data/planting-calendar/`
- Do **not** add a fourth source

**Goal:**

- Audit call sites; document a short **migration map** in `ARCHITECTURE_CANON.md` or `docs/PLANTING_CALENDAR.md`
- Extract or merge duplicated logic into **one module per concern** (no big-bang rewrite)
- Deprecate shims: `app/data/state-month-summaries.ts`, `app/utils/plantingGuide.ts` where safe

**Acceptance:** No new duplicate matrices; clear comment in canon pointing to single entry module for “what to plant this month”.

---

### 5. Quarantine legacy folders

**Problem:** `src/`, `garden-app/`, `garden-planner/`, root duplicate `components/`, many stale audit `.md` files confuse agents and humans.

**Goal:**

- Move non-product code under `archive/` (or delete if truly unused and not referenced)
- Ensure `tsconfig.json` / ESLint still exclude legacy paths
- Add `archive/README.md` explaining what was moved and why
- Do **not** break `npm run build` or imports from `app/`

**Acceptance:** No imports from `src/` in active app code; build passes.

---

### 6. Refresh stale docs

**Goal:**

- Add `docs/ARCHIVE_INDEX.md` listing obsolete root docs (`IMPLEMENTATION_ROADMAP.md`, `STATUS_REPORT.md`, `ACTUAL_STATUS.md`, etc.) as **historical** or move them to `archive/docs/`
- Update `README.md` “Architecture” section to point to `ARCHITECTURE_CANON.md`, `docs/SUPABASE_SETUP_SIMPLE.md`, `docs/QA_CHECKLIST.md`
- Keep `docs/SUPABASE_PRODUCTION.md` accurate for dashboard steps (auth URLs, confirm-email OFF for beta, ~200 vs ~818 seed counts)

---

### 7. Rate limiting / abuse (mostly configuration)

**Goal:**

- Extend `docs/SUPABASE_PRODUCTION.md` with concrete dashboard steps: auth rate limits, signup caps, WeatherAPI quota monitoring
- If code change needed: optional client-side backoff when weather edge returns 429 — minimal

**Acceptance:** Doc gives operator a checklist; no secrets in repo.

---

### 8. Feedback channel

**Goal:**

- Settings (or help): **“Report wrong advice”** → `mailto:andrew@pivot.org.au` with subject template including app version, location zone, optional plant name (from `useAuth` / garden context)
- Use `LEGAL.supportEmail` from `lib/legal/constants.ts`

**Acceptance:** One tap opens mail client with prefilled subject/body on Android where supported; graceful fallback (copy email) on web.

---

## Known WIP on `main` (may be uncommitted)

Check `git status` before assuming merged:

- `RequireProfileName`, `app/setup-name/`, `lib/profileName.ts`, `lib/profileService.ts`
- `supabase/setup-minimal-beta.sql`, `docs/SUPABASE_SETUP_SIMPLE.md`

Integrate with Tier 2 item 1 instead of conflicting duplicate flows.

## Key files reference

| Area | Paths |
|------|--------|
| Auth | `app/context/AuthContext.tsx`, `app/auth/login/page.tsx`, `app/auth/signup/page.tsx` |
| Garden | `app/context/GardenContext.tsx` |
| Weather | `lib/weatherService.ts`, `supabase/functions/weather/index.ts` |
| Plants | `lib/plantTimelineService.ts`, `app/plants/[id]/` |
| Calendar | `app/planting-calendar/`, `lib/plantingRecommendations.ts`, `app/data/planting-calendar/` |
| CI | `.github/workflows/ci.yml` |
| Tests | `npm test` (9 files in `package.json`) |

## Out of scope for Tier 2 (unless user explicitly asks)

- Play Store listing, analytics, PWA
- Full push notification production (see `docs/PUSH_NOTIFICATIONS.md`)
- Rewriting all 818 plant rows or re-running migrations
- Tier 1 legal/CI work

## Deliverables

When done (or per item if large), provide:

1. **Summary table** — each Tier 2 item: Done / Partial / Skipped + reason  
2. **Files changed** — brief bullet list  
3. **Operator steps** — anything requiring Supabase dashboard or `npx supabase functions deploy`  
4. **Test evidence** — output of `npm test`, `npm run lint`, `npm run build` (and `npm run build:mobile` if auth/weather/routing touched)

Start by reading `ARCHITECTURE_CANON.md` and running `git status`. Ask the user only if a Tier 2 item requires a product decision (e.g. confirm-email ON vs OFF, static vs client plant pages).
