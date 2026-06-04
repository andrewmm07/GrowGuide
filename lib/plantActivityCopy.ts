/**
 * Post-plant care task polish. Rules mirror scripts/plant-activity-rules.mjs.
 */

export type ActivityLike = {
  activity: string
  details: string
  category: string
  daysSincePlanting?: number
}

const CANONICAL: Record<string, string> = {
  'Water consistently at silking — critical': 'Water at silking',
  'Water consistently at silking': 'Water at silking',
  'Water consistently at pod fill': 'Water at pod fill',
  'Water at pod fill — critical': 'Water at pod fill',
  'Harvest promptly — sweetness fades within hours': 'Harvest at peak sweetness',
  'Harvest — sweetness fades within hours': 'Harvest at peak sweetness',
  'Harvest promptly — do not delay': 'Harvest when ready',
  'Harvest — do not delay': 'Harvest when ready',
  'Harvest': 'Harvest when mature',
  'Harvest early and': 'Harvest early at 4–5cm',
  'Year-round cut-and-come-again harvest': 'Begin harvesting — cut-and-come-again',
  'Year-round harvest': 'Begin harvesting',
  'Harvest continuously': 'Begin harvesting regularly',
  'Withhold harvest for 2 years': '',
}

const REMOVE = [
  /^Withhold harvest\b/i,
  /^Plant\b/i,
  /^Sow\b/i,
  /^Direct sow\b/i,
  /^Soak seed\b/i,
  /^Year-round planting\b/i,
  /^Water consistently$/i,
  /^Water consistently —/i,
  /^Water daily\b/i,
  /^Water deeply\b/i,
  /^Water every \d+ days/i,
  /^Water (fortnightly|lightly|minimally|sparingly|shallowly|steadily|regularly)/i,
  /^Water .* until established/i,
  /^Adjust watering\b/i,
  /^Establish /i,
  /^Extreme /i,
  /planting only$/i,
  /^Sheltered /i,
  /^Cool season\b/i,
  /^Dry season (sowing|planting|crop)/i,
  /^Grow in\b/i,
  /^Not (recommended|suitable)\b/i,
  /^Check plant health after establishment$/i,
  /^Install cool running water\b/i,
  /\band$|\b—\s*$/i,
]

const KEEP = [
  /^Begin harvesting/i,
  /^Water at (silking|pod fill)$/,
  /^Stop (water|watering)/i,
  /^Check for/i,
  /^Harvest /i,
  /^Harvest when/i,
  /^Harvest at /i,
  /^Apply /i,
  /^Install /i,
  /^Thin /i,
  /^Remove /i,
  /^Prune /i,
  /^Succession sow/i,
]

const VAGUE_WATERING_TITLE = [
  /^Maintain consistent moisture/i,
  /^Keep consistently moist/i,
  /^Water consistently to slow bolting/i,
]

function isVagueWateringAdvice(
  activity: Pick<ActivityLike, 'activity' | 'details' | 'category'>
): boolean {
  const title = activity.activity.trim()
  const details = activity.details?.trim() ?? ''
  const watering =
    activity.category === 'watering' ||
    /water|moist/i.test(`${title} ${details}`)

  if (!watering) return false

  if (VAGUE_WATERING_TITLE.some((r) => r.test(title))) return true
  if (/^Water regularly$/i.test(details) && /moisture|moist/i.test(title)) return true
  if (/^Keep soil moist$/i.test(details) && /water consistently/i.test(title)) return true
  return false
}

function canonicalize(title: string): string {
  const t = title.trim()
  return CANONICAL[t] ?? t
}

export function shouldRemovePostPlantActivity(
  activity: Pick<ActivityLike, 'activity'>
): boolean {
  let t = canonicalize(activity.activity.trim())
  if (!t) return true

  for (const r of REMOVE) {
    if (r.test(t)) return true
  }
  for (const k of KEEP) {
    if (k.test(t)) return false
  }
  if (/^Transplant\b/i.test(t) && !/^Transplant (firmly|deeply)/i.test(t)) return true
  return false
}

function rewriteTitle(title: string, details: string): { title: string; details: string } {
  let activityTitle = canonicalize(title.trim())
  let detailText = details?.trim() ?? ''

  activityTitle = activityTitle
    .replace(/^Monitor\s+for\b/i, 'Check for')
    .replace(/^Control pests — (.+)$/i, 'Check for $1')
    .replace(/\s+immediately\s*$/i, '')
    .replace(/\s+promptly\s*$/i, '')
    .trim()

  if (/^Avoid high nitrogen fertiliser/i.test(activityTitle)) {
    activityTitle = 'Apply potassium and phosphorus'
    if (!/avoid high-nitrogen/i.test(detailText)) {
      detailText = detailText
        ? `${detailText.replace(/\.$/, '')}. Avoid high-nitrogen blends when side-dressing.`
        : 'Avoid high-nitrogen blends when side-dressing.'
    }
  }

  detailText = detailText.replace(/\bMonitor for\b/gi, 'Check for')

  return { title: canonicalize(activityTitle), details: detailText }
}

export function isNonActionableActivity(
  activity: Pick<ActivityLike, 'activity' | 'details' | 'category'>
): boolean {
  if (isVagueWateringAdvice(activity)) return true
  return shouldRemovePostPlantActivity(activity)
}

export function normalizeActivityCopy<T extends ActivityLike>(activity: T): T | null {
  if (isVagueWateringAdvice(activity)) return null
  if (shouldRemovePostPlantActivity(activity)) return null

  const { title, details } = rewriteTitle(
    activity.activity,
    activity.details ?? ''
  )

  if (!title || shouldRemovePostPlantActivity({ activity: title })) return null

  if (title === activity.activity.trim() && details === (activity.details?.trim() ?? '')) {
    return activity
  }

  return { ...activity, activity: title, details }
}

export function polishScheduleActivities<T extends ActivityLike>(activities: T[]): T[] {
  const out: T[] = []
  const seen = new Set<string>()

  for (const act of activities) {
    const polished = normalizeActivityCopy(act)
    if (!polished) continue
    const key = `${polished.daysSincePlanting ?? 0}|${polished.activity}|${polished.category}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(polished)
  }

  return out.sort(
    (a, b) => (a.daysSincePlanting ?? 0) - (b.daysSincePlanting ?? 0)
  )
}

export function activitiesNeedCopyPolish(
  activities: Array<Pick<ActivityLike, 'activity' | 'details'>>
): boolean {
  return activities.some((act) => {
    if (shouldRemovePostPlantActivity(act)) return true
    const normalized = normalizeActivityCopy({ ...act, category: 'other' })
    if (!normalized) return true
    return normalized.activity !== act.activity.trim()
  })
}
