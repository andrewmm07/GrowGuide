import type { AuPlace } from './types'

/** Additional curated places (phase B expansion). */
export const AU_PLACES_EXTRA: AuPlace[] = [
  // NSW
  { id: 'nsw-potts-point', name: 'Potts Point', state: 'NSW', lat: -33.869, lon: 151.226, auHardinessZone: '10b', microclimateTags: ['coastal', 'urban_heat'] },
  { id: 'nsw-surry-hills', name: 'Surry Hills', state: 'NSW', lat: -33.884, lon: 151.21, auHardinessZone: '10b', microclimateTags: ['urban_heat', 'inland'] },
  { id: 'nsw-newtown', name: 'Newtown', state: 'NSW', lat: -33.898, lon: 151.174, auHardinessZone: '10b', microclimateTags: ['urban_heat', 'inland'] },
  { id: 'nsw-chatswood', name: 'Chatswood', state: 'NSW', lat: -33.797, lon: 151.183, auHardinessZone: '10b', microclimateTags: ['inland'] },
  { id: 'nsw-blue-mountains', name: 'Katoomba', state: 'NSW', lat: -33.712, lon: 150.311, auHardinessZone: '9a', microclimateTags: ['alpine_highland', 'inland'] },
  { id: 'nsw-dubbo', name: 'Dubbo', state: 'NSW', lat: -32.243, lon: 148.601, auHardinessZone: '10a', microclimateTags: ['inland', 'arid_inland'] },
  { id: 'nsw-wagga-wagga', name: 'Wagga Wagga', state: 'NSW', lat: -35.108, lon: 147.359, auHardinessZone: '9b', microclimateTags: ['inland'] },
  { id: 'nsw-byron-bay', name: 'Byron Bay', state: 'NSW', lat: -28.647, lon: 153.602, auHardinessZone: '11a', microclimateTags: ['coastal', 'subtropical_humid'] },
  { id: 'nsw-port-macquarie', name: 'Port Macquarie', state: 'NSW', lat: -31.433, lon: 152.908, auHardinessZone: '10b', microclimateTags: ['coastal'] },
  { id: 'nsw-albury', name: 'Albury', state: 'NSW', lat: -36.074, lon: 146.913, auHardinessZone: '9b', microclimateTags: ['inland'] },
  // VIC
  { id: 'vic-st-kilda', name: 'St Kilda', state: 'VIC', lat: -37.867, lon: 144.984, auHardinessZone: '9b', microclimateTags: ['coastal'] },
  { id: 'vic-brighton', name: 'Brighton', state: 'VIC', lat: -37.906, lon: 145.0, auHardinessZone: '9b', microclimateTags: ['coastal'] },
  { id: 'vic-footscray', name: 'Footscray', state: 'VIC', lat: -37.799, lon: 144.9, auHardinessZone: '9b', microclimateTags: ['urban_heat', 'inland'] },
  { id: 'vic-richmond', name: 'Richmond', state: 'VIC', lat: -37.818, lon: 145.001, auHardinessZone: '9b', microclimateTags: ['urban_heat', 'inland'] },
  { id: 'vic-mornington', name: 'Mornington', state: 'VIC', lat: -38.217, lon: 145.033, auHardinessZone: '9b', microclimateTags: ['coastal'] },
  { id: 'vic-warragul', name: 'Warragul', state: 'VIC', lat: -38.158, lon: 145.931, auHardinessZone: '9b', microclimateTags: ['inland'] },
  { id: 'vic-shepparton', name: 'Shepparton', state: 'VIC', lat: -36.377, lon: 145.398, auHardinessZone: '9b', microclimateTags: ['inland'] },
  { id: 'vic-mildura', name: 'Mildura', state: 'VIC', lat: -34.187, lon: 142.161, auHardinessZone: '10a', microclimateTags: ['arid_inland', 'inland'] },
  // QLD
  { id: 'qld-spring-hill', name: 'Spring Hill', state: 'QLD', lat: -27.456, lon: 153.025, auHardinessZone: '11a', microclimateTags: ['subtropical_humid', 'urban_heat'] },
  { id: 'qld-logan', name: 'Logan', state: 'QLD', lat: -27.639, lon: 153.109, auHardinessZone: '11a', microclimateTags: ['subtropical_humid', 'inland'] },
  { id: 'qld-toowong', name: 'Toowong', state: 'QLD', lat: -27.485, lon: 152.992, auHardinessZone: '11a', microclimateTags: ['subtropical_humid'] },
  { id: 'qld-hervey-bay', name: 'Hervey Bay', state: 'QLD', lat: -25.288, lon: 152.825, auHardinessZone: '11a', microclimateTags: ['coastal', 'subtropical_humid'] },
  { id: 'qld-bundaberg', name: 'Bundaberg', state: 'QLD', lat: -24.866, lon: 152.348, auHardinessZone: '11b', microclimateTags: ['subtropical_humid', 'coastal'] },
  { id: 'qld-mount-isa', name: 'Mount Isa', state: 'QLD', lat: -20.725, lon: 139.497, auHardinessZone: '11b', microclimateTags: ['arid_inland'] },
  // WA
  { id: 'wa-rockingham', name: 'Rockingham', state: 'WA', lat: -32.28, lon: 115.747, auHardinessZone: '10a', microclimateTags: ['coastal', 'mediterranean'] },
  { id: 'wa-mandurah', name: 'Mandurah', state: 'WA', lat: -32.526, lon: 115.721, auHardinessZone: '10a', microclimateTags: ['coastal', 'mediterranean'] },
  { id: 'wa-joondalup', name: 'Joondalup', state: 'WA', lat: -31.744, lon: 115.766, auHardinessZone: '10a', microclimateTags: ['coastal', 'mediterranean'] },
  { id: 'wa-kalgoorlie', name: 'Kalgoorlie', state: 'WA', lat: -30.748, lon: 121.465, auHardinessZone: '10b', microclimateTags: ['arid_inland'] },
  { id: 'wa-broome', name: 'Broome', state: 'WA', lat: -17.961, lon: 122.236, auHardinessZone: '12a', microclimateTags: ['tropical_wet_dry', 'coastal'] },
  // SA
  { id: 'sa-victor-harbor', name: 'Victor Harbor', state: 'SA', lat: -35.55, lon: 138.621, auHardinessZone: '9b', microclimateTags: ['coastal', 'mediterranean'] },
  { id: 'sa-whyalla', name: 'Whyalla', state: 'SA', lat: -33.034, lon: 137.561, auHardinessZone: '9b', microclimateTags: ['coastal', 'mediterranean'] },
  { id: 'sa-port-augusta', name: 'Port Augusta', state: 'SA', lat: -32.492, lon: 137.765, auHardinessZone: '10a', microclimateTags: ['arid_inland'] },
  { id: 'sa-mount-gambier', name: 'Mount Gambier', state: 'SA', lat: -37.828, lon: 140.779, auHardinessZone: '9a', microclimateTags: ['inland'] },
  // TAS
  { id: 'tas-new-town', name: 'New Town', state: 'TAS', lat: -42.858, lon: 147.315, auHardinessZone: '8b', microclimateTags: ['inland'] },
  { id: 'tas-lenah-valley', name: 'Lenah Valley', state: 'TAS', lat: -42.868, lon: 147.295, auHardinessZone: '8b', microclimateTags: ['inland'] },
  { id: 'tas-moonah', name: 'Moonah', state: 'TAS', lat: -42.848, lon: 147.298, auHardinessZone: '8b', microclimateTags: ['inland'] },
  { id: 'tas-rosny', name: 'Rosny', state: 'TAS', lat: -42.867, lon: 147.37, auHardinessZone: '8b', microclimateTags: ['coastal'] },
  { id: 'tas-sorell', name: 'Sorell', state: 'TAS', lat: -42.781, lon: 147.562, auHardinessZone: '8b', microclimateTags: ['coastal', 'inland'] },
  { id: 'tas-devonport', name: 'Devonport', state: 'TAS', lat: -41.179, lon: 146.346, auHardinessZone: '8b', microclimateTags: ['coastal'] },
  { id: 'tas-burnie', name: 'Burnie', state: 'TAS', lat: -41.052, lon: 145.903, auHardinessZone: '8b', microclimateTags: ['coastal'] },
  // ACT + NT
  { id: 'act-gungahlin', name: 'Gungahlin', state: 'ACT', lat: -35.185, lon: 149.132, auHardinessZone: '9a', microclimateTags: ['inland'] },
  { id: 'nt-katherine', name: 'Katherine', state: 'NT', lat: -14.465, lon: 132.263, auHardinessZone: '12a', microclimateTags: ['tropical_wet_dry'] },
  { id: 'nt-alice-springs', name: 'Alice Springs', state: 'NT', lat: -23.698, lon: 133.881, auHardinessZone: '11a', microclimateTags: ['arid_inland'] },
]
