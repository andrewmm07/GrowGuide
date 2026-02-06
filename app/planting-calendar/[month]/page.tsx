'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ViewToggle from '../../components/ViewToggle'
import CollapsiblePanel from '../../components/CollapsiblePanel'
import { MONTH_DETAILS, type MonthDetail as MonthDetailType, type WeeklyPlantingGuide } from '../../data/months'
import { getMonthActivities, getClimateZone, isValidStateCity, normalizeState } from '../../utils/climate'
import { STATE_MONTH_SUMMARIES } from '../../data/state-month-summaries'
import { getNormalizedLocation } from '../../utils/location'
import type { GardenLocation } from '../../types/location'
import { getLocationNoNos } from '../../data/no-nos'

interface MonthlyWeather {
  avgTemp: string
  rainfall: string
  daylight: string
  frost: string
  notes: string
  season: string
  frostRisk: string
  humidity: string
}

interface WeeklyGuide {
  week: number
  sow: string[]
  plant: string[]
  tasks: string[]
}

interface MonthDetails {
  name: string
  season: string
  weather: MonthlyWeather
  weeklyGuide: WeeklyGuide[]
  keyTasks: string[]
  noNos: {
    mistakes: string[]
    warnings: string[]
    commonErrors: string[]
  }
}

interface OpenPanels {
  weather: boolean;
  monthly: boolean;
  weekly: boolean;
  noNos: boolean;
}

// Add the GardenPlant interface
interface GardenPlant {
  name: string;
  datePlanted: string;
  type: 'seed' | 'seedling';
  activityType: 'sow' | 'plant';
  location?: string;
  notes?: string;
}

// Add the garden management functions
function addToMyGarden(plantName: string, activityType: 'sow' | 'plant') {
  const existingGarden = localStorage.getItem('myGarden')
  const myGarden: GardenPlant[] = existingGarden ? JSON.parse(existingGarden) : []
  
  if (!myGarden.some(plant => plant.name === plantName && plant.activityType === activityType)) {
    const newPlant: GardenPlant = {
      name: plantName,
      datePlanted: new Date().toISOString(),
      type: activityType === 'sow' ? 'seed' : 'seedling',
      activityType: activityType
    }
    myGarden.push(newPlant)
    localStorage.setItem('myGarden', JSON.stringify(myGarden))
    return true
  }
  return false
}

function removeFromMyGarden(plantName: string, activityType: 'sow' | 'plant') {
  const existingGarden = localStorage.getItem('myGarden')
  if (existingGarden) {
    const myGarden: GardenPlant[] = JSON.parse(existingGarden)
    const updatedGarden = myGarden.filter(
      plant => !(plant.name === plantName && plant.activityType === activityType)
    )
    localStorage.setItem('myGarden', JSON.stringify(updatedGarden))
    return true
  }
  return false
}

