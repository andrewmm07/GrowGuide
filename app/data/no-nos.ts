// Location-specific No-Nos data extracted from Garden No No documents
// Structure: State Code -> City -> Month -> NoNos
import { CITIES } from './locations'

export interface NoNosData {
  mistakes: string[]
  warnings: string[]
  commonErrors: string[]
}

type StateCode = 'TAS' | 'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'NT' | 'ACT'

// Helper to normalize city and month keys
const normalizeCity = (city: string): string => city.trim().toLowerCase()
const normalizeMonth = (month: string): string => month.trim().toLowerCase()
const MONTHS_LOWER = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]

// TAS - Month-specific data for each city (detailed content)
// BURNIE - Cool coastal | Very high rainfall | Persistent cloud | Strong winds | Chronic fungal pressure
const TAS_BURNIE_MONTHLY: Record<string, NoNosData> = {
  january: {
    mistakes: [
      'Watering "because it\'s summer" - Even in January, Burnie soils are often near saturation. Adding water displaces oxygen in the root zone, killing fine roots and setting up inevitable rot.',
      'Assuming mild temperatures mean low stress - Low light reduces photosynthesis, so plants cannot repair tissue or support growth despite adequate moisture.',
      'High nitrogen feeding - Encourages lush, weak growth that fungi exploit immediately.'
    ],
    warnings: [
      'Invisible root suffocation - Early signs include slow growth and pale foliage rather than wilting. Once top growth collapses, root loss is already extensive.',
      'Powdery mildew and leaf spot fungi - High humidity and low airflow allow spores to germinate continuously.',
      'Wind abrasion damage - Persistent wind roughens leaf surfaces, creating fungal entry points.'
    ],
    commonErrors: [
      'Responding to yellow leaves with more water - This accelerates root death.',
      'Bare soil in high-rainfall beds - Increases compaction and surface sealing.',
      'Overcrowding plants - Traps humidity and blocks airflow.'
    ]
  },
  february: {
    mistakes: [
      'Inconsistent moisture management - Alternating saturation and partial drying kills remaining fine roots.',
      'Late pruning to "tidy" plants - Creates fresh wounds during peak fungal activity.',
      'Ignoring drainage infrastructure - Blocked drains now cause persistent anaerobic zones.'
    ],
    warnings: [
      'Crown rot development - Often unnoticed until plants collapse.',
      'Aphids on soft growth - Thrive in sheltered, humid microclimates.',
      'Leaf yellowing unrelated to nutrients - Often misdiagnosed as deficiency.'
    ],
    commonErrors: [
      'Applying fertiliser to fix yellowing - Worsens salt stress in wet soils.',
      'Mulching directly against stems - Promotes rot.',
      'Watering on a schedule - Ignores actual soil moisture.'
    ]
  },
  march: {
    mistakes: [
      'Leaving diseased summer growth - Provides an overwintering reservoir for fungi.',
      'Planting without raised beds - Roots fail before winter begins.',
      'Assuming cooler weather reduces disease risk - Burnie\'s humidity keeps pressure high.'
    ],
    warnings: [
      'Leaf wetness overnight - Condensation fuels infection even without rain.',
      'Slug and snail population surges - High moisture favours rapid reproduction.',
      'Root decline masked by green foliage - A classic Burnie trap.'
    ],
    commonErrors: [
      'Bare autumn soil - Leads to compaction and runoff.',
      'Late planting without drainage correction - Guarantees winter losses.',
      'Ignoring soil structure - Prevents oxygen movement.'
    ]
  },
  april: {
    mistakes: [
      'Overwatering as temperatures drop - Root metabolism slows; oxygen deprivation accelerates.',
      'Heavy pruning - Reduces stored energy and exposes tissue.',
      'Ignoring low-light conditions - Plants cannot compensate for stress.'
    ],
    warnings: [
      'Rapid crown rot onset - Often fatal once visible.',
      'Waterlogging after autumn rain - Severe in clay soils.',
      'Rodent damage - Increased shelter-seeking behaviour.'
    ],
    commonErrors: [
      'Working wet soil - Permanently destroys structure.',
      'Late-day watering - Extends leaf wetness overnight.',
      'No mulch insulation - Leaves roots vulnerable.'
    ]
  },
  may: {
    mistakes: [
      'Assuming dormancy means safety - Roots still require oxygen; saturation is lethal.',
      'Pruning frost-sensitive species - New growth rots or freezes.',
      'Ignoring surface drainage - Pooling water becomes chronic.'
    ],
    warnings: [
      'Persistent soil saturation - Leads to long-term decline rather than sudden death.',
      'Moss and algae growth - Clear indicators of oxygen-free soil.',
      'Lawn fungal disease - Common in wet conditions.'
    ],
    commonErrors: [
      'Fixed irrigation routines - Ignore rainfall entirely.',
      'Thin mulch layers - Insufficient to regulate moisture.',
      'Poor airflow around crowns - Encourages stem rot.'
    ]
  },
  june: {
    mistakes: [
      'Compacting saturated soils - Eliminates remaining air spaces permanently.',
      'Fertilising dormant plants - Salts accumulate and burn roots.',
      'Overwatering containers - Pots stay cold and wet for extended periods.'
    ],
    warnings: [
      'Chronic root hypoxia - Symptoms appear slowly and are often misdiagnosed.',
      'Algae on soil surface - Indicates severe oxygen deprivation.',
      'Cold damage to roots - Invisible until spring failure.'
    ],
    commonErrors: [
      'Leaving pots on cold ground - Accelerates chilling and rot.',
      'Ignoring winter sun angles - Reduces available warmth further.',
      'Poor hygiene during pruning - Spreads fungal pathogens.'
    ]
  },
  july: {
    mistakes: [
      'Early pruning - Wounds fail to heal in cold, wet conditions.',
      'Leaving soil bare - Increases saturation and erosion.',
      'Ignoring wind-driven moisture loss - Even in winter, wind dries foliage faster than roots can respond.'
    ],
    warnings: [
      'Stem and crown rot - Often fatal once established.',
      'Wind rock in wet soils - Loosens already compromised roots.',
      'Rodent damage - Bark and root chewing increases.'
    ],
    commonErrors: [
      'Over-mulching crowns - Traps moisture against stems.',
      'Unstaked young trees - Root damage worsens decline.',
      'No shelter from prevailing winds - Exposes plants unnecessarily.'
    ]
  },
  august: {
    mistakes: [
      'Stimulating early growth - New tissue is extremely disease-prone.',
      'Removing protection too soon - Late cold snaps and rain persist.',
      'Planting into wet, cold soil - Roots rot before establishment.'
    ],
    warnings: [
      'Late fungal surges - Driven by humidity and warming days.',
      'Aphids on early shoots - Spread disease rapidly.',
      'Wind stress - Increases tissue damage.'
    ],
    commonErrors: [
      'No hardening-off - Sudden exposure weakens plants.',
      'Overwatering - Compounds oxygen stress.',
      'Ignoring weeds - Increases humidity near soil.'
    ]
  },
  september: {
    mistakes: [
      'Planting tender species without raised beds - Roots suffocate during spring rain.',
      'Overfeeding nitrogen - Soft growth fuels disease.',
      'Inconsistent moisture management - Roots die back in saturated–cool cycles.'
    ],
    warnings: [
      'Slug and snail damage - Severe in persistently moist conditions.',
      'Fungal leaf disease - Spreads rapidly.',
      'Wind damage to new growth - Stems snap easily.'
    ],
    commonErrors: [
      'Crowded beds - Trap humidity.',
      'No staking - Leads to wind rock.',
      'Skipping mulch renewal - Leaves soil unstable.'
    ]
  },
  october: {
    mistakes: [
      'Assuming disease pressure has eased - Burnie remains high-risk.',
      'Overwatering during cool spells - Roots suffocate.',
      'Rapid planting without soil preparation - Compaction limits oxygen.'
    ],
    warnings: [
      'Fungal outbreaks after rain - Spread explosively.',
      'Caterpillars - Damage weakened foliage.',
      'Cold fronts - Cause sudden stress.'
    ],
    commonErrors: [
      'Ignoring airflow - Encourages disease.',
      'Poor spacing - Increases competition and humidity.',
      'No windbreaks - Exposes plants.'
    ]
  },
  november: {
    mistakes: [
      'Dry–wet cycling - Disrupts nutrient transport.',
      'Heavy pruning - Reduces flowering and fruit set.',
      'Ignoring low light levels - Limits plant recovery.'
    ],
    warnings: [
      'Aphid population explosions - Fuelled by soft growth.',
      'Powdery mildew - Persistent in mild humidity.',
      'Slow growth misdiagnosed as deficiency - Often light-related.'
    ],
    commonErrors: [
      'Late planting - Shortens establishment window.',
      'No shade management - Increases stress during rare heat.',
      'Irregular irrigation - Weakens plants further.'
    ]
  },
  december: {
    mistakes: [
      'Treating summer as dry season - Rainfall and humidity remain high.',
      'Removing mulch - Exposes roots to moisture swings.',
      'Pruning thin-barked species - Leads to sunburn and infection.'
    ],
    warnings: [
      'Root rot flare-ups - Following summer rain.',
      'Spider mites during brief dry spells - Often overlooked.',
      'Wind scorch - Compounds chronic stress.'
    ],
    commonErrors: [
      'Black containers in sun - Root-zone overheating despite cool air.',
      'Midday watering - Inefficient and stressful.',
      'Bare soil exposure - Accelerates instability.'
    ]
  }
}

