/**
 * Server-side scheduled notification digest.
 * Used by Supabase Edge Function (cron) — not by the mobile app on open.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { GardenPlant } from '@/app/context/GardenContext'
import type { Task } from '@/app/hooks/useTasks'
import { getFrostGuidanceConfig } from '@/lib/microclimate/frostSeason'
import { resolveLocationContext } from '@/lib/microclimate/resolve'
import {
  composePlantingNotification,
  composeWeekendTasksNotification,
  composeWeatherAlertNotification,
  buildPlantingWeatherNote,
} from '@/lib/notificationService'
import type { NotificationPayload, NotificationPreferences } from '@/lib/notificationTypes'
import { defaultTimezoneForLocation } from '@/lib/notificationTimezone'
import { getDigestSlotsForUser } from '@/lib/notifications/digestSchedule'
import { getFcmAccessToken, sendFcmToDevice, type FirebaseServiceAccountConfig } from '@/lib/push/fcmServer'
import { computeSeasonDisplay } from '@/lib/seasonDisplay'
import { getCurrentPlantingMonth } from '@/lib/plantingRecommendations'
import type { UserLocation } from '@/lib/types/location'
import { getWeatherSignal, getRollingWeatherContext } from '@/lib/weatherSignal'
import {
  resolveWeatherQuery,
  type WeatherForecastData,
  type WeatherQuery,
} from '@/lib/weatherService'

export interface DigestRunnerConfig {
  supabaseUrl: string
  serviceRoleKey: string
  weatherApiKey: string
  firebase?: FirebaseServiceAccountConfig
  now?: Date
}

export interface DigestRunnerResult {
  usersChecked: number
  notificationsCreated: number
  pushSent: number
  errors: string[]
}

function parseLocation(raw: unknown): Partial<UserLocation> | null {
  if (!raw) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Partial<UserLocation>
    } catch {
      return null
    }
  }
  if (typeof raw === 'object') return raw as Partial<UserLocation>
  return null
}

function parseGardenPlant(row: Record<string, unknown>): GardenPlant {
  return {
    id: row.id as string,
    name: row.name as string,
    datePlanted: row.date_planted as string,
    type: row.type as GardenPlant['type'],
    activityType: (row.activity_type as GardenPlant['activityType']) ?? undefined,
    location: (row.location as string) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    estimatedHarvest: (row.estimated_harvest as string) ?? undefined,
    schedule: (row.schedule as GardenPlant['schedule']) ?? [],
    fullSchedule: row.full_schedule
      ? (JSON.parse(row.full_schedule as string) as GardenPlant['fullSchedule'])
      : undefined,
    isHarvested: (row.is_harvested as boolean) ?? false,
    harvestedDate: (row.harvested_date as string) ?? undefined,
  }
}

function parseTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    title: row.title as string,
    description: (row.description as string) ?? undefined,
    due_date: row.due_date ? new Date(row.due_date as string) : undefined,
    completed: Boolean(row.completed),
    completed_at: row.completed_at ? new Date(row.completed_at as string) : undefined,
    plant_id: (row.plant_id as string) ?? undefined,
    project_id: (row.project_id as string) ?? undefined,
    category: (row.category as string) ?? 'general',
    priority: (row.priority as string) ?? 'medium',
    created_at: new Date(row.created_at as string),
    updated_at: new Date(row.updated_at as string),
  }
}

async function fetchForecast(
  location: Partial<UserLocation>,
  apiKey: string
): Promise<WeatherForecastData | null> {
  const query = resolveWeatherQuery(location as UserLocation)
  if (!query) return null

  const q = `${query.lat},${query.lon}`
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(q)}&days=4&aqi=no`
  const res = await fetch(url)
  if (!res.ok) return null
  return (await res.json()) as WeatherForecastData
}

async function insertIfNew(
  admin: SupabaseClient,
  userId: string,
  payload: NotificationPayload
): Promise<{ id: string } | null> {
  const { data: existing } = await admin
    .from('notifications')
    .select('id')
    .eq('user_id', userId)
    .eq('dedupe_key', payload.dedupeKey)
    .maybeSingle()

  if (existing?.id) return null

  const { data, error } = await admin
    .from('notifications')
    .insert({
      user_id: userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? null,
      dedupe_key: payload.dedupeKey,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') return null
    throw new Error(error.message)
  }
  return data as { id: string }
}

async function sendPushForNotification(
  admin: SupabaseClient,
  firebase: FirebaseServiceAccountConfig,
  accessToken: string,
  userId: string,
  notificationId: string,
  title: string,
  body: string,
  deepLink: string
): Promise<number> {
  const { data: tokens } = await admin.from('push_device_tokens').select('token').eq('user_id', userId)
  if (!tokens?.length) return 0

  let sent = 0
  for (const row of tokens) {
    try {
      await sendFcmToDevice(firebase, accessToken, row.token, title, body, {
        notificationId,
        deepLink,
      })
      sent++
    } catch {
      /* try other tokens */
    }
  }

  if (sent > 0) {
    await admin
      .from('notifications')
      .update({ push_sent_at: new Date().toISOString() })
      .eq('id', notificationId)
  }
  return sent
}

