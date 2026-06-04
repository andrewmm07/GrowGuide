import type { MonthGuidance } from '@/app/data/planting-calendar/month-guidance-types'
import { DotList, nestedSectionLabelClass, SectionLabel } from './month-guide-ui'

interface MonthGuidancePanelProps {
  guidance: MonthGuidance
  /** Rich state-specific paragraph; replaces focus when provided. */
  overview?: string
  /** Dashboard: focus + top tasks only */
  compact?: boolean
  /** Month guide page layout */
  variant?: 'default' | 'guide'
  /** Hide avoid list when shown in a dedicated section below */
  hideAvoid?: boolean
  className?: string
}

export default function MonthGuidancePanel({
  guidance,
  overview,
  compact = false,
  variant = 'default',
  hideAvoid = false,
  className = '',
}: MonthGuidancePanelProps) {
  const tasks = compact ? guidance.tasks.slice(0, 3) : guidance.tasks
  const risks = compact ? guidance.risks?.slice(0, 2) : guidance.risks
  const avoid = compact ? guidance.avoid?.slice(0, 2) : guidance.avoid
  const showAvoid = !compact && !hideAvoid && avoid && avoid.length > 0
  const isGuide = variant === 'guide'

  if (isGuide) {
    const body = overview ?? guidance.focus
    const hasSubsections = tasks.length > 0 || (risks && risks.length > 0) || showAvoid

    return (
      <div className={`space-y-0 ${className}`}>
        <SectionLabel>Overview</SectionLabel>
        <p className="text-sm text-gray-600 leading-relaxed">{body}</p>

        {hasSubsections && (
          <div className="mt-5 pt-4 border-t border-gray-200 divide-y divide-gray-100">
            {tasks.length > 0 && (
              <div className="pt-4 first:pt-0">
                <SectionLabel className={nestedSectionLabelClass}>Do this month</SectionLabel>
                <DotList items={tasks} />
              </div>
            )}

            {risks && risks.length > 0 && (
              <div className="pt-4 first:pt-0">
                <SectionLabel className={nestedSectionLabelClass}>Watch</SectionLabel>
                <DotList items={risks} />
              </div>
            )}

            {showAvoid && (
              <div className="pt-4 first:pt-0">
                <SectionLabel className={nestedSectionLabelClass}>Avoid</SectionLabel>
                <DotList items={avoid!} />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {overview ? (
        <>
          <SectionLabel>Overview</SectionLabel>
          <p className="text-sm text-gray-700 leading-relaxed">{overview}</p>
        </>
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed">{guidance.focus}</p>
      )}

      {tasks.length > 0 && (
        <div>
          <SectionLabel>{compact ? 'Top tasks' : 'Tasks'}</SectionLabel>
          <DotList items={tasks} />
        </div>
      )}

      {!compact && risks && risks.length > 0 && (
        <div>
          <SectionLabel>Watch</SectionLabel>
          <DotList items={risks} />
        </div>
      )}

      {showAvoid && (
        <div>
          <SectionLabel>Avoid</SectionLabel>
          <DotList items={avoid!} />
        </div>
      )}
    </div>
  )
}
