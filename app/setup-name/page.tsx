'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { supabase } from '@/app/lib/supabase'
import { getUserLocationFromDB } from '@/lib/locationService'
import {
  formatGreetingName,
  getPostAuthRoute,
  normalizeDisplayName,
  validateDisplayNameInput,
} from '@/lib/profileName'

export default function SetupNamePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/auth/login')
  }, [authLoading, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const validationError = validateDisplayNameInput(name)
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)
    try {
      const displayName = normalizeDisplayName(name)
      const { error: saveError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user!.id,
            name: displayName,
            email: user!.email ?? '',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )

      if (saveError) throw saveError

      const location = await getUserLocationFromDB(user!.id).catch(() => null)
      router.replace(getPostAuthRoute(displayName, location))
    } catch {
      setError('Could not save your name. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">What should we call you?</h1>
        <p className="text-sm text-gray-500 mb-6">
          Your name appears on your home screen — for example, Hi {name.trim() ? formatGreetingName(name) : 'Alex'}.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
          )}
          <div>
            <label htmlFor="setup-name" className="block text-sm font-medium text-gray-700 mb-1">
              Your name
            </label>
            <input
              id="setup-name"
              type="text"
              required
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Andrew"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={saving || authLoading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
