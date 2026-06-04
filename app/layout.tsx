import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MainLayout from './components/layouts/MainLayout'
import { AuthProvider } from './context/AuthContext'
import { LocationConfirmation } from './components/LocationConfirmation'
import { ProfileProvider } from './context/ProfileContext'
import { GardenProvider } from './context/GardenContext'
import { Providers } from './providers/Providers'
import { ErrorReportingInit } from './components/ErrorReportingInit'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GrowGuide',
  description: 'Plan and manage your garden with ease',
}

export const viewport = {
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
          <ErrorReportingInit />
          <AuthProvider>
            <LocationConfirmation />
            <ProfileProvider>
              <GardenProvider>
                <MainLayout>
                  {children}
                </MainLayout>
              </GardenProvider>
            </ProfileProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
