'use client'

import Link from 'next/link'
import type { NotificationRow } from '@/lib/notificationTypes'

function typeLabel(type: NotificationRow['type']): string {
  switch (type) {
    case 'planting':
      return 'Planting'
    case 'weekend_tasks':
      return 'Weekend tasks'
    case 'weather':
      return 'Weather'
    default:
      return 'Update'
  }
}

interface Props {
  items: NotificationRow[]
  loading: boolean
  onMarkRead: (id: string) => void
  compact?: boolean
}

export default function NotificationInboxList({
  items,
  loading,
  onMarkRead,
  compact = false,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-2 animate-pulse p-3">
        <div className="h-14 bg-gray-100 rounded-xl" />
        <div className="h-14 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500 px-3 py-6 text-center">
        No notifications yet. Enable tips in Settings — Tuesday planting and Friday tasks appear
        here when there’s something useful to say.
      </p>
    )
  }

  const list = compact ? items.slice(0, 8) : items

  return (
    <ul className="divide-y divide-gray-100">
      {list.map((n) => {
        const unread = !n.read_at
        const href = n.data?.deepLink ?? '/dashboard'
        return (
          <li key={n.id}>
            <Link
              href={href}
              onClick={() => {
                if (unread) onMarkRead(n.id)
              }}
              className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${
                unread ? 'bg-green-50/40' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  {typeLabel(n.type)}
                </span>
                {unread && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden />
                )}
              </div>
              <p className="text-sm font-medium text-gray-900">{n.title}</p>
              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.body}</p>
              <p className="text-[10px] text-gray-400 mt-1">
                {new Date(n.sent_at).toLocaleDateString('en-AU', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
