/** Trim and collapse whitespace for stored/display names. */
export function normalizeDisplayName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

/** True when the user has provided a usable display name (min 2 chars). */
export function hasDisplayName(name: string | null | undefined): boolean {
  return normalizeDisplayName(name ?? '').length >= 2
}

/** "andrew" → "Andrew", "mary jane" → "Mary Jane" for greetings. */
export function formatGreetingName(name: string): string {
  const normalized = normalizeDisplayName(name)
  return normalized
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function validateDisplayNameInput(name: string): string | null {
  const normalized = normalizeDisplayName(name)
  if (!hasDisplayName(normalized)) {
    return 'Please enter your name (at least 2 characters).'
  }
  return null
}

import { getHomeRouteForLocation } from './locationService'
import type { UserLocation } from './types/location'

/** Post-login route: name first, then location-aware home. */
export function getPostAuthRoute(
  profileName: string | null | undefined,
  location: UserLocation | null | undefined
): string {
  if (!hasDisplayName(profileName)) return '/setup-name'
  return getHomeRouteForLocation(location)
}
