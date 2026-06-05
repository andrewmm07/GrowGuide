import { LEGAL } from '@/lib/legal/constants'

export interface FeedbackContext {
  zone?: string | null
  city?: string | null
  state?: string | null
  plantName?: string | null
  appVersion?: string
}

export function buildFeedbackMailto(context: FeedbackContext = {}): string {
  const version = context.appVersion ?? '1.0'
  const locationParts = [context.city, context.state].filter(Boolean).join(', ')
  const zone = context.zone ?? 'not set'
  const plant = context.plantName?.trim() || 'not specified'

  const subject = encodeURIComponent(`GrowGuide feedback (v${version})`)
  const body = encodeURIComponent(
    [
      'Please describe what advice looks wrong:',
      '',
      '---',
      `App version: ${version}`,
      `Location: ${locationParts || 'not set'}`,
      `Hardiness zone: ${zone}`,
      `Plant: ${plant}`,
      '---',
    ].join('\n')
  )

  return `mailto:${LEGAL.supportEmail}?subject=${subject}&body=${body}`
}
