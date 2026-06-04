/**
 * Optional client error reporting via Sentry.
 * No-op when NEXT_PUBLIC_SENTRY_DSN is unset — safe for local dev without an account.
 */

let initPromise: Promise<void> | null = null

function getDsn(): string | undefined {
  return process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() || undefined
}

export function initErrorReporting(): void {
  if (typeof window === 'undefined') return
  const dsn = getDsn()
  if (!dsn) return

  if (!initPromise) {
    initPromise = import('@sentry/react')
      .then((Sentry) => {
        Sentry.init({
          dsn,
          environment:
            process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ??
            process.env.NODE_ENV ??
            'development',
          tracesSampleRate: 0,
        })
      })
      .catch((err) => {
        console.warn('[errorReporting] Sentry init failed:', err)
      })
  }
}

export function captureException(
  error: unknown,
  context?: Record<string, unknown>
): void {
  const dsn = getDsn()
  if (!dsn) {
    console.error('[errorReporting]', error, context)
    return
  }

  initErrorReporting()
  void initPromise?.then(() =>
    import('@sentry/react').then((Sentry) => {
      Sentry.captureException(error, context ? { extra: context } : undefined)
    })
  )
}

export function captureMessage(message: string): void {
  const dsn = getDsn()
  if (!dsn) return

  initErrorReporting()
  void initPromise?.then(() =>
    import('@sentry/react').then((Sentry) => {
      Sentry.captureMessage(message)
    })
  )
}
