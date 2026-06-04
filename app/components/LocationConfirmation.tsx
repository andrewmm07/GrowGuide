'use client'

import React, { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { getAllSuburbs, lookupSuburbByName } from '@/lib/locationService'
import toast from 'react-hot-toast'

export function LocationConfirmation() {
  const { user, detectedLocation, locationError, confirmLocation } = useAuth()
  const [showPicker, setShowPicker] = useState(false)
  const [selectedSuburb, setSelectedSuburb] = useState<string>('')
  const [isConfirming, setIsConfirming] = useState(false)

  // If no pending location, don't show anything
  if (!user || (detectedLocation === null && !locationError && !showPicker)) {
    return null
  }

  async function handleConfirmDetected() {
    if (!detectedLocation) return
    setIsConfirming(true)
    try {
      await confirmLocation(detectedLocation)
      toast.success(
        `Location set to ${detectedLocation.city}, ${detectedLocation.state} (Zone ${detectedLocation.auHardinessZone})`
      )
    } catch (error) {
      toast.error('Failed to save location')
      console.error('Confirmation error:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  async function handleSelectSuburb() {
    if (!selectedSuburb) {
      toast.error('Please select a suburb')
      return
    }

    setIsConfirming(true)
    try {
      const location = lookupSuburbByName(selectedSuburb)
      await confirmLocation(location)
      toast.success(`Location set to ${location.city}, ${location.state}`)
      setShowPicker(false)
    } catch (error) {
      toast.error('Suburb not found or save failed')
      console.error('Selection error:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  // Manual suburb picker (when permission denied or user wants to change)
  if (showPicker) {
    const suburbs = getAllSuburbs()

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <h2 className="text-xl font-bold mb-2">Select Your Location</h2>
          <p className="text-gray-600 text-sm mb-4">
            {locationError
              ? `Could not detect location: ${locationError.message}`
              : 'Select your suburb from the list below'}
          </p>

          <select
            value={selectedSuburb}
            onChange={(e) => setSelectedSuburb(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm max-h-64"
          >
            <option value="">-- Select a suburb --</option>
            {suburbs.map((s) => (
              <option key={`${s.state}-${s.name}`} value={s.name}>
                {s.name}, {s.state} (Zone {s.zone})
              </option>
            ))}
          </select>

          <button
            onClick={handleSelectSuburb}
            disabled={isConfirming || !selectedSuburb}
            className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {isConfirming ? 'Saving...' : 'Confirm Location'}
          </button>
        </div>
      </div>
    )
  }

  // Detected location confirmation
  if (detectedLocation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <h2 className="text-xl font-bold mb-2">📍 Location Detected</h2>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
            <p className="font-semibold text-lg">
              {detectedLocation.city}, {detectedLocation.state}
            </p>
            <p className="text-gray-600 text-sm">
              Hardiness Zone: {detectedLocation.auHardinessZone}
            </p>
            <p className="text-gray-600 text-sm capitalize">
              Climate: {detectedLocation.climate}
            </p>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            Is this correct? We'll use this to give you gardening advice for your region.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPicker(true)}
              className="flex-1 border border-gray-300 py-2 rounded font-semibold hover:bg-gray-50"
            >
              Change
            </button>

            <button
              onClick={handleConfirmDetected}
              disabled={isConfirming}
              className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {isConfirming ? 'Saving...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
