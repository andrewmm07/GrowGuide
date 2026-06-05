# Distribution readiness audit — agent prompt

Copy everything below the line into a **new agent chat** (read-only / explore mode first, then run commands).

---

## Your mission

Perform a **fresh, evidence-based distribution readiness audit** of the **GrowGuide** repo. Do **not** trust stale markdown in `archive/docs/` or root-level audit files from past sessions — **verify in code and by running commands**.

The operator cares about **Android-first distribution** (Capacitor APK), with web as secondary. The product’s core value is **climate-correct planting advice** for Australian locations — domain correctness matters as much as plumbing.

**Legal entity:** FrankHouse Ltd (registration pending). Interim contact: **andrew@pivot.org.au** (`lib/legal/constants.ts`).

---

## Phase 1 — Understand the system (read-only)

1. Read **`ARCHITECTURE_CANON.md`** end-to-end — this is the rule book.
2. Read **`README.md`**, **`DEPLOYMENT.md`**, **`docs/QA_CHECKLIST.md`**, **`docs/SUPABASE_PRODUCTION.md`**, **`docs/SUPABASE_SETUP_SIMPLE.md`**.
3. Map the runtime stack:
   - Next.js static export → **`out/`** (not `.next/` at runtime)
   - Supabase: auth, Postgres, RLS, edge functions
   - Capacitor Android: `capacitor.config.ts`, `npm run build:mobile`
4. Trace canonical domains (verify, don’t assume):
   - **Location:** `AuthContext` + `profiles.location`
   - **Garden:** `GardenContext` + `garden_plants`
   - **Plant timelines:** `lib/plantTimelineService.ts` + `plant_timelines`
   - **Planting calendar / weekly brief:** `lib/plantingRecommendations.ts`, `app/data/planting-calendar/`, routes under `app/planting-calendar/`, `app/weekly-brief/`
   - **Weather:** `lib/weatherService.ts`, `supabase/functions/weather/`
   - **Auth:** `app/context/AuthContext.tsx`, protected routes, `RequireAuth` / `RequireProfileName` if present
5. Identify **duplicate or legacy** paths (`src/`, `garden-app/`, `archive/`, deprecated shims listed in canon).
6. Check **secrets exposure:** grep for `NEXT_PUBLIC_`, WeatherAPI keys, service role keys, hardcoded credentials.
7. Review **Supabase** folder: `setup-minimal-beta.sql` vs `migrations/` — which path is documented for fresh projects?

---

## Phase 2 — Run verification commands

Run and capture results (fix nothing unless asked):

```powershell
cd c:\GrowGuide
git status -sb
npm test
npm run lint
npm run build
npm run build:mobile
npm run validate:preview
```

Note failures, warnings, and env vars required. CI is in `.github/workflows/ci.yml`.

Optional deep checks if time allows:

```powershell
npm run audit:plant-picker:summary
```

---

## Phase 3 — Assess distribution tiers

For **each item**, report: **Done | Partial | Not started | Unknown**, with **evidence** (file path or command output). Estimate **effort**: Low / Medium / High.

### Tier 1 — Blockers (before any external users)

| Area | What to verify |
|------|----------------|
| Onboarding | `README.md`, `.env.example` complete and accurate |
| Deployment docs | `DEPLOYMENT.md`: `out/`, env vars, Supabase redirect URLs, mobile build |
| CI | Lint + all tests + build on push |
| Tests | Single `npm test` runs all meaningful unit tests |
| Supabase prod | Schema/RLS, seed data path, auth URLs, email confirm policy, rate limits — operator checklist |
| Manual QA | `docs/QA_CHECKLIST.md` exists; note what still requires human device testing |
| Legal | Privacy + terms in `docs/` and in-app routes; Settings links; contact email consistent |
| Error reporting | Sentry optional client; edge coverage; DSN documented |

### Tier 2 — Important (first 50–500 users)

| Area | What to verify |
|------|----------------|
| Auth UX | Shared `RequireAuth`, return URL, consistent with profile-name flow |
| Weather security | API key not in APK; edge function wired and deployed |
| Calendar consolidation | Single canonical matrix per `ARCHITECTURE_CANON` §2.4; no silent duplicates |
| Legacy quarantine | `src/`, `garden-app/`, etc. archived or removed |
| Docs hygiene | `docs/ARCHIVE_INDEX.md`, no conflicting setup instructions |
| Plant detail pages | `app/plants/[id]` works for more than tomatoes on static export |
| Abuse / rate limits | Supabase auth limits, WeatherAPI quota strategy |
| Feedback | In-app path to report wrong advice |

