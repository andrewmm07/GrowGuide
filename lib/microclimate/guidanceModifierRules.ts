import type { ModifierRule } from './guidanceModifiers.types'

/**
 * Rules apply in order; later matching rules overwrite the same fragment fields.
 * Put broad rules first, specific (month + weekBand) last.
 */
export const GUIDANCE_MODIFIER_RULES: ModifierRule[] = [
  // --- Tropical wet/dry: no southern frost calendar ---
  {
    tags: ['tropical_wet_dry'],
    set: { frost: null },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'December',
    set: {
      focus:
        'Wet season is underway, so prioritise drainage, airflow, and crops that cope with heat and humidity.',
    },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'January',
    set: {
      focus:
        'Peak wet season heat and rain favour fast growers; harvest often and manage fungal pressure after downpours.',
    },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'February',
    set: {
      focus:
        'Heavy rain and humidity continue; keep sowing quick crops and maintain beds between storm bursts.',
    },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'March',
    set: {
      focus:
        'Late wet season is a last chance for wet-tolerant plantings before the dry spell intensifies.',
    },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'April',
    set: {
      focus:
        'Transition toward the dry season; shift to irrigation planning and crops that suit drier months ahead.',
    },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'May',
    set: {
      focus:
        'Dry season begins with excellent growing weather; focus on steady watering and heat-tolerant vegetables.',
    },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'June',
    set: {
      focus:
        'Dry season peak offers reliable sun; irrigate consistently and plant European-style vegetables while humidity is low.',
    },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'July',
    set: {
      focus:
        'Cool, dry conditions suit tomatoes, capsicum, and leafy greens; maintain even soil moisture.',
    },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'August',
    set: {
      focus:
        'Dry season continues; prepare for rising heat and the build-up toward the next wet season.',
    },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'September',
    set: {
      focus:
        'Build-up season brings rising heat and humidity; sow quick crops and secure beds before storms return.',
    },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'October',
    set: {
      focus:
        'Heat and humidity return; favour storm-tolerant varieties and improve drainage before heavy rain.',
    },
  },
  {
    tags: ['tropical_wet_dry'],
    month: 'November',
    set: {
      focus:
        'Early wet season; plant wet-tolerant crops and watch for fungal issues as rain becomes frequent.',
    },
  },
  // --- Arid inland ---
  {
    tags: ['arid_inland'],
    season: 'Summer',
    set: {
      weekLine:
        'Heat and low humidity dominate, so water deeply, mulch heavily, and protect seedlings from hot winds.',
      frost: null,
    },
  },
  {
    tags: ['arid_inland'],
    season: 'Spring',
    weekBand: ['early', 'mid'],
    set: {
      weekLine:
        'Warm days and cool nights mean slow mornings; water early and use mulch to buffer temperature swings.',
    },
  },
  {
    tags: ['arid_inland'],
    season: 'Autumn',
    set: {
      frost: null,
      weekLine:
        'Cooler nights appear but hard frost is uncommon; protect tender crops on clear, still evenings.',
    },
  },
  {
    tags: ['arid_inland'],
    season: 'Winter',
    set: {
      weekLine:
        'Mild sunny days suit hardy greens; cold nights still warrant light cover for tender plants.',
      frost: null,
    },
  },
  {
    tags: ['arid_inland'],
    month: 'January',
    set: {
      focus:
        'Extreme heat and dry air stress plants quickly; shade, deep watering, and heat-tolerant varieties are essential.',
    },
  },

  // --- Mediterranean (dry summer, rainy winter) ---
  {
    tags: ['mediterranean'],
    month: 'June',
    set: {
      focus:
        'Winter rains begin the main growing window; plant brassicas, peas, and garlic while soil moisture is reliable.',
    },
  },
  {
    tags: ['mediterranean'],
    month: 'July',
    set: {
      focus:
        'Cool, wet winter suits leafy greens and root crops; watch for snails in damp beds.',
    },
  },
  {
    tags: ['mediterranean'],
    month: 'August',
    set: {
      focus:
        'Late winter is prime planting time before the dry heat; start tomatoes and capsicum under cover if needed.',
    },
  },
  {
    tags: ['mediterranean'],
    month: 'September',
    set: {
      focus:
        'Spring warmth returns; transplant summer crops and increase feeding as growth accelerates.',
    },
  },
  {
    tags: ['mediterranean'],
    month: 'October',
    set: {
      focus:
        'Soil is warming fast; establish summer vegetables before the long dry spell ahead.',
    },
  },
  {
    tags: ['mediterranean'],
    month: 'November',
    set: {
      focus:
        'Finish summer plantings and mulch deeply; irrigation rhythm matters as rain becomes less reliable.',
    },
  },
  {
    tags: ['mediterranean'],
    month: 'December',
    set: {
      focus:
        'Early summer heat builds; water deeply at dawn and prioritise heat-tolerant crops.',
    },
  },
  {
    tags: ['mediterranean'],
    season: 'Autumn',
    weekBand: 'early',
    set: {
      weekLine:
        'Autumn rain returns; refresh beds and sow leafy greens before winter planting peaks.',
    },
  },
  // --- Subtropical humid (warm-climate coast; not true wet/dry tropics) ---
  {
    tags: ['subtropical_humid'],
    climates: ['warm'],
    season: 'Summer',
    weekBand: ['mid', 'late'],
    set: {
      weekLine:
        'Humidity and storm risk rise, so improve airflow, harvest before downpours, and watch for fruit fly and mildew.',
    },
  },
  {
    tags: ['subtropical_humid'],
    climates: ['warm'],
    season: 'Summer',
    weekBand: 'early',
    set: {
      weekLine:
        'Warm, humid summer favours vigorous growth; water deeply and scout for pests on soft new foliage.',
    },
  },
  {
    tags: ['subtropical_humid'],
    climates: ['warm'],
    month: 'September',
    set: {
      focus:
        'Spring warmth arrives with humidity; sow summer crops and watch for snails and fungal spots on seedlings.',
    },
  },
  {
    tags: ['subtropical_humid'],
    climates: ['warm'],
    month: 'October',
    set: {
      focus:
        'Main spring planting for heat lovers; stake climbers and mulch before storm season intensifies.',
    },
  },
  {
    tags: ['subtropical_humid'],
    climates: ['warm'],
    month: 'November',
    set: {
      focus:
        'Pre-storm season; keep fruit fly traps active and harvest regularly as crops size up quickly.',
    },
  },
  {
    tags: ['subtropical_humid'],
    climates: ['warm'],
    season: 'Autumn',
    set: {
      frost: null,
      weekLine:
        'Mild autumn suits extended harvests; sow quick greens rather than assuming an early frost shutdown.',
    },
  },
  {
    tags: ['subtropical_humid'],
    climates: ['warm'],
    season: 'Winter',
    set: {
      weekLine:
        'Mild winter allows steady growth; light feeding and pest scouting continue on many crops.',
      frost: null,
    },
  },

  // --- Alpine / highland ---
  {
    tags: ['alpine_highland'],
    climates: ['cold', 'cool'],
    month: 'May',
    set: {
      focus:
        'Highland sites cool faster than valleys; prioritise frost-hardy crops and covers earlier than coastal forecasts suggest.',
    },
  },
  {
    tags: ['alpine_highland'],
    climates: ['cold', 'cool', 'temperate'],
    season: 'Autumn',
    weekBand: ['mid', 'late'],
    set: {
      frost:
        'Frost can arrive weeks earlier in highland gardens; harvest tender crops and cover beds on clear, calm nights.',
      weekLine:
        'Finish planting hardy crops and mulch well; dormancy comes earlier than in lowland areas.',
    },
  },
  {
    tags: ['alpine_highland'],
    climates: ['cold', 'cool', 'temperate'],
    season: 'Spring',
    weekBand: ['early', 'mid'],
    set: {
      frost:
        'Late frosts remain a risk in highland sites well into spring; harden off slowly and keep cover ready.',
      weekLine:
        'Soil warms slowly; start hardy crops first and delay tender summer plantings.',
    },
  },
  {
    tags: ['alpine_highland'],
    climates: ['cold', 'cool'],
    season: 'Winter',
    set: {
      weekLine:
        'Expect regular frost; focus on hardy greens, dormant pruning, and indoor seed starting.',
    },
  },

  // --- Urban heat island ---
  {
    tags: ['urban_heat'],
    season: 'Summer',
    weekBand: ['early', 'mid'],
    set: {
      weekLine:
        'City heat lingers into the evening; water containers daily and shade sensitive crops on hot walls and pavements.',
    },
  },
  {
    tags: ['urban_heat'],
    season: 'Spring',
    weekBand: 'late',
    set: {
      weekLine:
        'Urban warmth allows earlier planting of heat lovers; still watch for late cool snaps in exposed courtyards.',
    },
  },
  {
    tags: ['urban_heat'],
    season: 'Autumn',
    weekBand: 'late',
    set: {
      weekLine:
        'Built-up areas stay warmer longer; tender crops may survive extra weeks before you clear beds.',
      frost: null,
    },
  },
  {
    tags: ['urban_heat'],
    month: 'January',
    set: {
      focus:
        'Urban heat intensifies summer stress; prioritise mulch, container watering, and heat-tolerant varieties.',
    },
  },

  // --- Coastal (cool/cold) — per-week lines; keep last within coastal group ---
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 1,
    set: {
      weekLine:
        'Early summer on the coast: harvest often and water deeply before dry winds pull moisture from exposed beds.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 2,
    set: {
      weekLine:
        'Keep leafy crops productive on the coast; mulch and water in the morning before sea breezes and warm afternoons.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 3,
    set: {
      weekLine:
        'Succession sow quick greens in spots that catch afternoon shade; coastal heat can be brief but intense.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 4,
    set: {
      weekLine:
        'Stake climbers and check wind exposure on the coast; tie soft growth before summer gales.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 5,
    set: {
      weekLine:
        'Mid-summer on the coast: start brassicas under cover while the sea breeze keeps afternoons milder than inland.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 6,
    set: {
      weekLine:
        'Clear tired summer crops on the coast and refresh compost; empty beds dry quickly in salt-laden winds.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 7,
    set: {
      weekLine:
        'Plant leeks and late brassicas where coastal soil stays workable; water new seedlings before the afternoon breeze.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 8,
    set: {
      weekLine:
        'Harvest corn, zucchini, and tomatoes at peak ripeness on the coast; pick before wind bruises soft fruit.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 9,
    set: {
      weekLine:
        'Prepare garlic beds and green manure on the coast; coastal summers often shorten the window before autumn rain.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 10,
    set: {
      weekLine:
        'Ease feeding on woody plants as coastal growth slows; watch for salt spray burn on exposed leaves.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 11,
    set: {
      weekLine:
        'Last summer sowings of greens and herbs in coastal shade; nights are lengthening even when days feel mild.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 12,
    set: {
      weekLine:
        'Close summer on the coast: note pest patterns, plan rotation, and protect beds before the first autumn gales.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 13,
    set: {
      weekLine:
        'Summer lingers by the coast: keep harvesting, check drainage before autumn rain, and refresh mulch on wind-exposed beds.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Summer',
    weekInSeason: 14,
    set: {
      weekLine:
        'Last summer beat on the coast: clear spent crops, note salt-wind damage, and line up garlic beds before gales and cooler nights.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['temperate', 'warm'],
    season: 'Autumn',
    weekBand: ['mid', 'late'],
    set: {
      frost:
        'Coastal frosts are often milder and later; cover tender crops when cold nights are forecast.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 1,
    set: {
      weekLine:
        'Coastal autumn opens: plant garlic and shallots while soil still holds summer warmth; open drainage paths before heavier rain.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 2,
    set: {
      weekLine:
        'On the coast, sow peas and broad beans into workable soil; mulch rows to limit splash onto brassica leaves after wet spells.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 3,
    set: {
      weekLine:
        'Green-manure empty coastal beds you will rest over winter; avoid compacting sodden soil after sea-front rain.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 4,
    set: {
      weekLine:
        'Harvest remaining tender crops on the coast at peak ripeness; nights are cooling even when days stay mild.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 5,
    set: {
      weekLine:
        'On the coast, growth is still steady; watch for the first cold nights and cover tender crops when forecasts dip, even if you have not seen a hard frost yet.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 6,
    set: {
      weekLine:
        'Coastal gardens often stay mild a little longer; harvest tender crops at peak ripeness and trust local conditions over inland frost calendars.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 7,
    set: {
      weekLine:
        'Evenings are cooling on the coast; keep frost cloth ready and favour hardy greens over tender plant-outs.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 8,
    set: {
      weekLine:
        'Autumn is advancing on the coast; protect tender crops on cold nights and avoid rushing inland planting dates.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 9,
    set: {
      weekLine:
        'Growth is slowing on the coast; finish remaining planting while soil still has warmth and ease back on watering.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 10,
    set: {
      weekLine:
        'Coastal conditions run a few weeks behind inland; delay dormant pruning until trees have actually dropped leaves.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 11,
    set: {
      weekLine:
        'Late autumn on the coast: frosts arrive later and land lighter, so use what you observe and favour frost-hardy vegetables.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 12,
    set: {
      weekLine:
        'Close out autumn on the coast with hardy plantings and covers ready; protect tender crops when cold nights are forecast.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Winter',
    weekInSeason: 6,
    set: {
      weekLine:
        'Prune deciduous fruit only once fully dormant; coastal trees may still be carrying leaves well into winter.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Spring',
    weekInSeason: 1,
    set: {
      weekLine:
        'Soil warms slowly on the coast; start seeds under cover and keep frost cloth ready on clear, calm nights.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Spring',
    weekInSeason: 2,
    set: {
      weekLine:
        'Coastal spring stays cool and breezy; harden off seedlings gradually before planting out tender crops.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Spring',
    weekInSeason: 3,
    set: {
      weekLine:
        'Direct sow peas and hardy greens where soil allows; late frosts can still nip new growth on the coast.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Spring',
    weekInSeason: 4,
    set: {
      weekLine:
        'Before peak spring growth, finish hardening off seedlings and delay tender crops if nights remain cold.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Spring',
    weekInSeason: 5,
    set: {
      weekLine:
        'Harden off cool-season seedlings on the coast and sow peas and broad beans where soil is workable.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Spring',
    weekInSeason: 6,
    set: {
      weekLine:
        'Core spring planting on the coast: potatoes and hardy greens first, with tender crops under cover until nights settle.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Spring',
    weekInSeason: 7,
    set: {
      weekLine:
        'Transplant hardy crops and stake climbers; coastal sites can still see late frosts on calm nights.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['cold', 'cool'],
    season: 'Spring',
    weekInSeason: 8,
    set: {
      weekLine:
        'Growth is picking up on the coast; plant summer crops under cover and watch for surprise frosts after warm days.',
    },
  },
  {
    tags: ['coastal'],
    climates: ['temperate'],
    season: 'Spring',
    weekBand: 'early',
    set: {
      weekLine:
        'Coastal spring can stay breezy and cool; harden off seedlings and delay tender crops while nights stay cool.',
    },
  },

  // --- Inland (reinforce frost calendar where coastal does not apply) ---
  {
    tags: ['inland'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 9,
    set: {
      weekLine:
        'Growth is slowing inland; finish remaining planting while soil still holds warmth and watch for the first regular frosts.',
    },
  },
  {
    tags: ['inland'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 10,
    set: {
      weekLine:
        'Inland frosts are becoming regular; harvest tender crops at peak ripeness and cover vulnerable plantings overnight.',
    },
  },
  {
    tags: ['inland'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 11,
    set: {
      weekLine:
        'Prune deciduous trees once fully dormant inland and ease back on watering as growth slows.',
    },
  },
  {
    tags: ['inland'],
    climates: ['cold', 'cool'],
    season: 'Autumn',
    weekInSeason: 12,
    set: {
      weekLine:
        'Close out autumn inland with frost-hardy plantings finished and tender crops cleared or protected.',
    },
  },
  {
    tags: ['inland'],
    climates: ['temperate'],
    season: 'Autumn',
    weekBand: 'late',
    set: {
      frost:
        'Inland valleys see earlier frosts than the coast; protect tender plants when nights turn cold.',
    },
  },
]
