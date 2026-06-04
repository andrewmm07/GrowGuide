# PROMPT 4: Page Cleanup (Phase 4 Implementation)

## CONTEXT
Read PHASE_4_CONTEXT.md before starting. Phases 1-3 complete. App is now functionally complete, just cluttered.

## TASK
Delete 21+ unused pages. Reduce navigation to 3 core items. Streamline Next.js build.

## ACCEPTANCE CRITERIA
1. Delete these directories entirely:
   - app/bed-buddies/
   - app/calendar/
   - app/common-issues/
   - app/crop-rotation/
   - app/guides/
   - app/how-it-works/
   - app/resources/
   - app/tips/
   - app/tools/
   - app/tracker/
   - app/templates/
   - app/harvest-tracker/
   - (Plus any duplicate help, FAQ, or guide pages)

2. Keep only these pages:
   - app/dashboard/
   - app/my-garden/
   - app/settings/
   - app/location-select/
   - app/(auth)/ (login, signup, reset-password, verify-email)
   - app/about/
   - app/terms/
   - app/page.tsx (or landing)

3. Update navigation components to show only:
   - Dashboard (home icon)
   - My Garden (plant icon)
   - Settings (gear icon)

4. Search entire codebase for hardcoded links to deleted pages:
   - Check app/components/Navigation.tsx (or nav component name)
   - Check app/components/Sidebar.tsx (or sidebar component name)
   - Check app/layout.tsx for nav rendering
   - Check for any internal Link components pointing to /bed-buddies/, /guides/, etc.
   - Remove or redirect these links

5. Verify auth flow still works:
   - Test signup redirect to location-select
   - Test logout redirects to login
   - Test password reset flow

## TECHNICAL NOTES
- Use bash to find all pages: `find app/ -maxdepth 2 -name "page.tsx" | grep -v dashboard | grep -v my-garden | grep -v settings | grep -v location-select | grep -v auth | grep -v about | grep -v terms`
- Use grep to find internal links: `grep -r '/bed-buddies\|/guides\|/calendar' app/`
- Don't delete layout.tsx files at the root level (keep root layout)
- Backup file list before deletion (for rollback if needed)

## FILES TO DELETE (NOT MODIFY)
- All app/*/page.tsx files except those listed in KEEP section above
- All corresponding directories

## FILES TO MODIFY
1. app/components/Navigation.tsx (or equivalent) - remove links to deleted pages
2. app/components/Sidebar.tsx (if exists) - update nav structure
3. app/layout.tsx - verify nav component updated
4. Any 404 or error page that may reference deleted pages

## SUCCESS METRIC
- Navigation shows exactly 3 items: Dashboard, My Garden, Settings
- All deleted pages return 404 (Next.js automatically)
- No broken internal links
- Build completes without warnings about orphaned routes
- App bundle size noticeably smaller (~5-10% reduction)

## TESTING CHECKLIST
1. Signup flow: email → location select → dashboard → works
2. Add plant: dashboard → my garden → add plant → success
3. View tasks: dashboard → this week's tasks show → works
4. Settings: dashboard → settings → works
5. Logout: click logout → redirect to login → works
