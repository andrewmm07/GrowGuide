/**
 * Why did digest create 0 notifications? Run:
 *   $env:DIGEST_TEST_NOW="2026-06-01T22:00:00.000Z"
 *   npx tsx scripts/debug-notification-digest.ts
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { getDigestSlotsForUser, getLocalTimeParts } from '../lib/notifications/digestSchedule'
import { defaultTimezoneForLocation } from '../lib/notificationTimezone'
import {
  composePlantingNotification,
  composeWeekendTasksNotification,
  composeWeatherAlertNotification,
} from '../lib/notificationService'
import { getCurrentPlantingMonth } from '../lib/plantingRecommendations'
import { resolveLocationContext } from '../lib/microclimate/resolve'
import { getFrostGuidanceConfig } from '../lib/microclimate/frostSeason'
import type { UserLocation } from '../lib/types/location'

function loadEnvLocal() {
  const path = join(process.cwd(), '.env.local')
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (!m) continue
    let v = m[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    if (!process.env[m[1]]) process.env[m[1]] = v
  }
}

loadEnvLocal()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const weatherApiKey =
  process.env.WEATHER_API_KEY ??
  process.env.NEXT_PUBLIC_WEATHER_API_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Need SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const now = process.env.DIGEST_TEST_NOW ? new Date(process.env.DIGEST_TEST_NOW) : new Date()
const admin = createClient(supabaseUrl, serviceRoleKey)

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

async function main() {
  console.log('now (UTC):', now.toISOString())

  const { data: profiles } = await admin
    .from('profiles')
    .select(
      'id, location, notifications_enabled, planting_tips_enabled, weekend_tasks_enabled, weather_alerts_enabled, notifications_timezone'
    )
    .eq('notifications_enabled', true)

  if (!profiles?.length) {
    console.log('No profiles with notifications_enabled=true')
    return
  }

  for (const profile of profiles) {
    const location = parseLocation(profile.location)
    const tz =
      (typeof profile.notifications_timezone === 'string' && profile.notifications_timezone.trim()) ||
      defaultTimezoneForLocation(location ?? undefined)

    console.log('\n--- user', profile.id, '---')
    console.log('timezone:', tz)
    console.log('local time:', getLocalTimeParts(now, tz))

    const slots = getDigestSlotsForUser(now, tz, {
      plantingTipsEnabled: profile.planting_tips_enabled !== false,
      weekendTasksEnabled: profile.weekend_tasks_enabled !== false,
      weatherAlertsEnabled: profile.weather_alerts_enabled !== false,
    })
    console.log('slots:', slots)

    if (!slots) {
      console.log('→ No digest window. Use DIGEST_TEST_NOW for Tue 8:00 or Fri 17:30 local.')
      continue
    }

    const locCtx = location ? resolveLocationContext(location as UserLocation) : null
    const frostConfig = getFrostGuidanceConfig(locCtx)
    const month = getCurrentPlantingMonth(now)

    let forecast = null
    if (location && weatherApiKey && (slots.planting || slots.weather)) {
      const { resolveWeatherQuery } = await import('../lib/weatherService')
      const q = resolveWeatherQuery(location as UserLocation)
      if (q) {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(weatherApiKey)}&q=${encodeURIComponent(`${q.lat},${q.lon}`)}&days=4&aqi=no`
        const res = await fetch(url)
        forecast = res.ok ? await res.json() : null
        console.log('forecast fetch:', res.ok ? 'ok' : res.status)
      }
    }

    let plantingNote: string | null = null
    if (forecast && slots.planting && location) {
      const { resolveWeatherQuery } = await import('../lib/weatherService')
      const { getWeatherSignal, getRollingWeatherContext } = await import('../lib/weatherSignal')
      const { buildPlantingWeatherNote } = await import('../lib/notificationService')
      const q = resolveWeatherQuery(location as UserLocation)
      if (q) {
        try {
          const [signal, rolling] = await Promise.all([
            getWeatherSignal(q.lat, q.lon, location.climate ?? 'cool', month),
            getRollingWeatherContext(q.lat, q.lon, location.climate ?? 'cool'),
          ])
          plantingNote = buildPlantingWeatherNote(signal, rolling)
          console.log('plantingWeatherNote:', plantingNote?.slice(0, 120) ?? '(none)')
        } catch (e) {
          console.log('plantingWeatherNote error:', e)
        }
      }
    }

    if (slots.planting) {
      const p = composePlantingNotification(location, {
        forecast,
        plantingWeatherNote: plantingNote,
        frostConfig,
        now,
      })
      console.log('planting payload:', p ? p.title : '(skipped — see plantingRecommendations / weather gate)')
      if (!p && location) {
        const { getPlantingRecommendationsForMonth } = await import('../lib/plantingRecommendations')
        const rec = getPlantingRecommendationsForMonth(location, month)
        console.log('  sow/plant count:', rec.sow.length, rec.plant.length)
      }
    }

    if (slots.weekendTasks) {
      const { data: plantRows } = await admin.from('garden_plants').select('*').eq('user_id', profile.id)
      const { data: taskRows } = await admin.from('user_tasks').select('*').eq('user_id', profile.id)
      console.log('garden plants:', plantRows?.length ?? 0)
      const p = composeWeekendTasksNotification(
        (plantRows ?? []).map((r) => ({
          id: r.id,
          name: r.name,
          datePlanted: r.date_planted,
          type: r.type,
          isHarvested: r.is_harvested,
        })) as never,
        (taskRows ?? []) as never,
        now
      )
      console.log('weekend payload:', p ? p.title : '(skipped — no plants/tasks)')
    }

    if (slots.weather && forecast) {
      const p = composeWeatherAlertNotification(forecast as never, frostConfig)
      console.log('weather payload:', p ? p.title : '(skipped — no forecast tips)')
    }

    const { data: existing } = await admin
      .from('notifications')
      .select('dedupe_key, title, sent_at')
      .eq('user_id', profile.id)
      .order('sent_at', { ascending: false })
      .limit(5)
    console.log('recent notifications:', existing ?? [])
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
