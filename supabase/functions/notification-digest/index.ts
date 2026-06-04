/**
 * Scheduled notification digest — runs on narrow Supabase cron windows (not hourly).
 * Tuesday 8am planting, daily 8am weather, Friday 5:30pm tasks (user local timezone).
 *
 * Deploy: supabase functions deploy notification-digest
 * Cron: hourly, Authorization: Bearer <CRON_SECRET>
 * Secrets: WEATHER_API_KEY, FIREBASE_* (see docs/PUSH_NOTIFICATIONS.md)
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { runScheduledNotificationDigest } from './digest.bundle.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const cronSecret = Deno.env.get('CRON_SECRET')
  const auth = req.headers.get('Authorization') ?? ''
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : auth

  if (cronSecret && bearer !== cronSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const weatherApiKey = Deno.env.get('WEATHER_API_KEY')
    if (!weatherApiKey) {
      return new Response(JSON.stringify({ error: 'WEATHER_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const projectId = Deno.env.get('FIREBASE_PROJECT_ID')
    const clientEmail = Deno.env.get('FIREBASE_CLIENT_EMAIL')
    const privateKey = Deno.env.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n')

    const firebase =
      projectId && clientEmail && privateKey
        ? { projectId, clientEmail, privateKey }
        : undefined

    const result = await runScheduledNotificationDigest({
      supabaseUrl: Deno.env.get('SUPABASE_URL')!,
      serviceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      weatherApiKey,
      firebase,
    })

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
