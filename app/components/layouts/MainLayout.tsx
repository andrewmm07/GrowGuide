'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '../Sidebar'
import Header from '../Header'

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const showSidebar = pathname !== '/' && pathname !== '/location-select'
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <Header
        showMenuButton={showSidebar}
        onMenuClick={() => setMobileOpen(true)}
      />
      <div className="flex flex-1 overflow-hi