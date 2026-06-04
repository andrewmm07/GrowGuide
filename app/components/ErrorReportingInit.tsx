'use client'

import { useEffect } from 'react'
import { initErrorReporting } from '@/lib/errorReporting'

export function ErrorReportingInit() {
  useEffect(() => {
    initErrorReporting()
  }, [])

  return null
}
