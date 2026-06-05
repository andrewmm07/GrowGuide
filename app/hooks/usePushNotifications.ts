'use client'

import { useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { fetchNotificationPreferences } from '@/app/lib/notificationsDb'
import {
  isNativePushEnvironment,
  registerAndSaveDevicePushToken,
} from '@/lib/push/nativePush'
import { canRegisterRemotePush } from '@/lib/push/remotePushAvailable'

/**
 * When notifications are already enabled, register this device for FCM on app open.
 * Turning notifications on in Settings also triggers registration (see useNotificationPreferences).
 */
export function usePushNotifications() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.id || !isNativePushEnvironment() || !canRegisterRemotePush()) return

    let cancelled = false

    ;(async () => {
      try {
        const prefs = await fetchNotificationPreferences(user.id)
        if (cancelled || !prefs.notificationsEnabled) return
        await registerAndSaveDevicePushToken(user.id)
      } catch (e) {
        console.warn('usePushNotifications', e)
      }
    })()

    const onPrefsChanged = (ev: Event) => {
      const detail = (ev as CustomEvent<{ enabled?: boolean }>).detail
      if (!detail?.enabled || cancelled) return
      registerAndSaveDevicePushToken(user.id).catch((e) =>
        console.warn('usePushNotifications', e)
      )
    }
    window.addEventListener('growguide-notification-prefs-changed', onPrefsChanged)

    return () => {
      cancelled = true
      window.removeEventListener('growguide-notification-prefs-changed', onPrefsChanged)
    }
  }, [user?.id])
}
