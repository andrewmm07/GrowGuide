'use client'

import { useState } from 'react'
import Link from 'next/link'
import MonthGuidancePanel from '@/app/components/planting-calendar/MonthGuidancePanel'
import MonthPicker from '@/app/components/planting-calendar/MonthPicker'
import MonthSection from '@/app/components/planting-calendar/MonthSection'
import FrostDeferredPlantHint from '@/app/components/planting-calendar/FrostDeferredPlantHint'
import CalendarPlantModal from '@/app/components/planting-calendar/CalendarPlantModal'
import {
  AvoidDotList,
  DotList,
  GuideCard,
  SectionLabel,
  SubsectionLabel,
} from '@/app/components/planting-calendar/month-guide-ui'
import type { MonthGuidance } from '@/app/data/planting-calendar/month-guidance-types'
import type { PlantingMonth } from '@/lib/plantingRecommendations'

interface WeeklyGuide {
  week: number
  sow: string[]
  plant: string[]
  tasks: string[]
}

interface NoNos {
  mistakes: string[]
  warnings: string[]
  commonErrors: string[]
}

interface MonthGuideViewProps {
  monthSlug: string
  monthTitle: PlantingMonth
  season: string
  locationLabel?: string
  overview?: string
  monthGuidance: MonthGuidance | null
  guideSow: string[]
  guidePlant: string[]
  frostDeferredPlant?: string[]
  weeklyGuide: WeeklyGuide[]
  noNos: NoNos
  weekDateRange: (weekNum: number) => string
  weekProgress: (weekNum: number) => string
}