// DEVONPORT - Northern coast | Higher humidity | Frequent wind | Milder frosts | Waterlogging risk
const TAS_DEVONPORT_MONTHLY: Record<string, NoNosData> = {
  january: {
    mistakes: [
      'Overwatering in response to wind stress - Coastal wind increases transpiration, but humid air slows evaporation from leaves. Gardeners often compensate by adding water, saturating soils and depriving roots of oxygen.',
      'Assuming mild temperatures mean low disease risk - Warm, humid nights allow fungal spores to germinate even without visible leaf wetness.',
      'Heavy nitrogen feeding - Encourages soft growth that fungi and aphids exploit immediately.'
    ],
    warnings: [
      'Subsurface root suffocation - Early signs include dull foliage and slow growth rather than wilting. If ignored, roots rot and plants fail weeks later with no obvious warning.',
      'Powdery mildew and leaf spot fungi - These establish rapidly during calm, humid evenings and spread unnoticed until coverage is extensive.',
      'Wind snap on soft growth - Stems grown too fast lack structural strength.'
    ],
    commonErrors: [
      'Watering because leaves look stressed - Leaf movement from wind mimics drought stress; adding water worsens root conditions.',
      'Bare soil in coastal beds - Encourages rapid evaporation at the surface while deeper layers remain saturated.',
      'Overcrowding plants - Restricts airflow and traps humidity around foliage.'
    ]
  },
  february: {
    mistakes: [
      'Inconsistent watering in humid heat - Alternating saturation and partial drying damages fine roots and disrupts nutrient uptake.',
      'Late pruning to "tidy up" - Creates fresh wounds in peak fungal conditions.',
      'Ignoring drainage maintenance - Small blockages now cause chronic waterlogging.'
    ],
    warnings: [
      'Fungal disease escalation - Spots spread rapidly during humid periods and weaken plants before autumn.',
      'Aphids on soft regrowth - Thrive on nitrogen-fed plants and spread disease.',
      'Root decline without wilting - A classic Devonport failure pattern.'
    ],
    commonErrors: [
      'Watering on a schedule - Ignores rainfall and humidity.',
      'Using heavy mulches without airflow - Traps moisture at the crown.',
      'Delayed disease removal - Allows spores to persist.'
    ]
  },
  march: {
    mistakes: [
      'Stopping airflow management - Cooler nights increase condensation on foliage.',
      'Leaving summer-damaged growth - Diseased tissue becomes an overwintering reservoir.',
      'Planting without raising beds - Roots fail to establish before wetter months.'
    ],
    warnings: [
      'Leaf wetness overnight - Even without rain, condensation fuels disease.',
      'Slugs and snails - Numbers increase as moisture persists.',
      'Hidden root rot - Often only visible once plants collapse.'
    ],
    commonErrors: [
      'Bare autumn beds - Increase compaction and runoff.',
      'Late planting without drainage prep - Leads to winter losses.',
      'Ignoring soil structure - Limits oxygen availability.'
    ]
  },
  april: {
    mistakes: [
      'Overwatering as temperatures fall - Root respiration slows dramatically; excess water now becomes lethal.',
      'Heavy pruning - Reduces stored reserves needed for winter resilience.',
      'Ignoring low-lying wet areas - These become permanent anaerobic zones.'
    ],
    warnings: [
      'Waterlogging after rain - Especially damaging in clay or compacted soils.',
      'Early fungal outbreaks - Triggered by cool, damp conditions.',
      'Rodent activity - Increased shelter-seeking behaviour.'
    ],
    commonErrors: [
      'Working wet soil - Permanently destroys structure.',
      'Late-day watering - Extends leaf wetness overnight.',
      'No mulch insulation - Exposes roots to temperature swings.'
    ]
  },
  may: {
    mistakes: [
      'Assuming dormancy equals safety - Roots still require oxygen even when growth slows.',
      'Pruning frost-tender species - Regrowth is damaged by cold snaps.',
      'Ignoring surface drainage - Minor pooling becomes chronic saturation.'
    ],
    warnings: [
      'Persistent soil saturation - Leads to long-term decline rather than sudden death.',
      'Lawn fungal disease - Common in damp coastal areas.',
      'Moss growth - Indicates severe oxygen deprivation.'
    ],
    commonErrors: [
      'Fixed irrigation routines - Ignore rainfall and soil moisture.',
      'Thin mulch layers - Insufficient to regulate moisture.',
      'Poor airflow around crowns - Encourages rot.'
    ]
  },
  june: {
    mistakes: [
      'Compacting saturated soils - Eliminates remaining air spaces.',
      'Fertilising dormant plants - Salts accumulate and burn inactive roots.',
      'Overwatering containers - Pots stay wet and cold for long periods.'
    ],
    warnings: [
      'Chronic root hypoxia - Symptoms are slow and often misdiagnosed.',
      'Algae on soil surface - A sign of oxygen-free conditions.',
      'Cold damage to roots - Often invisible until spring.'
    ],
    commonErrors: [
      'Leaving pots on cold ground - Accelerates chilling.',
      'Ignoring winter sun angles - Reduces available warmth.',
      'Poor hygiene during pruning - Spreads disease.'
    ]
  },
  july: {
    mistakes: [
      'Early pruning - Creates wounds that fail to heal in cold, wet conditions.',
      'Leaving soil bare - Increases saturation and erosion.',
      'Ignoring wind-driven moisture loss - Even in winter, wind dries foliage faster than roots can respond.'
    ],
    warnings: [
      'Fungal stem and crown rot - Often fatal once established.',
      'Wind damage - Loosens roots in wet soil.',
      'Rodent damage - Bark and root chewing increases.'
    ],
    commonErrors: [
      'Over-mulching crowns - Traps moisture against stems.',
      'Unstaked young trees - Root rock worsens decline.',
      'Inadequate shelter - Exposes plants unnecessarily.'
    ]
  },
  august: {
    mistakes: [
      'Stimulating early growth - New tissue is highly disease-prone.',
      'Removing protection too soon - Late cold snaps still occur.',
      'Planting into wet, cold soil - Roots rot before establishment.'
    ],
    warnings: [
      'Late fungal surges - Driven by humidity and warming days.',
      'Aphids on early shoots - Spread disease rapidly.',
      'Wind stress - Increases desiccation.'
    ],
    commonErrors: [
      'No hardening-off - Sudden exposure weakens plants.',
      'Overwatering - Compounds oxygen stress.',
      'Weed neglect - Increases humidity near soil.'
    ]
  },
  september: {
    mistakes: [
      'Planting tender species without drainage correction - Roots suffocate during spring rain.',
      'Overfeeding nitrogen - Soft growth fuels disease.',
      'Inconsistent watering - Roots die back in saturated–dry cycles.'
    ],
    warnings: [
      'Slug and snail damage - Severe in moist conditions.',
      'Fungal leaf disease - Spreads rapidly in mild weather.',
      'Wind breakage - New growth is fragile.'
    ],
    commonErrors: [
      'Crowded beds - Trap humidity.',
      'No staking - Leads to wind rock.',
      'Skipping mulch renewal - Leaves soil unstable.'
    ]
  },
  october: {
    mistakes: [
      'Assuming disease pressure is over - Humidity remains high.',
      'Overwatering during cool spells - Roots suffocate.',
      'Rapid planting without soil prep - Compaction limits growth.'
    ],
    warnings: [
      'Fungal outbreaks after rain - Spread quickly.',
      'Caterpillars - Damage spring foliage.',
      'Cold fronts - Cause sudden stress.'
    ],
    commonErrors: [
      'Ignoring airflow - Encourages disease.',
      'Poor spacing - Increases competition.',
      'No windbreaks - Exposes plants.'
    ]
  },
  november: {
    mistakes: [
      'Dry–wet cycling - Disrupts nutrient transport.',
      'Heavy pruning - Reduces flowering and fruit set.',
      'Ignoring rising UV - Sunburn still occurs.'
    ],
    warnings: [
      'Aphid explosions - Fuelled by soft growth.',
      'Powdery mildew - Common in mild humidity.',
      'Early heat stress - Often overlooked.'
    ],
    commonErrors: [
      'Late planting - Shortens establishment time.',
      'No shade planning - Increases stress.',
      'Irregular irrigation - Weakens plants.'
    ]
  },
  december: {
    mistakes: [
      'Treating summer as dry - Humidity remains high, increasing disease risk.',
      'Removing mulch - Exposes roots to moisture swings.',
      'Pruning thin-barked species - Leads to sunburn.'
    ],
    warnings: [
      'Root rot flare-ups - Following summer rain.',
      'Spider mites - Appear during dry spells.',
      'Wind scorch - Compounds stress.'
    ],
    commonErrors: [
      'Black containers in sun - Root overheating.',
      'Midday watering - Inefficient and stressful.',
      'Bare soil exposure - Increases instability.'
    ]
  }
}

