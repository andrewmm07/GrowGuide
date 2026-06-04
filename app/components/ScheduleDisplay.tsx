'use client'

import React from 'react';
import { PlantSchedule, formatDateRange, daysUntilMilestone } from '@/lib/scheduleService';

interface ScheduleDisplayProps {
  schedule: PlantSchedule;
  plantingMethod?: 'seed' | 'seedling';
  /** Denser layout for My Garden expanded rows */
  compact?: boolean;
}

export function ScheduleDisplay({
  schedule,
  plantingMethod = 'seed',
  compact = false,
}: ScheduleDisplayProps) {
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null);

  const enrichActivityDetails = (activity: any): string => {
    // Return the details as-is since they should already be comprehensive
    // This ensures we show exactly what's in the data
    return activity.details;
  };

  const relevantActivities = schedule.activities;

  const activityPad = compact ? 'px-2 py-1.5' : 'p-3';
  const detailText = compact ? 'text-xs' : 'text-sm';

  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      {schedule.growingContextLabel && (
        <p className="text-[10px] text-gray-500 leading-snug">{schedule.growingContextLabel}</p>
      )}

      {relevantActivities.length > 0 && (
        <div>
          <div
            className={`font-semibold text-gray-600 uppercase ${
              compact ? 'text-[10px] mb-1' : 'text-xs mb-2 text-gray-700'
            }`}
          >
            Activities
          </div>
          <div className="space-y-0.5">
            {relevantActivities.map((activity, i) => {
              const displayDay = activity.daysSincePlanting;
              const isExpanded = expandedActivity === i;

              return (
                <div
                  key={i}
                  onClick={() => setExpandedActivity(isExpanded ? null : i)}
                  className={`${activityPad} rounded border border-gray-200 bg-white hover:bg-green-50/50 hover:border-green-300 transition-colors text-xs cursor-pointer`}
                >
                  <div className="flex gap-2 items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-semibold text-gray-600 shrink-0">
                          D{displayDay}
                        </span>
                        <span className="font-medium text-gray-900 leading-snug">
                          {activity.activity}
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="mt-1.5 pt-1.5 border-t border-gray-100">
                          <p
                            className={`${detailText} text-gray-700 leading-relaxed whitespace-pre-wrap`}
                          >
                            {activity.details}
                          </p>
                        </div>
                      )}
                    </div>
                    <span className="shrink-0 text-gray-400 text-sm leading-none pt-0.5">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleDisplay;
