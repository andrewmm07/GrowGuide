'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { getSeedPlantNames } from '@/lib/plantCatalog'
import { slugToPlantName } from '@/lib/plantSlug'
import { getPlantTimeline, type PlantTimelineData } from '@/lib/plantTimelineService'
import type { AUHardinessZone } from '@/lib/types/location'
import PageContainer from '@/app/components/layouts/PageContainer'
import Link from 'next/link'

export default function PlantDetail() {
  const params = useParams()
  const { userLocation } = useAuth()
  const slug = typeof params?.id === 'string' ? params.id : ''
  const plantName = slugToPlantName(slug, getSeedPlantNames())
  const zone = userLocation?.auHardinessZone as AUHardinessZone | undefined

  const [timeline, setTimeline] = useState<PlantTimelineData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!plantName || !zone) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getPlantTimeline(plantName, zone)
      .then((data) => {
        if (!cancelled) setTimeline(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load plant data')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [plantName, zone])

  if (!plantName) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold text-gray-800">Plant not found</h1>
          <p className="text-gray-500 mt-2 text-sm">No plant matches this link.</p>
          <Link href="/my-garden" className="text-green-600 text-sm mt-4 inline-block hover:underline">
            Back to My Garden
          </Link>
        </div>
      </PageContainer>
    )
  }

  if (!zone) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold text-gray-800">{plantName}</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Set your growing location to see zone-specific timing and care.
          </p>
          <Link
            href="/location-select"
            className="text-green-600 text-sm mt-4 inline-block hover:underline"
          >
            Set location
          </Link>
        </div>
      </PageContainer>
    )
  }

  if (loading) {
    return (
      <PageContainer>
        <p className="text-gray-400 text-sm text-center py-12">Loading plant details…</p>
      </PageContainer>
    )
  }

  if (error || !timeline) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold text-gray-800">{plantName}</h1>
          <p className="text-red-600 mt-2 text-sm">{error ?? 'Plant data unavailable for your zone.'}</p>
          <Link href="/my-garden" className="text-green-600 text-sm mt-4 inline-block hover:underline">
            Back to My Garden
          </Link>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{timeline.plantName}</h1>
        <p className="text-sm text-gray-500 mt-1">Zone {timeline.zone}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Growing timeline</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">Sow to seedling</dt>
            <dd className="font-medium text-gray-800">{timeline.sowToSeedling} days</dd>
          </div>
          <div>
            <dt className="text-gray-500">Seedling to harvest</dt>
            <dd className="font-medium text-gray-800">{timeline.seedlingToHarvest} days</dd>
          </div>
          <div>
            <dt className="text-gray-500">Harvest window</dt>
            <dd className="font-medium text-gray-800">{timeline.harvestWindow} days</dd>
          </div>
          <div>
            <dt className="text-gray-500">Watering (days)</dt>
            <dd className="font-medium text-gray-800">Every {timeline.wateringFrequency}</dd>
          </div>
        </dl>
      </div>

      {timeline.extraCare.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Extra care</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {timeline.extraCare.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {timeline.keyActivities.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Key activities</h2>
          <ul className="space-y-3">
            {timeline.keyActivities.map((activity, index) => (
              <li key={`${activity.timing}-${index}`} className="text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <p className="font-medium text-gray-800">
                  Day {activity.timing}: {activity.activity}
                </p>
                <p className="text-gray-600 mt-0.5">{activity.details}</p>
                <span className="text-xs text-gray-400 capitalize">{activity.category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageContainer>
  )
}
