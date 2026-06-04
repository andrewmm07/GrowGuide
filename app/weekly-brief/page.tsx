'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useGarden } from '@/app/context/GardenContext'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
  buildWeeklyBrief,
  getBriefTasksDueThisWeek,
  WeeklyActivity,
} from '@/lib/weeklyBriefService'
import type { UserLocation } from '@/lib/types/location'
import {
  getPlantingRecommendationsForMonth,
  getCurrentPlantingMonth,
} from '@/lib/plantingRecommendations'
import { buildPlantingMonthMessaging } from '@/lib/plantingMonthMessaging'
import { useWeeklySeasonGuidance } from '@/app/components/WeeklySeasonGuidanceBlock'
import {
  weatherEnrichmentFootnote,
  type WeatherClauseTone,
} from '@/lib/weeklyGuidanceWeatherTone'
import type { WeeklySeasonGuidance } from '@/lib/weeklyGuidanceService'
import type { PlantingMonth } from '@/lib/planting/types'
import FrostDeferredPlantHint from '@/app/components/planting-calendar/FrostDeferredPlantHint'
import PlantingWeatherNote from '@/app/components/planting/PlantingWeatherNote'
import PlanPageShell from '@/app/components/layouts/PlanPageShell'
import PlanPageHeader from '@/app/components/layouts/PlanPageHeader'
import { usePlantingWeatherNote } from '@/app/hooks/usePlantingWeatherNote'
import { getMonthGuideHref, rememberPlanSegment } from '@/lib/planNavigation'

