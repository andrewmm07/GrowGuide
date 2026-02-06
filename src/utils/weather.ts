interface MonthlyWeather {
  temperature: {
    min: string
    max: string
  }
  rainfall: {
    amount: string
    days: number
  }
  daylight: string
  frostRisk: string
}

// Data sourced from Bureau of Meteorology climate averages
const WEATHER_DATA: { [key: string]: { [key: string]: MonthlyWeather } } = {
  'Sydney': {
    'january': {
      temperature: {
        min: '18.7°C',
        max: '26.0°C'
      },
      rainfall: {
        amount: '101.7mm',
        days: 12.2
      },
      daylight: '14.1 hours',
      frostRisk: 'None'
    },
    // Add other months...
  },
  'Melbourne': {
    'january': {
      temperature: {
        min: '14.3°C',
        max: '25.9°C'
      },
      rainfall: {
        amount: '46.8mm',
        days: 8.3
      },
      daylight: '14.5 hours',
      frostRisk: 'None'
    },
    // Add other months...
  },
  // Add other cities...
}

export function getWeatherData(city: string, month: string): MonthlyWeather | null {
  if (!WEATHER_DATA[city] || !WEATHER_DATA[city][month.toLowerCase()]) {
    return null
  }
  return WEATHER_DATA[city][month.toLowerCase()]
}

export function getWeatherDescription(weather: MonthlyWeather): string {
  const maxTemp = parseFloat(weather.temperature.max)
  const rainfall = parseFloat(weather.rainfall.amount)
  
  let conditions = []
  
  if (maxTemp > 30) {
    conditions.push('very hot')
  } else if (maxTemp > 25) {
    conditions.push('warm')
  } else if (maxTemp > 20) {
    conditions.push('mild')
  } else {
    conditions.push('cool')
  }

  if (rainfall > 100) {
    conditions.push('wet')
  } else if (rainfall > 50) {
    conditions.push('moderate rainfall')
  } else {
    conditions.push('relatively dry')
  }

  return `Typically ${conditions.join(' and ')} conditions. Average maximum temperature of ${weather.temperature.max} with ${weather.rainfall.amount} of rain over ${Math.round(weather.rainfall.days)} days.`
} 