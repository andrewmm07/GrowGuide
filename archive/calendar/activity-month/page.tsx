'use client'

import { useState, useEffect } from 'react'
import { useGarden, GardenPlant } from '@/app/context/GardenContext'
import { useAuth } from '@/app/context/AuthContext'
import { useTasks } from '@/app/hooks/useTasks'
import {
  getCurrentPlantingMonth,
  getPlantingRecommendationsForMonth,
} from '@/lib/plantingRecommendations'
import { getActionableActivities } from '@/lib/plantCareSchedule'

// Complete plant timelines for all plant types
const PLANT_TIMELINES: { [key: string]: any } = {
  'Tomatoes': {
    keyActivities: [
      { timing: 21, activity: 'Fertilise', category: 'fertilizing' },
      { timing: 28, activity: 'Monitor for pests', category: 'pest' },
      { timing: 35, activity: 'Install supports', category: 'planting' },
      { timing: 45, activity: 'Remove suckers', category: 'pruning' },
      { timing: 60, activity: 'Check first fruits', category: 'harvest' }
    ]
  },
  'Beans': {
    keyActivities: [
      { timing: 7, activity: 'Check for germination', category: 'planting' },
      { timing: 14, activity: 'Install trellis', category: 'planting' },
      { timing: 21, activity: 'Start fertilizing', category: 'fertilizing' },
      { timing: 30, activity: 'Monitor for beetles', category: 'pest' },
      { timing: 45, activity: 'Begin harvesting', category: 'harvest' }
    ]
  },
  'Broccoli': {
    keyActivities: [
      { timing: 0, activity: 'Sow seeds 1/2 inch deep', category: 'planting' },
      { timing: 14, activity: 'Thin seedlings to 18 inches', category: 'planting' },
      { timing: 28, activity: 'Apply calcium-rich fertilizer', category: 'fertilizing' },
      { timing: 35, activity: 'Check for cabbage white butterflies', category: 'pest' },
      { timing: 50, activity: 'Remove yellowing lower leaves', category: 'pruning' },
      { timing: 65, activity: 'Monitor head development', category: 'harvest' },
      { timing: 70, activity: 'Harvest before florets separate', category: 'harvest' }
    ]
  },
  'Carrots': {
    keyActivities: [
      { timing: 0, activity: 'Sow seeds 1/4 inch deep', category: 'planting' },
      { timing: 14, activity: 'Thin seedlings to 2 inches', category: 'planting' },
      { timing: 21, activity: 'Apply light balanced fertilizer', category: 'fertilizing' },
      { timing: 30, activity: 'Monitor for carrot rust flies', category: 'pest' },
      { timing: 45, activity: 'Check root size', category: 'harvest' },
      { timing: 60, activity: 'Begin harvesting baby carrots', category: 'harvest' },
      { timing: 75, activity: 'Harvest full-sized carrots', category: 'harvest' }
    ]
  },
  'Cabbage': {
    keyActivities: [
      { timing: 0, activity: 'Sow seeds 1/2 inch deep', category: 'planting' },
      { timing: 14, activity: 'Thin to strongest seedling', category: 'planting' },
      { timing: 28, activity: 'Apply nitrogen-rich fertilizer', category: 'fertilizing' },
      { timing: 42, activity: 'Check for cabbage loopers', category: 'pest' },
      { timing: 60, activity: 'Remove yellowing outer leaves', category: 'pruning' },
      { timing: 75, activity: 'Test head firmness', category: 'harvest' },
      { timing: 85, activity: 'Harvest when firm and full-sized', category: 'harvest' }
    ]
  },
  'Lettuce': {
    keyActivities: [
      { timing: 0, activity: 'Sow seeds 1/8 inch deep', category: 'planting' },
      { timing: 7, activity: 'Thin seedlings to 6 inches', category: 'planting' },
      { timing: 14, activity: 'Fertilise', category: 'fertilizing' },
      { timing: 21, activity: 'Check for slugs and snails', category: 'pest' },
      { timing: 30, activity: 'Begin harvesting outer leaves', category: 'harvest' },
      { timing: 40, activity: 'Monitor for bolting', category: 'pest' }
    ]
  },
  'Peas': {
    keyActivities: [
      { timing: 10, activity: 'Install pea supports', category: 'planting' },
      { timing: 21, activity: 'Check for pea moths', category: 'pest' },
      { timing: 35, activity: 'Guide vines to supports', category: 'pruning' },
      { timing: 50, activity: 'Watch for first flowers', category: 'harvest' },
      { timing: 60, activity: 'Begin harvesting pods', category: 'harvest' }
    ]
  },
  'Peppers': {
    keyActivities: [
      { timing: 21, activity: 'Transplant when 4-6 leaves appear', category: 'planting' },
      { timing: 28, activity: 'Fertilise with calcium-rich', category: 'fertilizing' },
      { timing: 42, activity: 'Check for aphids and mites', category: 'pest' },
      { timing: 60, activity: 'Remove early flower buds', category: 'pruning' },
      { timing: 75, activity: 'Begin harvesting', category: 'harvest' },
      { timing: 90, activity: 'Regular harvesting', category: 'harvest' }
    ]
  },
  'Spinach': {
    keyActivities: [
      { timing: 7, activity: 'Thin to 3-4 inches apart', category: 'planting' },
      { timing: 14, activity: 'Apply nitrogen-rich fertilizer', category: 'fertilizing' },
      { timing: 21, activity: 'Check for leaf miners', category: 'pest' },
      { timing: 30, activity: 'Begin harvesting outer leaves', category: 'harvest' },
      { timing: 35, activity: 'Monitor for flowering stems', category: 'pruning' }
    ]
  },
  'Zucchini': {
    keyActivities: [
      { timing: 14, activity: 'Thin to strongest plants', category: 'planting' },
      { timing: 21, activity: 'Apply balanced organic fertilizer', category: 'fertilizing' },
      { timing: 35, activity: 'Monitor for squash bugs', category: 'pest' },
      { timing: 45, activity: 'Remove yellowing leaves', category: 'pruning' },
      { timing: 50, activity: 'Begin harvesting', category: 'harvest' },
      { timing: 60, activity: 'Harvest regularly', category: 'harvest' }
    ]
  },
  'Cucumber': {
    keyActivities: [
      { timing: 14, activity: 'Thin to 2-3 plants', category: 'planting' },
      { timing: 21, activity: 'Install trellis', category: 'planting' },
      { timing: 28, activity: 'Guide vines to supports', category: 'pruning' },
      { timing: 35, activity: 'Monitor for cucumber beetles', category: 'pest' },
      { timing: 50, activity: 'Begin harvesting', category: 'harvest' },
      { timing: 60, activity: 'Harvest regularly', category: 'harvest' }
    ]
  },
  'Onions': {
    keyActivities: [
      { timing: 30, activity: 'Begin nitrogen-rich fertilizer', category: 'fertilizing' },
      { timing: 45, activity: 'Check for onion fly damage', category: 'pest' },
      { timing: 60, activity: 'Stop fertilizing', category: 'fertilizing' },
      { timing: 90, activity: 'Check for bulb maturity', category: 'harvest' },
      { timing: 100, activity: 'Harvest when tops fall over', category: 'harvest' }
    ]
  },
  'Garlic': {
    keyActivities: [
      { timing: 30, activity: 'Check for emergence and mulch', category: 'planting' },
      { timing: 150, activity: 'Remove flower stalks', category: 'pruning' },
      { timing: 180, activity: 'Reduce watering', category: 'pruning' },
      { timing: 210, activity: 'Monitor leaf yellowing', category: 'harvest' },
      { timing: 240, activity: 'Harvest when leaves yellow', category: 'harvest' }
    ]
  },
  'Radish': {
    keyActivities: [
      { timing: 7, activity: 'Thin to 2 inches apart', category: 'planting' },
      { timing: 14, activity: 'Check for flea beetles', category: 'pest' },
      { timing: 21, activity: 'Test size by brushing soil', category: 'harvest' },
      { timing: 25, activity: 'Harvest before woody', category: 'harvest' }
    ]
  },
  'Kale': {
    keyActivities: [
      { timing: 14, activity: 'Thin to 18 inches apart', category: 'planting' },
      { timing: 21, activity: 'Apply balanced organic fertilizer', category: 'fertilizing' },
      { timing: 35, activity: 'Check for cabbage white butterflies', category: 'pest' },
      { timing: 45, activity: 'Begin harvesting outer leaves', category: 'harvest' },
      { timing: 60, activity: 'Remove yellowing leaves', category: 'pruning' }
    ]
  },
  'Sweet Corn': {
    keyActivities: [
      { timing: 14, activity: 'Thin to strongest plants', category: 'planting' },
      { timing: 30, activity: 'Side-dress with nitrogen', category: 'fertilizing' },
      { timing: 45, activity: 'Watch for corn borers', category: 'pest' },
      { timing: 60, activity: 'Check silk development', category: 'harvest' },
      { timing: 75, activity: 'Test kernels for milk stage', category: 'harvest' }
    ]
  },
  'Eggplant': {
    keyActivities: [
      { timing: 21, activity: 'Transplant when soil warm', category: 'planting' },
      { timing: 35, activity: 'Apply calcium-rich fertilizer', category: 'fertilizing' },
      { timing: 45, activity: 'Check for flea beetles', category: 'pest' },
      { timing: 60, activity: 'Support heavy branches', category: 'pruning' },
      { timing: 70, activity: 'Harvest when skin glossy', category: 'harvest' }
    ]
  },
  'Brussels Sprouts': {
    keyActivities: [
      { timing: 14, activity: 'Thin to 2 feet apart', category: 'planting' },
      { timing: 45, activity: 'Remove yellowing leaves', category: 'pruning' },
      { timing: 60, activity: 'Top plants to focus growth', category: 'pruning' },
      { timing: 80, activity: 'Check sprout development', category: 'harvest' },
      { timing: 100, activity: 'Harvest from bottom up', category: 'harvest' }
    ]
  },
  'Sweet Potato': {
    keyActivities: [
      { timing: 21, activity: 'Train vines in rows', category: 'pruning' },
      { timing: 40, activity: 'Add phosphorus-rich fertilizer', category: 'fertilizing' },
      { timing: 60, activity: 'Check for sweet potato weevils', category: 'pest' },
      { timing: 90, activity: 'Test tuber size', category: 'harvest' },
      { timing: 100, activity: 'Harvest before soil cools', category: 'harvest' }
    ]
  },
  'Radish Sprouts': {
    keyActivities: [
      { timing: 3, activity: 'Check germination', category: 'planting' },
      { timing: 5, activity: 'Monitor growth and moisture', category: 'pest' },
      { timing: 10, activity: 'Begin harvest', category: 'harvest' },
      { timing: 13, activity: 'Complete harvest', category: 'harvest' }
    ]
  }
}

