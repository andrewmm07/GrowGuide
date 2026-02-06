'use client'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userLocation, loading, locationLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Don't redirect while still loading
    if (loading || locationLoading) {
      return
    }

    if (!user) {
      router.push('/auth/login')
      return
    }

    // Only redirect if location is definitely not set (after loading completes)
    if (!userLocation?.state) {
      router.push('/location-select')
      return
    }
  }, [user, userLocation, loading, locationLoading, router])

  // Show loading state while checking auth and location
  if (loading || locationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-green-600 text-2xl">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
} 