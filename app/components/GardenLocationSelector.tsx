'use client'

interface GardenLocationSelectorProps {
  onLocationSelect: (state: string, city: string) => void
}

export function GardenLocationSelector({ onLocationSelect }: GardenLocationSelectorProps) {
  // ... rest of the component
} 