async function processUser(
  admin: SupabaseClient,
  userId: string,
  profile: Record<string, unknown>,
  config: DigestRunnerConfig,
  fcmToken: string | null,
  now: Date
): Promise<{ created: number; pushSent: number }> {
  const prefs: NotificationPreferences = {
    notificationsEnabled: Boolean(profile.notifications_enabled),
    plantingTipsEnabled: profile.planting_tips_enabled !== false,
    weekendTasksEnabled: profile.weekend_tasks_enabled !== false,
    weatherAlertsEnabled: profile.weather_alerts_enabled !== false,
    timezone:
      typeof profile.notifications_timezone === 'string'
        ? profile.notifications_timezone
        : null,
  }

  if (!prefs.notificationsEnabled) return { created: 0, pushSent: 0 }

  const location = parseLocation(profile.location)
  const timeZone =
    prefs.timezone?.trim() || defaultTimezoneForLocation(location ?? undefined)

  const slots = getDigestSlotsForUser(now, timeZone, prefs)
  if (!slots || (!slots.planting && !slots.weekendTasks && !slots.weather)) {
    return { created: 0, pushSent: 0 }
  }

  let forecast: WeatherForecastData | null = null
  let plantingNote: string | null = null
  const weatherQuery: WeatherQuery | null = location
    ? resolveWeatherQuery(location as UserLocation)
    : null
  const locCtx = location ? resolveLocationContext(location as UserLocation) : null
  const frostConfig = getFrostGuidanceConfig(locCtx)
  const month = getCurrentPlantingMonth(now)

  if (weatherQuery && (slots.planting || slots.weather)) {
    forecast = await fetchForecast(location!, config.weatherApiKey)
    if (forecast && slots.planting) {
      try {
        const [signal, rolling] = await Promise.all([
          getWeatherSignal(
            weatherQuery.lat,
            weatherQuery.lon,
            (location as UserLocation)?.climate ?? 'cool',
            month
          ),
          getRollingWeatherContext(
            weatherQuery.lat,
            weatherQuery.lon,
            (location as UserLocation)?.climate ?? 'cool'
          ),
        ])
        plantingNote = buildPlantingWeatherNote(signal, rolling)
      } catch {
        /* optional */
      }
    }
  }

  const payloads: NotificationPayload[] = []

  if (slots.planting) {
    const p = composePlantingNotification(location, {
      forecast,
      plantingWeatherNote: plantingNote,
      frostConfig,
      now,
    })
    if (p) payloads.push(p)
  }

  if (slots.weekendTasks) {
    const { data: plantRows } = await admin.from('garden_plants').select('*').eq('user_id', userId)
    const plants = (plantRows ?? []).map((r) => parseGardenPlant(r as Record<string, unknown>))
    const { data: taskRows } = await admin
      .from('user_tasks')
      .select('*')
      .eq('user_id', userId)
    const tasks = (taskRows ?? []).map((r) => parseTask(r as Record<string, unknown>))
    const p = composeWeekendTasksNotification(plants, tasks, now)
    if (p) payloads.push(p)
  }

  if (slots.weather && forecast) {
    const season =
      locCtx != null
        ? {
            seasonLabel: computeSeasonDisplay(now, locCtx.seasonCalendar).label,
            seasonCalendar: locCtx.seasonCalendar,
          }
        : undefined
    const p = composeWeatherAlertNotification(forecast, frostConfig, season)
    if (p) payloads.push(p)
  }

  let created = 0
  let pushSent = 0

  for (const payload of payloads) {
    const row = await insertIfNew(admin, userId, payload)
    if (!row) continue
    created++

    if (config.firebase && fcmToken) {
      const n = await sendPushForNotification(
        admin,
        config.firebase,
        fcmToken,
        userId,
        row.id,
        payload.title,
        payload.body,
        payload.data?.deepLink ?? '/dashboard'
      )
      pushSent += n
    }
  }

  return { created, pushSent }
}

export async function runScheduledNotificationDigest(
  config: DigestRunnerConfig
): Promise<DigestRunnerResult> {
  const now = config.now ?? new Date()
  const admin = createClient(config.supabaseUrl, config.serviceRoleKey)

  const { data: profiles, error } = await admin
    .from('profiles')
    .select(
      'id, location, notifications_enabled, planting_tips_enabled, weekend_tasks_enabled, weather_alerts_enabled, notifications_timezone'
    )
    .eq('notifications_enabled', true)

  if (error) throw new Error(error.message)

  let fcmToken: string | null = null
  if (config.firebase) {
    try {
      fcmToken = await getFcmAccessToken(config.firebase)
    } catch (e) {
      return {
        usersChecked: 0,
        notificationsCreated: 0,
        pushSent: 0,
        errors: [e instanceof Error ? e.message : String(e)],
      }
    }
  }

  const result: DigestRunnerResult = {
    usersChecked: profiles?.length ?? 0,
    notificationsCreated: 0,
    pushSent: 0,
    errors: [],
  }

  for (const profile of profiles ?? []) {
    try {
      const { created, pushSent } = await processUser(
        admin,
        profile.id as string,
        profile as Record<string, unknown>,
        config,
        fcmToken,
        now
      )
      result.notificationsCreated += created
      result.pushSent += pushSent
    } catch (e) {
      result.errors.push(
        `${profile.id}: ${e instanceof Error ? e.message : String(e)}`
      )
    }
  }

  return result
}
