'use client'

import type { ReactNode } from 'react'

interface PlanPageShellProps {
  children: ReactNode
  /** Outer background — defaults to app gray; pages can pass a gradient class. */
  className?: string
  /** Month guide uses a wider desktop column. */
  wide?: boolean
}

/**
 * Shared width and padding for Plan routes on mobile (segment nav lives in MainLayout).
 */
export default function PlanPageShell({
  children,
  className = 'bg-gray-50 md:bg-transparent',
  wide = false,
}: PlanPageShellProps) {
  const widthClass = wide
    ? 'max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-7xl'
    : 'max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl'

  return (
    <div className={`min-h-full md:min-h-screen ${className}`}>
      <div
        className={`w-full mx-auto px-4 sm:px-6 py-4 md:py-8 pb-4 md:pb-8 ${widthClass}`}
      >
        {children}
      </div>
    </div>
  )
}
