import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

/**
 * Check if user's location is saved in the database
 * @param user - The authenticated user
 * @returns Object with location data and status
 */
export async function checkLocationInDatabase(user: User | null) {
  if (!user) {
    return {
      hasLocation: false,
      location: null,
      error: 'User not authenticated'
    }
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, state, city, created_at, updated_at')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error checking location:', error)
      return {
        hasLocation: false,
        location: null,
        error: error.message
      }
    }

    if (data && data.state && data.city) {
      return {
        hasLocation: true,
        location: {
          state: data.state,
          city: data.city
        },
        profileId: data.id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    } else {
      return {
        hasLocation: false,
        location: null,
        error: 'Location not found in database'
      }
    }
  } catch (error) {
    console.error('Error checking location:', error)
    return {
      hasLocation: false,
      location: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Log location status to console (for debugging)
 */
export async function logLocationStatus(user: User | null) {
  console.log('📍 Checking location in database...')
  console.log('User ID:', user?.id)
  
  const result = await checkLocationInDatabase(user)
  
  if (result.hasLocation) {
    console.log('✅ Location found in database:')
    console.log('  State:', result.location?.state)
    console.log('  City:', result.location?.city)
    console.log('  Profile ID:', result.profileId)
    console.log('  Updated:', result.updatedAt)
  } else {
    console.log('❌ Location NOT found in database')
    if (result.error) {
      console.log('  Error:', result.error)
    }
    
    // Check localStorage as fallback
    const localLocation = localStorage.getItem('userLocation')
    if (localLocation) {
      console.log('⚠️ Found location in localStorage (not in database):')
      console.log('  ', JSON.parse(localLocation))
    } else {
      console.log('⚠️ No location found in localStorage either')
    }
  }
  
  return result
}

