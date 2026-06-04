'use client'

import WeeklySeasonGuidanceBlock from '../WeeklySeasonGuidanceBlock'
import type { UserLocation } from '@/lib/types/location'

interface WeeklyGuidanceCardProps {
  location: UserLocation | null
  date?: Date
}

export default function WeeklyGuidanceCard({ location, date }: WeeklyGuidanceCardProps) {
  return (
    <WeeklySeasonGuidanceBlock
      location={location}
      date={date}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
    />
  )
}
