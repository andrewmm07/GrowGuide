/**
 * When to send scheduled notifications in the user's local timezone.
 *
 * - Tuesday 8:00am — planting
 * - Daily 8:00am — weather (when tips exist)
 * - Friday 5:30pm — weekend tasks
 *
 * Cron should NOT run every hour. Use NOTIFICATION_CRON_SCHEDULES so the edge
 * function only wakes during UTC windows where 8:00 or 17:30 can occur in AU.
 */

export const MORNING_DIGEST_HOUR = 8
/** Only fire morning slots in the first half-hour (matches cron at :00). */
export const MORNING_DIGEST_MINUTE_MAX = 29

export const FRIDAY_TASKS_HOUR = 17
export const FRIDAY_TASKS_MINUTE = 30
/** Only fire Friday tasks in a short window (matches cron at :30). */
export const FRIDAY_TASKS_MINUTE_MAX = 44

export interface LocalTimeParts {
  hour: number
  minute: number
  dayOfWeek: number
}

const WEEKDAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

export function getLocalTimeParts(now: Date, timeZone: string): LocalTimeParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now)

  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon'
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  return { hour, minute, dayOfWeek: WEEKDAY_MAP[weekday] ?? 1 }
}

function isMorningDigestWindow(local: LocalTimeParts): boolean {
  return local.hour === MORNING_DIGEST_HOUR && local.minute <= MORNING_DIGEST_MINUTE_MAX
}

function isFridayEveningTasksWindow(local: LocalTimeParts): boolean {
  return (
    local.dayOfWeek === 5 &&
    local.hour === FRIDAY_TASKS_HOUR &&
    local.minute >= FRIDAY_TASKS_MINUTE &&
    local.minute <= FRIDAY_TASKS_MINUTE_MAX
  )
}

export interface DigestSlots {
  planting: boolean
  weekendTasks: boolean
  weather: boolean
}

export function getDigestSlotsForUser(
  now: Date,
  timeZone: string,
  prefs: {
    plantingTipsEnabled: boolean
    weekendTasksEnabled: boolean
    weatherAlertsEnabled: boolean
  }
): DigestSlots | null {
  const local = getLocalTimeParts(now, timeZone)
  const morning = isMorningDigestWindow(local)
  const fridayEvening = isFridayEveningTasksWindow(local)

  if (!morning && !fridayEvening) return null

  return {
    planting: morning && prefs.plantingTipsEnabled && local.dayOfWeek === 2,
    weekendTasks: fridayEvening && prefs.weekendTasksEnabled,
    weather: morning && prefs.weatherAlertsEnabled,
  }
}

/**
 * Supabase Edge Function schedules (attach all three).
 * ~17 runs/day total — not hourly.
 *
 * | Schedule            | Purpose |
 * |---------------------|---------|
 * | 0,30 21,22,23 * * * | AU 8:00 (east / central) — planting Tue, weather daily |
 * | 0,30 0,1 * * *      | AU 8:00 (west) — same slots |
 * | 30 6,7,8,9,10 * * 5 | AU Fri 17:30 — weekend tasks |
 */
export const NOTIFICATION_CRON_SCHEDULES = [
  '0,30 21,22,23 * * *',
  '0,30 0,1 * * *',
  '30 6,7,8,9,10 * * 5',
] as const
