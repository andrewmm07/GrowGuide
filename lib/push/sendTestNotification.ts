/**
 * Send an immediate test notification (inbox + local/FCM push).
 * Ignores Tuesday/Friday/8am schedule — for verifying the pipeline works.
 */

import { insertNotificationIfNew } from '@/app/lib/notificationsDb'
import type { NotificationPayload } from '@/lib/notificationTypes'
import {
  deliverPushForPayload,
  invokeRemotePush,
  isNativePushEnvironment,
  registerAndSaveDevicePushToken,
  type PushRegistrationResult,
} from '@/lib/push/nativePush'

export type TestPushResult = {
  ok: boolean
  message: string
  notificationId?: string
  registration?: PushRegistrationResult
}

function buildTestPayload(): NotificationPayload {
  const now = new Date()
  return {
    type: 'weather',
    title: 'GrowGuide test notification',
    body: `Sent at ${now.toLocaleString('en-AU', { hour: '2-digit', minute: '2-digit' })} — push is working.`,
    dedupeKey: `test:${now.getTime()}`,
    data: {
      deepLink: '/notifications',
      preview: ['Test push'],
    },
  }
}

export async function sendTestNotificationNow(userId: string): Promise<TestPushResult> {
  const payload = buildTestPayload()

  let registration: PushRegistrationResult = 'skipped'
  if (isNativePushEnvironment()) {
    registration = await registerAndSaveDevicePushToken(userId)
    if (registration === 'denied') {
      return {
        ok: false,
        message:
          'Allow notifications for GrowGuide in Android settings, then try again.',
        registration,
      }
    }
  }

  const row = await insertNotificationIfNew(userId, payload)
  if (!row) {
    return {
      ok: false,
      message: 'Could not save test notification. Try again in a moment.',
      registration,
    }
  }

  await deliverPushForPayload(payload)

  if (isNativePushEnvironment()) {
    await invokeRemotePush(row.id)
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('growguide-notifications-synced'))
  }

  const via =
    registration === 'ok' || registration === 'skipped'
      ? isNativePushEnvironment()
        ? 'Check your notification shade and the in-app inbox.'
        : 'Check the in-app inbox (browser push if allowed).'
      : 'Saved to inbox; push registration may still be pending.'

  return {
    ok: true,
    message: `Test sent. ${via}`,
    notificationId: row.id,
    registration,
  }
}
