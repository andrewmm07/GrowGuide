export type NotificationType = 'planting' | 'weekend_tasks' | 'weather'

export interface NotificationPayload {
  type: NotificationType
  title: string
  body: string
  dedupeKey: string
  data?: {
    deepLink: string
    preview?: string[]
  }
}

export interface NotificationRow {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  data: { deepLink?: string; preview?: string[] } | null
  dedupe_key: string | null
  sent_at: string
  read_at: string | null
  push_sent_at?: string | null
  created_at: string
}

export interface NotificationPreferences {
  notificationsEnabled: boolean
  plantingTipsEnabled: boolean
  weekendTasksEnabled: boolean
  weatherAlertsEnabled: boolean
  timezone: string | null
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  notificationsEnabled: false,
  plantingTipsEnabled: true,
  weekendTasksEnabled: true,
  weatherAlertsEnabled: true,
  timezone: null,
}
