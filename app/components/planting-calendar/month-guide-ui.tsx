/** Shared layout primitives for the month planting guide page. */

export function GuideCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-xl border border-gray-200 bg-white p-3.5 md:p-4 shadow-sm ${className}`}
    >
      {children}
    </section>
  )
}

const sectionLabelBase = 'text-xs font-semibold uppercase tracking-wide text-gray-500'

/** Nested blocks under Overview — one step darker on the grey scale. */
export const nestedSectionLabelClass = '!text-gray-700 mb-2'

export function SectionLabel({
  children,
  className = '',
  as = 'h2',
}: {
  children: React.ReactNode
  className?: string
  as?: 'h2' | 'span'
}) {
  if (as === 'span') {
    return <span className={`${sectionLabelBase} ${className}`}>{children}</span>
  }
  return <h2 className={`${sectionLabelBase} mb-2 ${className}`}>{children}</h2>
}

/** Smaller label inside accordions (e.g. Mistakes under Avoid). */
export function SubsectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-600 mb-2">
      {children}
    </p>
  )
}

export function DotList({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="space-y-2 list-none pl-0 m-0">
      {items.map((item) => (
        <li key={item} className="text-sm text-gray-600 leading-relaxed flex gap-2">
          <span className="text-gray-300 shrink-0 mt-0.5" aria-hidden>
            ·
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Title–detail bullets for Avoid: colon or first sentence, then detail. */
function formatAvoidBullet(item: string) {
  const text = item.replace(/\s-\s/g, ': ')
  const colonIdx = text.indexOf(': ')
  if (colonIdx !== -1) {
    return {
      lead: text.slice(0, colonIdx),
      rest: text.slice(colonIdx + 2),
      separator: ': ' as const,
    }
  }
  const sentenceEnd = text.search(/\.\s+/)
  if (sentenceEnd !== -1) {
    return {
      lead: text.slice(0, sentenceEnd + 1),
      rest: text.slice(sentenceEnd + 2),
      separator: ' ' as const,
    }
  }
  return { lead: text, rest: null as string | null, separator: null as null }
}

export function AvoidDotList({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <ul className="space-y-2.5 list-none pl-0 m-0">
      {items.map((item) => {
        const { lead, rest, separator } = formatAvoidBullet(item)
        return (
          <li key={item} className="text-sm leading-relaxed flex gap-2">
            <span className="text-gray-300 shrink-0 mt-0.5" aria-hidden>
              ·
            </span>
            <span>
              <span className="font-medium text-gray-800 underline decoration-gray-400 underline-offset-[3px]">
                {lead}
              </span>
              {rest != null && rest.length > 0 ? (
                <span className="text-gray-500">
                  {separator}
                  {rest}
                </span>
              ) : null}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
