'use client'
import { useAuth } from '../context/AuthContext'
import { isCompleteUserLocation } from '@/lib/locationService'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const LOCATION_SETUP_PATHS = ['/location-select', '/setup-location']

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, locationLoading, userLocation } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading || locationLoading) return
    if (!user) {
      router.replace('/auth/login')
      return
    }
    if (
      !isCompleteUserLocation(userLocation) &&
      !LOCATION_SETUP_PATHS.some((p) => pathname?.startsWith(p))
    ) {
      router.replace('/location-select')
    }
  }, [user, loading, locationLoading, userLocation, router, pathname])

  if (loading || locationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-green-600 text-2xl">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}
