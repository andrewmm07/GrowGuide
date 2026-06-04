'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useGarden } from '@/app/context/GardenContext'
import { useNotificationPreferences } from '@/app/hooks/useNotificationPreferences'
import { useTasks } from '@/app/hooks/useTasks'
import {
  composePlantingNotification,
  composeWeekendTasksNotification,
} from '@/lib/notificationService'
import { isNativePushEnvironment } from '@/lib/push/nativePush'
import { sendTestNotificationNow } from '@/lib/push/sendTestNotification'

function Toggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0 cursor-pointer">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <input
        type="checkbox"
        className="mt-1 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 shrink-0"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}

export default function NotificationSettings() {
  const { user, userLocation } = useAuth()
  const { plants } = useGarden()
  const { tasks } = useTasks(user?.id)
  const { prefs, loading, saving, saveError, updatePrefs } = useNotificationPreferences()
  const nativeApp = isNativePushEnvironment()
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle')
  const [testMessage, setTestMessage] = useState<string | null>(null)

  const previewPlanting = useMemo(
    () => composePlantingNotification(userLocation, { now: new Date() }),
    [userLocation]
  )
  const previewTasks = useMemo(
    () => composeWeekendTasksNotification(plants, tasks),
    [plants, tasks]
  )

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse h-40" />
    )
  }

  const safePrefs = prefs ?? {
    notificationsEnabled: false,
    plantingTipsEnabled: true,
    weekendTasksEnabled: true,
    weatherAlertsEnabled: true,
    timezone: null,
  }
  const master = safePrefs.notificationsEnabled

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Garden notifications</h2>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        Up to two tips per week (Tuesday planting, Friday tasks) plus urgent weather alerts.
        Tips are sent automatically: Tuesday 8am planting, daily 8am weather when relevant,
        Friday 5:30pm weekend tasks. You do not need to open the app.
      </p>

      {!user && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
          Sign in to save notification preferences to your account.
        </p>
      )}

      {saveError && (
        <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
          {saveError}
        </p>
      )}

      <Toggle
        label="Enable notifications"
        description="Turn on personalised planting and task tips. Off by default."
        checked={master}
        disabled={saving || !user}
        onChange={(v) => updatePrefs({ notificationsEnabled: v })}
      />

      {user && (
        <div className="pt-4 pb-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-800">Test push now</p>
          <p className="text-xs text-gray-500 mt-0.5 mb-2 leading-relaxed">
            Sends immediately — not on the Tuesday/Friday schedule. Press Home to background the
            app, then tap below; you should see a banner and a new item in Notifications.
          </p>
          <button
            type="button"
            disabled={testStatus === 'sending' || saving}
            className="text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
            onClick={async () => {
              setTestStatus('sending')
              setTestMessage(null)
              try {
                const result = await sendTestNotificationNow(user.id)
                setTestStatus(result.ok ? 'ok' : 'fail')
                setTestMessage(result.message)
              } catch (e) {
                setTestStatus('fail')
                setTestMessage(e instanceof Error ? e.message : 'Test failed')
              }
            }}
          >
            {testStatus === 'sending' ? 'Sending…' : 'Send test notification'}
          </button>
          {testMessage && (
            <p
              className={`text-xs mt-2 leading-relaxed ${
                testStatus === 'ok' ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {testMessage}
            </p>
          )}
        </div>
      )}

      {master && (
        <>
          <Toggle
            label="Tuesday — what to plant"
            description="Only when the forecast looks workable for your zone."
            checked={safePrefs.plantingTipsEnabled}
            disabled={saving || !user}
            onChange={(v) => updatePrefs({ plantingTipsEnabled: v })}
          />
          <Toggle
            label="Friday — weekend garden tasks"
            description="From your plants’ care schedules and your custom tasks — never generic watering."
            checked={safePrefs.weekendTasksEnabled}
            disabled={saving || !user}
            onChange={(v) => updatePrefs({ weekendTasksEnabled: v })}
          />
          <Toggle
            label="Weather warnings"
            description="Frost, heat, or heavy rain when it affects your garden."
            checked={safePrefs.weatherAlertsEnabled}
            disabled={saving || !user}
            onChange={(v) => updatePrefs({ weatherAlertsEnabled: v })}
          />

          {nativeApp && user && (
            <p className="text-xs text-gray-500 pt-2 leading-relaxed">
              This phone registers for push automatically when notifications are on. Android
              will ask you to allow notifications — tap Allow.
            </p>
          )}
        </>
      )}

      {master && (previewPlanting || previewTasks) && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Preview (examples from your garden now)
          </p>
          {previewPlanting && (
            <div className="rounded-xl bg-green-50 border border-green-100 p-3">
              <p className="text-xs font-semibold text-green-800">{previewPlanting.title}</p>
              <p className="text-xs text-green-900 mt-1 leading-relaxed">{previewPlanting.body}</p>
            </div>
          )}
          {previewTasks && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
              <p className="text-xs font-semibold text-amber-900">{previewTasks.title}</p>
              <p className="text-xs text-amber-950 mt-1 leading-relaxed">{previewTasks.body}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
