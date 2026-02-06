'use client'

import { PlantDetails } from '../types/plants'

interface PlantModalProps {
  plant: PlantDetails | null
  isOpen: boolean
  onClose: () => void
}

export function PlantModal({ plant, isOpen, onClose }: PlantModalProps) {
  if (!plant || !isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold">{plant.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Description */}
          <section>
            <p className="text-gray-700">{plant.description}</p>
          </section>

          {/* Growing Info */}
          <section>
            <h3 className="text-lg font-medium mb-2">Growing Information</h3>
            <p className="text-gray-700">{plant.growingInfo}</p>
          </section>

          {/* Planting Time */}
          <section>
            <h3 className="text-lg font-medium mb-2">When to Plant</h3>
            <p className="text-gray-700">{plant.plantingTime}</p>
          </section>

          {/* Key Details */}
          <section>
            <h3 className="text-lg font-medium mb-2">Key Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Spacing</p>
                <p className="text-gray-700">Seeds: {plant.seedSpacing}</p>
                <p className="text-gray-700">Rows: {plant.rowSpacing}</p>
              </div>
              <div>
                <p className="font-medium">Height</p>
                <p className="text-gray-700">{plant.matureHeight}</p>
              </div>
              <div>
                <p className="font-medium">Time to Harvest</p>
                <p className="text-gray-700">{plant.timeToHarvest}</p>
              </div>
              <div>
                <p className="font-medium">Frost Tolerant</p>
                <p className="text-gray-700">{plant.frostTolerant ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </section>

          {/* Care Instructions */}
          <section>
            <h3 className="text-lg font-medium mb-2">Care Instructions</h3>
            <ul className="list-disc list-inside space-y-1">
              {plant.careInstructions.map((instruction, index) => (
                <li key={index} className="text-gray-700">{instruction}</li>
              ))}
            </ul>
          </section>

          {/* Common Issues */}
          <section>
            <h3 className="text-lg font-medium mb-2">Common Issues</h3>
            <div className="space-y-4">
              {plant.commonIssues.map((issue, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium">{issue.name}</p>
                  <p className="text-gray-700"><span className="font-medium">Symptoms:</span> {issue.symptoms}</p>
                  <p className="text-gray-700"><span className="font-medium">Solution:</span> {issue.solution}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Maintenance Tasks */}
          <section>
            <h3 className="text-lg font-medium mb-2">Maintenance Guide</h3>
            <div className="space-y-4">
              {plant.maintenanceTasks.map((stage, index) => (
                <div key={index}>
                  <p className="font-medium capitalize">{stage.stage} Stage</p>
                  <ul className="list-disc list-inside">
                    {stage.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-gray-700">{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 