// LAUNCESTON - Inland valley | Hotter summers | Colder frosts | Lower rainfall
const TAS_LAUNCESTON_MONTHLY: Record<string, NoNosData> = {
  january: {
    mistakes: [
      'Underestimating heat intensity due to low humidity - Hot inland days drive rapid transpiration. Plants wilt quickly even when soil appears moist because uptake cannot match leaf water loss.',
      'Shallow irrigation during heat - Encourages surface roots that fail catastrophically during multi-day hot spells.',
      'Heavy nitrogen feeding - Increases leaf area and water demand, worsening heat stress and aphid pressure.'
    ],
    warnings: [
      'Midday heat stress despite green foliage - Early signs include leaf cupping and dull colour rather than obvious wilting. If ignored, photosynthetic shutdown reduces growth and yield for weeks.',
      'Spider mites in hot, dry conditions - Low humidity favours mites. Fine stippling on leaves is often missed until populations explode.',
      'Sunburn on exposed fruit and stems - High UV causes tissue necrosis on unshaded surfaces.'
    ],
    commonErrors: [
      'Watering in the evening only - This leaves plants under-supplied during peak daytime transpiration, leading to chronic stress.',
      'Removing mulch to "let soil breathe" - Bare soil overheats and dries rapidly, killing fine roots near the surface.',
      'Failing to provide temporary shade - Gardeners assume full sun is always beneficial; in Launceston heatwaves, it becomes lethal.'
    ]
  },
  february: {
    mistakes: [
      'Inconsistent watering during late-summer heat - Moisture fluctuations disrupt calcium transport, weakening cell walls and reducing fruit quality.',
      'Late hard pruning - Exposes tissues to intense sun and heat, causing dieback.',
      'Ignoring nutrient imbalance - Heat accelerates nutrient uptake problems already present in compacted soils.'
    ],
    warnings: [
      'Blossom drop and poor fruit set - Heat stress interferes with pollination. Symptoms often appear days after the heat event.',
      'Aphids thriving on stressed plants - Colonies establish rapidly on weakened growth, spreading disease.',
      'Leaf scorch following hot northerlies - Wind compounds dehydration.'
    ],
    commonErrors: [
      'Watering "by feel" rather than depth - Surface moisture fools gardeners into thinking plants are adequately hydrated.',
      'Overcrowding plants - Reduces airflow and increases heat retention around foliage.',
      'Ignoring soil cracking - Cracks sever fine roots, worsening stress even after watering resumes.'
    ]
  },
  march: {
    mistakes: [
      'Stopping irrigation too early - Plants are still actively storing carbohydrates for winter. Stress now weakens spring performance.',
      'Leaving pest-damaged foliage - Allows populations to overwinter.',
      'Planting without loosening compacted soil - Roots struggle to establish before cold weather.'
    ],
    warnings: [
      'Residual heatwaves - March heat events are often underestimated but still damaging.',
      'Caterpillars on autumn growth - Damage reduces photosynthetic capacity going into winter.',
      'Early fungal disease after rain - Cool nights + moisture favour infection.'
    ],
    commonErrors: [
      'Bare autumn beds - Exposes soil to temperature swings and erosion.',
      'Late planting without frost planning - New plants fail to establish before cold arrives.',
      'Skipping organic matter addition - Limits moisture retention and microbial recovery.'
    ]
  },
  april: {
    mistakes: [
      'Overwatering cooling soils - Root activity slows sharply; excess moisture causes hypoxia.',
      'Heavy pruning - Removes stored energy needed for winter survival.',
      'Ignoring frost-prone low spots - Cold air pooling causes uneven damage.'
    ],
    warnings: [
      'Early frosts - Often catch gardeners off guard and damage tender growth.',
      'Waterlogging after autumn rain - Particularly severe in compacted soils.',
      'Rodent damage - Increased as food sources decline.'
    ],
    commonErrors: [
      'Working wet soil - Permanently damages structure.',
      'Late-day watering - Increases frost severity overnight.',
      'No mulch insulation - Leaves roots exposed to cold swings.'
    ]
  },
  may: {
    mistakes: [
      'Assuming plants are fully dormant - Many perennials still respire and require oxygenated soil.',
      'Pruning frost-sensitive species - New growth is killed almost immediately.',
      'Neglecting drainage maintenance - Small issues now become lethal in winter.'
    ],
    warnings: [
      'Hard frosts - More severe and frequent than coastal Tasmania.',
      'Lawn fungal disease - Encouraged by cold, damp conditions.',
      'Moss and algae growth - Indicates poor drainage and low oxygen.'
    ],
    commonErrors: [
      'Fixed irrigation schedules - Ignore rainfall and soil temperature.',
      'Thin mulch layers - Insufficient to buffer frost penetration.',
      'Poor airflow around crowns - Encourages rot.'
    ]
  },
  june: {
    mistakes: [
      'Compacting saturated soil - Destroys pore space and root oxygen availability.',
      'Fertilising dormant plants - Salts accumulate and burn roots.',
      'Overwatering containers - Pots cool rapidly and suffocate roots.'
    ],
    warnings: [
      'Prolonged soil saturation - Leads to chronic root decline.',
      'Algae on soil surface - Indicates severe oxygen deprivation.',
      'Cold damage to roots - Often invisible until spring.'
    ],
    commonErrors: [
      'Leaving pots on cold ground - Accelerates chilling.',
      'Ignoring winter sun angles - Reduces available warmth.',
      'Poor tool hygiene - Spreads disease during pruning.'
    ]
  },
  july: {
    mistakes: [
      'Early pruning before frost risk ends - Causes dieback and structural weakness.',
      'Leaving soil bare - Increases frost depth and duration.',
      'Ignoring wind desiccation - Cold wind dries foliage even when growth is slow.'
    ],
    warnings: [
      'Severe frosts - Often the coldest month.',
      'Wind burn on evergreens - Tissue desiccation leads to browning.',
      'Rodent activity - Bark and root damage increases.'
    ],
    commonErrors: [
      'Over-mulching crowns - Traps moisture and promotes rot.',
      'Unstaked young trees - Wind loosens roots in cold soils.',
      'Inadequate frost protection - Leads to cumulative damage.'
    ]
  },
  august: {
    mistakes: [
      'Stimulating early growth with fertiliser - Late frosts destroy new tissue and waste reserves.',
      'Removing frost protection too soon - August frosts are often severe.',
      'Planting into cold, wet soil - Roots fail to establish and rot.'
    ],
    warnings: [
      'Late frosts - More damaging due to rising sap flow.',
      'Aphids on early growth - Populations establish quickly.',
      'Strong winds - Increase dehydration.'
    ],
    commonErrors: [
      'No hardening-off - Sudden exposure kills young plants.',
      'Overwatering - Compounds cold stress.',
      'Ignoring weeds - Compete for warming soil.'
    ]
  },
  september: {
    mistakes: [
      'Planting tender species without frost contingency - Losses often occur just after establishment.',
      'Overfeeding nitrogen - Produces weak, frost-sensitive growth.',
      'Inconsistent watering - Causes root dieback.'
    ],
    warnings: [
      'Late frost events - Common in inland Tasmania.',
      'Slugs and snails - Active in cool, damp conditions.',
      'Wind damage - Breaks new growth.'
    ],
    commonErrors: [
      'Crowded plantings - Reduce airflow and resilience.',
      'No staking - Leads to wind rock.',
      'Skipping mulch renewal - Leaves soil unstable.'
    ]
  },
  october: {
    mistakes: [
      'Assuming frost risk has ended - Early October frosts still occur.',
      'Overwatering during cool spells - Roots suffocate.',
      'Rapid planting without soil preparation - Compaction limits growth.'
    ],
    warnings: [
      'Fungal outbreaks after rain - Cool temperatures slow drying.',
      'Caterpillars - Damage spring growth.',
      'Cold fronts - Cause sudden stress.'
    ],
    commonErrors: [
      'Ignoring airflow - Encourages disease.',
      'Poor spacing - Increases competition.',
      'No windbreaks - Exposes plants unnecessarily.'
    ]
  },
  november: {
    mistakes: [
      'Dry–wet cycling - Disrupts nutrient transport and flowering.',
      'Heavy pruning - Reduces yield potential.',
      'Ignoring rising UV - Sunburn occurs quickly.'
    ],
    warnings: [
      'Aphids - Rapid population growth.',
      'Powdery mildew - Favoured by mild conditions.',
      'Early heat stress - Often underestimated.'
    ],
    commonErrors: [
      'Late planting - Shortens growing season.',
      'No shade planning - Increases heat damage.',
      'Inconsistent irrigation - Weakens growth.'
    ]
  },
  december: {
    mistakes: [
      'Treating summer as stable - Heat spikes arrive suddenly and cause collapse.',
      'Removing mulch - Exposes roots to overheating.',
      'Pruning thin-barked species - Leads to sunburn.'
    ],
    warnings: [
      'Heatwaves - Especially damaging inland.',
      'Spider mites - Thrive in dry heat.',
      'Wind scorch - Compounds stress.'
    ],
    commonErrors: [
      'Black containers in full sun - Root-zone overheating kills plants.',
      'Midday watering - Inefficient and stressful.',
      'Bare soil exposure - Accelerates moisture loss.'
    ]
  }
}

