import { NextResponse } from 'next/server'

type CacheEntry = { url: string; title: string; expiresAt: number }
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days
const cache = new Map<string, CacheEntry>()

function getCached(term: string): { url: string; title: string } | null {
  const entry = cache.get(term)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(term)
    return null
  }
  return { url: entry.url, title: entry.title }
}

function setCached(term: string, url: string, title: string) {
  cache.set(term, { url, title, expiresAt: Date.now() + CACHE_TTL_MS })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const termRaw = (searchParams.get('term') ?? '').trim()
  if (!termRaw) {
    return NextResponse.json({ error: 'term is required' }, { status: 400 })
  }

  const term = termRaw.toLowerCase()
  const cached = getCached(term)
  if (cached) return NextResponse.json({ ...cached, cached: true })

  try {
    // Wikipedia OpenSearch returns direct page URLs.
    // Example response: ["term", ["Title"], ["desc"], ["https://en.wikipedia.org/wiki/Title"]]
    const url =
      `https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&search=` +
      encodeURIComponent(termRaw)

    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      return NextResponse.json(
        { error: `Wikipedia request failed (${res.status})` },
        { status: 502 }
      )
    }

    const data = (await res.json()) as unknown
    if (!Array.isArray(data) || data.length < 4) {
      return NextResponse.json({ error: 'Unexpected Wikipedia response' }, { status: 502 })
    }

    const titles = data[1]
    const urls = data[3]
    const title = Array.isArray(titles) && typeof titles[0] === 'string' ? titles[0] : null
    const pageUrl = Array.isArray(urls) && typeof urls[0] === 'string' ? urls[0] : null

    if (!title || !pageUrl) {
      return NextResponse.json({ error: 'No Wikipedia page found' }, { status: 404 })
    }

    setCached(term, pageUrl, title)
    return NextResponse.json({ url: pageUrl, title, cached: false })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch Wikipedia page', details: message },
      { status: 500 }
    )
  }
}




