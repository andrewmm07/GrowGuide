'use client'

interface ViewToggleProps {
  view: 'weekly' | 'monthly'
  onChange: (view: 'weekly' | 'monthly') => void
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onChange('weekly')}
        className={`px-4 py-2 rounded-md transition-colors ${
          view === 'weekly'
            ? 'bg-white text-green-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        Weekly View
      </button>
      <button
        onClick={() => onChange('monthly')}
        className={`px-4 py-2 rounded-md transition-colors ${
          view === 'monthly'
            ? 'bg-white text-green-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        Monthly View
      </button>
    </div>
  )
} 