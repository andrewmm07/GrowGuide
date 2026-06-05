'use client'

import { useState } from 'react'
import { PlantDetails } from '../types/plants'

interface PlantModalProps {
  plant: PlantDetails | null
  isOpen: boolean
  onClose: () => void
}

type Tab = 'overview' | 'care' | 'issues' | 'maintenance'

export function PlantModal({ plant, isOpen, onClose }: PlantModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  if (!plant || !isOpen) return null

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'care', label: 'Care' },
    { id: 'issues', label: 'Issues' },
    { id: 'maintenance', label: 'Maintenance' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl sm:mx-4 max-h-[92vh] flex flex-col">
        <div className="flex justify-between items-center px-5 pt-5 pb-3 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{plant.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{plant.plantingTime}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex border-b border-gray-200 px-5 flex-shrink-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {activeTab === 'overview' && (
            <>
              <p className="text-gray-700 text-sm leading-relaxed">{plant.description}</p>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Growing Info</h3>
                <p className="text-sm text-gray-700">{plant.growingInfo}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-green-700 font-medium mb-1">Spacing</p>
                  <p className="text-sm text-gray-800">Seeds: {plant.seedSpacing}</p>
                  <p className="text-sm text-gray-800">Rows: {plant.rowSpacing}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-700 font-medium mb-1">Harvest</p>
                  <p className="text-sm text-gray-800">{plant.timeToHarvest}</p>
                  <p className="text-sm text-gray-800">Height: {plant.matureHeight}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-amber-700 font-medium mb-1">Frost Tolerant</p>
                  <p className="text-sm text-gray-800">{plant.frostTolerant ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </>
          )}
          {activeTab === 'care' && (
            <ul className="space-y-3">
              {plant.careInstructions.map((instruction, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {instruction}
                </li>
              ))}
            </ul>
          )}
          {activeTab === 'issues' && (
            <div className="space-y-4">
              {plant.commonIssues.map((issue, i) => (
                <div key={i} className="rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="font-semibold text-red-800 mb-2">{issue.name}</p>
                  <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Symptoms:</span> {issue.symptoms}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">Solution:</span> {issue.solution}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              {plant.maintenanceTasks.map((stage, i) => (
                <div key={i} className="rounded-xl bg-gray-50 p-4">
                  <p className="font-semibold text-gray-800 capitalize mb-2">{stage.stage} Stage</p>
                  <ul className="space-y-1.5">
                    {stage.tasks.map((task, j) => (
                      <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">&#10003;</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
