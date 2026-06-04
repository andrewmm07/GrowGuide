import type { GardenPlant } from '@/app/context/GardenContext'
import type { Task } from '@/app/hooks/useTasks'
import {
  activityDueDate,
  isSchedulePhaseAdjusted,
  schedulePhaseForPlant,
  shouldSkipActivityForPhase,
  sowToSeedlingDays,
} from '@/lib/plantCareSchedule'

export type TaskCategory =
  | 'planting'
  | 'fertilizing'
  | 'pruning'
  | 'pest'
  | 'harvest'
  | 'climate'
  | 'other'

export type Priority = 'urgent-important' | 'urgent' | 'important' | 'nice-to-do'

export interface TaskWithPlant {
  week: number
  activity: string
  details: string
  completed: boolean
  dueDate: string
  category: TaskCategory
  plantName: string
  plantDatePlanted: string
  taskIndex: number
  source: 'custom' | 'system'
  customTaskId?: string
  priority?: Priority
  projectId?: string
}

export function normalizePriority(priority: string): Priority {
  if (
    priority === 'urgent-important' ||
    priority === 'urgent' ||
    priority === 'important' ||
    priority === 'nice-to-do'
  ) {
    return priority as Priority
  }
  if (priority === 'high') return 'urgent-important'
  if (priority === 'medium') return 'important'
  if (priority === 'low') return 'nice-to-do'
  return 'important'
}

export function systemTasksFromPlants(plants: GardenPlant[]): TaskWithPlant[] {
  const allTasks: TaskWithPlant[] = []
  const activePlants = plants.filter((plant) => !plant.isHarvested)

  activePlants.forEach((plant) => {
    if (plant.fullSchedule?.activities?.length) {
      const raw = plant.fullSchedule.activities
      const phase = schedulePhaseForPlant(plant)
      const offset = sowToSeedlingDays(plant.fullSchedule)
      const alreadyAdjusted = isSchedulePhaseAdjusted(plant.fullSchedule)

      raw.forEach((act, taskIndex) => {
        if (shouldSkipActivityForPhase(act, phase, offset, alreadyAdjusted)) return

        const adjustedDay = alreadyAdjusted
          ? act.daysSincePlanting
          : phase === 'established'
            ? Math.max(0, act.daysSincePlanting - offset)
            : act.daysSincePlanting
        const adjustedAct = { ...act, daysSincePlanting: adjustedDay }
        const dueDate = activityDueDate(plant, adjustedAct)

        allTasks.push({
          week: 0,
          activity: act.activity,
          details: act.details,
          completed: Boolean(act.completed),
          dueDate: dueDate.toISOString(),
          category: act.category as TaskCategory,
          plantName: plant.name,
          plantDatePlanted: plant.datePlanted,
          taskIndex,
          source: 'system',
          priority: 'important',
        })
      })
      return
    }

    if (plant.schedule && Array.isArray(plant.schedule)) {
      plant.schedule.forEach((task, taskIndex) => {
        allTasks.push({
          ...task,
          plantName: plant.name,
          plantDatePlanted: plant.datePlanted,
          taskIndex,
          source: 'system',
          priority: normalizePriority('important'),
          category: (task.category || 'other') as TaskCategory,
        })
      })
    }
  })

  return allTasks
}

export function dbTaskToTaskWithPlant(task: Task): TaskWithPlant {
  return {
    week: 0,
    activity: task.title,
    details: task.description || '',
    completed: task.completed,
    dueDate: task.due_date?.toISOString() ?? new Date().toISOString(),
    category: (task.category || 'other') as TaskCategory,
    plantName: '',
    plantDatePlanted: '',
    taskIndex: 0,
    source: 'custom',
    customTaskId: task.id,
    priority: normalizePriority(task.priority || 'important'),
    projectId: task.project_id,
  }
}

export function sortTasksByDueDate(tasks: TaskWithPlant[]): TaskWithPlant[] {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime()
    const dateB = new Date(b.dueDate).getTime()
    return dateA - dateB
  })
}
