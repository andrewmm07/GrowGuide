/**
 * Haversine distance calculation
 * Calculate great-circle distance between two points on Earth
 * Used to find nearest suburb from device GPS coordinates
 */

/**
 * Calculate distance between two latitude/longitude points
 *
 * @param lat1 - Starting latitude in degrees
 * @param lon1 - Starting longitude in degrees
 * @param lat2 - Ending latitude in degrees
 * @param lon2 - Ending longitude in degrees
 * @returns Distance in kilometers
 */
export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find the nearest point from a list based on coordinates
 *
 * @param userLat - User's latitude
 * @param userLon - User's longitude
 * @param points - Array of points with lat/lon
 * @returns Nearest point and distance in km
 */
export function findNearest<T extends { lat: number; lon: number }>(
  userLat: number,
  userLon: number,
  points: T[]
): { point: T; distanceKm: number } | null {
  if (points.length === 0) return null;

  let nearest: T | null = null;
  let minDistance = Infinity;

  for (const point of points) {
    const dist = haversine(userLat, userLon, point.lat, point.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = point;
    }
  }

  return nearest ? { point: nearest, distanceKm: minDistance } : null;
}
