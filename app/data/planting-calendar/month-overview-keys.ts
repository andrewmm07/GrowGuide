/** Stable lookup key: STATE:place:Month (matches CSV place + state columns). */
export function monthOverviewLookupKey(state: string, place: string, month: string): string {
  const cap =
    month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()
  return `${state.toUpperCase()}:${place.trim().toLowerCase()}:${cap}`
}
