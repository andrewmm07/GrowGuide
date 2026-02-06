import { NextResponse } from 'next/server'

type CacheEntry = { url: string; title: string; expiresAt: number }

// Simple in-memory cache to reduce calls to YouTube during browsing.
// Note: In serverless environments this may not persist; it's still useful in dev.
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 // 24h
const cache = new Map<string, CacheEntry>()

function getFromCache(key: string): { url: string; title: string } | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  return { url: entry.url, title: entry.title }
}

function putInCache(key: string, url: string, title: string) {
  cache.set(key, { url, title, expiresAt: Date.now() + CACHE_TTL_MS })
}

function firstYouTubeVideoUrlFromHtml(html: string): string | null {
  // YouTube embeds many occurrences of /watch?v=VIDEO_ID in the results HTML.
  // We grab the first plausible 11-char video id.
  const match = html.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/i)
  if (!match?.[1]) return null
  return `https://www.youtube.com/watch?v=${match[1]}`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') ?? '').trim()

  if (!query) {
    return NextResponse.json({ error: 'q is required' }, { status: 400 })
  }

  const normalized = query.toLowerCase()
  const cached = getFromCache(normalized)
  if (cached) return NextResponse.json({ ...cached, cached: true })

  try {
    // sp=CAMSAhAB => sort by view count (YouTube web param)
    const searchUrl =
      `https://www.youtube.com/results?search_query=` +
      `${encodeURIComponent(query)}&sp=CAMSAhAB`

    const res = await fetch(searchUrl, {
      // Avoid caching to keep "top by views" reasonably fresh; we cache ourselves.
      cache: 'no-store',
      headers: {
        // Helps ensure we get the normal HTML response.
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
      }
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `YouTube request failed (${res.status})`, searchUrl },
        { status: 502 }
      )
    }

    const html = await res.text()
    const url = firstYouTubeVideoUrlFromHtml(html)

    if (!url) {
      return NextResponse.json(
        { error: 'No video found', searchUrl },
        { status: 404 }
      )
    }

    // Fetch title via YouTube oEmbed (no API key required)
    let title = query
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
      const oembedRes = await fetch(oembedUrl, { cache: 'no-store' })
      if (oembedRes.ok) {
        const data = await oembedRes.json()
        if (data?.title && typeof data.title === 'string') title = data.title
      }
    } catch {
      // ignore
    }

    putInCache(normalized, url, title)
    return NextResponse.json({ url, title, cached: false })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch YouTube results', details: message },
      { status: 500 }
    )
  }
}





