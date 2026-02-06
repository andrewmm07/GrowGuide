'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function Settings() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(false)
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Settings</h1>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-700 dark:text-gray-200 font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive planting reminders and tips</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`${
                  notifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-700 dark:text-gray-200 font-medium">Email Updates</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive monthly gardening newsletters</p>
              </div>
              <button
                onClick={() => setEmailUpdates(!emailUpdates)}
                className={`${
                  emailUpdates ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    emailUpdates ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Measurement Units */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Measurement Units
              </label>
              <select
                value={units}
                onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <option value="metric">Metric (cm, m)</option>
                <option value="imperial">Imperial (inches, feet)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 