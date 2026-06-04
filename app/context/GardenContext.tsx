'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { supabase } from '@/app/lib/supabase'
import { generatePlantSchedule, type PlantSchedule as GeneratedPlantSchedule } from '@/lib/scheduleService'
import {
  buildRefreshedFullSchedule,
  locationScheduleKey,
  plantScheduleNeedsRefresh,
  scheduleFromGenerated,
} from '@/lib/gardenScheduleRefresh'
import { repairPlantFullSchedule } from '@/lib/plantCareSchedule'
import { useAuth } from './AuthContext'

function toFullSchedule(
  schedule: GeneratedPlantSchedule,
  plant: Pick<GardenPlant, 'type' | 'activityType'>
): FullPlantSchedule {
  const phase = plant.type === 'seedling' || plant.activityType === 'plant' ? 'established' : 'sow'
  return scheduleFromGenerated(schedule, phase) as FullPlantSchedule
}

export interface PlantSchedule {
  week: number
  activity: string
  details: string
  completed: boolean
  dueDate: string
  category: 'planting' | 'fertilizing' | 'pruning' | 'pest' | 'harvest' | 'climate'
}

export interface FullPlantSchedule {
  plantName: string
  zone: string
  climate: string
  growingContextLabel?: string
  microclimateTags?: string[]
  sowDate?: string
  seedlingDate?: string
  harvestStartDate?: string
  harvestEndDate?: string
  sowToSeedling?: number
  seedlingToHarvest?: number
  schedulePhase?: 'sow' | 'established'
  plantingMethod?: 'seed' | 'seedling'
  totalDays: number
  growthMultiplier: number
  wateringFrequencyDays: number
  extraCare: string[]
  activities: Array<{
    daysSincePlanting: number
    activity: string
    details: string
    category: 'fertilizing' | 'pest' | 'planting' | 'pruning' | 'harvest'
    completed?: boolean
  }>
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
  fullSchedule?: FullPlantSchedule
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
    full_schedule: plant.fullSchedule ? JSON.stringify(plant.fullSchedule) : null,
    is_harvested: plant.isHarvested ?? false,
    harvested_date: plant.harvestedDate ?? null,
  }
}

function parseRow(row: Record<string, unknown>): GardenPlant {
  return {
    id: row.id as string,
    name: row.name as string,
    datePlanted: row.date_planted as string,
    type: row.type as GardenPlant['type'],
    activityType: (row.activity_type as GardenPlant['activityType']) ?? undefined,
    location: (row.location as string) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    estimatedHarvest: (row.estimated_harvest as string) ?? undefined,
    schedule: (row.schedule as GardenPlant['schedule']) ?? [],
    fullSchedule: row.full_schedule
      ? (JSON.parse(row.full_schedule as string) as FullPlantSchedule)
      : undefined,
    isHarvested: (row.is_harvested as boolean) ?? false,
    harvestedDate: (row.harvested_date as string) ?? undefined,
  }
}

function fromRow(row: Record<string, unknown>): GardenPlant {
  return repairPlantFullSchedule(parseRow(row))
}

