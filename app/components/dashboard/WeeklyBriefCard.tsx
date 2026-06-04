'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import type { GardenPlant } from '@/app/context/GardenContext'
import type { UserLocation } from '@/lib/types/location'
import {
  buildWeeklyBrief,
  getBriefTasksDueThisWeek,
  getWeeklyBriefLoadLabel,
  WEEKLY_BRIEF_PREVIEW_LIMIT,
} from '@/lib/weeklyBriefService'
import { useWeeklySeasonGuidance } from '@/app/components/WeeklySeasonGuidanceBlock'
import { getHrefForPlanSegment, rememberPlanSegment } from '@/lib/planNavigation'

interface WeeklyBriefCardProps {
  plants: GardenPlant[]
  location?: UserLocation | null
  locationLoading?: boolean
  gardenLoading?: boolean
}

export default function WeeklyBriefCard({
  plants,
  location = null,
  locationLoading = false,
  gardenLoading = false,
}: WeeklyBriefCardProps) {
  const brief = useMemo(() => buildWeeklyBrief(plants), [plants])
  const { guidance: seasonGuidance } = useWeeklySeasonGuidance(location)

  const dueThisWeek = useMemo(() => getBriefTasksDueThisWeek(brief), [brief])
  const preview = useMemo(
    () => dueThisWeek.slice(0, WEEKLY_BRIEF_PREVIEW_LIMIT),
    [dueThisWeek]
  )
  const loadLabel = useMemo(() => getWeeklyBriefLoadLabel(dueThisWeek.length), [dueThisWeek.length])

  return (
    <Link
      href={getHrefForPlanSegment('week')}
      onClick={() => rememberPlanSegment('week')}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>
            📅
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">Weekly brief</p>
            {locationLoading || gardenLoading ? (
              <p className="text-xs text-gray-400 mt-0.5">Loading your garden...</p>
            ) : !location?.state && !location?.climate ? (
              <p className="text-xs text-gray-400 mt-0.5">
                Set location for seasonal guidance
              </p>
            ) : seasonGuidance ? (
              <p className="text-xs text-gray-500 mt-0.5">
                {seasonGuidance.season} · Week {seasonGuidance.weekInSeason}
                {loadLabel && (
                  <span className="text-gray-400"> · {loadLabel}</span>
                )}
              </p>
            ) : plants.length === 0 ? (
              <p className="text-xs text-gray-400 mt-0.5">
                Add plants in My Garden to see care tasks
              </p>
            ) : dueThisWeek.length === 0 ? (
              <p className="text-xs text-gray-400 mt-0.5">
                All clear — nothing due this week
              </p>
            ) : loadLabel ? (
              <p className="text-xs text-gray-500 mt-0.5">{loadLabel}</p>
            ) : null}
          </div>
        </div>
        <span className="text-gray-300 text-sm">→</span>
      </div>

      {preview.length > 0 && (
        <div className="space-y-2 border-t border-gray-100 pt-3">
          {preview.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-2 text-xs text-gray-700"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-400"
                aria-hidden
              />
              <span>
                <span className="font-medium text-gray-900">{item.plantName}</span>
                {' — '}
                {item.activity}
              </span>
            </div>
          ))}
          {dueThisWeek.length > preview.length && (
            <p className="text-xs font-medium text-green-600 pt-1">See all tasks</p>
          )}
        </div>
      )}
    </Link>
  )
}
