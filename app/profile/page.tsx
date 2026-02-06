'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useTheme } from 'next-themes'
import LocationSelector from '../components/LocationSelector'
import { getClimateZone } from '../utils/climate'

interface Profile {
  id: string
  name: string
  email: string
  state: string
  city: string
  created_at: string
}

export default function ProfilePage() {
  const { user, userLocation, updateLocation } = useAuth()
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activeSection, setActiveSection] = useState<'profile' | 'location' | 'password' | 'theme'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error

      setProfile(data)
      setFormData({
        name: data.name || '',
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (error) throw error

      setSuccessMessage('Profile updated successfully')
      setIsEditing(false)
      fetchProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSelect = async (state: string, city: string) => {
    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      await updateLocation(state, city)
      setSuccessMessage('Location updated successfully')
      setIsEditingLocation(false)
    } catch (error) {
      console.error('Error saving location:', error)
      setError('Failed to save location. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      setSuccessMessage('Password updated successfully')
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      console.error('Error changing password:', error)
      setError(error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const currentTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'light'

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-300">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Profile Settings</h1>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
            {successMessage}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <nav className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-2">
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'profile'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveSection('location')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'location'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Location
              </button>
              <button
                onClick={() => setActiveSection('password')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'password'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Password
              </button>
              <button
                onClick={() => setActiveSection('theme')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'theme'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Theme
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Profile Information</h2>
                    
                    {isEditing ? (
                      <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                        </div>

                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div className="flex gap-4">
                          <button
                            type="submit"
                            disabled={loading}
                            className={`bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors ${
                              loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {loading ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false)
                              setFormData({ name: profile?.name || '' })
                            }}
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h3>
                          <p className="text-gray-900 dark:text-white text-lg">{user?.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Name</h3>
                          <p className="text-gray-900 dark:text-white text-lg">{profile?.name || 'Not set'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Member Since</h3>
                          <p className="text-gray-900 dark:text-white text-lg">
                            {profile?.created_at
                              ? new Date(profile.created_at).toLocaleDateString()
                              : 'Unknown'}
                          </p>
                        </div>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                          Edit Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location Section */}
              {activeSection === 'location' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Location Settings</h2>
                    
                    {isEditingLocation ? (
                      <div className="space-y-4">
                        <LocationSelector 
                          onLocationSelect={handleLocationSelect}
                          submitLabel="Save Location"
                          isLoading={loading}
                          showCancelButton={true}
                          onCancel={() => setIsEditingLocation(false)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Location</h3>
                          {userLocation ? (
                            <div className="space-y-2">
                              <p className="text-gray-900 dark:text-white text-lg">
                                {userLocation.city}, {userLocation.state}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Climate Zone: {getClimateZone(userLocation.state, userLocation.city)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">No location set</p>
                          )}
                        </div>
                        <button
                          onClick={() => setIsEditingLocation(true)}
                          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                          Change Location
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Password Section */}
              {activeSection === 'password' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Change Password</h2>
                    
                    {isChangingPassword ? (
                      <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter current password"
                          />
                        </div>

                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter new password (min. 6 characters)"
                          />
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Confirm new password"
                          />
                        </div>

                        <div className="flex gap-4">
                          <button
                            type="submit"
                            disabled={loading}
                            className={`bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors ${
                              loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {loading ? 'Changing...' : 'Change Password'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsChangingPassword(false)
                              setPasswordData({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                              })
                            }}
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-400">
                          Keep your account secure by regularly updating your password.
                        </p>
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                          Change Password
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Theme Section */}
              {activeSection === 'theme' && mounted && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Appearance Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Theme
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <button
                            onClick={() => setTheme('light')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              currentTheme === 'light'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg"></div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Light</span>
                            </div>
                          </button>
                          <button
                            onClick={() => setTheme('dark')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              currentTheme === 'dark'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 bg-gray-800 border-2 border-gray-600 rounded-lg"></div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark</span>
                            </div>
                          </button>
                          <button
                            onClick={() => setTheme('system')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              theme === 'system'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg"></div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System</span>
                            </div>
                          </button>
                        </div>
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                          {theme === 'system' 
                            ? `Using system preference (${systemTheme === 'dark' ? 'Dark' : 'Light'})`
                            : `Currently using ${currentTheme === 'dark' ? 'Dark' : 'Light'} theme`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'theme' && !mounted && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Appearance Settings</h2>
                    <p className="text-gray-600 dark:text-gray-400">Loading theme settings...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
