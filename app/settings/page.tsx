'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { formatGrowingContextLabel, resolveLocationContext } from '@/lib/microclimate/resolve'
import PageContainer from '@/app/components/layouts/PageContainer'
import NotificationSettings from '@/app/components/notifications/NotificationSettings'

export default function Settings() {
  const { userLocation, logout, user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('units')
      if (saved === 'metric' || saved === 'imperial') setUnits(saved)
    } catch { /* ignore */ }
  }, [])

  if (!mounted) return null

  const handleUnitsChange = (val: 'metric' | 'imperial') => {
    setUnits(val)
    try { localStorage.setItem('units', val) } catch { /* ignore */ }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const locCtx = userLocation ? resolveLocationContext(userLocation) : null
  const locationDisplay = userLocation
    ? `${userLocation.city}, ${userLocation.state}`
    : 'Not set'
  const contextLabel = locCtx ? formatGrowingContextLabel(locCtx) : null

  return (
    <div className="pb-24 md:pb-8">
      <PageContainer className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Location */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Location</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Growing region</p>
              <p className="text-sm text-gray-500 mt-0.5">{locationDisplay}</p>
              {contextLabel && (
                <p className="text-xs text-gray-400 mt-1">{contextLabel}</p>
              )}
            </div>
            <Link
              href="/location-select"
              className="px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium min-h-[44px] flex items-center hover:bg-green-700 transition-colors"
            >
              Change
            </Link>
          </div>
        </div>

        <NotificationSettings />

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Preferences</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Measurement units
            </label>
            <div className="flex gap-3">
              {(['metric', 'imperial'] as const).map(u => (
                <button
                  key={u}
                  onClick={() => handleUnitsChange(u)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors min-h-[44px] ${
                    units === u
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                  }`}
                >
                  {u === 'metric' ? 'Metric (cm, m)' : 'Imperial (in, ft)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-gray-700">Profile</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {'Your name and details'}
                </p>
              </div>
              <Link
                href="/profile"
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium min-h-[44px] flex items-center hover:border-gray-300 transition-colors"
              >
                Edit
              </Link>
            </div>
            {user && (
              <div className="pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium min-h-[44px] hover:bg-red-50 transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">About</h2>
          <p className="text-xs text-gray-500">GrowGuide — your gardening companion.</p>
          <p className="text-[11px] text-gray-400 mt-1">Version 1.0</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <Link href="/privacy/" className="text-green-700 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms/" className="text-green-700 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
