import { supabase } from '@/app/lib/supabase'
import type { NotificationPayload, NotificationPreferences, NotificationRow } from '@/lib/notificationTypes'
import { DEFAULT_NOTIFICATION_PREFS } from '@/lib/notificationTypes'
import { defaultTimezoneForLocation } from '@/lib/notificationTimezone'
import type { UserLocation } from '@/lib/types/location'

function rowToPrefs(row: Record<string, unknown> | null): NotificationPreferences {
  if (!row) return { ...DEFAULT_NOTIFICATION_PREFS }
  return {
    notificationsEnabled: Boolean(row.notifications_enabled),
    plantingTipsEnabled: row.planting_tips_enabled !== false,
    weekendTasksEnabled: row.weekend_tasks_enabled !== false,
    weatherAlertsEnabled: row.weather_alerts_enabled !== false,
    timezone:
      typeof row.notifications_timezone === 'string' ? row.notifications_timezone : null,
  }
}

export async function fetchNotificationPreferences(
  userId: string
): Promise<NotificationPreferences> {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'notifications_enabled, planting_tips_enabled, weekend_tasks_enabled, weather_alerts_enabled, notifications_timezone'
    )
    .eq('id', userId)
    .single()

  if (error) {
    console.warn('fetchNotificationPreferences', error.message)
    return { ...DEFAULT_NOTIFICATION_PREFS }
  }
  return rowToPrefs(data as Record<string, unknown>)
}

export async function saveNotificationPreferences(
  userId: string,
  prefs: NotificationPreferences | undefined,
  location?: Partial<UserLocation> | null
): Promise<void> {
  const safe = prefs ?? { ...DEFAULT_NOTIFICATION_PREFS }
  const timezone =
    safe.timezone?.trim() ||
    defaultTimezoneForLocation(location ?? undefined)

  const { error } = await supabase
    .from('profiles')
    .update({
      notifications_enabled: safe.notificationsEnabled,
      planting_tips_enabled: safe.plantingTipsEnabled,
      weekend_tasks_enabled: safe.weekendTasksEnabled,
      weather_alerts_enabled: safe.weatherAlertsEnabled,
      notifications_timezone: timezone,
    })
    .eq('id', userId)

  if (error) throw new Error(error.message)
}

export async function insertNotificationIfNew(
  userId: string,
  payload: NotificationPayload
): Promise<NotificationRow | null> {
  const { data: existing } = await supabase
    .from('notifications')
    .select('id')
    .eq('user_id', userId)
    .eq('dedupe_key', payload.dedupeKey)
    .maybeSingle()

  if (existing?.id) return null

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? null,
      dedupe_key: payload.dedupeKey,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return null
    throw new Error(error.message)
  }
  return data as NotificationRow
}

export async function fetchNotifications(
  userId: string,
  limit = 30
): Promise<NotificationRow[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as NotificationRow[]
}

export async function markNotificationRead(
  userId: string,
  notificationId: string
): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null)

  if (error) throw new Error(error.message)
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('read_at', null)

  if (error) return 0
  return count ?? 0
}
