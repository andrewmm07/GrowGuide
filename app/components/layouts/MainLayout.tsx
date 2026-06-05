'use client'
import { usePathname } from 'next/navigation'
import Sidebar from '../Sidebar'
import Header from '../Header'
import BottomNav from '../BottomNav'
import PlanSegmentNav from '../PlanSegmentNav'
import NotificationBell from '../notifications/NotificationBell'
import { usePushNotifications } from '@/app/hooks/usePushNotifications'
import { isPlanRoute } from '@/lib/planNavigation'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  usePushNotifications()
  const pathname = usePathname()
  // Auth + landing pages have no chrome
  const isBarePage =
    pathname === '/' ||
    pathname?.startsWith('/location-select') ||
    pathname === '/setup-name' ||
    (pathname?.startsWith('/auth') ?? false)

  if (isBarePage) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Desktop header (hidden on mobile — bottom nav takes over) */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile header — logo only, no hamburger */}
      <div className="md:hidden h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 flex-shrink-0">
        <span className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-xl">🌱</span>
          GrowGuide
        </span>
        <NotificationBell />
      </div>

      {isPlanRoute(pathname) && <PlanSegmentNav />}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar only */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Content — extra bottom padding on mobile for the nav bar */}
        <main className="flex-1 overflow-y-auto bg-gray-50 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
