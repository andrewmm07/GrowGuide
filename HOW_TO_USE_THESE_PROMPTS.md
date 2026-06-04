# How to Use GrowGuide Implementation Prompts

## Overview
GrowGuide implementation is divided into 5 phases. Phases 1-2 are complete. This document explains how to execute Phases 2-5 efficiently without duplicating work or wasting Claude credits.

## Files in This Folder
- `ACTUAL_STATUS.md` - Verified status of all phases (read this first if unsure about build state)
- `PHASE_2_CONTEXT.md` - Context for Phase 2 implementation chat
- `PHASE_3_CONTEXT.md` - Context for Phase 3 implementation chat
- `PHASE_4_CONTEXT.md` - Context for Phase 4 implementation chat
- `PHASE_5_CONTEXT.md` - Context for Phase 5 implementation chat
- `PROMPT_2_QuickAddPlant.md` - Task for Phase 2
- `PROMPT_3_ThisWeeksTasks.md` - Task for Phase 3
- `PROMPT_4_PageCleanup.md` - Task for Phase 4
- `PROMPT_5_SmartNotifications.md` - Task for Phase 5

## How to Execute Each Phase

### For Phase 2 Implementation (Simplify Plant Setup)
1. Start a new Claude chat
2. Copy the full content of `PHASE_2_CONTEXT.md` and paste it as the first message
3. Copy the full content of `PROMPT_2_QuickAddPlant.md` and paste it as the second message
4. Claude will implement QuickAddPlant component and update My Garden form

### For Phase 3 Implementation (Weekly Task Synthesis)
1. Start a new Claude chat
2. Copy the full content of `PHASE_3_CONTEXT.md`
3. Copy the full content of `PROMPT_3_ThisWeeksTasks.md`
4. Claude will create taskSynthesis service, ThisWeeksTasks component, and update dashboard

### For Phase 4 Implementation (Page Cleanup)
1. Start a new Claude chat
2. Copy the full content of `PHASE_4_CONTEXT.md`
3. Copy the full content of `PROMPT_4_PageCleanup.md`
4. Claude will identify and delete unused pages, update navigation

### For Phase 5 Implementation (Smart Notifications)
1. Start a new Claude chat
2. Copy the full content of `PHASE_5_CONTEXT.md`
3. Copy the full content of `PROMPT_5_SmartNotifications.md`
4. Claude will create notification service, daily digest endpoint, Supabase cron job

## What NOT to Do
- Don't paste multiple phases into one chat (causes confusion about scope)
- Don't skip PHASE_X_CONTEXT.md (it establishes what's already done)
- Don't ask Claude to implement Phase 2 before reading PHASE_2_CONTEXT.md
- Don't manually edit these files unless adding new phases

## Estimated Timeline
- Phase 2 (QuickAddPlant): 2 days
- Phase 3 (Weekly Tasks): 2 days
- Phase 4 (Page Cleanup): 1 day
- Phase 5 (Notifications): 2 days
- Testing + Integration: 2 days

**Total: 9 days** to fully shipping-ready state

## What Each Phase Delivers

### Phase 2: Simplify Plant Setup
Users can add plants in 90 seconds without friction. From current 5+ field form to 2-field quick add.

### Phase 3: Weekly Task Synthesis
Replace daily task notifications with weekly batched digest. Reduce notification fatigue.

### Phase 4: Page Cleanup
Reduce 26+ pages to 8. Remove clutter from navigation. Speed up build time.

### Phase 5: Smart Notifications
Single daily 7am digest instead of hourly per-plant spam. User-configurable digest time.

## Verification Checklist

Before starting Phase 2, verify Phase 1 is complete:
- [ ] User can set location on signup
- [ ] Location stored in Supabase profiles table
- [ ] Plant timelines table has 768+ records (query: SELECT COUNT(*) FROM plant_timelines;)
- [ ] PlantPicker fetches zone-appropriate plants
- [ ] Weather fetches for user's actual location (not Hobart hardcode)

If any of these fail, read ACTUAL_STATUS.md and fix Phase 1 before proceeding.

## Credit Optimization Tips
1. Each phase = one chat (don't batch phases together)
2. Include the context file at the start (it's ~200 lines, prevents Claude from making false assumptions)
3. Don't ask Claude to "verify" already-complete work (Phase 1 is done, don't ask to audit it)
4. Do ask Claude to test the new component (Phase 2, 3, 4, 5) in the same chat

## If Something Goes Wrong
1. Check ACTUAL_STATUS.md for current verified state
2. Verify your codebase matches expected file structure
3. In new chat, paste PHASE_X_CONTEXT.md + ask specific question (don't re-prompt the whole task)
4. Share error message or code snippet for debugging

## Questions?
Read ACTUAL_STATUS.md first. It has Q&A section at the end covering common issues.
