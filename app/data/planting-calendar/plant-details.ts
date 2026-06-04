import type { PlantDetails } from '@/app/types/plants'

/** Plant detail copy for calendar modals and search. */

export const CALENDAR_PLANT_DETAILS: { [key: string]: PlantDetails } = {
  'Tomatoes': {
    name: 'Tomatoes',
    growingInfo: 'Warm season crop that needs full sun and rich, well-drained soil.',
    plantingTime: 'Plant after all danger of frost has passed. Start seeds indoors 6-8 weeks before last frost.',
    careInstructions: [
      'Provide strong support for climbing',
      'Remove side shoots regularly',
      'Water deeply and consistently',
      'Feed every 2-3 weeks once flowering'
    ],
    seedSpacing: '45-60cm',
    rowSpacing: '90-120cm',
    matureHeight: '1.5-2m',
    timeToHarvest: '60-80 days',
    frostTolerant: false,
    soil: 'Rich, well-drained soil with added compost',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun',
    description: 'Popular summer crop with variety of sizes and flavors',
    commonIssues: [
      {
        name: 'Blight',
        symptoms: 'Brown spots on leaves spreading quickly',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'Blossom end rot',
        symptoms: 'Dark patches on bottom of fruits',
        solution: 'Maintain consistent watering and calcium levels'
      },
      {
        name: 'Caterpillars',
        symptoms: 'Holes in leaves and damaged fruit',
        solution: 'Use organic pest control, handpick caterpillars'
      }
    ],
    maintenance: 'high',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare rich soil',
          'Install support structure',
          'Plant deeply'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove side shoots',
          'Tie to supports',
          'Feed regularly'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pick when fully colored',
          'Check daily',
          'Remove any diseased fruit'
        ]
      }
    ]
  },
  'Lettuce': {
    name: 'Lettuce',
    growingInfo: 'Fast-growing leafy vegetable that prefers cool weather.',
    plantingTime: 'Spring and autumn. Can be grown year-round in cool climates.',
    careInstructions: [
      'Keep soil consistently moist',
      'Thin seedlings to proper spacing',
      'Protect from extreme heat',
      'Harvest outer leaves as needed'
    ],
    seedSpacing: '15-20cm',
    rowSpacing: '30-45cm',
    matureHeight: '20-30cm',
    timeToHarvest: '45-65 days',
    frostTolerant: true,
    soil: 'Rich, well-drained soil',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to part shade',
    description: 'Easy to grow leafy vegetable with many varieties',
    commonIssues: [
      {
        name: 'Bolting',
        symptoms: 'Premature flowering in hot weather',
        solution: 'Plant in cooler seasons, provide shade'
      },
      {
        name: 'Slugs and snails',
        symptoms: 'Holes in leaves, especially on young plants',
        solution: 'Use organic slug control methods, copper tape'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare soil',
          'Sow seeds thinly',
          'Water gently'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Thin seedlings',
          'Keep soil moist',
          'Remove weeds'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pick outer leaves',
          'Cut whole head if desired',
          'Succession plant'
        ]
      }
    ]
  },
  'Beans': {
    name: 'Beans',
    growingInfo: 'Fast-growing climbing vegetable that needs support',
    plantingTime: 'Plant in spring after frost risk has passed',
    careInstructions: [
      'Provide climbing support',
      'Water regularly at base',
      'Pick beans frequently to encourage production',
      'Monitor for pests'
    ],
    seedSpacing: '10-15cm',
    rowSpacing: '45-60cm',
    matureHeight: '30-200cm (depending on variety)',
    timeToHarvest: '50-65 days',
    frostTolerant: false,
    soil: 'Well-draining soil with pH 6.0-6.5',
    watering: 'Regular watering, especially when flowering',
    sunlight: 'Full sun',
    description: 'Beans are easy to grow and come in bush or climbing varieties. They fix nitrogen in the soil, making them great companion plants.',
    commonIssues: [
      {
        name: 'Bean Rust',
        symptoms: 'Reddish-brown spots on leaves and pods',
        solution: 'Improve air circulation, avoid watering foliage, remove infected plants'
      },
      {
        name: 'Bean Mosaic Virus',
        symptoms: 'Mottled yellow and green leaves, stunted growth',
        solution: 'Remove infected plants, control aphids, plant resistant varieties'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature pods',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Cucumbers': {
    name: 'Cucumbers',
    growingInfo: 'Vining plant that produces abundantly in warm weather',
    plantingTime: 'Plant when soil has warmed in late spring',
    careInstructions: [
      'Provide trellis or support',
      'Keep soil consistently moist',
      'Harvest regularly to encourage production',
      'Monitor for powdery mildew'
    ],
    seedSpacing: '30-45cm',
    rowSpacing: '120-150cm',
    matureHeight: '30cm (bush) or 180cm+ (vining)',
    timeToHarvest: '55-70 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Consistent moisture, water deeply',
    sunlight: 'Full sun',
    description: 'Cucumbers thrive in warm weather and need support if growing vining varieties. Regular harvesting encourages continued production.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powdery coating on leaves, yellowing foliage',
        solution: 'Improve air circulation, avoid overhead watering, use resistant varieties'
      },
      {
        name: 'Cucumber Beetles',
        symptoms: 'Holes in leaves, stunted growth, bacterial wilt',
        solution: 'Use row covers, handpick beetles, apply organic insecticides if needed'
      },
      {
        name: 'Angular Leaf Spot',
        symptoms: 'Angular brown spots on leaves, holes in leaves',
        solution: 'Rotate crops, avoid overhead watering, remove infected plants'
      }
    ],
    maintenance: 'medium',  // Needs trellising, regular harvesting
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature cucumbers',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Sweet Corn': {
    name: 'Sweet Corn',
    growingInfo: 'Tall growing crop that needs block planting for pollination',
    plantingTime: 'Plant in spring when soil has warmed',
    careInstructions: [
      'Plant in blocks for better pollination',
      'Water deeply and regularly',
      'Side-dress with nitrogen when knee-high',
      'Support stalks if needed'
    ],
    seedSpacing: '20-30cm',
    rowSpacing: '75-90cm',
    matureHeight: '180-240cm',
    timeToHarvest: '70-100 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-6.8',
    watering: 'Regular watering, especially during tasseling',
    sunlight: 'Full sun',
    description: 'Sweet corn needs to be planted in blocks for proper pollination. Each stalk typically produces 1-2 ears of corn.',
    commonIssues: [
      {
        name: 'Corn Earworm',
        symptoms: 'Damage to ear tips, feeding damage on kernels',
        solution: 'Apply mineral oil to silk tips, use resistant varieties'
      },
      {
        name: 'Smut',
        symptoms: 'Large gray/black galls on ears or stalks',
        solution: 'Remove and destroy infected parts, maintain plant vigor'
      },
      {
        name: 'Raccoon Damage',
        symptoms: 'Pulled down stalks, partially eaten ears',
        solution: 'Install electric fencing, harvest as soon as corn is ready'
      }
    ],
    maintenance: 'low',  // Low maintenance, easy to grow
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature ears',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Capsicum': {
    name: 'Capsicum',
    growingInfo: 'Warm-season crop that produces over a long period',
    plantingTime: 'Start indoors 8-10 weeks before last frost',
    careInstructions: [
      'Stake plants when fruiting',
      'Keep soil evenly moist',
      'Feed regularly during fruiting',
      'Protect from extreme heat'
    ],
    seedSpacing: '30-45cm',
    rowSpacing: '60-75cm',
    matureHeight: '45-75cm',
    timeToHarvest: '60-90 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Consistent moisture, avoid overwatering',
    sunlight: 'Full sun',
    description: "Capsicums (bell peppers) prefer warm conditions and can be harvested at any stage, though they're sweetest when fully colored.",
    commonIssues: [
      {
        name: 'Blossom End Rot',
        symptoms: 'Dark, sunken spots at bottom of fruits',
        solution: 'Maintain consistent watering, ensure adequate calcium'
      },
      {
        name: 'Sunscald',
        symptoms: 'White or yellow patches on fruits',
        solution: 'Ensure adequate leaf cover, provide shade if necessary'
      }
    ],
    maintenance: 'medium',  // Needs support, regular feeding
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature peppers',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Eggplant': {
    name: 'Eggplant',
    growingInfo: 'Heat-loving plant that needs warm soil to thrive',
    plantingTime: 'Plant after all frost danger has passed',
    careInstructions: [
      'Support plants when fruiting',
      'Maintain consistent moisture',
      'Feed every 4-6 weeks',
      'Monitor for pests regularly'
    ],
    seedSpacing: '45-60cm',
    rowSpacing: '60-90cm',
    matureHeight: '60-120cm',
    timeToHarvest: '65-80 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular deep watering',
    sunlight: 'Full sun',
    description: 'Eggplants are heat-loving plants that produce glossy fruits. They may need support as the fruits develop.',
    commonIssues: [
      {
        name: 'Flea Beetles',
        symptoms: 'Small holes in leaves, stunted growth',
        solution: 'Use row covers, apply diatomaceous earth, keep garden clean'
      },
      {
        name: 'Verticillium Wilt',
        symptoms: 'Yellowing leaves, wilting despite watering',
        solution: 'Plant resistant varieties, rotate crops, improve drainage'
      },
      {
        name: 'Spider Mites',
        symptoms: 'Stippled leaves, fine webbing on undersides',
        solution: 'Increase humidity, spray with water, use insecticidal soap'
      }
    ],
    maintenance: 'low',  // Low maintenance, easy to grow
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature eggplants',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Carrots': {
    name: 'Carrots',
    growingInfo: 'Root vegetable that needs loose, stone-free soil',
    plantingTime: 'Sow directly from early spring to late summer',
    careInstructions: [
      'Thin seedlings to 5cm apart',
      'Keep soil consistently moist',
      'Avoid high nitrogen fertilizers',
      'Protect young plants from pests'
    ],
    seedSpacing: '5-7cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '70-80 days',
    frostTolerant: true,
    soil: 'Deep, loose soil with pH 6.0-6.8, free of rocks',
    watering: 'Regular watering, keep soil moist',
    sunlight: 'Full sun to partial shade',
    description: "Carrots need deep, loose soil to develop straight roots. They're great for succession planting throughout the season.",
    commonIssues: [
      {
        name: 'Carrot Root Fly',
        symptoms: 'Tunnels in roots, wilting foliage',
        solution: 'Use physical barriers, companion plant with onions or leeks'
      },
      {
        name: 'Forking',
        symptoms: 'Split or forked roots',
        solution: 'Ensure loose soil free of stones, avoid fresh manure'
      }
    ],
    maintenance: 'low',  // Once planted, needs little attention
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature carrots',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Broccoli': {
    name: 'Broccoli',
    growingInfo: 'Cool-season crop that forms large central head',
    plantingTime: 'Plant in early spring or late summer',
    careInstructions: [
      'Space plants properly',
      'Keep soil consistently moist',
      'Feed regularly with nitrogen',
      'Watch for cabbage butterflies'
    ],
    seedSpacing: '45-60cm',
    rowSpacing: '60-90cm',
    matureHeight: '60-90cm',
    timeToHarvest: '50-70 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering, keep soil moist',
    sunlight: 'Full sun',
    description: 'Broccoli is a cool-season crop that produces side shoots after the main head is harvested, extending the harvest period.',
    commonIssues: [
      {
        name: 'Club Root',
        symptoms: 'Swollen, distorted roots, stunted growth',
        solution: 'Improve drainage, add lime to raise pH, practice crop rotation'
      },
      {
        name: 'Cabbage White Butterfly',
        symptoms: 'Holes in leaves, presence of green caterpillars',
        solution: 'Use netting or row covers, handpick caterpillars, encourage beneficial insects'
      }
    ],
    maintenance: 'medium',  // Needs pest monitoring, regular feeding
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature broccoli',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Cauliflower': {
    name: 'Cauliflower',
    growingInfo: 'Cool-season brassica that needs consistent care',
    plantingTime: 'Plant in early spring or late summer',
    careInstructions: [
      'Blanch heads when they form',
      'Keep soil evenly moist',
      'Feed every 3-4 weeks',
      'Protect from heat stress'
    ],
    seedSpacing: '45-60cm',
    rowSpacing: '60-90cm',
    matureHeight: '60-90cm',
    timeToHarvest: '55-100 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Consistent moisture',
    sunlight: 'Full sun',
    description: 'Cauliflower needs consistent temperatures and moisture to produce good heads. Leaves may need to be tied over the head to blanch it.',
    commonIssues: [
      {
        name: 'Buttoning',
        symptoms: 'Small heads form prematurely',
        solution: 'Maintain steady growth, avoid temperature stress'
      },
      {
        name: 'Club Root',
        symptoms: 'Stunted growth, wilting, swollen roots',
        solution: 'Adjust soil pH to 7.0, improve drainage, practice crop rotation'
      },
      {
        name: 'Browning',
        symptoms: 'Brown spots on heads, discoloration',
        solution: 'Tie leaves over heads to blanch, harvest at proper time'
      }
    ],
    maintenance: 'medium',  // Needs regular pruning, support
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature cauliflowers',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Peas': {
    name: 'Peas',
    growingInfo: 'Cool-season legume that fixes nitrogen in soil',
    plantingTime: 'Plant in early spring or autumn',
    careInstructions: [
      'Provide climbing support',
      'Keep soil moderately moist',
      'Pick regularly when ready',
      'Protect from strong winds'
    ],
    seedSpacing: '5-7cm',
    rowSpacing: '45-60cm',
    matureHeight: '60-180cm',
    timeToHarvest: '60-70 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Moderate watering, avoid overwatering',
    sunlight: 'Full sun to partial shade',
    description: 'Peas are cool-season crops that fix nitrogen in the soil. They need support for climbing and produce better with regular harvesting.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powdery coating on leaves',
        solution: 'Improve air circulation, avoid overhead watering, remove affected leaves'
      },
      {
        name: 'Pea Moth',
        symptoms: 'Small holes in pods, damaged peas',
        solution: 'Time planting to avoid moth season, use pheromone traps'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature peas',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Potatoes': {
    name: 'Potatoes',
    growingInfo: 'Root crop that needs hilling as it grows',
    plantingTime: 'Plant in early spring after frost danger',
    careInstructions: [
      'Hill soil around plants',
      'Keep soil consistently moist',
      'Watch for potato beetles',
      'Stop watering before harvest'
    ],
    seedSpacing: '30-40cm',
    rowSpacing: '75-90cm',
    matureHeight: '45-60cm',
    timeToHarvest: '90-120 days',
    frostTolerant: false,
    soil: 'Loose, well-draining soil with pH 5.0-6.0',
    watering: 'Regular watering, especially during tuber formation',
    sunlight: 'Full sun',
    description: "Potatoes need to be hilled as they grow to protect developing tubers from sunlight. They're ready to harvest when the plants die back.",
    commonIssues: [
      {
        name: 'Potato Blight',
        symptoms: 'Brown patches on leaves, rotting tubers',
        solution: 'Remove affected foliage, improve air flow, use resistant varieties'
      },
      {
        name: 'Scab',
        symptoms: 'Rough, corky patches on tubers',
        solution: 'Maintain consistent soil moisture, avoid adding lime'
      }
    ],
    maintenance: 'medium',  // Needs regular watering, disease monitoring
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature tubers',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Broad Beans': {
    name: 'Broad Beans',
    growingInfo: 'Cold-hardy legume that grows tall',
    plantingTime: 'Plant in autumn or early spring',
    careInstructions: [
      'Support tall plants',
      'Pinch out tops when flowering',
      'Water regularly when pods forming',
      'Monitor for chocolate spot'
    ],
    seedSpacing: '20-25cm',
    rowSpacing: '60-75cm',
    matureHeight: '90-120cm',
    timeToHarvest: '80-100 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering, especially when flowering',
    sunlight: 'Full sun',
    description: 'Broad beans are hardy plants that can withstand cold temperatures. They improve soil by fixing nitrogen.',
    commonIssues: [
      {
        name: 'Chocolate Spot',
        symptoms: 'Brown spots on leaves and stems',
        solution: 'Improve air circulation, avoid overcrowding, spray with fungicide if severe'
      },
      {
        name: 'Black Bean Aphid',
        symptoms: 'Black aphids clustering on growing tips',
        solution: 'Pinch out infected tips, encourage beneficial insects'
      },
      {
        name: 'Bean Rust',
        symptoms: 'Orange-brown pustules on leaves',
        solution: 'Remove infected leaves, improve spacing, use resistant varieties'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Direct sow 5cm deep in double rows',
          'Stake or corral plants before they reach 30cm',
        ],
      },
      {
        stage: 'growing',
        tasks: [
          'Pinch out growing tips if blackfly cluster on tops',
          'Earth up stems slightly for wind support',
        ],
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pick when beans show clearly through the pod wall',
          'Regular picking extends the harvest period',
          'Dig in or compost roots after final pick for nitrogen',
        ],
      },
    ],
  },
  'Brussels sprouts': {
    name: 'Brussels sprouts',
    growingInfo: 'Long-season brassica that needs cool weather',
    plantingTime: 'Plant in late spring for winter harvest',
    careInstructions: [
      'Space well for good air flow',
      'Remove yellowing leaves',
      'Keep soil consistently moist',
      'Feed regularly with nitrogen'
    ],
    seedSpacing: '45-60cm',
    rowSpacing: '60-75cm',
    matureHeight: '75-100cm',
    timeToHarvest: '100-120 days',
    frostTolerant: true,
    soil: 'Rich, firm soil with pH 6.0-6.8',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'Brussels sprouts are slow-growing, cool-season vegetables that improve in flavor after light frosts.',
    commonIssues: [
      {
        name: 'Loose Sprouts',
        symptoms: 'Sprouts not forming tight heads',
        solution: 'Remove lower leaves as sprouts form, maintain steady growth'
      },
      {
        name: 'Cabbage Worms',
        symptoms: 'Holes in leaves, green caterpillars present',
        solution: 'Handpick caterpillars, use BT spray, cover with netting'
      },
      {
        name: 'Yellow Leaves',
        symptoms: 'Lower leaves turning yellow',
        solution: 'Check nitrogen levels, remove old leaves, ensure proper spacing'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature sprouts',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Garlic': {
    name: 'Garlic',
    growingInfo: 'Long-season crop planted in individual cloves',
    plantingTime: 'Plant in autumn for summer harvest',
    careInstructions: [
      'Plant cloves pointy end up',
      'Mulch well after planting',
      'Remove flower stalks',
      'Stop watering when leaves yellow'
    ],
    seedSpacing: '10-15cm',
    rowSpacing: '30-40cm',
    matureHeight: '45-60cm',
    timeToHarvest: '240-270 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering until bulb formation',
    sunlight: 'Full sun',
    description: 'Garlic is planted in autumn or winter for harvest the following summer. Each clove will produce a new bulb.',
    commonIssues: [
      {
        name: 'Rust',
        symptoms: 'Orange pustules on leaves',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'White Rot',
        symptoms: 'Yellowing leaves, rotting bulbs',
        solution: 'Long crop rotation, plant disease-free cloves'
      }
    ],
    maintenance: 'low',  // Plant and mostly leave alone
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature bulbs',
          'Stop watering when leaves begin yellowing',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Radish': {
    name: 'Radish',
    growingInfo: 'Fast-growing root crop, perfect for beginners',
    plantingTime: 'Sow every 2 weeks for continuous harvest',
    careInstructions: [
      'Thin seedlings promptly',
      'Keep soil evenly moist',
      'Harvest before oversized',
      'Protect from root maggots'
    ],
    seedSpacing: '2-5cm',
    rowSpacing: '15-30cm',
    matureHeight: '15-20cm',
    timeToHarvest: '21-30 days',
    frostTolerant: true,
    soil: 'Light, well-draining soil with pH 6.0-7.0',
    watering: 'Consistent moisture',
    sunlight: 'Full sun to partial shade',
    description: "Radishes are quick-growing vegetables perfect for succession planting. They're ready to harvest in just a few weeks.",
    commonIssues: [
      {
        name: 'Root Maggots',
        symptoms: 'Tunnels in roots, wilting leaves',
        solution: 'Use row covers, practice crop rotation, maintain clean beds'
      },
      {
        name: 'Cracking',
        symptoms: 'Split or cracked roots',
        solution: 'Maintain consistent moisture, harvest promptly when mature'
      },
      {
        name: 'Woody Texture',
        symptoms: 'Tough, fibrous roots',
        solution: 'Harvest before overmaturity, avoid stress conditions'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature radishes',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Onions': {
    name: 'Onions',
    growingInfo: 'Long-season crop grown from sets or seedlings',
    plantingTime: 'Plant in early spring or autumn',
    careInstructions: [
      'Plant at correct depth',
      'Keep weed-free',
      'Stop watering when tops fall',
      'Cure properly after harvest'
    ],
    seedSpacing: '10-15cm',
    rowSpacing: '30-45cm',
    matureHeight: '45-60cm',
    timeToHarvest: '100-120 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering until bulb formation',
    sunlight: 'Full sun',
    description: 'Onions need long days and cool weather to develop properly. Stop watering when bulbs begin to mature.',
    commonIssues: [
      {
        name: 'White Rot',
        symptoms: 'Yellow leaves, rotting bulbs, white fungal growth',
        solution: 'Practice long crop rotation, avoid planting in infected soil'
      },
      {
        name: 'Neck Rot',
        symptoms: 'Soft, water-soaked tissue at neck',
        solution: 'Ensure proper drying before storage, cure properly'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature onions',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Silverbeet': {
    name: 'Silverbeet',
    growingInfo: 'Hardy leafy green that produces for months',
    plantingTime: 'Plant spring through autumn',
    careInstructions: [
      'Thin seedlings well',
      'Keep soil consistently moist',
      'Harvest outer leaves',
      'Remove flower stalks'
    ],
    seedSpacing: '30cm',
    rowSpacing: '45-60cm',
    matureHeight: '40-60cm',
    timeToHarvest: '50-60 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'Also known as Swiss Chard, Silverbeet is a hardy leafy green that can be harvested continuously.',
    commonIssues: [
      {
        name: 'Leaf Miners',
        symptoms: 'Serpentine tunnels in leaves',
        solution: 'Remove affected leaves, use row covers, encourage beneficial insects'
      },
      {
        name: 'Cercospora Leaf Spot',
        symptoms: 'Circular spots with purple margins',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'Crown Rot',
        symptoms: 'Rotting at base of plant',
        solution: 'Improve drainage, avoid overwatering, maintain clean garden'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature silverbeet',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Zucchini': {
    name: 'Zucchini',
    growingInfo: 'Productive summer squash that needs space',
    plantingTime: 'Plant after soil has warmed in spring',
    careInstructions: [
      'Give plenty of space',
      'Water at base of plant',
      'Harvest regularly when small',
      'Monitor for powdery mildew'
    ],
    seedSpacing: '60-90cm',
    rowSpacing: '90-120cm',
    matureHeight: '60-90cm',
    timeToHarvest: '50-70 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular deep watering',
    sunlight: 'Full sun',
    description: 'Zucchini plants are prolific producers. Regular harvesting encourages continued production.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powder on leaves, reduced vigor',
        solution: 'Space plants well, water at base, use resistant varieties'
      },
      {
        name: 'Blossom End Rot',
        symptoms: 'Dark rot at blossom end of fruit',
        solution: 'Maintain even soil moisture, ensure adequate calcium'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature zucchini',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Rhubarb': {
    name: 'Rhubarb',
    growingInfo: 'Perennial crop that produces for years',
    plantingTime: 'Plant crowns in early spring',
    careInstructions: [
      'Prepare soil well before planting',
      'Remove flower stalks',
      'Never harvest first year',
      'Mulch heavily in winter'
    ],
    seedSpacing: '90-120cm',
    rowSpacing: '90-120cm',
    matureHeight: '60-90cm',
    timeToHarvest: '1-2 years',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-6.8',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'Rhubarb is a perennial that produces edible stalks. Only harvest after the first year of growth.',
    commonIssues: [
      {
        name: 'Crown Rot',
        symptoms: 'Rotting at base of plant',
        solution: 'Improve drainage, avoid overwatering'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature rhubarb',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Strawberries': {
    name: 'Strawberries',
    growingInfo:
      'Perennial fruit grown from crowns or runners. Needs free-draining, slightly acidic soil and good air flow around plants.',
    plantingTime:
      'Plant crowns or potted runners in autumn to early winter in most regions, or early spring in cold areas once frost risk eases.',
    careInstructions: [
      'Plant crowns with the growing point just above soil level',
      'Space plants 30-40cm apart in rows 75-90cm apart',
      'Mulch with straw or pine needles to keep fruit clean and soil moist',
      'Remove runners in the first year to build a strong mother plant',
      'Net plants when fruit colours up to protect from birds',
    ],
    seedSpacing: '30-40cm',
    rowSpacing: '75-90cm',
    matureHeight: '15-25cm',
    timeToHarvest: '3-4 months from planting (best yields from year two)',
    frostTolerant: true,
    soil: 'Rich, well-drained soil with pH 5.5-6.5',
    watering: 'Regular moisture; avoid wetting leaves and fruit',
    sunlight: 'Full sun',
    description:
      'Strawberries are a long-lived perennial. Autumn planting lets roots establish before spring fruiting in temperate and warm climates.',
    commonIssues: [
      {
        name: 'Gray mould (botrytis)',
        symptoms: 'Fuzzy grey growth on ripe or damaged fruit',
        solution: 'Improve air flow, remove old leaves and rotten fruit, water at soil level only',
      },
      {
        name: 'Snails and slugs',
        symptoms: 'Holes in leaves and chewed fruit',
        solution: 'Keep mulch off crowns, handpick at dusk, use barriers where needed',
      },
      {
        name: 'Bird damage',
        symptoms: 'Pecked or missing ripe berries',
        solution: 'Cover beds with bird netting before fruit ripens',
      },
    ],
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare beds with compost and adjust pH if needed',
          'Set crowns at correct depth',
          'Water in well and mulch',
        ],
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flowers in the first season if building a permanent bed',
          'Trim old leaves after harvest',
          'Feed lightly with balanced fertiliser in spring',
        ],
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pick when fully red and aromatic',
          'Harvest in the cool of the morning',
          'Renovate beds after peak crop (thin and refresh mulch)',
        ],
      },
    ],
  },
  'Winter Cabbage': {
    name: 'Winter Cabbage',
    growingInfo: 'Hardy brassica that develops better flavor after frost',
    plantingTime: 'Plant in summer for winter harvest',
    careInstructions: [
      'Space well for head development',
      'Keep soil consistently moist',
      'Feed with nitrogen monthly',
      'Watch for cabbage butterflies'
    ],
    seedSpacing: '45-60cm',
    rowSpacing: '60-75cm',
    matureHeight: '40-60cm',
    timeToHarvest: '90-120 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'Winter cabbage is frost hardy and develops better flavor after light frosts. Needs firm soil and consistent moisture.',
    commonIssues: [
      {
        name: 'Clubroot',
        symptoms: 'Stunted growth, wilting, swollen roots',
        solution: 'Adjust soil pH to 7.2, improve drainage, rotate crops'
      },
      {
        name: 'Diamond Back Moth',
        symptoms: 'Small holes in leaves, caterpillar presence',
        solution: 'Use row covers, encourage natural predators, apply organic sprays'
      },
      {
        name: 'Black Rot',
        symptoms: 'Yellow V-shaped lesions on leaf edges',
        solution: 'Use disease-free seeds, rotate crops, remove infected plants'
      }
    ],
    maintenance: 'medium',  // Needs regular watering, pest monitoring
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature cabbage',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Kale': {
    name: 'Kale',
    growingInfo: 'Cold-hardy leafy green that improves with frost',
    plantingTime: 'Plant in late summer for winter/spring harvest',
    careInstructions: [
      'Space plants adequately',
      'Keep soil consistently moist',
      'Harvest outer leaves regularly',
      'Protect from cabbage whites'
    ],
    seedSpacing: '30-45cm',
    rowSpacing: '45-60cm',
    matureHeight: '60-90cm',
    timeToHarvest: '50-65 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.2',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'Kale is a hardy green that becomes sweeter after frost. Can be harvested continuously as needed.',
    commonIssues: [
      {
        name: 'Aphids',
        symptoms: 'Curled leaves, sticky residue, small insects',
        solution: 'Spray with strong water jet, encourage ladybugs, use insecticidal soap'
      },
      {
        name: 'Downy Mildew',
        symptoms: 'Yellow patches on leaves, grey fuzz underneath',
        solution: 'Improve air circulation, water at base, remove infected leaves'
      },
      {
        name: 'Cabbage Worms',
        symptoms: 'Holes in leaves, green caterpillars',
        solution: 'Handpick caterpillars, use BT spray, cover with netting'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature kale',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Kohlrabi': {
    name: 'Kohlrabi',
    growingInfo: 'Quick-growing brassica with swollen stem',
    plantingTime: 'Plant in spring or late summer',
    careInstructions: [
      'Thin seedlings early',
      'Keep soil evenly moist',
      'Harvest when bulb is tennis ball size',
      'Watch for cabbage moths'
    ],
    seedSpacing: '15-20cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-40cm',
    timeToHarvest: '45-60 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.5',
    watering: 'Consistent moisture',
    sunlight: 'Full sun',
    description: 'Kohlrabi forms a swollen stem above ground. Harvest when the bulb reaches tennis ball size for best flavor.',
    commonIssues: [
      {
        name: 'Splitting',
        symptoms: 'Cracked or split bulbs',
        solution: 'Harvest at proper size, maintain consistent moisture'
      },
      {
        name: 'Club Root',
        symptoms: 'Stunted growth, wilting, swollen roots',
        solution: 'Adjust soil pH, improve drainage, practice crop rotation'
      },
      {
        name: 'Flea Beetles',
        symptoms: 'Small holes in leaves',
        solution: 'Use row covers, apply diatomaceous earth'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature kohlrabi',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Spring Onion': {
    name: 'Spring Onion',
    growingInfo: 'Fast-growing allium for fresh green stems',
    plantingTime: 'Sow every 3-4 weeks for continuous harvest',
    careInstructions: [
      'Sow seeds thinly',
      'Keep weeded',
      'Water regularly',
      'Harvest when stems reach desired size'
    ],
    seedSpacing: '2-5cm',
    rowSpacing: '15-30cm',
    matureHeight: '30-45cm',
    timeToHarvest: '60-70 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'Also known as scallions, spring onions can be harvested young for mild flavor or left to develop stronger taste.',
    commonIssues: [
      {
        name: 'Damping Off',
        symptoms: 'Seedlings collapse at soil level',
        solution: 'Improve drainage, avoid overcrowding, use sterile soil'
      },
      {
        name: 'Thrips',
        symptoms: 'Silvery streaks on leaves, distorted growth',
        solution: 'Use insecticidal soap, maintain garden cleanliness'
      },
      {
        name: 'Purple Blotch',
        symptoms: 'Purple lesions on leaves',
        solution: 'Improve air circulation, avoid overhead watering'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature spring onions',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Swede': {
    name: 'Swede',
    growingInfo: 'Root vegetable that sweetens after frost',
    plantingTime: 'Plant in late spring for autumn/winter harvest',
    careInstructions: [
      'Thin to final spacing',
      'Keep soil consistently moist',
      'Protect from root fly',
      'Harvest after frost for best flavor'
    ],
    seedSpacing: '15-20cm',
    rowSpacing: '45-60cm',
    matureHeight: '30-45cm',
    timeToHarvest: '90-100 days',
    frostTolerant: true,
    soil: 'Deep, well-draining soil with pH 6.0-6.8',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Swedes are root vegetables that improve in flavor after frost. They store well and are rich in nutrients.',
    commonIssues: [
      {
        name: 'Club Root',
        symptoms: 'Stunted growth, swollen roots',
        solution: 'Adjust soil pH, improve drainage, rotate crops'
      },
      {
        name: 'Flea Beetles',
        symptoms: 'Small holes in leaves',
        solution: 'Use row covers early in season, maintain clean beds'
      },
      {
        name: 'Brown Heart',
        symptoms: 'Internal browning of roots',
        solution: 'Ensure adequate boron in soil, maintain consistent moisture'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature swedes',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Turnip': {
    name: 'Turnip',
    growingInfo: 'Fast-growing root vegetable for spring or fall',
    plantingTime: 'Plant in early spring or late summer',
    careInstructions: [
      'Thin seedlings to 10cm apart',
      'Keep soil evenly moist',
      'Harvest when roots are young',
      'Watch for flea beetles'
    ],
    seedSpacing: '10-15cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '40-55 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'Both turnip roots and greens are edible. Young turnips are tender and mild-flavored.',
    commonIssues: [
      {
        name: 'Club Root',
        symptoms: 'Swollen, distorted roots',
        solution: 'Improve soil pH, rotate crops'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature turnips',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'English Spinach': {
    name: 'English Spinach',
    growingInfo: 'Quick-growing leafy green that prefers cool weather',
    plantingTime: 'Plant in early spring or autumn',
    careInstructions: [
      'Thin to proper spacing',
      'Keep soil consistently moist',
      'Harvest outer leaves regularly',
      'Protect from leaf miners'
    ],
    seedSpacing: '7-10cm',
    rowSpacing: '30-45cm',
    matureHeight: '20-30cm',
    timeToHarvest: '40-50 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'English spinach prefers cool weather and will bolt in heat. Harvest outer leaves for continuous production.',
    commonIssues: [
      {
        name: 'Leaf Miners',
        symptoms: 'Serpentine tunnels in leaves',
        solution: 'Remove affected leaves, use row covers'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature spinach',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Shallots': {
    name: 'Shallots',
    growingInfo: 'Mild-flavored allium grown from sets or seeds',
    plantingTime: 'Plant sets in early spring or autumn',
    careInstructions: [
      'Plant sets with tips just showing',
      'Keep weed-free',
      'Water regularly until tops die down',
      'Cure properly after harvest'
    ],
    seedSpacing: '10-15cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '90-120 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Moderate watering',
    sunlight: 'Full sun',
    description: 'Shallots have a milder, more refined flavor than onions. Each bulb planted will multiply into a cluster.',
    commonIssues: [
      {
        name: 'White Rot',
        symptoms: 'Yellowing leaves, rotting bulbs',
        solution: 'Practice crop rotation, improve drainage'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature shallots',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Jerusalem Artichokes': {
    name: 'Jerusalem Artichokes',
    growingInfo: 'Tall perennial with edible tubers',
    plantingTime: 'Plant tubers in early spring',
    careInstructions: [
      'Plant tubers 10-15cm deep',
      'Support tall stems if needed',
      'Harvest after frost kills tops',
      'Leave some tubers for next year'
    ],
    seedSpacing: '30-45cm',
    rowSpacing: '90-120cm',
    matureHeight: '150-300cm',
    timeToHarvest: '120-150 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Also known as sunchokes, these perennial plants produce edible tubers. Can spread vigorously once established.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powder on leaves',
        solution: 'Improve air circulation, avoid overhead watering'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature artichokes',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Asparagus': {
    name: 'Asparagus',
    growingInfo: 'Long-lived perennial crop that produces for years',
    plantingTime: 'Plant crowns in spring',
    careInstructions: [
      'Prepare deep, rich trenches',
      'Gradually fill as plants grow',
      'Don\'t harvest first year',
      'Remove old ferns in winter'
    ],
    seedSpacing: '30-45cm',
    rowSpacing: '120-150cm',
    matureHeight: '120-150cm',
    timeToHarvest: '2-3 years',
    frostTolerant: true,
    soil: 'Deep, rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering during growing season',
    sunlight: 'Full sun',
    description: 'Asparagus is a long-lived perennial. Do not harvest for the first 2-3 years to allow strong root development.',
    commonIssues: [
      {
        name: 'Asparagus Beetle',
        symptoms: 'Chewed foliage, reduced vigor',
        solution: 'Handpick beetles, maintain clean beds'
      }
    ],
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature asparagus',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Early Potatoes': {
    name: 'Early Potatoes',
    growingInfo: 'Fast-maturing potato variety for spring planting',
    plantingTime: 'Plant when soil warms in early spring',
    careInstructions: [
      'Chit seed potatoes before planting',
      'Hill soil around stems',
      'Keep soil consistently moist',
      'Harvest when flowers fade'
    ],
    seedSpacing: '30-40cm',
    rowSpacing: '60-75cm',
    matureHeight: '45-60cm',
    timeToHarvest: '60-90 days',
    frostTolerant: false,
    soil: 'Light, well-draining soil with pH 5.0-6.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Early potatoes mature more quickly than main crop varieties. Plant certified disease-free seed potatoes.',
    commonIssues: [
      {
        name: 'Early Blight',
        symptoms: 'Dark spots on leaves',
        solution: 'Improve air flow, avoid wet foliage'
      }
    ],
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature potatoes',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Early Carrots': {
    name: 'Early Carrots',
    growingInfo: 'Quick-maturing carrot variety for spring harvest',
    plantingTime: 'Sow as soon as soil can be worked',
    careInstructions: [
      'Sow thinly in rows',
      'Thin carefully when young',
      'Keep soil consistently moist',
      'Protect from carrot fly'
    ],
    seedSpacing: '5-7cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '55-65 days',
    frostTolerant: true,
    soil: 'Deep, loose soil with pH 6.0-6.8',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'Early carrots are typically smaller but sweeter than main crop varieties. Ideal for succession planting.',
    commonIssues: [
      {
        name: 'Carrot Fly',
        symptoms: 'Tunnels in roots',
        solution: 'Use protective barriers, companion plant with onions'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature carrots',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Parsnips': {
    name: 'Parsnips',
    growingInfo: 'Long-season root crop that sweetens after frost',
    plantingTime: 'Sow in early spring for winter harvest',
    careInstructions: [
      'Sow fresh seed only',
      'Keep soil consistently moist',
      'Be patient - slow to germinate',
      'Leave in ground until needed'
    ],
    seedSpacing: '10-15cm',
    rowSpacing: '45-60cm',
    matureHeight: '45-60cm',
    timeToHarvest: '120-180 days',
    frostTolerant: true,
    soil: 'Deep, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Parsnips develop sweeter flavor after frost. Seeds can be slow to germinate, keep soil consistently moist.',
    commonIssues: [
      {
        name: 'Canker',
        symptoms: 'Brown patches on roots',
        solution: 'Improve drainage, rotate crops'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature parsnips',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Chillies': {
    name: 'Chillies',
    growingInfo: 'Heat-loving crop that produces abundantly',
    plantingTime: 'Start indoors 8-10 weeks before last frost',
    careInstructions: [
      'Provide warmth for germination',
      'Harden off carefully',
      'Support plants when fruiting',
      'Harvest regularly'
    ],
    seedSpacing: '45-60cm',
    rowSpacing: '60-75cm',
    matureHeight: '45-90cm',
    timeToHarvest: '60-95 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Moderate watering',
    sunlight: 'Full sun',
    description: 'Chillies prefer warm conditions and will produce more fruit in hot weather. Can be grown in containers.',
    commonIssues: [
      {
        name: 'Blossom End Rot',
        symptoms: 'Dark spots on fruit ends',
        solution: 'Maintain consistent watering, ensure adequate calcium'
      }
    ],
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature chillies',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Sweet Potato': {
    name: 'Sweet Potato',
    growingInfo: 'Tropical vine that produces edible tubers',
    plantingTime: 'Plant slips after all frost danger',
    careInstructions: [
      'Plant in warm soil',
      'Water regularly until established',
      'Control vine growth if needed',
      'Harvest before frost'
    ],
    seedSpacing: '30-45cm',
    rowSpacing: '90-120cm',
    matureHeight: '15-30cm',
    timeToHarvest: '90-120 days',
    frostTolerant: false,
    soil: 'Light, well-draining soil with pH 5.5-6.5',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Sweet potatoes need warm soil to develop well. Harvest when vines yellow or before first frost.',
    commonIssues: [
      {
        name: 'Scurf',
        symptoms: 'Dark patches on tubers',
        solution: 'Use clean planting material, rotate crops'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature sweet potatoes',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Pumpkin': {
    name: 'Pumpkin',
    growingInfo: 'Sprawling vine that needs lots of space',
    plantingTime: 'Plant after soil has warmed in spring',
    careInstructions: [
      'Give plenty of room to spread',
      'Water deeply at base',
      'Support developing fruit',
      'Harvest before heavy frost'
    ],
    seedSpacing: '90-120cm',
    rowSpacing: '180-240cm',
    matureHeight: '30-45cm',
    timeToHarvest: '90-120 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-6.8',
    watering: 'Regular deep watering',
    sunlight: 'Full sun',
    description: 'Pumpkins need plenty of space to spread. Harvest when the skin is hard and the stem begins to dry.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powder on leaves',
        solution: 'Space plants well, improve air circulation'
      }
    ],
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature pumpkins',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Beetroot': {
    name: 'Beetroot',
    growingInfo: 'Easy to grow root vegetable that prefers cool weather',
    plantingTime: 'Plant in early spring or late summer for autumn/winter harvest',
    careInstructions: [
      'Thin seedlings to 10cm apart',
      'Keep soil consistently moist',
      'Mulch to retain moisture and suppress weeds',
      'Harvest when roots reach desired size'
    ],
    seedSpacing: '5-10cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '50-70 days',
    frostTolerant: true,
    soil: 'Well-drained, rich soil',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to part shade',
    description: 'Versatile root vegetable with edible leaves',
    commonIssues: [
      // ... existing issues ...
    ],
    maintenance: 'low',
    maintenanceTasks: [
      // ... existing tasks ...
    ]
  },
  'Leeks': {
    name: 'Leeks',
    growingInfo: 'Long-season allium that needs blanching for white stems',
    plantingTime: 'Sow in spring for autumn/winter harvest',
    careInstructions: [
      'Plant deeply in trenches',
      'Hill soil around stems',
      'Keep well watered',
      'Watch for leek moth'
    ],
    seedSpacing: '15-20cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '60-70 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Leeks are a long-season allium vegetable that need blanching for white stems. They are harvested when the plants are young and tender.',
    commonIssues: [
      {
        name: 'Leek Moth',
        symptoms: 'Yellowing leaves, wilting, and stunted growth',
        solution: 'Remove affected leaves, use row covers, and apply organic insecticides'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare soil',
          'Sow seeds thinly',
          'Water gently'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Thin seedlings',
          'Keep soil moist',
          'Remove weeds'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pick outer leaves',
          'Cut whole head if desired',
          'Succession plant'
        ]
      }
    ]
  },
  'Celery': {
    name: 'Celery',
    growingInfo: 'Moisture-loving crop that needs rich soil',
    plantingTime: 'Plant in spring after frost risk has passed',
    careInstructions: [
      'Keep consistently moist',
      'Mulch to retain moisture',
      'Feed every 2-3 weeks',
      'Blanch stems if desired'
    ],
    seedSpacing: '20-30cm',
    rowSpacing: '45-60cm',
    matureHeight: '60-90cm',
    timeToHarvest: '70-80 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Celery is a moisture-loving crop that needs rich soil. Regular watering and mulching help maintain moisture and prevent disease.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powdery coating on leaves',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'Downy Mildew',
        symptoms: 'Yellow patches on leaves, grey fuzz underneath',
        solution: 'Improve air circulation, water at base, remove infected leaves'
      },
      {
        name: 'Crown Rot',
        symptoms: 'Rotting at base of plant',
        solution: 'Improve drainage, avoid overwatering, maintain clean garden'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature celery',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Brassicas': {
    name: 'Brassicas',
    growingInfo: 'Family of cool-season vegetables including cabbage, broccoli, and cauliflower',
    plantingTime: 'Plant in early spring or late summer/autumn',
    careInstructions: [
      'Space plants according to variety',
      'Keep soil consistently moist',
      'Feed regularly with nitrogen',
      'Watch for cabbage white butterflies'
    ],
    seedSpacing: '45-60cm',
    rowSpacing: '60-90cm',
    matureHeight: '30-90cm',
    timeToHarvest: '60-120 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'The brassica family includes many nutritious vegetables that grow best in cooler weather.',
    commonIssues: [
      {
        name: 'Cabbage White Butterfly',
        symptoms: 'Holes in leaves, presence of green caterpillars',
        solution: 'Use row covers, hand pick caterpillars, spray with BT'
      },
      {
        name: 'Club Root',
        symptoms: 'Stunted growth, wilting, swollen roots',
        solution: 'Improve soil pH, rotate crops, improve drainage'
      }
    ],
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare soil well',
          'Space correctly',
          'Water in gently',
          'Protect from pests'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Monitor for pests',
          'Feed regularly',
          'Keep well watered',
          'Remove yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Harvest at peak maturity',
          'Cut cleanly at base',
          'Process promptly'
        ]
      }
    ]
  },
  'Asian Greens': {
    name: 'Asian Greens',
    growingInfo: 'Quick-growing leafy vegetables including bok choy, tatsoi, and mizuna',
    plantingTime: 'Plant spring through autumn, avoid peak summer heat',
    careInstructions: [
      'Space according to variety',
      'Keep soil consistently moist',
      'Harvest regularly',
      'Watch for flea beetles'
    ],
    seedSpacing: '15-30cm',
    rowSpacing: '30-45cm',
    matureHeight: '20-40cm',
    timeToHarvest: '30-50 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil',
    watering: 'Regular watering',
    sunlight: 'Full sun to part shade',
    description: 'Fast-growing greens that add variety to salads and stir-fries. Many can be harvested multiple times.',
    commonIssues: [
      {
        name: 'Flea Beetles',
        symptoms: 'Small holes in leaves',
        solution: 'Use row covers, apply diatomaceous earth'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare fertile soil',
          'Sow seeds thinly',
          'Keep soil moist',
          'Protect from pests'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Water regularly',
          'Monitor for pests',
          'Remove weeds',
          'Feed if needed'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Cut outer leaves',
          'Harvest whole plants',
          'Succession plant'
        ]
      }
    ]
  },
  'Spring Onions': {
    name: 'Spring Onions',
    growingInfo: 'Quick-growing allium for fresh green stems',
    plantingTime: 'Sow every 3-4 weeks for continuous harvest',
    careInstructions: [
      'Sow seeds thinly',
      'Keep soil consistently moist',
      'Thin to 2-3cm apart',
      'Harvest when stems reach desired size'
    ],
    seedSpacing: '2-3cm',
    rowSpacing: '15-20cm',
    matureHeight: '30-40cm',
    timeToHarvest: '30-40 days',
    frostTolerant: true,
    soil: 'Well-draining, fertile soil',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to partial shade',
    description: 'Fast-growing onions harvested for their tender stems and mild flavor. Perfect for succession planting.',
    commonIssues: [
      {
        name: 'Onion Fly',
        symptoms: 'Wilting, yellowing leaves',
        solution: 'Rotate crops, use row covers'
      },
      {
        name: 'White Rot',
        symptoms: 'Yellowing, rotting base',
        solution: 'Improve drainage, practice crop rotation'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare fine seedbed',
          'Sow seeds thinly',
          'Water gently',
          'Cover lightly with soil'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Keep well watered',
          'Remove weeds carefully',
          'Thin as needed',
          'Watch for pests'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pull when stems reach size',
          'Use fresh or store briefly',
          'Succession sow for continuous crop'
        ]
      }
    ]
  },
  'Spinach': {
    name: 'Spinach',
    growingInfo: 'Fast-growing leafy green that bolts in warm weather',
    plantingTime: 'Plant in early spring or autumn for best results',
    careInstructions: [
      'Sow in rich, cool soil',
      'Keep consistently moist',
      'Thin to 10cm apart',
      'Harvest outer leaves regularly'
    ],
    seedSpacing: '5-10cm',
    rowSpacing: '30-45cm',
    matureHeight: '20-30cm',
    timeToHarvest: '35-45 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.5-7.5',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to partial shade',
    description: 'True spinach (Spinacia oleracea) is more heat-sensitive than English spinach. Best grown in cool weather to prevent bolting.',
    commonIssues: [
      {
        name: 'Bolting',
        symptoms: 'Rapid stem growth, bitter leaves',
        solution: 'Plant in cooler weather, use bolt-resistant varieties'
      },
      {
        name: 'Downy Mildew',
        symptoms: 'Yellow patches with grey undersides',
        solution: 'Improve air circulation, avoid overhead watering'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare rich soil',
          'Sow seeds thinly',
          'Keep soil cool',
          'Water gently'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Thin seedlings',
          'Keep well watered',
          'Remove weeds',
          'Watch for bolting'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pick outer leaves',
          'Cut whole plant if needed',
          'Succession plant'
        ]
      }
    ]
  }
}
