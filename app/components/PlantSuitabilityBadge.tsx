'use client'

import {
  gardenStatusFromAssessment,
  recommendedActionWarnings,
  seasonalTimingLabel,
  statusBadgeClasses,
  statusBadgeLabel,
  type GardenStatusBadge,
  type PlantSuitabilityAssessment,
} from '@/lib/plantSuitabilityService'
import { PERENNIAL_PLANTING_TOOLTIP } from '@/lib/perennialPlanting'

interface PlantSuitabilityBadgeProps {
  assessment: PlantSuitabilityAssessment
  className?: string
}

/** Single compact status for My Garden rows */
export function PlantSuitabilityBadge({ assessment, className = '' }: PlantSuitabilityBadgeProps) {
  const badge: GardenStatusBadge = gardenStatusFromAssessment(assessment)
  if (badge === 'on_track') return null

  return (
    <span
      title={badge === 'perennial' ? PERENNIAL_PLANTING_TOOLTIP : undefined}
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border ${statusBadgeClasses(badge)} ${className}`}
    >
      {statusBadgeLabel(badge)}
    </span>
  )
}

interface PlantSuitabilityInsightProps {
  assessment: PlantSuitabilityAssessment
}

export function PlantSuitabilityInsight({ assessment }: PlantSuitabilityInsightProps) {
  const warnings = recommendedActionWarnings(assessment)
  const { insight } = assessment

  if (!warnings && !insight?.tip) return null

  return (
    <div className="rounded border border-gray-200 bg-white px-2 py-1.5 text-[11px] text-gray-700 space-y-1 leading-snug">
      {warnings?.timing && (
        <p>
          <span className="font-semibold text-gray-800">Timing: </span>
          {warnings.timing}
        </p>
      )}
      {warnings?.climate && (
        <p>
          <span className="font-semibold text-gray-800">Climate: </span>
          {warnings.climate}
        </p>
      )}
      {!warnings &&
        !assessment.isPerennial &&
        assessment.seasonalTiming !== 'ideal' &&
        assessment.seasonalTiming !== 'good' && (
          <p className="text-gray-600">{seasonalTimingLabel(assessment.seasonalTiming)}</p>
        )}
      {assessment.isPerennial && assessment.insight?.tip && (
        <p className="text-gray-600">{assessment.insight.tip}</p>
      )}
      {insight?.tip && !warnings?.timing && !warnings?.climate && (
        <p className="text-gray-600">{insight.tip}</p>
      )}
    </div>
  )
}

export default PlantSuitabilityBadge
