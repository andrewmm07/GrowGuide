/**
 * Compose notification payloads from canonical planting + task + weather services.
 */

import type { GardenPlant } from '@/app/context/GardenContext'
import type { Task } from '@/app/hooks/useTasks'
import type { FrostGuidanceConfig } from '@/lib/microclimate/frostSeason'
import {
  assessPlantingWeather,
  plantingNoteBlocksNotification,
} from '@/lib/notificationWeatherGate'
import type { NotificationPayload } from '@/lib/notificationTypes'
import { isNonActionableActivity } from '@/lib/plantActivityCopy'
import {
  getPlantingRecommendationsForMonth,
  getCurrentPlantingMonth,
} from '@/lib/plantingRecommendations'
import { buildPlantingWeatherNote } from '@/lib/plantingWeatherGuidance'
import type { UserLocation } from '@/lib/types/location'
import {
  buildWeeklyBrief,
  getBriefTasksDueThisWeek,
  getWeekendLoadAdjective,
  type WeeklyActivity,
} from '@/lib/weeklyBriefService'
import {
  buildForecastGardenTips,
  shortWeekdayLabel,
  type ForecastDaySnapshot,
} from '@/lib/weatherGardeningSynthesis'
import type { WeatherForecastData } from '@/lib/weatherService'
import type { WeatherSeasonContext } from '@/lib/weatherGardeningSynthesis'

const PLANTING_PREVIEW_LIMIT = 6
const TASK_PREVIEW_LIMIT = 5

const CROP_STAGE_WATERING = /^Water at (silking|pod fill)$/i
const WATERING_STOP_REDUCE = /^(Stop|Reduce|Withhold) (water|watering)/i

