import { NextResponse } from 'next/server'

type CacheEntry = { title: string; expiresAt: number }
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 // 24h
const cache = new Map<string, CacheEntry>()

function getCached(url: string): string | null {
  const entry = cache.get(url)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(url)
    return null
  }
  return entry.title
}

function setCached(url: string, title: string) {
  cache.set(url, { title, expiresAt: Date.now() + CACHE_TTL_MS })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = (searchParams.get('url') ?? '').trim()

  if (!url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  const cached = getCached(url)
  if (cached) return NextResponse.json({ title: cached, cached: true })

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const res = await fetch(oembedUrl, { cache: 'no-store' })
    if (!res.ok) {
      return NextResponse.json(
        { error: `oEmbed request failed (${res.status})` },
        { status: 502 }
      )
    }
    const data = await res.json()
    const title = typeof data?.title === 'string' ? data.title : null
    if (!title) {
      return NextResponse.json({ error: 'No title found' }, { status: 404 })
    }
    setCached(url, title)
    return NextResponse.json({ title, cached: false })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch oEmbed', details: message },
      { status: 500 }
    )
  }
}




