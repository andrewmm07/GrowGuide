'use client'

/**
 * Inbox rows are created by the server cron (`notification-digest` Edge Function).
 * Opening the app only refreshes the bell — no compose/insert on the client.
 */
import { useEffect, useRef } from 'react'
import { useAuth } from '@/app/context/AuthContext'

export function useNotificationSync(enabled = true) {
  const { user } = useAuth()
  const ran = useRef(false)

  useEffect(() => {
    if (!enabled || !user?.id || ran.current) return
    ran.current = true
    window.dispatchEvent(new Event('growguide-notifications-synced'))
  }, [enabled, user?.id])
}
