'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  getMonthGuidanceForUser,
  getMonthSeason,
  getRichMonthOverviewForLocation,
  hasMonthGuidanceForLocation,
} from '@/app/data/planting-calendar/helpers'
import { useAuth } from '@/app/context/AuthContext'
import {
  getPlantingRecommendationsForMonth,
  type PlantingMonth,
} from '@/lib/plantingRecommendations'
import { getLocationNoNos } from '../../data/no-nos'
import PlanPageShell from '@/app/components/layouts/PlanPageShell'
import MonthGuideView from '@/app/components/planting-calendar/MonthGuideView'

interface WeeklyGuide {
  week: number
  sow: string[]
  plant: string[]
  tasks: string[]
}

function getWeekDateRange(month: string, weekNum: number): string {
  const date = new Date(`2024 ${month} 1`)
  const startDate = new Date(date.setDate(date.getDate() + (weekNum - 1) * 7))
  const endDate = new Date(date.setDate(date.getDate() + 6))
  return `${startDate.getDate()}–${endDate.getDate()} ${month}`
}

function getWeekProgress(weekNum: number): string {
  const currentDate = new Date()
  const currentWeek = Math.ceil(currentDate.getDate() / 7)

  if (weekNum === currentWeek) return 'Current Week'
  if (weekNum < currentWeek) return 'Completed'
  return 'Upcoming'
}

function distributeAcrossWeeks(items: string[], totalWeeks: number): string[][] {
  const distribution: string[][] = Array.from({ length: totalWeeks }, () => [])
  items.forEach((item, index) => {
    distribution[index % totalWeeks].push(item)
  })
  return distribution
}

const MONTH_NAMES: Record<string, string> = {
  january: 'January',
  february: 'February',
  march: 'March',
  april: 'April',
  may: 'May',
  june: 'June',
  july: 'July',
  august: 'August',
  september: 'September',
  october: 'October',
  november: 'November',
  december: 'December',
}

function getPlantingMonthFromRoute(month: string): PlantingMonth | null {
  const key = month.toLowerCase()
  if (!(key in MONTH_NAMES)) return null
  return MONTH_NAMES[key] as PlantingMonth
}

function isValidMonthRoute(month: string): boolean {
  return month.toLowerCase() in MONTH_NAMES
}

const MonthDetailPage = () => {
  const params = useParams()
  const month = (params?.month as string) ?? ''
  const { userLocation: profileLocation, locationLoading: authLocationLoading } = useAuth()
  const locationLoading = authLocationLoading
  const router = useRouter()
  const [guideSow, setGuideSow] = useState<string[]>([])
  const [guidePlant, setGuidePlant] = useState<string[]>([])
  const [frostDeferredPlant, setFrostDeferredPlant] = useState<string[] | undefined>()

  const plantingMonth = getPlantingMonthFromRoute(month)
  const monthTitle = plantingMonth ?? 'Month'

  const monthGuidance = useMemo(() => {
    if (!profileLocation || !plantingMonth) return null
    return getMonthGuidanceForUser(
      profileLocation.climate,
      profileLocation.state,
      plantingMonth,
      profileLocation
    )
  }, [profileLocation, plantingMonth])

  const overview = useMemo(() => {
    if (!profileLocation || !plantingMonth) return undefined
    return getRichMonthOverviewForLocation(profileLocation, plantingMonth)
  }, [profileLocation, plantingMonth])

  const locationNoNos = useMemo(() => {
    if (!profileLocation) return null
    return getLocationNoNos(profileLocation.state, profileLocation.city, month.toLowerCase())
  }, [profileLocation, month])

  const effectiveNoNos = useMemo(() => {
    if (locationNoNos) {
      return locationNoNos
    }
    const avoid = monthGuidance?.avoid ?? []
    if (avoid.length > 0) {
      return { mistakes: avoid, warnings: [] as string[], commonErrors: [] as string[] }
    }
    return { mistakes: [], warnings: [], commonErrors: [] }
  }, [locationNoNos, monthGuidance?.avoid])

  const essentialTasks = monthGuidance?.tasks ?? []

  const effectiveWeeklyGuide = useMemo((): WeeklyGuide[] => {
    const sowChunks = distributeAcrossWeeks(guideSow, 4)
    const plantChunks = distributeAcrossWeeks(guidePlant, 4)
    const taskChunks = distributeAcrossWeeks(essentialTasks, 4)

    const fallbackWeeklyTasks = [
      ['Prep beds and add compost', 'Water deeply'],
      ['Mulch around new plantings', 'Check for pests'],
      ['Fertilize if needed', 'Inspect plant health'],
      ['Harvest ready crops', 'Plan next month'],
    ]

    return Array.from({ length: 4 }, (_v, i) => ({
      week: i + 1,
      sow: sowChunks[i] ?? [],
      plant: plantChunks[i] ?? [],
      tasks:
        taskChunks[i]?.length > 0
          ? taskChunks[i]
          : fallbackWeeklyTasks[i] ?? ['General garden maintenance'],
    }))
  }, [guideSow, guidePlant, essentialTasks])

  useEffect(() => {
    if (!profileLocation || !plantingMonth) return
    const { sow, plant, frostDeferredPlant: deferred } = getPlantingRecommendationsForMonth(
      profileLocation,
      plantingMonth
    )
    setGuideSow(sow)
    setGuidePlant(plant)
    setFrostDeferredPlant(deferred)
  }, [profileLocation, plantingMonth])

  useEffect(() => {
    if (locationLoading) return

    if (!profileLocation || !hasMonthGuidanceForLocation(profileLocation)) {
      router.push('/location-select')
    }
  }, [profileLocation, month, router, locationLoading])

  if (!params?.month) {
    return null
  }

  if (locationLoading) {
    return (
      <PlanPageShell wide className="bg-gray-50 md:bg-gray-50">
        <div className="text-center py-8 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
        </div>
      </PlanPageShell>
    )
  }

  if (!isValidMonthRoute(month) || !plantingMonth) {
    return (
      <PlanPageShell wide className="bg-gray-50 md:bg-gray-50">
        <div className="text-center py-8">
          <h1 className="text-lg font-bold text-red-600 mb-4">Month not found</h1>
          <Link href="/planting-calendar" className="text-sm text-gray-700 hover:text-gray-900">
            Return to year calendar
          </Link>
        </div>
      </PlanPageShell>
    )
  }

  return (
    <PlanPageShell wide className="bg-gray-50 md:bg-gray-50">
      <MonthGuideView
        monthSlug={month}
        monthTitle={plantingMonth}
        season={getMonthSeason(plantingMonth)}
        locationLabel={
          profileLocation?.city
            ? `${profileLocation.city}, ${profileLocation.state}`
            : profileLocation?.state
        }
        overview={overview}
        monthGuidance={monthGuidance}
        guideSow={guideSow}
        guidePlant={guidePlant}
        frostDeferredPlant={frostDeferredPlant}
        weeklyGuide={effectiveWeeklyGuide}
        noNos={effectiveNoNos}
        weekDateRange={(weekNum) => getWeekDateRange(monthTitle, weekNum)}
        weekProgress={getWeekProgress}
      />
    </PlanPageShell>
  )
}

export default MonthDetailPage
