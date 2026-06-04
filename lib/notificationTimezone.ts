import type { UserLocation } from '@/lib/types/location'

const STATE_TIMEZONE: Record<string, string> = {
  NSW: 'Australia/Sydney',
  ACT: 'Australia/Sydney',
  VIC: 'Australia/Melbourne',
  TAS: 'Australia/Hobart',
  QLD: 'Australia/Brisbane',
  SA: 'Australia/Adelaide',
  WA: 'Australia/Perth',
  NT: 'Australia/Darwin',
}

export function defaultTimezoneForLocation(location: Partial<UserLocation> | null | undefined): string {
  if (location?.state) {
    const mapped = STATE_TIMEZONE[location.state.toUpperCase()]
    if (mapped) return mapped
  }
  try {
    if (typeof Intl !== 'undefined') {
      const tz = Intl.DateTimeFormat().resolvedOptions()?.timeZone
      if (typeof tz === 'string' && tz.length > 0) return tz
    }
  } catch {
    /* Some Android WebViews lack full Intl support */
  }
  return 'Australia/Sydney'
}