export default function WeeklyBriefPage() {
  const { plants, loading: gardenLoading } = useGarden()
  const { user, userLocation, loading: authLoading } = useAuth()
  const router = useRouter()
  const [weekOffset, setWeekOffset] = useState(0)

  React.useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const viewDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + weekOffset * 7)
    return d
  }, [weekOffset])

  const brief = useMemo(() => buildWeeklyBrief(plants, viewDate), [plants, viewDate])

  const { guidance: seasonGuidance, weatherEnriched, weatherClauseTone } =
    useWeeklySeasonGuidance(userLocation, viewDate)
  const plantingMonth = getCurrentPlantingMonth(viewDate)

  const plantSummaries = useMemo(() => {
    const allActivities = getBriefTasksDueThisWeek(brief).map((a) => ({
      ...a,
      priority:
        a.urgency === 'critical'
          ? ('critical' as const)
          : a.urgency === 'recommended'
            ? ('recommended' as const)
            : ('optional' as const),
    }))

    const grouped: Record<string, typeof allActivities> = {}
    allActivities.forEach((activity) => {
      if (!grouped[activity.plantName]) grouped[activity.plantName] = []
      grouped[activity.plantName].push(activity)
    })

    return grouped
  }, [brief])

  const taskCount = brief.critical.length + brief.recommended.length + brief.optional.length
  const hasPlantTasks = Object.keys(plantSummaries).length > 0
  const hasLocation = Boolean(userLocation?.state || userLocation?.climate)
  const isCurrentWeek = weekOffset === 0

  if (authLoading || gardenLoading) {
    return <WeeklyBriefSkeleton />
  }

  if (!user) {
    return null
  }

  const weekLabel = `${brief.weekStart.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })} – ${brief.weekEnd.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}`

  return (
    <PlanPageShell>
      <div className="space-y-4">
      {/* Page header */}
      <div className="space-y-3">
        <PlanPageHeader
          eyebrow="Weekly brief"
          title="This week in your garden"
          subtitle={
            userLocation?.city ? (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <span aria-hidden>📍</span>
                {userLocation.city}
                {userLocation.state ? `, ${userLocation.state}` : ''}
              </p>
            ) : undefined
          }
        />

        <WeekNavigator
          weekLabel={weekLabel}
          weekOffset={weekOffset}
          isCurrentWeek={isCurrentWeek}
          onPrevious={() => setWeekOffset(weekOffset - 1)}
          onNext={() => setWeekOffset(weekOffset + 1)}
          onToday={() => setWeekOffset(0)}
        />
      </div>

      {!hasLocation ? (
        <LocationPrompt onSelectLocation={() => router.push('/location-select')} />
      ) : (
        <>
          {seasonGuidance && (
            <SeasonGuidanceCard
              guidance={seasonGuidance}
              isCurrentWeek={isCurrentWeek}
              weatherEnriched={weatherEnriched && isCurrentWeek}
              weatherClauseTone={weatherClauseTone}
            />
          )}

          <PlantingCard
            userLocation={userLocation}
            month={plantingMonth}
            showWeatherNote={isCurrentWeek}
          />

          {plants.length === 0 ? (
            <EmptyGardenCard onAddPlant={() => router.push('/my-garden')} />
          ) : (
            <section className="space-y-3">
              <div className="flex items-end justify-between gap-3 px-0.5">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Your plants this week
                  </h2>
                  {hasPlantTasks && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {Object.keys(plantSummaries).length} plant{Object.keys(plantSummaries).length !== 1 ? 's' : ''} · {taskCount} task{taskCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <Link
                  href="/my-garden"
                  className="text-xs font-medium text-green-600 hover:text-green-700 shrink-0"
                >
                  View all my plants
                </Link>
              </div>

              {hasPlantTasks ? (
                <PlantTasksList plantSummaries={plantSummaries} />
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                  <span className="text-3xl block mb-2" aria-hidden>✨</span>
                  <p className="text-sm font-medium text-gray-800">
                    All clear this week
                  </p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    No care tasks due for your plants. Enjoy the calm, or browse what to plant above.
                  </p>
                </div>
              )}
            </section>
          )}
        </>
      )}
      </div>
    </PlanPageShell>
  )
}

function WeeklyBriefSkeleton() {
  return (
    <PlanPageShell>
      <div className="space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-7 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-32" />
      </div>
      <div className="h-11 bg-gray-200 rounded-2xl" />
      <div className="h-36 bg-gray-200 rounded-2xl" />
      <div className="h-28 bg-gray-200 rounded-2xl" />
      <div className="h-24 bg-gray-200 rounded-2xl" />
      </div>
    </PlanPageShell>
  )
}

function WeekNavigator({
  weekLabel,
  weekOffset,
  isCurrentWeek,
  onPrevious,
  onNext,
  onToday,
}: {
  weekLabel: string
  weekOffset: number
  isCurrentWeek: boolean
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrevious}
        disabled={weekOffset <= -4}
        aria-label="Previous week"
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeftIcon />
      </button>

      <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm px-3 py-2.5 text-center">
        <p className="text-sm font-semibold text-gray-900 truncate">{weekLabel}</p>
        {isCurrentWeek ? (
          <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wide text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
            This week
          </span>
        ) : (
          <button
            type="button"
            onClick={onToday}
            className="inline-block mt-1 text-[10px] font-medium text-green-600 hover:text-green-700"
          >
            Jump to this week
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={weekOffset >= 4}
        aria-label="Next week"
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRightIcon />
      </button>
    </div>
  )
}

function SeasonGuidanceCard({
  guidance,
  isCurrentWeek,
  weatherEnriched = false,
  weatherClauseTone = null,
}: {
  guidance: WeeklySeasonGuidance
  isCurrentWeek: boolean
  weatherEnriched?: boolean
  weatherClauseTone?: WeatherClauseTone | null
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-400" />
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl"
            aria-hidden
          >
            🌿
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <p className="text-sm font-semibold text-gray-900">
                {guidance.season}
              </p>
              <span className="text-xs text-gray-400 font-medium">
                Week {guidance.weekInSeason}
              </span>
              {!isCurrentWeek && (
                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  Preview
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {guidance.overview}
            </p>
            {weatherEnriched && weatherClauseTone && (
              <p className="text-[11px] text-gray-400 italic mt-2">
                {weatherEnrichmentFootnote(weatherClauseTone)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function LocationPrompt({ onSelectLocation }: { onSelectLocation: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      <span className="text-4xl block mb-3" aria-hidden>🗺️</span>
      <h2 className="text-base font-semibold text-gray-900">
        Set your location
      </h2>
      <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
        Weekly guidance is tailored to your climate and season. Choose where you garden to get started.
      </p>
      <button
        type="button"
        onClick={onSelectLocation}
        className="mt-5 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
      >
        Choose location
      </button>
    </div>
  )
}

function EmptyGardenCard({ onAddPlant }: { onAddPlant: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-6">
      <div className="flex items-start gap-3">
        <span
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl"
          aria-hidden
        >
          🪴
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-900">
            Track plants for care reminders
          </h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Add plants in My Garden to see harvest, feeding, and pest reminders here each week.
          </p>
          <button
            type="button"
            onClick={onAddPlant}
            className="mt-3 inline-flex items-center text-xs font-semibold text-green-600 hover:text-green-700"
          >
            Add your first plant →
          </button>
        </div>
      </div>
    </div>
  )
}

function PlantingCard({
  userLocation,
  month,
  showWeatherNote = true,
}: {
  userLocation: UserLocation | null
  month: PlantingMonth
  showWeatherNote?: boolean
}) {
  const weatherCallout = usePlantingWeatherNote(showWeatherNote ? userLocation : null)

  if (!userLocation?.state && !userLocation?.climate) return null

  const recommendations = getPlantingRecommendationsForMonth(userLocation, month)
  const { sow, plant, frostDeferredPlant } = recommendations
  const messaging = buildPlantingMonthMessaging(userLocation, month, recommendations)
  const hasSow = sow.length > 0
  const hasPlant = plant.length > 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          What to plant this month
        </h2>
        <Link
          href={getMonthGuideHref(month)}
          onClick={() => rememberPlanSegment('month')}
          className="text-xs font-medium text-green-600 hover:text-green-700 py-1 shrink-0 -mr-2"
        >
          Full month guide
        </Link>
      </div>

      {messaging && (
        <div className="mt-2 mb-3 space-y-1">
          <p className="text-sm font-medium text-gray-800">{messaging.monthHeadline}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{messaging.honestyCopy}</p>
        </div>
      )}

      <PlantingWeatherNote callout={weatherCallout} className="mb-4" />

      {!hasSow && !hasPlant ? (
        <div className="text-center py-2">
          <p className="text-sm text-gray-600">Quiet month for planting in your region.</p>
          <p className="text-xs text-gray-400 mt-1">Focus on maintenance and harvest instead.</p>
          <Link
            href={getMonthGuideHref(month)}
            onClick={() => rememberPlanSegment('month')}
            className="inline-block mt-3 text-xs font-medium text-green-600 hover:text-green-700"
          >
            Full month guide
          </Link>
        </div>
      ) : (
        <>
          <FrostDeferredPlantHint names={frostDeferredPlant} className="mb-3" />
          <div className={`grid gap-4 ${hasSow && hasPlant ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {hasSow && (
              <PlantingGroup label="Sow" emoji="🌱" items={sow} accent="bg-emerald-50 text-emerald-800 border-emerald-100" />
            )}
            {hasPlant && (
              <PlantingGroup label="Plant" emoji="🌿" items={plant} accent="bg-green-50 text-green-800 border-green-100" />
            )}
          </div>
        </>
      )}
    </div>
  )
}

function PlantingGroup({
  label,
  emoji,
  items,
  accent,
}: {
  label: string
  emoji: string
  items: string[]
  accent: string
}) {
  const visible = items.slice(0, 6)
  const extra = items.length - visible.length

  return (
    <div>
      <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
        <span aria-hidden>{emoji}</span> {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {visible.map((name) => (
          <span
            key={name}
            className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border ${accent}`}
          >
            {name}
          </span>
        ))}
        {extra > 0 && (
          <span className="text-xs text-gray-400 px-2 py-1.5 self-center">
            +{extra} more
          </span>
        )}
      </div>
    </div>
  )
}

type Priority = 'critical' | 'recommended' | 'optional'

const PRIORITY_ORDER: Record<Priority, number> = { critical: 0, recommended: 1, optional: 2 }

const PRIORITY_DOT: Record<Priority, string> = {
  critical: 'bg-gray-500',
  recommended: 'bg-gray-400',
  optional: 'bg-gray-300',
}

type PlantSummaryMap = Record<string, (WeeklyActivity & { priority: Priority })[]>

const COLLAPSED_TASK_LIMIT = 15

function PlantTasksList({ plantSummaries }: { plantSummaries: PlantSummaryMap }) {
  const [expanded, setExpanded] = useState(false)

  const tasks = useMemo(() => {
    return Object.values(plantSummaries)
      .flat()
      .sort((a, b) => {
        const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        if (p !== 0) return p
        return a.daysUntil - b.daysUntil
      })
  }, [plantSummaries])

  const hiddenCount = Math.max(0, tasks.length - COLLAPSED_TASK_LIMIT)
  const visible = expanded ? tasks : tasks.slice(0, COLLAPSED_TASK_LIMIT)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <ul className="divide-y divide-gray-50">
        {visible.map((task) => {
          const subtext = taskSubtext(task)
          return (
          <li key={task.id} className="px-3 py-2 flex items-start gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${PRIORITY_DOT[task.priority]}`}
              title={task.reason}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs leading-snug text-gray-800">
                <span className="font-medium text-gray-900">{task.plantName}</span>
                <span className="text-gray-600"> · {formatTaskAction(task)}</span>
              </p>
              {subtext && (
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug line-clamp-2">
                  {subtext}
                </p>
              )}
              <p className="text-[10px] text-gray-400 mt-0.5">{formatDueLabel(task.daysUntil)}</p>
            </div>
          </li>
          )
        })}
      </ul>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="w-full py-2 text-xs font-medium text-green-600 hover:text-green-700 border-t border-gray-50 bg-gray-50/50"
        >
          {expanded ? 'Show fewer' : `Show ${hiddenCount} more task${hiddenCount !== 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  )
}

/** Primary label from the plant schedule (not a generic fallback). */
function formatTaskAction(task: WeeklyActivity): string {
  const label = task.activity?.trim()
  if (label) return label
  const fromCategory: Record<WeeklyActivity['category'], string> = {
    harvest: 'Harvest check',
    pruning: 'Pruning',
    fertilizing: 'Feed',
    pest: 'Pest check',
    planting: 'Plant care',
  }
  return fromCategory[task.category] ?? 'Scheduled care'
}

function formatDueLabel(daysUntil: number): string {
  if (daysUntil <= 0) return 'Due today'
  if (daysUntil === 1) return 'Due tomorrow'
  return `Due in ${daysUntil} days`
}

function taskSubtext(task: WeeklyActivity): string | null {
  const parts: string[] = []
  const details = task.details?.trim()
  const action = task.activity?.trim().toLowerCase() ?? ''

  if (details && !action.includes(details.toLowerCase().slice(0, Math.min(24, details.length)))) {
    parts.push(details)
  }
  if (task.reason) parts.push(task.reason)

  return parts.length > 0 ? parts.join(' · ') : null
}

function ChevronLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}
