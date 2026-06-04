'use client'

/**
 * @deprecated Use useNotificationSync + NotificationBell inbox instead.
 * Kept as a no-op so any stale imports do not schedule browser reminders.
 */
import type { GardenPlant } from '@/app/context/GardenContext'

export function useGardenNotifications(_plants: GardenPlant[]) {
  /* notifications v2: in-app inbox via useNotificationSync */
}
