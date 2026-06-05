'use client'

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  getPlantZoneMetaForZone,
  type PlantZoneMeta,
} from '@/lib/plantTimelineService';
import {
  evaluatePlantSuitability,
  filterClimateNotSuitable,
  groupPlantsByTimingOnly,
  partitionNotAdvisedByLifespan,
  rankPlantsBySuitability,
  recommendedActionWarnings,
  timingGroupLabel,
  type GroupedPlantSuitability,
  type PlantSuitabilityAssessment,
} from '@/lib/plantSuitabilityService';
import { LIFESPAN_SECTION_LABELS, LIFESPAN_SECTION_SUMMARIES } from '@/lib/plantLifespan';
import {
  pickerSearchGapHint,
  plantMatchesPickerQuery,
} from '@/lib/planting/plantPickerSearch';
import toast from 'react-hot-toast';

interface PlantPickerProps {
  onPlantSelect: (plantName: string, plantingMethod: 'seed' | 'seedling') => void;
  isLoading?: boolean;
  zoneMeta?: PlantZoneMeta[];
  /** When true, show a collapsed bar until expanded (use when user already has plants). */
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const GROUP_ORDER: (keyof GroupedPlantSuitability)[] = [
  'ideal',
  'good',
  'timingCaution',
  'notAdvised',
];


const SECTION_SUBTITLES: Partial<Record<keyof GroupedPlantSuitability, string>> = {
  timingCaution:
    "This isn't the best window for these plants, so they are likely to struggle.",
  notAdvised:
    'It is the wrong time of year for this crop. They are unlikely to survive.',
};

const CLIMATE_SECTION = {
  title: 'Not suitable for this climate',
  subtitle:
    'These plants are outside their reliable range for your area without protected growing.',
};

function headerClasses(): string {
  return 'bg-gray-100 text-gray-800 border-gray-200';
}

function SectionSubtitle({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || expanded) return;
    setCanExpand(el.scrollHeight > el.clientHeight + 1);
  }, [text, expanded]);

  return (
    <div className="mt-0.5">
      <p
        ref={textRef}
        className={`text-[10px] font-normal normal-case tracking-normal text-gray-600 leading-snug ${
          expanded ? '' : 'line-clamp-2'
        }`}
      >
        {text}
      </p>
      {(canExpand || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-0.5 text-[10px] font-medium text-green-700 hover:text-green-800"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

const MOBILE_LIST_GROUPS: (keyof GroupedPlantSuitability)[] = ['ideal', 'good'];

function PlantingMethodToggle({
  value,
  onChange,
}: {
  value: 'seed' | 'seedling';
  onChange: (method: 'seed' | 'seedling') => void;
}) {
  const base =
    'px-3 h-8 text-xs font-medium rounded-[5px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400';
  return (
    <div
      className="inline-flex shrink-0 rounded-md border border-gray-200 bg-gray-50 p-0.5"
      role="group"
      aria-label="Planting method"
    >
      <button
        type="button"
        onClick={() => onChange('seed')}
        aria-pressed={value === 'seed'}
        className={`${base} ${
          value === 'seed'
            ? 'bg-white text-green-800 shadow-sm ring-1 ring-gray-200'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Seed
      </button>
      <button
        type="button"
        onClick={() => onChange('seedling')}
        aria-pressed={value === 'seedling'}
        className={`${base} ${
          value === 'seedling'
            ? 'bg-white text-green-800 shadow-sm ring-1 ring-gray-200'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Seedling
      </button>
    </div>
  );
}

function PlantListSection({
  title,
  subtitle,
  titleNormalCase = false,
  items,
  selectedPlant,
  onSelect,
}: {
  title: string;
  subtitle?: string;
  titleNormalCase?: boolean;
  items: PlantSuitabilityAssessment[];
  selectedPlant: string;
  onSelect: (name: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <div
        className={`sticky top-0 z-10 px-2 py-1 border-b ${headerClasses()}`}
      >
        <p
          className={`text-[10px] font-bold leading-snug flex-1 min-w-0 break-words ${
            titleNormalCase
              ? 'normal-case tracking-normal text-gray-700'
              : 'uppercase tracking-wide'
          }`}
        >
          {title}
        </p>
        {subtitle && <SectionSubtitle text={subtitle} />}
      </div>
      {items.map((item) => (
        <div
          key={item.plantName}
          className={`flex items-center gap-1 border-b border-gray-50 last:border-0 ${
            selectedPlant === item.plantName ? 'bg-green-50' : ''
          }`}
        >
          <button
            type="button"
            onClick={() => onSelect(item.plantName)}
            className={`min-w-0 flex-1 px-2 py-1 text-left text-sm transition-colors ${
              selectedPlant === item.plantName
                ? 'text-green-900 font-medium'
                : 'text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span className="block truncate">{item.plantName}</span>
          </button>
        </div>
      ))}
    </div>
  );
}

function NotAdvisedSections({
  items,
  selectedPlant,
  onSelect,
}: {
  items: PlantSuitabilityAssessment[];
  selectedPlant: string;
  onSelect: (name: string) => void;
}) {
  const { perennials, offSeasonAnnuals } = partitionNotAdvisedByLifespan(items);

  return (
    <>
      <PlantListSection
        title={LIFESPAN_SECTION_LABELS.perennial}
        subtitle={LIFESPAN_SECTION_SUMMARIES.perennial}
        items={perennials}
        selectedPlant={selectedPlant}
        onSelect={onSelect}
      />
      <PlantListSection
        title={LIFESPAN_SECTION_LABELS.annual}
        subtitle={LIFESPAN_SECTION_SUMMARIES.annual}
        items={offSeasonAnnuals}
        selectedPlant={selectedPlant}
        onSelect={onSelect}
      />
    </>
  );
}

function WarningPanel({
  assessment,
  onConfirm,
  disabled,
}: {
  assessment: PlantSuitabilityAssessment;
  onConfirm: () => void;
  disabled: boolean;
}) {
  const warnings = recommendedActionWarnings(assessment);
  if (!warnings) return null;

  const isClimate = assessment.recommendedAction === 'avoid';

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 text-sm ${
        isClimate
          ? 'bg-red-50 border-red-200 text-red-900'
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}
    >
      <p className="font-medium text-sm mb-1.5">{assessment.plantName}</p>
      <div className="space-y-1.5 text-xs leading-relaxed">
        {warnings.timing && (
          <p>
            <span className="font-semibold">Timing: </span>
            {warnings.timing}
          </p>
        )}
        {warnings.climate && (
          <p>
            <span className="font-semibold">Climate: </span>
            {warnings.climate}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className="mt-2.5 w-full sm:w-auto px-3 py-1.5 rounded-md font-semibold text-xs bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
      >
        Add anyway
      </button>
    </div>
  );
}

export function PlantPicker({
  onPlantSelect,
  isLoading = false,
  zoneMeta: zoneMetaProp,
  collapsible = false,
  defaultOpen = true,
}: PlantPickerProps) {
  const { userLocation, locationLoading } = useAuth();
  const [zoneMeta, setZoneMeta] = useState<PlantZoneMeta[]>(zoneMetaProp ?? []);
  const [selectedPlant, setSelectedPlant] = useState<string>('');
  const [plantingMethod, setPlantingMethod] = useState<'seed' | 'seedling'>('seedling');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingAssessment, setPendingAssessment] = useState<PlantSuitabilityAssessment | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [panelOpen, setPanelOpen] = useState(defaultOpen);
  const [showMorePlants, setShowMorePlants] = useState(false);

  useEffect(() => {
    if (zoneMetaProp && zoneMetaProp.length > 0) {
      setZoneMeta(zoneMetaProp);
      setLoading(false);
      setError(null);
      return;
    }

    if (locationLoading) return;

    if (!userLocation?.auHardinessZone) {
      setError('Location not set. Please set your location first.');
      setLoading(false);
      return;
    }

    fetchPlants();
  }, [userLocation?.auHardinessZone, zoneMetaProp, locationLoading]);

  useEffect(() => {
    setPendingAssessment(null);
  }, [selectedPlant, plantingMethod]);

  async function fetchPlants() {
    if (!userLocation?.auHardinessZone) return;

    setLoading(true);
    setError(null);

    try {
      const meta = await getPlantZoneMetaForZone(userLocation.auHardinessZone);
      setZoneMeta(meta);

      if (meta.length === 0) {
        setError(
          `No plants available for zone ${userLocation.auHardinessZone} (${userLocation.climate})`
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch available plants';
      setError(`${message} (Check browser console for details)`);
      console.error('Plant fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const zoneMetaByPlant = useMemo(() => {
    const map = new Map<string, PlantZoneMeta>();
    for (const row of zoneMeta) map.set(row.plantName, row);
    return map;
  }, [zoneMeta]);

  const rankedPlants = useMemo(() => {
    if (!userLocation || zoneMeta.length === 0) return [];
    return rankPlantsBySuitability(
      zoneMeta.map((m) => m.plantName),
      userLocation,
      zoneMetaByPlant,
      { plantingMethod }
    );
  }, [userLocation, zoneMeta, zoneMetaByPlant, plantingMethod]);

  const groupedPlants = useMemo(
    () => groupPlantsByTimingOnly(rankedPlants),
    [rankedPlants]
  );

  const climateNotSuitable = useMemo(
    () => filterClimateNotSuitable(rankedPlants),
    [rankedPlants]
  );

  const filteredGroupedPlants = useMemo(() => {
    const next = { ...groupedPlants };
    for (const key of GROUP_ORDER) {
      next[key] = groupedPlants[key].filter((item) =>
        plantMatchesPickerQuery(item.plantName, searchQuery)
      );
    }
    return next;
  }, [groupedPlants, searchQuery]);

  const filteredClimateNotSuitable = useMemo(
    () =>
      climateNotSuitable.filter((item) =>
        plantMatchesPickerQuery(item.plantName, searchQuery)
      ),
    [climateNotSuitable, searchQuery]
  );

  const searchResultCount = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return (
      GROUP_ORDER.reduce((n, key) => n + filteredGroupedPlants[key].length, 0) +
      filteredClimateNotSuitable.length
    );
  }, [filteredGroupedPlants, filteredClimateNotSuitable, searchQuery]);

  const searchGapHint = useMemo(
    () => pickerSearchGapHint(searchQuery),
    [searchQuery]
  );

  const isSearchActive = searchQuery.trim().length > 0;
  const showAllGroups = showMorePlants || isSearchActive;

  const visibleGroupKeys = useMemo(
    () => (showAllGroups ? GROUP_ORDER : MOBILE_LIST_GROUPS),
    [showAllGroups]
  );

  const hiddenPlantCount = useMemo(() => {
    if (showAllGroups) return 0;
    const offSeason = GROUP_ORDER.filter((k) => !MOBILE_LIST_GROUPS.includes(k)).reduce(
      (n, key) => n + filteredGroupedPlants[key].length,
      0
    );
    return offSeason + filteredClimateNotSuitable.length;
  }, [showAllGroups, filteredGroupedPlants, filteredClimateNotSuitable]);

  useEffect(() => {
    if (!selectedPlant || showMorePlants || isSearchActive) return;
    const inOffSeasonGroup = GROUP_ORDER.filter((k) => !MOBILE_LIST_GROUPS.includes(k)).some(
      (key) => groupedPlants[key].some((p) => p.plantName === selectedPlant)
    );
    const inClimate = climateNotSuitable.some((p) => p.plantName === selectedPlant);
    if (inOffSeasonGroup || inClimate) setShowMorePlants(true);
  }, [
    selectedPlant,
    showMorePlants,
    isSearchActive,
    groupedPlants,
    climateNotSuitable,
  ]);

  const selectedAssessment = useMemo(() => {
    if (!selectedPlant || !userLocation) return null;
    return evaluatePlantSuitability(selectedPlant, userLocation, {
      plantingMethod,
      zoneMeta: zoneMetaByPlant.get(selectedPlant),
    });
  }, [selectedPlant, userLocation, plantingMethod, zoneMetaByPlant]);

  function confirmAdd() {
    if (!selectedPlant) {
      toast.error('Please select a plant');
      return;
    }

    onPlantSelect(selectedPlant, plantingMethod);
    setSelectedPlant('');
    setPlantingMethod('seedling');
    setPendingAssessment(null);
  }

  function handleAddClick() {
    if (!selectedPlant) {
      toast.error('Please select a plant');
      return;
    }

    const assessment =
      selectedAssessment ??
      evaluatePlantSuitability(selectedPlant, userLocation, {
        plantingMethod,
        zoneMeta: zoneMetaByPlant.get(selectedPlant),
      });

    if (assessment.recommendedAction === 'plant_now') {
      confirmAdd();
      return;
    }

    setPendingAssessment(assessment);
  }

  const pickerBody = (
    <>
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Loading plants...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      ) : rankedPlants.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide shrink-0">
              Planting method
            </span>
            <PlantingMethodToggle
              value={plantingMethod}
              onChange={setPlantingMethod}
            />
          </div>

          <div className="min-h-0 flex flex-col">
            <label
              htmlFor="plant-picker-search"
              className="block text-[10px] font-bold text-gray-900 mb-1 uppercase tracking-wide"
            >
              Select a plant
            </label>
            <input
              id="plant-picker-search"
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) setShowMorePlants(false);
              }}
              placeholder="Search plants…"
              autoComplete="off"
              className="w-full mb-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-300"
            />
            <div className="min-h-[10rem] max-h-[min(50vh,20rem)] sm:max-h-96 overflow-y-auto rounded-md border border-gray-200 bg-white overscroll-contain">
              {searchResultCount === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-600 text-center space-y-2">
                  <p>No plants match &ldquo;{searchQuery.trim()}&rdquo;</p>
                  {searchGapHint && (
                    <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
                      {searchGapHint}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {visibleGroupKeys.map((key) =>
                    key === 'notAdvised' ? (
                      <NotAdvisedSections
                        key={key}
                        items={filteredGroupedPlants.notAdvised}
                        selectedPlant={selectedPlant}
                        onSelect={setSelectedPlant}
                      />
                    ) : (
                      <PlantListSection
                        key={key}
                        title={timingGroupLabel(key)}
                        subtitle={SECTION_SUBTITLES[key]}
                        items={filteredGroupedPlants[key]}
                        selectedPlant={selectedPlant}
                        onSelect={setSelectedPlant}
                      />
                    )
                  )}
                  {!showAllGroups && hiddenPlantCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowMorePlants(true)}
                      className="w-full px-2 py-2 text-left text-xs font-medium text-green-700 hover:bg-green-50 border-t border-gray-100"
                    >
                      Show {hiddenPlantCount} off-season or marginal plant
                      {hiddenPlantCount === 1 ? '' : 's'}
                    </button>
                  )}
                  {showAllGroups && (
                    <PlantListSection
                      title={CLIMATE_SECTION.title}
                      subtitle={CLIMATE_SECTION.subtitle}
                      items={filteredClimateNotSuitable}
                      selectedPlant={selectedPlant}
                      onSelect={setSelectedPlant}
                    />
                  )}
                </>
              )}
            </div>
            {isSearchActive ? (
              searchResultCount !== null && searchResultCount > 0 && (
                <p className="mt-1 text-[10px] text-gray-500">
                  {searchResultCount} match{searchResultCount === 1 ? '' : 'es'}
                </p>
              )
            ) : (
              <p className="mt-1 text-[10px] text-gray-500">
                {showAllGroups
                  ? `${rankedPlants.length} plants — sorted for ${plantingMethod === 'seed' ? 'seed' : 'seedling'}`
                  : `Showing in-season picks — ${hiddenPlantCount > 0 ? 'expand below for more' : 'search for any plant'}`}
              </p>
            )}
          </div>

          {pendingAssessment && (
            <WarningPanel
              assessment={pendingAssessment}
              onConfirm={confirmAdd}
              disabled={isLoading || loading}
            />
          )}

          {!pendingAssessment && (
            <div className="sticky bottom-0 -mx-4 px-4 pt-2 pb-0 sm:-mx-5 sm:px-5 bg-white border-t border-gray-100">
              <button
                type="button"
                onClick={handleAddClick}
                disabled={!selectedPlant || isLoading || loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adding...' : 'Add plant'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">No plants available for your zone</p>
        </div>
      )}
    </>
  );

  if (collapsible && !panelOpen) {
    return (
      <button
        type="button"
        onClick={() => setPanelOpen(true)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-white rounded-lg shadow-md border border-green-200 border-l-4 border-l-green-600 text-left hover:bg-green-50/50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900">Add plant</span>
        <span className="text-green-700 text-lg leading-none" aria-hidden>
          +
        </span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border-t-4 border-green-600 overflow-hidden">
      {collapsible && (
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-bold uppercase tracking-wide text-gray-700">
            Add plant
          </span>
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-200"
          >
            Hide
          </button>
        </div>
      )}
      <div className="p-3 sm:p-5">{pickerBody}</div>
    </div>
  );
}

export default PlantPicker;
