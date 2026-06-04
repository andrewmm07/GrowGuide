'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useGarden, GardenPlant as ContextGardenPlant } from '@/app/context/GardenContext';
import { PlantPicker } from './PlantPicker';
import { PlantsList } from './PlantsList';
import { generatePlantSchedule, PlantSchedule } from '@/lib/scheduleService';
import { schedulePhaseForPlant } from '@/lib/plantCareSchedule';
import { scheduleFromGenerated } from '@/lib/gardenScheduleRefresh';
import { getPlantZoneMetaForZone, type PlantZoneMeta } from '@/lib/plantTimelineService';
import toast from 'react-hot-toast';

export interface GardenPlant {
  id: string;
  name: string;
  sowDate?: Date;
  schedule?: PlantSchedule;
  plantingMethod: 'seed' | 'seedling';
  harvested?: boolean;
  notes?: string;
}

export function GardenPlannerView() {
  const { userLocation, locationLoading } = useAuth();
  const { plants: contextPlants, addPlant, updatePlant, removePlant, loading } = useGarden();
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [zoneMetaByPlant, setZoneMetaByPlant] = useState<Map<string, PlantZoneMeta>>(new Map());
  const notesTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (!userLocation?.auHardinessZone) {
      setZoneMetaByPlant(new Map());
      return;
    }

    getPlantZoneMetaForZone(userLocation.auHardinessZone)
      .then((rows) => {
        setZoneMetaByPlant(new Map(rows.map((row) => [row.plantName, row])));
      })
      .catch((err) => console.error('Failed to load plant zone metadata:', err));
  }, [userLocation?.auHardinessZone]);

  // Convert context plants to GardenPlant format and load schedules
  useEffect(() => {
    async function convertAndLoadSchedules() {
      if (loading) return

      if (!contextPlants.length || !userLocation?.auHardinessZone) {
        setGardenPlants([]);
        return;
      }

      const plantsWithSchedules = await Promise.all(
        contextPlants
          .filter((p) => !p.isHarvested)
          .map(async (p) => {
            const contextPlant = {
              ...p,
              fullSchedule: p.fullSchedule,
            }
            const plant: GardenPlant = {
              id: p.id || `${p.name}-${Date.now()}`,
              name: p.name,
              sowDate: p.datePlanted ? new Date(p.datePlanted) : undefined,
              plantingMethod: p.type === 'seed' ? 'seed' : 'seedling',
              harvested: p.isHarvested || false,
              notes: p.notes || '',
            }
            if (!plant.sowDate) return plant
            try {
              const phase = schedulePhaseForPlant(contextPlant)
              const schedule = await generatePlantSchedule(
                plant.name,
                userLocation,
                plant.sowDate,
                phase
              )
              return { ...plant, schedule }
            } catch (err) {
              console.error(`Failed to load schedule for ${plant.name}:`, err)
              return plant
            }
          })
      );

      setGardenPlants(plantsWithSchedules);
    }

    convertAndLoadSchedules();
  }, [contextPlants, userLocation, loading]);

  if (locationLoading || loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 animate-pulse">
        <p className="text-gray-400 text-sm">Loading garden planner...</p>
      </div>
    );
  }

  if (!userLocation?.auHardinessZone) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">
          Please set your location first to see zone-specific plants and schedules.
        </p>
      </div>
    );
  }

  async function handlePlantSelect(plantName: string, plantingMethod: 'seed' | 'seedling') {
    const plantedDate = new Date();
    const plantId = `${plantName}-${Date.now()}`;

    if (!userLocation) {
      console.error('User location not set');
      return;
    }

    setLoadingSchedules((prev) => new Set([...prev, plantId]));

    try {
      const phase = plantingMethod === 'seed' ? 'sow' : 'established';
      const schedule = await generatePlantSchedule(
        plantName,
        userLocation,
        plantedDate,
        phase
      );

      const plantPayload = {
        name: plantName,
        datePlanted: plantedDate.toISOString(),
        type: plantingMethod === 'seed' ? ('seed' as const) : ('seedling' as const),
        activityType: plantingMethod === 'seed' ? ('sow' as const) : ('plant' as const),
      };

      const newPlant = await addPlant({
        ...plantPayload,
        fullSchedule: scheduleFromGenerated(schedule, phase),
      });

      // The context will trigger a re-render via useEffect above
      toast.success(`${plantName} added to garden!`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to add plant';
      toast.error(message);
      console.error('Add plant error:', err);
    } finally {
      setLoadingSchedules((prev) => {
        const next = new Set(prev);
        next.delete(plantId);
        return next;
      });
    }
  }

  async function handleRemovePlant(plantId: string) {
    const contextPlant = contextPlants.find((p) => p.id === plantId);
    if (!contextPlant) return;

    try {
      // Remove via context (persists to database)
      await removePlant(contextPlant);
      toast.success('Plant removed from garden');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove plant';
      toast.error(message);
      console.error('Remove plant error:', err);
    }
  }

  async function handleHarvestPlant(plantId: string) {
    const contextPlant = contextPlants.find((p) => p.id === plantId);
    if (!contextPlant) return;

    const newHarvestedState = !contextPlant.isHarvested;

    try {
      // Update via context (persists to database)
      await updatePlant(contextPlant, {
        isHarvested: newHarvestedState,
        harvestedDate: newHarvestedState ? new Date().toISOString() : undefined,
      });

      toast.success(newHarvestedState ? `${contextPlant.name} harvested!` : `${contextPlant.name} moved to active`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update harvest status';
      toast.error(message);
      console.error('Harvest plant error:', err);
    }
  }

  async function handleUpdatePlantingMethod(
    plantId: string,
    method: 'seed' | 'seedling'
  ) {
    const contextPlant = contextPlants.find((p) => p.id === plantId);
    const plant = gardenPlants.find((p) => p.id === plantId);
    if (!contextPlant || !plant || !userLocation) return;

    setLoadingSchedules((prev) => new Set([...prev, plantId]));

    // Optimistic update — button changes colour immediately without waiting for DB/schedule
    setGardenPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, plantingMethod: method } : p))
    );

    try {
      const phase = method === 'seed' ? 'sow' : 'established';
      const anchorDate =
        method === 'seedling' ? new Date() : plant.sowDate ?? new Date();

      const schedule = await generatePlantSchedule(
        plant.name,
        userLocation,
        anchorDate,
        phase
      );

      await updatePlant(contextPlant, {
        type: method === 'seed' ? 'seed' : 'seedling',
        activityType: method === 'seed' ? 'sow' : 'plant',
        datePlanted: anchorDate.toISOString(),
        fullSchedule: scheduleFromGenerated(schedule, phase),
      });

      setGardenPlants((prev) =>
        prev.map((p) =>
          p.id === plantId
            ? {
                ...p,
                plantingMethod: method,
                sowDate: anchorDate,
                schedule,
              }
            : p
        )
      );

      toast.success('Planting method updated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update planting method';
      toast.error(message);
      console.error('Update planting method error:', err);
    } finally {
      setLoadingSchedules((prev) => {
        const next = new Set(prev);
        next.delete(plantId);
        return next;
      });
    }
  }

  async function handleUpdateSowDate(plantId: string, sowDate: Date) {
    const contextPlant = contextPlants.find((p) => p.id === plantId);
    const plant = gardenPlants.find((p) => p.id === plantId);
    if (!contextPlant || !plant || !userLocation) return;

    setLoadingSchedules((prev) => new Set([...prev, plantId]));

    try {
      const phase = schedulePhaseForPlant(contextPlant);
      const schedule = await generatePlantSchedule(
        plant.name,
        userLocation,
        sowDate,
        phase
      );

      await updatePlant(contextPlant, {
        datePlanted: sowDate.toISOString(),
        fullSchedule: scheduleFromGenerated(schedule, phase),
      });

      setGardenPlants((prev) =>
        prev.map((p) =>
          p.id === plantId
            ? {
                ...p,
                sowDate,
                schedule,
              }
            : p
        )
      );

      toast.success('Sow date updated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update sow date';
      toast.error(message);
      console.error('Update sow date error:', err);
    } finally {
      setLoadingSchedules((prev) => {
        const next = new Set(prev);
        next.delete(plantId);
        return next;
      });
    }
  }

  function handleUpdateNotes(plantId: string, notes: string) {
    const contextPlant = contextPlants.find((p) => p.id === plantId);
    if (!contextPlant) return;

    // Update local editing state immediately (independent from gardenPlants)
    setEditingNotes((prev) => ({ ...prev, [plantId]: notes }));

    // Clear existing timer for this plant
    const existingTimer = notesTimersRef.current.get(plantId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Debounce: save to database 500ms after last keystroke
    const timer = setTimeout(() => {
      try {
        updatePlant(contextPlant, { notes });
        // Keep editingNotes so textarea continues showing what user typed
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save notes';
        toast.error(message);
        console.error('Update notes error:', err);
      }
      notesTimersRef.current.delete(plantId);
    }, 500);

    notesTimersRef.current.set(plantId, timer);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="inline-flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-3 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Loading your garden...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {gardenPlants.length > 0 && (
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Your Garden ({gardenPlants.length}{' '}
          {gardenPlants.length === 1 ? 'plant' : 'plants'})
        </h2>
      )}

      <PlantPicker
        onPlantSelect={handlePlantSelect}
        zoneMeta={zoneMetaByPlant.size > 0 ? [...zoneMetaByPlant.values()] : undefined}
        collapsible={gardenPlants.length > 0}
        defaultOpen={gardenPlants.length === 0}
      />

      {gardenPlants.length > 0 && (
        <PlantsList
          plants={gardenPlants}
          onRemovePlant={handleRemovePlant}
          onUpdateSowDate={handleUpdateSowDate}
          onUpdatePlantingMethod={handleUpdatePlantingMethod}
          onHarvestPlant={handleHarvestPlant}
          onUpdateNotes={handleUpdateNotes}
          loadingSchedules={loadingSchedules}
          userLocation={userLocation}
          editingNotes={editingNotes}
          zoneMetaByPlant={zoneMetaByPlant}
        />
      )}
    </div>
  );
}

export default GardenPlannerView;
