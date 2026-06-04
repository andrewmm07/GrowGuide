export type CalendarMonthSummaries = { [month: string]: string }

/** Generic temperate fallback when climate is unknown (legacy path only). */
const GENERIC_MONTH_SUMMARIES: CalendarMonthSummaries = {
  January:
    'The heat is intense, and dry conditions necessitate deep watering. Mulch heavily to conserve moisture.',
  February:
    'Plants are still growing well, but the heat persists. Water deeply and start planning autumn plantings.',
  March:
    'Days are cooling but soil stays warm. Good for garlic, onions, and leafy greens.',
  April:
    'Shorter days and cooler temperatures signal autumn. Plant brassicas, broad beans, and peas.',
  May:
    'First frosts may approach in cooler areas. Protect tender plants and mulch heavily.',
  June:
    'A quieter period. Focus on soil improvement, pruning, and winter planning.',
  July:
    'Minimal active growth. Plan spring plantings and maintain compost.',
  August:
    'Temperatures slowly rise. Start seeds indoors and finish dormant pruning.',
  September:
    'Growth picks up as soil warms. Harden off seedlings and watch for late frosts.',
  October:
    'Main planting month for summer crops. Stake climbers and mulch well.',
  November:
    'Warmer, drier conditions mean watering is critical. Stay on top of weeds and pests.',
  December:
    'Peak growing and harvesting season. Water deeply and harvest regularly.',
}

const TAS_MONTH_SUMMARIES: CalendarMonthSummaries = {
  January:
    'Mild summer conditions suit leafy greens, root vegetables, and peas. Water early morning.',
  February:
    'Late summer harvesting continues. Plant autumn brassicas and prepare winter beds.',
  March:
    'Autumn planting begins. Soil is still warm for kale, broccoli, and carrots.',
  April:
    'Main autumn planting month. Last chance for warm season vegetables.',
  May:
    'Early winter preparations. Focus on frost-hardy vegetables and soil improvement.',
  June:
    'Winter dormancy begins. Maintain winter crops and plan spring plantings.',
  July:
    'Peak winter. Limited outdoor growing; good time for planning and indoor seeds.',
  August:
    'Late winter preparation. Start seedlings indoors and prepare beds.',
  September:
    'Early spring plantings begin. Watch for late frosts on young seedlings.',
  October:
    'Main spring planting month. Plant potatoes, onions, and leafy greens.',
  November:
    'Late spring plantings continue. Plant summer crops and monitor for pests.',
  December:
    'Early summer. Peak growing for cool climate vegetables; harvest regularly.',
}

/**
 * Legacy state-keyed month prose. Prefer climate matrices in month-guidance-*.ts.
 * Only TAS retains state-specific copy; other states use climate guidance.
 */
export const CALENDAR_STATE_MONTH_SUMMARIES: {
  [key: string]: CalendarMonthSummaries
} = {
  Tasmania: TAS_MONTH_SUMMARIES,
  TAS: TAS_MONTH_SUMMARIES,
  DEFAULT: GENERIC_MONTH_SUMMARIES,
}
