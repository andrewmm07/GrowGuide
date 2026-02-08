'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { MONTH_DETAILS } from '../../data/months'

interface WeeklyTask {
  task: string
  plant: string
  date: string
  plantedDate: string
  growthStage: 'seed' | 'seedling'
  details: string
  category: 'planting' | 'fertilizing' | 'pruning' | 'pest' | 'harvest' | 'climate'
}

interface GardenPlant {
  name: string
  datePlanted: string
  type: 'seed' | 'seedling'
  activityType: 'sow' | 'plant'
  schedule?: { dueDate: string; activity: string; details: string; category: string }[]
}

const WeeklyCalendar = () => {
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek())
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>([])
  const [expandedPlants, setExpandedPlants] = useState<Set<string>>(new Set())
  
  const togglePlant = (plantName: string) => {
    setExpandedPlants(prev => {
      const next = new Set(prev)
      if (next.has(plantName)) {
        next.delete(plantName)
      } else {
        next.add(plantName)
      }
      return next
    })
  }

  const dateRange = getDateRangeForWeek(selectedWeek)
  const weeklyTasks = getWeeklyTasks(gardenPlants, selectedWeek)

  // Load garden plants on mount
  useEffect(() => {
    const existingGarden = localStorage.getItem('myGarden')
    if (existingGarden) {
      setGardenPlants(JSON.parse(existingGarden))
    }
  }, [])

  // Group tasks by plant AND type
  const groupedTasks = weeklyTasks.reduce((acc, task) => {
    const groupKey = `${task.plant}-${task.growthStage}`
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(task)
    return acc
  }, {} as { [key: string]: WeeklyTask[] })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      <Sidebar />
      <div className="flex-1">
        <div className="py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Garden Maintenance Schedule</h1>
              <p className="text-gray-600">Weekly garden tasks and maintenance activities</p>
            </div>

            {/* Week Selector */}
            <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-md">
              <button 
                onClick={() => setSelectedWeek(prev => Math.max(1, prev - 1))}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-center">
                <h2 className="text-xl font-medium text-gray-800">{dateRange}</h2>
                <p className="text-sm text-gray-500 mt-1">Week {selectedWeek} of {new Date().getFullYear()}</p>
              </div>
              <button 
                onClick={() => setSelectedWeek(prev => Math.min(52, prev + 1))}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Enhanced Tasks List */}
            <div className="grid gap-6">
              {Object.keys(groupedTasks).length > 0 ? (
                Object.entries(groupedTasks).map(([groupKey, tasks]) => {
                  const [plantName, growthStage] = groupKey.split('-')
                  const harvestDate = calculateHarvestDate(tasks[0].plantedDate, plantName)
                  
                  return (
                    <div key={groupKey} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <button 
                        onClick={() => togglePlant(groupKey)}
                        className="w-full text-left bg-gradient-to-r from-green-50 to-white border-b border-gray-100 p-6 hover:bg-green-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold text-gray-800">
                                {plantName} 
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                  ({growthStage})
                                </span>
                              </h2>
                              <div className="flex items-center gap-4 mt-1">
                                <p className="text-sm text-gray-500">{tasks.length} tasks this week</p>
                                <span className="text-sm text-green-600">
                                  Harvest around {harvestDate}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {expandedPlants.has(groupKey) ? 'Hide' : 'Show'} Tasks
                            </span>
                            <svg 
                              className={`w-5 h-5 text-gray-400 transform transition-transform ${
                                expandedPlants.has(groupKey) ? 'rotate-180' : ''
                              }`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </button>

                      {/* Tasks - now collapsible */}
                      <div className={`transition-all duration-200 ease-in-out ${
                        expandedPlants.has(groupKey) 
                          ? 'max-h-[1000px] opacity-100' 
                          : 'max-h-0 opacity-0 overflow-hidden'
                      }`}>
                        <div className="divide-y divide-gray-50">
                          {tasks.map((task, index) => (
                            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start gap-4 pl-16">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-2 h-2 rounded-full flex-shrink-0 bg-amber-500" />
                                  <div>
                                    <p className="text-gray-700">{task.task}</p>
                                  </div>
                                </div>
                                <button 
                                  className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600"
                                  title="Mark as complete"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-600 font-medium">No Tasks Scheduled</h3>
                  <p className="text-gray-500 text-sm mt-2">No maintenance tasks scheduled for this week</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getCurrentWeek(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  const oneWeek = 1000 * 60 * 60 * 24 * 7
  return Math.ceil(diff / oneWeek)
}

function getDateRangeForWeek(weekNumber: number): string {
  const year = new Date().getFullYear()
  const firstDayOfYear = new Date(year, 0, 1)
  const startDate = new Date(firstDayOfYear.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000)
  const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000)
  
  return `${startDate.toLocaleDateString('en-GB', { 
    day: 'numeric',
    month: 'short'
  })} - ${endDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })}`
}

function getWeeklyTasks(plants: GardenPlant[], currentWeek: number): WeeklyTask[] {
  const tasks: WeeklyTask[] = []
  
  plants.forEach(plant => {
    if (!plant.schedule) return

    // Get tasks that are due this week
    const weekTasks = plant.schedule.filter(task => {
      const taskDate = new Date(task.dueDate)
      const taskWeek = getWeekNumber(taskDate)
      return taskWeek === currentWeek
    })

    // Add this week's tasks
    tasks.push(...weekTasks.map(task => ({
      task: task.activity,
      plant: plant.name,
      date: getDateRangeForWeek(currentWeek),
      plantedDate: plant.datePlanted,
      growthStage: plant.type,
      details: task.details,
      category: task.category as 'planting' | 'fertilizing' | 'pruning' | 'pest' | 'harvest' | 'climate'
    })))
  })

  return tasks
}

// Helper function to get week number from date
function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1)
  const diff = date.getTime() - start.getTime()
  const oneWeek = 1000 * 60 * 60 * 24 * 7
  return Math.ceil(diff / oneWeek)
}

function calculateHarvestDate(plantedDate: string, plantName: string): string {
  const planted = new Date(plantedDate)
  // You would need to get this from your plant data
  const daysToHarvest = 90 // Default to 90 days if not specified
  
  const harvestDate = new Date(planted)
  harvestDate.setDate(harvestDate.getDate() + daysToHarvest)
  
  return harvestDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })
}

export default WeeklyCalendar 