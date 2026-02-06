'use client'
import { createClient } from '@supabase/supabase-js'

// Get environment variables - these are available in client components
// NOTE: These are embedded at BUILD TIME by Next.js, so you MUST restart the dev server
// after changing .env.local for changes to take effect
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  const error = 'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please check your .env.local file and restart your dev server.'
  console.error('❌', error)
  throw new Error(error)
}

if (!supabaseAnonKey) {
  const error = 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please check your .env.local file and restart your dev server.'
  console.error('❌', error)
  throw new Error(error)
}

// Ensure URL has proper format
const formattedUrl = supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`

export const supabase = createClient(formattedUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
}) 