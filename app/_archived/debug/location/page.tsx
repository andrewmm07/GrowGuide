'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { checkLocationInDatabase, logLocationStatus } from '@/app/utils/checkLocation'

export default function LocationDebugPage() {
  const { user, userLocation } = useAuth()
  const [dbLocation, setDbLocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkLocation = async () => {
      setLoading(true)
      setError(null)
      
      const result = await checkLocationInDatabase(user)
      setDbLocation(result)
      setLoading(false)
      
      // Also log to console
      await logLocationStatus(user)
    }

    if (user) {
      checkLocation()
    } else {
      setLoading(false)
      setError('Not logged in')
    }
  }, [user])

  const handleRefresh = async () => {
    setLoading(true)
    setError(null)
    const result = await checkLocationInDatabase(user)
    setDbLocation(result)
    setLoading(false)
    await logLocationStatus(user)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Location Database Check
          </h1>

          {!user ? (
            <div className="text-red-600">
              Please log in to check your location in the database.
            </div>
          ) : loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : (
            <div className="space-y-6">
              {/* Database Status */}
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Database Status</h2>
                {dbLocation?.hasLocation ? (
                  <div className="space-y-2">
                    <div className="flex items-center text-green-600">
                      <span className="text-2xl mr-2">✅</span>
                      <span className="font-semibold">Location found in database</span>
                    </div>
                    <div className="ml-8 space-y-1 text-gray-700">
                      <div><strong>State:</strong> {dbLocation.location.state}</div>
                      <div><strong>City:</strong> {dbLocation.location.city}</div>
                      {dbLocation.profileId && (
                        <div><strong>Profile ID:</strong> {dbLocation.profileId}</div>
                      )}
                      {dbLocation.updatedAt && (
                        <div><strong>Last Updated:</strong> {new Date(dbLocation.updatedAt).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center text-red-600">
                      <span className="text-2xl mr-2">❌</span>
                      <span className="font-semibold">Location NOT found in database</span>
                    </div>
                    {dbLocation?.error && (
                      <div className="ml-8 text-gray-700">
                        <strong>Error:</strong> {dbLocation.error}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Current App State */}
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Current App State</h2>
                {userLocation ? (
                  <div className="space-y-1 text-gray-700">
                    <div><strong>State:</strong> {userLocation.state}</div>
                    <div><strong>City:</strong> {userLocation.city}</div>
                  </div>
                ) : (
                  <div className="text-gray-600">No location set in app state</div>
                )}
              </div>

              {/* localStorage Status */}
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">localStorage Status</h2>
                {typeof window !== 'undefined' && localStorage.getItem('userLocation') ? (
                  <div className="space-y-1">
                    <div className="text-green-600 font-semibold">✅ Location found in localStorage</div>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                      {JSON.stringify(JSON.parse(localStorage.getItem('userLocation') || '{}'), null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-gray-600">No location in localStorage</div>
                )}
              </div>

              {/* User Info */}
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">User Info</h2>
                <div className="space-y-1 text-gray-700">
                  <div><strong>User ID:</strong> {user?.id}</div>
                  <div><strong>Email:</strong> {user?.email}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Refresh Check
                </button>
                <button
                  onClick={() => {
                    console.log('=== Location Debug Info ===')
                    logLocationStatus(user)
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Log to Console
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                  <li>This page shows whether your location is saved in the Supabase database</li>
                  <li>If location is NOT in database but IS in localStorage, it will be saved automatically on next login</li>
                  <li>Click "Log to Console" to see detailed debug info in your browser console</li>
                  <li>You can also check directly in Supabase dashboard: Table Editor → profiles → find your user ID</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

