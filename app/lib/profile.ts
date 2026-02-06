import { Profile } from '../types/profile'

interface ProfileUpdate {
  location?: string
  // Add other profile fields as needed
}

export async function updateProfile(update: ProfileUpdate): Promise<void> {
  // Get existing profile
  const existingProfile = localStorage.getItem('userProfile')
  const profile = existingProfile ? JSON.parse(existingProfile) : {}
  
  // Update profile
  const updatedProfile = {
    ...profile,
    ...update
  }
  
  // Save to localStorage
  localStorage.setItem('userProfile', JSON.stringify(updatedProfile))

  // Here you could also add API calls to sync with backend
  // await fetch('/api/profile', {
  //   method: 'PUT',
  //   body: JSON.stringify(updatedProfile)
  // })
} 