// HOBART - Cool temperate | Drier than north | Strong winds | Frost-prone winters
const TAS_HOBART_MONTHLY: Record<string, NoNosData> = {
  january: {
    mistakes: [
      'Overwatering during windy periods - Strong winds increase transpiration, but cool soils remain saturated. Adding water displaces oxygen and promotes root rot.',
      'Assuming mild summer temperatures mean low stress - Wind desiccation occurs even when air is cool, causing plants to lose water faster than expected.',
      'Excess nitrogen feeding - Encourages soft, lush growth that is vulnerable to wind damage and fungal disease in Hobart\'s variable conditions.'
    ],
    warnings: [
      'Wind desiccation despite adequate soil moisture - Plants can wilt from wind stress, not drought. Adding water worsens root conditions. Check recent wind levels before assuming wilt means dehydration.',
      'Fungal disease during calm periods - Brief windows of still, humid weather allow spores to germinate and spread rapidly. Do not presume declining wind inherently means less observation is required.',
      'Slugs and snails in sheltered areas - High humidity in protected spots favours rapid population growth. Watch carefully and eliminate quickly, before populations take-off.'
    ],
    commonErrors: [
      'Watering in response to wind-stressed foliage - wind-stress mimics drought-based wilt, and adding water saturates already-moist soils. Check the soil before watering.',
      'Bare beds without wind protection - Exposes soil to rapid drying and erosion. Ensure mulch is applied and maintained throughout the month.',
      'Working wet soil after rain - Digging, walking-on, and tilling wet soil compacts structure and reduces oxygen availability. Roots, earthworms and beneficial microbes struggle to navigate through the soil and begin suffocating.'
    ]
  },
  february: {
    mistakes: [
      'Inconsistent moisture management - Alternating between wind-driven drying and overwatering damages fine roots and disrupts nutrient uptake. Always check soil-moisture - do not assume',
      'Late summer pruning - Creates wounds that fail to heal before autumn rains increase disease pressure. Prune in eary/mid summer, or wait until winter.',
      'Ignoring drainage in windy areas - Wind-driven rain causes localised waterlogging even in well-drained beds. Do multiple moisture checks - do not assume all parts of a bed are the same.'
    ],
    warnings: [
      'Crown rot in poorly drained spots - Often unnoticed in summer until plants collapse. Know your wet-areas and monitor them, even in summer.',
      'Aphids on soft regrowth - Thrive on nitrogen-fed plants during calm periods between windy spells. Monitor new growth when you see it.',
      'Leaf yellowing from wind stress - Often misdiagnosed as nutrient deficiency. Before adding nutrients, consider recent wind activity and  assess the type of yellowing patchy, along edges, or blotchy) and location on the plant (usually outer leaves or leaves facing prevailing winds), as this can help distinguish wind stress from true nutrient deficiencies.'
    ],
    commonErrors: [
      'Applying fertiliser to fix yellowing - Worsens salt stress in cool, wet soils. Diagnose the yellowing-cause before actioning.',
      'Mulching without considering wind - Light mulches blow away; heavy mulches trap moisture. Match the type and weight of mulch to the location and wind patterns.',
      'Watering on a fixed schedule - Ignores actual soil moisture and wind conditions. Actively monitor the soil and customise accordingly.'
    ]
  },
  march: {
    mistakes: [
      'Leaving diseased summer growth - Provides overwintering sites for fungi and pests. Prune out any diseased growth in summer, or wait until winter.',
      'Planting without wind protection - New plants fail to establish before winter winds increase. Plant in sheltered areas, or use temporary windbreaks.',
      'Assuming cooler weather reduces disease risk - Hobart\'s humidity and wind keep disease pressure high. Monitor for disease and pests in summer, even in winter.'
    ],
    warnings: [
      'Leaf wetness from wind-driven rain - Even brief showers, when combined with wind, keep foliage wet for extended periods. Check for wetness regularly.',
      'Slug and snail population increases - Cool, damp conditions favour rapid reproduction. Watch carefully and eliminate quickly, before populations take-off.',
      'Root decline masked by persistent wind stress - Classic Hobart pattern where multiple stresses compound. Monitor for root decline and act quickly.'
    ],
    commonErrors: [
      'Bare autumn soil - Exposes beds to wind erosion and temperature swings. Apply mulch to protect the soil and plants.',
      'Late planting without windbreaks - New plants struggle to establish. Plant in sheltered areas, or use temporary windbreaks.',
      'Ignoring soil structure - Compacted soils limit oxygen movement in wet conditions. Check the soil structure and improve it if necessary.'
    ]
  },
  april: {
    mistakes: [
      'Overwatering as temperatures drop - Root activity slows; excess moisture causes hypoxia in cool soils. Check soil before watering.',
      'Heavy pruning - Reduces stored energy needed for winter resilience against wind and cold. Delay pruning until winter unless absolutely necessary.',
      'Ignoring frost-prone low areas - Cold air pools in sheltered spots, causing uneven damage. Know your low areas and check them.'
    ],
    warnings: [
      'Rapid crown rot onset - Often fatal once visible, especially in poorly drained areas. Know your low spots and check them.',
      'Waterlogging after autumn rain - Severe in clay soils and compacted beds. Avoid compaction and improve drainage if possible.',
      'Rodent damage - Increased shelter-seeking behaviour as temperatures drop. Remove shelters, protect vulnerable plants and use control methods.'
    ],
    commonErrors: [
      'Working wet soil - Permanently destroys structure and reduces drainage. Wait for soil to dry.',
      'Late-day watering - Extends leaf wetness overnight, increasing disease risk. Water in the morning before temperature drops.',
      'No mulch insulation - Leaves roots vulnerable to temperature swings and wind exposure. Maintain mulch, even if it seems like the weather doesn\'t demand it.'
    ]
  },
  may: {
    mistakes: [
      'Assuming dormancy means safety - Roots still require oxygen; saturation in cool soils is lethal. Regularly monitor soil moisture.',
      'Pruning frost-sensitive species - New growth is damaged by cold snaps and wind. Be selective in your pruning, checking for frost sensitivity before starting.',
      'Ignoring surface drainage - Pooling water can become chronic in winter. Check for wetness regularly and drain water away from plants.'
    ],
    warnings: [
      'Persistent soil saturation - Leads to long-term decline rather than sudden death. Monitor soil moisture regularly and drain water away from plants.',
      'Moss and algae growth - Clear indicators of oxygen-deprived, waterlogged soil. Check for wetness regularly and drain water away from plants.',
      'Lawn fungal disease - Common in Hobart\'s cool, damp winter conditions. Monitor for disease and pests, even in winter.'
    ],
    commonErrors: [
      'Fixed irrigation routines - Ignore rainfall and actual soil moisture. Actively monitor rainfall and adjust irrigation accordingly.',
      'Thin mulch layers - Insufficient to regulate moisture and protect from wind. Apply mulch evenly and sufficiently.',
      'Poor airflow around crowns - Encourages stem rot while still allowing wind damage. Don\'t overcrowd plants, prune for airflow and maintain airflow.'
    ]
  },
  june: {
    mistakes: [
      'Compacting saturated soils - Eliminates air spaces, choking plants, worms and microbes. Don\'t dig, walk-on, or till wet soil.',
      'Fertilising dormant plants - Salts accumulate and burn roots in cool, wet conditions. Don\'t fertilise dormant plants in winter.',
      'Overwatering containers - Pots stay cold and wet for extended periods, suffocating roots. Check soil moisture regularly and drain water away from plants.'
    ],
    warnings: [
      'Chronic root hypoxia - Symptoms appear slowly and are often misdiagnosed as other issues. Monitor soil moisture regularly and drain water away from plants.',
      'Algae on soil surface - Indicates severe oxygen deprivation in waterlogged beds. Check for wetness regularly and drain water away from plants.',
      'Cold damage to roots - Invisible until spring, when plants fail to recover. Monitor for root decline and protect from the cold.'
    ],
    commonErrors: [
      'Leaving pots on cold ground - Accelerates chilling and rot in Hobart\'s cold winters. Elevate pots off the ground.',
      'Ignoring winter sun angles - Reduces available warmth, especially in sheltered positions. Place pots in a sunny position if possible.',
      'Poor hygiene during pruning - Spreads fungal pathogens during wet conditions. Clean tools and pruners after use.'
    ]
  },
  july: {
    mistakes: [
      'Early pruning - Wounds fail to heal in cold, wet, windy conditions. Delay pruning until full dormancy unless absolutely necessary.',
      'Leaving soil bare - Increases saturation, erosion, and wind exposure. Apply mulch to protect the soil and plants.',
      'Ignoring wind-driven moisture loss - Even in winter, wind dries foliage faster than roots can respond. Check for wetness regularly and drain water away from plants.'
    ],
    warnings: [
      'Stem and crown rot - Often fatal once established, especially in poorly drained areas. Know your low spots and check them.',
      'Wind rock in wet soils - Loosens already-compromised roots in exposed positions. Check for root decline and protect from the cold.',
      'Rodent damage - Bark and root chewing increases as food sources become scarce. Remove shelters, protect vulnerable plants and use control methods.'
    ],
    commonErrors: [
      'Over-mulching crowns - Traps moisture against stems, promoting rot. Don\'t overmulch, apply mulch evenly and sufficiently.',
      'Unstaked young trees - Root damage worsens decline in windy conditions. Stake young trees in winter, or use temporary windbreaks.',
      'No shelter from prevailing winds - Exposes plants unnecessarily to Hobart\'s strong winter winds. Use temporary windbreaks, or plant in sheltered areas.',
    ]
  },
  august: {
    mistakes: [
      'Stimulating early growth - New tissue is extremely disease-prone in Hobart\'s cool, damp spring. Don\'t fertilise dormant plants in winter.',
      'Removing protection too soon - Late cold snaps, wind, and rain persist well into August. Don\'t remove frost protection too soon.',
      'Planting into wet, cold soil - Root rot before establishment in Hobart\'s slow-warming spring. Wait for the soil to warm up or plant in sheltered areas.'
    ],
    warnings: [
      'Late fungal surges - Humid, warming days are combined with cool nights, creating ideal conditions for fungal growth. Monitor carefully for early signs of disease.',
      'Aphids on early shoots - Spread disease rapidly on soft new growth. Monitor new growth when you see it and eliminate aphids quickly.',
      'Wind stress - Increases tissue damage on fragile new growth. Check for wind damage regularly and protect vulnerable plants.'
    ],
    commonErrors: [
      'No hardening-off - Sudden exposure to Hobart\'s variable spring weather weakens plants. Slowly expose plants to the elements, starting with a few hours in the morning and gradually increasing the time spent outdoors.',
      'Overwatering - Compounds oxygen stress in still-cool soils. Check soil moisture regularly before watering. Don\'t assume increasing temperature means increasing watering.',
      'Ignoring weeds - Increases humidity near soil and competes for resources.'
    ]
  },
  september: {
    mistakes: [
      'Planting tender species in-ground - Roots often suffocate during Hobart\'s spring rains. It is not as hot nor dry as presumed. Plant in raised beds or delay planting.',
      'Overfeeding nitrogen - Soft growth fuels disease in early spring. Feed cautiously and monitor growth.',
      'Inconsistent moisture management - Roots die back in saturated–cool cycles typical of Hobart spring. Water conservatively. Monitor carefully.'
    ],
    warnings: [
      'Slug and snail damage - Severe in Hobart\'s persistently moist spring conditions. Watch carefully and eliminate quickly, before populations take-off.',
      'Fungal leaf disease - Spreads rapidly in mild, humid weather. Monitor for disease and pests, even in spring.',
      'Wind damage to new growth - Stems snap easily in Hobart\'s strong spring winds. Check for wind damage regularly and protect vulnerable plants.'
    ],
    commonErrors: [
      'Crowded beds - Trap humidity and reduce airflow in Hobart\'s variable spring. Don\'t overcrowd plants and prune gently for airflow.',
      'No staking - Leads to wind rock in exposed positions. Stake young trees in winter, or use temporary windbreaks.',
      'Skipping mulch renewal - Leaves soil unstable and exposed to wind erosion. Apply mulch to protect the soil and plants.'
    ]
  },
  october: {
    mistakes: [
      'Assuming disease pressure has eased - Hobart remains high-risk due to humidity, wind and mild temperatures. Monitor for disease and pests.',
      'Overwatering during cool spells - Roots suffocate in still-cool soils. Check soil moisture regularly before watering. Be concious of Hobart\'s variable spring conditions.',
      'Rapid planting without soil preparation - Compaction limits oxygen in Hobart\'s heavy soils. Don\'t dig, walk-on, or till wet soil.'
    ],
    warnings: [
      'Fungal outbreaks after rain - Fungus spreads explosively in Hobart\'s variable spring conditions.Monitor closely.',
      'Caterpillars - Damage weakened foliage during growth flushes. Monitor for caterpillars and eliminate them quickly.',
      'Cold fronts - Cause sudden stress as Hobart transitions to summer. Monitor forecasts and deploy protection as required.'
    ],
    commonErrors: [
      'Ignoring airflow - Encourages disease in Hobart\'s sheltered spots. Prune for airflow.',
      'Poor spacing - Increases competition and humidity. Space plants appropriately and monitor for disease and pests.',
      'No windbreaks - Exposes plants to Hobart\'s persistent winds. Use temporary windbreaks, or plant in sheltered areas.'
    ]
  },
  november: {
    mistakes: [
      'Dry–wet cycling - Disrupts nutrient transport in Hobart\'s variable late spring. Monitor soil moisture regularly and adjust watering accordingly.',
      'Heavy pruning - Reduces flowering and fruit set before summer. Delay pruning until fruit is set.',
      'Ignoring wind stress - Hobart\'s winds continue even as temperatures rise. Check for wind damage regularly and continue protecting vulnerable plants.'
    ],
    warnings: [
      'Aphid population explosions - Fuelled by soft growth in calm periods. Monitor new growth when you see it and eliminate aphids quickly.',
      'Powdery mildew - Persistent in Hobart\'s mild humidity. Monitor for powdery mildew and eliminate it quickly.',
      'Slow growth misdiagnosed as deficiency - Often wind or light-related in Hobart. Check for wind damage regularly and do not prematurely treat with nutrients.',
    ],
    commonErrors: [
      'Late planting - Shortens establishment window before summer heat. Schedule your planting, even if you need to raise some seedlings in-doors and harden off. ',
      'No shade management - Increases stress during hot spells. Use temporary shade, or plant in sheltered areas. Shade is particularly important in Hobart\'s variable spring conditions.',
      'Irregular irrigation - Weakens plants in Hobart\'s windy conditions. Monitor soil moisture regularly and adjust watering accordingly.'
    ]
  },
  december: {
    mistakes: [
      'Treating summer as dry season - Hobart\'s rainfall and humidity can be variable in summer. Monitor rainfall and humidity regularly.',
      'Removing mulch - Exposes roots to moisture swings and wind exposure. Apply mulch to protect the soil and plants.',
      'Pruning thin-barked species - Leads to sunburn and infection in Hobart\'s variable summer. Prune in winter, or wait until spring.'
    ],
    warnings: [
      'Root rot flare-ups - Following summer rain in poorly drained areas. Know your low spots and check them.',
      'Spider mites during brief dry spells - Often overlooked in Hobart\'s generally humid conditions. Monitor for spider mites and eliminate them quickly.',
      'Wind scorch - Compounds chronic stress from Hobart\'s persistent winds. Check for wind damage regularly and protect vulnerable plants.'
    ],
    commonErrors: [
      'Black containers in sun - Root-zone overheating despite Hobart\'s generally cool air. Place containers in a shady position if possible.',
      'Midday watering - Inefficient and stressful in windy conditions. Water in the morning or afternoon.',
      'Bare soil exposure - Accelerates instability and wind erosion. Apply mulch to protect the soil and plants.'
    ]
  }
}

