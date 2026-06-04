'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { useNotificationInbox } from '@/app/hooks/useNotificationInbox'
import NotificationInboxList from '@/app/components/notifications/NotificationInboxList'
import PageContainer from '@/app/components/layouts/PageContainer'
import Link from 'next/link'

export default function NotificationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { items, loading, markRead, markAllRead, unreadCount } = useNotificationInbox()

  useEffect(() => {
    if (!user) router.push('/auth/login')
  }, [user, router])

  return (
    <PageContainer className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllRead()}
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            Mark all read
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500">
        Tuesday planting tips, Friday weekend tasks, and weather warnings when they matter.{' '}
        <Link href="/settings" className="text-green-600 hover:underline">
          Manage in Settings
        </Link>
      </p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <NotificationInboxList items={items} loading={loading} onMarkRead={markRead} />
      </div>
    </PageContainer>
  )
}
