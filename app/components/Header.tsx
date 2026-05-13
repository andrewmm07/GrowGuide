'use client'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'

interface HeaderProps {
  showMenuButton?: boolean
  onMenuClick?: () => void
}

export default function Header({ showMenuButton = false, onMenuClick }: HeaderProps) {
  const { user } = useAuth()

  // If user is logged in, link to dashboard, otherwise link to home
  const logoHref = user ? '/dashboard' : '/'

  return (
    <header className="h-16 bg-white border-b sticky top-0 z-50">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between max-w-[1920px] mx-auto">
        <div className="flex items-center gap-3">
          {/* Hamburger button — mobile only, shown when sidebar pages are active */}
          {showMenuButton && (
            <