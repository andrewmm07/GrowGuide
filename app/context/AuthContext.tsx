'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import {
  getUserLocationFromDB,
  updateUserLocation,
  LocationError,
  getHomeRouteForLocation,
} from '@/lib/locationService'
import { UserLocation } from '@/lib/types/location'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  locationLoading: boolean
  userLocation: UserLocation | null
  detectedLocation: UserLocation | null // Pending confirmation
  locationError: LocationError | null
  confirmLocation: (location: UserLocation) => Promise<void>
  updateLocation: (location: UserLocation) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  locationLoading: true,
  userLocation: null,
  detectedLocation: null,
  locationError: null,
  confirmLocation: async () => {},
  updateLocation: async () => {},
  login: async () => {},
  signup: async () => {},
  logout: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [locationLoading, setLocationLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [detectedLocation, setDetectedLocation] = useState<UserLocation | null>(null)
  const [locationError, setLocationError] = useState<LocationError | null>(null)
  const [wasSignedIn, setWasSignedIn] = useState(false)
  const router = useRouter()

  // Load location from database once auth has finished and user is known
  useEffect(() => {
    if (loading) return

    if (!user) {
      setUserLocation(null)
      setLocationError(null)
      setLocationLoading(false)
      return
    }

    let cancelled = false
    const userId = user.id

    const loadLocationFromDB = async () => {
      setLocationLoading(true)
      try {
        const location = await getUserLocationFromDB(userId)
        if (cancelled) return
        setUserLocation(location ?? null)
        setLocationError(null)
      } catch (error) {
        if (cancelled) return
        if (error instanceof LocationError) {
          // Profile not found or location not set - this is expected for new users
          if (error.type !== 'DB_ERROR') {
            console.log('Location not yet set:', error.message)
          } else {
            console.error('Error loading location:', error)
            setLocationError(error)
          }
        }
        setUserLocation(null)
      } finally {
        if (!cancelled) {
          setLocationLoading(false)
        }
      }
    }

    loadLocationFromDB()

    return () => {
      cancelled = true
    }
  }, [user?.id, loading])

  // Check for existing session on mount and handle auth state changes
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          // Don't clear user on error - might be network issue
          setLoading(false)
          return
        }
        setSession(session)
        setUser(session?.user ?? null)
        setWasSignedIn(!!session?.user) // Track sign-in state
        setLoading(false)
      } catch (error) {
        console.error('Error in getSession:', error)
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes with proper event handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session ? 'session exists' : 'no session')
        
        // Handle different event types
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
            // User is signed in or token refreshed successfully
            setSession(session)
            setUser(session?.user ?? null)
            setWasSignedIn(!!session?.user)
            setLoading(false)
            break
            
          case 'SIGNED_OUT':
            // Handle sign-out event - might be actual logout or token refresh failure
            if (!session) {
              // If we were previously signed in, this might be a token refresh failure
              // Try to recover the session before clearing
              if (wasSignedIn) {
                console.log('SIGNED_OUT event but user was signed in - attempting session recovery')
                try {
                  // Try multiple recovery strategies
                  const { data: { session: currentSession } } = await supabase.auth.getSession()
                  if (currentSession && currentSession.user) {
                    console.log('Recovered session from getSession')
                    setSession(currentSession)
                    setUser(currentSession.user)
                    setWasSignedIn(true)
                    setLoading(false)
                    return
                  }
                  
                  // Try refresh
                  const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
                  if (refreshedSession && refreshedSession.user) {
                    console.log('Session refreshed successfully after SIGNED_OUT')
                    setSession(refreshedSession)
                    setUser(refreshedSession.user)
                    setWasSignedIn(true)
                    setLoading(false)
                    return
                  }
                  
                  if (refreshError) {
                    console.error('Failed to refresh session:', refreshError)
                    // Check if it's a network error vs actual expiration
                    if (refreshError.message?.includes('network') || refreshError.message?.includes('fetch')) {
                      // Network error - keep current session state, don't clear
                      console.log('Network error during refresh - keeping session state')
                      setLoading(false)
                      return
                    }
                  }
                } catch (recoveryError) {
                  console.error('Error during session recovery:', recoveryError)
                  // If it's a network error, don't clear session
                  if (recoveryError instanceof Error && 
                      (recoveryError.message?.includes('network') || recoveryError.message?.includes('fetch'))) {
                    console.log('Network error during recovery - keeping session state')
                    setLoading(false)
                    return
                  }
                }
              }
              
              // Only clear if recovery failed and it's not a network issue
              console.log('Clearing session after SIGNED_OUT event')
              setSession(null)
              setUser(null)
              setWasSignedIn(false)
            } else {
              // Session exists, update it
              setSession(session)
              setUser(session.user)
              setWasSignedIn(true)
            }
            setLoading(false)
            break
            
          default:
            // For other events, just update the session
            setSession(session)
            setUser(session?.user ?? null)
            setWasSignedIn(!!session?.user)
            setLoading(false)
        }
      }
    )

    // Set up periodic session refresh to prevent expiration (refresh every 50 minutes)
    // Supabase sessions typically last 1 hour, so refreshing at 50 minutes prevents expiration
    const refreshInterval = setInterval(async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (currentSession && currentSession.user) {
          // Only refresh if we have a valid session
          const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession()
          if (error) {
            console.error('Periodic session refresh error:', error)
            // If refresh fails, don't clear session immediately - might be network issue
          } else if (refreshedSession) {
            setSession(refreshedSession)
            setUser(refreshedSession.user)
            setWasSignedIn(true)
          }
        }
      } catch (error) {
        console.error('Error in periodic session refresh:', error)
        // Don't clear session on error - might be temporary network issue
      }
    }, 50 * 60 * 1000) // Refresh every 50 minutes

    return () => {
      subscription.unsubscribe()
      clearInterval(refreshInterval)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        throw error
      }

      if (data.session && data.user) {
        setSession(data.session)
        setUser(data.user)
        setWasSignedIn(true)
        setLoading(false)

        try {
          const location = await getUserLocationFromDB(data.user.id)
          setUserLocation(location ?? null)
          setLocationLoading(false)
          router.push(getHomeRouteForLocation(location))
        } catch {
          setUserLocation(null)
          setLocationLoading(false)
          router.push('/location-select')
        }
      }
    } catch (err: any) {
      console.error('Login catch error:', err)
      // If it's a network error, provide a more helpful message
      if (err?.message?.includes('fetch') || err?.message?.includes('network') || !err?.message) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.')
      }
      throw err
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        console.error('Signup error:', error)
        throw error
      }

      if (data.user) {
        // Redirect to email verification page or dashboard
        router.push('/auth/verify-email')
      }
    } catch (err: any) {
      console.error('Signup catch error:', err)
      // If it's a network error, provide a more helpful message
      if (err?.message?.includes('fetch') || err?.message?.includes('network') || !err?.message) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.')
      }
      throw err
    }
  }

  const updateLocation = async (location: UserLocation) => {
    if (!user) {
      throw new Error('User not logged in')
    }

    try {
      await updateUserLocation(user.id, location)
      setUserLocation(location)
      setLocationLoading(false)
      setLocationError(null)
    } catch (error) {
      if (error instanceof LocationError) {
        setLocationError(error)
        throw error
      }
      throw error
    }
  }

  const confirmLocation = async (location: UserLocation) => {
    await updateLocation(location)
    setDetectedLocation(null) // Clear pending location after confirmation
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/')
  }

  const value = {
    user,
    session,
    loading,
    locationLoading,
    userLocation,
    detectedLocation,
    locationError,
    confirmLocation,
    updateLocation,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 