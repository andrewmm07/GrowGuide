'use client'

import { useState, useEffect } from 'react'

export interface PlantedItem {
  id: string
  name: string
  plantingDate: Date
  type: 'seed' | 'seedling'
}

export function usePlantedItems() {
  const [plantedItems, setPlantedItems] = useState<PlantedItem[]>([])

  // Load planted items on mount
  useEffect(() => {
    const saved = localStorage.getItem('plantedItems')
    if (saved) {
      setPlantedItems(JSON.parse(saved).map((item: any) => ({
        ...item,
        plantingDate: new Date(item.plantingDate)
      })))
    }
  }, [])

  const addPlantedItem = (name: string, type: 'seed' | 'seedling') => {
    const newItem: PlantedItem = {
      id: crypto.randomUUID(),
      name,
      plantingDate: new Date(),
      type
    }
    
    const updatedItems = [...plantedItems, newItem]
    setPlantedItems(updatedItems)
    localStorage.setItem('plantedItems', JSON.stringify(updatedItems))
    return newItem
  }

  const removePlantedItem = (name: string, type: 'seed' | 'seedling') => {
    const updatedItems = plantedItems.filter(item => 
      !(item.name.toLowerCase() === name.toLowerCase() && item.type === type)
    )
    setPlantedItems(updatedItems)
    localStorage.setItem('plantedItems', JSON.stringify(updatedItems))
  }

  const isPlanted = (name: string, type: 'seed' | 'seedling') => {
    return plantedItems.some(item => 
      item.name.toLowerCase() === name.toLowerCase() && 
      item.type === type
    )
  }

  return {
    plantedItems,
    addPlantedItem,
    removePlantedItem,
    isPlanted
  }
} 