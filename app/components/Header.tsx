'use client'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import NotificationBell from '@/app/components/notifications/NotificationBell'

interface HeaderProps {
  showMenuButton?: boolean
  onMenuClick?: () => void
}

export default function Header({ showMenuButton = false, onMenuClick }: HeaderProps) {
  const { user } = useAuth()
  const logoHref = user ? '/dashboard' : '/'

  return (
    <header className="h-16 bg-white border-b sticky top-0 z-50">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between max-w-[1920px] mx-auto">
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 -ml-1 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Open navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <Link href={logoHref} className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-semibold text-gray-900">GrowGuide</span>
          </Link>
        </div>
        <NotificationBell />
      </div>
    </header>
  )
}