// Function to generate location-specific monthly summaries
function getMonthlySummary(month: string, city: string, state: string, climateZone: string): string {
  const monthLower = month.toLowerCase()
  const cityName = city || 'your area'
  
  // Base summaries by month and climate zone
  const summaries: Record<string, Record<string, string>> = {
    january: {
      'cool temperate': `${month} is a peak summer month in ${cityName}. The warm weather and extended daylight hours create ideal growing conditions, but you'll need to stay on top of watering as plants can dry out quickly during hot spells. Keep an eye out for heat stress and make sure to water early morning or evening.`,
      'temperate': `${month} brings warm summer conditions to ${cityName}. Plants are thriving with the longer days, but regular watering is essential, especially during heatwaves. Monitor for pests that love the warm weather and protect tender plants from intense afternoon sun.`,
      'subtropical': `${month} in ${cityName} means hot, humid conditions. While many tropical plants love this weather, be careful with heat-sensitive crops. Water deeply and regularly, and watch for fungal issues that thrive in humidity.`,
      'mediterranean': `${month} offers warm, dry conditions in ${cityName}. Perfect for Mediterranean herbs and heat-loving vegetables. Water deeply but less frequently, and mulch well to retain soil moisture. Watch for water stress during extended dry periods.`,
      'tropical': `${month} in ${cityName} is typically the wet season. Heavy rains can be both a blessing and a challenge - great for growth but watch for waterlogging and fungal diseases. Focus on above-ground crops and ensure good drainage.`,
    },
    february: {
      'cool temperate': `${month} continues the summer warmth in ${cityName}, though you might notice the days getting slightly shorter. Keep up with watering and start thinking about autumn plantings. Late summer pests can still be active, so stay vigilant.`,
      'temperate': `${month} in ${cityName} maintains warm conditions perfect for summer crops. Continue regular watering and harvesting. It's a great time to start planning your autumn garden while your summer vegetables are still producing.`,
      'subtropical': `${month} remains hot and humid in ${cityName}. Keep plants well-watered and watch for signs of heat stress. This is a good time to plant heat-tolerant varieties and continue harvesting summer crops.`,
      'mediterranean': `${month} brings continued warmth to ${cityName}. Your summer garden should be in full swing. Maintain watering schedules and start preparing beds for autumn plantings.`,
      'tropical': `${month} in ${cityName} continues the wet season pattern. Focus on maintaining good drainage and protecting plants from heavy downpours. Many tropical crops thrive in these conditions.`,
    },
    march: {
      'cool temperate': `${month} marks the transition to autumn in ${cityName}. Days are getting shorter and temperatures are starting to cool. It's an excellent time for planting cool-season crops. Watch for early frosts, especially in the mornings.`,
      'temperate': `${month} in ${cityName} sees the weather beginning to cool. Perfect conditions for planting autumn vegetables. The soil is still warm from summer, which helps with germination. Start transitioning from summer to autumn crops.`,
      'subtropical': `${month} in ${cityName} offers pleasant temperatures as the heat starts to ease. Great time for planting a wide variety of crops. The weather is more comfortable for both you and your plants.`,
      'mediterranean': `${month} brings milder conditions to ${cityName}. The intense summer heat is easing, making it perfect for planting autumn crops. Soil is still warm, which aids germination.`,
      'tropical': `${month} in ${cityName} may see the wet season beginning to ease. Conditions are still warm and humid, perfect for tropical crops. Good time to plant before the dry season begins.`,
    },
    april: {
      'cool temperate': `${month} is a fantastic planting month in ${cityName}. The soil has cooled but is still workable, and autumn rains help establish new plantings. Be watchful of early frosts, especially for tender plants.`,
      'temperate': `${month} in ${cityName} offers ideal autumn conditions. Cool but not cold, with good soil moisture. Perfect for establishing cool-season crops. The weather is comfortable for extended garden work.`,
      'subtropical': `${month} brings pleasant conditions to ${cityName}. The heat has definitely eased, making it comfortable for both planting and garden maintenance. Great time for a wide range of vegetables.`,
      'mediterranean': `${month} in ${cityName} sees temperatures becoming more moderate. Excellent conditions for planting autumn and winter crops. The soil is still warm enough for good germination.`,
      'tropical': `${month} in ${cityName} may see the transition from wet to dry season. Conditions are still warm and suitable for tropical crops. Plan for reduced rainfall ahead.`,
    },
    may: {
      'cool temperate': `${month} in ${cityName} brings cooler conditions as winter approaches. Good time for planting hardy winter crops and preparing beds. Frost risk increases, so protect tender plants.`,
      'temperate': `${month} sees cooler weather arriving in ${cityName}. Perfect for winter crop planting. The soil is still workable, and autumn rains help establish new plantings.`,
      'subtropical': `${month} in ${cityName} offers mild conditions perfect for planting. The heat is gone, making it comfortable for garden work. Great time for a variety of crops.`,
      'mediterranean': `${month} brings cooler conditions to ${cityName}. Good time for planting winter crops. The weather is pleasant for extended garden work.`,
      'tropical': `${month} in ${cityName} may see the dry season beginning. Water management becomes important. Still warm enough for tropical crops, but watch for reduced rainfall.`,
    },
    june: {
      'cool temperate': `${month} is winter in ${cityName}. Focus on hardy crops and protecting plants from frost. The days are short, so growth will be slower. Good time for planning next season's garden.`,
      'temperate': `${month} brings winter conditions to ${cityName}. Cool but manageable for winter crops. Protect tender plants from frost and focus on cold-hardy varieties.`,
      'subtropical': `${month} in ${cityName} offers mild winter conditions. Still suitable for many crops, though growth may slow. Great time for planting cool-season vegetables.`,
      'mediterranean': `${month} in ${cityName} sees cooler winter weather. Good for winter crops and garden maintenance. Protect from occasional frosts.`,
      'tropical': `${month} in ${cityName} is typically the dry season. Water management is crucial. Still warm enough for tropical crops, but irrigation becomes essential.`,
    },
    july: {
      'cool temperate': `${month} is mid-winter in ${cityName}. Focus on protecting plants from frost and cold. Growth is minimal, but it's a good time for garden planning and maintenance.`,
      'temperate': `${month} in ${cityName} continues winter conditions. Cold-hardy crops can still be grown. Protect from frost and focus on winter maintenance.`,
      'subtropical': `${month} in ${cityName} offers cool but manageable conditions. Good for winter crops. Growth may be slower but many vegetables still thrive.`,
      'mediterranean': `${month} brings cool conditions to ${cityName}. Winter crops continue to grow. Protect from occasional cold snaps.`,
      'tropical': `${month} in ${cityName} continues the dry season. Water management is key. Still suitable for tropical crops with adequate irrigation.`,
    },
    august: {
      'cool temperate': `${month} in ${cityName} sees winter beginning to ease. Days are getting longer, and you can start thinking about spring plantings. Still watch for late frosts.`,
      'temperate': `${month} in ${cityName} marks the transition toward spring. Days are lengthening, and you can start planning spring plantings. Late frosts are still possible.`,
      'subtropical': `${month} in ${cityName} offers pleasant conditions as winter eases. Great time to start spring plantings. The weather is becoming more favorable.`,
      'mediterranean': `${month} in ${cityName} sees conditions beginning to warm. Good time to start spring plantings. The soil is starting to warm up.`,
      'tropical': `${month} in ${cityName} may see the dry season continuing. Water management remains important. Conditions are still warm and suitable for tropical crops.`,
    },
    september: {
      'cool temperate': `${month} is spring in ${cityName}! The days are getting longer and temperatures are rising. Excellent planting conditions, but be watchful of late frosts that can damage tender new growth.`,
      'temperate': `${month} brings spring conditions to ${cityName}. Perfect for planting a wide variety of crops. The soil is warming, and days are lengthening. Watch for late frosts.`,
      'subtropical': `${month} in ${cityName} offers excellent spring conditions. Warm but not hot, perfect for planting. Great time to establish your garden for the season ahead.`,
      'mediterranean': `${month} in ${cityName} sees spring conditions arriving. Warm days and cool nights create ideal growing conditions. Perfect for planting.`,
      'tropical': `${month} in ${cityName} may see conditions beginning to warm. Good time for planting before the heat intensifies. Watch for the transition to wet season.`,
    },
    october: {
      'cool temperate': `${month} in ${cityName} offers great spring conditions. The soil has warmed up, and daylight hours are extended. Plants are starting to really thrive. Be watchful though: late frosts can still threaten tender plants early in the month.`,
      'temperate': `${month} brings excellent spring conditions to ${cityName}. Warm days and good soil temperatures create ideal growing conditions. Perfect for planting most crops.`,
      'subtropical': `${month} in ${cityName} offers warm spring conditions. Great for planting heat-loving crops. The weather is becoming more favorable for tropical varieties.`,
      'mediterranean': `${month} in ${cityName} sees pleasant spring weather. Ideal conditions for planting. The soil is warm, and days are lengthening.`,
      'tropical': `${month} in ${cityName} may see the wet season beginning. Warm and humid conditions are perfect for tropical crops. Watch for increased rainfall.`,
    },
    november: {
      'cool temperate': `${month} in ${cityName} continues excellent spring conditions. Plants are growing well with the warmer weather and longer days. Late frosts are less likely but still possible early in the month.`,
      'temperate': `${month} brings warm spring conditions to ${cityName}. Perfect for planting summer crops. The weather is becoming more summer-like, ideal for heat-loving vegetables.`,
      'subtropical': `${month} in ${cityName} offers warm conditions perfect for planting. Great time for tropical and subtropical crops. The heat is building but still manageable.`,
      'mediterranean': `${month} in ${cityName} sees conditions warming toward summer. Excellent for planting heat-loving crops. Days are getting longer and warmer.`,
      'tropical': `${month} in ${cityName} typically sees the wet season in full swing. Warm, humid conditions are perfect for tropical crops. Watch for heavy rainfall and ensure good drainage.`,
    },
    december: {
      'cool temperate': `${month} is a great planting month in ${cityName}. Plants are starting to really thrive now that the soil has warmed up and the daylight hours are extended. Be watchful though: late frosts can threaten tender plants early in the month, plants can dry out over 2-3 hot days without watering, and wind can still be damaging.`,
      'temperate': `${month} in ${cityName} brings warm summer conditions. Plants are thriving with the long days and warm weather. Stay on top of watering, especially during heatwaves. Perfect for summer crops.`,
      'subtropical': `${month} in ${cityName} offers hot, humid conditions. Great for tropical crops, but watch for heat stress. Water regularly and provide shade for sensitive plants during the hottest part of the day.`,
      'mediterranean': `${month} in ${cityName} brings warm summer conditions. Perfect for heat-loving crops. Water deeply and mulch well to retain moisture during hot spells.`,
      'tropical': `${month} in ${cityName} is typically the wet season. Heavy rains support growth but watch for waterlogging. Focus on crops that thrive in humid, wet conditions.`,
    },
  }
  
  // Normalize climate zone names (handle variations)
  const normalizedZone = climateZone.toLowerCase()
  let zoneKey = normalizedZone
  if (normalizedZone === 'warm temperate') {
    zoneKey = 'temperate'
  } else if (normalizedZone === 'cool temperate') {
    zoneKey = 'cool temperate'
  }
  
  // Get the summary for this month and climate zone
  const monthSummaries = summaries[monthLower]
  if (monthSummaries && monthSummaries[zoneKey]) {
    return monthSummaries[zoneKey]
  }
  
  // Fallback to a generic summary
  return `${month} in ${cityName} offers good gardening conditions. Check the specific guidance below for your area's climate zone.`
}

