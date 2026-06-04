# PROMPT 2: Simplify Plant Addition (Phase 2 Implementation)

## CONTEXT
Read PHASE_2_CONTEXT.md before starting. Phase 1 is complete (location/climate/schedules working). Plant picker already uses plantTimelineService and is zone-aware.

## TASK
Create QuickAddPlant component to replace current multi-step plant addition form. Target: 1-2 minute setup for new plants.

## ACCEPTANCE CRITERIA
1. Component accepts zone (from GardenContext or props)
2. Shows 10-15 most common vegetables (tomatoes, lettuce, beans, carrots, spinach, basil, capsicum, cucumber, zucchini, pumpkin, peas, radish, turnip, broccoli, kale)
3. User can search by plant name (case-insensitive)
4. User selects plant → sees estimated harvest date (calculated from plantTimelineService with growth multiplier applied)
5. Form has only 2 fields: plant name + sowing date (date picker, default today)
6. "Add Plant" button triggers GardenContext.addPlant() with name, sowDate, scheduleData
7. No optional fields (location, notes, type selector) in v1
8. On success: confirmation toast + return to My Garden view
9. Handles loading state while fetching plant timeline
10. Handles errors gracefully (plant not in DB for this zone)

## TECHNICAL NOTES
- Use getAvailablePlantsForZone(zone) to populate dropdown initially
- Call getPlantTimeline(plantName, zone) on selection to get harvest estimate
- Reuse existing PlantPicker search logic if available
- Don't modify plantTimelineService or scheduleService (already complete)
- Component should live in app/components/QuickAddPlant.tsx
- Use Tailwind core utilities only
- Ensure TypeScript strict mode compliance

## OPTIONAL ENHANCEMENTS (v2+)
- Save recently added plants to localStorage for quick re-add
- Show "popular in your zone" ordering
- Preview plant care tips on selection
- Batch add multiple plants

## FILES TO MODIFY
1. Create app/components/QuickAddPlant.tsx (new file)
2. Update app/my-garden/page.tsx to import + use QuickAddPlant (replace old form)
3. Test with 2+ hardiness zones to verify harvest dates change per zone

## SUCCESS METRIC
- User can add a plant in under 90 seconds
- Harvest date displayed matches zone-specific growth timeline
- Form validation prevents invalid dates (past dates rejected)
