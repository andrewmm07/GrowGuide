# PROJECT CONTEXT: GrowGuide Phase 5 (Smart Notifications)

## CURRENT STATE (What's Already Done)

### ✅ Phase 1: Location & Climate - COMPLETE
### ✅ Phase 2: Simplify Plant Setup - COMPLETE
### ✅ Phase 3: Weekly Task Synthesis - COMPLETE
### ✅ Phase 4: Page Cleanup - COMPLETE

**Result:** Core app streamlined, clutter removed. Now replace hourly notification spam with smart batching.

---

## PHASE 5: SMART NOTIFICATIONS
**Goal:** Single daily digest at 7am instead of hourly per-plant spam. Batch related tasks.

**Current state:** WateringSchedule.tsx polls every hour, generates multiple notifications per plant.

**Target outcome:**
- Daily notification at 7am: "This week: water 3 plants, fertilize 2, check pests on 1"
- Grouped tasks: "Water tomatoes + basil + spinach" (one notification, not three)
- Include due-date context: "Harvest tomatoes in 2 days"
- No hourly polling or duplicate notifications
- User can still view full task list in app anytime

---

## TECH STACK (Relevant to Phase 5)
- Next.js 14 (App Router, API routes)
- React 18, TypeScript
- Supabase (schedules, user preferences)
- Capacitor (Push notifications on mobile)

---

## KEY FILES
- `app/api/notifications/daily-digest.ts` - NEW API route (runs at 7am via cron)
- `lib/notificationService.ts` - NEW service (batch + send notifications)
- `app/hooks/useNotificationPreferences.ts` - NEW hook (time, frequency settings)
- `app/components/NotificationSettings.tsx` - NEW component (settings for digest)
- `lib/taskSynthesis.ts` - Already groups tasks by type (from Phase 3)

---

## IMPLEMENTATION NOTES
- Use Supabase cron job (scheduled function) to trigger daily-digest endpoint at 7am
- Fetch user's plants + schedules for the week
- Group tasks (water, fertilize, pest, harvest)
- Send single push notification via Capacitor on mobile
- Store sent notifications in DB to prevent duplicates
- User can opt-in to SMS or email as backup

---

## CONSTRAINT
- Don't change plant or schedule schema
- taskSynthesis output is already batched (from Phase 3)
- Only replace notification strategy, not task calculation
- Preserve user's ability to view full task list in app

---

## END STATE
All phases complete. App is:
- Zone-aware (location/climate handled)
- Fast to use (2-min plant setup)
- Low-friction (weekly digest, not daily noise)
- Uncluttered (3 core pages)
- Smart (batched, prioritized notifications)

---
