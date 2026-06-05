/** Path prefixes that require a signed-in user (RequireAuth). */
export const AUTH_REQUIRED_PREFIXES = [
  '/dashboard',
  '/my-garden',
  '/profile',
  '/settings',
  '/weekly-brief',
  '/planting-calendar',
  '/notifications',
  '/tasks',
  '/setup-location',
] as const

export function isAuthRequiredPath(pathname: string | null): boolean {
  if (!pathname) return false
  return AUTH_REQUIRED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

/** Same-origin relative path only — blocks open redirects. */
export function safeReturnPath(next: string | null | undefined): string | null {
  if (!next) return null
  const decoded = decodeURIComponent(next)
  if (!decoded.startsWith('/') || decoded.startsWith('//')) return null
  if (decoded.startsWith('/auth')) return null
  return decoded
}

export function loginPathWithNext(returnPath: string): string {
  return `/auth/login?next=${encodeURIComponent(returnPath)}`
}
