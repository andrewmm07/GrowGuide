import { supabase } from '@/app/lib/supabase'

export type PushPlatform = 'android' | 'ios' | 'web'

export async function upsertPushDeviceToken(
  userId: string,
  token: string,
  platform: PushPlatform
): Promise<void> {
  const { error } = await supabase.from('push_device_tokens').upsert(
    {
      user_id: userId,
      token,
      platform,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,token' }
  )

  if (error) throw new Error(error.message)
}

export async function removePushDeviceToken(userId: string, token: string): Promise<void> {
  const { error } = await supabase
    .from('push_device_tokens')
    .delete()
    .eq('user_id', userId)
    .eq('token', token)

  if (error) throw new Error(error.message)
}

export async function markNotificationPushSent(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ push_sent_at: new Date().toISOString() })
    .eq('id', notificationId)

  if (error) console.warn('markNotificationPushSent', error.message)
}
