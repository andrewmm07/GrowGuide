'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/app/lib/supabase'

const CUSTOM_TASKS_MIGRATION_KEY = 'customTasks_migrated_to_supabase'

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  due_date?: Date
  completed: boolean
  completed_at?: Date
  plant_id?: string
  project_id?: string
  category: string
  priority: string
  created_at: Date
  updated_at: Date
}

export interface CreateTaskInput {
  title: string
  description?: string
  due_date?: Date
  category?: string
  priority?: string
  project_id?: string
  plant_id?: string
}

function formatTaskRow(t: Record<string, unknown>): Task {
  const dueDateRaw = t.due_date
  const completedAtRaw = t.completed_at
  const createdAtRaw = t.created_at
  const updatedAtRaw = t.updated_at

  return {
    id: String(t.id ?? ''),
    user_id: String(t.user_id ?? ''),
    title: String(t.title ?? ''),
    description:
      typeof t.description === 'string' && t.description.trim().length > 0
        ? t.description
        : undefined,
    due_date: typeof dueDateRaw === 'string' ? new Date(dueDateRaw) : undefined,
    completed: Boolean(t.completed),
    completed_at: typeof completedAtRaw === 'string' ? new Date(completedAtRaw) : undefined,
    plant_id: typeof t.plant_id === 'string' ? t.plant_id : undefined,
    project_id: typeof t.project_id === 'string' ? t.project_id : undefined,
    category: String(t.category ?? 'other'),
    priority: String(t.priority ?? 'important'),
    created_at: new Date(typeof createdAtRaw === 'string' ? createdAtRaw : Date.now()),
    updated_at: new Date(typeof updatedAtRaw === 'string' ? updatedAtRaw : Date.now()),
  }
}

async function migrateLocalCustomTasks(userId: string): Promise<void> {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(CUSTOM_TASKS_MIGRATION_KEY) === userId) return

  const saved = localStorage.getItem('customTasks')
  if (!saved) {
    localStorage.setItem(CUSTOM_TASKS_MIGRATION_KEY, userId)
    return
  }

  try {
    const customTasks: Array<{
      id: string
      activity: string
      details: string
      completed: boolean
      dueDate: string
      category: string
      priority?: string
      projectId?: string
    }> = JSON.parse(saved)

    if (customTasks.length > 0) {
      const rows = customTasks.map((task) => ({
        user_id: userId,
        title: task.activity,
        description: task.details || null,
        due_date: task.dueDate?.includes('T')
          ? task.dueDate
          : new Date(`${task.dueDate}T00:00:00`).toISOString(),
        completed: task.completed,
        completed_at: task.completed ? new Date().toISOString() : null,
        category: task.category || 'other',
        priority: task.priority || 'important',
        project_id: task.projectId || null,
      }))

      const { error } = await supabase.from('user_tasks').insert(rows)
      if (error) throw error
    }

    localStorage.removeItem('customTasks')
    localStorage.setItem(CUSTOM_TASKS_MIGRATION_KEY, userId)
  } catch (error) {
    console.error('Error migrating custom tasks to Supabase:', error)
  }
}

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setTasks([])
      setLoading(false)
      return
    }

    try {
      await migrateLocalCustomTasks(userId)

      const { data, error } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true })

      if (error) throw error

      setTasks((data || []).map(formatTaskRow))
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = useCallback(
    async (
      input: CreateTaskInput | string,
      due_date?: Date,
      category = 'other'
    ) => {
      if (!userId) return

      const payload: CreateTaskInput =
        typeof input === 'string'
          ? { title: input, due_date, category }
          : input

      try {
        const { data, error } = await supabase
          .from('user_tasks')
          .insert({
            user_id: userId,
            title: payload.title,
            description: payload.description ?? null,
            due_date: payload.due_date?.toISOString() ?? null,
            category: payload.category ?? 'other',
            priority: payload.priority ?? 'important',
            project_id: payload.project_id ?? null,
            plant_id: payload.plant_id ?? null,
            completed: false,
          })
          .select()

        if (error) throw error

        await fetchTasks()
        return data?.[0]
      } catch (error) {
        console.error('Error adding task:', error)
      }
    },
    [userId, fetchTasks]
  )

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<CreateTaskInput> & { completed?: boolean }) => {
      if (!userId) return

      try {
        const row: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        }

        if (updates.title !== undefined) row.title = updates.title
        if (updates.description !== undefined) row.description = updates.description
        if (updates.due_date !== undefined) {
          row.due_date = updates.due_date?.toISOString() ?? null
        }
        if (updates.category !== undefined) row.category = updates.category
        if (updates.priority !== undefined) row.priority = updates.priority
        if (updates.project_id !== undefined) row.project_id = updates.project_id || null
        if (updates.plant_id !== undefined) row.plant_id = updates.plant_id || null
        if (updates.completed !== undefined) {
          row.completed = updates.completed
          row.completed_at = updates.completed ? new Date().toISOString() : null
        }

        const { error } = await supabase
          .from('user_tasks')
          .update(row)
          .eq('id', taskId)
          .eq('user_id', userId)

        if (error) throw error
        await fetchTasks()
      } catch (error) {
        console.error('Error updating task:', error)
      }
    },
    [userId, fetchTasks]
  )

  const completeTask = useCallback(
    async (taskId: string) => {
      await updateTask(taskId, { completed: true })
    },
    [updateTask]
  )

  const toggleTaskComplete = useCallback(
    async (taskId: string, completed: boolean) => {
      await updateTask(taskId, { completed })
    },
    [updateTask]
  )

  const deleteTask = useCallback(
    async (taskId: string) => {
      try {
        await supabase.from('user_tasks').delete().eq('id', taskId).eq('user_id', userId)

        await fetchTasks()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    },
    [userId, fetchTasks]
  )

  const clearProjectFromTasks = useCallback(
    async (projectId: string) => {
      if (!userId) return
      const affected = tasks.filter((t) => t.project_id === projectId)
      await Promise.all(
        affected.map((t) => updateTask(t.id, { project_id: undefined }))
      )
    },
    [userId, tasks, updateTask]
  )

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    completeTask,
    toggleTaskComplete,
    deleteTask,
    clearProjectFromTasks,
    refetch: fetchTasks,
  }
}
