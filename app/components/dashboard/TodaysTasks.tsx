'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'

interface PlantSchedule {
  week: number;
  activity: string;
  details: string;
  completed: boolean;
  dueDate: string;
  category: 'planting' | 'fertilizing' | 'pruning' | 'pest' | 'harvest' | 'climate';
}

interface GardenPlant {
  name: string;
  datePlanted: string;
  type: 'seed' | 'seedling';
  location?: string;
  notes?: string;
  estimatedHarvest: string;
  schedule: PlantSchedule[];
  isHarvested?: boolean;
  harvestedDate?: string;
}

interface CustomTask {
  id: string;
  activity: string;
  details: string;
  completed: boolean;
  dueDate: string;
  category: string;
  priority: string;
  projectId?: string;
  createdAt: string;
}

interface TaskDisplay {
  id: string;
  activity: string;
  details?: string;
  completed: boolean;
  source: 'custom' | 'system';
  plantName?: string;
  customTaskId?: string;
}

export default function TodaysTasks() {
  const { user } = useAuth()
  const [customTasks, setCustomTasks] = useState<TaskDisplay[]>([])
  const [suggestionTasks, setSuggestionTasks] = useState<TaskDisplay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const loadTodaysTasks = () => {
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayStr = today.toISOString().split('T')[0]
        
        const allCustomTasks: TaskDisplay[] = []
        const allSuggestionTasks: TaskDisplay[] = []

        // Load custom tasks from localStorage
        const savedCustomTasks = localStorage.getItem('customTasks')
        if (savedCustomTasks) {
          const customTasksList: CustomTask[] = JSON.parse(savedCustomTasks)
          customTasksList.forEach((task) => {
            // Normalize dueDate - handle both ISO and date-only formats
            let taskDate = task.dueDate
            if (task.dueDate && !task.dueDate.includes('T')) {
              taskDate = new Date(task.dueDate + 'T00:00:00').toISOString().split('T')[0]
            } else if (task.dueDate) {
              taskDate = new Date(task.dueDate).toISOString().split('T')[0]
            }

            if (taskDate === todayStr && !task.completed) {
              allCustomTasks.push({
                id: task.id,
                activity: task.activity,
                details: task.details,
                completed: task.completed,
                source: 'custom',
                customTaskId: task.id
              })
            }
          })
        }

        // Load system tasks (GrowGuide suggestions) from plant schedule
        const savedGarden = localStorage.getItem('myGarden')
        if (savedGarden) {
          const gardenPlants: GardenPlant[] = JSON.parse(savedGarden)
          const activePlants = gardenPlants.filter((plant: GardenPlant) => !plant.isHarvested)

          activePlants.forEach((plant) => {
            if (plant.schedule && Array.isArray(plant.schedule)) {
              plant.schedule.forEach((task, taskIndex) => {
                // Normalize dueDate
                let taskDate = task.dueDate
                if (task.dueDate && !task.dueDate.includes('T')) {
                  taskDate = new Date(task.dueDate + 'T00:00:00').toISOString().split('T')[0]
                } else if (task.dueDate) {
                  taskDate = new Date(task.dueDate).toISOString().split('T')[0]
                }

                if (taskDate === todayStr && !task.completed) {
                  allSuggestionTasks.push({
                    id: `${plant.name}-${plant.datePlanted}-${taskIndex}`,
                    activity: task.activity,
                    details: task.details,
                    completed: task.completed,
                    source: 'system',
                    plantName: plant.name
                  })
                }
              })
            }
          })
        }

        // Sort and limit to first 3
        setCustomTasks(allCustomTasks.slice(0, 3))
        setSuggestionTasks(allSuggestionTasks.slice(0, 3))
      } catch (error) {
        console.error('Error loading today\'s tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTodaysTasks()
  }, [user])

  const getTotalCustomTasks = () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStr = today.toISOString().split('T')[0]
      
      const savedCustomTasks = localStorage.getItem('customTasks')
      if (!savedCustomTasks) return 0

      const customTasksList: CustomTask[] = JSON.parse(savedCustomTasks)
      return customTasksList.filter((task) => {
        let taskDate = task.dueDate
        if (task.dueDate && !task.dueDate.includes('T')) {
          taskDate = new Date(task.dueDate + 'T00:00:00').toISOString().split('T')[0]
        } else if (task.dueDate) {
          taskDate = new Date(task.dueDate).toISOString().split('T')[0]
        }
        return taskDate === todayStr && !task.completed
      }).length
    } catch {
      return 0
    }
  }

  const getTotalSuggestionTasks = () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStr = today.toISOString().split('T')[0]
      
      const savedGarden = localStorage.getItem('myGarden')
      if (!savedGarden) return 0

      const gardenPlants: GardenPlant[] = JSON.parse(savedGarden)
      const activePlants = gardenPlants.filter((plant: GardenPlant) => !plant.isHarvested)
      
      let count = 0
      activePlants.forEach((plant) => {
        if (plant.schedule && Array.isArray(plant.schedule)) {
          plant.schedule.forEach((task) => {
            let taskDate = task.dueDate
            if (task.dueDate && !task.dueDate.includes('T')) {
              taskDate = new Date(task.dueDate + 'T00:00:00').toISOString().split('T')[0]
            } else if (task.dueDate) {
              taskDate = new Date(task.dueDate).toISOString().split('T')[0]
            }
            if (taskDate === todayStr && !task.completed) {
              count++
            }
          })
        }
      })
      return count
    } catch {
      return 0
    }
  }

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>
  }

  const totalCustom = getTotalCustomTasks()
  const totalSuggestions = getTotalSuggestionTasks()
  const hasAnyTasks = totalCustom > 0 || totalSuggestions > 0

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Today's Tasks</h2>
        <Link 
          href="/tasks"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          View All Tasks
        </Link>
      </div>

      {!hasAnyTasks ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Lucky you - no new tasks are due today!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Custom Tasks Section */}
          {totalCustom > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">My Tasks</h3>
                {totalCustom > 3 && (
                  <Link 
                    href="/tasks"
                    className="text-xs text-green-600 hover:text-green-700"
                  >
                    View {totalCustom - 3} more
                  </Link>
                )}
              </div>
              <div className="space-y-2">
                {customTasks.map(task => (
                  <div 
                    key={task.id}
                    className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                        {task.activity}
                      </p>
                      {task.details && (
                        <p className="text-xs text-gray-500 mt-0.5">{task.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GrowGuide Suggestions Section */}
          {totalSuggestions > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">GrowGuide Suggestions</h3>
                {totalSuggestions > 3 && (
                  <Link 
                    href="/tasks?view=growguide-suggestions"
                    className="text-xs text-green-600 hover:text-green-700"
                  >
                    View {totalSuggestions - 3} more
                  </Link>
                )}
              </div>
              <div className="space-y-2">
                {suggestionTasks.map(task => (
                  <div 
                    key={task.id}
                    className="flex items-start gap-3 p-2 bg-green-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                        {task.activity}
                      </p>
                      {task.details && (
                        <p className="text-xs text-gray-500 mt-0.5">{task.details}</p>
                      )}
                      {task.plantName && (
                        <p className="text-xs text-gray-500 mt-0.5">🌱 {task.plantName}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
