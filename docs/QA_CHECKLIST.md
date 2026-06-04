# Manual QA checklist

Use this checklist before each beta release or when onboarding external testers. Test on **real devices** where possible (especially Android push and geolocation).

**Tester:** _______________  
**Build / commit:** _______________  
**Date:** _______________

---

## 1. Authentication

| # | Step | Pass | Notes |
|---|------|------|-------|
| 1.1 | Sign up with new email | ☐ | |
| 1.2 | Receive verification email (if enabled) | ☐ | |
| 1.3 | Verify email and sign in | ☐ | |
| 1.4 | Sign out; confirm session cleared | ☐ | |
| 1.5 | Sign in again with same credentials | ☐ | |
| 1.6 | Wrong password shows clear error (no crash) | ☐ | |

---

## 2. Location onboarding

| # | Step | Pass | Notes |
|---|------|------|-------|
| 2.1 | New user prompted to set location | ☐ | |
| 2.2 | Search/select city saves and persists after reload | ☐ | |
| 2.3 | Dashboard shows correct city/state | ☐ | |
| 2.4 | Change location in settings; guidance updates | ☐ | |
| 2.5 | Android: location permission grant works | ☐ | |
| 2.6 | Android: deny permission → manual selection still works | ☐ | |

---

## 3. Core features (repeat per test city)

Test at least **three cities in different climates** (e.g. Hobart, Sydney, Brisbane).

**City:** _______________

| # | Step | Pass | Notes |
|---|------|------|-------|
| 3.1 | Dashboard loads without console errors | ☐ | |
| 3.2 | “What to plant” advice fits current season for this climate | ☐ | |
| 3.3 | Planting calendar month view matches dashboard tone | ☐ | |
| 3.4 | Weekly brief shows sensible top actions | ☐ | |
| 3.5 | Weather widget loads (not stuck loading) | ☐ | |
| 3.6 | Frost/heat warnings appropriate for location (or absent if N/A) | ☐ | |

---

## 4. My Garden

| # | Step | Pass | Notes |
|---|------|------|-------|
| 4.1 | Add a plant from picker | ☐ | |
| 4.2 | Plant appears with schedule/tasks | ☐ | |
| 4.3 | Edit plant details | ☐ | |
| 4.4 | Remove plant | ☐ | |
| 4.5 | Data persists after sign out / sign in | ☐ | |

---

## 5. Tasks & projects (if enabled in build)

| # | Step | Pass | Notes |
|---|------|------|-------|
| 5.1 | Create custom task | ☐ | |
| 5.2 | Mark task complete | ☐ | |
| 5.3 | Create project and assign task | ☐ | |

---

## 6. Notifications

| # | Step | Pass | Notes |
|---|------|------|-------|
| 6.1 | Enable notifications in settings | ☐ | |
| 6.2 | Android: register device for push | ☐ | |
| 6.3 | In-app notification inbox loads | ☐ | |
| 6.4 | Test push received (staging digest or `npm run test:push`) | ☐ | |
| 6.5 | Disable notifications; no push after digest run | ☐ | |

---

## 7. Security & privacy smoke tests

| # | Step | Pass | Notes |
|---|------|------|-------|
| 7.1 | Second test account cannot see first account’s garden (RLS) | ☐ | |
| 7.2 | Unauthenticated user cannot access another user’s data via UI | ☐ | |
| 7.3 | Privacy policy link works from settings/store listing | ☐ | |

---

## 8. Resilience

| # | Step | Pass | Notes |
|---|------|------|-------|
| 8.1 | Airplane mode: app loads; weather shows error/fallback (no white screen) | ☐ | |
| 8.2 | Trigger client error boundary (if possible); recovery works | ☐ | |
| 8.3 | Slow 3G: pages remain usable | ☐ | |

---

## 9. Release sign-off

| Check | Pass |
|-------|------|
| All blockers above fixed or documented | ☐ |
| CI green on release commit | ☐ |
| Supabase production checklist complete | ☐ |
| Known issues documented for testers | ☐ |

**Sign-off:** _______________

---

## Reporting issues

Include: device/browser, OS version, city/location, steps to reproduce, screenshot, and console errors if any.
