'use client'



import Link from 'next/link'

import { useState, useEffect } from 'react'

import { useAuth } from '../context/AuthContext'

import { type GardenLocation } from '../utils/location'

import { gardenLocationFromUserLocation } from '@/lib/locationView'

import { buildClimatePlantingGuideForLocation } from '@/app/data/planting-calendar/helpers'

import { PlantInfo } from '../types/plants'

import PlantingGuideYearView from '@/app/components/planting-calendar/PlantingGuideYearView'

import PlanPageShell from '@/app/components/layouts/PlanPageShell'



export default function PlantingCalendarPage() {

  const { userLocation, locationLoading } = useAuth()

  const [locationState, setLocationState] = useState<GardenLocation | null>(null)

  const [plantingGuide, setPlantingGuide] = useState<Record<string, PlantInfo[]>>({})



  useEffect(() => {

    if (locationLoading) return

    if (userLocation) {

      setLocationState(gardenLocationFromUserLocation(userLocation))

    } else {

      setLocationState(null)

    }

  }, [userLocation, locationLoading])



  useEffect(() => {

    if (userLocation) {

      setPlantingGuide(buildClimatePlantingGuideForLocation(userLocation))

    } else {

      setPlantingGuide({})

    }

  }, [userLocation])



  if (locationLoading) {

    return (

      <PlanPageShell>

        <p className="text-gray-500 text-center py-12">Loading location...</p>

      </PlanPageShell>

    )

  }



  if (!locationState) {

    return (

      <PlanPageShell>

        <h1 className="text-2xl font-bold text-center mb-8">Select Your Location</h1>

        <Link

          href="/location-select"

          className="block w-full text-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"

        >

          Set Location

        </Link>

      </PlanPageShell>

    )

  }



  return (

    <PlanPageShell>

      <PlantingGuideYearView

        location={locationState}

        userLocation={userLocation}

        plantingGuide={plantingGuide}

      />

    </PlanPageShell>

  )

}


