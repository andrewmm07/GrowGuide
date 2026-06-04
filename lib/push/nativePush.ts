/**
 * Native push delivery (Capacitor) + optional FCM via Supabase Edge Function.
 * Works with static Next export — no app/api routes required.
 */

import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { PushNotifications } from '@capacitor/push-notifications'
import type { NotificationPayload, NotificationRow } from '@/lib/notificationTypes'
import type { PushPlatform } from '@/app/lib/pushTokensDb'

const CHANNEL_ID = 'growguide-garden'

export function isNativePushEnvironment(): boolean {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform()
}

function stableNotificationId(dedupeKey: string): number {
  let h = 0
  for (let i = 0; i < dedupeKey.length; i++) {
    h = (Math.imul(31, h) + dedupeKey.charCodeAt(i)) | 0
  }
  return Math.abs(h) % 2147483646 || 1
}

export async function ensureLocalNotificationChannel(): Promise<void> {
  if (!isNativePushEnvironment()) return
  try {
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: 'Garden tips',
      description: 'Planting tips, weekend tasks, and weather alerts',
      importance: 5,
      vibration: true,
    })
  } catch {
    /* channel may already exist */
  }
}

/** Show a system notification immediately (no FCM required). */
export async function showLocalPush(payload: NotificationPayload): Promise<void> {
  if (!isNativePushEnvironment()) return

  await ensureLocalNotificationChannel()

  const perm = await LocalNotifications.checkPermissions()
  if (perm.display !== 'granted') {
    const req = await LocalNotifications.requestPermissions()
    if (req.display !== 'granted') return
  }

  const id = stableNotificationId(payload.dedupeKey)
  await LocalNotifications.schedule({
    notifications: [
      {
        id,
        title: payload.title,
        body: payload.body,
        channelId: CHANNEL_ID,
        extra: {
          deepLink: payload.data?.deepLink ?? '/dashboard',
          type: payload.type,
        },
      },
    ],
  })
}

/** Browser tab notification when the Web Notifications API is available. */
export async function showWebPush(payload: NotificationPayload): Promise<void> {
  if (typeof window === 'undefined' || isNativePushEnvironment()) return
  if (!('Notification' in window)) return

  let permission = Notification.permission
  if (permission === 'default') {
    permission = await Notification.requestPermission()
  }
  if (permission !== 'granted') return

  const n = new Notification(payload.title, {
    body: payload.body,
    tag: payload.dedupeKey,
  })
  n.onclick = () => {
    window.focus()
    const link = payload.data?.deepLink ?? '/dashboard'
    window.location.href = link
  }
}

export async function deliverPushForPayload(payload: NotificationPayload): Promise<void> {
  if (isNativePushEnvironment()) {
    await showLocalPush(payload)
  } else {
    await showWebPush(payload)
  }
}

export async function invokeRemotePush(notificationId: string): Promise<void> {
  const { supabase } = await import('@/app/lib/supabase')
  const { error } = await supabase.functions.invoke('send-push', {
    body: { notificationId },
  })
  if (error) {
    console.warn('send-push edge function', error.message)
  }
}

/** @deprecated Server cron sends FCM; kept for manual send-push testing only. */
export async function deliverPushForNewNotification(
  _row: NotificationRow,
  _payload: NotificationPayload
): Promise<void> {
  /* Scheduled push is handled by notification-digest Edge Function. */
}

export function currentPushPlatform(): PushPlatform {
  const p = Capacitor.getPlatform()
  if (p === 'ios') return 'ios'
  if (p === 'android') return 'android'
  return 'web'
}

let listenersAttached = false
let lastRegisteredToken: string | null = null
let onTokenReceived: ((token: string, platform: PushPlatform) => Promise<void>) | null = null

export type PushRegistrationHandlers = {
  onToken: (token: string, platform: PushPlatform) => Promise<void>
}

export type PushRegistrationResult = 'ok' | 'denied' | 'skipped' | 'error'

/** Register for FCM/APNs on native and save token when received. */
export async function registerNativeRemotePush(
  handlers: PushRegistrationHandlers
): Promise<void> {
  if (!isNativePushEnvironment()) return

  const perm = await PushNotifications.requestPermissions()
  if (perm.receive !== 'granted') return

  onTokenReceived = handlers.onToken

  if (!listenersAttached) {
    listenersAttached = true

    await PushNotifications.addListener('registration', async (ev) => {
      const token = ev.value
      if (!token || !onTokenReceived) return
      lastRegisteredToken = token
      await onTokenReceived(token, currentPushPlatform())
    })

    await PushNotifications.addListener('registrationError', (err) => {
      console.warn('Push registration error', err)
    })

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      const link =
        (action.notification.data?.deepLink as string | undefined) ??
        action.notification.data?.deep_link ??
        '/dashboard'
      if (typeof window !== 'undefined') {
        window.location.href = link
      }
    })
  }

  await PushNotifications.register()
}

/** Auto-register this device when notifications are enabled (native only). */
export async function registerAndSaveDevicePushToken(
  userId: string
): Promise<PushRegistrationResult> {
  if (!isNativePushEnvironment()) return 'skipped'

  await ensureLocalNotificationChannel()

  const perm = await PushNotifications.checkPermissions()
  const granted =
    perm.receive === 'granted' ||
    (await PushNotifications.requestPermissions()).receive === 'granted'
  if (!granted) return 'denied'

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let resolveWait: (r: PushRegistrationResult) => void = () => {}
  const waitForToken = new Promise<PushRegistrationResult>((resolve) => {
    resolveWait = (r) => {
      if (timeoutId) clearTimeout(timeoutId)
      resolve(r)
    }
    timeoutId = setTimeout(() => resolve('error'), 20000)
  })

  try {
    await registerNativeRemotePush({
      onToken: async (token, platform) => {
        const { upsertPushDeviceToken } = await import('@/app/lib/pushTokensDb')
        await upsertPushDeviceToken(userId, token, platform)
        resolveWait('ok')
      },
    })

    if (lastRegisteredToken) {
      const { upsertPushDeviceToken } = await import('@/app/lib/pushTokensDb')
      await upsertPushDeviceToken(userId, lastRegisteredToken, currentPushPlatform())
      return 'ok'
    }

    return await waitForToken
  } catch {
    return 'error'
  }
}

export function getLastRegisteredPushToken(): string | null {
  return lastRegisteredToken
}
