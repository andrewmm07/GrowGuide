import { haversine } from '@/lib/utils/haversine'

/** Sparse coastal samples (~25 km spacing) for near-coast inference. */
const COAST_SAMPLES: ReadonlyArray<{ lat: number; lon: number }> = [
  // TAS
  { lat: -43.0, lon: 147.32 },
  { lat: -42.88, lon: 147.33 },
  { lat: -41.18, lon: 146.35 },
  { lat: -41.05, lon: 145.9 },
  // VIC
  { lat: -37.87, lon: 144.98 },
  { lat: -38.15, lon: 144.36 },
  { lat: -38.39, lon: 142.49 },
  // NSW
  { lat: -33.78, lon: 151.28 },
  { lat: -33.87, lon: 151.21 },
  { lat: -32.93, lon: 151.78 },
  { lat: -34.42, lon: 150.89 },
  { lat: -30.3, lon: 153.12 },
  { lat: -28.65, lon: 153.6 },
  // QLD
  { lat: -27.47, lon: 153.03 },
  { lat: -28.0, lon: 153.43 },
  { lat: -26.65, lon: 153.1 },
  { lat: -23.38, lon: 150.51 },
  { lat: -21.14, lon: 149.18 },
  { lat: -19.26, lon: 146.82 },
  { lat: -16.87, lon: 145.78 },
  // SA
  { lat: -34.98, lon: 138.52 },
  { lat: -35.55, lon: 138.62 },
  { lat: -32.49, lon: 137.77 },
  // WA
  { lat: -32.05, lon: 115.74 },
  { lat: -31.95, lon: 115.86 },
  { lat: -33.33, lon: 115.64 },
  { lat: -33.65, lon: 115.37 },
  { lat: -34.48, lon: 117.88 },
  { lat: -17.96, lon: 122.24 },
  // NT
  { lat: -12.46, lon: 130.85 },
]

const DEFAULT_COAST_KM = 14

export function isNearAustralianCoast(
  lat: number,
  lon: number,
  maxKm = DEFAULT_COAST_KM
): boolean {
  for (const sample of COAST_SAMPLES) {
    if (haversine(lat, lon, sample.lat, sample.lon) <= maxKm) {
      return true
    }
  }
  return false
}
