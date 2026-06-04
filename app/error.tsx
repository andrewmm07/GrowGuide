'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="max-w-lg mx-auto mt-8 p-5 bg-white border border-red-200 rounded-xl">
      <h2 className="text-lg font-semibold text-red-700">Something went wrong</h2>
      <p className="text-sm text-gray-700 mt-2">{error.message || 'An unexpected error occurred.'}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 inline-flex items-center px-3 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700"
      >
        Try again
      </button>
    </div>
  )
}
