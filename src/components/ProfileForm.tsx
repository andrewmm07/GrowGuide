import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

// Simple zone mapping function - customize based on your needs
const mapLocationToZone = (location: string): string => {
  // This is a simplified example - implement your own mapping logic
  if (location.toLowerCase().includes('vic')) return 'VIC'
  if (location.toLowerCase().includes('nsw')) return 'NSW'
  // Add more mappings as needed
  return 'UNKNOWN'
}

export function ProfileForm() {
  const { user } = useAuth()
  const [location, setLocation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!user) throw new Error('Not authenticated')

      const zone = mapLocationToZone(location)

      const { error } = await supabase
        .from('users')
        .update({ 
          location: location,
          zone: zone 
        })
        .eq('id', user.id)

      if (error) throw error
      
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="e.g., Melbourne, VIC"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
} 