// Default TAS fallback (use Hobart January as default)
const TAS_NO_NOS: NoNosData = TAS_HOBART_MONTHLY.january

// SYDNEY - Humid subtropical | Storm rainfall | Hot summers | Mild winters | High fungal pressure
const NSW_SYDNEY_MONTHLY: Record<string, NoNosData> = {
  january: {
    mistakes: [
      'Overwatering during heatwaves - Sydney soils often remain wet below the surface after storms. Adding water displaces oxygen and accelerates root rot.',
      'Assuming wilting equals drought - High humidity and heat cause temporary transpiration imbalance, not always soil dryness.',
      'Heavy nitrogen feeding - Encourages soft, disease-prone growth during peak fungal conditions. Feed conservatively and monitor growth.'
    ],
    warnings: [
      'Root hypoxia after summer storms - Plants decline days or weeks after rain, not immediately.',
      'Powdery mildew and leaf spot fungi - Warm nights allow constant spore germination. Monitor closely and act quickly.',
      'Heat scorch on exposed foliage - Especially on western aspects. Provide temporary shade.'
    ],
    commonErrors: [
      'Watering on a fixed summer schedule - Ignores rainfall variability. Monitor rainfall and adjust watering accordingly.',
      'Bare soil exposure - Rapid surface heating damages roots. Ensure mulch is applied to protect the soil and plants.',
      'Overcrowded plantings - Traps humidity and blocks airflow. Plant according to spacing recommendations (at full size) and prune for airflow.'
    ]
  },
  february: {
    mistakes: [
      'Dry–wet cycling from storms and heat. Fine surface roots can be killed and nutrient transport is disrupted. Don\'t "panic" water; and focus on good drainage and consistent mulching.',
      'Pruning at the wrong time - Fungals spores are still abundant in the humidity and wounds don\'t seal quickly in this weather. Prune earlier or delay until winter.',
      'Ignoring drainage in heavy soils - Minor pooling becomes chronic. Check for wetness regularly and drain water away from plants.'
    ],
    warnings: [
      'Crown rot development - Often invisible until sudden collapse. Monitor for crown rot and act quickly.',
      'Aphids on soft regrowth - Spread viruses rapidly. Monitor for aphids and eliminate them quickly.',
      'Leaf yellowing misdiagnosed as deficiency - Often oxygen stress at this time of year. Monitor for leaf yellowing and act quickly.'
    ],
    commonErrors: [
      'Adding fertiliser to fix yellowing - Worsens salt stress. Don\'t fertilise during this time of year (unless sure it is the right intervention).',
      'Mulching directly against stems - Encourages rot. Don\'t mulch directly against stems; apply mulch evenly and sufficiently around the root zone (but not against the stem).',
      'Watering in the evening - Extends leaf wetness overnight. Water in the morning before temperature drops.'
    ]
  },
  march: {
    mistakes: [
      'Stopping airflow management - Humidity remains suprisingly high and disease/pests creep-up unexepectedly. Continue to prune (gently) for airflow and plant according to spacing recommendations (at full size).',
        'Leaving summer-diseased foliage - Overwinters fungal spores. Remove and dispose of diseased foliage promptly.',
        'Planting without planning for the months ahead - drainage needs will be higher and cold damage is a risk. Plant early enough to estbalish root resilience and ensure proper drainage.'
    ],
    warnings: [
'Condensation-driven leaf wetness - Cool nights cause moisture to sit on leaves even without rain, allowing fungal spores to germinate unnoticed. Improve airflow and avoid evening watering. Ensure proper drainage and mulching.',
  'Slug and snail population spikes - Persistent moisture creates ideal breeding conditions and rapid damage escalation. Monitor regularly and intervene early.',
  'Hidden root decline masked by green foliage - Roots are failing in saturated or compacted soil while top growth remains green. Check soil oxygen and drainage rather than feeding.'
    ],
    commonErrors: [
      'Bare autumn beds - Exposed soil compacts easily and sheds water, worsening root oxygen stress. Keep soil covered with mulch or living cover.',
  'Late planting without drainage correction - Roots do not establish before winter wet sets in. Fix drainage or delay planting.',
      'Ignoring soil structure - Compacted soils block oxygen and water movement. Improve structure before seasonal stress increases.'
    ]
  },
  april: {
    mistakes: [
      'Overwatering cooling soils - Root metabolism slows sharply and oxygen demand cannot be met in wet soil. Reduce watering frequency and always check soil moisture.',
      'Heavy pruning - Removes stored carbohydrates needed for winter survival and recovery. Delay major pruning until dormancy.',
      'Ignoring shaded, slow-drying areas - These zones stay wet far longer and become disease centres. Adjust plant placement or improve drainage.'
    ],
    warnings: [
      'Autumn fungal resurgence - Mild days and cool nights reactivate disease cycles. Increase monitoring rather than relaxing care.',
      'Waterlogging after rain events - Cooler soils drain slowly and remain anaerobic. Identify and manage low spots early.',
      'Rodent shelter damage - Mulch and dense cover attract nesting and chewing. Reduce shelter near trunks and crowns.'
    ],
    commonErrors: [
      'Working wet soil - Permanently collapses soil structure and reduces oxygen availability. Wait until soil is crumbly, not sticky.',
      'Late-day watering - Extends leaf wetness overnight and increases disease risk. Water early in the day only if needed.',
      'Insufficient mulch insulation - Leaves roots exposed to temperature swings and moisture stress. Maintain consistent mulch depth.'
    ]
  },
  may: {
    mistakes: [
      'Assuming dormancy has begun - Roots remain active and still require oxygen. Avoid waterlogging and compaction.',
      'Pruning frost-sensitive species - New growth is damaged or killed by cold snaps. Delay pruning until full dormancy.',
      'Ignoring surface drainage - Small pools become chronic saturation zones. Redirect water away from root areas.'
    ],
    warnings: [
      'Persistent soil saturation - Leads to slow, irreversible root decline. Monitor moisture even when growth slows.',
      'Moss and algae growth - Indicates long-term oxygen deprivation in soil. Treat as a drainage warning, not cosmetic.',
      'Lawn fungal disease - Cool, damp conditions favour spread. Reduce nitrogen and improve airflow.'
    ],
    commonErrors: [
      'Fixed irrigation routines - Rainfall and evaporation have changed. Adjust watering to actual conditions.',
      'Thin mulch layers - Insufficient to buffer cold and moisture swings. Top up mulch before winter sets in.',
      'Poor airflow at crowns - Encourages stem and crown rot. Thin congested growth carefully.'
    ]
  },
  june: {
    mistakes: [
      'Compacting wet soils - Crushes remaining air spaces and suffocates roots. Avoid foot traffic and digging.',
      'Fertilising dormant plants - Nutrients accumulate as salts and damage inactive roots. Pause feeding.',
      'Overwatering containers - Pots stay cold and wet for long periods. Allow drying between watering.'
    ],
    warnings: [
      'Chronic root hypoxia - Decline is slow and often misdiagnosed. Check soil, not foliage.',
      'Algae on soil surface - Clear sign of prolonged saturation. Improve drainage immediately.',
      'Cold root damage - Roots are injured without visible symptoms until spring. Protect pots and raised beds.'
    ],
    commonErrors: [
      'Leaving pots on cold ground - Increases chilling and rot. Elevate containers.',
      'Ignoring winter sun angles - Reduced light slows drying and warming. Reposition plants if possible.',
      'Poor pruning hygiene - Wet conditions spread pathogens easily. Clean tools between plants.'
    ]
  },
  july: {
    mistakes: [
      'Early pruning - In cold, wet soils, wounds do not seal and vascular tissue remains exposed for weeks, allowing fungal pathogens to enter and travel downward into stems. Delay pruning until full dormancy or dry weather.',
      'Leaving soil bare - Exposed winter soil saturates faster, loses structure, and chills more deeply, slowing root function and oxygen recovery. Keep soil covered with mulch or groundcover.',
      'Ignoring wind desiccation - Cold winds strip moisture from foliage while cold, wet roots cannot replace it, causing stress that mimics drought. Provide wind protection rather than extra water.'
    ],
    warnings: [
      'Stem and crown rot - Prolonged saturation combined with low metabolic activity allows rot to advance unnoticed until collapse occurs. Inspect plant bases regularly.',
      'Wind rock in wet soils - Loosened root balls break newly forming roots and prevent stabilisation. Stake vulnerable plants temporarily.',
      'Rodent damage - Reduced food sources drive gnawing on bark and roots hidden under mulch. Reduce shelter and protect trunks.'
    ],
    commonErrors: [
      'Over-mulching crowns - Traps moisture directly against stems and accelerates rot. Pull mulch back from plant bases.',
      'Unstaked young trees - Movement in saturated soil worsens root damage. Use flexible staking where exposure is high.',
      'No wind protection - Unnecessary exposure compounds cold and moisture stress. Install temporary windbreaks.'
    ]
  },
  august: {
    mistakes: [
      'Stimulating early growth - Fertiliser or heavy pruning pushes soft tissue before roots are active enough to support it, wasting stored energy and increasing disease risk. Delay stimulation.',
      'Removing protection too soon - Soil temperatures lag behind air temperatures, leaving roots cold and inactive while shoots are exposed. Keep protection until consistent warming.',
      'Planting into cold, wet soil - Roots fail to grow, then rot, before establishment begins. Wait for soil warmth or use raised beds.'
    ],
    warnings: [
      'Late fungal surges - Warming days combined with cold nights create prolonged leaf wetness without rain. Increase disease monitoring.',
      'Aphids on early shoots - Soft, nitrogen-rich tissue attracts pests before predators are active. Inspect new growth closely.',
      'Wind stress on new growth - Rapidly expanding tissue tears easily under spring winds. Shelter young plants.'
    ],
    commonErrors: [
      'No hardening-off - Sudden exposure overwhelms tissue that developed under protection. Gradually increase exposure.',
      'Overwatering - Cold soils still drain slowly, compounding oxygen stress. Water only when soil actually dries.',
      'Ignoring weeds - Weeds trap moisture and compete for warming soil, slowing plant recovery.'
    ]
  },
  september: {
    mistakes: [
      'Overfeeding nitrogen - Rapid leaf growth outpaces root development, producing weak, disease-prone tissue. Feed lightly and assess response.',
      'Planting without drainage prep - Spring rain saturates soil before roots establish, leading to early root failure. Correct drainage first.',
      'Inconsistent watering - Alternating wet and dry cycles kill fine roots during active growth. Maintain steady moisture.'
    ],
    warnings: [
      'Slug and snail damage - Moist soils and mild temperatures allow rapid population growth and overnight damage. Monitor daily.',
      'Rapid fungal spread - Warm days and cool nights extend leaf wetness periods. Improve airflow immediately.',
      'Wind damage - New growth lacks structural strength and snaps easily. Stake or shelter as needed.'
    ],
    commonErrors: [
      'Crowded beds - Dense planting traps humidity and increases disease pressure. Space for airflow.',
      'Skipping mulch renewal - Exposed soil destabilises moisture and temperature. Refresh mulch.',
      'No staking - Root systems loosen before anchoring. Support plants early.'
    ]
  },
  october: {
    mistakes: [
      'Assuming disease pressure has eased - Humidity and temperature swings still favour pathogens. Maintain vigilance.',
      'Overwatering during cool spells - Roots suffocate as transpiration slows. Always check soil moisture.',
      'Rapid planting without soil prep - Compacted soils restrict oxygen just as root demand peaks. Prepare beds thoroughly.'
    ],
    warnings: [
      'Fungal outbreaks after rain - Warm, humid conditions allow explosive spread within days. Act at first signs.',
      'Caterpillars - Rapid feeding damages new foliage before recovery can occur. Inspect regularly.',
      'Cold fronts - Sudden temperature drops shock actively growing plants. Protect vulnerable species.'
    ],
    commonErrors: [
      'Ignoring airflow - Still air traps humidity and fuels disease. Thin congested growth.',
      'Poor spacing - Increases competition and stress. Respect mature plant size.',
      'No windbreaks - Exposes plants unnecessarily during growth flushes.'
    ]
  },
  november: {
    mistakes: [
      'Dry–wet cycling - Rapid evaporation followed by heavy watering disrupts nutrient transport and flowering. Stabilise soil moisture.',
      'Heavy pruning - Removes photosynthetic capacity just before peak growth and yield. Delay major cuts.',
      'Ignoring rising UV - Sunburn occurs faster than expected as angles shift. Provide shade where needed.'
    ],
    warnings: [
      'Aphid explosions - Warm conditions and soft growth allow populations to double rapidly. Monitor early.',
      'Powdery mildew - Mild humidity sustains infection even in bright weather. Increase airflow.',
      'Slow growth misdiagnosed as deficiency - Often caused by root stress or light imbalance. Diagnose before feeding.'
    ],
    commonErrors: [
      'Late planting - Reduces establishment time before summer stress. Plant early.',
      'No shade planning - Sudden heat spikes overwhelm unprotected plants.',
      'Irregular irrigation - Weakens root systems and increases stress sensitivity.'
    ]
  },
  december: {
    mistakes: [
      'Treating summer as dry - Storm rainfall keeps soils saturated below the surface. Adjust watering to root-zone conditions.',
      'Removing mulch - Exposes roots to heat spikes and moisture swings. Maintain protective cover.',
      'Pruning thin-barked species - Exposed tissue sunburns and becomes infected. Delay pruning.'
    ],
    warnings: [
      'Root rot flare-ups - Warm, wet soils reactivate pathogens rapidly. Monitor drainage closely.',
      'Spider mites during dry spells - Hot, dry intervals favour rapid population growth. Check leaf undersides.',
      'Heat scorch - Sudden heat events damage tissue faster than plants can adapt. Use temporary shade.'
    ],
    commonErrors: [
      'Black containers in sun - Root zones overheat even when air feels mild. Shade or insulate pots.',
      'Midday watering - Inefficient and increases stress. Water early or late.',
      'Bare soil exposure - Accelerates moisture loss and temperature extremes.'
    ]
  }
}

