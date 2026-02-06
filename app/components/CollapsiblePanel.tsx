'use client'

interface CollapsiblePanelProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  icon?: React.ReactNode
  description?: string
}

export default function CollapsiblePanel({ 
  title, 
  isOpen, 
  onToggle, 
  children,
  icon,
  description 
}: CollapsiblePanelProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <button
        onClick={onToggle}
        className={`w-full px-8 py-6 flex items-start justify-between text-left group transition-colors
          ${isOpen ? 'bg-gray-500' : 'bg-white hover:bg-gray-50'}`}
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div className={`transition-colors ${
              isOpen ? 'text-green-400' : 'text-green-600 group-hover:text-green-700'
            }`}>
              {icon}
            </div>
          )}
          <div>
            <h2 className={`text-2xl font-bold transition-colors ${
              isOpen ? 'text-white' : 'text-gray-800'
            }`}>
              {title}
            </h2>
            {description && (
              <p className={`mt-1 text-sm transition-colors ${
                isOpen ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {description}
              </p>
            )}
          </div>
        </div>
        <svg
          className={`w-6 h-6 transition-all duration-300 ${
            isOpen ? 'text-gray-300 rotate-180' : 'text-gray-400'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div 
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-8 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  )
} 