'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import {
  countUnreadNotifications,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/app/lib/notificationsDb'
import type { NotificationRow } from '@/lib/notificationTypes'

export function useNotificationInbox() {
  const { user } = useAuth()
  const [items, setItems] = useState<NotificationRow[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setItems([])
      setUnreadCount(0)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [list, count] = await Promise.all([
        fetchNotifications(user.id),
        countUnreadNotifications(user.id),
      ])
      setItems(list)
      setUnreadCount(count)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const onSynced = () => refresh()
    window.addEventListener('growguide-notifications-synced', onSynced)
    return () => window.removeEventListener('growguide-notifications-synced', onSynced)
  }, [refresh])

  const markRead = useCallback(
    async (id: string) => {
      if (!user?.id) return
      await markNotificationRead(user.id, id)
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      )
      setUnreadCount((c) => Math.max(0, c - 1))
    },
    [user?.id]
  )

  const markAllRead = useCallback(async () => {
    if (!user?.id) return
    await markAllNotificationsRead(user.id)
    const now = new Date().toISOString()
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? now })))
    setUnreadCount(0)
  }, [user?.id])

  return { items, unreadCount, loading, refresh, markRead, markAllRead }
}
