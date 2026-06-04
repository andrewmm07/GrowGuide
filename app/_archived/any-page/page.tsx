'use client'

import { useProfile } from '../context/ProfileContext'

export default function AnyPage() {
  const { data: profile, setData } = useProfile()
  
  const handleLocationChange = async (newLocation: string) => {
    setData(profile ? { ...profile, location: newLocation } : { location: newLocation })
  }

  return (
    <div>
      Current Location: {profile?.location || 'Not set'}
      {/* Your page content */}
    </div>
  )
} 