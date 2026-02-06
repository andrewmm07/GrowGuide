'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'

interface WeatherInfo {
  temperature: string
  rainfall: string
  daylight: string
  frostRisk: string
  description: string
}

interface MonthData {
  season: string
  weather: WeatherInfo
  tasks: string[]
  weeklyGuide: {
    sow: string[]
    plant: string[]
    maintain: string[]
  }[]
}

const MONTH_DATA: { [key: string]: MonthData } = {
  'january': {
    season: 'Mid Summer',
    weather: {
      temperature: '28-32°C',
      rainfall: 'Low',
      daylight: '14 hours',
      frostRisk: 'None',
      description: 'Peak summer conditions with high temperatures and long days. Focus on water management and heat protection.'
    },
    tasks: [
      'Regular deep watering in early morning',
      'Monitor for pests and diseases',
      'Support heavy fruiting plants',
      'Save seeds from successful plants',
      'Harvest crops at peak ripeness',
      'Maintain mulch layers',
      'Begin planning autumn garden'
    ],
    weeklyGuide: [
      {
        sow: ['Beetroot', 'Carrots', 'Lettuce'],
        plant: ['Late Tomatoes', 'Basil', 'Beans'],
        maintain: ['Monitor water needs daily', 'Check for pests', 'Harvest mature crops']
      },
      // Add more weeks as needed
    ]
  }
  // Add more months...
}

export default function MonthGuide() {
  const params = useParams()
  const searchParams = useSearchParams()
  const month = (params.month as string).toLowerCase()
  const city = searchParams.get('city') || 'Sydney'
  
  const data = MONTH_DATA[month]

  if (!data) {
    return <div>Data not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{month}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-center">
            <svg className="w-8 h-8 text-orange-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
            <div className="text-sm text-gray-600">Temperature Range</div>
            <div className="font-semibold">
              {data.weather.temperature}
            </div>
          </div>
          <div className="text-center">
            <svg className="w-8 h-8 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <div className="text-sm text-gray-600">Rainfall</div>
            <div className="font-semibold">{data.weather.rainfall}</div>
          </div>
          <div className="text-center">
            <svg className="w-8 h-8 text-yellow-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
            <div className="text-sm text-gray-600">Daylight</div>
            <div className="font-semibold">{data.weather.daylight}</div>
          </div>
          <div className="text-center">
            <svg className="w-8 h-8 text-cyan-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
            <div className="text-sm text-gray-600">Frost Risk</div>
            <div className="font-semibold">{data.weather.frostRisk}</div>
          </div>
        </div>

        <p className="text-gray-600 italic">{data.weather.description}</p>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Essential Tasks for {month.charAt(0).toUpperCase() + month.slice(1)}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.tasks.map((task, index) => (
              <div key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{task}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {data.weeklyGuide.map((week, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Week {index + 1}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-800 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Sow from Seed
                  </h3>
                  <div className="space-y-2">
                    {week.sow.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Plant Seedlings
                  </h3>
                  <div className="space-y-2">
                    {week.plant.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-orange-800 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Key Tasks
                  </h3>
                  <div className="space-y-2">
                    {week.maintain.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 