import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

/**
 * Responsive content width: phone-first reading width, wider on tablet/desktop.
 * Use on dashboard-style pages instead of bare max-w-lg.
 */
export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 py-5 md:py-6 max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl ${className}`}
    >
      {children}
    </div>
  )
}
