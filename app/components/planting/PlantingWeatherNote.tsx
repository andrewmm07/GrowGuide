'use client'

import { useId } from 'react'
import type { PlantingWeatherCallout } from '@/lib/plantingWeatherGuidance'
import { plantingWeatherCalloutLabel } from '@/lib/weeklyGuidanceWeatherTone'

interface PlantingWeatherNoteProps {
  callout: PlantingWeatherCallout | null
  className?: string
  /** Adds a divider above the callout to separate it from static month copy. */
  separated?: boolean
}

function WeatherCalloutIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
      />
    </svg>
  )
}

export default function PlantingWeatherNote({
  callout,
  className = 'mb-3',
  separated = true,
}: PlantingWeatherNoteProps) {
  const labelId = useId()

  if (!callout) return null

  const { note, tone } = callout
  const label = plantingWeatherCalloutLabel(tone)

  return (
    <div className={className}>
      {separated && <div className="border-t border-gray-100 mb-3" aria-hidden />}
      <div
        role="status"
        aria-labelledby={labelId}
        className="rounded-lg border border-sky-200 border-l-4 border-l-sky-500 bg-sky-50 px-3 py-2.5"
      >
        <div className="flex gap-2.5">
          <span className="flex-shrink-0 text-sky-600 mt-0.5">
            <WeatherCalloutIcon />
          </span>
          <div className="min-w-0 flex-1">
            <p id={labelId} className="text-xs font-semibold text-sky-900">
              {label}
            </p>
            <p className="text-xs text-sky-950 leading-relaxed mt-1">{note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
