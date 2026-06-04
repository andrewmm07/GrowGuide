'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import {
  getCurrentMonthCalendarHref,
  isSidebarHrefActive,
  isSidebarPlanItemActive,
} from '@/lib/planNavigation'

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const iconClass = 'w-5 h-5 flex-shrink-0'

function NavIcon({ d }: { d: string }) {
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  )
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { logout, user, loading } = useAuth()
  const [monthHref, setMonthHref] = useState('/planting-calendar')

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { onMobileClose?.() }, [pathname, onMobileClose])
  useEffect(() => {
    setMonthHref(getCurrentMonthCalendarHref())
  }, [])

  const primaryNav = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <NavIcon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    },
    {
      name: 'My Garden',
      href: '/my-garden',
      icon: <NavIcon d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />,
    },
  ]

  const planNav = [
    {
      name: 'Weekly Brief',
      href: '/weekly-brief',
      segment: 'week' as const,
      icon: <NavIcon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
    {
      name: 'Monthly Guide',
      href: monthHref,
      segment: 'month' as const,
      icon: <NavIcon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    },
    {
      name: 'Year Calendar',
      href: '/planting-calendar',
      segment: 'year' as const,
      icon: <NavIcon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
  ]

  const handleLogout = async () => {
    try { await logout() } catch (error) { console.error('Logout error:', error) }
  }

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 transition-colors ${
      active
        ? 'bg-gray-100 text-gray-900 border-r-4 border-gray-400'
        : 'text-gray-700 hover:bg-gray-50'
    }`

  const renderNavSections = (collapsed: boolean) => (
    <>
      {primaryNav.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={navLinkClass(isSidebarHrefActive(item.href, pathname))}
          title={collapsed ? item.name : undefined}
        >
          {item.icon}
          {!collapsed && <span>{item.name}</span>}
        </Link>
      ))}

      {!collapsed && (
        <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          Plan
        </p>
      )}
      {planNav.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={navLinkClass(isSidebarPlanItemActive(item.segment, pathname))}
          title={collapsed ? item.name : undefined}
        >
          {item.icon}
          {!collapsed && <span>{item.name}</span>}
        </Link>
      ))}

      <Link
        href="/settings"
        className={navLinkClass(isSidebarHrefActive('/settings', pathname))}
        title={collapsed ? 'Settings' : undefined}
      >
        <NavIcon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        {!collapsed && <span>Settings</span>}
      </Link>
    </>
  )

  const logoutButton = (collapsed: boolean) => (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50 rounded-md transition-colors ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? 'Log out' : undefined}
    >
      <NavIcon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      {!collapsed && <span>Log Out</span>}
    </button>
  )

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b flex-shrink-0">
          <span className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <span className="text-2xl">🌱</span>
            GrowGuide
          </span>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="py-4 flex-1 overflow-y-auto">{renderNavSections(false)}</nav>
        {mounted && !loading && user && (
          <div className="border-t border-gray-200 p-4 flex-shrink-0">
            {logoutButton(false)}
          </div>
        )}
      </aside>

      <aside className={`hidden md:flex relative bg-white border-r transition-all duration-300 flex-col h-full ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 p-1 bg-white border rounded-full shadow-sm hover:bg-gray-50 z-10"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <nav className="py-4 flex-1 overflow-y-auto">{renderNavSections(isCollapsed)}</nav>
        {mounted && !loading && user && (
          <div className="border-t border-gray-200 p-4 flex-shrink-0">
            {logoutButton(isCollapsed)}
          </div>
        )}
      </aside>
    </>
  )
}
