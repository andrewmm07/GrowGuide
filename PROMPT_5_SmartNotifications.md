# PROMPT 5: Smart Daily Digest Notifications (Phase 5 Implementation)

## CONTEXT
Read PHASE_5_CONTEXT.md before starting. Phases 1-4 complete. taskSynthesis already groups tasks by type. Now replace hourly polling with daily 7am digest.

## TASK
Replace hourly per-plant notifications with single daily digest at 7am. Batch related tasks. Eliminate notification fatigue.

## ACCEPTANCE CRITERIA
1. Create lib/notificationService.ts with function prepareDigestNotification(weeklyDigest, userTimezone):
   - Takes synthesized tasks from taskSynthesis
   - Formats single notification body: "This week: water 3 plants, fertilize tomatoes, check basil for pests"
   - Includes count: "6 tasks, 3 overdue"
   - Returns Notification object with title, body, scheduleTime (7am user's timezone)

2. Create app/api/notifications/daily-digest.ts endpoint that:
   - Queries all users with notifications enabled
   - Loads each user's plants + zone
   - Calls synthesizeTasks(plants, zone)
   - Calls prepareDigestNotification(digest, userTimezone)
   - Stores notification record in Supabase (sent_notifications table)
   - Sends via Capacitor PushNotifications plugin on mobile
   - Handles errors gracefully (skip users with no plants, no schedules, disabled notifications)

3. Set up Supabase cron job to trigger /api/notifications/daily-digest at 7am UTC daily

4. Create app/components/NotificationSettings.tsx component in Settings page:
   - Toggle: "Enable daily digest"
   - Time picker: "Send at" (dropdown: 6am, 7am, 8am, 9am)
   - Timezone auto-detected from userLocation.timezone
   - Show sample notification text
   - Save preferences to user profiles table

5. Create database table: sent_notifications
   - Columns: id, user_id, notification_body, sent_at, read_at, created_at
   - Used to track delivery + prevent duplicates

6. Remove hourly polling from WateringSchedule.tsx (or wherever it is):
   - Find setInterval / useEffect that polls every hour
   - Delete the polling code
   - Keep the component's display logic for viewing tasks in-app

## TECHNICAL NOTES
- Interfaces:
  ```typescript
  interface DailyDigestNotification {
    title: string;
    body: string;
    scheduleTime: string; // "07:00" in user's timezone
    data?: { taskCount: number; urgentCount: number };
  }
  ```
- Use moment.js or date-fns to convert 7am to user's timezone
- userTimezone from userLocation (should be added to location service if missing)
- Supabase cron format: "0 7 * * *" (7am UTC, adjust if using user timezones differently)
- Test with dev database first (don't spam production users)

## FILES TO CREATE
1. lib/notificationService.ts (export prepareDigestNotification)
2. app/api/notifications/daily-digest.ts (endpoint)
3. app/components/NotificationSettings.tsx (settings UI)
4. supabase/migrations/[timestamp]_create_sent_notifications.sql (new table)

## FILES TO MODIFY
1. app/settings/page.tsx (import + render NotificationSettings)
2. lib/types/location.ts (add timezone field to UserLocation if not present)
3. WateringSchedule.tsx (remove hourly polling setInterval)
4. supabase/migrations/[timestamp]_alter_profiles_add_notification_prefs.sql (add notification columns to profiles table: notifications_enabled, digest_time, digest_timezone)

## SUPABASE SETUP
1. Create sent_notifications table:
   ```sql
   CREATE TABLE sent_notifications (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id),
     notification_body TEXT,
     sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     read_at TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   CREATE INDEX idx_sent_notifications_user_id ON sent_notifications(user_id);
   ```

2. Add columns to profiles table:
   ```sql
   ALTER TABLE profiles ADD COLUMN notifications_enabled BOOLEAN DEFAULT true;
   ALTER TABLE profiles ADD COLUMN digest_time VARCHAR(5) DEFAULT '07:00';
   ALTER TABLE profiles ADD COLUMN digest_timezone VARCHAR(50) DEFAULT 'Australia/Sydney';
   ```

3. Create Supabase cron job (via dashboard or SQL):
   - Trigger: POST https://your-project.supabase.co/functions/v1/daily-digest
   - Schedule: 0 7 * * * (7am UTC)
   - Or use Supabase scheduler UI to set up HTTP function call

## SUCCESS METRIC
- User receives single notification at 7am with batched tasks
- Notification shows multiple plants: "Water tomatoes, basil, spinach"
- No hourly polling or duplicate notifications
- Users can change digest time in Settings
- Notification delivery logged in sent_notifications table
- Hourly polling completely removed from code
