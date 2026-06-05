'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { isAuthRequiredPath, loginPathWithNext } from '@/lib/authPaths'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (loading || user || !isAuthRequiredPath(pathname)) return
    router.replace(loginPathWithNext(pathname ?? '/dashboard'))
  }, [user, loading, pathname, router])

  if (loading && isAuthRequiredPath(pathname)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    )
  }

  if (!user && isAuthRequiredPath(pathname)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    )
  }

  return <>{children}</>
}
