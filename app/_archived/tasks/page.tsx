'use client'

import { useState, useEffect, useMemo } from 'react'
import { useGarden } from '@/app/context/GardenContext'
import { useAuth } from '@/app/context/AuthContext'
import { useTasks } from '@/app/hooks/useTasks'
import { useProjects } from '@/app/hooks/useProjects'
import {
  type TaskWithPlant,
  type Priority,
  type TaskCategory,
  normalizePriority,
  systemTasksFromPlants,
  dbTaskToTaskWithPlant,
  sortTasksByDueDate,
} from '@/lib/taskListBuilders'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type ViewMode = 'list' | 'priority' | 'growguide-suggestions'

export default function TasksPage(): JSX.Element {
  const { user } = useAuth()
  const router = useRouter()
  const { plants: gardenPlantsCtx, updatePlant: updateGardenPlant, loading: gardenLoading } = useGarden()
  const {
    tasks: dbTasks,
    loading: tasksLoading,
    addTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    clearProjectFromTasks,
  } = useTasks(user?.id)
  const {
    projects,
    loading: projectsLoading,
    addProject,
    deleteProject,
  } = useProjects(user?.id)

  const tasks = useMemo(
    () =>
      sortTasksByDueDate([
        ...dbTasks.map(dbTaskToTaskWithPlant),
        ...systemTasksFromPlants(gardenPlantsCtx),
      ]),
    [dbTasks, gardenPlantsCtx]
  )

  const loading = tasksLoading || gardenLoading || projectsLoading

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [hideCompletedSuggestions, setHideCompletedSuggestions] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }
    try {
      const saved = localStorage.getItem('hideCompletedSystem')
      return saved ? JSON.parse(saved) : true
    } catch {
      return true
    }
  })
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [groupBy, setGroupBy] = useState<'none' | 'category' | 'priority' | 'project'>('none')
  const [suggestionsSortBy, setSuggestionsSortBy] = useState<'plant' | 'dueDate'>('dueDate')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    activity: '',
    details: '',
    dueDate: new Date().toISOString().split('T')[0],
    category: 'other' as TaskCategory,
    priority: 'important' as Priority,
    projectId: ''
  })
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#10b981'
  })

  // Persist hideCompletedSuggestions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hideCompletedSystem', JSON.stringify(hideCompletedSuggestions))
    } catch (error) {
      console.error('Error saving hideCompletedSuggestions:', error)
    }
  }, [hideCompletedSuggestions])

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
  }, [user, router])

  const handleTaskComplete = async (task: TaskWithPlant) => {
    try {
      if (task.source === 'custom' && task.customTaskId) {
        await toggleTaskComplete(task.customTaskId, !task.completed)
      } else if (task.source === 'system') {
        const plant = gardenPlantsCtx.find(
          (p) => p.name === task.plantName && p.datePlanted === task.plantDatePlanted
        )
        if (!plant) return

        if (plant.fullSchedule?.activities) {
          const activities = [...plant.fullSchedule.activities]
          if (task.taskIndex >= activities.length) return
          const current = activities[task.taskIndex]
          activities[task.taskIndex] = {
            ...current,
            completed: !Boolean(current.completed),
          }
          await updateGardenPlant(plant, {
            fullSchedule: { ...plant.fullSchedule, activities },
          })
          return
        }

        if (!plant.schedule || task.taskIndex >= plant.schedule.length) return
        const updatedSchedule = [...plant.schedule]
        updatedSchedule[task.taskIndex] = {
          ...updatedSchedule[task.taskIndex],
          completed: !updatedSchedule[task.taskIndex].completed,
        }
        await updateGardenPlant(plant, { schedule: updatedSchedule })
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleAddCustomTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dueDate = new Date(newTask.dueDate + 'T00:00:00')
      await addTask({
        title: newTask.activity,
        description: newTask.details,
        due_date: dueDate,
        category: newTask.category,
        priority: normalizePriority(newTask.priority),
        project_id: newTask.projectId || undefined,
      })

      setNewTask({
        activity: '',
        details: '',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'other',
        priority: 'important',
        projectId: '',
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding custom task:', error)
    }
  }

  const handleEditCustomTask = (taskId: string) => {
    const task = dbTasks.find((t) => t.id === taskId)
    if (!task) return

    const dateOnly = task.due_date
      ? task.due_date.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
    setNewTask({
      activity: task.title,
      details: task.description || '',
      dueDate: dateOnly,
      category: (task.category || 'other') as TaskCategory,
      priority: normalizePriority(task.priority || 'important'),
      projectId: task.project_id || '',
    })
    setEditingTaskId(taskId)
    setShowAddForm(true)
  }

  const handleUpdateCustomTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTaskId) return

    try {
      const dueDate = new Date(newTask.dueDate + 'T00:00:00')
      await updateTask(editingTaskId, {
        title: newTask.activity,
        description: newTask.details,
        due_date: dueDate,
        category: newTask.category,
        priority: normalizePriority(newTask.priority),
        project_id: newTask.projectId || undefined,
      })

      setNewTask({
        activity: '',
        details: '',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'other',
        priority: 'important',
        projectId: '',
      })
      setEditingTaskId(null)
      setShowAddForm(false)
    } catch (error) {
      console.error('Error updating custom task:', error)
    }
  }

  const handleDeleteCustomTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error('Error deleting custom task:', error)
    }
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addProject({
        name: newProject.name,
        description: newProject.description,
        color: newProject.color,
      })

      setNewProject({
        name: '',
        description: '',
        color: '#10b981'
      })
      setShowProjectForm(false)
    } catch (error) {
      console.error('Error adding project:', error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? Tasks in this project will be unassigned.')) return

    try {
      await clearProjectFromTasks(projectId)
      await deleteProject(projectId)
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'planting': 'bg-blue-100 text-blue-800',
      'fertilizing': 'bg-green-100 text-green-800',
      'pruning': 'bg-purple-100 text-purple-800',
      'pest': 'bg-red-100 text-red-800',
      'harvest': 'bg-yellow-100 text-yellow-800',
      'climate': 'bg-gray-100 text-gray-800',
      'other': 'bg-indigo-100 text-indigo-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: Priority) => {
    const colors: { [key: string]: string } = {
      'urgent-important': 'bg-red-100 text-red-800 border-red-300',
      'urgent': 'bg-orange-100 text-orange-800 border-orange-300',
      'important': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'nice-to-do': 'bg-blue-100 text-blue-800 border-blue-300'
    }
    return colors[priority] || colors.important
  }

  const getPriorityBorder = (priority?: Priority) => {
    if (!priority) return 'border-l-2 border-gray-200'
    const borders: { [key: string]: string } = {
      'urgent-important': 'border-l-2 border-red-500',
      'urgent': 'border-l-2 border-orange-400',
      'important': 'border-l-2 border-yellow-400',
      'nice-to-do': 'border-l-2 border-blue-300',
    }
    return borders[priority] || 'border-l-2 border-gray-200'
  }

  const getPriorityIcon = (priority: Priority) => {
    if (priority === 'urgent-important') return '🔴'
    if (priority === 'urgent') return '🟠'
    if (priority === 'important') return '🟡'
    return '🔵'
  }

  const getPriorityLabel = (priority: Priority) => {
    const labels: { [key: string]: string } = {
      'urgent-important': 'Urgent',
      'urgent': 'High',
      'important': 'Important',
      'nice-to-do': 'Nice to do'
    }
    return labels[priority] || priority
  }

  // Filtering: GrowGuide suggestions only show in growguide-suggestions view mode
  // Otherwise, only show custom tasks (My Tasks)
  const visibleTasks = useMemo(() => {
    return tasks.filter(task => {
      // If in GrowGuide Suggestions view, only show system tasks
      if (viewMode === 'growguide-suggestions') {
        if (task.source !== 'system') return false
        // Hide completed suggestions if option is enabled
        if (hideCompletedSuggestions && task.completed) return false
      } else {
        // In all other views, only show custom tasks
        if (task.source !== 'custom') return false
      }
      
      // Filter by completion status
      if (filter === 'pending' && task.completed) return false
      if (filter === 'completed' && !task.completed) return false
      
      return true
    })
  }, [tasks, filter, hideCompletedSuggestions, viewMode])

  // Memoized counts for performance
  const counts = useMemo(() => {
    const all = visibleTasks.length
    const pending = visibleTasks.filter(t => !t.completed).length
    const completed = visibleTasks.filter(t => t.completed).length
    return { all, pending, completed }
  }, [visibleTasks])

  // Grouping: system tasks go to "Suggestions" group when grouping by project
  // Priority grouping applies to custom tasks; system tasks default to important
  const groupedTasks = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Tasks': visibleTasks }
    }

    if (groupBy === 'category') {
      const groups: { [key: string]: TaskWithPlant[] } = {}
      visibleTasks.forEach(task => {
        const key = task.category || 'other'
        if (!groups[key]) groups[key] = []
        groups[key].push(task)
      })
      return groups
    }

    if (groupBy === 'priority') {
      const groups: { [key: string]: TaskWithPlant[] } = {}
      visibleTasks.forEach(task => {
        // System tasks default to important priority for grouping
        const key = task.priority || 'important'
        if (!groups[key]) groups[key] = []
        groups[key].push(task)
      })
      return groups
    }

    if (groupBy === 'project') {
      const groups: { [key: string]: TaskWithPlant[] } = {}
      visibleTasks.forEach(task => {
        if (task.source === 'system') {
          // System tasks go to "Suggestions" group
          if (!groups['suggestions']) groups['suggestions'] = []
          groups['suggestions'].push(task)
        } else {
          // Custom tasks grouped by project
          const key = task.projectId || 'unassigned'
          if (!groups[key]) groups[key] = []
          groups[key].push(task)
        }
      })
      return groups
    }

    return { 'All Tasks': visibleTasks }
  }, [visibleTasks, groupBy])

  const renderListView = () => {
    return (
      <div className="space-y-3">
        {Object.entries(groupedTasks).map(([groupKey, groupTasks]) => {
          const project = groupBy === 'project' && groupKey !== 'unassigned' && groupKey !== 'suggestions'
            ? projects.find(p => p.id === groupKey)
            : null
          
          return (
            <div key={groupKey} className="space-y-2">
              {groupBy !== 'none' && (
                <div className="flex items-center gap-2 px-3 py-2">
                  {project && (
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                  )}
                  <h3 className="text-sm font-semibold text-gray-900 capitalize">
                    {project ? project.name : groupKey === 'suggestions' ? 'Suggestions' : groupKey}
                  </h3>
                  <span className="text-xs text-gray-500">({groupTasks.length})</span>
                </div>
              )}
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {groupTasks.map((task, index) => {
                  const isOverdue = !task.completed && new Date(task.dueDate) < new Date()
                  const isDueSoon = !task.completed && new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  const taskProject = task.projectId && task.source === 'custom' ? projects.find(p => p.id === task.projectId) : null

                  return (
                    <div
                      key={`${task.source}-${task.plantName}-${task.plantDatePlanted}-${task.taskIndex}-${task.customTaskId || index}`}
                      className={`flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${getPriorityBorder(task.priority)} ${task.completed ? 'opacity-50' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleTaskComplete(task)}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        {/* Title + date on one line */}
                        <div className="flex items-baseline justify-between gap-2">
                          <p className={`text-sm font-medium leading-snug ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {task.activity}
                          </p>
                          <span className={`text-xs flex-shrink-0 font-medium ${
                            task.completed ? 'text-gray-300'
                            : isOverdue ? 'text-red-500'
                            : isDueSoon ? 'text-amber-500'
                            : 'text-gray-400'
                          }`}>
                            {isOverdue && !task.completed ? 'Overdue' : formatDate(task.dueDate)}
                          </span>
                        </div>
                        {/* Details */}
                        {task.details && (
                          <p className={`text-xs mt-0.5 leading-snug ${task.completed ? 'text-gray-300' : 'text-gray-500'}`}>
                            {task.details}
                          </p>
                        )}
                        {/* Meta row: category · project · plant · edit/delete */}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getCategoryColor(task.category)}`}>
                            {task.category}
                          </span>
                          {taskProject && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded font-medium text-white"
                              style={{ backgroundColor: taskProject.color }}
                            >
                              {taskProject.name}
                            </span>
                          )}
                          {task.source === 'system' && task.plantName && (
                            <span className="text-xs text-gray-400">{task.plantName}</span>
                          )}
                          {task.source === 'custom' && task.customTaskId && (
                            <>
                              <span className="text-gray-200 select-none">|</span>
                              <button
                                onClick={() => handleEditCustomTask(task.customTaskId!)}
                                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCustomTask(task.customTaskId!)}
                                className="text-xs text-red-400 hover:text-red-600 font-medium"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderTimelineView = () => {
    const sortedTasks = [...visibleTasks].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime()
      const dateB = new Date(b.dueDate).getTime()
      return dateA - dateB
    })

    const tasksByDate: { [key: string]: TaskWithPlant[] } = {}
    sortedTasks.forEach(task => {
      const dateKey = new Date(task.dueDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      if (!tasksByDate[dateKey]) tasksByDate[dateKey] = []
      tasksByDate[dateKey].push(task)
    })

    return (
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        <div className="space-y-8">
          {Object.entries(tasksByDate).map(([date, dateTasks]) => (
            <div key={date} className="relative pl-16">
              <div className="absolute left-6 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow"></div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{date}</h3>
                <p className="text-sm text-gray-500">{dateTasks.length} task{dateTasks.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="space-y-3">
                {dateTasks.map((task, index) => {
                  const taskProject = task.projectId && task.source === 'custom' ? projects.find(p => p.id === task.projectId) : null
                  return (
                    <div
                      key={`${task.source}-${task.plantName}-${task.plantDatePlanted}-${task.taskIndex}-${task.customTaskId || index}`}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskComplete(task)}
                          className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <h4 className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {task.activity}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{task.details}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(task.category)}`}>
                              {task.category}
                            </span>
                            {task.priority && (
                              <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                {getPriorityIcon(task.priority)} {getPriorityLabel(task.priority)}
                              </span>
                            )}
                            {task.source === 'custom' && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                My Task
                              </span>
                            )}
                            {task.source === 'system' && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                Suggested
                              </span>
                            )}
                            {task.source === 'system' && task.plantName && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                {task.plantName}
                              </span>
                            )}
                            {taskProject && (
                              <span 
                                className="px-2 py-1 rounded text-xs font-medium text-white"
                                style={{ backgroundColor: taskProject.color }}
                              >
                                {taskProject.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderPriorityBoard = () => {
    // Group tasks by priority
    const priorityGroups: { [key in Priority]: TaskWithPlant[] } = {
      'urgent-important': [],
      'urgent': [],
      'important': [],
      'nice-to-do': []
    }

    visibleTasks.forEach(task => {
      const priority = normalizePriority(task.priority || 'important')
      priorityGroups[priority].push(task)
    })

    const priorityOrder: Priority[] = ['urgent-important', 'urgent', 'important', 'nice-to-do']

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {priorityOrder.map(priority => {
          const tasks = priorityGroups[priority]
          return (
            <div key={priority} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{getPriorityIcon(priority)}</span>
                <h3 className="font-semibold text-gray-900">{getPriorityLabel(priority)}</h3>
                <span className="text-sm text-gray-500">({tasks.length})</span>
              </div>
              <div className="space-y-3">
                {tasks.map((task, index) => {
                  const isOverdue = !task.completed && new Date(task.dueDate) < new Date()
                  const isDueSoon = !task.completed && new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  const taskProject = task.projectId && task.source === 'custom' ? projects.find(p => p.id === task.projectId) : null

                  return (
                    <div
                      key={`${task.source}-${task.plantName}-${task.plantDatePlanted}-${task.taskIndex}-${task.customTaskId || index}`}
                      className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
                        task.completed
                          ? 'border-gray-300 opacity-75'
                          : isOverdue
                          ? 'border-red-500'
                          : isDueSoon
                          ? 'border-yellow-500'
                          : 'border-green-500'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskComplete(task)}
                          className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {task.activity}
                          </h4>
                          {task.details && (
                            <p className="text-xs text-gray-500 mt-1">{task.details}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                        {task.source === 'custom' && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            My Task
                          </span>
                        )}
                        {task.source === 'system' && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Suggested
                          </span>
                        )}
                        {task.source === 'system' && task.plantName && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                            {task.plantName}
                          </span>
                        )}
                        {taskProject && (
                          <span 
                            className="px-2 py-0.5 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: taskProject.color }}
                          >
                            {taskProject.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${
                          task.completed
                            ? 'text-gray-400'
                            : isOverdue
                            ? 'text-red-600'
                            : isDueSoon
                            ? 'text-yellow-600'
                            : 'text-gray-700'
                        }`}>
                          {formatDate(task.dueDate)}
                        </span>
                        {task.source === 'custom' && task.customTaskId && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditCustomTask(task.customTaskId!)}
                              className="text-blue-600 hover:text-blue-700 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCustomTask(task.customTaskId!)}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                {tasks.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No tasks</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderProjectBoard = () => {
    // Group custom tasks by project (system tasks don't appear in Project Board)
    const projectGroups: { [key: string]: TaskWithPlant[] } = {}

    visibleTasks.forEach(task => {
      // Only process custom tasks in Project Board
      if (task.source === 'custom') {
        if (task.projectId) {
          if (!projectGroups[task.projectId]) {
            projectGroups[task.projectId] = []
          }
          projectGroups[task.projectId].push(task)
        } else {
          // Custom tasks without a project go to unassigned
          if (!projectGroups['unassigned']) {
            projectGroups['unassigned'] = []
          }
          projectGroups['unassigned'].push(task)
        }
      }
    })

    // Ensure unassigned column always shows if there are custom tasks
    const hasCustomTasks = visibleTasks.some(t => t.source === 'custom')
    if (hasCustomTasks && !projectGroups['unassigned']) {
      projectGroups['unassigned'] = []
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Project Columns - always show unassigned if there are custom tasks */}
        {Object.entries(projectGroups)
          .sort(([a], [b]) => {
            // Sort: unassigned first, then projects alphabetically
            if (a === 'unassigned') return -1
            if (b === 'unassigned') return 1
            const projectA = projects.find(p => p.id === a)
            const projectB = projects.find(p => p.id === b)
            if (projectA && projectB) return projectA.name.localeCompare(projectB.name)
            return 0
          })
          .map(([projectId, tasks]) => {
          const project = projectId !== 'unassigned' ? projects.find(p => p.id === projectId) : null

          return (
            <div key={projectId} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                {project && (
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                )}
                <h3 className="font-semibold text-gray-900">
                  {project ? project.name : 'Unassigned'}
                </h3>
                <span className="text-sm text-gray-500">({tasks.length})</span>
              </div>
              <div className="space-y-3">
                {tasks.map((task, index) => {
                  const isOverdue = !task.completed && new Date(task.dueDate) < new Date()
                  const isDueSoon = !task.completed && new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

                  return (
                    <div
                      key={`${task.source}-${task.customTaskId || index}`}
                      className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
                        task.completed
                          ? 'border-gray-300 opacity-75'
                          : isOverdue
                          ? 'border-red-500'
                          : isDueSoon
                          ? 'border-yellow-500'
                          : 'border-green-500'
                      }`}
                      style={project ? { borderLeftColor: project.color } : {}}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskComplete(task)}
                          className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {task.activity}
                          </h4>
                          {task.details && (
                            <p className="text-xs text-gray-500 mt-1">{task.details}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                        {task.priority && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {getPriorityIcon(task.priority)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${
                          task.completed
                            ? 'text-gray-400'
                            : isOverdue
                            ? 'text-red-600'
                            : isDueSoon
                            ? 'text-yellow-600'
                            : 'text-gray-700'
                        }`}>
                          {formatDate(task.dueDate)}
                        </span>
                        {task.source === 'custom' && task.customTaskId && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditCustomTask(task.customTaskId!)}
                              className="text-blue-600 hover:text-blue-700 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCustomTask(task.customTaskId!)}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                {tasks.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No tasks</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderGrowGuideSuggestions = () => {
    // Filter to only show system tasks (GrowGuide suggestions)
    const suggestions = visibleTasks.filter(task => task.source === 'system')

    if (suggestions.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-2">No GrowGuide suggestions available</p>
          <p className="text-gray-500 text-sm">Add plants to your garden to see suggested tasks here.</p>
        </div>
      )
    }

    // Sort suggestions based on selected sort option
    let sortedSuggestions = [...suggestions]
    if (suggestionsSortBy === 'dueDate') {
      // Sort by due date (earliest first)
      sortedSuggestions.sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime()
        const dateB = new Date(b.dueDate).getTime()
        return dateA - dateB
      })
    } else {
      // Sort by plant name (alphabetically)
      sortedSuggestions.sort((a, b) => {
        const plantA = a.plantName || 'Other'
        const plantB = b.plantName || 'Other'
        return plantA.localeCompare(plantB)
      })
    }

    return (
      <div className="space-y-4">
        {/* Sort dropdown */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">GrowGuide Suggestions</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Sort by:</span>
            <select
              value={suggestionsSortBy}
              onChange={(e) => setSuggestionsSortBy(e.target.value as 'plant' | 'dueDate')}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="plant">Plant</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>

        {suggestionsSortBy === 'dueDate' ? (
          // Flat list when sorting by due date
          <div className="space-y-1">
            {sortedSuggestions.map((task, index) => {
              const isOverdue = !task.completed && new Date(task.dueDate) < new Date()
              const isDueSoon = !task.completed && new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

              return (
                <div
                  key={`suggestion-${task.plantName}-${task.plantDatePlanted}-${task.taskIndex}-${index}`}
                  className={`flex items-start gap-3 py-2 px-3 rounded border-l-2 ${
                    task.completed
                      ? 'bg-gray-50 border-gray-300 opacity-75'
                      : isOverdue
                      ? 'bg-red-50 border-red-400'
                      : isDueSoon
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-white border-green-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskComplete(task)}
                    className="mt-0.5 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {task.activity}
                        </h4>
                        {task.details && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{task.details}</p>
                        )}
                      </div>
                      <span className={`text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                        task.completed
                          ? 'text-gray-400'
                          : isOverdue
                          ? 'text-red-600'
                          : isDueSoon
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                      }`}>
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                      {task.plantName && (
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          🌱 {task.plantName}
                        </span>
                      )}
                      {task.week > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          Week {task.week}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // Grouped by plant when sorting by plant
          (() => {
            const tasksByPlant: { [key: string]: TaskWithPlant[] } = {}
            sortedSuggestions.forEach(task => {
              const plantKey = task.plantName || 'Other'
              if (!tasksByPlant[plantKey]) {
                tasksByPlant[plantKey] = []
              }
              tasksByPlant[plantKey].push(task)
            })

            return Object.entries(tasksByPlant).map(([plantName, plantTasks]) => (
              <div key={plantName} className="space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">🌱 {plantName}</h3>
                  <span className="text-xs text-gray-500">({plantTasks.length} suggestion{plantTasks.length !== 1 ? 's' : ''})</span>
                </div>
                <div className="space-y-1">
                  {plantTasks.map((task, index) => {
                    const isOverdue = !task.completed && new Date(task.dueDate) < new Date()
                    const isDueSoon = !task.completed && new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

                    return (
                      <div
                        key={`suggestion-${task.plantName}-${task.plantDatePlanted}-${task.taskIndex}-${index}`}
                        className={`flex items-start gap-3 py-2 px-3 rounded border-l-2 ${
                          task.completed
                            ? 'bg-gray-50 border-gray-300 opacity-75'
                            : isOverdue
                            ? 'bg-red-50 border-red-400'
                            : isDueSoon
                            ? 'bg-yellow-50 border-yellow-400'
                            : 'bg-white border-green-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskComplete(task)}
                          className="mt-0.5 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                {task.activity}
                              </h4>
                              {task.details && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{task.details}</p>
                              )}
                            </div>
                            <span className={`text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                              task.completed
                                ? 'text-gray-400'
                                : isOverdue
                                ? 'text-red-600'
                                : isDueSoon
                                ? 'text-yellow-600'
                                : 'text-gray-600'
                            }`}>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getCategoryColor(task.category)}`}>
                              {task.category}
                            </span>
                            {task.week > 0 && (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                Week {task.week}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          })()
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-white rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-24 bg-white rounded-lg"></div>
              <div className="h-24 bg-white rounded-lg"></div>
              <div className="h-24 bg-white rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Row 1: Header with Title + Primary Actions */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your tasks and projects</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setShowProjectForm(!showProjectForm)
                setEditingProjectId(null)
                setNewProject({ name: '', description: '', color: '#10b981' })
              }}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {showProjectForm ? 'Cancel' : '+ Project'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm)
                setEditingTaskId(null)
                setNewTask({ activity: '', details: '', dueDate: new Date().toISOString().split('T')[0], category: 'other', priority: 'important', projectId: '' })
              }}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {showAddForm ? 'Cancel' : '+ Add Task'}
            </button>
            <Link href="/my-garden" className="px-3 py-1.5 text-sm text-green-600 hover:text-green-700 font-medium">
              My Garden →
            </Link>
          </div>
        </div>

        {/* Hide completed suggestions - only show in GrowGuide Suggestions view */}
        {viewMode === 'growguide-suggestions' && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hideCompletedSuggestions}
                onChange={(e) => setHideCompletedSuggestions(e.target.checked)}
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Hide completed suggestions</span>
            </label>
          </div>
        )}

        {/* View Toggle + Status Tabs — combined into one bar */}
        <div className="bg-white rounded-xl shadow-sm p-3 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-gray-500 mr-1">View:</span>
            {([
              ['list', '📋', 'My Tasks'],
              ['priority', '⚡', 'Priority'],
              ['growguide-suggestions', '🌱', 'Suggestions'],
            ] as [ViewMode, string, string][]).map(([mode, icon, label]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 border-t border-gray-100 pt-2">
            {([['all', `All (${counts.all})`], ['pending', `Pending (${counts.pending})`], ['completed', `Done (${counts.completed})`]] as ['all' | 'pending' | 'completed', string][]).map(([f, label]) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Form */}
        {showProjectForm && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Project</h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Spring Garden Setup, Tomato Project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Project description..."
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={newProject.color}
                  onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
                  className="w-16 h-10 border border-gray-300 rounded-lg bg-white cursor-pointer"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectForm(false)
                    setNewProject({
                      name: '',
                      description: '',
                      color: '#10b981'
                    })
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Task Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingTaskId ? 'Edit Task' : 'Add Custom Task'}
            </h2>
            <form onSubmit={editingTaskId ? handleUpdateCustomTask : handleAddCustomTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTask.activity}
                  onChange={(e) => setNewTask({ ...newTask, activity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Water tomatoes, Check for pests"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.details}
                  onChange={(e) => setNewTask({ ...newTask, details: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Additional details or notes..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="urgent-important">Urgent & important</option>
                    <option value="urgent">High</option>
                    <option value="important">Important</option>
                    <option value="nice-to-do">Nice to Do</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value as TaskCategory })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="other">Other</option>
                    <option value="planting">Planting</option>
                    <option value="fertilizing">Fertilizing</option>
                    <option value="pruning">Pruning</option>
                    <option value="pest">Pest Control</option>
                    <option value="harvest">Harvest</option>
                    <option value="climate">Climate Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project (Optional)
                  </label>
                  <select
                    value={newTask.projectId}
                    onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">No Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {editingTaskId ? 'Update Task' : 'Add Task'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingTaskId(null)
                    setNewTask({
                      activity: '',
                      details: '',
                      dueDate: new Date().toISOString().split('T')[0],
                      category: 'other',
                      priority: 'important',
                      projectId: ''
                    })
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        {projects.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Projects</h3>
            <div className="flex flex-wrap gap-2">
              {projects.map(project => (
                <div
                  key={project.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200"
                  style={{ borderLeftColor: project.color, borderLeftWidth: '4px' }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{project.name}</span>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-600 hover:text-red-700 text-xs ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks List */}
        {visibleTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">
              {filter === 'pending' 
                ? "No pending tasks! Great job keeping up with your garden."
                : filter === 'completed'
                ? "No completed tasks yet."
                : "No tasks found. Add tasks or enable suggestions to see them here."}
            </p>
            {viewMode !== 'growguide-suggestions' && (
              <p className="text-gray-500 text-sm mt-2">
                Add a custom task above, or switch to GrowGuide Suggestions to see tasks from My Garden.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            {viewMode === 'list' && renderListView()}
            {viewMode === 'priority' && renderPriorityBoard()}
            
            
            {viewMode === 'growguide-suggestions' && renderGrowGuideSuggestions()}
          </div>
        )}
      </div>
    </div>
  )
}
