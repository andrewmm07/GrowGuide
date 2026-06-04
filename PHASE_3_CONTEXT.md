# PROJECT CONTEXT: GrowGuide Phase 3 (Weekly Task Synthesis)

## CURRENT STATE (What's Already Done)

### ✅ Phase 1: Location & Climate - COMPLETE
- Location detection, AU suburb database, plant timeline data (768 records), zone-aware schedules
- See ACTUAL_STATUS.md for verification

### ✅ Phase 2: Simplify Plant Setup - COMPLETE
- QuickAddPlant component created
- Form reduced to plant name + date
- 10-15 common plants selectable, searchable
- Estimated harvest date shown
- No optional fields in v1

**Result:** Users can add plants in 1-2 minutes. Friction removed.

---

## PHASE 3: WEEKLY TASK SYNTHESIS
**Goal:** Replace daily/hourly tasks with prioritized weekly digest. Reduce notification overload.

**Current state:** WateringSchedule.tsx generates daily per-plant notifications. Hourly polling causes fatigue.

**Target outcome:**
- User sees "This Week's Tasks" not "Today's Tasks"
- Tasks grouped by type: watering (batched), fertilizing, pest checks, harvest prep
- Ordered by urgency (harvest-ready > watering > preventive)
- Day-of reminder (e.g., "Monday: Water 3 plants + fertilize tomatoes")
- No duplicate notifications for same action on same plant
- One weekly digest at 7am, not hourly per-plant

---

## TECH STACK (Relevant to Phase 3)
- Next.js 14 (App Router)
- React 18, TypeScript
- Tailwind CSS
- Supabase (schedules stored per plant)
- plantTimelineService (keyActivities already available)

---

## KEY FILES
- `app/components/ThisWeeksTasks.tsx` - NEW component (batched weekly view)
- `lib/taskSynthesis.ts` - NEW service (synthesize + prioritize tasks)
- `app/hooks/useGardenTasks.ts` - NEW hook (fetch this week's tasks)
- `app/dashboard/page.tsx` - Replace "Today's Tasks" with "This Week's Tasks"
- `lib/scheduleService.ts` - Already generates keyActivities per plant

---

## CONSTRAINT
- Don't change scheduleService (already complete, zone-aware)
- Don't change plant data structure
- Don't add new columns to plant_timelines
- Synthesis logic uses existing keyActivities array

---

## PHASE 4-5 Will Follow
- Phase 4: Page cleanup (delete 21 unused pages)
- Phase 5: Smart notifications (daily 7am digest instead of hourly)

---