// NEWCASTLE - Coastal | High humidity | Wind exposure | Storm rainfall | Salt stress
const NSW_NEWCASTLE_MONTHLY: Record<string, NoNosData> = {
  january: {
    mistakes: [
      'Overwatering wind-stressed plants - Wind-driven transpiration mimics drought.',
      'Ignoring salt spray accumulation.',
      'High nitrogen feeding.'
    ],
    warnings: [
      'Root suffocation after coastal storms.',
      'Leaf burn from salt deposition.',
      'Powdery mildew in humid calms.'
    ],
    commonErrors: [
      'Watering by appearance.',
      'Bare sandy soils.',
      'No wind buffering.'
    ]
  },
  february: {
    mistakes: [
      'Dry–wet cycling.',
      'Late pruning.',
      'Ignoring drainage channels.'
    ],
    warnings: [
      'Fungal leaf disease.',
      'Aphids on soft growth.',
      'Hidden root decline.'
    ],
    commonErrors: [
      'Fixed irrigation.',
      'Heavy mulch against stems.',
      'Delayed disease removal.'
    ]
  },
  march: {
    mistakes: [
      'Stopping airflow management.',
      'Leaving diseased foliage.',
      'Planting without wind protection.'
    ],
    warnings: [
      'Condensation-driven infection.',
      'Slug and snail surges.',
      'Salt stress compounding root damage.'
    ],
    commonErrors: [
      'Bare beds.',
      'Late planting.',
      'Ignoring soil structure.'
    ]
  },
  april: {
    mistakes: [
      'Overwatering cooling soils.',
      'Heavy pruning.',
      'Ignoring low-lying wet zones.'
    ],
    warnings: [
      'Waterlogging.',
      'Autumn fungal outbreaks.',
      'Rodent activity.'
    ],
    commonErrors: [
      'Working wet soil.',
      'Late watering.',
      'No mulch insulation.'
    ]
  },
  may: {
    mistakes: [
      'Assuming dormancy has begun - Roots remain active.',
      'Pruning frost-sensitive species.',
      'Ignoring surface drainage and salt accumulation.'
    ],
    warnings: [
      'Persistent soil saturation.',
      'Moss and algae growth.',
      'Lawn fungal disease.',
      'Wind-driven salt deposition.'
    ],
    commonErrors: [
      'Fixed irrigation routines.',
      'Thin mulch layers.',
      'Poor airflow at crowns.',
      'No wind protection.'
    ]
  },
  june: {
    mistakes: [
      'Compacting wet soils.',
      'Fertilising dormant plants.',
      'Overwatering containers.',
      'Ignoring salt buildup in containers.'
    ],
    warnings: [
      'Chronic root hypoxia.',
      'Algae on soil surface.',
      'Cold root damage.',
      'Salt stress from winter winds.'
    ],
    commonErrors: [
      'Leaving pots on cold ground.',
      'Ignoring winter sun angles.',
      'Poor pruning hygiene.',
      'No windbreaks.'
    ]
  },
  july: {
    mistakes: [
      'Early pruning.',
      'Leaving soil bare.',
      'Ignoring wind desiccation and salt exposure.'
    ],
    warnings: [
      'Stem and crown rot.',
      'Wind rock in wet soils.',
      'Rodent damage.',
      'Salt burn on exposed foliage.'
    ],
    commonErrors: [
      'Over-mulching crowns.',
      'Unstaked young trees.',
      'No wind protection.',
      'Ignoring salt spray damage.'
    ]
  },
  august: {
    mistakes: [
      'Stimulating early growth.',
      'Removing protection too soon.',
      'Planting into cold, wet soil without wind shelter.'
    ],
    warnings: [
      'Late fungal surges.',
      'Aphids on early shoots.',
      'Wind stress on new growth.',
      'Salt damage on tender foliage.'
    ],
    commonErrors: [
      'No hardening-off.',
      'Overwatering.',
      'Ignoring weeds.',
      'No windbreaks for new plantings.'
    ]
  },
  september: {
    mistakes: [
      'Overfeeding nitrogen.',
      'Planting without drainage prep.',
      'Inconsistent watering.',
      'Ignoring wind exposure.'
    ],
    warnings: [
      'Slug and snail damage.',
      'Rapid fungal spread.',
      'Wind damage.',
      'Salt stress on new growth.'
    ],
    commonErrors: [
      'Crowded beds.',
      'Skipping mulch renewal.',
      'No staking.',
      'No wind protection.'
    ]
  },
  october: {
    mistakes: [
      'Assuming disease pressure has eased.',
      'Overwatering during cool spells.',
      'Rapid planting without soil prep.',
      'Planting without wind protection.'
    ],
    warnings: [
      'Fungal outbreaks after rain.',
      'Caterpillars.',
      'Cold fronts.',
      'Wind-driven salt damage.'
    ],
    commonErrors: [
      'Ignoring airflow.',
      'Poor spacing.',
      'No windbreaks.',
      'Bare soil exposure to salt spray.'
    ]
  },
  november: {
    mistakes: [
      'Dry–wet cycling.',
      'Heavy pruning.',
      'Ignoring rising UV.',
      'Ignoring salt accumulation.'
    ],
    warnings: [
      'Aphid explosions.',
      'Powdery mildew.',
      'Slow growth misdiagnosed.',
      'Salt burn from coastal winds.'
    ],
    commonErrors: [
      'Late planting.',
      'No shade planning.',
      'Irregular irrigation.',
      'No wind buffering.'
    ]
  },
  december: {
    mistakes: [
      'Treating summer as dry.',
      'Removing mulch.',
      'Pruning thin-barked species.',
      'Ignoring salt spray during storms.'
    ],
    warnings: [
      'Root rot flare-ups.',
      'Spider mites during dry spells.',
      'Heat scorch.',
      'Salt burn from storm winds.'
    ],
    commonErrors: [
      'Black containers in sun.',
      'Midday watering.',
      'Bare soil exposure.',
      'No wind protection.'
    ]
  }
}

