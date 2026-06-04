'use client'

import React, { useCallback, useMemo, useState } from 'react';
import { GardenPlant } from './GardenPlannerView';
import { ScheduleDisplay } from './ScheduleDisplay';
import {
  PlantSuitabilityInsight,
} from './PlantSuitabilityBadge';
import { evaluatePlantSuitability } from '@/lib/plantSuitabilityService';
import type { PlantZoneMeta } from '@/lib/plantTimelineService';
import type { UserLocation } from '@/lib/types/location';
import {
  plantMatchesGardenFilter,
  type GardenListFilter,
} from '@/lib/gardenPulse';
import {
  LIFESPAN_SECTION_LABELS,
  LIFESPAN_SECTION_ORDER,
  LIFESPAN_SECTION_STYLES,
  plantLifespanFromCategory,
  type PlantLifespanGroup,
} from '@/lib/plantLifespan';
import { PERENNIAL_SECTION_SUMMARY } from '@/lib/perennialPlanting';
import { plantMatchesPickerQuery } from '@/lib/planting/plantPickerSearch';
import toast from 'react-hot-toast';

interface PlantsListProps {
  plants: GardenPlant[];
  onRemovePlant: (plantId: string) => void;
  onUpdateSowDate: (plantId: string, sowDate: Date) => void;
  onUpdatePlantingMethod: (plantId: string, method: 'seed' | 'seedling') => void;
  onHarvestPlant: (plantId: string) => void;
  onUpdateNotes: (plantId: string, notes: string) => void;
  loadingSchedules: Set<string>;
  userLocation: UserLocation;
  editingNotes: Record<string, string>;
  zoneMetaByPlant?: Map<string, PlantZoneMeta>;
}

type SortType = 'harvest' | 'alpha';

