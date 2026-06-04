import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto mt-8 p-5 bg-white border border-gray-200 rounded-xl text-center">
      <h2 className="text-lg font-semibold text-gray-900">Page not found</h2>
      <p className="text-sm text-gray-600 mt-2">That page does not exist or has moved.</p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center px-3 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700"
      >
        Back to home
      </Link>
    </div>
  )
}
