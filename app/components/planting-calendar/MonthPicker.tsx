'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { rememberPlanSegment } from '@/lib/planNavigation'

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
] as const

const MONTH_NAMES: Record<(typeof MONTHS)[number], string> = {
  january: 'January',
  february: 'February',
  march: 'March',
  april: 'April',
  may: 'May',
  june: 'June',
  july: 'July',
  august: 'August',
  september: 'September',
  october: 'October',
  november: 'November',
  december: 'December',
}

interface MonthPickerProps {
  currentMonth: string
  open: boolean
  onToggle: () => void
  onClose: () => void
}

function MonthLink({
  monthKey,
  currentMonth,
  onNavigate,
  className,
}: {
  monthKey: (typeof MONTHS)[number]
  currentMonth: string
  onNavigate: () => void
  className: string
}) {
  const isActive = currentMonth.toLowerCase() === monthKey
  return (
    <Link
      href={`/planting-calendar/${monthKey}`}
      onClick={() => {
        rememberPlanSegment('month')
        onNavigate()
      }}
      aria-current={isActive ? 'page' : undefined}
      className={className}
    >
      {MONTH_NAMES[monthKey]}
    </Link>
  )
}

export default function MonthPicker({
  currentMonth,
  open,
  onToggle,
  onClose,
}: MonthPickerProps) {
  const pathname = usePathname()
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    onCloseRef.current()
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.month-picker-root')) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onClose])

  const activeMonthClass =
    'bg-gray-100 text-gray-900 font-semibold ring-1 ring-gray-200'
  const inactiveMonthClass =
    'bg-gray-50 text-gray-700 hover:bg-gray-100'

  return (
    <div className="month-picker-root">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-sm min-h-[44px]"
      >
        <span className="text-gray-700 font-medium hidden sm:inline">Other months</span>
        <span className="text-gray-700 font-medium sm:hidden">Months</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mobile: bottom sheet above nav bar */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20"
          onClick={onClose}
        >
          <div
            className="absolute bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl rounded-t-2xl px-4 pt-4 pb-5 max-h-[70vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
            onClick={(e) => e.stopPropagation()}
            role="listbox"
            aria-label="Choose month"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-900 mb-3">Jump to month</p>
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((monthKey) => (
                <MonthLink
                  key={monthKey}
                  monthKey={monthKey}
                  currentMonth={currentMonth}
                  onNavigate={onClose}
                  className={`flex items-center justify-center rounded-xl px-2 py-3 text-sm text-center min-h-[44px] transition-colors ${
                    currentMonth.toLowerCase() === monthKey
                      ? activeMonthClass
                      : inactiveMonthClass
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop: dropdown */}
      {open && (
        <div className="hidden md:block absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {MONTHS.map((monthKey) => (
            <MonthLink
              key={monthKey}
              monthKey={monthKey}
              currentMonth={currentMonth}
              onNavigate={onClose}
              className={`block px-4 py-2 text-sm transition-colors ${
                currentMonth.toLowerCase() === monthKey
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
