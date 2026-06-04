'use client'

import React, { useState, useMemo } from 'react'
import { useGarden } from '@/app/context/GardenContext'
import {
  buildWeeklyBrief,
  formatActivityDate,
  getUrgencyColor,
  getCategoryIcon,
  WeeklyActivity,
} from '@/lib/weeklyBriefService'

export function WeeklyBrief() {
  const { plants } = useGarden()
  const [weekOffset, setWeekOffset] = useState(0)

  // Calculate brief for the specified week
  const brief = useMemo(() => {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() + weekOffset * 7)
    return buildWeeklyBrief(plants, fromDate)
  }, [plants, weekOffset])

  const hasActivities = brief.critical.length > 0 || brief.recommended.length > 0 || brief.optional.length > 0

  if (!hasActivities && plants.length === 0) {
    return (
      <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          No plants added yet. Start by adding a plant to your garden to get your weekly action guide.
        </p>
        <button
          onClick={() => window.location.href = '/my-garden'}
          style={{
            background: 'transparent',
            border: '0.5px solid var(--color-border-secondary)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '13px',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
          }}
        >
          Add a plant
        </button>
      </div>
    )
  }

  if (!hasActivities) {
    return (
      <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          No activities scheduled for this week. Great job staying on top of things!
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem 0' }}>
      {/* Week Header */}
      <div style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>
            {brief.weekStart.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })} — {brief.weekEnd.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}
          </h3>
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            {brief.totalActions} action{brief.totalActions !== 1 ? 's' : ''} · {brief.plantCount} plant{brief.plantCount !== 1 ? 's' : ''}
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>What needs your attention this week</p>
      </div>

      {/* Critical Actions */}
      {brief.critical.length > 0 && (
        <ActivitySection
          title="Critical (do this week)"
          activities={brief.critical}
          urgency="critical"
        />
      )}

      {/* Recommended Actions */}
      {brief.recommended.length > 0 && (
        <ActivitySection
          title="Recommended (soon)"
          activities={brief.recommended}
          urgency="recommended"
        />
      )}

      {/* Optional Actions */}
      {brief.optional.length > 0 && (
        <ActivitySection
          title="Optional (no rush)"
          activities={brief.optional}
          urgency="optional"
        />
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderTop: '0.5px solid var(--color-border-tertiary)' }}>
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          disabled={weekOffset === -4}
          style={{
            background: 'transparent',
            border: '0.5px solid var(--color-border-secondary)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '13px',
            color: 'var(--color-text-primary)',
            cursor: weekOffset === -4 ? 'not-allowed' : 'pointer',
            opacity: weekOffset === -4 ? 0.5 : 1,
          }}
        >
          ← Prev week
        </button>
        <a
          href="/weekly-brief/"
          style={{
            background: 'transparent',
            border: '0.5px solid var(--color-border-secondary)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '13px',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          View full week <i className="ti ti-arrow-up-right" style={{ marginLeft: '4px', fontSize: '12px' }}></i>
        </a>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          disabled={weekOffset === 4}
          style={{
            background: 'transparent',
            border: '0.5px solid var(--color-border-secondary)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '13px',
            color: 'var(--color-text-primary)',
            cursor: weekOffset === 4 ? 'not-allowed' : 'pointer',
            opacity: weekOffset === 4 ? 0.5 : 1,
          }}
        >
          Next week →
        </button>
      </div>
    </div>
  )
}

interface ActivitySectionProps {
  title: string
  activities: WeeklyActivity[]
  urgency: 'critical' | 'recommended' | 'optional'
}

function ActivitySection({ title, activities, urgency }: ActivitySectionProps) {
  const colors = getUrgencyColor(urgency)

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            background: colors.bg,
            borderRadius: '50%',
          }}
        />
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {title}
        </span>
      </div>

      {/* Activities List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {activities.map((activity, idx) => (
          <ActivityCard key={activity.id} activity={activity} isLast={idx === activities.length - 1} />
        ))}
      </div>
    </div>
  )
}

interface ActivityCardProps {
  activity: WeeklyActivity
  isLast: boolean
}

function ActivityCard({ activity, isLast }: ActivityCardProps) {
  const colors = getUrgencyColor(activity.urgency)
  const icon = getCategoryIcon(activity.category)

  return (
    <div
      style={{
        background: 'var(--color-background-primary)',
        borderRadius: 'var(--border-radius-lg)',
        border: '0.5px solid var(--color-border-tertiary)',
        padding: '1rem 1.25rem',
        marginBottom: isLast ? 0 : '0.75rem',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* Icon */}
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: colors.bg,
              borderRadius: 'var(--border-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className={`ti ${icon}`} style={{ fontSize: '16px', color: colors.text }}></i>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {/* Title and Days */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '0.5rem',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>
              {activity.activity}
            </p>
            <span style={{ fontSize: '12px', color: colors.text, fontWeight: 500 }}>
              {activity.daysUntil === 0
                ? 'Today'
                : activity.daysUntil === 1
                  ? 'Tomorrow'
                  : `${activity.daysUntil} days left`}
            </span>
          </div>

          {/* Details */}
          <p
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.5',
            }}
          >
            {activity.details}
          </p>

          {/* Meta */}
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {activity.plantName} · {formatActivityDate(activity.dueDate)}
          </p>
        </div>
      </div>
    </div>
  )
}
