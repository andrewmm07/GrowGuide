'use client'
import type { UserLocation } from '@/lib/types/location'
import Link from 'next/link'
import FrostDeferredPlantHint from '@/app/components/planting-calendar/FrostDeferredPlantHint'
import PlantingWeatherNote from '@/app/components/planting/PlantingWeatherNote'
import { usePlantingWeatherNote } from '@/app/hooks/usePlantingWeatherNote'
import {
  getPlantingRecommendationsForMonth,
  getCurrentPlantingMonth,
} from '@/lib/plantingRecommendations'
import {
  buildPlantingMonthMessaging,
  PLANTING_CARD_PREVIEW_LIMIT,
} from '@/lib/plantingMonthMessaging'
import { getMonthGuideHref, rememberPlanSegment } from '@/lib/planNavigation'

interface WhatToPlantNowProps {
  location: UserLocation | null
}

function PlantingPreviewSection({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </p>
      {items.length > 0 ? (
        <ul className="space-y-1.5">
          {items.map((plant) => (
            <li key={plant} className="flex items-center gap-2 text-sm text-gray-800">
              <span
                className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"
                aria-hidden
              />
              <span className="break-words">{plant}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400">Nothing this month</p>
      )}
    </div>
  )
}

export default function WhatToPlantNow({ location }: WhatToPlantNowProps) {
  const weatherCallout = usePlantingWeatherNote(location)

  if (!location?.state && !location?.climate) {
    return null
  }

  const currentMonth = getCurrentPlantingMonth()
  const recommendations = getPlantingRecommendationsForMonth(location, currentMonth)
  const messaging = buildPlantingMonthMessaging(location, currentMonth, recommendations)

  const sowList = recommendations.sow.slice(0, PLANTING_CARD_PREVIEW_LIMIT)
  const plantList = recommendations.plant.slice(0, PLANTING_CARD_PREVIEW_LIMIT)
  const hasSuggestions = sowList.length > 0 || plantList.length > 0
  const moreInCalendar =
    recommendations.sow.length > sowList.length ||
    recommendations.plant.length > plantList.length

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          What to plant this month
        </h2>
        <Link
          href={getMonthGuideHref(currentMonth)}
          onClick={() => rememberPlanSegment('month')}
          className="inline-block mt-2 text-xs font-medium text-green-600 hover:text-green-700"
        >
          Full month guide
        </Link>
      </div>

      {messaging && (
        <div className="mb-3 space-y-1">
          <p className="text-sm font-medium text-gray-800">{messaging.monthHeadline}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{messaging.honestyCopy}</p>
        </div>
      )}

      <PlantingWeatherNote callout={weatherCallout} />

      {hasSuggestions ? (
        <div>
          <FrostDeferredPlantHint names={recommendations.frostDeferredPlant} className="mb-3" />
          <div className="border-t border-gray-100 pt-3">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <PlantingPreviewSection label="Sow" items={sowList} />
              <PlantingPreviewSection label="Plant" items={plantList} />
            </div>
            <Link
              href="/my-garden"
              className="inline-block mt-3 text-xs font-medium text-green-600 hover:text-green-700"
            >
              Add plants
            </Link>
          </div>

          {messaging && moreInCalendar && (
            <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
              {messaging.totalUnique} options for {currentMonth} in the full month guide
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-3">
          <p className="text-sm text-gray-600">Not much to plant this time of year.</p>
          <p className="text-xs text-gray-400 mt-1">Check back next month.</p>
          <Link
            href={getMonthGuideHref(currentMonth)}
            onClick={() => rememberPlanSegment('month')}
            className="inline-block mt-3 text-xs font-medium text-green-600 hover:text-green-700"
          >
            Full month guide
          </Link>
        </div>
      )}
    </div>
  )
}
