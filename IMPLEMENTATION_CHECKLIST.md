# GrowGuide: Complete Implementation Checklist

**Date Started:** May 20, 2026
**Target Ship Date:** May 29, 2026 (9 days)

---

## PHASE 1: Location & Climate (COMPLETE ✅)

### Core Infrastructure
- [x] lib/types/location.ts - UserLocation, AUHardinessZone, Climate types
- [x] lib/locationService.ts - detectLocationOnce, getUserLocationFromDB, updateUserLocation, lookupSuburbByName, getAllSuburbs
- [x] lib/auSuburbData.ts - 500+ suburbs mapped to zones
- [x] lib/utils/haversine.ts - Distance calculation
- [x] supabase/migrations/20250520_create_plant_timelines.sql - Schema + indexes

### UI & Integration
- [x] app/location-select/page.tsx - Location picker (auto-detect + manual)
- [x] AuthContext integration - userLocation stored + accessible
- [x] Supabase: location saved in profiles table

### Data & Services
- [x] plant_timelines table - 768 records populated (all AU zones)
- [x] lib/plantTimelineService.ts - getPlantTimeline, getAvailablePlantsForZone, getZonesForPlant, adjustTimelineForZone, getPlantingWindows
- [x] lib/scheduleService.ts - generatePlantSchedule (zone-aware, applies growth multipliers)
- [x] supabase/functions/weather/index.ts - Accepts city/state parameters
- [x] app/components/PlantPicker.tsx - Uses plantTimelineService (zone-aware)
- [x] app/components/GardenPlannerView.tsx - Calls scheduleService with user zone
- [x] app/dashboard/page.tsx - Passes userLocation to WeatherStrip

**Result:** Location → Zone → Plant Data → Adjusted Schedule. All working end-to-end.

---

## PHASE 2: Simplify Plant Setup (IN PROGRESS 🔄)

### New Components
- [ ] app/components/QuickAddPlant.tsx - 2-field form (plant name + date)
- [ ] 10-15 common plants selectable
- [ ] Search functionality
- [ ] Harvest date calculation displayed
- [ ] Success confirmation + redirect

### Updates
- [ ] app/my-garden/page.tsx - Replace old form with QuickAddPlant
- [ ] Remove optional fields (location, notes, type selector)

### Testing
- [ ] Add plant in < 90 seconds
- [ ] Harvest date matches zone
- [ ] Form validation (reject past dates)
- [ ] Test in 2+ zones

**Timeline:** 2 days
**Use:** Copy PHASE_2_CONTEXT.md + PROMPT_2_QuickAddPlant.md into new chat

---

## PHASE 3: Weekly Task Synthesis (NOT STARTED ❌)

### New Services
- [ ] lib/taskSynthesis.ts - synthesizeTasks(plants, zone)
  - [ ] Group tasks by type (water, fertilize, pest, pruning, harvest)
  - [ ] Order by urgency (harvest-ready first)
  - [ ] Remove duplicates (same plant + same activity = one task)
  - [ ] Return WeeklyTaskDigest

### New Components
- [ ] app/components/ThisWeeksTasks.tsx - Display grouped tasks by day
- [ ] Highlight urgent tasks (colors)
- [ ] Show 7-day overview

### New Hooks
- [ ] app/hooks/useGardenTasks.ts - Fetch + synthesize tasks for week

### Updates
- [ ] app/dashboard/page.tsx - Replace "Today's Tasks" with "This Week's Tasks"

### Testing
- [ ] Weekly view shows batched tasks ("Water 3 plants" not 3 separate)
- [ ] Harvest-ready tasks highlighted
- [ ] No duplicate tasks visible
- [ ] All 7 days displayed

**Timeline:** 2 days
**Use:** Copy PHASE_3_CONTEXT.md + PROMPT_3_ThisWeeksTasks.md into new chat

---

## PHASE 4: Page Cleanup (NOT STARTED ❌)

### Deletions
- [ ] Delete app/bed-buddies/
- [ ] Delete app/calendar/
- [ ] Delete app/common-issues/
- [ ] Delete app/crop-rotation/
- [ ] Delete app/guides/
- [ ] Delete app/how-it-works/
- [ ] Delete app/resources/
- [ ] Delete app/tips/
- [ ] Delete app/tools/
- [ ] Delete app/tracker/
- [ ] Delete app/templates/
- [ ] Delete app/harvest-tracker/
- [ ] Delete any duplicate help/FAQ/settings pages

### Navigation Updates
- [ ] app/components/Navigation.tsx - Show only Dashboard, My Garden, Settings
- [ ] app/components/Sidebar.tsx (if exists) - Update nav structure
- [ ] app/layout.tsx - Verify nav reflects deletions
- [ ] Remove all hardcoded links to deleted pages