function PlantChip({
  name,
  type,
  onClick,
}: {
  name: string
  type: 'sow' | 'plant'
  onClick: () => void
}) {
  const styles =
    type === 'sow'
      ? 'bg-gray-100 text-gray-800 ring-1 ring-gray-200 hover:bg-gray-200 active:bg-gray-300'
      : 'bg-gray-50 text-gray-900 ring-1 ring-gray-200 hover:bg-gray-100 active:bg-gray-200'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left text-sm leading-snug px-3 py-1.5 rounded-lg min-h-[36px] ${styles}`}
    >
      {name}
    </button>
  )
}

function WeeklyWeekBlock({
  week,
  isCurrent,
  weekDateRange,
}: {
  week: WeeklyGuide
  isCurrent: boolean
  weekDateRange: string
}) {
  const lines: string[] = []
  if (week.sow.length > 0) {
    lines.push(`Sow: ${week.sow.join(', ')}`)
  }
  if (week.plant.length > 0) {
    lines.push(`Plant: ${week.plant.join(', ')}`)
  }
  lines.push(...week.tasks)

  return (
    <div className="py-2.5 first:pt-0">
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span
          className={`text-sm font-semibold ${isCurrent ? 'text-gray-900' : 'text-gray-800'}`}
        >
          Week {week.week}
          {isCurrent && (
            <span className="ml-1.5 text-[10px] font-medium text-gray-500">· now</span>
          )}
        </span>
        <span className="text-xs text-gray-400 shrink-0">{weekDateRange}</span>
      </div>
      {lines.length > 0 ? (
        <DotList items={lines} />
      ) : (
        <p className="text-sm text-gray-500">Nothing scheduled this week.</p>
      )}
    </div>
  )
}

export default function MonthGuideView({
  monthSlug,
  monthTitle,
  season,
  locationLabel,
  overview,
  monthGuidance,
  guideSow,
  guidePlant,
  frostDeferredPlant,
  weeklyGuide,
  noNos,
  weekDateRange,
  weekProgress,
}: MonthGuideViewProps) {
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [weeklyOpen, setWeeklyOpen] = useState(false)
  const [noNosOpen, setNoNosOpen] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<'sow' | 'plant'>('sow')
  const [modalOpen, setModalOpen] = useState(false)

  const openPlantModal = (name: string, type: 'sow' | 'plant') => {
    setSelectedPlant(name)
    setSelectedType(type)
    setModalOpen(true)
  }

  const hasNoNos =
    noNos.mistakes.length > 0 || noNos.warnings.length > 0 || noNos.commonErrors.length > 0

  const contextLine = [season, locationLabel].filter(Boolean).join(' · ')

  return (
    <div className="space-y-3 md:space-y-4">
      <Link
        href="/planting-calendar"
        className="hidden md:inline-flex items-center text-sm text-gray-700 hover:text-gray-900"
      >
        ← Year calendar
      </Link>

      <GuideCard className="!py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{monthTitle}</h1>
            {contextLine ? (
              <p className="text-sm text-gray-600 mt-0.5 leading-snug">{contextLine}</p>
            ) : null}
          </div>
          <div className="relative shrink-0">
            <MonthPicker
              currentMonth={monthSlug}
              open={showMonthPicker}
              onToggle={() => setShowMonthPicker((v) => !v)}
              onClose={() => setShowMonthPicker(false)}
            />
          </div>
        </div>
      </GuideCard>

      {monthGuidance && (
        <GuideCard>
          <MonthGuidancePanel
            guidance={monthGuidance}
            overview={overview}
            variant="guide"
            hideAvoid={hasNoNos}
          />
        </GuideCard>
      )}

      <GuideCard className="space-y-4">
        <div>
          <SectionLabel>Sow</SectionLabel>
          <FrostDeferredPlantHint names={frostDeferredPlant} className="mb-2" />
          {guideSow.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {guideSow.map((crop) => (
                <PlantChip
                  key={crop}
                  name={crop}
                  type="sow"
                  onClick={() => openPlantModal(crop, 'sow')}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nothing recommended to sow this month.</p>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <SectionLabel>Plant out</SectionLabel>
          {guidePlant.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {guidePlant.map((crop) => (
                <PlantChip
                  key={crop}
                  name={crop}
                  type="plant"
                  onClick={() => openPlantModal(crop, 'plant')}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nothing recommended to plant out this month.</p>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <Link
            href="/my-garden"
            className="inline-flex text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Add Plants to My Garden
          </Link>
        </div>
      </GuideCard>

      <MonthSection title="Weekly plan" isOpen={weeklyOpen} onToggle={() => setWeeklyOpen((v) => !v)}>
        <div className="space-y-0 divide-y divide-gray-100 pt-1">
          {guideSow.length === 0 && guidePlant.length === 0 && (
            <p className="text-sm text-gray-500 pb-2">
              No sow or plant recommendations for this month.
            </p>
          )}
          {weeklyGuide.map((week) => (
            <WeeklyWeekBlock
              key={week.week}
              week={week}
              isCurrent={weekProgress(week.week) === 'Current Week'}
              weekDateRange={weekDateRange(week.week)}
            />
          ))}
        </div>
      </MonthSection>

      {hasNoNos && (
        <MonthSection title="Avoid" isOpen={noNosOpen} onToggle={() => setNoNosOpen((v) => !v)}>
          <div className="pt-1 divide-y divide-gray-100">
            {noNos.mistakes.length > 0 && (
              <div className="pt-4 first:pt-0">
                <SubsectionLabel>Mistakes</SubsectionLabel>
                <AvoidDotList items={noNos.mistakes} />
              </div>
            )}
            {noNos.warnings.length > 0 && (
              <div className="pt-4 first:pt-0">
                <SubsectionLabel>Watch for</SubsectionLabel>
                <AvoidDotList items={noNos.warnings} />
              </div>
            )}
            {noNos.commonErrors.length > 0 && (
              <div className="pt-4 first:pt-0">
                <SubsectionLabel>Common errors</SubsectionLabel>
                <AvoidDotList items={noNos.commonErrors} />
              </div>
            )}
          </div>
        </MonthSection>
      )}

      <p className="text-center text-[10px] text-gray-400 pt-1" aria-label="UI build marker">
        UI grey-4
      </p>

      <CalendarPlantModal
        plant={selectedPlant}
        activityType={selectedType}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
