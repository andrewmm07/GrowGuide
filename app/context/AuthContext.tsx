'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface LocationData {
  state: string
  city: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  locationLoading: boolean
  userLocation: LocationData | null
  setUserLocation: (location: LocationData) => void
  updateLocation: (state: string, city: string) => Promise<void>
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
  setUserLocation: () => {},
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
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [wasSignedIn, setWasSignedIn] = useState(false) // Track if user was previously signed in
  const router = useRouter()

  // Load location from profile when user changes
  useEffect(() => {
    const loadLocationFromProfile = async () => {
      // Always check localStorage first (fast, synchronous)
      let parsedLocalStorageLocation: LocationData | null = null
      const savedLocation = localStorage.getItem('userLocation')
      if (savedLocation) {
        try {
          const location = JSON.parse(savedLocation)
          if (location.state && location.city) {
            parsedLocalStorageLocation = { state: location.state, city: location.city }
            setUserLocation(parsedLocalStorageLocation)
            // If we have localStorage, use it immediately and continue loading from DB in background
            if (!user) {
              setLocationLoading(false)
              return
            }
          }
        } catch (error) {
          console.error('Error parsing saved location:', error)
          localStorage.removeItem('userLocation')
        }
      }

      if (!user) {
        setLocationLoading(false)
        return
      }

      // Load from database profile (async, update if different)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('state, city')
          .eq('id', user.id)
          .single()

        if (error) {
          // Handle specific error cases
          if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
            // Profile doesn't exist yet - this is okay, we'll create it if we have localStorage data
            console.log('Profile not found in database (will create if needed)')
          } else if (error.code === '406' || error.message?.includes('406')) {
            // 406 Not Acceptable - table might not exist or columns missing
            console.warn('⚠️ Database table/columns may not exist. Run migration:', error)
            console.warn('Error details:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            })
          } else {
            console.error('Error loading location from profile:', error)
          }
        }

        if (!error && data && data.state && data.city) {
          // Database has location - use it
          const locationData: LocationData = {
            state: data.state,
            city: data.city
          }
          setUserLocation(locationData)
          // Update localStorage with database value
          localStorage.setItem('userLocation', JSON.stringify(locationData))
        } else if (parsedLocalStorageLocation) {
          // Database doesn't have location but localStorage does - save to database
          try {
            const { error: updateError } = await supabase
              .from('profiles')
              .upsert({ 
                id: user.id,
                state: parsedLocalStorageLocation.state, 
                city: parsedLocalStorageLocation.city,
                email: user.email || '',
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              })
            
            if (updateError) {
              console.error('Error saving location to database:', updateError)
              console.error('Error details:', {
                message: updateError.message,
                details: updateError.details,
                hint: updateError.hint,
                code: updateError.code
              })
              // Keep localStorage value even if DB save fails
            } else {
              console.log('✅ Saved localStorage location to database')
            }
            // Location already set from localStorage above, so we're good
          } catch (saveError) {
            console.error('Error saving localStorage location to database:', saveError)
            // Keep localStorage value even if DB save fails
          }
        }
      } catch (error) {
        console.error('Error loading location from profile:', error)
        // Keep localStorage value if it exists
      } finally {
        setLocationLoading(false)
      }
    }

    loadLocationFromProfile()
  }, [user])

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

      if (data.session) {
        router.push('/dashboard')
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

  const updateLocation = async (state: string, city: string) => {
    const locationData: LocationData = { state, city }
    // Save to localStorage
    localStorage.setItem('userLocation', JSON.stringify(locationData))
    setUserLocation(locationData)
    
    // Save to Supabase profile if user is logged in
    if (user) {
      try {
        // Use upsert to create profile if it doesn't exist, or update if it does
        const { error } = await supabase
          .from('profiles')
          .upsert({ 
            id: user.id,
            state, 
            city,
            email: user.email || '',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })
        
        if (error) {
          console.error('Error saving location to database:', error)
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          // Don't throw - localStorage update is sufficient
        } else {
          console.log('✅ Location saved to database successfully')
        }
      } catch (error) {
        console.error('Error updating location:', error)
        // Don't throw - localStorage update is sufficient
      }
    }
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
    setUserLocation,
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