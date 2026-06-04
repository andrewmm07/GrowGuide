'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CALENDAR_PLANT_DETAILS } from '@/app/data/planting-calendar/plant-details'
import { resolveCalendarPlantName } from '@/app/data/planting-calendar/helpers'
import { buildPlantCareGuide, maintenanceLevelLabel } from '@/app/components/planting-calendar/plantCareGuide'
import {
  buildPlantIssuesGuide,
  issueCategoryLabel,
} from '@/app/components/planting-calendar/plantIssuesGuide'
import { GuideCard } from '@/app/components/planting-calendar/month-guide-ui'

const sectionTitleClass = 'text-sm font-semibold text-gray-800 mb-3'
const fieldLabelClass = 'text-xs font-medium text-gray-500'
const fieldValueClass = 'text-sm text-gray-700'

interface CalendarPlantModalProps {
  plant: string | null
  activityType: 'sow' | 'plant'
  isOpen: boolean
  onClose: () => void
}

type Tab = 'overview' | 'care' | 'issues'

function getMaintenanceColor(level: string) {
  switch (level) {
    case 'low':
      return 'text-gray-600'
    case 'medium':
      return 'text-gray-700'
    case 'high':
      return 'text-gray-800'
    default:
      return 'text-gray-600'
  }
}

export default function CalendarPlantModal({
  plant,
  activityType,
  isOpen,
  onClose,
}: CalendarPlantModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const detailKey = plant ? resolveCalendarPlantName(plant) : null
  const plantDetails = detailKey ? CALENDAR_PLANT_DETAILS[detailKey] : null

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('overview')
      return
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen || !plant || !plantDetails) return null

  const careGuide = buildPlantCareGuide(plantDetails)
  const issuesGuide = buildPlantIssuesGuide(plantDetails)

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    {
      id: 'care',
      label: 'Care guide',
      count: careGuide.careInstructions.length + careGuide.stages.length,
    },
    {
      id: 'issues',
      label: 'Issues',
      count: issuesGuide.issues.length,
    },
  ]

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-plant-modal-title"
    >
      <div
        id="calendar-plant-modal"
        className="bg-white w-full sm:max-w-lg sm:mx-4 h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col rounded-none sm:rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2 pb-1 sm:hidden shrink-0" aria-hidden>
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <div className="px-4 sm:px-5 pt-2 sm:pt-4 pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    activityType === 'sow'
                      ? 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'
                      : 'bg-gray-50 text-gray-900 ring-1 ring-gray-200'
                  }`}
                >
                  {activityType === 'sow' ? 'Sow' : 'Plant'}
                </span>
              </div>
              <h2
                id="calendar-plant-modal-title"
                className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight"
              >
                {plantDetails.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-2 -mr-1 rounded-full hover:bg-gray-100 text-gray-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{plantDetails.description}</p>
        </div>

        <div className="flex border-b border-gray-200 px-2 sm:px-4 shrink-0 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-3 text-sm font-medium border-b-2 -mb-px min-h-[48px] transition-colors ${
                activeTab === tab.id
                  ? 'border-gray-800 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 ${
                    activeTab === tab.id ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 pt-4"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <GuideCard className="border-l-[3px] border-l-gray-400">
                  <h3 className={sectionTitleClass}>Growing</h3>
                  <dl className="space-y-2.5">
                    <div>
                      <dt className={fieldLabelClass}>Spacing</dt>
                      <dd className={fieldValueClass}>
                        Seeds {plantDetails.seedSpacing} · Rows {plantDetails.rowSpacing}
                      </dd>
                    </div>
                    <div>
                      <dt className={fieldLabelClass}>Height</dt>
                      <dd className={fieldValueClass}>{plantDetails.matureHeight}</dd>
                    </div>
                    <div>
                      <dt className={fieldLabelClass}>To harvest</dt>
                      <dd className={fieldValueClass}>{plantDetails.timeToHarvest}</dd>
                    </div>
                    <div>
                      <dt className={fieldLabelClass}>Frost</dt>
                      <dd className={fieldValueClass}>
                        {plantDetails.frostTolerant ? 'Tolerant' : 'Not tolerant'}
                      </dd>
                    </div>
                    <div>
                      <dt className={fieldLabelClass}>Maintenance</dt>
                      <dd className={`text-sm capitalize ${getMaintenanceColor(plantDetails.maintenance)}`}>
                        {plantDetails.maintenance}
                      </dd>
                    </div>
                  </dl>
                </GuideCard>

                <GuideCard className="border-l-[3px] border-l-gray-300">
                  <h3 className={sectionTitleClass}>Care</h3>
                  <dl className="space-y-2.5">
                    <div>
                      <dt className={fieldLabelClass}>Soil</dt>
                      <dd className={fieldValueClass}>{plantDetails.soil}</dd>
                    </div>
                    <div>
                      <dt className={fieldLabelClass}>Watering</dt>
                      <dd className={fieldValueClass}>{plantDetails.watering}</dd>
                    </div>
                    <div>
                      <dt className={fieldLabelClass}>Sunlight</dt>
                      <dd className={fieldValueClass}>{plantDetails.sunlight}</dd>
                    </div>
                  </dl>
                </GuideCard>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-3">
              <GuideCard className="border-l-[3px] border-l-gray-400">
                <h3 className={sectionTitleClass}>When to plant</h3>
                <dl className="space-y-2.5">
                  <div>
                    <dt className={fieldLabelClass}>Timing</dt>
                    <dd className={fieldValueClass}>{careGuide.plantingTime}</dd>
                  </div>
                  <div>
                    <dt className={fieldLabelClass}>Growing</dt>
                    <dd className={fieldValueClass}>{careGuide.growingInfo}</dd>
                  </div>
                  <div>
                    <dt className={fieldLabelClass}>To harvest</dt>
                    <dd className={fieldValueClass}>{careGuide.timeToHarvest}</dd>
                  </div>
                  <div>
                    <dt className={fieldLabelClass}>Effort</dt>
                    <dd className={fieldValueClass}>{maintenanceLevelLabel(careGuide.maintenanceLevel)}</dd>
                  </div>
                </dl>
              </GuideCard>

              <GuideCard className="border-l-[3px] border-l-gray-400">
                <h3 className={sectionTitleClass}>What to do</h3>
                <ol className="space-y-3 list-none pl-0 m-0">
                  {careGuide.careInstructions.map((instruction, i) => (
                    <li key={instruction} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold">
                        {i + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </GuideCard>

              {careGuide.stages.map((stage) => (
                <GuideCard key={stage.stage} className="border-l-[3px] border-l-gray-300">
                  <h3 className={sectionTitleClass}>{stage.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{stage.subtitle}</p>
                  <ul className="space-y-2.5 list-none pl-0 m-0">
                    {stage.tasks.map((task) => (
                      <li key={task} className="text-sm text-gray-700 leading-relaxed flex gap-2">
                        <span className="text-gray-400 shrink-0 mt-0.5" aria-hidden>
                          ·
                        </span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </GuideCard>
              ))}
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="space-y-3">
              {issuesGuide.issues.map((issue) => (
                <div
                  key={issue.name}
                  className="bg-white border border-gray-200 shadow-sm border-l-[3px] border-l-gray-400 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm">{issue.name}</h3>
                    <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 ring-1 ring-gray-200">
                      {issueCategoryLabel(issue.category)}
                    </span>
                  </div>
                  <dl className="space-y-2.5 text-sm">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Symptoms</dt>
                      <dd className="text-gray-700">{issue.symptoms}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Fix</dt>
                      <dd className="text-gray-700">{issue.solution}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
