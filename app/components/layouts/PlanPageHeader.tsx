import type { ReactNode } from 'react'

interface PlanPageHeaderProps {
  eyebrow: string
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
  className?: string
}

/** Shared title block for Plan routes (week / month / year). */
export default function PlanPageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className = '',
}: PlanPageHeaderProps) {
  return (
    <header className={`space-y-1 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
            {eyebrow}
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-0.5">{title}</h1>
          {subtitle ? <div className="mt-1">{subtitle}</div> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </header>
  )
}
