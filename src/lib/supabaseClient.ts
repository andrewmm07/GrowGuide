import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Create client without explicit config - it will use env vars automatically
export const supabase = createClientComponentClient()

// Debug log
console.log('Supabase client initialized') 