function isoWeekKey(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

function dateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

function sanitizeNotificationProse(text: string): string {
  return text.replace(/\s*—\s*/g, '. ').replace(/\s+/g, ' ').trim()
}

function isRoutineWateringTask(act: WeeklyActivity): boolean {
  const title = act.activity.trim()
  if (!title) return false
  if (CROP_STAGE_WATERING.test(title) || WATERING_STOP_REDUCE.test(title)) return false
  if (String(act.category) === 'watering') return true
  return /\b(water|moist|irrigation)\b/i.test(title)
}

function isWeekendNotificationActivity(act: WeeklyActivity): boolean {
  if (isNonActionableActivity(act)) return false
  if (isRoutineWateringTask(act)) return false
  return true
}

function formatTaskLine(act: WeeklyActivity): string {
  const label = sanitizeNotificationProse(act.activity.trim())
  if (/tomato|basil|spinach|pea/i.test(label) && !label.toLowerCase().includes(act.plantName.toLowerCase())) {
    return `${label} (${act.plantName})`
  }
  return label
}

function formatWeekendNotificationBody(load: string, tasks: string[]): string {
  const prefix = `You have a ${load} weekend. Tasks include: `
  const maxLen = 240
  let listed = tasks.slice(0, TASK_PREVIEW_LIMIT)
  let body = prefix + listed.join(', ')

  while (listed.length > 1 && body.length > maxLen) {
    listed = listed.slice(0, -1)
    body = prefix + listed.join(', ')
  }

  const omitted = tasks.length - listed.length
  if (omitted > 0) {
    body += omitted === 1 ? ', and 1 more' : `, and ${omitted} more`
  }

  return body.slice(0, maxLen)
}

function forecastToSnapshots(forecast: WeatherForecastData): ForecastDaySnapshot[] {
  return forecast.forecast.forecastday.slice(0, 4).map((d) => ({
    date: d.date,
    shortLabel: shortWeekdayLabel(d.date),
    minC: d.day.mintemp_c,
    maxC: d.day.maxtemp_c,
    maxWindKph: d.day.maxwind_kph ?? 0,
    conditionCode: d.day.condition.code,
  }))
}

/** Tuesday: what to plant (location matrix + weather gate). */
export function composePlantingNotification(
  location: Partial<UserLocation> | null | undefined,
  options?: {
    forecast?: WeatherForecastData | null
    plantingWeatherNote?: string | null
    frostConfig?: FrostGuidanceConfig
    now?: Date
  }
): NotificationPayload | null {
  if (!location?.state && !location?.climate) return null

  const month = getCurrentPlantingMonth(options?.now)
  const rec = getPlantingRecommendationsForMonth(location, month)
  const sow = rec.sow.slice(0, PLANTING_PREVIEW_LIMIT)
  const plant = rec.plant.slice(0, PLANTING_PREVIEW_LIMIT)
  const names = Array.from(new Set([...sow, ...plant]))

  if (names.length === 0) return null

  if (plantingNoteBlocksNotification(options?.plantingWeatherNote)) return null

  const assessment = assessPlantingWeather(options?.forecast, options?.frostConfig)
  if (!assessment.workable) return null

  const listPhrase =
    sow.length && plant.length
      ? `Direct-sow ${sow.slice(0, 3).join(', ')}; plant out ${plant.slice(0, 3).join(', ')}`
      : sow.length
        ? `Good window to direct-sow ${sow.slice(0, 4).join(', ')}`
        : `Good window to plant out ${plant.slice(0, 4).join(', ')}`

  const weatherBit =
    options?.plantingWeatherNote?.trim() ||
    assessment.summary ||
    'Check the forecast before you head out.'

  const body = sanitizeNotificationProse(`${listPhrase}. ${weatherBit}`).slice(0, 280)
  const week = isoWeekKey(options?.now)

  return {
    type: 'planting',
    title: 'What to plant this week',
    body,
    dedupeKey: `planting:${week}`,
    data: {
      deepLink: '/planting-calendar',
      preview: names.slice(0, PLANTING_PREVIEW_LIMIT),
    },
  }
}

/** Friday: weekend tasks from plant schedules + custom tasks due soon. */
export function composeWeekendTasksNotification(
  plants: GardenPlant[],
  customTasks: Task[] = [],
  now: Date = new Date()
): NotificationPayload | null {
  const active = plants.filter((p) => !p.isHarvested)
  if (active.length === 0) return null

  const brief = buildWeeklyBrief(active, now)
  const systemLines = getBriefTasksDueThisWeek(brief)
    .filter((a) => a.urgency !== 'optional')
    .filter(isWeekendNotificationActivity)
    .map(formatTaskLine)

  const weekEnd = new Date(now)
  weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay()))
  const customLines = customTasks
    .filter((t) => !t.completed && t.due_date)
    .filter((t) => {
      const due = t.due_date!.getTime()
      return due >= now.getTime() && due <= weekEnd.getTime() + 86400000
    })
    .map((t) => sanitizeNotificationProse(t.title.trim()))
    .filter(Boolean)
    .filter((title) => !/\b(water|moist|irrigation)\b/i.test(title))

  const lines = Array.from(new Set([...systemLines, ...customLines]))
  if (lines.length === 0) return null

  const load = getWeekendLoadAdjective(lines.length)
  if (!load) return null

  const week = isoWeekKey(now)
  const body = formatWeekendNotificationBody(load, lines)

  return {
    type: 'weekend_tasks',
    title: 'Your garden this weekend',
    body,
    dedupeKey: `tasks:${week}`,
    data: {
      deepLink: '/weekly-brief',
      preview: lines.slice(0, TASK_PREVIEW_LIMIT),
    },
  }
}

/** Weather alert when forecast tips are non-empty. */
export function composeWeatherAlertNotification(
  forecast: WeatherForecastData,
  frostConfig?: FrostGuidanceConfig,
  season?: WeatherSeasonContext
): NotificationPayload | null {
  const snapshots = forecastToSnapshots(forecast)
  const tips = buildForecastGardenTips(snapshots, frostConfig, season)
  if (tips.length === 0) return null

  const body = sanitizeNotificationProse(tips.join(' '))
  const tipKey = tips.join('|').slice(0, 40).replace(/\W+/g, '_')

  return {
    type: 'weather',
    title: 'Weather watch for your garden',
    body: body.slice(0, 280),
    dedupeKey: `weather:${dateKey()}:${tipKey}`,
    data: {
      deepLink: '/dashboard',
      preview: tips,
    },
  }
}

export function isTuesday(date: Date = new Date()): boolean {
  return date.getDay() === 2
}

export function isFriday(date: Date = new Date()): boolean {
  return date.getDay() === 5
}

/** Build planting weather note from signal + rolling (sync path). */
export { buildPlantingWeatherNote }
