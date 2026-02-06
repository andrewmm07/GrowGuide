'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Profile {
  location: string
  // Add other profile fields as needed
}

interface ProfileContextType {
  data: Profile | null
  setData: (data: Profile | null) => void
  isLoading: boolean
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load profile from localStorage on mount
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      setData(JSON.parse(savedProfile))
    }
    setIsLoading(false)
  }, [])

  // Update the context when profile changes
  useEffect(() => {
    if (data) {
      localStorage.setItem('userProfile', JSON.stringify(data))
    }
  }, [data])

  return (
    <ProfileContext.Provider value={{ data, setData, isLoading }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
} 