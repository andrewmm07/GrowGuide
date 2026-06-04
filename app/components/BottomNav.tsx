'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  getHrefForPlanSegment,
  getPlanSegment,
  getPlanTabHref,
  isPlanRoute,
} from '@/lib/planNavigation'

const NAV = [
  {
    label: 'Home',
    href: '/dashboard',
    match: (pathname: string, href: string) =>
      pathname === href || pathname.startsWith(href + '/'),
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-gray-800' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Garden',
    href: '/my-garden',
    match: (pathname: string, href: string) =>
      pathname === href || pathname.startsWith(href + '/'),
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-gray-800' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Plan',
    href: '/planting-calendar',
    match: (pathname: string) => isPlanRoute(pathname),
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-gray-800' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14h6M12 11v6" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/settings',
    match: (pathname: string, href: string) =>
      pathname === href || pathname.startsWith(href + '/'),
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-gray-800' : 'text-gray-400'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [planHref, setPlanHref] = useState('/planting-calendar')

  useEffect(() => {
    setPlanHref(getPlanTabHref())
  }, [])

  useEffect(() => {
    if (isPlanRoute(pathname)) {
      const segment = getPlanSegment(pathname)
      if (segment) setPlanHref(getHrefForPlanSegment(segment))
    } else {
      setPlanHref(getPlanTabHref())
    }
  }, [pathname])

  const navItems = NAV.map((item) =>
    item.label === 'Plan' ? { ...item, href: planHref } : item
  )

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {navItems.map((item) => {
        const active = !!pathname && item.match(pathname, item.href)
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] px-0.5"
          >
            {item.icon(active)}
            <span className={`text-[10px] font-medium text-center leading-tight ${active ? 'text-gray-800' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
