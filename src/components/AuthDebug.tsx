import { supabase } from '../lib/supabaseClient'

export function AuthDebug() {
  const debugAuth = async () => {
    console.log('Auth object:', supabase.auth)
    console.log('Available methods:', Object.keys(supabase.auth))
    
    try {
      const session = await supabase.auth.getSession()
      console.log('Current session:', session)
    } catch (error) {
      console.error('Session error:', error)
    }
  }

  return (
    <button onClick={debugAuth}>
      Debug Auth
    </button>
  )
} 