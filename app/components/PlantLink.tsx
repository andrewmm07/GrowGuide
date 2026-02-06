'use client'

import { useState } from 'react'
import { usePlantedItems } from '../hooks/usePlantedItems'

interface PlantLinkProps {
  name: string
  type: 'seed' | 'seedling'
}

export default function PlantLink({ name, type }: PlantLinkProps) {
  const { addPlantedItem, removePlantedItem, isPlanted } = usePlantedItems()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const planted = isPlanted(name, type)

  const handlePlant = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (planted) {
      removePlantedItem(name, type)
      setToastMessage('Removed from My Garden')
    } else {
      addPlantedItem(name, type)
      setToastMessage('Added to My Garden!')
    }
    
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  return (
    <div className="relative group">
      <button
        onClick={handlePlant}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
          planted 
            ? 'bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {/* Plus icon for both seeds and seedlings */}
        <span className="w-4 h-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </span>
        
        <span>{name}</span>
        
        {/* Checkmark when planted */}
        {planted && (
          <svg className="w-4 h-4 text-green-600 group-hover:text-red-600 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        )}
      </button>

      {/* Toast notification */}
      {showToast && (
        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap z-50 ${
          toastMessage.includes('Removed') 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {toastMessage}
        </div>
      )}
    </div>
  )
} 