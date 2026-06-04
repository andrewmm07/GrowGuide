import { redirect } from 'next/navigation'

/** @deprecated Use /planting-calendar — climate-aware canonical guide. */
export default function LegacyEdiblePlantingCalendarPage() {
  redirect('/planting-calendar')
}
