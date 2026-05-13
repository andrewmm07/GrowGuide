import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MainLayout from './components/layouts/MainLayout'
import { ThemeProvider } from './components/ThemeProvider'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import { Providers } from './providers/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GrowGuide',
  description: 'Plan and manage your garden with ease',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            <ThemeProvider>
              <ProfileProvider>
                <MainLayout>
                  {children}
                </MainLayout>
              </ProfileProvid