### Testing
- [ ] Signup → location-select → dashboard (flow works)
- [ ] Logout → login (flow works)
- [ ] No 404s for expected pages
- [ ] Build completes without orphaned route warnings
- [ ] Bundle size ~5-10% smaller

**Timeline:** 1 day
**Use:** Copy PHASE_4_CONTEXT.md + PROMPT_4_PageCleanup.md into new chat

---

## PHASE 5: Smart Notifications (NOT STARTED ❌)

### New Services
- [ ] lib/notificationService.ts - prepareDigestNotification(digest, timezone)
  - [ ] Format single notification body
  - [ ] Include task count + overdue count
  - [ ] Calculate 7am user's timezone

### New API Endpoint
- [ ] app/api/notifications/daily-digest.ts
  - [ ] Query all users
  - [ ] Load plants + zone for each
  - [ ] Call synthesizeTasks + prepareDigestNotification
  - [ ] Send via Capacitor PushNotifications
  - [ ] Log to sent_notifications table

### New Components
- [ ] app/components/NotificationSettings.tsx (in Settings)
  - [ ] Toggle: "Enable daily digest"
  - [ ] Time picker: 6am-9am (30min intervals)
  - [ ] Show sample notification
  - [ ] Save to profiles table

### Database
- [ ] Create sent_notifications table (id, user_id, notification_body, sent_at, read_at)
- [ ] Add to profiles: notifications_enabled, digest_time, digest_timezone
- [ ] Create Supabase cron job trigger (0 7 * * * UTC)

### Removals
- [ ] Remove hourly polling from WateringSchedule.tsx
- [ ] Remove setInterval / polling useEffect

### Testing
- [ ] Receive 1 notification at 7am (don't spam)
- [ ] Multiple plants batched ("Water 3 plants")
- [ ] User can change digest time in Settings
- [ ] No hourly polling or duplicate notifications
- [ ] Notification logged in sent_notifications table
- [ ] Cron job triggered daily

**Timeline:** 2 days
**Use:** Copy PHASE_5_CONTEXT.md + PROMPT_5_SmartNotifications.md into new chat

---

## INTEGRATION & TESTING (NOT STARTED ❌)

- [ ] All phases working together end-to-end
- [ ] Signup → location → add plant → see weekly tasks → receive digest (full flow)
- [ ] Zone-specific data verified (test 3+ zones)
- [ ] No console errors
- [ ] Mobile (Capacitor) build succeeds
- [ ] Notifications work on Android device
- [ ] Performance acceptable (no slow lists, forms, or API calls)

**Timeline:** 2 days

---

## SHIP READINESS

### Pre-Ship Verification
- [ ] All phases complete + tested
- [ ] No console warnings or errors
- [ ] All 8 acceptance criteria per phase met
- [ ] README updated with new user flows
- [ ] Screenshots + GIFs for marketing (optional)

### Ship Channels
- [ ] Google Play Store submission (APK signed)
- [ ] Release notes written (what's new, what's fixed)
- [ ] Beta testers notified
- [ ] Monitoring set up (crash tracking, analytics)

**Timeline:** 1 day

---

## SUMMARY

| Phase | Status | Timeline | Start | End |
|-------|--------|----------|-------|-----|
| 1 | Complete ✅ | - | - | May 20 |
| 2 | In Progress 🔄 | 2 days | May 21 | May 22 |
| 3 | Not Started ❌ | 2 days | May 23 | May 24 |
| 4 | Not Started ❌ | 1 day | May 25 | May 25 |
| 5 | Not Started ❌ | 2 days | May 26 | May 27 |
| Integration | Not Started ❌ | 2 days | May 28 | May 29 |

**Critical Path:** None (phases can overlap if parallel work feasible)

---

## How to Use This Checklist

1. Each chat session = one phase
2. Copy the relevant PHASE_X_CONTEXT.md + PROMPT_X.md into the chat
3. When phase complete, mark all boxes [ ] → [x] in this document
4. Don't skip phases (each builds on the previous)
5. If a phase fails, fix + retry in same chat before moving to next phase

---

## Credit Optimization

Total estimated Claude cost for Phases 2-5 implementation:
- Phase 2: 1-2 API calls (init + follow-up testing)
- Phase 3: 2-3 API calls (init + follow-up + testing)
- Phase 4: 1-2 API calls (init + follow-up)
- Phase 5: 2-3 API calls (init + follow-up + testing)

**Total: ~8-10 API calls** (~$0.50-$1.00 at Haiku rates)

Avoid: Asking Claude to re-verify Phase 1 or repeat existing code audits.
