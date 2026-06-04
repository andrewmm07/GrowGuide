'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useCheckLocation } from '@/middleware/checkLocation'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import MonthGuidancePanel from '@/app/components/planting-calendar/MonthGuidancePanel'
import FrostDeferredPlantHint from '@/app/components/planting-calendar/FrostDeferredPlantHint'
import {
  getMonthGuidanceForUser,
  getMonthSeason,
  hasMonthGuidanceForLocation,
} from '@/app/data/planting-calendar/helpers'
import {
  getCurrentPlantingMonth,
  getPlantingRecommendationsForMonth,
} from '@/lib/plantingRecommendations'
import { formatGrowingContextLabel, resolveLocationContext } from '@/lib/microclimate/resolve'

/**
 * @deprecated Route kept for nav compatibility. Prefer /planting-calendar and /planting-calendar/[month].
 * Climate-first (no state planting matrices).
 */
export default function MonthlyCalendarPage() {
  const { hasLocation, loading } = useCheckLocation()
  const { userLocation } = useAuth()
  const router = useRouter()

  const month = getCurrentPlantingMonth()

  const guidance = useMemo(() => {
    if (!userLocation || !hasMonthGuidanceForLocation(userLocation)) return null
    return getMonthGuidanceForUser(
      userLocation.climate,
      userLocation.state,
      month,
      userLocation
    )
  }, [userLocation, month])

  const { sow, plant, frostDeferredPlant } = useMemo(() => {
    if (!userLocation) return { sow: [] as string[], plant: [] as string[], frostDeferredPlant: undefined }
    return getPlantingRecommendationsForMonth(userLocation, month)
  }, [userLocation, month])

  const season = getMonthSeason(month)
  const monthSlug = month.toLowerCase()
  const contextLabel = userLocation
    ? (() => {
        const ctx = resolveLocationContext(userLocation)
        return ctx ? formatGrowingContextLabel(ctx) : `${userLocation.climate} climate`
      })()
    : null

  const handleChangeLocation = () => {
    router.push('/location-select')
  }

  if (loading || !hasLocation) return null

  if (!userLocation || !hasMonthGuidanceForLocation(userLocation)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
        <div className="max-w-lg mx-auto text-center space-y-4">
          <p className="text-gray-600">Set your growing location to see this month&apos;s calendar.</p>
          <Link
            href="/location-select"
            className="inline-block py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Set location
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-800">This month</h1>
            <p className="text-gray-600 mt-1">
              {month}
              {season ? ` · ${season}` : ''}
              {userLocation.city ? ` · ${userLocation.city}, ${userLocation.state}` : ''}
            </p>
            {contextLabel && (
              <p className="text-sm text-gray-500 mt-1">{contextLabel}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/planting-calendar/${monthSlug}`}
              className="text-sm font-medium text-green-700 hover:text-green-800"
            >
              Full {month} guide
            </Link>
            <button
              type="button"
              onClick={handleChangeLocation}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Change location
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
          {guidance ? (
            <MonthGuidancePanel guidance={guidance} />
          ) : (
            <p className="text-gray-600">No guidance available for this month.</p>
          )}

          <FrostDeferredPlantHint names={frostDeferredPlant} className="mb-2" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-3 text-blue-600">Sow</h3>
              {sow.length > 0 ? (
                <ul className="space-y-2">
                  {sow.map((item) => (
                    <li key={item} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Nothing recommended to sow this month.</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 text-green-600">Plant</h3>
              {plant.length > 0 ? (
                <ul className="space-y-2">
                  {plant.map((item) => (
                    <li key={item} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Nothing recommended to plant out this month.</p>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500 pt-2 border-t border-gray-100">
            <Link href="/planting-calendar" className="text-green-600 hover:text-green-700">
              View the full year planting calendar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
