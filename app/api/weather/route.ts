import { NextResponse } from 'next/server'

/**
 * Static-export safe stub.
 * This project is configured with `output: 'export'`, so runtime API routes are unavailable.
 */
export async function GET() {
  return NextResponse.json(
    {
      error: {
        message:
          'Weather API route is unavailable in static export builds. Fetch WeatherAPI directly from the client.',
      },
    },
    { status: 501 }
  )
}
