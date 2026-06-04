'use client'

import { ThemeProvider } from '../components/ThemeProvider'

/** Theme only — AuthProvider is mounted once in app/layout.tsx (ARCHITECTURE_CANON). */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
} 