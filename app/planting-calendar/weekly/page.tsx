'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Legacy route — weekly brief is canonical at /weekly-brief */
export default function ThisWeekRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/weekly-brief')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-sm">Opening weekly brief…</p>
    </div>
  )
}
