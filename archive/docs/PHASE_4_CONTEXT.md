# PROJECT CONTEXT: GrowGuide Phase 4 (Page Cleanup)

## CURRENT STATE (What's Already Done)

### ✅ Phase 1: Location & Climate - COMPLETE
### ✅ Phase 2: Simplify Plant Setup - COMPLETE
### ✅ Phase 3: Weekly Task Synthesis - COMPLETE

**Result:** Core app is streamlined. Now remove clutter from navigation.

---

## PHASE 4: PAGE CLEANUP
**Goal:** Reduce navigation from 26+ pages to 3-4 core routes. Eliminate unused/redundant pages.

**Current state:** 21+ unused pages exist (bed-buddies, calendar/*, common-issues, guides, resources, etc.)

**Target outcome:**
- Navigation shows only: Dashboard, My Garden, Settings
- All unused pages deleted
- Remaining pages: public/landing, auth/login, auth/signup, dashboard, my-garden, settings, about, terms
- No confusion about which routes are "live"
- ~50% reduction in Next.js build time (fewer pages to compile)

---

## PAGES TO DELETE
```
app/bed-buddies/**
app/calendar/**
app/common-issues/**
app/crop-rotation/**
app/guides/**
app/how-it-works/**
app/resources/**
app/tips/**
app/tools/**
app/tracker/**
app/templates/**
app/harvest-tracker/**
```

Plus any duplicate/redundant settings, help, or FAQ pages.

---

## PAGES TO KEEP
```
app/dashboard/**         → Dashboard (home, today's tasks)
app/my-garden/**         → My Garden (add/manage plants)
app/settings/**          → Settings (location, notifications, account)
app/location-select/**   → Location picker (onboarding)
app/(auth)/**            → Login/signup/password-reset
app/about/**             → About app
app/terms/**             → Terms/privacy
```

---

## TECH STACK (Relevant to Phase 4)
- Next.js App Router (file-based routing)
- TypeScript (no imports to update, just delete directories)

---

## CONSTRAINT
- Don't delete pages that are still linked from core nav
- Don't break auth flow (keep login, signup, reset-password)
- Don't delete layout.tsx files at route level (keep them)
- Check for internal links to deleted pages before deleting

---

## PHASE 5 Will Follow
- Phase 5: Smart notifications (daily 7am digest)

---
