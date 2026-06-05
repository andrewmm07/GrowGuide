'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { supabase } from '@/app/lib/supabase'
import { hasDisplayName } from '@/lib/profileName'

const EXEMPT_PATHS = new Set(['/', '/setup-name'])

function isExemptPath(pathname: string | null): boolean {
  if (!pathname) return true
  if (EXEMPT_PATHS.has(pathname)) return true
  if (pathname.startsWith('/location-select')) return true
  if (pathname.startsWith('/auth')) return true
  return false
}

export default function RequireProfileName({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user || isExemptPath(pathname)) {
      setReady(true)
      return
    }

    let cancelled = false
    setReady(false)

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
        setReady(true)
      } catch {
        if (!cancelled) router.replace('/setup-name')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user, authLoading, pathname, router])

  if (authLoading || (user && !isExemptPath(pathname) && !ready)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    )
  }

  return <>{children}</>
}
