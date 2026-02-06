'use client'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'

export default function Header() {
  const { user } = useAuth()
  
  // If user is logged in, link to dashboard, otherwise link to home
  const logoHref = user ? '/dashboard' : '/'
  
  return (
    <header className="h-16 bg-white border-b sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between max-w-[1920px] mx-auto">
        <div className="flex items-center gap-2">
          <Link href={logoHref} className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-semibold text-gray-900">GrowGuide</span>
          </Link>
        </div>
      </div>
    </header>
  )
} 