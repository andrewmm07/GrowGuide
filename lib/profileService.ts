import { supabase } from '@/app/lib/supabase'
import { hasDisplayName, normalizeDisplayName } from './profileName'

/** Load profile name, backfilling from signup metadata when missing. */
export async function ensureProfileDisplayName(
  userId: string,
  metadataName?: string
): Promise<string | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', userId)
    .single()

  if (hasDisplayName(profile?.name)) {
    return normalizeDisplayName(profile!.name!)
  }

  if (hasDisplayName(metadataName)) {
    const displayName = normalizeDisplayName(metadataName!)
    await supabase.from('profiles').upsert(
      {
        id: userId,
        name: displayName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    return displayName
  }

  return null
}
