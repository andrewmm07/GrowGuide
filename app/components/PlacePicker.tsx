'use client'

import { useMemo, useState } from 'react'
import { getAllSuburbs, lookupSuburbByName } from '@/lib/locationService'
import type { UserLocation } from '@/lib/types/location'

interface PlacePickerProps {
  onSelect: (location: UserLocation) => Promise<void>
  submitLabel?: string
  isLoading?: boolean
  showCancelButton?: boolean
  onCancel?: () => void
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
  const filteredPlaces = useMemo(() => {
    const q = placeQuery.trim().toLowerCase()
    if (!q) return places
    return places.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.tagsLabel.toLowerCase().includes(q)
    )
  }, [places, placeQuery])

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>
      )}

      <div>
        <label htmlFor="place-search" className="block text-sm font-medium text-gray-700">
          Search suburb or town
        </label>
        <input
          id="place-search"
          type="search"
          value={placeQuery}
          onChange={(e) => setPlaceQuery(e.target.value)}
          placeholder="e.g. Blackmans Bay, Hobart"
          className="mt-1 block w-full px-3 py-2 text-base border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          autoComplete="off"
          disabled={busy}
        />
      </div>

      <div>
        <label htmlFor="place-select" className="block text-sm font-medium text-gray-700">
          Select place
        </label>
        <select
          id="place-select"
          value={selectedPlaceId}
          onChange={(e) => {
            setSelectedPlaceId(e.target.value)
            setError('')
          }}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          required
          disabled={busy}
        >
          <option value="">-- Select a place --</option>
          {filteredPlaces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}, {p.state} · {p.tagsLabel}
            </option>
          ))}
        </select>
        {placeQuery && filteredPlaces.length === 0 && (
          <p className="mt-1 text-xs text-gray-500">
            No matches. Try fewer letters or a nearby town.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy || !selectedPlaceId}
          className="flex-1 flex justify-center py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          {busy ? 'Saving...' : submitLabel}
        </button>
        {showCancelButton && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium min-h-[44px] hover:border-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
