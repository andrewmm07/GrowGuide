import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useCheckLocation() {
  const { userLocation, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !userLocation) {
      router.push('/setup-location')
    }
  }, [userLocation, loading, router])

  return { hasLocation: !!userLocation, loading }
} 