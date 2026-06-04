'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * @deprecated Activity Calendar archived — use /weekly-brief for weekly tasks.
 * Source preserved in archive/calendar/activity-month/page.tsx
 */
export default function ActivityMonthRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/weekly-brief/')
  }, [router])

  return null
}