### Tier 3 — Scale & store (later)

| Area | What to verify |
|------|----------------|
| Play Store | Signing, listing assets, data safety form alignment with privacy policy |
| Push notifications prod | `docs/PUSH_NOTIFICATIONS.md`, edge functions, cron, Firebase |
| Analytics / crash reporting prod | Sentry DSN in release builds |
| PWA / web hosting | If applicable |
| Account deletion / data export | GDPR-style expectations vs implemented flows |

---

## Phase 4 — Domain correctness (product-specific)

This is not generic app audit — evaluate **advice quality plumbing**:

1. **Location → zone → recommendations:** Does user location flow correctly into planting calendar, weekly brief, and plant picker labels?
2. **Plant picker matrix:** How is “plant now / wait / frost” derived? Any known drift between UI, `plant_timelines`, and calendar CSVs?
3. **Sample cities:** Mentally or via scripts test **Hobart, Sydney, Brisbane** (cool / temperate / warm) — flag inconsistencies.
4. **Schedule generation:** When user adds a plant, does `full_schedule` populate from Supabase timelines?
5. **Weather integration:** Does forecast affect copy (weekly brief, watering hints)? Broken if weather fails?

List **top 5 domain risks** separate from infrastructure risks.

---

## Phase 5 — Security & compliance snapshot

- RLS on user tables (`profiles`, `garden_plants`, `user_tasks`, `notifications`, `push_device_tokens`, …)
- `plant_timelines` public read intentional?
- Service role key never in client
- Auth: email confirmation policy vs mobile UX
- Third parties named in privacy policy vs actual code (Supabase, WeatherAPI, Sentry, Firebase push)

---

## Required output format

Produce a report with these sections:

### 1. Executive summary (5–8 sentences)

Can this ship to a **private Android beta** today? What is the single biggest blocker?

### 2. Tier tables

Three markdown tables (Tier 1 / 2 / 3) with columns: **Item | Status | Evidence | Effort | Owner (Code vs Operator)**

### 3. Architecture violations

Bulleted list of **ARCHITECTURE_CANON.md** breaches found (with paths). Empty section if clean.

### 4. Domain correctness risks

Top 5 product/advice risks with severity (Critical / High / Medium).

### 5. Command results

Pass/fail for `npm test`, `lint`, `build`, `build:mobile`, `validate:preview`.

### 6. Supabase operator checklist

Numbered steps the **human** must do in dashboard (not SQL they already ran). Distinguish **done** vs **todo** if user told you their state (818 `plant_timelines`, `setup-minimal-beta.sql` applied, auth email settings).

### 7. Recommended sequence (2 weeks)

Ordered list: what to do **this week** vs **next**, max 10 items. No fluff.

### 8. Optional follow-up prompts

One-line prompts the operator can paste into **separate** agent chats for Tier 1 fixes, Tier 2 (`docs/TIER2_AGENT_PROMPT.md`), or domain QA.

---

## Rules for you (the agent)

- **Investigate yourself** — use search, read files, run commands. Don’t ask the operator to run grep for you.
- **Minimize scope** — this is an audit, not a refactor. Don’t change code unless explicitly asked.
- **Be honest** — “Partial” is fine; don’t mark Done without evidence.
- **Android-first** — weight mobile/Capacitor issues above optional web deploy.
- **Ignore** `.next/`, `node_modules/`, large CSV audit outputs in `scripts/audit-output/` unless relevant.
- Do **not** commit or push.

---

## Context from prior session (verify, don’t assume)

The operator may have already:

- Run `supabase/setup-minimal-beta.sql` (8 tables)
- Loaded ~**818** rows into `plant_timelines` (full CSV-style data, not the 200-row seed file)
- Configured Supabase auth URLs / email (may be incomplete)
- Pushed Tier 1 code to `main` (README, CI, privacy/terms, Sentry client optional)

**Re-verify everything** — repo may have moved since then (Tier 2 work, weather edge, archive moves, etc.).
