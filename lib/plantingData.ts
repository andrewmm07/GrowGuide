type StateCode = 'SA' | 'NSW' | 'VIC' | 'QLD' | 'WA' | 'TAS' | 'NT' | 'ACT'

interface PlantingGuide {
  overview: string
  season: string
  sow: string[]
  plant: string[]
}

interface MonthlyData {
  overview: string
  sow: string[]
  plant: string[]
}

const stateData: Record<StateCode, {
  seasons: Record<string, string>
  monthlyGuides: Record<string, MonthlyData>
}> = {
  SA: {
    seasons: {
      'December-February': 'Summer',
      'March-May': 'Autumn',
      'June-August': 'Winter',
      'September-November': 'Spring'
    },
    monthlyGuides: {
      January: {
        overview: 'South Australian summer conditions require deep watering and mulching. Watch for pests in the heat.',
        sow: ['Beans', 'Carrots', 'Beetroot', 'Sweet Corn'],
        plant: ['Tomatoes', 'Capsicum', 'Eggplant', 'Chillies']
      },
      // Add all months for SA...
    }
  },
  NSW: {
    seasons: {
      'December-February': 'Summer',
      'March-May': 'Autumn',
      'June-August': 'Winter',
      'September-November': 'Spring'
    },
    monthlyGuides: {
      January: {
        overview: 'Default NSW planting guide',
        sow: [],
        plant: []
      }
    }
  },
  VIC: {
    seasons: {
      'December-February': 'Summer',
      'March-May': 'Autumn',
      'June-August': 'Winter',
      'September-November': 'Spring'
    },
    monthlyGuides: {
      January: {
        overview: 'Default VIC planting guide',
        sow: [],
        plant: []
      }
    }
  },
  QLD: {
    seasons: {
      'December-February': 'Summer',
      'March-May': 'Autumn',
      'June-August': 'Winter',
      'September-November': 'Spring'
    },
    monthlyGuides: {
      January: {
        overview: 'Default QLD planting guide',
        sow: [],
        plant: []
      }
    }
  },
  WA: {
    seasons: {
      'December-February': 'Summer',
      'March-May': 'Autumn',
      'June-August': 'Winter',
      'September-November': 'Spring'
    },
    monthlyGuides: {
      January: {
        overview: 'Default WA planting guide',
        sow: [],
        plant: []
      }
    }
  },
  TAS: {
    seasons: {
      'December-February': 'Summer',
      'March-May': 'Autumn',
      'June-August': 'Winter',
      'September-November': 'Spring'
    },
    monthlyGuides: {
      January: {
        overview: 'Default TAS planting guide',
        sow: [],
        plant: []
      }
    }
  },
  NT: {
    seasons: {
      'December-February': 'Summer',
      'March-May': 'Autumn',
      'June-August': 'Winter',
      'September-November': 'Spring'
    },
    monthlyGuides: {
      January: {
        overview: 'Default NT planting guide',
        sow: [],
        plant: []
      }
    }
  },
  ACT: {
    seasons: {
      'December-February': 'Summer',
      'March-May': 'Autumn',
      'June-August': 'Winter',
      'September-November': 'Spring'
    },
    monthlyGuides: {
      January: {
        overview: 'Default ACT planting guide',
        sow: [],
        plant: []
      }
    }
  }
}

export function getPlantingData(state: string, month: string): MonthlyData | null {
  try {
    const stateCode = state as StateCode
    const monthData = stateData[stateCode]?.monthlyGuides[month]
    
    if (!monthData) {
      console.error(`No data available for ${state} in ${month}`)
      return null
    }
    
    return monthData
  } catch (error) {
    console.error('Error getting planting data:', error)
    return null
  }
}

export function getStateSeason(state: string, month: string): string {
  try {
    const stateCode = state as StateCode
    // Find the season range that includes this month
    const seasonRanges = Object.keys(stateData[stateCode].seasons)
    const currentSeason = seasonRanges.find(range => {
      const [start, end] = range.split('-')
      const months = getMonthsBetween(start, end)
      return months.includes(month)
    })
    
    return currentSeason ? stateData[stateCode].seasons[currentSeason] : 'Unknown'
  } catch (error) {
    console.error('Error getting season:', error)
    return 'Unknown'
  }
}

function getMonthsBetween(start: string, end: string): string[] {
  const months = [
    'December', 'January', 'February',
    'March', 'April', 'May',
    'June', 'July', 'August',
    'September', 'October', 'November'
  ]
  const startIdx = months.indexOf(start)
  const endIdx = months.indexOf(end)
  
  if (startIdx === -1 || endIdx === -1) return []
  
  if (startIdx <= endIdx) {
    return months.slice(startIdx, endIdx + 1)
  } else {
    // Handle December-February case
    return [...months.slice(startIdx), ...months.slice(0, endIdx + 1)]
  }
} 