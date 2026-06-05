'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { PlantInfo } from '@/app/types/plants'
import { type GardenLocation } from '@/app/types/location'
import { formatGrowingContextLabel, resolveLocationContext } from '@/lib/microclimate/resolve'
import {
  getMonthSeason,
  getRichMonthOverviewForLocation,
} from '@/app/data/planting-calendar/helpers'
import { PLANTING_CALENDAR_MONTHS } from '@/app/data/planting-calendar/constants'
import CalendarPlantModal from '@/app/components/planting-calendar/CalendarPlantModal'
import PlanPageHeader from '@/app/components/layouts/PlanPageHeader'
import { getCurrentPlantingMonth } from '@/lib/plantingRecommendations'
import type { PlantingMonth } from '@/lib/planting/types'
import type { UserLocation } from '@/lib/types/location'

const MONTH_SHORT: Record<PlantingMonth, string> = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sep',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec',
}

function monthAnchorId(month: string) {
  return `guide-month-${month.toLowerCase()}`
}

function MonthNav({
  activeMonth,
  onJump,
}: {
  activeMonth: PlantingMonth
  onJump: (month: PlantingMonth) => void
}) {
  return (
    <nav
      aria-label="Jump to month"
      className="sticky top-0 z-10 mb-2 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm p-1.5 shadow-sm"
    >
      <div className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PLANTING_CALENDAR_MONTHS.map((month) => {
          const isActive = month === activeMonth
          return (
            <button
              key={month}
              type="button"
              data-month={month}
              onClick={() => onJump(month)}
              aria-current={isActive ? 'true' : undefined}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[36px] md:min-h-[40px] whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {MONTH_SHORT[month]}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function MonthCard({
  month,
  activities,
  state,
  userLocation,
  isCurrentMonth,
  onPlantClick,
}: {
  month: PlantingMonth
  activities: PlantInfo[]
  state: string
  userLocation: UserLocation | null
  isCurrentMonth: boolean
  onPlantClick: (name: string, type: 'sow' | 'plant') => void
}) {
  const [showFullOverview, setShowFullOverview] = useState(false)
  const sow = activities.filter((a) => a.type === 'sow')
  const plant = activities.filter((a) => a.type === 'plant')
  const overview = getRichMonthOverviewForLocation(userLocation, month, state)
  const season = getMonthSeason(month)

  return (
    <article
      id={monthAnchorId(month)}
      className={`scroll-mt-3 md:scroll-mt-[4.25rem] bg-white rounded-xl overflow-hidden ${
        isCurrentMonth ? 'ring-2 ring-gray-500 shadow-md' : 'ring-1 ring-gray-200 shadow-sm'
      }`}
    >
      <Link
        href={`/planting-calendar/${month.toLowerCase()}`}
        className={`flex items-center justify-between px-4 py-3 ${
          isCurrentMonth
            ? 'bg-gray-800 hover:bg-gray-700'
            : 'bg-slate-700 hover:bg-slate-600'
        } transition-colors`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-base font-bold text-white">{month}</h3>
          {isCurrentMonth && (
            <span className="text-[10px] font-bold uppercase bg-white text-gray-800 px-1.5 py-0.5 rounded">
              Now
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 text-white/90 text-sm">
          <span className="font-medium">{season}</span>
          <span aria-hidden>›</span>
        </div>
      </Link>

      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Overview</h4>
        <p
          className={`text-sm text-gray-600 leading-relaxed ${
            showFullOverview ? '' : 'line-clamp-3'
          }`}
        >
          {overview}
        </p>
        {overview.length > 180 ? (
          <button
            type="button"
            onClick={() => setShowFullOverview((prev) => !prev)}
            className="mt-2 text-xs font-semibold text-gray-700 hover:text-gray-900"
          >
            {showFullOverview ? 'Read less' : 'Read more'}
          </button>
        ) : null}
      </div>

      <div className="px-4 py-3 space-y-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-gray-500 shrink-0" />
            <span className="text-xs font-bold uppercase text-gray-800">Sow</span>
            {sow.length > 0 && (
              <span className="text-xs text-gray-600">({sow.length})</span>
            )}
          </div>
          {sow.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {sow.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  onClick={() => onPlantClick(a.name, 'sow')}
                  className="text-left text-xs leading-snug px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-800 ring-1 ring-gray-200 hover:bg-gray-200 active:bg-gray-300 min-h-[36px]"
                >
                  {a.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">—</p>
          )}
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
            <span className="text-xs font-bold uppercase text-gray-800">Plant</span>
            {plant.length > 0 && (
              <span className="text-xs text-gray-600">({plant.length})</span>
            )}
          </div>
          {plant.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {plant.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  onClick={() => onPlantClick(a.name, 'plant')}
                  className="text-left text-xs leading-snug px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-900 ring-1 ring-gray-200 hover:bg-gray-100 active:bg-gray-200 min-h-[36px]"
                >
                  {a.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">—</p>
          )}
        </div>
      </div>
    </article>
  )
}

export interface PlantingGuideYearViewProps {
  location: GardenLocation
  userLocation: UserLocation | null
  plantingGuide: Record<string, PlantInfo[]>
}

export default function PlantingGuideYearView({
  location,
  userLocation,
  plantingGuide,
}: PlantingGuideYearViewProps) {
  const currentMonth = getCurrentPlantingMonth()
  const [activeMonth, setActiveMonth] = useState<PlantingMonth>(currentMonth)
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<'sow' | 'plant'>('sow')
  const [modalOpen, setModalOpen] = useState(false)

  const contextLabel = userLocation
    ? (() => {
        const ctx = resolveLocationContext(userLocation)
        return ctx ? formatGrowingContextLabel(ctx) : location.climateZone
      })()
    : location.climateZone

  const scrollToMonth = useCallback((month: PlantingMonth) => {
    document.getElementById(monthAnchorId(month))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveMonth(month)
  }, [])

  useEffect(() => {
    setActiveMonth(currentMonth)
    const frame = requestAnimationFrame(() => {
      document.getElementById(monthAnchorId(currentMonth))?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [currentMonth])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!top?.target.id?.startsWith('guide-month-')) return
        const slug = top.target.id.replace('guide-month-', '')
        const m = PLANTING_CALENDAR_MONTHS.find((x) => x.toLowerCase() === slug)
        if (m) setActiveMonth(m)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
    )
    PLANTING_CALENDAR_MONTHS.forEach((month) => {
      const el = document.getElementById(monthAnchorId(month))
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <PlanPageHeader
        eyebrow="Year calendar"
        title="Planting guide"
        subtitle={
          <>
            <p className="text-xs text-gray-500">
              {location.city}, {location.state} · {contextLabel}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              A year-round guide for when to plant in {location.city || 'your area'}
            </p>
          </>
        }
        actions={
          <Link href="/location-select" className="text-xs font-medium text-gray-700 hover:text-gray-900">
            Change
          </Link>
        }
        className="mb-3"
      />

      <MonthNav activeMonth={activeMonth} onJump={scrollToMonth} />

      <div className="mt-3 space-y-3 pb-10">
        {PLANTING_CALENDAR_MONTHS.map((month) => (
          <MonthCard
            key={month}
            month={month}
            activities={plantingGuide[month] || []}
            state={location.state}
            userLocation={userLocation}
            isCurrentMonth={month === currentMonth}
            onPlantClick={(name, type) => {
              setSelectedPlant(name)
              setSelectedType(type)
              setModalOpen(true)
            }}
          />
        ))}
      </div>

      <CalendarPlantModal
        plant={selectedPlant}
        activityType={selectedType}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