export function PlantsList({
  plants,
  onRemovePlant,
  onUpdateSowDate,
  onUpdatePlantingMethod,
  onHarvestPlant,
  onUpdateNotes,
  loadingSchedules,
  userLocation,
  editingNotes,
  zoneMetaByPlant = new Map(),
}: PlantsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortType, setSortType] = useState<SortType>('harvest');
  const [selectedPlants, setSelectedPlants] = useState<Set<string>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<PlantLifespanGroup>>(
    new Set()
  );
  const [gardenSearch, setGardenSearch] = useState('');
  const [listFilter, setListFilter] = useState<GardenListFilter>('all');

  const getLifespan = useCallback(
    (plant: { name: string }): PlantLifespanGroup | null =>
      plantLifespanFromCategory(zoneMetaByPlant.get(plant.name)?.plantCategory),
    [zoneMetaByPlant]
  );

  const suitabilityByPlantId = useMemo(() => {
    const map = new Map<string, ReturnType<typeof evaluatePlantSuitability>>();
    for (const plant of plants) {
      map.set(
        plant.id,
        evaluatePlantSuitability(plant.name, userLocation, {
          plantingMethod: plant.plantingMethod,
          referenceDate: plant.sowDate ?? new Date(),
          zoneMeta: zoneMetaByPlant.get(plant.name),
        })
      );
    }
    return map;
  }, [plants, userLocation, zoneMetaByPlant]);

  const activePlants = plants.filter((p) => !p.harvested);

  const filteredActivePlants = useMemo(() => {
    return activePlants.filter((plant) => {
      if (gardenSearch.trim() && !plantMatchesPickerQuery(plant.name, gardenSearch)) {
        return false;
      }
      return plantMatchesGardenFilter(plant, listFilter, getLifespan);
    });
  }, [activePlants, gardenSearch, listFilter, getLifespan]);

  const sortedActivePlants = [...filteredActivePlants].sort((a, b) => {
    if (sortType === 'alpha') {
      return a.name.localeCompare(b.name);
    }
    // Sort by harvest date
    if (a.schedule?.harvestStartDate && b.schedule?.harvestStartDate) {
      return (
        a.schedule.harvestStartDate.getTime() -
        b.schedule.harvestStartDate.getTime()
      );
    }
    return 0;
  });

  const plantsByLifespan = useMemo(() => {
    const groups: Record<PlantLifespanGroup, GardenPlant[]> = {
      annual: [],
      perennial: [],
    };
    const uncategorized: GardenPlant[] = [];

    for (const plant of sortedActivePlants) {
      const category = zoneMetaByPlant.get(plant.name)?.plantCategory;
      const lifespan = plantLifespanFromCategory(category);
      if (lifespan) {
        groups[lifespan].push(plant);
      } else {
        uncategorized.push(plant);
      }
    }

    if (uncategorized.length > 0) {
      groups.annual.push(...uncategorized);
    }

    return groups;
  }, [sortedActivePlants, zoneMetaByPlant]);

  const lifespanSections = useMemo(
    () =>
      LIFESPAN_SECTION_ORDER.map((key) => ({
        key,
        label: LIFESPAN_SECTION_LABELS[key],
        subtitle: key === 'perennial' ? PERENNIAL_SECTION_SUMMARY : undefined,
        plants: plantsByLifespan[key],
      })).filter((section) => section.plants.length > 0),
    [plantsByLifespan]
  );

  const showLifespanHeaders = lifespanSections.length > 1;

  const expandAllSections = () => setCollapsedSections(new Set());
  const collapseAllSections = () =>
    setCollapsedSections(new Set(lifespanSections.map((s) => s.key)));

  const toggleSectionCollapsed = (key: PlantLifespanGroup) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleToggleSelect = (plantId: string) => {
    setSelectedPlants((prev) => {
      const next = new Set(prev);
      if (next.has(plantId)) {
        next.delete(plantId);
      } else {
        next.add(plantId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedPlants.size === sortedActivePlants.length) {
      // Deselect all
      setSelectedPlants(new Set());
    } else {
      // Select all
      setSelectedPlants(new Set(sortedActivePlants.map((p) => p.id)));
    }
  };

  const handleBulkHarvest = async () => {
    if (selectedPlants.size === 0) return;

    const count = selectedPlants.size;

    for (const plantId of selectedPlants) {
      await onHarvestPlant(plantId);
      await new Promise((resolve) => setTimeout(resolve, 150)); // Wait for DB update and re-render
    }

    setSelectedPlants(new Set());
    toast.success(`${count} plant(s) harvested`);
  };

  const handleBulkDelete = async () => {
    if (selectedPlants.size === 0) return;

    const plantNames = sortedActivePlants
      .filter((p) => selectedPlants.has(p.id))
      .map((p) => p.name)
      .join(', ');

    if (!window.confirm(`Delete ${selectedPlants.size} plant(s)? ${plantNames}`)) {
      return;
    }

    const count = selectedPlants.size;

    for (const plantId of selectedPlants) {
      onRemovePlant(plantId);
      await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for DB update
    }

    setSelectedPlants(new Set());
    toast.success(`${count} plant(s) deleted`);
  };

  const formatDateRange = (startDate: Date, endDate: Date): string => {
    const start = startDate.toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
    });
    const end = endDate.toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
    });
    return `${start} – ${end}`;
  };

  const harvestLabel =
    (plant: GardenPlant) =>
      plant.schedule?.harvestStartDate && plant.schedule?.harvestEndDate
        ? formatDateRange(
            plant.schedule.harvestStartDate,
            plant.schedule.harvestEndDate
          )
        : '—';

  const renderPlantRow = (plant: GardenPlant, lifespan: PlantLifespanGroup | null) => {
    const isExpanded = expandedId === plant.id;
    const suitability = suitabilityByPlantId.get(plant.id);
    const rowAccent =
      lifespan && LIFESPAN_SECTION_STYLES[lifespan]
        ? `border-l-4 ${LIFESPAN_SECTION_STYLES[lifespan].rowAccent}`
        : '';

    const harvestText = harvestLabel(plant);

    return (
      <div key={plant.id}>
        <div
          className={`w-full px-2.5 sm:px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2
            md:grid md:grid-cols-[32px_1fr_minmax(0,max-content)_28px] md:gap-x-2 md:items-center ${rowAccent}`}
        >
          <div className="shrink-0 flex justify-center md:col-start-1">
            <input
              type="checkbox"
              checked={selectedPlants.has(plant.id)}
              onChange={() => handleToggleSelect(plant.id)}
              className="w-3.5 h-3.5 rounded border-gray-300 cursor-pointer"
            />
          </div>
          <button
            type="button"
            onClick={() => setExpandedId(isExpanded ? null : plant.id)}
            className="flex-1 min-w-0 text-left hover:text-green-700 transition-colors md:col-start-2"
          >
            <div className="text-sm font-medium text-gray-900 truncate leading-tight">
              {plant.name}
            </div>
            <div className="text-[11px] text-gray-500 truncate leading-snug mt-0.5 md:hidden">
              {harvestText}
            </div>
          </button>
          <div className="hidden md:block md:col-start-3 text-xs text-gray-600 text-right whitespace-nowrap">
            {harvestText}
          </div>
          <div className="shrink-0 md:col-start-4 flex justify-end">
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : plant.id)}
              className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              <span
                className={`text-[10px] transition-transform inline-block ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="px-2.5 sm:px-3 py-2.5 bg-gray-50 border-t border-gray-200 space-y-2.5">
            {suitability && <PlantSuitabilityInsight assessment={suitability} />}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[auto_auto_1fr] sm:items-end sm:gap-x-3">
              <div>
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                  Planted
                </label>
                <input
                  type="date"
                  value={
                    plant.sowDate ? plant.sowDate.toISOString().split('T')[0] : ''
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      onUpdateSowDate(plant.id, new Date(e.target.value));
                    }
                  }}
                  className="border border-gray-300 rounded px-1.5 py-1 text-xs text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-300"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                  Method
                </label>
                <div className="inline-flex rounded border border-gray-200 bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => onUpdatePlantingMethod(plant.id, 'seed')}
                    className={`px-2 h-7 rounded-[4px] text-[11px] font-medium transition-colors ${
                      plant.plantingMethod === 'seed'
                        ? 'bg-green-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Seed
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdatePlantingMethod(plant.id, 'seedling')}
                    className={`px-2 h-7 rounded-[4px] text-[11px] font-medium transition-colors ${
                      plant.plantingMethod === 'seedling'
                        ? 'bg-green-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Seedling
                  </button>
                </div>
              </div>

              <div className="sm:min-w-0">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mb-0.5">
                  Notes
                </label>
                <textarea
                  value={editingNotes[plant.id] ?? plant.notes ?? ''}
                  onChange={(e) => onUpdateNotes(plant.id, e.target.value)}
                  placeholder="Variety, bed, etc."
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-300 resize-none bg-white"
                  rows={2}
                />
              </div>
            </div>

            {loadingSchedules.has(plant.id) ? (
              <div className="flex justify-center py-3">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[11px] text-gray-600">Generating schedule…</span>
                </div>
              </div>
            ) : plant.schedule ? (
              <div className="pt-1.5 border-t border-gray-200">
                <ScheduleDisplay
                  schedule={plant.schedule}
                  plantingMethod={plant.plantingMethod}
                  compact
                />
              </div>
            ) : (
              <div className="text-xs text-gray-600">
                Set a planted date to see the schedule
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const listFilterActive = listFilter !== 'all' || gardenSearch.trim().length > 0;

  return (
    <div className="space-y-3">
      <div>
        <input
          type="search"
          value={gardenSearch}
          onChange={(e) => setGardenSearch(e.target.value)}
          placeholder="Search your garden…"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-300"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['all', 'All'],
            ['harvesting_soon', 'Harvest soon'],
            ['in_harvest', 'Harvesting now'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setListFilter(key)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              listFilter === key
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sort Controls & Bulk Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSortType('harvest')}
            className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              sortType === 'harvest'
                ? 'bg-gray-200 text-gray-900 border border-gray-400'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500'
            }`}
          >
            By harvest
          </button>
          <button
            onClick={() => setSortType('alpha')}
            className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              sortType === 'alpha'
                ? 'bg-gray-200 text-gray-900 border border-gray-400'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500'
            }`}
          >
            A–Z
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedPlants.size > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">
              {selectedPlants.size} selected
            </span>
            <button
              onClick={handleBulkHarvest}
              className="px-3 py-2 text-sm font-medium rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Harvest
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 text-sm font-medium rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {showLifespanHeaders && (
        <div className="flex justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={expandAllSections}
            className="text-green-700 font-medium hover:underline"
          >
            Expand all
          </button>
          <span className="text-gray-300" aria-hidden>
            |
          </span>
          <button
            type="button"
            onClick={collapseAllSections}
            className="text-gray-600 font-medium hover:underline"
          >
            Collapse all
          </button>
        </div>
      )}

      {listFilterActive && (
        <p className="text-xs text-gray-600 px-0.5">
          Showing {sortedActivePlants.length} of {activePlants.length} plants
        </p>
      )}

      {/* Header Row — tablet/desktop table */}
      <div className="hidden md:grid md:grid-cols-[32px_1fr_minmax(0,max-content)_28px] gap-2 px-3 py-2 border-b border-gray-200 text-[10px] font-semibold text-gray-500 uppercase tracking-wide items-center">
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={selectedPlants.size > 0 && selectedPlants.size === sortedActivePlants.length}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            title={selectedPlants.size === sortedActivePlants.length ? "Deselect all" : "Select all"}
          />
        </div>
        <div>Plant</div>
        <div className="text-right whitespace-nowrap">Harvest window</div>
        <div></div>
      </div>

      {/* Mobile select-all */}
      {sortedActivePlants.length > 0 && (
        <div className="flex items-center gap-2 px-1 md:hidden">
          <input
            type="checkbox"
            checked={selectedPlants.size > 0 && selectedPlants.size === sortedActivePlants.length}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            title={selectedPlants.size === sortedActivePlants.length ? 'Deselect all' : 'Select all'}
          />
          <span className="text-xs text-gray-600">Select all</span>
        </div>
      )}

      {/* Active Plants List */}
      <div className="border border-gray-200 rounded-lg bg-white divide-y divide-gray-200">
        {activePlants.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-600">
            No active plants
          </div>
        ) : sortedActivePlants.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-600">
            No plants match your search or filter.
          </div>
        ) : (
          lifespanSections.map((section) => {
            const isCollapsed = collapsedSections.has(section.key);
            const styles = LIFESPAN_SECTION_STYLES[section.key];

            return (
              <div key={section.key}>
                {showLifespanHeaders && (
                  <button
                    type="button"
                    onClick={() => toggleSectionCollapsed(section.key)}
                    className={`w-full px-2.5 sm:px-3 py-2 border-b flex items-center justify-between gap-2 text-left transition-colors ${styles.headerBg} ${styles.headerBorder} hover:brightness-[0.98]`}
                    aria-expanded={!isCollapsed}
                    aria-controls={`garden-section-${section.key}`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                        <span aria-hidden>{styles.icon}</span>
                        {section.label}
                        <span className="font-semibold text-gray-500 normal-case tracking-normal">
                          ({section.plants.length})
                        </span>
                      </span>
                      {section.subtitle && (
                        <p className="mt-0.5 pr-2 text-xs font-normal normal-case tracking-normal leading-snug text-gray-600">
                          {section.subtitle}
                        </p>
                      )}
                    </div>
                    <span
                      className={`shrink-0 text-xs text-gray-500 transition-transform ${
                        isCollapsed ? '' : 'rotate-180'
                      }`}
                      aria-hidden
                    >
                      ▼
                    </span>
                  </button>
                )}
                {(!showLifespanHeaders || !isCollapsed) && (
                  <div
                    id={showLifespanHeaders ? `garden-section-${section.key}` : undefined}
                    className="divide-y divide-gray-200"
                  >
                    {section.plants.map((plant) =>
                      renderPlantRow(plant, section.key)
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

export default PlantsList;
