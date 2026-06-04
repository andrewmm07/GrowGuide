/** Join guidance fragments into one readable paragraph. No em dashes. */

function finishSentence(raw: string): string {
  let s = raw.trim().replace(/\s*[—–]\s*/g, ', ')
  if (!s) return ''
  if (!/[.!?]$/.test(s)) s += '.'
  return s
}

function stripPeriod(s: string): string {
  return s.replace(/[.!?]+\s*$/, '').trim()
}

function lowercaseFirst(s: string): string {
  if (!s) return s
  return s.charAt(0).toLowerCase() + s.slice(1)
}

const FROST_MARKERS =
  /\b(frost|frost-hardy|frost-sensitive|tender crop|cold night|cover tender|protect.*(?:tender|frost|cold))\b/i
const COASTAL_MARKERS = /\b(coast|channel garden|inland)\b/i
const SLOW_GROWTH_MARKERS = /\b(slow|ease.*water|quiet|dormant|finish remaining plant)\b/i

function sharesTheme(a: string, b: string, pattern: RegExp): boolean {
  return pattern.test(a) && pattern.test(b)
}

/** True when frost line mostly repeats protection advice already in the lead. */
function frostIsRedundant(lead: string, frost: string): boolean {
  if (!frost) return true
  if (!sharesTheme(lead, frost, FROST_MARKERS)) return false
  if (sharesTheme(lead, frost, COASTAL_MARKERS)) return true
  const leadLower = lead.toLowerCase()
  const frostLower = frost.toLowerCase()
  if (leadLower.includes('cover tender') && frostLower.includes('cover tender')) return true
  if (leadLower.includes('inland') && frostLower.includes('inland')) return true
  return false
}

/** True when month focus repeats the week line without adding a distinct idea. */
function focusIsRedundant(week: string, focus: string): boolean {
  if (!focus || !week) return !focus
  if (sharesTheme(week, focus, FROST_MARKERS)) return true
  if (sharesTheme(week, focus, SLOW_GROWTH_MARKERS) && sharesTheme(week, focus, FROST_MARKERS)) {
    return true
  }
  const w = week.toLowerCase()
  const f = focus.toLowerCase()
  if (
    (w.includes('finish remaining plant') || w.includes('growth slow')) &&
    (f.includes('winter is approaching') || f.includes('cooler evening'))
  ) {
    return true
  }
  if (
    (w.includes('harvest') || w.includes('leafy greens') || w.includes('wind damage')) &&
    (f.includes('mid-summer') || f.includes('heat spike') || f.includes('short-lived in cold'))
  ) {
    return true
  }
  if (f.includes('pivot to autumn') && (w.includes('leafy greens') || w.includes('wind damage'))) {
    return true
  }
  if (w.includes('quieter season') && f.includes('outdoor growth slows')) {
    return true
  }
  if (w.includes('plan spring') && f.includes('plan spring')) {
    return true
  }
  if (w.includes('core spring planting') && f.includes('spring')) {
    return true
  }
  if (w.includes('transplant hardy') && f.includes('late spring is brief')) {
    return true
  }
  return false
}

function joinSentences(parts: string[]): string {
  return parts.filter(Boolean).join(' ')
}

/**
 * Weave week + focus when both add value: lead with the timelier week line,
 * attach focus as a follow-on clause when it is not redundant.
 */
function mergeWeekAndFocus(week: string, focus: string): string {
  const w = stripPeriod(week)
  const f = stripPeriod(focus)

  if (/^late (spring|summer)/i.test(f)) {
    return joinSentences([finishSentence(w), finishSentence(f)])
  }

  if (sharesTheme(w, f, COASTAL_MARKERS) && !w.toLowerCase().includes('coast')) {
    return `${w}. ${finishSentence(f)}`
  }

  if (/^(growth|cooler|winter|as )/i.test(f)) {
    let tail = f.replace(/^[^,]+,\s*/i, '').trim()
    if (/^so\s+/i.test(tail)) tail = tail.replace(/^so\s+/i, '')
    if (tail && !w.toLowerCase().includes(tail.slice(0, 12).toLowerCase())) {
      return finishSentence(`${w}, so ${lowercaseFirst(tail)}`)
    }
  }

  return joinSentences([finishSentence(w), finishSentence(f)])
}

export function composeWeeklyOverview(
  monthFocus: string,
  weekLine: string | null,
  frostLine: string | null,
  precomposed?: string | null
): string {
  if (precomposed?.trim()) {
    return finishSentence(precomposed.trim())
  }

  const focus = finishSentence(monthFocus)
  const week = weekLine ? finishSentence(weekLine) : ''
  const frost = frostLine ? finishSentence(frostLine) : ''

  if (!week && !frost) return focus
  if (!focus && !frost) return week
  if (!focus && !week) return frost

  const skipFocus = week && focusIsRedundant(week, focus)
  const effectiveFocus = skipFocus ? '' : focus

  let lead: string
  if (week && effectiveFocus) {
    lead = mergeWeekAndFocus(week, effectiveFocus)
  } else {
    lead = week || effectiveFocus
  }

  if (frost && !frostIsRedundant(lead, frost)) {
    const leadStripped = stripPeriod(lead)
    const frostStripped = stripPeriod(frost)
    if (sharesTheme(lead, frost, FROST_MARKERS)) {
      return lead
    }
    if (sharesTheme(lead, frost, COASTAL_MARKERS) && !COASTAL_MARKERS.test(lead)) {
      return joinSentences([lead, frost])
    }
    return finishSentence(`${leadStripped}; ${lowercaseFirst(frostStripped)}`)
  }

  return lead
}