interface Activity {
  id: string
  plantName: string
  title: string
  date: Date
  category: string
  daysAfterPlanting: number
}


export default function ActivityMonthPage() {
  const { user } = useAuth()
  const { plants } = useGarden()
  const { userLocation } = useAuth()
  const { tasks, addTask } = useTasks(user?.id)
  const [activities, setActivities] = useState<Activity[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null)
  const [creatingTask, setCreatingTask] = useState<string | null>(null)
  const [pageView, setPageView] = useState<'month' | 'week'>('month')
  const [selectedPlant, setSelectedPlant] = useState<GardenPlant | null>(null)

  // Compute activities from planted items using stored schedules
  useEffect(() => {
    const computed: Activity[] = []
    plants.forEach(plant => {
      // Prefer stored fullSchedule (zone-aware data)
      // Fall back to hardcoded PLANT_TIMELINES for backwards compatibility
      const timeline = plant.fullSchedule ? null : PLANT_TIMELINES[plant.name]

      const plantedDate = new Date(plant.datePlanted)

      if (plant.fullSchedule && plant.fullSchedule.activities) {
        // Use stored zone-aware schedule (filtered: no sow/transplant/plant-X setup tasks)
        getActionableActivities(plant, { includeCompleted: true }).forEach((act, idx) => {
          const actDate = new Date(plantedDate)
          actDate.setDate(actDate.getDate() + act.daysSincePlanting)

          computed.push({
            id: `${plant.id}-${idx}`,
            plantName: plant.name,
            title: act.activity,
            date: actDate,
            category: act.category,
            daysAfterPlanting: act.daysSincePlanting
          })
        })
      } else if (timeline && timeline.keyActivities) {
        // Fall back to hardcoded timeline for backwards compatibility
        timeline.keyActivities.forEach((act: any, idx: number) => {
          const actDate = new Date(plantedDate)
          actDate.setDate(actDate.getDate() + act.timing)

          computed.push({
            id: `${plant.id}-${idx}`,
            plantName: plant.name,
            title: act.activity,
            date: actDate,
            category: act.category,
            daysAfterPlanting: act.timing
          })
        })
      }
    })
    setActivities(computed)
  }, [plants])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    // Returns 0-6, where 0 = Monday, 6 = Sunday
    let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  const getActivityLoadForDay = (date: Date) => {
    const day = activities.filter(
      a => a.date.toDateString() === date.toDateString()
    )
    const dayTasks = tasks.filter(
      t => t.due_date?.toDateString() === date.toDateString() && !t.completed
    )
    return { activities: day, tasks: dayTasks }
  }

  const getWeekForDate = (date: Date) => {
    // Get Monday of the week containing this date
    const dayOfWeek = date.getDay()
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const start = new Date(date.getFullYear(), date.getMonth(), diff)
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6)
    return { start, end }
  }

  const getCurrentWeek = () => {
    return getWeekForDate(new Date())
  }

  const getWeekSuggestions = (date: Date) => {
    const { start, end } = getWeekForDate(date)

    // Get all activities and tasks for this week
    const weekActivities = activities.filter(
      a => a.date >= start && a.date <= end
    )
    const weekTasks = tasks.filter(
      t => t.due_date && t.due_date >= start && t.due_date <= end && !t.completed
    )

    // Group activities by day
    const byDay: { [key: string]: typeof weekActivities } = {}
    const dayLabels: string[] = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
      const dayKey = day.toDateString()
      byDay[dayKey] = weekActivities.filter(a => a.date.toDateString() === dayKey)
      if (byDay[dayKey].length > 0 || i === 0) {
        dayLabels.push(dayKey)
      }
    }

    return { weekActivities, weekTasks, byDay, dayLabels, weekStart: start, weekEnd: end }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      planting: 'border-l-4 border-blue-500 bg-blue-50',
      fertilizing: 'border-l-4 border-yellow-500 bg-yellow-50',
      pest: 'border-l-4 border-red-500 bg-red-50',
      pruning: 'border-l-4 border-purple-500 bg-purple-50',
      harvest: 'border-l-4 border-green-500 bg-green-50'
    }
    return colors[category] || 'border-l-4 border-gray-500 bg-gray-50'
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      planting: '🌱 Planting',
      fertilizing: '🥗 Fertilizing',
      pest: '🐛 Pest Management',
      pruning: '✂️ Pruning',
      harvest: '🌾 Harvest'
    }
    return labels[category] || category
  }

  const formatDateShort = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${date.getDate()} ${months[date.getMonth()]}`
  }

  const formatDateLong = (date: Date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[date.getMonth()]} ${date.getDate()}`
  }

  const getActivityUrgency = (activity: Activity): 'critical' | 'recommended' | 'flexible' => {
    const daysUntil = Math.ceil((activity.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    // Harvest and pest management have narrow windows (critical)
    if (['harvest', 'pest'].includes(activity.category) && daysUntil <= 14) {
      return 'critical'
    }
    // Planting/support activities are time-critical
    if (activity.category === 'planting' && daysUntil <= 7) {
      return 'critical'
    }
    // Within 2 weeks is recommended
    if (daysUntil <= 14) {
      return 'recommended'
    }
    return 'flexible'
  }

  const getUrgencyIcon = (urgency: 'critical' | 'recommended' | 'flexible') => {
    return urgency === 'critical' ? '●' : urgency === 'recommended' ? '◐' : '○'
  }

  const getNextActionsAllPlants = () => {
    const now = new Date()
    const futureActivities = activities
      .filter(a => a.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    const critical = futureActivities.filter(a => getActivityUrgency(a) === 'critical').slice(0, 3)
    return critical
  }

  const getPlantMaturity = (plant: GardenPlant) => {
    const plantedDate = new Date(plant.datePlanted)

    const daysIn = Math.floor((new Date().getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24))

    // Use stored schedule's totalDays if available, otherwise use hardcoded timeline or default
    let daysTotal = 60
    if (plant.fullSchedule?.totalDays) {
      daysTotal = plant.fullSchedule.totalDays
    } else {
      const timeline = PLANT_TIMELINES[plant.name]
      if (timeline?.keyActivities?.length > 0) {
        daysTotal = Math.max(...timeline.keyActivities.map((a: any) => a.timing)) + 30
      }
    }

    return {
      daysIn: Math.max(0, daysIn),
      daysTotal,
      percentage: Math.min((daysIn / daysTotal) * 100, 100)
    }
  }

  const getPlantNextActions = (plantName: string) => {
    const now = new Date()
    return activities
      .filter(a => a.plantName === plantName && a.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3)
  }

  const handleCreateTask = async (activity: Activity) => {
    if (!user?.id) return
    setCreatingTask(activity.id)

    try {
      // Check if task already exists
      const exists = tasks.some(t =>
        t.title.includes(activity.title) &&
        t.title.includes(activity.plantName)
      )

      if (!exists) {
        await addTask(
          `${activity.plantName}: ${activity.title}`,
          activity.date,
          activity.category
        )
      }
    } finally {
      setCreatingTask(null)
    }
  }

  const getPlantingOpportunities = () => {
    if (!userLocation) return []
    const plantedNames = new Set(plants.map((p) => p.name))
    const { sow, plant } = getPlantingRecommendationsForMonth(
      userLocation,
      getCurrentPlantingMonth()
    )
    return Array.from(new Set([...sow, ...plant])).filter((name) => !plantedNames.has(name))
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
    )
  ]

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-semibold text-gray-900">Activity Calendar</h1>
            <p className="text-base text-gray-500 mt-1">Manage your plants and tasks</p>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPageView('month')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                pageView === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📅 Month
            </button>
            <button
              onClick={() => setPageView('week')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                pageView === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Week
            </button>
          </div>
        </div>

        <div className={`grid ${pageView === 'month' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
          {/* Calendar - Hidden in Week view */}
          {pageView === 'month' && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-900">{monthName}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                  }
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  ← Prev
                </button>
                <button
                  onClick={() =>
                    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                  }
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="text-center font-semibold text-gray-600 py-3 text-sm">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} className="aspect-square" />
                }

                const { activities: dayActivities, tasks: dayTasks } = getActivityLoadForDay(date)
                const totalLoad = dayActivities.length + dayTasks.length
                const isToday = date.toDateString() === new Date().toDateString()
                const { start: weekStart } = getWeekForDate(date)
                const isSelectedWeek = selectedWeekStart?.toDateString() === weekStart.toDateString()

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedWeekStart(weekStart)}
                    className={`
                      aspect-square p-3 rounded-lg border transition-all font-medium cursor-pointer
                      ${isSelectedWeek ? 'border-2 border-green-400 bg-green-50' : 'border border-gray-200 bg-white hover:border-gray-300'}
                      ${isToday ? 'ring-2 ring-blue-400 ring-inset' : ''}
                      ${totalLoad > 0 ? 'text-gray-900 font-semibold' : 'text-gray-600'}
                    `}
                  >
                    <div className="text-base text-gray-900 font-semibold mb-1">{date.getDate()}</div>
                    {totalLoad > 0 && (
                      <div className="text-xs text-green-600 flex gap-0.5">
                        {'●'.repeat(Math.min(totalLoad, 3))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          )}

          {/* Sidebar */}
          <div className={`bg-white rounded-2xl border border-gray-200 p-8 overflow-y-auto ${
            pageView === 'month' ? 'h-fit max-h-[800px]' : 'w-full'
          }`}>
            {/* Week View - Always visible, defaults to current week or shows selected week */}
            {(() => {
              const displayWeekStart = selectedWeekStart || getCurrentWeek().start
              const { weekActivities, weekTasks, byDay, dayLabels, weekStart, weekEnd } = getWeekSuggestions(displayWeekStart)

              return (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-0.5">
                    Weekly Activities
                  </h3>
                  <p className="text-xs text-gray-600 mb-0.5">
                    {weekStart.toLocaleString('default', { month: 'short' })} {weekStart.getDate()} — {weekEnd.getDate()}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    To tackle sometime this week
                  </p>

                  <div className="space-y-4">
                    {/* Activity summary by day */}
                    {dayLabels.map(dayKey => {
                      const dayActivities = byDay[dayKey] || []
                      const dayDate = new Date(dayKey)
                      const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayDate.getDay() === 0 ? 6 : dayDate.getDay() - 1]

                      return (
                        <div key={dayKey} className={dayActivities.length === 0 ? 'hidden' : ''}>
                          {dayActivities.length > 0 && (
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                              {dayName} {formatDateShort(dayDate)}
                            </h4>
                          )}
                          <div className="space-y-1.5">
                            {dayActivities.map(a => {
                              const urgency = getActivityUrgency(a)
                              const isScheduled = tasks.some(t =>
                                t.title.includes(a.plantName) &&
                                t.title.includes(a.title)
                              )
                              return (
                                <div
                                  key={a.id}
                                  className={`text-xs p-3 rounded transition ${getCategoryColor(a.category)} group hover:shadow-md`}
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-sm font-semibold ${
                                          urgency === 'critical' ? 'text-red-500' : urgency === 'recommended' ? 'text-amber-500' : 'text-gray-400'
                                        }`}>{getUrgencyIcon(urgency)}</span>
                                        <p className="font-medium text-gray-800">{a.plantName}</p>
                                      </div>
                                      <p className="text-gray-700 mt-1">{a.title}</p>
                                      {isScheduled && <p className="text-xs text-green-700 mt-1">✓ Scheduled</p>}
                                    </div>
                                    {!isScheduled && (
                                      <button
                                        onClick={() => handleCreateTask(a)}
                                        disabled={creatingTask === a.id}
                                        className="px-2 py-1 text-xs bg-white/70 hover:bg-white rounded opacity-0 group-hover:opacity-100 transition"
                                      >
                                        {creatingTask === a.id ? '...' : 'Task'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}

                    {/* Tasks for the week */}
                    {weekTasks.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold text-blue-700 mb-2">📋 Your Tasks</h4>
                        <div className="space-y-2">
                          {weekTasks.map(t => (
                            <div key={t.id} className="text-xs p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                              <p className="font-medium">{t.title}</p>
                              <p className="text-gray-600">
                                Due: {t.due_date && formatDateShort(t.due_date)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {weekActivities.length === 0 && weekTasks.length === 0 && (
                    <p className="text-gray-500 text-sm">No activities scheduled for this week</p>
                  )}
                  </div>
                </>
              )
            })()}

            {/* To Plant This Month */}
            {(() => {
              const opportunities = getPlantingOpportunities()
              const plantingMonth = getCurrentPlantingMonth()
              const monthSlug = plantingMonth.toLowerCase()
              return opportunities.length > 0 ? (
                <div className="border-t border-gray-200 mt-8 pt-6 bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border-l-4 border-l-green-500">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1.5">🌱 To Plant This Month</h4>
                  <p className="text-xs text-gray-700 mb-2">
                    It's time to plant: {opportunities.join(', ')}.
                  </p>
                  <p className="text-xs">
                    <a href={`/planting-calendar/${monthSlug}`} className="text-green-600 hover:text-green-700 font-medium">
                      View the {plantingMonth} Guide →
                    </a>
                  </p>
                </div>
              ) : null
            })()}

            {/* Plant Selector and Details */}
            {plants.length > 0 && (
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h4 className="text-base font-semibold text-gray-900 mb-2">Plant Timelines</h4>
                <p className="text-xs text-gray-600 mb-3">Select your plant to see its full plant-to-harvest timeline and suggested activities</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {plants.map(plant => (
                    <button
                      key={plant.id}
                      onClick={() => setSelectedPlant(selectedPlant?.id === plant.id ? null : plant)}
                      title={selectedPlant?.id === plant.id ? 'Click to deselect' : 'Click to select'}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                        selectedPlant?.id === plant.id
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {plant.name}
                    </button>
                  ))}
                </div>

                {selectedPlant && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-3">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">{selectedPlant.name}</h5>

                    {/* Maturity Progress */}
                    {(() => {
                      const maturity = getPlantMaturity(selectedPlant)
                      return (
                        <div className="mb-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">{maturity.daysIn} / {maturity.daysTotal} days</span>
                            <span className="text-xs font-bold text-green-600">{Math.round(maturity.percentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-1.5">
                            <div
                              className="bg-green-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${maturity.percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })()}

                    {/* Full Plant Timeline */}
                    {(() => {
                      // Use stored zone-aware schedule if available, fall back to hardcoded timeline
                      const activities = selectedPlant.fullSchedule
                        ? getActionableActivities(selectedPlant, { includeCompleted: true })
                        : PLANT_TIMELINES[selectedPlant.name]?.keyActivities
                      if (!activities || activities.length === 0) {
                        return <p className="text-xs text-gray-500">No timeline data</p>
                      }

                      return (
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Timeline</p>
                          <div className="space-y-1">
                            {activities.map((act: any, idx: number) => {
                              // Handle both formats: stored schedule uses daysSincePlanting, hardcoded uses timing
                              const daysOffset = act.daysSincePlanting ?? act.timing
                              const activityDate = new Date(selectedPlant.datePlanted)
                              activityDate.setDate(activityDate.getDate() + daysOffset)
                              const urgency = getActivityUrgency({
                                id: `${selectedPlant.id}-${idx}`,
                                plantName: selectedPlant.name,
                                title: act.activity,
                                date: activityDate,
                                category: act.category,
                                daysAfterPlanting: daysOffset
                              })

                              return (
                                <div
                                  key={idx}
                                  className={`text-xs p-2 rounded border-l-4 bg-white ${getCategoryColor(act.category)}`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900 text-xs">{act.activity}</p>
                                      <p className="text-gray-500 text-xs">Day {daysOffset} — {formatDateShort(activityDate)}</p>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
