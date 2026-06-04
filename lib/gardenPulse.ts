import type { PlantLifespanGroup } from '@/lib/plantLifespan';

export const HARVEST_SOON_DAYS = 14;

export type GardenListFilter =
  | 'all'
  | 'harvesting_soon'
  | 'in_harvest'
  | 'missing_date'
  | 'annual'
  | 'perennial';

export interface GardenPulsePlant {
  name: string;
  harvested?: boolean;
  sowDate?: Date;
  schedule?: {
    harvestStartDate?: Date;
    harvestEndDate?: Date;
  };
}

export interface GardenPulseStats {
  totalActive: number;
  harvestingSoon: number;
  inHarvestWindow: number;
  missingSowDate: number;
  annualCount: number;
  perennialCount: number;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isInHarvestWindow(
  schedule: GardenPulsePlant['schedule'],
  now = new Date()
): boolean {
  const start = schedule?.harvestStartDate;
  const end = schedule?.harvestEndDate;
  if (!start || !end) return false;
  const t = startOfDay(now).getTime();
  return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime();
}

export function isHarvestingSoon(
  schedule: GardenPulsePlant['schedule'],
  now = new Date()
): boolean {
  const start = schedule?.harvestStartDate;
  if (!start) return false;
  if (isInHarvestWindow(schedule, now)) return true;
  const days =
    (startOfDay(start).getTime() - startOfDay(now).getTime()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= HARVEST_SOON_DAYS;
}

export function computeGardenPulse(
  plants: GardenPulsePlant[],
  getLifespan: (plant: GardenPulsePlant) => PlantLifespanGroup | null
): GardenPulseStats {
  const active = plants.filter((p) => !p.harvested);
  const now = new Date();

  let harvestingSoon = 0;
  let inHarvestWindow = 0;
  let missingSowDate = 0;
  let annualCount = 0;
  let perennialCount = 0;

  for (const plant of active) {
    if (!plant.sowDate) missingSowDate += 1;
    if (isInHarvestWindow(plant.schedule, now)) inHarvestWindow += 1;
    else if (isHarvestingSoon(plant.schedule, now)) harvestingSoon += 1;

    const lifespan = getLifespan(plant);
    if (lifespan === 'annual') annualCount += 1;
    else if (lifespan === 'perennial') perennialCount += 1;
  }

  return {
    totalActive: active.length,
    harvestingSoon,
    inHarvestWindow,
    missingSowDate,
    annualCount,
    perennialCount,
  };
}

export function plantMatchesGardenFilter(
  plant: GardenPulsePlant,
  filter: GardenListFilter,
  getLifespan: (plant: GardenPulsePlant) => PlantLifespanGroup | null,
  now = new Date()
): boolean {
  if (filter === 'all') return true;
  if (filter === 'missing_date') return !plant.sowDate;
  if (filter === 'annual') return getLifespan(plant) === 'annual';
  if (filter === 'perennial') return getLifespan(plant) === 'perennial';
  if (filter === 'in_harvest') return isInHarvestWindow(plant.schedule, now);
  if (filter === 'harvesting_soon') return isHarvestingSoon(plant.schedule, now);
  return true;
}