// Keep this function outside as it's a pure utility function
function getWeekDateRange(month: string, weekNum: number): string {
  const date = new Date(`2024 ${month} 1`);
  const startDate = new Date(date.setDate(date.getDate() + (weekNum - 1) * 7));
  const endDate = new Date(date.setDate(date.getDate() + 6));
  return `${startDate.getDate()} - ${endDate.getDate()} ${month}`;
}

// Keep this function outside as it's a pure utility function
function getWeekProgress(weekNum: number): string {
  const currentDate = new Date();
  const currentWeek = Math.ceil(currentDate.getDate() / 7);
  
  if (weekNum === currentWeek) return 'Current Week';
  if (weekNum < currentWeek) return 'Completed';
  return 'Upcoming';
}

// Keep this function outside as it's a pure utility function
function getWeeksInMonth(month: string, year: number = 2024): number {
  const date = new Date(`${year} ${month} 1`);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return Math.ceil(lastDay.getDate() / 7);
}

// Add this helper function to distribute plants across weeks
function distributeAcrossWeeks(plants: string[], totalWeeks: number): string[][] {
  const distribution: string[][] = Array(totalWeeks).fill([]).map(() => []);
  
  // Sort plants by name to ensure consistent distribution
  const sortedPlants = [...plants].sort();
  
  sortedPlants.forEach((plant, index) => {
    // Distribute evenly but with some intentional grouping
    // Plants with similar names likely should be planted together
    const week = Math.min(Math.floor(index / 2), totalWeeks - 1);
    distribution[week].push(plant);
  });
  
  return distribution;
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
] as const

const MONTH_NAMES: Record<string, string> = {
  january: 'January',
  february: 'February',
  march: 'March',
  april: 'April',
  may: 'May',
  june: 'June',
  july: 'July',
  august: 'August',
  september: 'September',
  october: 'October',
  november: 'November',
  december: 'December'
}

