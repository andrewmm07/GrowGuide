'use client'

import { SectionLabel } from './month-guide-ui'

interface MonthSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

/** Collapsible section — same label style as static guide sections. */
export default function MonthSection({ title, isOpen, onToggle, children }: MonthSectionProps) {
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-3 text-left hover:bg-gray-50 transition-colors min-h-[44px]"
      >
        <SectionLabel as="span">{title}</SectionLabel>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-3.5 pb-3.5 pt-0 border-t border-gray-100">{children}</div>
      )}
    </div>
  )
}
