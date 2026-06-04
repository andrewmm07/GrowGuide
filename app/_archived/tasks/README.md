# Archived: Tasks page

Removed from navigation (May 2026) to simplify the mobile experience.

To restore:
1. Move `page.tsx` back to `app/tasks/page.tsx`
2. Re-add the Tasks link in `app/components/BottomNav.tsx` and/or `app/components/Sidebar.tsx`

Supporting hooks (`useTasks`, `useProjects`) and `lib/taskListBuilders.ts` remain in the codebase.
