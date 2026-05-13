'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { supabase } from '@/app/lib/supabase'
import { useAuth } from './AuthContext'

export interface PlantSchedule {
  week: number
  activity: string
  details: string
  completed: boolean
  dueDate: string
  category: 'planting' | 'fertilizing' | 'pruning' | 'pest' | 'harvest' | 'climate'
}

export interface GardenPlant {
  id?: string
  name: string
  datePlanted: string
  type: 'seed' | 'seedling'
  activityType?: 'sow' | 'plant'
  location?: string
  notes?: string
  estimatedHarvest?: string
  schedule?: PlantSchedule[]
  isHarvested?: boolean
  harvestedDate?: string
}

interface GardenContextType {
  plants: GardenPlant[]
  loading: boolean
  addPlant: (plant: Omit<GardenPlant, 'id'>) => Promise<GardenPlant>
  updatePlant: (plant: GardenPlant, updates: Partial<GardenPlant>) => Promise<void>
  removePlant: (plant: GardenPlant) => Promise<void>
  addToGarden: (name: string, activityType: 'sow' | 'plant') => Promise<boolean>
  removeFromGarden: (name: string, activityType: 'sow' | 'plant') => Promise<void>
  isInGarden: (name: string, activityType: 'sow' | 'plant') => boolean
  setPlants: (plants: GardenPlant[]) => Promise<void>
}

const GardenContext = createContext<GardenContextType>({
  plants: [],
  loading: true,
  addPlant: async () => ({ name: '', datePlanted: '', type: 'seedling' }),
  updatePlant: async () => {},
  removePlant: async () => {},
  addToGarden: async () => false,
  removeFromGarden: async () => {},
  isInGarden: () => false,
  setPlants: async () => {},
})

function toRow(userId: string, plant: Omit<GardenPlant, 'id'>) {
  return {
    user_id: userId,
    name: plant.name,
    date_planted: plant.datePlanted,
    type: plant.type,
    activity_type: plant.activityType ?? null,
    location: plant.location ?? null,
    notes: plant.notes ?? null,
    estimated_harvest: plant.estimatedHarvest ?? null,
    schedule: plant.schedule ?? [],
    is_harvested: plant.isHarvested ?? false,
    harvested_date: plant.harvestedDate ?? null,
  }
}

function fromRow(row: any): GardenPlant {
  return {
    id: row.id,
    name: row.name,
    datePlanted: row.date_planted,
    type: row.type,
    activityType: row.activity_type ?? undefined,
    location: row.location ?? undefined,
    notes: row.notes ?? undefined,
    estimatedHarvest: row.estimated_harvest ?? undefined,
    schedule: row.schedule ?? [],
    isHarvested: row.is_harvested ?? false,
    harvestedDate: row.harvested_date ?? undefined,
  }
}

export function GardenProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [plants, setLocalPlants] = useState<GardenPlant[]>([])
  const [loading, setLoading] = useState(true)

  const loadGarden = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('garden_plants')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setLocalPlants((data ?? []).map(fromRow))
    } catch (err) {
      console.error('Error loading garden:', err)
      setLocalPlants([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.id) {
      loadGarden(user.id)
    } else {
      setLocalPlants([])
      setLoading(false)
    }
  }, [user?.id, loadGarden])

  const addPlant = useCallback(async (plant: Omit<GardenPlant, 'id'>): Promise<GardenPlant> => {
    if (!user?.id) throw new Error('Not authenticated')
    const { data, error } = await supabase
      .from('garden_plants')
      .insert(toRow(user.id, plant))
      .select()
      .single()
    if (error) throw error
    const newPlant = fromRow(data)
    setLocalPlants(prev => [...prev, newPlant])
    return newPlant
  }, [user?.id])

  const updatePlant = useCallback(async (plant: GardenPlant, updates: Partial<GardenPlant>): Promise<void> => {
    if (!user?.id || !plant.id) return
    const merged = { ...plant, ...updates }
    const { error } = await supabase
      .from('garden_plants')
      .update({
        name: merged.name,
        date_planted: merged.datePlanted,
        type: merged.type,
        activity_type: merged.activityType ?? null,
        location: merged.location ?? null,
        notes: merged.notes ?? null,
        estimated_harvest: merged.estimatedHarvest ?? null,
        schedule: merged.schedule ?? [],
        is_harvested: merged.isHarvested ?? false,
        harvested_date: merged.harvestedDate ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', plant.id)
    if (error) throw error
    setLocalPlants(prev => prev.map(p => p.id === plant.id ? { ...p, ...updates } : p))
  }, [user?.id])

  const removePlant = useCallback(async (plant: GardenPlant): Promise<void> => {
    if (!user?.id || !plant.id) return
    const { error } = await supabase
      .from('garden_plants')
      .delete()
      .eq('id', plant.id)
    if (error) throw error
    setLocalPlants(prev => prev.filter(p => p.id !== plant.id))
  }, [user?.id])

  const addToGarden = useCallback(async (name: string, activityType: 'sow' | 'plant'): Promise<boolean> => {
    if (!user?.id) return false
    const exists = plants.some(p => p.name === name && p.activityType === activityType)
    if (exists) return false
    await addPlant({
      name,
      datePlanted: new Date().toISOString(),
      type: activityType === 'sow' ? 'seed' : 'seedling',
      activityType,
    })
    return true
  }, [user?.id, plants, addPlant])

  const removeFromGarden = useCallback(async (name: string, activityType: 'sow' | 'plant'): Promise<void> => {
    if (!user?.id) return
    const plant = plants.find(p => p.name === name && p.activityType === activityType)
    if (plant) await removePlant(plant)
  }, [user?.id, plants, removePlant])

  const isInGarden = useCallback((name: string, activityType: 'sow' | 'plant'): boolean => {
    return plants.some(p => p.name === name && p.activityType === activityType)
  }, [plants])

  const setPlants = useCallback(async (newPlants: GardenPlant[]): Promise<void> => {
    if (!user?.id) return
    // Upsert all plants: update existing (by id), insert new ones
    for (const plant of newPlants) {
      if (plant.id) {
        await updatePlant(plant, plant)
      } else {
        await addPlant(plant)
      }
    }
    // Remove plants that are no longer in the list
    const newIds = new Set(newPlants.map(p => p.id).filter(Boolean))
    for (const existing of plants) {
      if (existing.id && !newIds.has(existing.id)) {
        await removePlant(existing)
      }
    }
  }, [user?.id, plants, addPlant, updatePlant, removePlant])

  return (
    <GardenContext.Provider value={{ plants, loading, addPlant, updatePlant, removePlant, addToGarden, removeFromGarden, isInGarden, setPlants }}>
      {children}
    </GardenContext.Provider>
  )
}

export function useGarden() {
  return useContext(GardenContext)
}
