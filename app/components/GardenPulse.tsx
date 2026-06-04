'use client';

import type { GardenListFilter, GardenPulseStats } from '@/lib/gardenPulse';

interface GardenPulseProps {
  stats: GardenPulseStats;
  activeFilter: GardenListFilter;
  onFilterChange: (filter: GardenListFilter) => void;
}

function PulseChip({
  label,
  count,
  filter,
  activeFilter,
  onSelect,
}: {
  label: string;
  count: number;
  filter: GardenListFilter;
  activeFilter: GardenListFilter;
  onSelect: (f: GardenListFilter) => void;
}) {
  if (count === 0) return null;

  const isActive = activeFilter === filter;

  return (
    <button
      type="button"
      onClick={() => onSelect(isActive ? 'all' : filter)}
      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        isActive
          ? 'bg-green-600 text-white border-green-600'
          : 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
      }`}
    >
      {label}
      <span className="ml-1 opacity-90">({count})</span>
    </button>
  );
}

export function GardenPulse({ stats, activeFilter, onFilterChange }: GardenPulseProps) {
  const hasHarvestPulse = stats.inHarvestWindow > 0 || stats.harvestingSoon > 0;
  const showClear = activeFilter === 'in_harvest' || activeFilter === 'harvesting_soon';

  if (!hasHarvestPulse && !showClear) return null;

  return (
    <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-white px-3 py-3 sm:px-4">
      <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-2">
        Garden pulse
      </p>
      <div className="flex flex-wrap gap-2">
        <PulseChip
          label="Harvesting now"
          count={stats.inHarvestWindow}
          filter="in_harvest"
          activeFilter={activeFilter}
          onSelect={onFilterChange}
        />
        <PulseChip
          label="Harvest soon"
          count={stats.harvestingSoon}
          filter="harvesting_soon"
          activeFilter={activeFilter}
          onSelect={onFilterChange}
        />
        {showClear && (
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 underline hover:text-gray-900"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
}

export default GardenPulse;
