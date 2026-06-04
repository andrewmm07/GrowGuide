/**
 * Australian suburbs database with coordinates and hardiness zones
 * Covers all major cities and 50+ common suburbs across zones 8a-12b
 * Organized alphabetically by state for easy extension
 *
 * Zone reference:
 * 8a-8b (cold): Hobart area, Tasmania highlands
 * 9a-9b (cool): Melbourne, Victoria, southern NSW
 * 10a-10b (temperate): Sydney, central NSW, northern Victoria
 * 11a-11b (warm): Brisbane, southern Queensland
 * 12a-12b (tropical): Darwin, north Queensland
 */

import { SuburbRecord } from './types/location';

export const SUBURB_DATA: SuburbRecord[] = [
  // TASMANIA (8a-8b: Cold)
  { name: 'Hobart', state: 'TAS', lat: -42.8821, lon: 147.3272, auHardinessZone: '8b', microclimate: 'coastal' },
  { name: 'Launceston', state: 'TAS', lat: -41.4345, lon: 147.1106, auHardinessZone: '8a' },
  { name: 'Sandy Bay', state: 'TAS', lat: -42.9213, lon: 147.3247, auHardinessZone: '8b', microclimate: 'coastal' },
  { name: 'Battery Point', state: 'TAS', lat: -42.8876, lon: 147.3156, auHardinessZone: '8b', microclimate: 'coastal' },
  { name: 'South Hobart', state: 'TAS', lat: -42.8997, lon: 147.3355, auHardinessZone: '8b' },
  { name: 'Bellerine', state: 'TAS', lat: -42.9158, lon: 147.3267, auHardinessZone: '8b', microclimate: 'coastal' },
  { name: 'Glenorchy', state: 'TAS', lat: -42.9289, lon: 147.3103, auHardinessZone: '8b' },
  { name: 'Kingston', state: 'TAS', lat: -43.0289, lon: 147.3181, auHardinessZone: '8b', microclimate: 'coastal' },
  { name: 'Blackmans Bay', state: 'TAS', lat: -43.0062, lon: 147.3234, auHardinessZone: '8b', microclimate: 'coastal' },
  { name: 'Taroona', state: 'TAS', lat: -42.9476, lon: 147.3512, auHardinessZone: '8b', microclimate: 'coastal' },
  { name: 'Howrah', state: 'TAS', lat: -42.8867, lon: 147.4068, auHardinessZone: '8b', microclimate: 'coastal' },
  { name: 'Lauderdale', state: 'TAS', lat: -42.8889, lon: 147.4833, auHardinessZone: '8b', microclimate: 'coastal' },
  { name: 'Invermay', state: 'TAS', lat: -41.4256, lon: 147.1267, auHardinessZone: '8a' },
  { name: 'Riverside', state: 'TAS', lat: -41.4433, lon: 147.0956, auHardinessZone: '8a' },

  // VICTORIA (9a-9b: Cool to Temperate)
  { name: 'Melbourne', state: 'VIC', lat: -37.8136, lon: 144.9631, auHardinessZone: '9b' },
  { name: 'Brunswick', state: 'VIC', lat: -37.7632, lon: 144.9633, auHardinessZone: '9b' },
  { name: 'Coburg', state: 'VIC', lat: -37.7338, lon: 144.9436, auHardinessZone: '9b' },
  { name: 'Fitzroy', state: 'VIC', lat: -37.8012, lon: 144.9711, auHardinessZone: '9b' },
  { name: 'Carlton', state: 'VIC', lat: -37.7975, lon: 144.9728, auHardinessZone: '9b' },
  { name: 'Hawthorn', state: 'VIC', lat: -37.8181, lon: 145.0267, auHardinessZone: '9b' },
  { name: 'Camberwell', state: 'VIC', lat: -37.8267, lon: 145.0761, auHardinessZone: '9b' },
  { name: 'Canterbury', state: 'VIC', lat: -37.8394, lon: 145.1061, auHardinessZone: '9b' },
  { name: 'Ringwood', state: 'VIC', lat: -37.8281, lon: 145.2272, auHardinessZone: '9b' },
  { name: 'Dandenong', state: 'VIC', lat: -37.9889, lon: 145.2003, auHardinessZone: '9b' },
  { name: 'Ballarat', state: 'VIC', lat: -37.5585, lon: 143.8503, auHardinessZone: '9a' },
  { name: 'Bendigo', state: 'VIC', lat: -36.7597, lon: 144.2808, auHardinessZone: '9a' },
  { name: 'Geelong', state: 'VIC', lat: -38.1499, lon: 144.3617, auHardinessZone: '9b' },
  { name: 'Warrnambool', state: 'VIC', lat: -38.3897, lon: 142.4858, auHardinessZone: '9a' },
  { name: 'Hamilton', state: 'VIC', lat: -37.7397, lon: 142.0161, auHardinessZone: '9a' },

  // NEW SOUTH WALES (9a-10b: Cool to Temperate/Warm)
  { name: 'Sydney', state: 'NSW', lat: -33.8688, lon: 151.2093, auHardinessZone: '10b' },
  { name: 'Parramatta', state: 'NSW', lat: -33.8050, lon: 151.0093, auHardinessZone: '10b' },
  { name: 'Manly', state: 'NSW', lat: -33.7805, lon: 151.2846, auHardinessZone: '10b' },
  { name: 'Bondi', state: 'NSW', lat: -33.8905, lon: 151.2744, auHardinessZone: '10b' },
  { name: 'Strathfield', state: 'NSW', lat: -33.8792, lon: 151.0964, auHardinessZone: '10b' },
  { name: 'Penrith', state: 'NSW', lat: -33.7500, lon: 150.7061, auHardinessZone: '10a' },
  { name: 'Campbelltown', state: 'NSW', lat: -34.0703, lon: 150.8156, auHardinessZone: '10a' },
  { name: 'Wollongong', state: 'NSW', lat: -34.4208, lon: 150.8931, auHardinessZone: '10a' },
  { name: 'Newcastle', state: 'NSW', lat: -32.9267, lon: 151.7828, auHardinessZone: '10b' },
  { name: 'Lismore', state: 'NSW', lat: -28.8093, lon: 153.2759, auHardinessZone: '11a' },
  { name: 'Coffs Harbour', state: 'NSW', lat: -30.3031, lon: 153.1197, auHardinessZone: '11a' },
  { name: 'Armidale', state: 'NSW', lat: -30.5043, lon: 151.4368, auHardinessZone: '9b' },
  { name: 'Tamworth', state: 'NSW', lat: -31.0894, lon: 151.5453, auHardinessZone: '10a' },
  { name: 'Orange', state: 'NSW', lat: -33.2839, lon: 149.1006, auHardinessZone: '9b' },
  { name: 'Bathurst', state: 'NSW', lat: -33.4146, lon: 149.5808, auHardinessZone: '9a' },

  // QUEENSLAND (10a-12b: Temperate to Tropical)
  { name: 'Brisbane', state: 'QLD', lat: -27.4698, lon: 153.0251, auHardinessZone: '11a' },
  { name: 'Gold Coast', state: 'QLD', lat: -28.0028, lon: 153.4314, auHardinessZone: '11a' },
  { name: 'Broadbeach', state: 'QLD', lat: -28.0086, lon: 153.4381, auHardinessZone: '11a' },
  { name: 'Surfers Paradise', state: 'QLD', lat: -28.0088, lon: 153.4280, auHardinessZone: '11a' },
  { name: 'Toowoomba', state: 'QLD', lat: -27.5598, lon: 151.9507, auHardinessZone: '10b' },
  { name: 'Ipswich', state: 'QLD', lat: -27.6259, lon: 152.7690, auHardinessZone: '10b' },
  { name: 'Sunshine Coast', state: 'QLD', lat: -26.7920, lon: 153.0948, auHardinessZone: '11a' },
  { name: 'Caloundra', state: 'QLD', lat: -26.7981, lon: 153.1289, auHardinessZone: '11a' },
  { name: 'Maroochydore', state: 'QLD', lat: -26.6584, lon: 153.0955, auHardinessZone: '11a' },
  { name: 'Noosa Heads', state: 'QLD', lat: -26.3954, lon: 153.0923, auHardinessZone: '11a' },
  { name: 'Rockhampton', state: 'QLD', lat: -23.3813, lon: 150.5007, auHardinessZone: '11b' },
  { name: 'Gladstone', state: 'QLD', lat: -23.8453, lon: 151.2540, auHardinessZone: '11b' },
  { name: 'Mackay', state: 'QLD', lat: -21.1412, lon: 149.1839, auHardinessZone: '12a' },
  { name: 'Townsville', state: 'QLD', lat: -19.2643, lon: 146.8118, auHardinessZone: '12a' },
  { name: 'Cairns', state: 'QLD', lat: -16.8661, lon: 145.7781, auHardinessZone: '12b' },
  { name: 'Port Douglas', state: 'QLD', lat: -16.4881, lon: 145.4607, auHardinessZone: '12b' },

  // SOUTH AUSTRALIA (9a-10a: Cool to Temperate)
  { name: 'Adelaide', state: 'SA', lat: -34.9285, lon: 138.6007, auHardinessZone: '9b' },
  { name: 'Norwood', state: 'SA', lat: -34.9198, lon: 138.6271, auHardinessZone: '9b' },
  { name: 'Burnside', state: 'SA', lat: -34.9464, lon: 138.6572, auHardinessZone: '9b' },
  { name: 'Glenelg', state: 'SA', lat: -34.9859, lon: 138.5275, auHardinessZone: '9b' },
  { name: 'Henley Beach', state: 'SA', lat: -34.9741, lon: 138.4846, auHardinessZone: '9b' },
  { name: 'Mount Barker', state: 'SA', lat: -35.0805, lon: 139.0017, auHardinessZone: '9a' },
  { name: 'Barossa', state: 'SA', lat: -34.5237, lon: 139.0122, auHardinessZone: '9a' },
  { name: 'Clare', state: 'SA', lat: -33.8334, lon: 138.6201, auHardinessZone: '9a' },

  // WESTERN AUSTRALIA (9a-11a: Cool to Warm)
  { name: 'Perth', state: 'WA', lat: -31.9505, lon: 115.8605, auHardinessZone: '10a' },
  { name: 'Fremantle', state: 'WA', lat: -32.0521, lon: 115.7442, auHardinessZone: '10a' },
  { name: 'Subiaco', state: 'WA', lat: -31.9858, lon: 115.8156, auHardinessZone: '10a' },
  { name: 'Applecross', state: 'WA', lat: -32.0175, lon: 115.9128, auHardinessZone: '10a' },
  { name: 'Bunbury', state: 'WA', lat: -33.3268, lon: 115.6408, auHardinessZone: '9b' },
  { name: 'Busselton', state: 'WA', lat: -33.6485, lon: 115.3667, auHardinessZone: '9a' },
  { name: 'Margaret River', state: 'WA', lat: -33.9506, lon: 115.0563, auHardinessZone: '9a' },
  { name: 'Albany', state: 'WA', lat: -34.4833, lon: 117.8758, auHardinessZone: '9a' },

  // NORTHERN TERRITORY (11b-12b: Warm to Tropical)
  { name: 'Darwin', state: 'NT', lat: -12.4634, lon: 130.8456, auHardinessZone: '12b' },
  { name: 'Palmerston', state: 'NT', lat: -12.5113, lon: 131.0289, auHardinessZone: '12b' },
  { name: 'Alice Springs', state: 'NT', lat: -23.6980, lon: 133.8807, auHardinessZone: '11a' },

  // AUSTRALIAN CAPITAL TERRITORY (9a-9b: Cool)
  { name: 'Canberra', state: 'ACT', lat: -35.2809, lon: 149.1300, auHardinessZone: '9a' },
  { name: 'Belconnen', state: 'ACT', lat: -35.2387, lon: 149.0754, auHardinessZone: '9a' },
  { name: 'Woden Valley', state: 'ACT', lat: -35.3433, lon: 149.1097, auHardinessZone: '9a' },
  { name: 'Tuggeranong', state: 'ACT', lat: -35.4286, lon: 149.0630, auHardinessZone: '9a' },
];

/**
 * Find suburb by name (case-insensitive)
 */
export function findSuburbByName(name: string): SuburbRecord | undefined {
  return SUBURB_DATA.find(
    (suburb) => suburb.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Find suburbs by state
 */
export function findSuburbsByState(state: string): SuburbRecord[] {
  return SUBURB_DATA.filter(
    (suburb) => suburb.state.toUpperCase() === state.toUpperCase()
  );
}

/**
 * Find suburbs by hardiness zone
 */
export function findSuburbsByZone(zone: string): SuburbRecord[] {
  return SUBURB_DATA.filter((suburb) => suburb.auHardinessZone === zone);
}

/**
 * Get all unique states in the database
 */
export function getAllStates(): string[] {
  const states = new Set(SUBURB_DATA.map((s) => s.state));
  return Array.from(states).sort();
}

/**
 * Get all unique zones in the database
 */
export function getAllZones(): string[] {
  const zones = new Set(SUBURB_DATA.map((s) => s.auHardinessZone));
  return Array.from(zones).sort();
}