export function GardenProvider({ children }: { children: ReactNode }) {
  const { user, session, userLocation, loading: authLoading } = useAuth()
  const [plants, setLocalPlants] = useState<GardenPlant[]>([])
  const [loading, setLoading] = useState(true)
  const prevLocationKeyRef = useRef<string | null>(null)
  const scheduleRefreshInFlightRef = useRef(false)
  const loadRequestRef = useRef(0)

  const loadGarden = useCallback(async (userId: string) => {
    const requestId = ++loadRequestRef.current
    setLoading(true)

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    const maxAttempts = 3

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (requestId !== loadRequestRef.current) return

      try {
        const { data: { session: activeSession } } = await supabase.auth.getSession()
        if (!activeSession?.access_token) {
          if (attempt < maxAttempts - 1) {
            await delay(300 * (attempt + 1))
            continue
          }
          throw new Error('Auth session not ready for garden load')
        }

        const { data, error } = await supabase
          .from('garden_plants')
          .select('*')
          .eq('user_id', userId)

        if (error) throw error
        if (requestId !== loadRequestRef.current) return

        const rows = data ?? []
        const repaired = rows.map((row) => fromRow(row))
        setLocalPlants(repaired)

        for (let i = 0; i < rows.length; i++) {
          const before = parseRow(rows[i])
          const after = repaired[i]
          if (
            after.id &&
            JSON.stringify(before.fullSchedule) !== JSON.stringify(after.fullSchedule)
          ) {
            await supabase
              .from('garden_plants')
              .update({
                full_schedule: after.fullSchedule ? JSON.stringify(after.fullSchedule) : null,
                updated_at: new Date().toISOString(),
              })
              .eq('id', after.id)
          }
        }

        setLoading(false)
        return
      } catch (err) {
        console.error(`Error loading garden (attempt ${attempt + 1}/${maxAttempts}):`, err)
        if (attempt < maxAttempts - 1) {
          await delay(400 * (attempt + 1))
          continue
        }
        if (requestId === loadRequestRef.current) {
          setLoading(false)
        }
      }
    }
  }, [])

  useEffect(() => {
    prevLocationKeyRef.current = null
    scheduleRefreshInFlightRef.current = false

    if (authLoading) {
      setLoading(true)
      return
    }

    if (user?.id && session?.access_token) {
      loadGarden(user.id)
    } else if (!user) {
      loadRequestRef.current += 1
      setLocalPlants([])
      setLoading(false)
    }
  }, [user?.id, session?.access_token, authLoading, loadGarden])

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
        full_schedule: merged.fullSchedule ? JSON.stringify(merged.fullSchedule) : null,
        is_harvested: merged.isHarvested ?? false,
        harvested_date: merged.harvestedDate ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', plant.id)
    if (error) throw error
    setLocalPlants(prev => prev.map(p => p.id === plant.id ? { ...p, ...updates } : p))
  }, [user?.id])

  useEffect(() => {
    if (!user?.id || !userLocation?.auHardinessZone || loading) return

    const locationKey = locationScheduleKey(userLocation)
    const toRefresh = plants.filter((p) => plantScheduleNeedsRefresh(p, userLocation))
    if (toRefresh.length === 0) {
      prevLocationKeyRef.current = locationKey
      return
    }

    const locationChanged =
      prevLocationKeyRef.current !== null && prevLocationKeyRef.current !== locationKey
    const staleOnLoad = prevLocationKeyRef.current === null

    if (!locationChanged && !staleOnLoad) {
      prevLocationKeyRef.current = locationKey
      return
    }

    if (scheduleRefreshInFlightRef.current) return

    let cancelled = false
    scheduleRefreshInFlightRef.current = true

    ;(async () => {
      try {
        for (const plant of toRefresh) {
          if (cancelled || !plant.id) continue
          const fullSchedule = await buildRefreshedFullSchedule(plant, userLocation)
          if (cancelled) return
          await updatePlant(plant, { fullSchedule: fullSchedule as FullPlantSchedule })
        }
        if (!cancelled) {
          prevLocationKeyRef.current = locationKey
        }
      } catch (err) {
        console.error('Failed to refresh garden schedules for location:', err)
      } finally {
        scheduleRefreshInFlightRef.current = false
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id, userLocation, loading, plants, updatePlant])

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
    if (!userLocation?.auHardinessZone) {
      console.warn('addToGarden: location not set')
      return false
    }
    const exists = plants.some(p => p.name === name && p.activityType === activityType)
    if (exists) return false

    const datePlanted = new Date()
    try {
      const phase = activityType === 'plant' ? 'established' : 'sow'
      const schedule = await generatePlantSchedule(name, userLocation, datePlanted, phase)
      const plantPayload = {
        name,
        datePlanted: datePlanted.toISOString(),
        type: activityType === 'sow' ? ('seed' as const) : ('seedling' as const),
        activityType,
      }
      await addPlant({
        ...plantPayload,
        fullSchedule: toFullSchedule(schedule, plantPayload),
      })
      return true
    } catch (err) {
      console.error('addToGarden: failed to generate or save schedule', err)
      return false
    }
  }, [user?.id, userLocation, plants, addPlant])

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