// WOLLONGONG - Escarpment zone | High rainfall | Shaded slopes | Persistent humidity
const NSW_WOLLONGONG_MONTHLY: Record<string, NoNosData> = {
  january: {
    mistakes: [
      'Overwatering despite frequent rain.',
      'Ignoring shade-driven slow drying.',
      'High nitrogen feeding.'
    ],
    warnings: [
      'Chronic root hypoxia.',
      'Fungal leaf disease.',
      'Heat stress in still, humid air.'
    ],
    commonErrors: [
      'Bare soil on slopes.',
      'Poor airflow.',
      'Overcrowding.'
    ]
  },
  february: {
    mistakes: [
      'Inconsistent moisture management - Alternating saturation and partial drying kills remaining fine roots.',
      'Late pruning to "tidy" plants - Creates fresh wounds during peak fungal activity.',
      'Ignoring drainage on slopes - Runoff causes erosion while low areas remain saturated.'
    ],
    warnings: [
      'Crown rot development - Often unnoticed until plants collapse.',
      'Aphids on soft growth - Thrive in sheltered, humid microclimates.',
      'Leaf yellowing unrelated to nutrients - Often misdiagnosed as deficiency.'
    ],
    commonErrors: [
      'Applying fertiliser to fix yellowing - Worsens salt stress in wet soils.',
      'Mulching directly against stems - Promotes rot.',
      'Watering on a schedule - Ignores actual soil moisture and shade conditions.'
    ]
  },
  march: {
    mistakes: [
      'Leaving diseased summer growth - Provides an overwintering reservoir for fungi.',
      'Planting without raised beds or slope terracing - Roots fail before winter begins.',
      'Assuming cooler weather reduces disease risk - Escarpment humidity keeps pressure high.'
    ],
    warnings: [
      'Leaf wetness overnight - Condensation fuels infection even without rain.',
      'Slug and snail population surges - High moisture favours rapid reproduction.',
      'Root decline masked by green foliage - Common in shaded, humid conditions.'
    ],
    commonErrors: [
      'Bare autumn soil on slopes - Leads to compaction and erosion.',
      'Late planting without drainage correction - Guarantees winter losses.',
      'Ignoring soil structure - Prevents oxygen movement.'
    ]
  },
  april: {
    mistakes: [
      'Overwatering as temperatures drop - Root metabolism slows; oxygen deprivation accelerates.',
      'Heavy pruning - Reduces stored energy and exposes tissue.',
      'Ignoring low-light conditions on shaded slopes - Plants cannot compensate for stress.'
    ],
    warnings: [
      'Rapid crown rot onset - Often fatal once visible.',
      'Waterlogging after autumn rain - Severe in clay soils and low-lying areas.',
      'Rodent damage - Increased shelter-seeking behaviour.'
    ],
    commonErrors: [
      'Working wet soil - Permanently destroys structure.',
      'Late-day watering - Extends leaf wetness overnight.',
      'No mulch insulation - Leaves roots vulnerable.'
    ]
  },
  may: {
    mistakes: [
      'Assuming dormancy means safety - Roots still require oxygen; saturation is lethal.',
      'Pruning frost-sensitive species - New growth rots or freezes.',
      'Ignoring surface drainage - Pooling water becomes chronic on slopes.'
    ],
    warnings: [
      'Persistent soil saturation - Leads to long-term decline rather than sudden death.',
      'Moss and algae growth - Clear indicators of oxygen-free soil.',
      'Lawn fungal disease - Common in wet conditions.'
    ],
    commonErrors: [
      'Fixed irrigation routines - Ignore rainfall entirely.',
      'Thin mulch layers - Insufficient to regulate moisture.',
      'Poor airflow around crowns - Encourages stem rot.'
    ]
  },
  june: {
    mistakes: [
      'Compacting saturated soils - Eliminates remaining air spaces permanently.',
      'Fertilising dormant plants - Salts accumulate and burn roots.',
      'Overwatering containers - Pots stay cold and wet for extended periods.'
    ],
    warnings: [
      'Chronic root hypoxia - Symptoms appear slowly and are often misdiagnosed.',
      'Algae on soil surface - Indicates severe oxygen deprivation.',
      'Cold damage to roots - Invisible until spring failure.'
    ],
    commonErrors: [
      'Leaving pots on cold ground - Accelerates chilling and rot.',
      'Ignoring winter sun angles - Reduced light on shaded slopes.',
      'Poor hygiene during pruning - Spreads fungal pathogens.'
    ]
  },
  july: {
    mistakes: [
      'Early pruning - Wounds fail to heal in cold, wet conditions.',
      'Leaving soil bare on slopes - Increases saturation and erosion.',
      'Ignoring persistent humidity - Even in winter, moisture remains high.'
    ],
    warnings: [
      'Stem and crown rot - Often fatal once established.',
      'Soil erosion on slopes - Wet conditions worsen runoff.',
      'Rodent damage - Bark and root chewing increases.'
    ],
    commonErrors: [
      'Over-mulching crowns - Traps moisture against stems.',
      'Unstaked young trees - Root damage worsens decline.',
      'No erosion control on slopes - Exposes plants unnecessarily.'
    ]
  },
  august: {
    mistakes: [
      'Stimulating early growth - New tissue is extremely disease-prone.',
      'Removing protection too soon - Late cold snaps and rain persist.',
      'Planting into wet, cold soil - Roots rot before establishment.'
    ],
    warnings: [
      'Late fungal surges - Driven by humidity and warming days.',
      'Aphids on early shoots - Spread disease rapidly.',
      'Slow growth in shaded areas - Often misdiagnosed.'
    ],
    commonErrors: [
      'No hardening-off - Sudden exposure weakens plants.',
      'Overwatering - Compounds oxygen stress.',
      'Ignoring weeds - Increases humidity near soil.'
    ]
  },
  september: {
    mistakes: [
      'Planting tender species without raised beds - Roots suffocate during spring rain.',
      'Overfeeding nitrogen - Soft growth fuels disease.',
      'Inconsistent moisture management - Roots die back in saturated–cool cycles.'
    ],
    warnings: [
      'Slug and snail damage - Severe in persistently moist conditions.',
      'Fungal leaf disease - Spreads rapidly.',
      'Erosion on slopes during spring rains.'
    ],
    commonErrors: [
      'Crowded beds - Trap humidity.',
      'No staking - Leads to instability on slopes.',
      'Skipping mulch renewal - Leaves soil unstable.'
    ]
  },
  october: {
    mistakes: [
      'Assuming disease pressure has eased - Escarpment humidity remains high.',
      'Overwatering during cool spells - Roots suffocate.',
      'Rapid planting without soil preparation - Compaction limits oxygen.'
    ],
    warnings: [
      'Fungal outbreaks after rain - Spread explosively.',
      'Caterpillars - Damage weakened foliage.',
      'Cold fronts - Cause sudden stress.'
    ],
    commonErrors: [
      'Ignoring airflow - Encourages disease.',
      'Poor spacing - Increases competition and humidity.',
      'No erosion control - Exposes plants on slopes.'
    ]
  },
  november: {
    mistakes: [
      'Dry–wet cycling - Disrupts nutrient transport.',
      'Heavy pruning - Reduces flowering and fruit set.',
      'Ignoring shade conditions - Limits plant recovery.'
    ],
    warnings: [
      'Aphid population explosions - Fuelled by soft growth.',
      'Powdery mildew - Persistent in mild humidity.',
      'Slow growth misdiagnosed as deficiency - Often light-related in shaded areas.'
    ],
    commonErrors: [
      'Late planting - Shortens establishment window.',
      'No shade management - Increases stress during rare heat.',
      'Irregular irrigation - Weakens plants further.'
    ]
  },
  december: {
    mistakes: [
      'Treating summer as dry season - Rainfall and humidity remain high.',
      'Removing mulch - Exposes roots to moisture swings.',
      'Pruning thin-barked species - Leads to sunburn and infection.'
    ],
    warnings: [
      'Root rot flare-ups - Following summer rain.',
      'Spider mites during brief dry spells - Often overlooked.',
      'Heat stress in still, humid air.'
    ],
    commonErrors: [
      'Black containers in sun - Root-zone overheating despite cool air.',
      'Midday watering - Inefficient and stressful.',
      'Bare soil exposure on slopes - Accelerates erosion.'
    ]
  }
}

