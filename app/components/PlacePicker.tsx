'use client'

import { useEffect, useMemo, useState } from 'react'
import { getAllSuburbs, lookupSuburbByName } from '@/lib/locationService'
import type { PlacePickerOption } from '@/lib/places/types'
import type { UserLocation } from '@/lib/types/location'

interface PlacePickerProps {
  onSelect: (location: UserLocation) => Promise<void>
  submitLabel?: string
  isLoading?: boolean
  showCancelButton?: boolean
  onCancel?: () => void
}

const MIN_QUERY_LENGTH = 2
const MAX_RESULTS = 60

function rankPlace(place: PlacePickerOption, query: string): number {
  const name = place.name.toLowerCase()
  const state = place.state.toLowerCase()
  if (name === query) return 0
  if (name.startsWith(query)) return 1
  if (state.startsWith(query)) return 2
  if (name.includes(query)) return 3
  return 4
}

function PlaceRow({
  place,
  selected,
  onSelect,
}: {
  place: PlacePickerOption
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors border-b border-gray-50 last:border-0 ${
        selected ? 'bg-green-50' : 'hover:bg-gray-50'
      }`}
    >
      <span
        className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-green-600 bg-green-600' : 'border-gray-300'
        }`}
        aria-hidden
      >
        {selected && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="currentColor">
            <path d="M10.3 3.3a1 1 0 00-1.4 0L5 7.2 3.1 5.3a1 1 0 00-1.4 1.4l2.5 2.5a1 1 0 001.4 0l5-5a1 1 0 000-1.4z" />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-gray-900">
          {place.name}
          <span className="text-gray-500 font-normal">, {place.state}</span>
        </span>
        <span className="block text-xs text-gray-500 mt-0.5">
          Zone {place.zone} · {place.tagsLabel}
        </span>
      </span>
    </button>
  )
}

export default function PlacePicker({
  onSelect,
  submitLabel = 'Save location',
  isLoading = false,
  showCancelButton = false,
  onCancel,
}: PlacePickerProps) {
  const [placeQuery, setPlaceQuery] = useState('')
  const [selectedPlaceId, setSelectedPlaceId] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const places = getAllSuburbs()

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedPlaceId) ?? null,
    [places, selectedPlaceId]
  )

  const { visiblePlaces, totalMatches, truncated } = useMemo(() => {
    const q = placeQuery.trim().toLowerCase()
    if (q.length < MIN_QUERY_LENGTH) {
      return { visiblePlaces: [], totalMatches: 0, truncated: false }
    }

    const matches = places
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.tagsLabel.toLowerCase().includes(q)
      )
      .sort((a, b) => rankPlace(a, q) - rankPlace(b, q) || a.name.localeCompare(b.name))

    return {
      visiblePlaces: matches.slice(0, MAX_RESULTS),
      totalMatches: matches.length,
      truncated: matches.length > MAX_RESULTS,
    }
  }, [places, placeQuery])

  useEffect(() => {
    if (!selectedPlaceId) return
    const stillVisible = visiblePlaces.some((p) => p.id === selectedPlaceId)
    if (placeQuery.trim().length >= MIN_QUERY_LENGTH && !stillVisible) {
      setSelectedPlaceId('')
    }
  }, [visiblePlaces, selectedPlaceId, placeQuery])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!selectedPlaceId) {
      setError('Please select a place from the list')
      return
    }

    setSaving(true)
    try {
      const location = lookupSuburbByName(selectedPlaceId)
      await onSelect(location)
    } catch (err) {
      console.error('PlacePicker save error:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to save location. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const busy = isLoading || saving
  const queryTooShort =
    placeQuery.trim().length > 0 && placeQuery.trim().length < MIN_QUERY_LENGTH
  const showNoResults =
    placeQuery.trim().length >= MIN_QUERY_LENGTH && totalMatches === 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="place-search"
          className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5"
        >
          Find your suburb or town
        </label>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
          <input
            id="place-search"
            type="search"
            value={placeQuery}
            onChange={(e) => {
              setPlaceQuery(e.target.value)
              setError('')
            }}
            placeholder="e.g. Byron Bay, Fitzroy, Blackmans Bay"
            className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 bg-white text-gray-900 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            autoComplete="off"
            disabled={busy}
            role="combobox"
            aria-expanded={visiblePlaces.length > 0}
            aria-controls="place-results"
          />
        </div>
        {queryTooShort && (
          <p className="mt-1.5 text-xs text-gray-500">Type at least {MIN_QUERY_LENGTH} characters to search.</p>
        )}
      </div>

      <div
        id="place-results"
        role="listbox"
        aria-label="Matching places"
        className="min-h-[11rem] max-h-[min(50vh,18rem)] overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 overscroll-contain"
      >
        {placeQuery.trim().length < MIN_QUERY_LENGTH ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[11rem] px-6 py-8 text-center">
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-100 text-lg mb-3"
              aria-hidden
            >
              📍
            </span>
            <p className="text-sm font-medium text-gray-800">Search for where you garden</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-[16rem]">
              Enter your suburb or town to see climate zone and growing conditions.
            </p>
          </div>
        ) : showNoResults ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[11rem] px-6 py-8 text-center">
            <p className="text-sm text-gray-700">
              No places match &ldquo;{placeQuery.trim()}&rdquo;
            </p>
            <p className="text-xs text-gray-500 mt-1">Try a nearby town or fewer letters.</p>
          </div>
        ) : (
          visiblePlaces.map((place) => (
            <PlaceRow
              key={place.id}
              place={place}
              selected={selectedPlaceId === place.id}
              onSelect={() => {
                setSelectedPlaceId(place.id)
                setError('')
              }}
            />
          ))
        )}
      </div>

      {truncated && (
        <p className="text-xs text-gray-500">
          Showing {MAX_RESULTS} of {totalMatches} matches — keep typing to narrow down.
        </p>
      )}
      {!truncated && totalMatches > 0 && (
        <p className="text-xs text-gray-500">
          {totalMatches} match{totalMatches === 1 ? '' : 'es'}
        </p>
      )}

      {selectedPlace && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-1">
            Selected
          </p>
          <p className="text-sm font-medium text-gray-900">
            {selectedPlace.name}, {selectedPlace.state}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            Zone {selectedPlace.zone} · {selectedPlace.tagsLabel}
          </p>
        </div>
      )}

      {error && (
        <div className="text-red-700 text-sm bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={busy || !selectedPlaceId}
          className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] transition-colors"
        >
          {busy ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </button>
        {showCancelButton && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium min-h-[44px] hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
