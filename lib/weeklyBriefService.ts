/**
 * Weekly brief service
 * Calculates actionable garden activities for the week ahead
 * Handles urgency prioritization and activity filtering
 */

import {
  activityDueDate,
  daysUntilActivity,
  getActionableActivities,
} from '@/lib/plantCareSchedule'

export interface WeeklyActivity {
  id: string
  plantName: string
  activity: string
  details: string
  category: 'fertilizing' | 'pest' | 'planting' | 'pruning' | 'harvest'
  dueDate: Date
  daysUntil: number
  urgency: 'critical' | 'recommended' | 'optional'
  reason?: string
}

export interface WeeklyBrief {
  weekStart: Date
  weekEnd: Date
  critical: WeeklyActivity[]
  recommended: WeeklyActivity[]
  optional: WeeklyActivity[]
  plantCount: number
  totalActions: number
}

/**
 * Determine urgency level based on activity type and timing
 */
function calculateUrgency(
  category: string,
  daysUntil: number,
  daysAfterPlanting: number,
  totalDays: number
): { urgency: 'critical' | 'recommended' | 'optional'; reason: string } {
  // Harvest activities within the harvest window = critical
  if (category === 'harvest') {
    if (daysUntil <= 7) {
      return { urgency: 'critical', reason: 'Harvest window closing' }
    }
    if (daysUntil <= 14) {
      return { urgency: 'recommended', reason: 'Upcoming harvest' }
    }
    return { urgency: 'optional', reason: 'Future harvest' }
  }

  // Pest management within narrow window = critical
  if (category === 'pest') {
    if (daysUntil <= 5) {
      return { urgency: 'critical', reason: 'Peak pest window' }
    }
    if (daysUntil <= 14) {
      return { urgency: 'recommended', reason: 'Pest prevention window' }
    }
    return { urgency: 'optional', reason: 'Future concern' }
  }

  // Planting/support tasks with tight timing = critical
  if (category === 'planting' && daysUntil <= 7) {
    return { urgency: 'critical', reason: 'Time-critical planting/setup' }
  }

  // Everything within 14 days = recommended
  if (daysUntil <= 14) {
    return { urgency: 'recommended', reason: `Due in ${daysUntil} days` }
  }

  // Beyond 14 days = optional
  return { urgency: 'optional', reason: 'Future task' }
}

/**
 * Build weekly brief from garden plants
 */
export function buildWeeklyBrief(
  plants: any[],
  fromDate: Date = new Date()
): WeeklyBrief {
  const weekStart = new Date(fromDate)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1)) // Monday

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6) // Sunday

  const allActivities: WeeklyActivity[] = []
  const plantSet = new Set<string>()

  plants.forEach((plant) => {
    if (plant.isHarvested) return
    if (!plant.fullSchedule?.activities?.length) return

    plantSet.add(plant.name)
    const activities = getActionableActivities(plant)

    activities.forEach((act, idx) => {
      const activityDate = activityDueDate(plant, act)
      const daysUntil = daysUntilActivity(plant, act, fromDate)

      const isWithinWindow = daysUntil >= -1 && daysUntil <= 14
      if (!isWithinWindow) return

      const { urgency, reason } = calculateUrgency(
        act.category,
        daysUntil,
        act.daysSincePlanting,
        plant.fullSchedule.totalDays || 60
      )

      allActivities.push({
        id: `${plant.id}-${idx}`,
        plantName: plant.name,
        activity: act.activity,
        details: act.details,
        category: act.category as WeeklyActivity['category'],
        dueDate: activityDate,
        daysUntil: Math.max(0, daysUntil),
        urgency,
        reason,
      })
    })
  })

  // Sort by urgency, then by days until
  const sortedActivities = allActivities.sort((a, b) => {
    const urgencyOrder = { critical: 0, recommended: 1, optional: 2 }
    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
    if (urgencyDiff !== 0) return urgencyDiff
    return a.daysUntil - b.daysUntil
  })

  // Group by urgency
  const critical = sortedActivities.filter(a => a.urgency === 'critical')
  const recommended = sortedActivities.filter(a => a.urgency === 'recommended')
  const optional = sortedActivities.filter(a => a.urgency === 'optional')

  return {
    weekStart,
    weekEnd,
    critical,
    recommended,
    optional,
    plantCount: plantSet.size,
    totalActions: allActivities.length,
  }
}

/** Dashboard card preview cap — full list lives on /weekly-brief. */
export const WEEKLY_BRIEF_PREVIEW_LIMIT = 5

/** Qualitative load label (no counts) for weekly brief header. */
export function getWeeklyBriefLoadLabel(taskCount: number): string | null {
  if (taskCount <= 0) return null
  if (taskCount <= 2) return 'Light week'
  if (taskCount <= 5) return 'A few tasks'
  if (taskCount <= 9) return 'Busy week'
  return 'Packed week'
}

/** Short load word for weekend push copy (e.g. "You have a busy weekend"). */
export function getWeekendLoadAdjective(taskCount: number): string | null {
  if (taskCount <= 0) return null
  if (taskCount <= 2) return 'light'
  if (taskCount <= 5) return 'steady'
  if (taskCount <= 9) return 'busy'
  return 'full'
}

/** Tasks due within the next 7 days — matches weekly brief page grouping. */
export function getBriefTasksDueThisWeek(brief: WeeklyBrief): WeeklyActivity[] {
  return [...brief.critical, ...brief.recommended, ...brief.optional]
    .filter((a) => a.daysUntil <= 7)
    .sort((a, b) => {
      const urgencyOrder = { critical: 0, recommended: 1, optional: 2 }
      const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
      if (urgencyDiff !== 0) return urgencyDiff
      return a.daysUntil - b.daysUntil
    })
}

/**
 * Format date for display (e.g., "Wed 3 Jul")
 */
export function formatActivityDate(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
}

/**
 * Get urgency color classes
 */
export function getUrgencyColor(urgency: 'critical' | 'recommended' | 'optional') {
  const colors = {
    critical: {
      bg: 'var(--color-background-danger)',
      text: 'var(--color-text-danger)',
      label: 'Critical',
    },
    recommended: {
      bg: 'var(--color-background-warning)',
      text: 'var(--color-text-warning)',
      label: 'Recommended',
    },
    optional: {
      bg: 'var(--color-background-secondary)',
      text: 'var(--color-text-secondary)',
      label: 'Optional',
    },
  }
  return colors[urgency]
}

/**
 * Get icon for activity category
 */
export function getCategoryIcon(category: string): string {
  const icons: { [key: string]: string } = {
    harvest: 'ti-plant-2',
    pest: 'ti-bug',
    planting: 'ti-leaf',
    pruning: 'ti-scissors',
    fertilizing: 'ti-leaf',
  }
  return icons[category] || 'ti-circle'
}
