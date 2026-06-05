'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useGarden } from '../context/GardenContext'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import WeatherPanel from '../components/dashboard/WeatherPanel'
import WeeklyGuidanceCard from '../components/dashboard/WeeklyGuidanceCard'
import WeeklyBriefCard from '../components/dashboard/WeeklyBriefCard'
import WhatToPlantNow from '../components/dashboard/WhatToPlantNow'
import PageContainer from '../components/layouts/PageContainer'
import Link from 'next/link'
import { formatGreetingName, hasDisplayName } from '@/lib/profileName'
import { useNotificationSync } from '@/app/hooks/useNotificationSync'


export default function DashboardPage() {
  const { user, userLocation, locationLoading, loading: authLoading } = useAuth()
  const { plants, loading: gardenLoading } = useGarden()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useNotificationSync(Boolean(user))

  useEffect(() => {
    if (authLoading) return
    if (!user) return

    let cancelled = false
    void (async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single()
        if (cancelled) return
        if (!hasDisplayName(data?.name)) {
          router.replace('/setup-name')
          return
        }
        setUserName(formatGreetingName(data!.name!))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user, authLoading, router])

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })

  if (loading || authLoading || gardenLoading || !userName) {
    return (
      <PageContainer className="space-y-3 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="h-14 bg-gray-200 rounded-2xl" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
      </PageContainer>
    )
  }

  return (
    <PageContainer className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Hi {userName}</h1>
          <p className="text-xs md:text-sm text-gray-400 mt-0.5">{today}</p>
        </div>
        <Link
          href="/settings"
          aria-label="Settings"
          className="hidden md:flex w-10 h-10 bg-white rounded-full shadow-sm border border-gray-100 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
        <div className="space-y-3 md:space-y-4">
          <WeatherPanel location={userLocation} locationLoading={locationLoading} />
          <WeeklyGuidanceCard location={userLocation} />
        </div>

        <div className="space-y-3 md:space-y-4">
          <WeeklyBriefCard
            plants={plants}
            location={userLocation}
            locationLoading={locationLoading}
            gardenLoading={gardenLoading}
          />
          <WhatToPlantNow location={userLocation} />
        </div>
      </div>
    </PageContainer>
  )
}
