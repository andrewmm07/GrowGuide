import { Capacitor } from '@capacitor/core'

/**
 * Remote FCM/APNs requires Firebase on Android (google-services.json in android/app/).
 * Calling PushNotifications.register() without it crashes the native WebView — see
 * https://github.com/ionic-team/capacitor-plugins/issues/2370
 *
 * Set NEXT_PUBLIC_FCM_CONFIGURED=true in .env.local only after adding google-services.json.
 */
export function isRemotePushConfigured(): boolean {
  return process.env.NEXT_PUBLIC_FCM_CONFIGURED === 'true'
}

export function canRegisterRemotePush(): boolean {
  if (!Capacitor.isNativePlatform()) return false
  if (Capacitor.getPlatform() === 'android' && !isRemotePushConfigured()) return false
  return true
}
