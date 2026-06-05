# PROMPT 3: Weekly Task Synthesis (Phase 3 Implementation)

## CONTEXT
Read PHASE_3_CONTEXT.md before starting. Phase 1 & 2 complete. scheduleService already generates keyActivities for each plant per zone.

## TASK
Create task synthesis system to replace daily task view with weekly batched digest. Reduce notification fatigue by grouping related tasks.

## ACCEPTANCE CRITERIA
1. Create lib/taskSynthesis.ts with function synthesizeTasks(plants: GardenPlant[], userZone: string) that:
   - Fetches each plant's schedule via scheduleService
   - Extracts keyActivities for next 7 days
   - Groups by activity type (watering, fertilizing, pest-check, pruning, harvest)
   - Orders by urgency (harvest-ready first, then watering, then preventive)
   - Removes duplicates (same plant + same activity on same day counted once)
   - Returns WeeklyTaskDigest interface

2. Create app/components/ThisWeeksTasks.tsx component that:
   - Accepts weeklyDigest object
   - Displays grouped tasks: "Water 3 plants (tomatoes, basil, spinach)"
   - Shows days of week horizontally (Mon-Sun)
   - Highlights urgent tasks (orange for harvest-ready, yellow for overdue)
   - Links plant name to plant detail view
   - Shows all 7 days at a glance

3. Create app/hooks/useGardenTasks.ts hook that:
   - Fetches plants from GardenContext
   - Calls synthesizeTasks(plants, userZone)
   - Returns loading, error, weeklyDigest states
   - Caches results (don't re-fetch on every render)

4. Update app/dashboard/page.tsx:
   - Replace "Today's Tasks" section with "This Week's Tasks"
   - Use useGardenTasks hook
   - Pass digest to ThisWeeksTasks component

## TECHNICAL NOTES
- Interfaces to create:
  ```typescript
  interface SynthesizedTask {
    type: 'watering' | 'fertilizing' | 'pest-check' | 'pruning' | 'harvest';
    plants: string[];
    daysUntil: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
  }
  
  interface WeeklyTaskDigest {
    tasks: SynthesizedTask[];
    startDate: Date;
    endDate: Date;
  }
  ```
- keyActivities from scheduleService have timing (days from sow), activity name, details, category
- Calculate daysUntil based on plant's sowDate + activity timing
- Use Tailwind core utilities only
- TypeScript strict mode

## FILES TO CREATE
1. lib/taskSynthesis.ts (export synthesizeTasks function)
2. app/components/ThisWeeksTasks.tsx (display component)
3. app/hooks/useGardenTasks.ts (fetch + cache hook)

## FILES TO MODIFY
1. app/dashboard/page.tsx (replace Today's Tasks section)

## SUCCESS METRIC
- Dashboard displays weekly tasks grouped by type
- Same task (water tomatoes) shown once even if appears in multiple schedules
- Harvest-ready tasks highlighted prominently
- No per-plant duplicates visible to user