// Lightweight planting guide to enrich monthly lists by climate zone
const FALLBACK_PLANTING_GUIDE: Record<string, Record<string, { name: string; type: 'sow' | 'plant' }[]>> = {
  cool: {
    January: [
      { name: 'Lettuce', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Herbs (parsley)', type: 'sow' },
    ],
    February: [
      { name: 'Broccoli', type: 'sow' },
      { name: 'Cabbage', type: 'sow' },
      { name: 'Silverbeet', type: 'sow' },
      { name: 'Spring onions', type: 'sow' },
      { name: 'Kale', type: 'sow' },
    ],
    March: [
      { name: 'Garlic', type: 'plant' },
      { name: 'Onions', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Broad beans', type: 'sow' },
      { name: 'Cauliflower', type: 'sow' },
    ],
    April: [
      { name: 'Garlic', type: 'plant' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Leeks', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
    ],
    May: [
      { name: 'Peas', type: 'sow' },
      { name: 'Broad beans', type: 'sow' },
      { name: 'Onions', type: 'sow' },
      { name: 'Coriander', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
    ],
    June: [
      { name: 'Garlic', type: 'plant' },
      { name: 'Onions', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Kale', type: 'sow' },
      { name: 'Parsley', type: 'sow' },
    ],
    July: [
      { name: 'Peas', type: 'sow' },
      { name: 'Broad beans', type: 'sow' },
      { name: 'Radish', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Cabbage seedlings', type: 'plant' },
    ],
    August: [
      { name: 'Tomato seedlings (indoors)', type: 'plant' },
      { name: 'Chillies (indoors)', type: 'sow' },
      { name: 'Early potatoes', type: 'plant' },
      { name: 'Silverbeet', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
    ],
    September: [
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Zucchini', type: 'plant' },
      { name: 'Cucumbers', type: 'plant' },
      { name: 'Sweet corn', type: 'plant' },
      { name: 'Beans', type: 'sow' },
    ],
    October: [
      { name: 'Pumpkin', type: 'plant' },
      { name: 'Melons', type: 'plant' },
      { name: 'Basil', type: 'sow' },
      { name: 'Parsley', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
    ],
    November: [
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Cucumbers', type: 'plant' },
      { name: 'Beans', type: 'sow' },
    ],
    December: [
      { name: 'Lettuce (succession)', type: 'sow' },
      { name: 'Basil', type: 'sow' },
      { name: 'Zucchini', type: 'plant' },
      { name: 'Cucumbers', type: 'plant' },
      { name: 'Beans', type: 'sow' },
    ],
  },
  warm: {
    January: [
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Basil', type: 'sow' },
      { name: 'Cucumbers', type: 'plant' },
      { name: 'Zucchini', type: 'plant' },
      { name: 'Sweet corn', type: 'plant' },
    ],
    February: [
      { name: 'Beans', type: 'sow' },
      { name: 'Basil', type: 'sow' },
      { name: 'Cucumbers', type: 'plant' },
      { name: 'Zucchini', type: 'plant' },
      { name: 'Carrots', type: 'sow' },
    ],
    March: [
      { name: 'Broccoli seedlings', type: 'plant' },
      { name: 'Cauliflower seedlings', type: 'plant' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
    ],
    April: [
      { name: 'Garlic', type: 'plant' },
      { name: 'Onions', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Kale', type: 'sow' },
      { name: 'Silverbeet', type: 'sow' },
    ],
    May: [
      { name: 'Peas', type: 'sow' },
      { name: 'Broad beans', type: 'sow' },
      { name: 'Onions', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Coriander', type: 'sow' },
    ],
    June: [
      { name: 'Garlic', type: 'plant' },
      { name: 'Onions', type: 'sow' },
      { name: 'Kale', type: 'sow' },
      { name: 'Parsley', type: 'sow' },
      { name: 'Radish', type: 'sow' },
    ],
    July: [
      { name: 'Peas', type: 'sow' },
      { name: 'Broad beans', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
    ],
    August: [
      { name: 'Tomatoes (indoors)', type: 'sow' },
      { name: 'Capsicum (indoors)', type: 'sow' },
      { name: 'Eggplant (indoors)', type: 'sow' },
      { name: 'Broccoli seedlings', type: 'plant' },
      { name: 'Cabbage seedlings', type: 'plant' },
    ],
    September: [
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Corn', type: 'plant' },
      { name: 'Beans', type: 'sow' },
    ],
    October: [
      { name: 'Pumpkin', type: 'plant' },
      { name: 'Melons', type: 'plant' },
      { name: 'Cucumbers', type: 'plant' },
      { name: 'Zucchini', type: 'plant' },
      { name: 'Basil', type: 'sow' },
    ],
    November: [
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Sweet corn', type: 'plant' },
      { name: 'Beans', type: 'sow' },
    ],
    December: [
      { name: 'Basil', type: 'sow' },
      { name: 'Coriander', type: 'sow' },
      { name: 'Cucumbers', type: 'plant' },
      { name: 'Zucchini', type: 'plant' },
      { name: 'Lettuce (succession)', type: 'sow' },
    ],
  },
  tropical: {
    January: [
      { name: 'Okra', type: 'sow' },
      { name: 'Snake beans', type: 'sow' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Chillies', type: 'plant' },
      { name: 'Ceylon spinach', type: 'sow' },
    ],
    February: [
      { name: 'Okra', type: 'sow' },
      { name: 'Snake beans', type: 'sow' },
      { name: 'Taro', type: 'plant' },
      { name: 'Sweet potato', type: 'plant' },
      { name: 'Amaranth', type: 'sow' },
    ],
    March: [
      { name: 'Eggplant', type: 'plant' },
      { name: 'Chillies', type: 'plant' },
      { name: 'Asian greens', type: 'sow' },
      { name: 'Coriander (shade)', type: 'sow' },
      { name: 'Bok choy', type: 'sow' },
    ],
    April: [
      { name: 'Tomatoes (dry-season)', type: 'sow' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Cucumber (dry-season)', type: 'plant' },
      { name: 'Beans', type: 'sow' },
      { name: 'Lettuce (heat-tolerant)', type: 'sow' },
    ],
    May: [
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Beans', type: 'sow' },
      { name: 'Cucumbers', type: 'plant' },
    ],
    June: [
      { name: 'Lettuce', type: 'sow' },
      { name: 'Asian greens', type: 'sow' },
      { name: 'Coriander', type: 'sow' },
      { name: 'Radish', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
    ],
    July: [
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Beans', type: 'sow' },
      { name: 'Cucumber', type: 'plant' },
    ],
    August: [
      { name: 'Sweet corn', type: 'plant' },
      { name: 'Pumpkin', type: 'plant' },
      { name: 'Watermelon', type: 'plant' },
      { name: 'Rockmelon', type: 'plant' },
      { name: 'Okra', type: 'sow' },
    ],
    September: [
      { name: 'Sweet corn', type: 'plant' },
      { name: 'Pumpkin', type: 'plant' },
      { name: 'Watermelon', type: 'plant' },
      { name: 'Rockmelon', type: 'plant' },
      { name: 'Beans', type: 'sow' },
    ],
    October: [
      { name: 'Eggplant', type: 'plant' },
      { name: 'Chillies', type: 'plant' },
      { name: 'Snake beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Sweet potato', type: 'plant' },
    ],
    November: [
      { name: 'Asian greens', type: 'sow' },
      { name: 'Ceylon spinach', type: 'sow' },
      { name: 'Amaranth', type: 'sow' },
      { name: 'Taro', type: 'plant' },
      { name: 'Sweet potato', type: 'plant' },
    ],
    December: [
      { name: 'Okra', type: 'sow' },
      { name: 'Snake beans', type: 'sow' },
      { name: 'Ceylon spinach', type: 'sow' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Chillies', type: 'plant' },
    ],
  },
};

const MonthDetailPage = () => {
  const params = useParams()
  if (!params || !params.month) {
    return null
  }
  const month = params.month as string
  const [openPanels, setOpenPanels] = useState<OpenPanels>({
    weather: true,
    monthly: true,
    weekly: false,
    noNos: false
  })
  const [gardenPlants, setGardenPlants] = useState<Array<{name: string, activityType: 'sow' | 'plant'}>>([])
  const [userLocation, setUserLocation] = useState<GardenLocation | null>(null)
  const [monthActivities, setMonthActivities] = useState<string[]>([])
  const [locationLoading, setLocationLoading] = useState(true)
  const [showMonthDropdown, setShowMonthDropdown] = useState(false)
  const router = useRouter()
  const [guideSow, setGuideSow] = useState<string[]>([])
  const [guidePlant, setGuidePlant] = useState<string[]>([])

  // Get month data
  const rawMonthData = MONTH_DETAILS[month.toLowerCase()]
  
  // Expand weekly guide to 4 weeks if it only has 1 week
  const expandWeeklyGuide = (weeklyGuide: WeeklyGuide[]): WeeklyGuide[] => {
    if (weeklyGuide.length >= 4) {
      return weeklyGuide.slice(0, 4) // Return first 4 weeks if already has 4+
    }
    
    const expanded: WeeklyGuide[] = []
    const baseWeek = weeklyGuide[0] || { week: 1, sow: [], plant: [], tasks: [] }
    
    // Distribute plants and tasks across 4 weeks
    const totalSow = baseWeek.sow.length
    const totalPlant = baseWeek.plant.length
    const totalTasks = baseWeek.tasks.length
    
    for (let weekNum = 1; weekNum <= 4; weekNum++) {
      const sowStart = Math.floor((weekNum - 1) * totalSow / 4)
      const sowEnd = Math.floor(weekNum * totalSow / 4)
      const plantStart = Math.floor((weekNum - 1) * totalPlant / 4)
      const plantEnd = Math.floor(weekNum * totalPlant / 4)
      const taskStart = Math.floor((weekNum - 1) * totalTasks / 4)
      const taskEnd = Math.floor(weekNum * totalTasks / 4)
      
      expanded.push({
        week: weekNum,
        sow: baseWeek.sow.slice(sowStart, sowEnd),
        plant: baseWeek.plant.slice(plantStart, plantEnd),
        tasks: baseWeek.tasks.slice(taskStart, taskEnd)
      })
    }
    
    return expanded
  }
  
  const monthData = rawMonthData ? {
    ...rawMonthData,
    weeklyGuide: expandWeeklyGuide(rawMonthData.weeklyGuide)
  } : null

  // Get location-specific No-Nos data
  const locationNoNos = useMemo(() => {
    if (!userLocation) return null
    return getLocationNoNos(userLocation.state, userLocation.city, month.toLowerCase())
  }, [userLocation, month])

  // Use location-specific No-Nos if available, otherwise fall back to default
  const effectiveNoNos = useMemo(() => {
    if (locationNoNos) {
      return locationNoNos
    }
    return monthData?.noNos || {
      mistakes: [],
      warnings: [],
      commonErrors: []
    }
  }, [locationNoNos, monthData?.noNos])

  const defaultSowByZone: Record<string, string[]> = {
    cool: ['Lettuce', 'Spinach', 'Carrots', 'Beetroot', 'Radish', 'Peas', 'Broad beans', 'Coriander', 'Parsley', 'Spring onions'],
    warm: ['Lettuce', 'Basil', 'Carrots', 'Beetroot', 'Radish', 'Beans', 'Spinach', 'Coriander', 'Parsley', 'Spring onions'],
    tropical: ['Okra', 'Snake beans', 'Asian greens', 'Amaranth', 'Coriander (shade)', 'Ceylon spinach', 'Lettuce (heat-tolerant)', 'Bok choy', 'Radish', 'Beans'],
  }

  const defaultPlantByZone: Record<string, string[]> = {
    cool: ['Garlic', 'Onion seedlings', 'Leeks', 'Cabbage seedlings', 'Broccoli seedlings', 'Cauliflower seedlings', 'Tomato seedlings (indoors)', 'Kale seedlings', 'Silverbeet seedlings', 'Early potatoes'],
    warm: ['Tomatoes', 'Capsicum', 'Eggplant', 'Cucumbers', 'Zucchini', 'Sweet corn', 'Pumpkin', 'Melons', 'Broccoli seedlings', 'Cabbage seedlings'],
    tropical: ['Eggplant', 'Chillies', 'Tomatoes (dry-season)', 'Capsicum', 'Sweet potato', 'Taro', 'Cucumber (dry-season)', 'Pumpkin', 'Watermelon', 'Rockmelon'],
  }

  const ensureMinimum = (items: string[], defaults: string[], min = 10) => {
    const merged = Array.from(new Set([...items, ...defaults]))
    if (merged.length >= min) return merged
    const extras = defaults.filter(d => !merged.includes(d)).slice(0, Math.max(0, min - merged.length))
    return [...merged, ...extras]
  }

  const mapZone = (zone?: string) => {
    const climateZoneMap: Record<string, string> = {
      'cool temperate': 'cool',
      'temperate': 'warm',
      'warm temperate': 'warm',
      'subtropical': 'tropical',
      'tropical': 'tropical',
      'mediterranean': 'warm',
      'arid': 'warm',
    }
    return climateZoneMap[zone || ''] || 'cool'
  }

  const combinedSow = useMemo(() => {
    const weekSow = monthData?.weeklyGuide?.flatMap(w => w.sow) || []
    const mappedZone = mapZone(userLocation?.climateZone)
    const defaults = defaultSowByZone[mappedZone] || defaultSowByZone.cool
    return ensureMinimum(Array.from(new Set([...weekSow, ...guideSow])), defaults, 10)
  }, [monthData?.weeklyGuide, guideSow, userLocation?.climateZone])

  const combinedPlant = useMemo(() => {
    const weekPlant = monthData?.weeklyGuide?.flatMap(w => w.plant) || []
    const mappedZone = mapZone(userLocation?.climateZone)
    const defaults = defaultPlantByZone[mappedZone] || defaultPlantByZone.cool
    return ensureMinimum(Array.from(new Set([...weekPlant, ...guidePlant])), defaults, 10)
  }, [monthData?.weeklyGuide, guidePlant, userLocation?.climateZone])

  const effectiveWeeklyGuide = useMemo(() => {
    const mappedZone = mapZone(userLocation?.climateZone)
    const monthName = MONTH_NAMES[month.toLowerCase()] || month
    const fallbackSow = FALLBACK_PLANTING_GUIDE[mappedZone]?.[monthName]?.filter(g => g.type === 'sow').map(g => g.name) || []
    const fallbackPlant = FALLBACK_PLANTING_GUIDE[mappedZone]?.[monthName]?.filter(g => g.type === 'plant').map(g => g.name) || []

    // Combine all available sources and ensure we have at least 8 items
    const getAllSowItems = () => {
      const all = Array.from(new Set([...combinedSow, ...fallbackSow, ...(defaultSowByZone[mappedZone] || [])]))
      // Always ensure we have at least 8 items
      if (all.length === 0) {
        // Ultimate fallback if nothing is available
        return ['Lettuce', 'Spinach', 'Carrots', 'Radish', 'Beetroot', 'Peas', 'Beans', 'Herbs']
      }
      // If still not enough, duplicate items to reach minimum
      while (all.length < 8) {
        const toAdd = Math.min(all.length, 8 - all.length)
        all.push(...all.slice(0, toAdd))
      }
      return all.slice(0, Math.max(8, all.length))
    }

    const getAllPlantItems = () => {
      const all = Array.from(new Set([...combinedPlant, ...fallbackPlant, ...(defaultPlantByZone[mappedZone] || [])]))
      // Always ensure we have at least 8 items, or return empty if truly nothing can be planted
      if (all.length === 0) {
        // Check if we should show "not recommended" or use fallbacks
        const hasAnyPlantOptions = defaultPlantByZone[mappedZone]?.length > 0 || fallbackPlant.length > 0
        if (hasAnyPlantOptions) {
          // Use fallbacks even if combinedPlant is empty
          const fallbacks = [...fallbackPlant, ...(defaultPlantByZone[mappedZone] || [])]
          return fallbacks.length > 0 ? fallbacks : []
        }
        return []
      }
      // If still not enough, duplicate items to reach minimum
      while (all.length < 8) {
        const toAdd = Math.min(all.length, 8 - all.length)
        all.push(...all.slice(0, toAdd))
      }
      return all.slice(0, Math.max(8, all.length))
    }

    const enrichedSow = getAllSowItems()
    const enrichedPlant = getAllPlantItems()
    const hasPlantOptions = enrichedPlant.length > 0

    const distributeEven = (items: string[], weeks = 4, minPerWeek = 2) => {
      // If items is empty, return empty arrays for all weeks
      if (items.length === 0) {
        return Array.from({ length: weeks }, () => [])
      }
      // Ensure we have enough items (at least weeks * minPerWeek)
      const minNeeded = weeks * minPerWeek
      const paddedItems = items.length >= minNeeded 
        ? items 
        : [...items, ...Array.from({ length: minNeeded - items.length }, (_, i) => items[i % items.length])]

      const output: string[][] = Array.from({ length: weeks }, () => [])

      // Round-robin distribution
      paddedItems.forEach((item, idx) => {
        const bucket = idx % weeks
        output[bucket].push(item)
      })

      // Final check: ensure every week has at least minPerWeek items
      for (let i = 0; i < weeks; i++) {
        while (output[i].length < minPerWeek) {
          // Find a week with extra items
          for (let j = 0; j < weeks; j++) {
            if (j !== i && output[j].length > minPerWeek) {
              const itemToMove = output[j].pop()
              if (itemToMove) {
                output[i].push(itemToMove)
                break
              }
            }
          }
          // If no redistribution possible, duplicate from this week's items or add from source
          if (output[i].length < minPerWeek) {
            const source = output[i].length > 0 ? output[i][0] : paddedItems[0]
            if (source) output[i].push(source)
          }
        }
      }

      return output
    }

    // Start with existing weekly guide if available, but we'll fill gaps
    const existingWeeks = monthData?.weeklyGuide || Array.from({ length: 4 }, (_, i) => ({ 
      week: i + 1, 
      sow: [], 
      plant: [], 
      tasks: [] 
    }))

    // Collect all existing items
    const existingSow = existingWeeks.flatMap(w => w.sow)
    const existingPlant = existingWeeks.flatMap(w => w.plant)

    // Merge with enriched data
    const allSow = Array.from(new Set([...existingSow, ...enrichedSow]))
    const allPlant = Array.from(new Set([...existingPlant, ...enrichedPlant]))

    // Distribute evenly - always use enriched data to ensure we have enough
    const sowChunks = distributeEven(enrichedSow, 4, 2)
    const plantChunks = hasPlantOptions ? distributeEven(enrichedPlant, 4, 2) : Array.from({ length: 4 }, () => [])
    
    const weeklyTasks = [
      ['Prep beds and add compost', 'Water deeply'],
      ['Mulch around new plantings', 'Check for pests'],
      ['Fertilize if needed', 'Inspect plant health'],
      ['Harvest ready crops', 'Plan next month'],
    ]

    return Array.from({ length: 4 }, (_v, i) => {
      const weekSow = sowChunks[i] || []
      const weekPlant = plantChunks[i] || []
      
      // Ensure sow always has at least 2 items (guaranteed by distributeEven, but double-check)
      const finalSow = weekSow.length >= 2 ? weekSow : [...weekSow, ...enrichedSow.slice(0, 2 - weekSow.length)]
      
      // For plant, use distributed items if available, otherwise show message
      const finalPlant = hasPlantOptions && weekPlant.length > 0
        ? (weekPlant.length >= 2 ? weekPlant : [...weekPlant, ...enrichedPlant.slice(0, 2 - weekPlant.length)])
        : ['Planting not recommended this week']
      
      return {
        week: i + 1,
        sow: finalSow,
        plant: finalPlant,
        tasks: existingWeeks[i]?.tasks?.length > 0 ? existingWeeks[i].tasks : (weeklyTasks[i] || ['General garden maintenance']),
      }
    })
  }, [monthData?.weeklyGuide, combinedSow, combinedPlant, userLocation?.climateZone, month])

  // Add GardenPlantLink component
  const GardenPlantLink = ({ name, type }: { name: string, type: 'seed' | 'seedling' }) => {
    const activityType = type === 'seed' ? 'sow' : 'plant'
    const isInGarden = gardenPlants.some(
      p => p.name === name && p.activityType === activityType
    )

    const handleQuickAdd = (e: React.MouseEvent) => {
      e.preventDefault()
      if (isInGarden) {
        removeFromMyGarden(name, activityType)
        setGardenPlants(gardenPlants.filter(
          p => !(p.name === name && p.activityType === activityType)
        ))
      } else {
        addToMyGarden(name, activityType)
        setGardenPlants([...gardenPlants, { name, activityType }])
      }
    }

    return (
      <div className="group flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm hover:shadow transition-all">
        <span className="text-gray-700">{name}</span>
        <button
          onClick={handleQuickAdd}
          className={`flex items-center justify-center transition-all ml-2 ${
            isInGarden 
              ? 'text-green-500 hover:text-green-600' 
              : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600'
          }`}
          title={isInGarden ? 'Remove from Garden' : 'Add to My Garden'}
        >
          {isInGarden ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  useEffect(() => {
    const existingGarden = localStorage.getItem('myGarden')
    if (existingGarden) {
      const garden: GardenPlant[] = JSON.parse(existingGarden)
      setGardenPlants(garden.map(p => ({ name: p.name, activityType: p.activityType })))
    }
  }, [])

  useEffect(() => {
    // Ensure we're on the client side before accessing localStorage
    if (typeof window === 'undefined') {
      return;
    }

    // Load location from localStorage using the same utility as the main calendar page
    setLocationLoading(true);
    
    try {
      const location = getNormalizedLocation();
      
      if (location) {
        setUserLocation(location);
        setLocationLoading(false);
        console.log('Loaded valid location:', {
          state: location.state,
          city: location.city,
          climateZone: location.climateZone
        });
      } else {
        console.warn('No valid location found in localStorage');
        setLocationLoading(false);
        // Only redirect after we've confirmed location is missing
        router.push('/location-select');
      }
    } catch (error) {
      console.error('Error loading location:', error);
      setLocationLoading(false);
      router.push('/location-select');
    }
  }, [router]);

  // Enrich seeds/seedlings with climate-based guide
  useEffect(() => {
    if (!userLocation) return;
    const climateZoneMap: Record<string, string> = {
      'cool temperate': 'cool',
      'temperate': 'warm',
      'warm temperate': 'warm',
      'subtropical': 'tropical',
      'tropical': 'tropical',
      'mediterranean': 'warm',
      'arid': 'warm',
    };

    const mappedZone = climateZoneMap[userLocation.climateZone] || 'cool';
    const monthName = MONTH_NAMES[month.toLowerCase()] || month;
    const guide = FALLBACK_PLANTING_GUIDE[mappedZone]?.[monthName] || [];

    setGuideSow(guide.filter((g) => g.type === 'sow').map((g) => g.name));
    setGuidePlant(guide.filter((g) => g.type === 'plant').map((g) => g.name));
  }, [userLocation, month]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showMonthDropdown && !target.closest('.month-dropdown-container')) {
        setShowMonthDropdown(false)
      }
    }
    
    if (showMonthDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMonthDropdown])

  useEffect(() => {
    // Don't redirect if we're still loading location
    if (locationLoading) {
      return;
    }

    if (!userLocation?.state) {
      router.push('/location-select');
      return;
    }

    const normalizedState = normalizeState(userLocation.state);
    const activities = getMonthActivities(userLocation.state, month);
    
    console.log('Month activities:', {
      state: userLocation.state,
      normalizedState,
      month,
      activities,
      usingSummariesFor: normalizedState
    });

    if (!STATE_MONTH_SUMMARIES[normalizedState]) {
      console.error(`No planting calendar available for ${userLocation.state}`);
      router.push('/location-select');
      return;
    }

    setMonthActivities(activities);
  }, [userLocation, month, router, locationLoading]);

  // Show loading state while checking location
  if (locationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="flex-1 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!monthData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="flex-1 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl text-red-600 mb-4">Month Not Found</h1>
              <Link href="/planting-calendar" className="text-green-600 hover:text-green-700 underline">
                Return to Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100">
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/planting-calendar"
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 group"
            >
              <svg 
                className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Calendar
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {monthData.name} Growing Guide
                </h1>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {monthData.weather.season}
                  </span>
                  <span className="text-gray-500">
                    {monthData.weather.avgTemp} • {monthData.weather.daylight} daylight
                  </span>
                </div>
              </div>
              
              {/* Other Months Dropdown */}
              <div className="relative month-dropdown-container">
                <button
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700 font-medium">Other Months</span>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${showMonthDropdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showMonthDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {MONTHS.map((monthKey) => (
                      <Link
                        key={monthKey}
                        href={`/planting-calendar/${monthKey}`}
                        onClick={() => setShowMonthDropdown(false)}
                        className={`block px-4 py-2 text-sm hover:bg-green-50 transition-colors ${
                          month.toLowerCase() === monthKey
                            ? 'bg-green-50 text-green-700 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {MONTH_NAMES[monthKey]}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Summary Block */}
          {userLocation && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
              <p className="text-gray-700 leading-relaxed text-base">
                {getMonthlySummary(
                  monthData.name,
                  userLocation.city || '',
                  userLocation.state,
                  userLocation.climateZone
                )}
              </p>
            </div>
          )}

          {/* Weather Overview Panel */}
          <CollapsiblePanel
            title="Weather Overview"
            isOpen={openPanels.weather}
            onToggle={() => setOpenPanels((prev: OpenPanels) => ({ ...prev, weather: !prev.weather }))}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            }
            description="Monthly weather patterns and growing conditions"
          >
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-amber-600 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="font-medium text-gray-600">Temperature</div>
              <div className="text-lg text-gray-800">{monthData.weather.avgTemp}</div>
            </div>
            
            <div className="text-center">
              <div className="text-blue-600 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="font-medium text-gray-600">Rainfall</div>
              <div className="text-lg text-gray-800">{monthData.weather.rainfall}</div>
            </div>

            <div className="text-center">
              <div className="text-yellow-600 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="font-medium text-gray-600">Daylight</div>
              <div className="text-lg text-gray-800">{monthData.weather.daylight}</div>
            </div>

            <div className="text-center">
              <div className="text-cyan-600 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="font-medium text-gray-600">Frost Risk</div>
              <div className="text-lg text-gray-800">{monthData.weather.frost}</div>
            </div>
          </div>
          <p className="text-gray-700 italic">{monthData.weather.notes}</p>
          </CollapsiblePanel>

          {/* Monthly Guide Panel */}
          <CollapsiblePanel
            title="Monthly Overview"
            isOpen={openPanels.monthly}
            onToggle={() => setOpenPanels((prev: OpenPanels) => ({ ...prev, monthly: !prev.monthly }))}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
            }
            description="Key planting tasks and garden activities for the month"
          >
            <div className="space-y-8">
              {/* Seeds and Seedlings in a unified design */}
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-green-500 to-blue-500" />
                
                {/* Seeds Section */}
                <div className="relative pl-16 pb-12">
                  <div className="absolute left-6 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-md" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Seeds to Sow</h3>
                <div className="flex flex-wrap gap-3">
                  {combinedSow.map((crop, i) => (
                      <GardenPlantLink 
                        key={i} 
                        name={crop} 
                        type="seed"
                      />
                    ))}
                  </div>
                </div>

                {/* Seedlings Section */}
                <div className="relative pl-16">
                  <div className="absolute left-6 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-md" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Seedlings to Plant</h3>
                <div className="flex flex-wrap gap-3">
                  {combinedPlant.map((crop, i) => (
                      <GardenPlantLink 
                        key={i} 
                        name={crop} 
                        type="seedling"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Tasks and Weather in a modern card layout */}
              <div className="grid md:grid-cols-2 gap-8 pt-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-amber-500" />
                  <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-6">
                    <svg className="w-6 h-6 text-amber-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Essential Tasks
                  </h3>
                  <div className="space-y-3">
                    {monthData.keyTasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <div className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-gray-700">{task}</span>
              </div>
            ))}
          </div>
        </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 via-white to-cyan-50 p-6">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-300 to-cyan-500" />
                  <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-6">
                    <svg className="w-6 h-6 text-cyan-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    Weather Conditions
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(monthData.weather).map(([key, value]) => (
                      key !== 'notes' && (
                        <div key={key} className="group flex items-center justify-between py-2 border-b border-cyan-100 last:border-0">
                          <span className="text-gray-600 capitalize group-hover:text-cyan-700 transition-colors">
                            {key.replace('_', ' ')}
                          </span>
                          <span className="text-gray-800 font-medium">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CollapsiblePanel>

          {/* Weekly Guide Panel */}
          <CollapsiblePanel
            title="Weekly Plan"
            isOpen={openPanels.weekly}
            onToggle={() => setOpenPanels((prev: OpenPanels) => ({ ...prev, weekly: !prev.weekly }))}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            description="Week-by-week growing guide and garden tasks"
          >
            <div className="space-y-12">
              {effectiveWeeklyGuide.map((week: WeeklyGuide, index: number) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 relative overflow-hidden"
                >
                  {/* Lighter bar at top */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-200" />
                  
                  <div className="flex items-center border-b border-gray-200 p-6 bg-gray-100">
                    {/* Cleaner week badge */}
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm border border-gray-200">
                      <span className="text-2xl font-bold text-gray-800">W{week.week}</span>
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-gray-800">
                        {getWeekDateRange(monthData.name, week.week)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {getWeekProgress(week.week)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                        getWeekProgress(week.week) === 'Current Week' 
                          ? 'bg-green-100 text-green-800 border-2 border-green-200'
                          : getWeekProgress(week.week) === 'Completed'
                          ? 'bg-gray-100 text-gray-600 border border-gray-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {getWeekProgress(week.week)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 grid gap-8 md:grid-cols-3">
                    {/* Seeds Section */}
                    <div>
                      <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 bg-green-600 rounded-full"></span>
                          <h4 className="font-semibold text-gray-800">Seeds to Sow</h4>
                        </div>
                      </div>
                      <ul className="space-y-2 pl-4">
                        {week.sow.map((crop, i) => (
                          <GardenPlantLink key={i} name={crop} type="seed" />
                        ))}
                      </ul>
                    </div>

                    {/* Seedlings Section */}
                <div>
                      <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                          <h4 className="font-semibold text-gray-800">Seedlings to Plant</h4>
                        </div>
                      </div>
                      <ul className="space-y-2 pl-4">
                    {week.plant.map((crop, i) => (
                          crop === 'Planting not recommended this week' ? (
                            <li key={i} className="text-gray-500 italic text-sm">
                              {crop}
                            </li>
                          ) : (
                            <GardenPlantLink key={i} name={crop} type="seedling" />
                          )
                    ))}
                  </ul>
                </div>

                    {/* Tasks Section */}
                <div>
                      <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 bg-amber-600 rounded-full"></span>
                          <h4 className="font-semibold text-gray-800">Garden Tasks</h4>
                        </div>
                      </div>
                      <ul className="space-y-2 pl-4">
                    {week.tasks.map((task, i) => (
                          <li key={i} className="text-gray-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"></span>
                          <span className="text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
            </div>
          </CollapsiblePanel>

          {/* No-Nos Panel */}
          <CollapsiblePanel
            title={`${monthData.name} No-Nos`}
            isOpen={openPanels.noNos}
            onToggle={() => setOpenPanels((prev: OpenPanels) => ({ ...prev, noNos: !prev.noNos }))}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            description="Common mistakes to avoid this month"
          >
            <div className="grid md:grid-cols-3 gap-8">
              {/* Critical Mistakes */}
              <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Critical Mistakes</h3>
                    <p className="text-sm text-gray-500">Avoid these at all costs</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {effectiveNoNos.mistakes.map((mistake, i) => {
                    // Extract title (key phrase before first dash or colon) and description
                    const extractMistakeParts = (text: string) => {
                      // Look for pattern: "Title - Description" or "Title: Description"
                      const dashMatch = text.match(/^([^-]+?)\s*-\s*(.+)$/)
                      if (dashMatch) {
                        return { title: dashMatch[1].trim(), description: dashMatch[2].trim() }
                      }
                      const colonMatch = text.match(/^([^:]+?):\s*(.+)$/)
                      if (colonMatch) {
                        return { title: colonMatch[1].trim(), description: colonMatch[2].trim() }
                      }
                      // Fallback: take first phrase before verb
                      const verbPattern = /\b(reduces|encourages|exposes|leads|causes|forces|produces|increases|removes|treating|ignoring|applying|mismanaging|underestimating|fertilising|pruning|displaces|kills|damages|disrupts|compounds|weakens|accelerates|promotes|creates|increases|worsens|traps|limits|shortens|exposes|compacts|eliminates|burns|suffocates|loosens|spreads|fuels|disrupts|compounds|weakens|accelerates|promotes|creates|increases|worsens|traps|limits|shortens|exposes|compacts|eliminates|burns|suffocates|loosens|spreads|fuels)\b/i
                      const match = text.match(verbPattern)
                      if (match && match.index && match.index > 0) {
                        const beforeVerb = text.substring(0, match.index).trim()
                        const description = text.substring(match.index).trim()
                        const beforeWords = beforeVerb.split(' ')
                        // Take first 1-3 words as title
                        if (beforeWords.length <= 3) {
                          return { title: beforeVerb, description }
                        }
                        const title = beforeWords.slice(0, 2).join(' ')
                        const fullDescription = beforeWords.slice(2).join(' ') + ' ' + description
                        return { title, description: fullDescription.trim() }
                      }
                      // Final fallback: first 2 words as title
                      const words = text.split(' ')
                      if (words.length <= 2) {
                        return { title: text, description: '' }
                      }
                      const title = words.slice(0, 2).join(' ')
                      const description = words.slice(2).join(' ')
                      return { title, description }
                    }
                    
                    const { title, description } = extractMistakeParts(mistake)
                    
                    return (
                      <li key={i} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 mb-1">{title}</p>
                            {description && (
                              <p className="text-gray-700">{description}</p>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Warnings */}
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border border-orange-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Watch Out For</h3>
                    <p className="text-sm text-gray-500">Potential issues to monitor</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {effectiveNoNos.warnings.map((warning, i) => {
                    // Extract title and description (format: "Title - Description")
                    const extractParts = (text: string) => {
                      const dashMatch = text.match(/^([^-]+?)\s*-\s*(.+)$/)
                      if (dashMatch) {
                        return { title: dashMatch[1].trim(), description: dashMatch[2].trim() }
                      }
                      return { title: text, description: '' }
                    }
                    
                    const { title, description } = extractParts(warning)
                    
                    return (
                      <li key={i} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 mb-1">{title}</p>
                            {description && (
                              <p className="text-gray-700">{description}</p>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Common Errors */}
              <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-6 border border-yellow-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <svg className="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Common Errors</h3>
                    <p className="text-sm text-gray-500">Frequent mistakes to avoid</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {effectiveNoNos.commonErrors.map((error, i) => {
                    // Extract title and description (format: "Title - Description")
                    const extractParts = (text: string) => {
                      const dashMatch = text.match(/^([^-]+?)\s*-\s*(.+)$/)
                      if (dashMatch) {
                        return { title: dashMatch[1].trim(), description: dashMatch[2].trim() }
                      }
                      return { title: text, description: '' }
                    }
                    
                    const { title, description } = extractParts(error)
                    
                    return (
                      <li key={i} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 mb-1">{title}</p>
                            {description && (
                              <p className="text-gray-700">{description}</p>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </CollapsiblePanel>
        </div>
      </div>
    </div>
  )
}

export default MonthDetailPage 