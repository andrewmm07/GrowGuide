'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import {
  fetchNotificationPreferences,
  saveNotificationPreferences,
} from '@/app/lib/notificationsDb'
import type { NotificationPreferences } from '@/lib/notificationTypes'
import { DEFAULT_NOTIFICATION_PREFS } from '@/lib/notificationTypes'
import { registerAndSaveDevicePushToken } from '@/lib/push/nativePush'
import { isRemotePushConfigured } from '@/lib/push/remotePushAvailable'
import { Capacitor } from '@capacitor/core'

export function useNotificationPreferences() {
  const { user, userLocation } = useAuth()
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const load = useCallback(async (options?: { silent?: boolean }) => {
    if (!user?.id) {
      setPrefs(DEFAULT_NOTIFICATION_PREFS)
      if (!options?.silent) setLoading(false)
      return
    }
    if (!options?.silent) setLoading(true)
    try {
      const next = await fetchNotificationPreferences(user.id)
      setPrefs(next)
    } finally {
      if (!options?.silent) setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    load()
  }, [load])

  const updatePrefs = useCallback(
    async (patch: Partial<NotificationPreferences>) => {
      if (!user?.id) return
      setSaveError(null)

      const next: NotificationPreferences = {
        ...(prefs ?? DEFAULT_NOTIFICATION_PREFS),
        ...patch,
      }
      setPrefs(next)

      setSaving(true)
      try {
        await saveNotificationPreferences(user.id, next, userLocation)
        if (next.notificationsEnabled && user.id) {
          window.dispatchEvent(
            new CustomEvent('growguide-notification-prefs-changed', {
              detail: { enabled: true },
            })
          )
          const pushResult = await registerAndSaveDevicePushToken(user.id)
          if (pushResult === 'denied') {
            setSaveError(
              'Notifications saved, but this device blocked push permission. Allow notifications in Android settings.'
            )
          } else if (pushResult === 'skipped' && Capacitor.getPlatform() === 'android' && !isRemotePushConfigured()) {
            setSaveError(
              'In-app settings saved. Server push needs google-services.json in android/app/ and NEXT_PUBLIC_FCM_CONFIGURED=true, then rebuild.'
            )
          } else if (pushResult === 'error') {
            setSaveError(
              'Notifications saved, but push registration failed. Rebuild the app with google-services.json and try again.'
            )
          }
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Could not save notification settings'
        setSaveError(message)
        try {
          const restored = await fetchNotificationPreferences(user.id)
          setPrefs(restored)
        } catch {
          /* keep optimistic state if re-fetch fails */
        }
      } finally {
        setSaving(false)
      }
    },
    [user?.id, userLocation, prefs]
  )

  return { prefs, loading, saving, saveError, updatePrefs, reload: load }
}