// NSW - Temperate
const NSW_NO_NOS: NoNosData = {
  mistakes: [
    'Over- or under-watering relative to heat and humidity causes root stress, nutrient transport failure, and leaf scorch. Inconsistent irrigation leads to shallow rooting and collapse during heatwaves.',
    'Excess nitrogen during stress periods forces soft growth that increases transpiration demand, invites pests, and reduces structural resilience.',
    'Poor timing of pruning exposes tissues to sunburn, fungal entry, or frost damage depending on season.'
  ],
  warnings: [
    'Heatwaves',
    'Humidity-driven fungal disease',
    'Sap-sucking pests (aphids, mites)',
    'Storm damage',
    'Seasonal rainfall variability'
  ],
  commonErrors: [
    'Midday watering',
    'Bare soil without mulch',
    'Overcrowding plants reducing airflow',
    'Ignoring drainage in containers and beds',
    'Failing to adjust care to seasonal transitions'
  ]
}

// VIC - Cool Temperate (similar to TAS but with heatwave considerations)
const VIC_NO_NOS: NoNosData = {
  mistakes: [
    'Mismanaging watering during sudden heatwaves or cold snaps leads to root stress, cellular damage, and poor nutrient uptake. Shallow watering promotes weak root systems.',
    'Applying high nitrogen when growth is limited by temperature produces soft tissue that is vulnerable to frost, wind damage, and fungal disease.',
    'Incorrect pruning timing exposes plants to frost injury in winter or sunburn in summer.'
  ],
  warnings: [
    'Heatwaves',
    'Late frosts',
    'Fungal diseases',
    'Aphids',
    'Slugs/snails',
    'Strong seasonal winds'
  ],
  commonErrors: [
    'Assuming stable seasons',
    'Skipping mulch',
    'Working wet clay soils',
    'Overcrowding plants',
    'Failing to adjust irrigation through rapid weather shifts'
  ]
}

// QLD - Subtropical/Tropical
const QLD_NO_NOS: NoNosData = {
  mistakes: [
    'Overwatering in heavy rain periods causes root oxygen deprivation and rot, while underwatering during heat spikes leads to rapid transpiration collapse. Inconsistent moisture causes nutrient uptake failure.',
    'Applying fertiliser during intense rainfall leads to leaching and weak growth. Heavy nitrogen encourages soft tissue highly susceptible to pests and fungal disease.',
    'Poor pruning timing removes canopy protection and increases sunburn and disease entry.'
  ],
  warnings: [
    'Fungal diseases',
    'Root rot',
    'Aphids',
    'Mites',
    'Caterpillars',
    'Heatwaves',
    'Storms',
    'High humidity stress'
  ],
  commonErrors: [
    'Watering on a fixed schedule',
    'Bare soil without mulch',
    'Poor drainage',
    'Overcrowding plants',
    'Ignoring wet/dry season transitions'
  ]
}

// WA - Mediterranean
const WA_NO_NOS: NoNosData = {
  mistakes: [
    'Treating sandy soils as if they retain moisture leads to chronic drought stress. Shallow watering dries rapidly, while excessive fertiliser concentrates salts and burns roots.',
    'Ignoring hot easterly winds causes rapid transpiration collapse even when soil appears moist.',
    'Poor pruning timing exposes plants to sunburn in summer or rot in winter.'
  ],
  warnings: [
    'Heatwaves',
    'Drying winds',
    'Iron chlorosis',
    'Spider mites',
    'Waterlogging during winter rains'
  ],
  commonErrors: [
    'Midday watering',
    'Bare sand without organic matter',
    'Inadequate mulch depth',
    'Poor container insulation',
    'Fixed irrigation schedules'
  ]
}

// SA - Mediterranean (similar to WA but with different soil considerations)
const SA_NO_NOS: NoNosData = {
  mistakes: [
    'Underestimating heat and wind leads to transpiration exceeding root uptake. Overwatering cooling soils causes root hypoxia and rot.',
    'Excess nitrogen in alkaline soils worsens micronutrient lock-up and stress susceptibility.',
    'Incorrect pruning timing exposes plants to sunburn in summer or frost damage in winter.'
  ],
  warnings: [
    'Heatwaves',
    'Hot northerlies',
    'Iron chlorosis',
    'Fungal disease in winter',
    'Slugs/snails'
  ],
  commonErrors: [
    'Bare soil',
    'Shallow watering',
    'Fixed irrigation schedules',
    'Poor drainage in clay soils',
    'Ignoring trace element needs'
  ]
}

// NT - Tropical
const NT_NO_NOS: NoNosData = {
  mistakes: [
    'Treating heavy Wet-season rainfall as beneficial causes root oxygen deprivation and rot. During the Dry, under-watering leads to rapid transpiration collapse in extreme heat.',
    'Fertilising during intense rain leads to nutrient leaching and weak growth. Heavy nitrogen increases disease susceptibility.',
    'Poor pruning timing increases fungal infection in humidity or sunburn in arid heat.'
  ],
  warnings: [
    'Monsoonal flooding',
    'Fungal disease',
    'Mites',
    'Aphids',
    'Extreme heat',
    'Dry-season winds'
  ],
  commonErrors: [
    'Flat garden beds without drainage',
    'Watering on fixed schedules',
    'Bare soil exposure',
    'Ignoring wet/dry season transitions'
  ]
}

// ACT - Cool Temperate (similar to TAS/VIC)
const ACT_NO_NOS: NoNosData = {
  mistakes: [
    'Mismanaging watering during heatwaves or cold periods causes root stress and nutrient transport failure. Shallow watering leads to weak root systems prone to collapse.',
    'Applying nitrogen when growth is limited by temperature produces soft tissue vulnerable to frost and disease.',
    'Incorrect pruning timing exposes plants to frost damage or sunburn.'
  ],
  warnings: [
    'Frosts',
    'Heatwaves',
    'Aphids',
    'Fungal disease',
    'Wind exposure',
    'Rapid temperature swings'
  ],
  commonErrors: [
    'Bare soil without mulch',
    'Working wet clay soils',
    'Fixed irrigation schedules',
    'Ignoring frost protection'
  ]
}

// Build a per-month map using the same content for all months (documents repeat per month)
const buildMonthlyMap = (noNos: NoNosData) => {
  const map: Record<string, NoNosData> = {}
  MONTHS_LOWER.forEach((m) => {
    map[m] = noNos
  })
  return map
}

// State to No-Nos mapping
const STATE_NO_NOS: Record<StateCode, NoNosData> = {
  'TAS': TAS_NO_NOS,
  'NSW': NSW_NO_NOS,
  'VIC': VIC_NO_NOS,
  'QLD': QLD_NO_NOS,
  'WA': WA_NO_NOS,
  'SA': SA_NO_NOS,
  'NT': NT_NO_NOS,
  'ACT': ACT_NO_NOS
}

// TAS city-specific monthly mapping
const TAS_CITY_MONTHLY_DATA: Record<string, Record<string, NoNosData>> = {
  'hobart': TAS_HOBART_MONTHLY,
  'launceston': TAS_LAUNCESTON_MONTHLY,
  'devonport': TAS_DEVONPORT_MONTHLY,
  'burnie': TAS_BURNIE_MONTHLY
}

// NSW city-specific monthly mapping
const NSW_CITY_MONTHLY_DATA: Record<string, Record<string, NoNosData>> = {
  'sydney': NSW_SYDNEY_MONTHLY,
  'newcastle': NSW_NEWCASTLE_MONTHLY,
  'wollongong': NSW_WOLLONGONG_MONTHLY
}

// Build per-city/month maps using document content
const buildCityMonthlyMap = (state: StateCode, noNos: NoNosData) => {
  const stateCities = CITIES[state] || []
  const cityMap: Record<string, Record<string, NoNosData>> = {}
  stateCities.forEach((city) => {
    const cityKey = normalizeCity(city)
    // For TAS and NSW, use city-specific monthly data; for others, use state default for all months
    if (state === 'TAS' && TAS_CITY_MONTHLY_DATA[cityKey]) {
      cityMap[cityKey] = TAS_CITY_MONTHLY_DATA[cityKey]
    } else if (state === 'NSW' && NSW_CITY_MONTHLY_DATA[cityKey]) {
      cityMap[cityKey] = NSW_CITY_MONTHLY_DATA[cityKey]
    } else {
      cityMap[cityKey] = buildMonthlyMap(noNos)
    }
  })
  return cityMap
}

const STATE_CITY_MONTHLY: Record<StateCode, Record<string, Record<string, NoNosData>>> = {
  'TAS': buildCityMonthlyMap('TAS', TAS_NO_NOS),
  'NSW': buildCityMonthlyMap('NSW', NSW_NO_NOS),
  'VIC': buildCityMonthlyMap('VIC', VIC_NO_NOS),
  'QLD': buildCityMonthlyMap('QLD', QLD_NO_NOS),
  'WA': buildCityMonthlyMap('WA', WA_NO_NOS),
  'SA': buildCityMonthlyMap('SA', SA_NO_NOS),
  'NT': buildCityMonthlyMap('NT', NT_NO_NOS),
  'ACT': buildCityMonthlyMap('ACT', ACT_NO_NOS)
}

/**
 * Get location-specific No-Nos data for a given state and month
 * @param state - State code (TAS, VIC, NSW, etc.)
 * @param city - City name (optional, currently all cities in a state share the same data)
 * @param month - Month name (lowercase, e.g., 'january')
 * @returns NoNosData or null if not found
 */
export function getLocationNoNos(
  state: string,
  city?: string,
  month?: string
): NoNosData | null {
  const normalizedState = state.toUpperCase() as StateCode
  const normalizedCity = city ? normalizeCity(city) : ''
  const normalizedMonth = month ? normalizeMonth(month) : ''

  // If we have city/month specific data from the document set, use it
  const cityMap = STATE_CITY_MONTHLY[normalizedState]
  if (cityMap) {
    const cityData = cityMap[normalizedCity] || cityMap[Object.keys(cityMap)[0]]
    if (cityData) {
      if (normalizedMonth && cityData[normalizedMonth]) {
        return cityData[normalizedMonth]
      }
      // If no month specified, return a representative month (January)
      return cityData['january'] || STATE_NO_NOS[normalizedState]
    }
  }

  // Fallback to state-level data
  if (STATE_NO_NOS[normalizedState]) {
    return STATE_NO_NOS[normalizedState]
  }

  // Final fallback
  return TAS_NO_NOS
}
