import type { PlantingMonth } from '@/lib/planting/types'
import { getCurrentPlantingMonth } from '@/lib/plantingRecommendations'

export type PlanSegment = 'week' | 'month' | 'year'

const PLAN_SEGMENT_STORAGE_KEY = 'growguide-plan-segment'

/** Next.js `trailingSlash: true` serves `/planting-calendar/` for the year view. */
export function normalizePlanPathname(pathname: string | null | undefined): string | null {
  if (!pathname) return null
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

export function isPlanRoute(pathname: string | null | undefined): boolean {
  return getPlanSegment(pathname) !== null
}

export function getPlanSegment(pathname: string | null | undefined): PlanSegment | null {
  const path = normalizePlanPathname(pathname)
  if (!path) return null
  if (path === '/weekly-brief' || path.startsWith('/weekly-brief/')) return 'week'
  if (path === '/planting-calendar') return 'year'
  if (path.startsWith('/planting-calendar/')) return 'month'
  return null
}

export function getMonthGuideHref(month: PlantingMonth): string {
  return `/planting-calendar/${month.toLowerCase()}`
}

export function getCurrentMonthCalendarHref(): string {
  return getMonthGuideHref(getCurrentPlantingMonth())
}

/** Month segment target: keep viewed month when already on a month page. */
export function getMonthSegmentHref(pathname: string | null | undefined): string {
  const path = normalizePlanPathname(pathname)
  if (path?.startsWith('/planting-calendar/')) {
    const slug = path.split('/')[2]
    if (slug) return `/planting-calendar/${slug.toLowerCase()}`
  }
  return getCurrentMonthCalendarHref()
}

export function getStoredPlanSegment(): PlanSegment {
  if (typeof window === 'undefined') return 'month'
  try {
    const value = localStorage.getItem(PLAN_SEGMENT_STORAGE_KEY)
    if (value === 'week' || value === 'month' || value === 'year') return value
  } catch {
    // ignore storage errors
  }
  return 'month'
}

export function setStoredPlanSegment(segment: PlanSegment): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PLAN_SEGMENT_STORAGE_KEY, segment)
  } catch {
    // ignore storage errors
  }
}

export function getHrefForPlanSegment(segment: PlanSegment): string {
  switch (segment) {
    case 'week':
      return '/weekly-brief'
    case 'month':
      return getCurrentMonthCalendarHref()
    case 'year':
      return '/planting-calendar'
  }
}

export function getPlanTabHref(): string {
  return getHrefForPlanSegment(getStoredPlanSegment())
}

/** Persist segment before leaving dashboard (or elsewhere) for a plan deep link. */
export function rememberPlanSegment(segment: PlanSegment): void {
  setStoredPlanSegment(segment)
}

export function isSidebarPlanItemActive(
  segment: PlanSegment,
  pathname: string | null | undefined
): boolean {
  return getPlanSegment(pathname) === segment
}

export function isSidebarHrefActive(href: string, pathname: string | null | undefined): boolean {
  const path = normalizePlanPathname(pathname)
  const normalizedHref = normalizePlanPathname(href)
  if (!path || !normalizedHref) return false
  if (normalizedHref === '/planting-calendar') return path === '/planting-calendar'
  return path === normalizedHref || path.startsWith(`${normalizedHref}/`)
}
