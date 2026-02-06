'use client'

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const AUSTRALIAN_STATES = [
  'Australian Capital Territory',
  'New South Wales',
  'Northern Territory',
  'Queensland',
  'South Australia',
  'Tasmania',
  'Victoria',
  'Western Australia',
]

const CITIES: { [key: string]: string[] } = {
  'Australian Capital Territory': ['Canberra', 'Belconnen', 'Tuggeranong', 'Gungahlin'],
  'New South Wales': [
    'Sydney',
    'Newcastle',
    'Wollongong',
    'Central Coast',
    'Albury',
    'Wagga Wagga',
    'Coffs Harbour',
    'Port Macquarie',
    'Tamworth',
    'Orange',
    'Dubbo'
  ],
  'Northern Territory': [
    'Darwin',
    'Palmerston',
    'Alice Springs',
    'Katherine',
    'Nhulunbuy'
  ],
  'Queensland': [
    'Brisbane',
    'Gold Coast',
    'Sunshine Coast',
    'Townsville',
    'Cairns',
    'Toowoomba',
    'Mackay',
    'Rockhampton',
    'Bundaberg',
    'Hervey Bay'
  ],
  'South Australia': [
    'Adelaide',
    'Mount Gambier',
    'Whyalla',
    'Port Augusta',
    'Port Pirie',
    'Murray Bridge',
    'Port Lincoln'
  ],
  'Tasmania': [
    'Hobart',
    'Launceston',
    'Devonport',
    'Burnie',
    'Kingston',
    'Ulverstone'
  ],
  'Victoria': [
    'Melbourne',
    'Geelong',
    'Ballarat',
    'Bendigo',
    'Shepparton',
    'Mildura',
    'Warrnambool',
    'Wodonga',
    'Traralgon'
  ],
  'Western Australia': [
    'Perth',
    'Bunbury',
    'Geraldton',
    'Albany',
    'Mandurah',
    'Kalgoorlie',
    'Broome',
    'Port Hedland',
    'Fremantle'
  ]
}

export function GardenLocationSelector() {
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const router = useRouter()

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedCity('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedState && selectedCity) {
      router.push(`/planting-calendar?state=${selectedState}&city=${selectedCity}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            Select your state
          </label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Choose a state</option>
            {AUSTRALIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {selectedState && (
          <div className="mb-6">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              Select your city
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Choose a city</option>
              {CITIES[selectedState]?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedState || !selectedCity}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          View Planting Calendar
        </button>
      </div>
    </form>
  )
} 