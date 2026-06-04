'use client'

import { useEffect } from 'react'
import { captureException } from '@/lib/errorReporting'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureException(error, { digest: error.digest })
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 p-6">
        <div className="max-w-2xl mx-auto bg-white border border-red-200 rounded-xl p-5">
          <h1 className="text-lg font-semibold text-red-700">Application error</h1>
          <p className="text-sm text-gray-700 mt-2">
            Something crashed on the client. Please screenshot this screen.
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="font-semibold">Message:</span>{' '}
              <span className="text-gray-800">{error.message || 'Unknown error'}</span>
            </p>
            {error.digest ? (
              <p>
                <span className="font-semibold">Digest:</span>{' '}
                <span className="text-gray-800">{error.digest}</span>
              </p>
            ) : null}
          </div>

          {error.stack ? (
            <pre className="mt-4 text-xs bg-gray-100 border border-gray-200 rounded p-3 overflow-auto whitespace-pre-wrap">
              {error.stack}
            </pre>
          ) : null}

          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex items-center px-3 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
