'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/app/lib/supabase'

const PROJECTS_MIGRATION_KEY = 'projects_migrated_to_supabase'

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  color: string
  created_at: Date
  updated_at: Date
}

export interface CreateProjectInput {
  name: string
  description?: string
  color?: string
}

function formatProjectRow(row: Record<string, unknown>): Project {
  const createdAtRaw = row.created_at
  const updatedAtRaw = row.updated_at

  return {
    id: String(row.id ?? ''),
    user_id: String(row.user_id ?? ''),
    name: String(row.name ?? ''),
    description:
      typeof row.description === 'string' && row.description.trim().length > 0
        ? row.description
        : undefined,
    color: String(row.color ?? '#10b981'),
    created_at: new Date(typeof createdAtRaw === 'string' ? createdAtRaw : Date.now()),
    updated_at: new Date(typeof updatedAtRaw === 'string' ? updatedAtRaw : Date.now()),
  }
}

async function migrateLocalProjects(userId: string): Promise<void> {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(PROJECTS_MIGRATION_KEY) === userId) return

  const saved = localStorage.getItem('projects')
  if (!saved) {
    localStorage.setItem(PROJECTS_MIGRATION_KEY, userId)
    return
  }

  try {
    const localProjects: Array<{
      id: string
      name: string
      description?: string
      color: string
      createdAt?: string
    }> = JSON.parse(saved)

    if (localProjects.length === 0) {
      localStorage.removeItem('projects')
      localStorage.setItem(PROJECTS_MIGRATION_KEY, userId)
      return
    }

    const idMap = new Map<string, string>()

    for (const project of localProjects) {
      const { data, error } = await supabase
        .from('user_projects')
        .insert({
          user_id: userId,
          name: project.name,
          description: project.description || null,
          color: project.color || '#10b981',
        })
        .select('id')
        .single()

      if (error) throw error
      if (data?.id) idMap.set(project.id, data.id as string)
    }

    for (const [oldId, newId] of idMap) {
      const { error } = await supabase
        .from('user_tasks')
        .update({ project_id: newId })
        .eq('user_id', userId)
        .eq('project_id', oldId)

      if (error) throw error
    }

    localStorage.removeItem('projects')
    localStorage.setItem(PROJECTS_MIGRATION_KEY, userId)
  } catch (error) {
    console.error('Error migrating projects to Supabase:', error)
  }
}

export function useProjects(userId: string | undefined) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    if (!userId) {
      setProjects([])
      setLoading(false)
      return
    }

    try {
      await migrateLocalProjects(userId)

      const { data, error } = await supabase
        .from('user_projects')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true })

      if (error) throw error

      setProjects((data || []).map(formatProjectRow))
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const addProject = useCallback(
    async (input: CreateProjectInput) => {
      if (!userId) return

      try {
        const { data, error } = await supabase
          .from('user_projects')
          .insert({
            user_id: userId,
            name: input.name,
            description: input.description ?? null,
            color: input.color ?? '#10b981',
          })
          .select()

        if (error) throw error

        await fetchProjects()
        return data?.[0]
      } catch (error) {
        console.error('Error adding project:', error)
      }
    },
    [userId, fetchProjects]
  )

  const deleteProject = useCallback(
    async (projectId: string) => {
      if (!userId) return

      try {
        const { error } = await supabase
          .from('user_projects')
          .delete()
          .eq('id', projectId)
          .eq('user_id', userId)

        if (error) throw error

        await fetchProjects()
      } catch (error) {
        console.error('Error deleting project:', error)
        throw error
      }
    },
    [userId, fetchProjects]
  )

  return {
    projects,
    loading,
    addProject,
    deleteProject,
    refetch: fetchProjects,
  }
}
