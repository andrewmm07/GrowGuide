'use client'
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

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 p-6 bg-gray-50 overflow-y-auto`}>
          {children}
        </main>
      </div>
    </div>
  )
} 