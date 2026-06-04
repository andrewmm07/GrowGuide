'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  getCurrentMonthCalendarHref,
  getMonthSegmentHref,
  getPlanSegment,
  setStoredPlanSegment,
  type PlanSegment,
} from '@/lib/planNavigation'

const SEGMENTS: { id: PlanSegment; label: string; hrefFor: (pathname: string | null) => string }[] = [
  { id: 'week', label: 'This week', hrefFor: () => '/weekly-brief' },
  { id: 'month', label: 'This month', hrefFor: getMonthSegmentHref },
  { id: 'year', label: 'Year', hrefFor: () => '/planting-calendar' },
]

export default function PlanSegmentNav() {
  const pathname = usePathname()
  const active = getPlanSegment(pathname)
  const [monthHref, setMonthHref] = useState(getCurrentMonthCalendarHref)

  useEffect(() => {
    setMonthHref(getCurrentMonthCalendarHref())
  }, [])

  useEffect(() => {
    if (active) setStoredPlanSegment(active)
  }, [active])

  if (!active) return null

  return (
    <nav
      aria-label="Plan views"
      className="md:hidden flex-shrink-0 px-3 py-2 bg-white border-b border-gray-100"
    >
      <div className="flex rounded-lg bg-gray-100 p-0.5 gap-0.5">
        {SEGMENTS.map((segment) => {
          const href =
            segment.id === 'month'
              ? getPlanSegment(pathname) === 'month'
                ? getMonthSegmentHref(pathname)
                : monthHref
              : segment.hrefFor(pathname)
          const isActive = active === segment.id

          return (
            <Link
              key={segment.id}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 text-center py-2 px-1 rounded-md text-xs font-semibold transition-colors min-h-[40px] flex items-center justify-center ${
                isActive
                  ? 'bg-white text-gray-900 md:shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {segment.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
