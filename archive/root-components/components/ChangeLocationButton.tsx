'use client'
import { useRouter } from 'next/navigation'

export default function ChangeLocationButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/setup-location')}
      className="inline-flex items-center text-green-600 hover:text-green-700"
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
      Change Location
    </button>
  )
} 