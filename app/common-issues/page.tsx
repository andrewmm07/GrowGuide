'use client'

import { useEffect, useMemo, useState } from 'react'

interface ResourceLink {
  title: string
  url: string
  source?: string
}

interface YoutubeTopResult {
  url: string
  title: string
}

interface WikiResult {
  url: string
  title: string
}

interface CommonIssue {
  name: string
  description: string
  symptoms: string[]
  prevention: string[]
  treatment: string[]
  affectedPlants?: string[]
  resources?: ResourceLink[]
}

interface IssueCategory {
  name: string
  description: string
  issues: CommonIssue[]
  icon: string
  color: string
}

function buildDefaultResources(issueName: string): ResourceLink[] {
  const q = encodeURIComponent(issueName)
  return [
    {
      title: `YouTube: ${issueName}`,
      // Placeholder; replaced in UI once we fetch the top video URL.
      url: `__youtube_top__:${issueName}`,
      source: 'YouTube'
    },
    {
      title: `Wikipedia: ${issueName}`,
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${q}`,
      source: 'Wikipedia'
    },
    {
      title: `ABC Gardening Australia: ${issueName}`,
      url: `https://www.abc.net.au/gardening/search?q=${q}`,
      source: 'ABC Gardening Australia'
    }
  ]
}

function getIssueResources(issue: CommonIssue): ResourceLink[] {
  return issue.resources?.length ? issue.resources : buildDefaultResources(issue.name)
}

function parseYouTubeEmbed(url: string): { embedUrl: string } | null {
  try {
    const u = new URL(url)
    let videoId = ''

    if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.replace('/', '')
    } else {
      videoId = u.searchParams.get('v') ?? ''
    }

    if (!videoId) return null

    // Support start time via ?t= (seconds) or ?t=1m30s
    const t = u.searchParams.get('t')
    let startSeconds: number | null = null
    if (t) {
      if (/^\d+$/.test(t)) {
        startSeconds = Number(t)
      } else {
        const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i)
        if (m) {
          const h = m[1] ? Number(m[1]) : 0
          const min = m[2] ? Number(m[2]) : 0
          const s = m[3] ? Number(m[3]) : 0
          const total = h * 3600 + min * 60 + s
          if (total > 0) startSeconds = total
        }
      }
    }

    const embedBase = `https://www.youtube-nocookie.com/embed/${videoId}`
    const embedUrl =
      startSeconds && startSeconds > 0 ? `${embedBase}?start=${startSeconds}` : embedBase

    return { embedUrl }
  } catch {
    return null
  }
}

const COMMON_ISSUES: IssueCategory[] = [
  {
    name: 'Pests',
    description: 'Common insects and animals that damage plants',
    color: 'red',
    icon: '🐛',
    issues: [
      {
        name: 'Aphids',
        description: 'Small, soft-bodied insects that suck sap from plants, causing stunted growth and distorted leaves.',
        symptoms: [
          'Clusters of small green, black, or brown insects on new growth',
          'Sticky honeydew on leaves',
          'Curled or distorted leaves',
          'Ants crawling on plants',
          'Sooty mold on leaves'
        ],
        prevention: [
          'Encourage beneficial insects like ladybugs and lacewings',
          'Use companion planting with marigolds or nasturtiums',
          'Keep plants healthy with proper watering and nutrition',
          'Regularly inspect plants, especially new growth',
          'Use row covers for vulnerable crops'
        ],
        treatment: [
          'Spray with strong water stream to dislodge aphids',
          'Apply insecticidal soap or neem oil',
          'Introduce beneficial insects (ladybugs, lacewings)',
          'Remove heavily infested leaves or stems',
          'Use yellow sticky traps to monitor populations'
        ],
        resources: [
          // YouTube (titles will be replaced automatically via oEmbed)
          { title: 'Loading…', url: 'https://www.youtube.com/watch?v=mVdou1MJCAE', source: 'YouTube' },
          { title: 'Loading…', url: 'https://www.youtube.com/watch?v=HVTitHBwpN0', source: 'YouTube' },
          { title: 'Loading…', url: 'https://www.youtube.com/watch?v=iic-aHGhUb4', source: 'YouTube' },
          { title: 'Wikipedia: Aphid', url: 'https://en.wikipedia.org/wiki/Aphid', source: 'Wikipedia' }
        ],
        affectedPlants: ['Most vegetables', 'Roses', 'Fruit trees', 'Ornamentals']
      },
      {
        name: 'Slugs and Snails',
        description: 'Mollusks that feed on leaves, stems, and fruits, leaving irregular holes and slime trails.',
        symptoms: [
          'Irregular holes in leaves',
          'Shiny slime trails on plants and soil',
          'Seedlings completely eaten',
          'Damage to low-hanging fruits',
          'Most active at night or in damp conditions'
        ],
        prevention: [
          'Remove hiding places (boards, debris, dense vegetation)',
          'Water in the morning so soil dries by evening',
          'Use copper barriers around beds',
          'Create dry paths between beds',
          'Encourage natural predators (birds, frogs, ground beetles)'
        ],
        treatment: [
          'Hand pick at night with a flashlight',
          'Set up beer traps (shallow containers filled with beer)',
          'Apply diatomaceous earth around plants',
          'Use iron phosphate baits (pet-safe)',
          'Create barriers with crushed eggshells or coffee grounds'
        ],
        resources: [
          {
            title: 'Slug your snails (ABC Gardening Australia)',
            url: 'https://www.abc.net.au/gardening/how-to/slug-your-snails/9436130?utm_content=link&utm_medium=content_shared',
            source: 'ABC Gardening Australia'
          },
          {
            title: 'Stop those snails and slugs (Organic Gardener)',
            url: 'https://www.organicgardener.com.au/stop-those-snails-and-slugs/',
            source: 'Organic Gardener'
          },
          {
            title: 'Loading…',
            url: 'https://www.youtube.com/watch?v=VJvUwkFZeOM',
            source: 'YouTube'
          },
          {
            title: 'Loading…',
            url: 'https://www.youtube.com/watch?v=IQeKHg2Zj-c&t=515s',
            source: 'YouTube'
          }
        ],
        affectedPlants: ['Lettuce', 'Hostas', 'Strawberries', 'Seedlings', 'Most leafy greens']
      },
      {
        name: 'Spider Mites',
        description: 'Tiny arachnids that suck plant juices, causing stippling, yellowing, and webbing on leaves.',
        symptoms: [
          'Fine webbing on undersides of leaves',
          'Yellow or bronze stippling on leaves',
          'Leaves become dry and drop prematurely',
          'Plants look dusty or dirty',
          'Rapid spread in hot, dry conditions'
        ],
        prevention: [
          'Maintain adequate humidity around plants',
          'Regularly mist plants in dry conditions',
          'Keep plants well-watered and healthy',
          'Avoid over-fertilizing with nitrogen',
          'Inspect new plants before bringing them home'
        ],
        treatment: [
          'Spray with strong water stream, focusing on leaf undersides',
          'Apply insecticidal soap or neem oil',
          'Use horticultural oil sprays',
          'Increase humidity around affected plants',
          'Remove and destroy heavily infested leaves'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=bqCBIP9TmcY', source: 'YouTube' }],
        affectedPlants: ['Tomatoes', 'Beans', 'Cucumbers', 'Houseplants', 'Ornamentals']
      },
      {
        name: 'Whiteflies',
        description: 'Small white insects that cluster on leaf undersides, causing yellowing and reduced vigor.',
        symptoms: [
          'Clouds of white insects when plants are disturbed',
          'Yellowing and wilting leaves',
          'Sticky honeydew on leaves',
          'Sooty mold development',
          'Stunted plant growth'
        ],
        prevention: [
          'Use yellow sticky traps to monitor',
          'Remove and destroy infested leaves early',
          'Avoid over-fertilizing',
          'Use row covers for protection',
          'Practice crop rotation'
        ],
        treatment: [
          'Vacuum insects with handheld vacuum',
          'Spray with insecticidal soap or neem oil',
          'Introduce beneficial insects (parasitic wasps)',
          'Use reflective mulches',
          'Apply horticultural oils'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=7Na0Y89kuC0', source: 'YouTube' }],
        affectedPlants: ['Tomatoes', 'Peppers', 'Eggplants', 'Cucumbers', 'Ornamentals']
      },
      {
        name: 'Caterpillars',
        description: 'Larval stage of moths and butterflies that chew on leaves, stems, and fruits.',
        symptoms: [
          'Holes in leaves',
          'Defoliation (complete leaf removal)',
          'Fecal droppings (frass) on leaves',
          'Caterpillars visible on plants',
          'Damage to fruits and flowers'
        ],
        prevention: [
          'Use floating row covers',
          'Hand pick caterpillars regularly',
          'Encourage birds and beneficial insects',
          'Practice crop rotation',
          'Remove weeds that host caterpillars'
        ],
        treatment: [
          'Hand pick and remove caterpillars',
          'Apply Bacillus thuringiensis (Bt) for specific caterpillar types',
          'Use spinosad-based insecticides',
          'Introduce beneficial insects (parasitic wasps)',
          'Remove and destroy heavily infested plants'
        ],
        resources: [
          { title: 'Loading…', url: 'https://www.youtube.com/watch?v=lN26yB8WfbM', source: 'YouTube' },
          { title: 'Loading…', url: 'https://www.youtube.com/watch?v=hohJ3ZPMgiA', source: 'YouTube' }
        ],
        affectedPlants: ['Cabbage', 'Broccoli', 'Tomatoes', 'Corn', 'Most vegetables']
      },
      {
        name: 'Thrips',
        description: 'Tiny, slender insects that feed on plant sap, causing silvery streaks and distorted growth.',
        symptoms: [
          'Silvery or bronze streaks on leaves',
          'Distorted or curled leaves',
          'Black fecal specks on leaves',
          'Flower buds fail to open',
          'Stunted growth'
        ],
        prevention: [
          'Use blue sticky traps to monitor',
          'Remove weeds and plant debris',
          'Keep plants well-watered',
          'Use reflective mulches',
          'Introduce beneficial insects early'
        ],
        treatment: [
          'Spray with insecticidal soap or neem oil',
          'Apply spinosad-based insecticides',
          'Introduce predatory mites or minute pirate bugs',
          'Remove and destroy heavily infested plants',
          'Use horticultural oils'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=tVGNcc4gCNI', source: 'YouTube' }],
        affectedPlants: ['Onions', 'Garlic', 'Peppers', 'Tomatoes', 'Ornamentals', 'Roses']
      },
      {
        name: 'Scale Insects',
        description: 'Small, immobile insects that attach to stems and leaves, sucking plant sap.',
        symptoms: [
          'Small, waxy bumps on stems and leaves',
          'Yellowing leaves',
          'Sticky honeydew on leaves',
          'Sooty mold development',
          'Stunted growth'
        ],
        prevention: [
          'Inspect new plants carefully',
          'Prune to improve air circulation',
          'Keep plants healthy and well-watered',
          'Encourage natural predators',
          'Avoid over-fertilizing'
        ],
        treatment: [
          'Scrape off scales with fingernail or soft brush',
          'Apply horticultural oil sprays',
          'Use insecticidal soap or neem oil',
          'Introduce beneficial insects (ladybugs, parasitic wasps)',
          'Prune heavily infested branches'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=jlDsiygR3PI', source: 'YouTube' }],
        affectedPlants: ['Citrus trees', 'Houseplants', 'Ornamentals', 'Fruit trees']
      },
      {
        name: 'Mealybugs',
        description: 'Small, white, cottony insects that cluster on stems and leaf joints.',
        symptoms: [
          'White, cottony masses on stems and leaves',
          'Sticky honeydew on leaves',
          'Yellowing and wilting leaves',
          'Sooty mold development',
          'Stunted growth'
        ],
        prevention: [
          'Inspect new plants before bringing home',
          'Isolate new plants for a few weeks',
          'Keep plants healthy',
          'Avoid over-fertilizing',
          'Maintain good air circulation'
        ],
        treatment: [
          'Remove with cotton swab dipped in alcohol',
          'Spray with insecticidal soap or neem oil',
          'Apply horticultural oils',
          'Introduce beneficial insects (ladybugs, lacewings)',
          'Use systemic insecticides for severe cases'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=Py1r4SMCLTE', source: 'YouTube' }],
        affectedPlants: ['Houseplants', 'Citrus', 'Ornamentals', 'Succulents']
      },
      {
        name: 'Cutworms',
        description: 'Nocturnal caterpillars that cut through stems at soil level, killing seedlings.',
        symptoms: [
          'Seedlings cut off at soil level',
          'Plants found lying on ground',
          'Damage occurs overnight',
          'Most common in spring',
          'May feed on roots below ground'
        ],
        prevention: [
          'Use collars around seedlings (toilet paper rolls, plastic cups)',
          'Remove weeds and debris where they hide',
          'Till soil in fall to expose overwintering larvae',
          'Delay planting until soil warms',
          'Use floating row covers'
        ],
        treatment: [
          'Hand pick at night with flashlight',
          'Apply Bacillus thuringiensis (Bt)',
          'Use beneficial nematodes',
          'Apply diatomaceous earth around plants',
          'Use cutworm collars for protection'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Cabbage', 'Lettuce', 'Seedlings']
      },
      {
        name: 'Earwigs',
        description: 'Nocturnal insects with pincers that feed on leaves, flowers, and fruits.',
        symptoms: [
          'Irregular holes in leaves',
          'Damage to flowers and flower buds',
          'Feeding on soft fruits',
          'Most active at night',
          'May hide in damp, dark places'
        ],
        prevention: [
          'Remove hiding places (boards, debris)',
          'Keep garden clean and dry',
          'Use traps (rolled newspaper, cardboard)',
          'Reduce moisture in garden',
          'Encourage natural predators'
        ],
        treatment: [
          'Set up traps (oiled cardboard, rolled newspaper)',
          'Hand pick at night',
          'Apply diatomaceous earth',
          'Use beneficial insects',
          'Remove hiding places'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=px83Yalh2Us', source: 'YouTube' }],
        affectedPlants: ['Dahlias', 'Zinnias', 'Lettuce', 'Strawberries', 'Fruit trees']
      },
      {
        name: 'Japanese Beetles',
        description: 'Metallic green and bronze beetles that skeletonize leaves and damage flowers.',
        symptoms: [
          'Skeletonized leaves (only veins remain)',
          'Damage to flowers and fruits',
          'Clusters of beetles on plants',
          'Grubs in lawn (white C-shaped larvae)',
          'Most active in mid-summer'
        ],
        prevention: [
          'Use floating row covers',
          'Hand pick beetles early in morning',
          'Apply beneficial nematodes for grubs',
          'Choose resistant plant varieties',
          'Use companion planting'
        ],
        treatment: [
          'Hand pick into soapy water',
          'Apply neem oil or pyrethrin',
          'Use pheromone traps (place away from garden)',
          'Apply milky spore for grub control',
          'Introduce beneficial nematodes'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=b8Z0l1KQ14k', source: 'YouTube' }],
        affectedPlants: ['Roses', 'Grapes', 'Raspberries', 'Beans', 'Ornamentals']
      },
      {
        name: 'Leaf Miners',
        description: 'Larvae that tunnel inside leaves, creating visible trails or blotches.',
        symptoms: [
          'Winding trails or blotches on leaves',
          'White or brown tunnels visible',
          'Leaves may drop prematurely',
          'Reduced photosynthesis',
          'Most common on leafy vegetables'
        ],
        prevention: [
          'Use floating row covers',
          'Remove and destroy infested leaves',
          'Practice crop rotation',
          'Keep garden clean',
          'Encourage beneficial insects'
        ],
        treatment: [
          'Remove and destroy infested leaves',
          'Apply spinosad-based insecticides',
          'Use beneficial insects (parasitic wasps)',
          'Apply neem oil',
          'Use yellow sticky traps'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=FXBSgdR4wPs', source: 'YouTube' }],
        affectedPlants: ['Spinach', 'Lettuce', 'Beets', 'Swiss chard', 'Ornamentals']
      },
      {
        name: 'Flea Beetles',
        description: 'Small, jumping beetles that create tiny holes in leaves, giving them a "shot-hole" appearance.',
        symptoms: [
          'Tiny round holes in leaves',
          'Shot-hole appearance',
          'Most damage on young plants',
          'Reduced growth',
          'Beetles jump when disturbed'
        ],
        prevention: [
          'Use floating row covers',
          'Plant trap crops (radish, arugula)',
          'Keep garden clean',
          'Practice crop rotation',
          'Delay planting until plants are larger'
        ],
        treatment: [
          'Apply diatomaceous earth',
          'Use neem oil or pyrethrin',
          'Introduce beneficial nematodes',
          'Use sticky traps',
          'Remove and destroy heavily infested plants'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=WYKrtX4wpp0', source: 'YouTube' }],
        affectedPlants: ['Eggplants', 'Tomatoes', 'Peppers', 'Potatoes', 'Cabbage', 'Radishes']
      },
      {
        name: 'Squash Bugs',
        description: 'Gray or brown bugs that suck sap from squash plants, causing wilting and plant death.',
        symptoms: [
          'Yellow spots on leaves',
          'Wilting and browning leaves',
          'Stunted growth',
          'Plant death',
          'Bronze-colored bugs on plants'
        ],
        prevention: [
          'Use floating row covers',
          'Remove plant debris',
          'Practice crop rotation',
          'Hand pick bugs and eggs',
          'Plant resistant varieties'
        ],
        treatment: [
          'Hand pick bugs and destroy egg masses',
          'Apply insecticidal soap or neem oil',
          'Use pyrethrin-based insecticides',
          'Remove and destroy heavily infested plants',
          'Trap with boards (they hide underneath)'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=3MZ_4R5GDC4', source: 'YouTube' }],
        affectedPlants: ['Squash', 'Pumpkins', 'Zucchini', 'Cucumbers', 'Melons']
      },
      {
        name: 'Squash Vine Borers',
        description: 'Larvae that bore into squash stems, causing sudden wilting and plant death.',
        symptoms: [
          'Sudden wilting of entire plant',
          'Sawdust-like frass at base of stem',
          'Holes in stems',
          'Plant collapse',
          'Most common in mid-summer'
        ],
        prevention: [
          'Use floating row covers until flowering',
          'Plant early or late to avoid peak populations',
          'Wrap stems with aluminum foil',
          'Practice crop rotation',
          'Remove and destroy infested plants'
        ],
        treatment: [
          'Slit stem and remove borer',
          'Bury stem nodes to encourage new roots',
          'Apply beneficial nematodes',
          'Use row covers',
          'Remove and destroy infested plants'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=Fq4hPQTjPYo', source: 'YouTube' }],
        affectedPlants: ['Squash', 'Pumpkins', 'Zucchini', 'Cucumbers']
      },
      {
        name: 'Tomato Hornworms',
        description: 'Large green caterpillars that can defoliate tomato plants rapidly.',
        symptoms: [
          'Large holes in leaves',
          'Defoliation',
          'Large green caterpillars with horns',
          'Black droppings on leaves',
          'Damage to fruits'
        ],
        prevention: [
          'Hand pick caterpillars regularly',
          'Encourage beneficial insects',
          'Use floating row covers',
          'Practice crop rotation',
          'Till soil in fall to expose pupae'
        ],
        treatment: [
          'Hand pick and destroy caterpillars',
          'Apply Bacillus thuringiensis (Bt)',
          'Introduce parasitic wasps',
          'Use spinosad-based insecticides',
          'Till soil to expose overwintering pupae'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=OrOysttnZFI', source: 'YouTube' }],
        affectedPlants: ['Tomatoes', 'Peppers', 'Eggplants', 'Potatoes']
      },
      {
        name: 'Corn Earworms',
        description: 'Caterpillars that feed on corn ears, causing damage to kernels.',
        symptoms: [
          'Damage to corn ears',
          'Frass at ear tips',
          'Caterpillars inside ears',
          'Reduced yield',
          'Secondary rot in damaged ears'
        ],
        prevention: [
          'Plant early or late to avoid peak populations',
          'Use Bt corn varieties',
          'Apply mineral oil to silks',
          'Use beneficial insects',
          'Practice crop rotation'
        ],
        treatment: [
          'Apply Bacillus thuringiensis (Bt) to silks',
          'Use spinosad-based insecticides',
          'Apply mineral oil to silks',
          'Introduce beneficial insects',
          'Remove and destroy damaged ears'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=wlcu-Jol4YA&t=146s', source: 'YouTube' }],
        affectedPlants: ['Corn', 'Tomatoes', 'Peppers', 'Beans']
      },
      {
        name: 'Cabbage Loopers',
        description: 'Green caterpillars that move in a looping motion and feed on brassicas.',
        symptoms: [
          'Holes in leaves',
          'Defoliation',
          'Green caterpillars with looping movement',
          'Damage to heads',
          'Reduced yields'
        ],
        prevention: [
          'Use floating row covers',
          'Hand pick caterpillars',
          'Encourage beneficial insects',
          'Practice crop rotation',
          'Remove weeds'
        ],
        treatment: [
          'Hand pick and destroy caterpillars',
          'Apply Bacillus thuringiensis (Bt)',
          'Use spinosad-based insecticides',
          'Introduce beneficial insects',
          'Remove and destroy heavily infested plants'
        ],
        affectedPlants: ['Cabbage', 'Broccoli', 'Cauliflower', 'Brussels sprouts', 'Kale']
      },
      {
        name: 'Imported Cabbageworms',
        description: 'Green caterpillars with yellow stripe that feed on brassica leaves.',
        symptoms: [
          'Holes in leaves',
          'Green caterpillars with yellow stripe',
          'Defoliation',
          'Damage to heads',
          'White butterflies flying around plants'
        ],
        prevention: [
          'Use floating row covers',
          'Hand pick caterpillars and eggs',
          'Encourage beneficial insects',
          'Practice crop rotation',
          'Remove weeds'
        ],
        treatment: [
          'Hand pick and destroy caterpillars',
          'Apply Bacillus thuringiensis (Bt)',
          'Use spinosad-based insecticides',
          'Introduce beneficial insects',
          'Remove and destroy heavily infested plants'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=XYBWpQtU0zQ', source: 'YouTube' }],
        affectedPlants: ['Cabbage', 'Broccoli', 'Cauliflower', 'Brussels sprouts', 'Kale', 'Radishes']
      },
      {
        name: 'Bean Beetles',
        description: 'Small yellow or orange beetles with black spots that feed on bean leaves.',
        symptoms: [
          'Skeletonized leaves',
          'Yellow or orange beetles with black spots',
          'Reduced yields',
          'Damage to pods',
          'Most common in late summer'
        ],
        prevention: [
          'Use floating row covers',
          'Plant early or late to avoid peak populations',
          'Practice crop rotation',
          'Remove plant debris',
          'Hand pick beetles'
        ],
        treatment: [
          'Hand pick and destroy beetles',
          'Apply neem oil or pyrethrin',
          'Use spinosad-based insecticides',
          'Introduce beneficial insects',
          'Remove and destroy heavily infested plants'
        ],
        resources: [{ title: 'Loading…', url: 'https://www.youtube.com/watch?v=dwd4FKMmjSU', source: 'YouTube' }],
        affectedPlants: ['Beans', 'Soybeans', 'Cowpeas', 'Lima beans']
      },
      {
        name: 'Cucumber Beetles',
        description: 'Yellow or striped beetles that feed on cucurbit plants and spread bacterial wilt.',
        symptoms: [
          'Holes in leaves and flowers',
          'Yellow or striped beetles',
          'Wilting and plant death (bacterial wilt)',
          'Reduced yields',
          'Damage to fruits'
        ],
        prevention: [
          'Use floating row covers until flowering',
          'Plant trap crops',
          'Practice crop rotation',
          'Remove plant debris',
          'Choose resistant varieties'
        ],
        treatment: [
          'Hand pick and destroy beetles',
          'Apply neem oil or pyrethrin',
          'Use spinosad-based insecticides',
          'Introduce beneficial insects',
          'Remove and destroy infected plants'
        ],
        affectedPlants: ['Cucumbers', 'Squash', 'Melons', 'Pumpkins', 'Zucchini']
      },
      {
        name: 'Wireworms',
        description: 'Yellow or brown larvae that feed on roots and seeds underground.',
        symptoms: [
          'Stunted growth',
          'Wilting plants',
          'Holes in roots and tubers',
          'Poor seed germination',
          'Most common in newly tilled soil'
        ],
        prevention: [
          'Practice crop rotation',
          'Till soil in fall to expose larvae',
          'Use trap crops (corn, wheat)',
          'Improve soil drainage',
          'Avoid planting in recently tilled grassland'
        ],
        treatment: [
          'Apply beneficial nematodes',
          'Use trap crops and destroy them',
          'Till soil to expose larvae',
          'Improve soil drainage',
          'Use resistant varieties'
        ],
        affectedPlants: ['Potatoes', 'Carrots', 'Corn', 'Beans', 'Wheat']
      },
      {
        name: 'Grubs',
        description: 'White C-shaped larvae of beetles that feed on roots, especially in lawns.',
        symptoms: [
          'Brown patches in lawn',
          'Turf lifts easily',
          'Stunted growth',
          'Root damage',
          'Birds and animals digging in lawn'
        ],
        prevention: [
          'Maintain healthy lawn',
          'Water deeply but infrequently',
          'Avoid over-fertilizing',
          'Encourage beneficial nematodes',
          'Practice good lawn care'
        ],
        treatment: [
          'Apply beneficial nematodes',
          'Use milky spore for Japanese beetle grubs',
          'Apply grub-specific insecticides',
          'Improve lawn health',
          'Reseed damaged areas'
        ],
        affectedPlants: ['Lawns', 'Turf grass', 'Root crops']
      },
      {
        name: 'Root-Knot Nematodes',
        description: 'Microscopic worms that cause galls on roots, reducing water and nutrient uptake.',
        symptoms: [
          'Stunted growth',
          'Yellowing leaves',
          'Swollen galls on roots',
          'Reduced yields',
          'Wilting despite adequate water'
        ],
        prevention: [
          'Practice crop rotation with resistant crops',
          'Solarize soil',
          'Use resistant varieties',
          'Add organic matter',
          'Avoid moving infested soil'
        ],
        treatment: [
          'Solarize soil',
          'Apply beneficial nematodes',
          'Use marigolds as cover crop',
          'Improve soil health',
          'Use resistant varieties'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Carrots', 'Beans', 'Most vegetables']
      },
      {
        name: 'Rodents (Mice, Rats, Voles)',
        description: 'Small mammals that feed on seeds, roots, and fruits.',
        symptoms: [
          'Missing seeds',
          'Gnawed roots and stems',
          'Tunnels in soil',
          'Damage to stored produce',
          'Nests in garden'
        ],
        prevention: [
          'Remove hiding places',
          'Use hardware cloth barriers',
          'Keep garden clean',
          'Use traps',
          'Encourage natural predators'
        ],
        treatment: [
          'Set up traps',
          'Use hardware cloth barriers',
          'Remove hiding places',
          'Apply repellents',
          'Encourage natural predators (cats, owls)'
        ],
        affectedPlants: ['All plants', 'Especially seeds', 'Root crops', 'Fruits']
      },
      {
        name: 'Birds',
        description: 'Birds that feed on seeds, fruits, and young plants.',
        symptoms: [
          'Missing seeds',
          'Pecked fruits',
          'Damaged seedlings',
          'Nests in garden',
          'Most active at dawn and dusk'
        ],
        prevention: [
          'Use bird netting',
          'Use scare devices (reflective tape, decoys)',
          'Plant extra seeds',
          'Use row covers',
          'Provide alternative food sources'
        ],
        treatment: [
          'Install bird netting',
          'Use scare devices',
          'Remove nests',
          'Use row covers',
          'Harvest fruits early'
        ],
        affectedPlants: ['Berries', 'Fruit trees', 'Seeds', 'Seedlings', 'Corn']
      },
      {
        name: 'Deer',
        description: 'Large mammals that browse on leaves, stems, and fruits.',
        symptoms: [
          'Browsed leaves and stems',
          'Torn or ragged damage',
          'Missing fruits',
          'Tracks in garden',
          'Damage up to 6 feet high'
        ],
        prevention: [
          'Install deer fencing (8+ feet tall)',
          'Use deer-resistant plants',
          'Apply repellents',
          'Use motion-activated sprinklers',
          'Plant in protected areas'
        ],
        treatment: [
          'Install deer fencing',
          'Apply repellents regularly',
          'Use motion-activated devices',
          'Plant deer-resistant varieties',
          'Use physical barriers'
        ],
        affectedPlants: ['Most plants', 'Especially vegetables', 'Fruit trees', 'Ornamentals']
      },
      {
        name: 'Rabbits',
        description: 'Small mammals that feed on tender plants, especially seedlings.',
        symptoms: [
          'Clean-cut damage at ground level',
          'Missing seedlings',
          'Bark damage on trees',
          'Tracks and droppings',
          'Damage up to 2 feet high'
        ],
        prevention: [
          'Install rabbit fencing (2 feet tall)',
          'Use hardware cloth around plants',
          'Remove hiding places',
          'Apply repellents',
          'Use row covers'
        ],
        treatment: [
          'Install rabbit fencing',
          'Use hardware cloth barriers',
          'Apply repellents',
          'Remove hiding places',
          'Use physical barriers'
        ],
        affectedPlants: ['Seedlings', 'Lettuce', 'Beans', 'Peas', 'Young trees']
      },
      {
        name: 'Gophers and Moles',
        description: 'Burrowing mammals that damage roots and create tunnels.',
        symptoms: [
          'Mounds of soil',
          'Tunnels in garden',
          'Wilting plants',
          'Missing roots',
          'Plants pulled underground'
        ],
        prevention: [
          'Install underground barriers',
          'Use gopher baskets for plants',
          'Remove food sources',
          'Use repellents',
          'Encourage natural predators'
        ],
        treatment: [
          'Use traps',
          'Install underground barriers',
          'Apply repellents',
          'Use gopher baskets',
          'Flood tunnels (for gophers)'
        ],
        affectedPlants: ['Root crops', 'All plants with roots', 'Lawns']
      }
    ]
  },
  {
    name: 'Diseases',
    description: 'Fungal, bacterial, and viral plant diseases',
    color: 'orange',
    icon: '🦠',
    issues: [
      {
        name: 'Powdery Mildew',
        description: 'Fungal disease that appears as white, powdery spots on leaves and stems.',
        symptoms: [
          'White or gray powdery coating on leaves',
          'Leaves may curl or distort',
          'Yellowing and premature leaf drop',
          'Stunted plant growth',
          'Reduced fruit production'
        ],
        prevention: [
          'Provide adequate spacing for air circulation',
          'Water at the base of plants, not on leaves',
          'Choose resistant varieties when available',
          'Avoid overhead watering',
          'Prune to improve air flow'
        ],
        treatment: [
          'Remove and destroy affected leaves',
          'Apply sulfur or potassium bicarbonate sprays',
          'Use neem oil or horticultural oils',
          'Improve air circulation around plants',
          'Apply baking soda solution (1 tsp per quart of water)'
        ],
        affectedPlants: ['Cucumbers', 'Squash', 'Zucchini', 'Roses', 'Peas', 'Grapes']
      },
      {
        name: 'Blossom End Rot',
        description: 'Physiological disorder caused by calcium deficiency and inconsistent watering.',
        symptoms: [
          'Dark, sunken spots on fruit bottoms',
          'Affects tomatoes, peppers, and squash',
          'Spots enlarge and become leathery',
          'Fruit may rot completely',
          'Usually appears on first fruits of season'
        ],
        prevention: [
          'Maintain consistent soil moisture',
          'Mulch to retain soil moisture',
          'Test soil pH (should be 6.5-7.0)',
          'Avoid excessive nitrogen fertilization',
          'Water deeply and regularly'
        ],
        treatment: [
          'Remove affected fruits immediately',
          'Improve watering consistency',
          'Apply calcium supplements (foliar or soil)',
          'Adjust soil pH if needed',
          'Maintain even soil moisture'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Eggplants', 'Squash', 'Watermelons']
      },
      {
        name: 'Early Blight',
        description: 'Fungal disease that causes dark spots with concentric rings on leaves and stems.',
        symptoms: [
          'Dark brown spots with target-like rings',
          'Yellowing leaves starting from bottom',
          'Stem lesions and cankers',
          'Fruit rot and drop',
          'Defoliation in severe cases'
        ],
        prevention: [
          'Use disease-free seeds and transplants',
          'Practice crop rotation (3-4 years)',
          'Space plants for good air circulation',
          'Water at base, avoid wetting foliage',
          'Remove and destroy infected plant debris'
        ],
        treatment: [
          'Remove affected leaves immediately',
          'Apply copper fungicides',
          'Use organic fungicides (Bacillus subtilis)',
          'Improve air circulation',
          'Mulch to prevent soil splash'
        ],
        affectedPlants: ['Tomatoes', 'Potatoes', 'Peppers', 'Eggplants']
      },
      {
        name: 'Root Rot',
        description: 'Fungal disease that attacks plant roots, causing wilting and plant death.',
        symptoms: [
          'Wilting despite adequate water',
          'Yellowing leaves',
          'Stunted growth',
          'Brown, mushy roots',
          'Plant collapse and death'
        ],
        prevention: [
          'Ensure good soil drainage',
          'Avoid overwatering',
          'Use well-draining soil mixes',
          'Don\'t plant too deeply',
          'Practice crop rotation'
        ],
        treatment: [
          'Improve drainage immediately',
          'Reduce watering frequency',
          'Remove and destroy affected plants',
          'Apply beneficial fungi (Trichoderma)',
          'Solarize soil for future plantings'
        ],
        affectedPlants: ['Most plants', 'Especially in containers', 'Overwatered plants']
      },
      {
        name: 'Leaf Spot',
        description: 'Fungal or bacterial disease causing circular or irregular spots on leaves.',
        symptoms: [
          'Circular or irregular spots on leaves',
          'Spots may have dark borders',
          'Yellow halos around spots',
          'Leaves may drop prematurely',
          'Reduced plant vigor'
        ],
        prevention: [
          'Water at base of plants',
          'Provide good air circulation',
          'Remove infected leaves promptly',
          'Avoid overhead watering',
          'Space plants appropriately'
        ],
        treatment: [
          'Remove and destroy affected leaves',
          'Apply copper fungicides for bacterial spots',
          'Use organic fungicides for fungal spots',
          'Improve air circulation',
          'Keep foliage dry'
        ],
        affectedPlants: ['Lettuce', 'Spinach', 'Tomatoes', 'Peppers', 'Ornamentals']
      },
      {
        name: 'Late Blight',
        description: 'Devastating fungal disease that rapidly destroys entire plants, especially tomatoes and potatoes.',
        symptoms: [
          'Water-soaked spots on leaves',
          'White mold on leaf undersides in humid conditions',
          'Dark, firm lesions on stems',
          'Rapid plant collapse',
          'Fruit rot with firm, brown spots'
        ],
        prevention: [
          'Use disease-free seeds and certified seed potatoes',
          'Practice crop rotation (3-4 years)',
          'Space plants for maximum air circulation',
          'Water at base, never on foliage',
          'Choose resistant varieties when available'
        ],
        treatment: [
          'Remove and destroy affected plants immediately',
          'Apply copper fungicides preventatively',
          'Use organic fungicides (Bacillus subtilis)',
          'Improve air circulation',
          'Avoid working in wet gardens'
        ],
        affectedPlants: ['Tomatoes', 'Potatoes', 'Peppers', 'Eggplants']
      },
      {
        name: 'Downy Mildew',
        description: 'Fungal disease that causes yellow patches on upper leaf surfaces and white or gray mold underneath.',
        symptoms: [
          'Yellow or pale green patches on upper leaf surfaces',
          'White, gray, or purple fuzzy growth on leaf undersides',
          'Leaves may curl and drop',
          'Stunted growth',
          'Most common in cool, humid conditions'
        ],
        prevention: [
          'Provide excellent air circulation',
          'Water at base of plants',
          'Space plants appropriately',
          'Choose resistant varieties',
          'Avoid overhead watering'
        ],
        treatment: [
          'Remove and destroy affected leaves',
          'Apply copper fungicides',
          'Use organic fungicides',
          'Improve air circulation',
          'Reduce humidity around plants'
        ],
        affectedPlants: ['Cucumbers', 'Squash', 'Lettuce', 'Spinach', 'Grapes', 'Roses']
      },
      {
        name: 'Rust',
        description: 'Fungal disease that produces rust-colored pustules on leaves and stems.',
        symptoms: [
          'Orange, yellow, or brown pustules on leaves',
          'Pustules may appear on stems',
          'Leaves yellow and drop prematurely',
          'Reduced plant vigor',
          'Spores rub off easily'
        ],
        prevention: [
          'Provide good air circulation',
          'Water at base of plants',
          'Remove infected leaves promptly',
          'Practice crop rotation',
          'Choose resistant varieties'
        ],
        treatment: [
          'Remove and destroy affected leaves',
          'Apply sulfur or copper fungicides',
          'Use organic fungicides',
          'Improve air circulation',
          'Avoid overhead watering'
        ],
        affectedPlants: ['Beans', 'Roses', 'Hollyhocks', 'Snapdragons', 'Ornamentals']
      },
      {
        name: 'Verticillium Wilt',
        description: 'Soil-borne fungal disease that clogs water-conducting tissues, causing wilting and death.',
        symptoms: [
          'Wilting starting on one side of plant',
          'Yellowing between leaf veins',
          'Brown discoloration in stem cross-section',
          'Stunted growth',
          'Plant death'
        ],
        prevention: [
          'Practice crop rotation (4-5 years)',
          'Choose resistant varieties',
          'Solarize soil before planting',
          'Avoid planting in infected soil',
          'Maintain soil health with organic matter'
        ],
        treatment: [
          'Remove and destroy affected plants',
          'Solarize soil for future plantings',
          'Use resistant varieties',
          'Improve soil drainage',
          'Avoid replanting susceptible crops'
        ],
        affectedPlants: ['Tomatoes', 'Potatoes', 'Eggplants', 'Peppers', 'Strawberries', 'Trees']
      },
      {
        name: 'Fusarium Wilt',
        description: 'Soil-borne fungal disease that causes yellowing, wilting, and plant death.',
        symptoms: [
          'Yellowing of lower leaves first',
          'Wilting that doesn\'t recover with watering',
          'Brown discoloration in stem',
          'Stunted growth',
          'Plant death'
        ],
        prevention: [
          'Use disease-free seeds and transplants',
          'Practice crop rotation (4-5 years)',
          'Choose resistant varieties',
          'Solarize soil',
          'Maintain proper soil pH'
        ],
        treatment: [
          'Remove and destroy affected plants',
          'Solarize soil',
          'Use resistant varieties',
          'Improve soil drainage',
          'Avoid replanting susceptible crops'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Bananas', 'Cucumbers', 'Melons']
      },
      {
        name: 'Bacterial Wilt',
        description: 'Bacterial disease that causes rapid wilting and death, especially in cucurbits.',
        symptoms: [
          'Rapid wilting of entire plant',
          'Leaves remain green but droop',
          'Sticky, milky sap from cut stems',
          'Plant death within days',
          'Most common in warm, wet conditions'
        ],
        prevention: [
          'Control cucumber beetles (vectors)',
          'Use floating row covers',
          'Practice crop rotation',
          'Remove infected plants immediately',
          'Choose resistant varieties'
        ],
        treatment: [
          'Remove and destroy affected plants immediately',
          'Control cucumber beetles',
          'Solarize soil',
          'Use resistant varieties',
          'Avoid working in wet gardens'
        ],
        affectedPlants: ['Cucumbers', 'Squash', 'Melons', 'Pumpkins', 'Zucchini']
      },
      {
        name: 'Anthracnose',
        description: 'Fungal disease that causes dark, sunken lesions on fruits, leaves, and stems.',
        symptoms: [
          'Dark, sunken spots on fruits',
          'Brown or black spots on leaves',
          'Lesions on stems',
          'Fruit rot',
          'Premature fruit drop'
        ],
        prevention: [
          'Use disease-free seeds',
          'Practice crop rotation',
          'Provide good air circulation',
          'Water at base of plants',
          'Remove plant debris'
        ],
        treatment: [
          'Remove and destroy affected plant parts',
          'Apply copper fungicides',
          'Use organic fungicides',
          'Improve air circulation',
          'Keep foliage dry'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Beans', 'Cucumbers', 'Fruit trees']
      },
      {
        name: 'Clubroot',
        description: 'Soil-borne disease that causes swollen, distorted roots, especially in brassicas.',
        symptoms: [
          'Swollen, distorted roots',
          'Stunted, yellowing plants',
          'Wilting in hot weather',
          'Reduced yields',
          'Plants may die'
        ],
        prevention: [
          'Practice long crop rotation (7+ years)',
          'Raise soil pH to 7.0-7.2',
          'Use resistant varieties',
          'Improve soil drainage',
          'Solarize soil'
        ],
        treatment: [
          'Remove and destroy affected plants',
          'Raise soil pH with lime',
          'Practice long crop rotation',
          'Use resistant varieties',
          'Improve soil drainage'
        ],
        affectedPlants: ['Cabbage', 'Broccoli', 'Cauliflower', 'Brussels sprouts', 'Radishes']
      },
      {
        name: 'Septoria Leaf Spot',
        description: 'Fungal disease that causes small, circular spots with dark borders on tomato and other plant leaves.',
        symptoms: [
          'Small circular spots with dark borders',
          'Yellow halos around spots',
          'Spots merge and leaves yellow',
          'Defoliation starting from bottom',
          'Reduced yields'
        ],
        prevention: [
          'Use disease-free seeds',
          'Practice crop rotation',
          'Space plants for air circulation',
          'Water at base of plants',
          'Remove plant debris'
        ],
        treatment: [
          'Remove and destroy affected leaves',
          'Apply copper fungicides',
          'Use organic fungicides',
          'Improve air circulation',
          'Mulch to prevent soil splash'
        ],
        affectedPlants: ['Tomatoes', 'Potatoes', 'Peppers', 'Celery']
      },
      {
        name: 'Alternaria',
        description: 'Fungal disease causing dark, target-like spots on leaves, stems, and fruits.',
        symptoms: [
          'Dark spots with concentric rings',
          'Yellowing leaves',
          'Stem cankers',
          'Fruit rot',
          'Premature defoliation'
        ],
        prevention: [
          'Use disease-free seeds',
          'Practice crop rotation',
          'Provide good air circulation',
          'Water at base of plants',
          'Remove plant debris'
        ],
        treatment: [
          'Remove and destroy affected plant parts',
          'Apply copper fungicides',
          'Use organic fungicides',
          'Improve air circulation',
          'Keep foliage dry'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Cabbage', 'Carrots', 'Potatoes']
      },
      {
        name: 'Botrytis (Gray Mold)',
        description: 'Fungal disease that causes gray, fuzzy mold on fruits, flowers, and leaves.',
        symptoms: [
          'Gray, fuzzy mold',
          'Soft, rotting tissue',
          'Most common in cool, humid conditions',
          'Flower and fruit rot',
          'Rapid spread'
        ],
        prevention: [
          'Provide excellent air circulation',
          'Avoid overhead watering',
          'Remove dead plant material',
          'Space plants appropriately',
          'Keep foliage dry'
        ],
        treatment: [
          'Remove and destroy affected plant parts',
          'Improve air circulation',
          'Apply fungicides',
          'Reduce humidity',
          'Keep plants dry'
        ],
        affectedPlants: ['Strawberries', 'Tomatoes', 'Lettuce', 'Grapes', 'Ornamentals']
      },
      {
        name: 'Sclerotinia (White Mold)',
        description: 'Fungal disease that causes white, cottony growth and plant collapse.',
        symptoms: [
          'White, cottony growth',
          'Water-soaked lesions',
          'Plant collapse',
          'Hard, black sclerotia in soil',
          'Most common in cool, wet conditions'
        ],
        prevention: [
          'Practice crop rotation (3-4 years)',
          'Improve air circulation',
          'Avoid overhead watering',
          'Remove plant debris',
          'Solarize soil'
        ],
        treatment: [
          'Remove and destroy affected plants',
          'Solarize soil',
          'Improve air circulation',
          'Practice long crop rotation',
          'Use resistant varieties'
        ],
        affectedPlants: ['Beans', 'Lettuce', 'Carrots', 'Cabbage', 'Tomatoes']
      },
      {
        name: 'Damping Off',
        description: 'Fungal disease that kills seedlings before or after they emerge from soil.',
        symptoms: [
          'Seedlings collapse at soil line',
          'Water-soaked, discolored stems',
          'Seedlings fail to emerge',
          'Rapid death of seedlings',
          'Most common in cool, wet conditions'
        ],
        prevention: [
          'Use sterile seed starting mix',
          'Avoid overwatering',
          'Provide good air circulation',
          'Use clean containers',
          'Don\'t plant seeds too deeply'
        ],
        treatment: [
          'Remove affected seedlings',
          'Improve air circulation',
          'Reduce watering',
          'Use fungicide-treated seeds',
          'Start over with sterile mix'
        ],
        affectedPlants: ['All seedlings', 'Especially in containers']
      },
      {
        name: 'Mosaic Viruses',
        description: 'Viral diseases that cause mottled, distorted leaves and reduced growth.',
        symptoms: [
          'Mottled, yellow and green leaves',
          'Distorted, curled leaves',
          'Stunted growth',
          'Reduced yields',
          'No cure once infected'
        ],
        prevention: [
          'Use virus-free seeds and plants',
          'Control aphids and other vectors',
          'Practice good sanitation',
          'Remove infected plants immediately',
          'Avoid working in wet gardens'
        ],
        treatment: [
          'Remove and destroy infected plants',
          'Control insect vectors',
          'Practice good sanitation',
          'Use resistant varieties',
          'Start over with clean plants'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Cucumbers', 'Squash', 'Beans']
      },
      {
        name: 'Curly Top Virus',
        description: 'Viral disease spread by leafhoppers that causes curled, yellow leaves.',
        symptoms: [
          'Curled, yellow leaves',
          'Thickened, brittle leaves',
          'Stunted growth',
          'Reduced yields',
          'No cure once infected'
        ],
        prevention: [
          'Control leafhoppers',
          'Use floating row covers',
          'Remove weeds that host leafhoppers',
          'Plant early or late',
          'Use resistant varieties'
        ],
        treatment: [
          'Remove and destroy infected plants',
          'Control leafhoppers',
          'Use resistant varieties',
          'Start over with clean plants',
          'No effective treatment'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Beans', 'Beets', 'Spinach']
      },
      {
        name: 'Bacterial Spot',
        description: 'Bacterial disease causing small, water-soaked spots on leaves and fruits.',
        symptoms: [
          'Small, water-soaked spots',
          'Spots become brown with yellow halos',
          'Fruit spots become raised and scabby',
          'Leaf drop',
          'Reduced yields'
        ],
        prevention: [
          'Use disease-free seeds',
          'Practice crop rotation',
          'Avoid overhead watering',
          'Space plants for air circulation',
          'Don\'t work in wet gardens'
        ],
        treatment: [
          'Remove and destroy affected plant parts',
          'Apply copper fungicides',
          'Improve air circulation',
          'Keep foliage dry',
          'Practice good sanitation'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Peaches', 'Plums']
      },
      {
        name: 'Fire Blight',
        description: 'Bacterial disease that causes blackened, scorched appearance on trees.',
        symptoms: [
          'Blackened, scorched appearance',
          'Shepherd\'s crook on branches',
          'Oozing cankers',
          'Rapid spread',
          'Tree death possible'
        ],
        prevention: [
          'Prune in dry weather',
          'Disinfect pruning tools',
          'Choose resistant varieties',
          'Avoid excessive nitrogen',
          'Remove infected branches'
        ],
        treatment: [
          'Prune infected branches 12 inches below damage',
          'Disinfect tools between cuts',
          'Apply copper sprays',
          'Remove and destroy infected material',
          'Use resistant varieties'
        ],
        affectedPlants: ['Apples', 'Pears', 'Quince', 'Hawthorn', 'Roses']
      },
      {
        name: 'Scab',
        description: 'Fungal disease causing scabby lesions on fruits and leaves.',
        symptoms: [
          'Scabby, corky lesions on fruits',
          'Olive-green spots on leaves',
          'Premature fruit drop',
          'Reduced fruit quality',
          'Most common in wet conditions'
        ],
        prevention: [
          'Choose resistant varieties',
          'Provide good air circulation',
          'Remove fallen leaves and fruits',
          'Practice good sanitation',
          'Avoid overhead watering'
        ],
        treatment: [
          'Remove and destroy affected fruits and leaves',
          'Apply fungicides',
          'Improve air circulation',
          'Practice good sanitation',
          'Use resistant varieties'
        ],
        affectedPlants: ['Apples', 'Pears', 'Potatoes', 'Cucumbers']
      },
      {
        name: 'Black Rot',
        description: 'Fungal disease causing black, rotted areas on fruits and vegetables.',
        symptoms: [
          'Black, rotted areas',
          'V-shaped lesions on leaves',
          'Fruit rot',
          'Premature fruit drop',
          'Most common in warm, humid conditions'
        ],
        prevention: [
          'Use disease-free seeds',
          'Practice crop rotation',
          'Remove plant debris',
          'Provide good air circulation',
          'Avoid overhead watering'
        ],
        treatment: [
          'Remove and destroy affected plant parts',
          'Apply fungicides',
          'Improve air circulation',
          'Practice good sanitation',
          'Use resistant varieties'
        ],
        affectedPlants: ['Cabbage', 'Grapes', 'Apples', 'Crucifers']
      },
      {
        name: 'Phytophthora',
        description: 'Water mold that causes root rot, crown rot, and plant death.',
        symptoms: [
          'Root and crown rot',
          'Wilting and plant death',
          'Dark, water-soaked lesions',
          'Rapid plant collapse',
          'Most common in wet conditions'
        ],
        prevention: [
          'Ensure excellent drainage',
          'Avoid overwatering',
          'Use well-draining soil',
          'Practice crop rotation',
          'Solarize soil'
        ],
        treatment: [
          'Improve drainage immediately',
          'Remove and destroy affected plants',
          'Solarize soil',
          'Use resistant varieties',
          'Apply fungicides preventatively'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Potatoes', 'Cucumbers', 'Trees']
      },
      {
        name: 'Pythium',
        description: 'Water mold that causes damping off and root rot in seedlings and young plants.',
        symptoms: [
          'Damping off of seedlings',
          'Root rot',
          'Wilting and plant death',
          'Water-soaked, discolored roots',
          'Most common in wet, cool conditions'
        ],
        prevention: [
          'Use sterile seed starting mix',
          'Avoid overwatering',
          'Ensure good drainage',
          'Provide good air circulation',
          'Use clean containers'
        ],
        treatment: [
          'Remove affected plants',
          'Improve drainage',
          'Reduce watering',
          'Apply fungicides',
          'Start over with sterile mix'
        ],
        affectedPlants: ['All seedlings', 'Especially in containers', 'Young plants']
      }
    ]
  },
  {
    name: 'Nutritional Problems',
    description: 'Nutrient deficiencies and imbalances',
    color: 'yellow',
    icon: '🌱',
    issues: [
      {
        name: 'Nitrogen Deficiency',
        description: 'Lack of nitrogen causes yellowing of older leaves and stunted growth.',
        symptoms: [
          'Yellowing of older leaves (starting from bottom)',
          'Stunted plant growth',
          'Reduced fruit production',
          'Pale green or yellow overall appearance',
          'Leaves may drop prematurely'
        ],
        prevention: [
          'Test soil regularly',
          'Add organic matter (compost, manure)',
          'Use balanced fertilizers',
          'Practice crop rotation with legumes',
          'Maintain proper soil pH'
        ],
        treatment: [
          'Apply nitrogen-rich fertilizers',
          'Side-dress with compost or aged manure',
          'Use fish emulsion or blood meal',
          'Apply foliar nitrogen sprays',
          'Improve soil organic matter'
        ],
        affectedPlants: ['All plants', 'Especially heavy feeders like corn and tomatoes']
      },
      {
        name: 'Phosphorus Deficiency',
        description: 'Lack of phosphorus causes purpling of leaves and poor root development.',
        symptoms: [
          'Purple or reddish coloring on leaves',
          'Stunted growth',
          'Poor root development',
          'Delayed flowering and fruiting',
          'Dark green leaves with purple undersides'
        ],
        prevention: [
          'Test soil pH (phosphorus availability decreases in acidic soils)',
          'Add bone meal or rock phosphate',
          'Incorporate compost and organic matter',
          'Maintain proper soil pH (6.0-7.0)',
          'Use phosphorus-rich fertilizers'
        ],
        treatment: [
          'Apply phosphorus fertilizers',
          'Add bone meal to soil',
          'Adjust soil pH if too acidic',
          'Use compost tea with phosphorus',
          'Side-dress with phosphorus-rich amendments'
        ],
        affectedPlants: ['All plants', 'Especially during flowering and fruiting']
      },
      {
        name: 'Potassium Deficiency',
        description: 'Lack of potassium causes leaf edge browning and weak stems.',
        symptoms: [
          'Brown or yellow edges on older leaves',
          'Weak stems and lodging',
          'Reduced disease resistance',
          'Poor fruit quality',
          'Leaf curling and scorching'
        ],
        prevention: [
          'Test soil regularly',
          'Add wood ash (in moderation)',
          'Use potassium-rich fertilizers',
          'Incorporate compost',
          'Maintain proper soil pH'
        ],
        treatment: [
          'Apply potassium fertilizers (potash)',
          'Add wood ash to soil',
          'Use kelp meal or seaweed extracts',
          'Apply foliar potassium sprays',
          'Improve soil organic matter'
        ],
        affectedPlants: ['All plants', 'Especially fruiting vegetables']
      },
      {
        name: 'Calcium Deficiency',
        description: 'Lack of calcium causes blossom end rot and poor root development.',
        symptoms: [
          'Blossom end rot in fruits',
          'Tip burn in lettuce and cabbage',
          'Stunted root growth',
          'New leaves may be distorted',
          'Poor fruit quality'
        ],
        prevention: [
          'Test soil pH and adjust if needed',
          'Add lime to acidic soils',
          'Maintain consistent soil moisture',
          'Incorporate gypsum in heavy soils',
          'Use calcium-rich amendments'
        ],
        treatment: [
          'Apply calcium supplements (lime, gypsum)',
          'Use foliar calcium sprays',
          'Improve watering consistency',
          'Add eggshells or bone meal',
          'Adjust soil pH to 6.5-7.0'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Cabbage', 'Lettuce', 'Apples']
      },
      {
        name: 'Iron Deficiency',
        description: 'Lack of iron causes yellowing between leaf veins, especially in new growth.',
        symptoms: [
          'Yellowing between leaf veins (interveinal chlorosis)',
          'New leaves most affected',
          'Veins remain green',
          'Stunted growth',
          'Most common in alkaline soils'
        ],
        prevention: [
          'Test and adjust soil pH (iron less available above pH 7)',
          'Add organic matter to improve iron availability',
          'Use iron-rich amendments',
          'Avoid over-liming',
          'Improve soil drainage'
        ],
        treatment: [
          'Apply chelated iron fertilizers',
          'Use foliar iron sprays',
          'Lower soil pH if too alkaline',
          'Add compost and organic matter',
          'Apply iron sulfate'
        ],
        affectedPlants: ['Azaleas', 'Rhododendrons', 'Blueberries', 'Citrus', 'Ornamentals']
      },
      {
        name: 'Magnesium Deficiency',
        description: 'Lack of magnesium causes yellowing between leaf veins, starting with older leaves.',
        symptoms: [
          'Yellowing between leaf veins on older leaves',
          'Veins remain green',
          'Leaves may curl upward',
          'Reduced fruit production',
          'Premature leaf drop'
        ],
        prevention: [
          'Test soil regularly',
          'Add dolomitic lime if pH is low',
          'Incorporate compost',
          'Use balanced fertilizers',
          'Maintain proper soil pH'
        ],
        treatment: [
          'Apply Epsom salt (magnesium sulfate)',
          'Use dolomitic lime',
          'Apply magnesium-rich fertilizers',
          'Use foliar magnesium sprays',
          'Add compost and organic matter'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Roses', 'Fruit trees', 'Most vegetables']
      },
      {
        name: 'Sulfur Deficiency',
        description: 'Lack of sulfur causes overall yellowing, similar to nitrogen deficiency but affects new growth first.',
        symptoms: [
          'Yellowing of new leaves first',
          'Stunted growth',
          'Thin, spindly stems',
          'Reduced yields',
          'Similar to nitrogen deficiency but affects new growth'
        ],
        prevention: [
          'Add organic matter (compost, manure)',
          'Use sulfur-containing fertilizers',
          'Test soil regularly',
          'Maintain soil organic matter',
          'Use balanced fertilizers'
        ],
        treatment: [
          'Apply sulfur or sulfate fertilizers',
          'Add compost and organic matter',
          'Use gypsum (calcium sulfate)',
          'Apply elemental sulfur to lower pH',
          'Use balanced fertilizers'
        ],
        affectedPlants: ['All plants', 'Especially in sandy, low-organic-matter soils']
      },
      {
        name: 'Zinc Deficiency',
        description: 'Lack of zinc causes small, distorted leaves and reduced growth.',
        symptoms: [
          'Small, distorted leaves',
          'Yellowing between veins',
          'Reduced leaf size',
          'Stunted growth',
          'Poor fruit development'
        ],
        prevention: [
          'Test soil pH (zinc less available in alkaline soils)',
          'Add organic matter',
          'Use balanced fertilizers',
          'Avoid over-liming',
          'Maintain proper soil pH'
        ],
        treatment: [
          'Apply zinc sulfate',
          'Use foliar zinc sprays',
          'Lower soil pH if too alkaline',
          'Add compost and organic matter',
          'Use zinc chelates'
        ],
        affectedPlants: ['Corn', 'Beans', 'Fruit trees', 'Citrus', 'Ornamentals']
      },
      {
        name: 'Manganese Deficiency',
        description: 'Lack of manganese causes yellowing between veins and reduced growth.',
        symptoms: [
          'Yellowing between leaf veins',
          'Brown spots on leaves',
          'Stunted growth',
          'Reduced yields',
          'Most common in alkaline soils'
        ],
        prevention: [
          'Test and adjust soil pH',
          'Add organic matter',
          'Avoid over-liming',
          'Improve soil drainage',
          'Use balanced fertilizers'
        ],
        treatment: [
          'Apply manganese sulfate',
          'Use foliar manganese sprays',
          'Lower soil pH if too alkaline',
          'Add compost',
          'Improve soil drainage'
        ],
        affectedPlants: ['Oats', 'Wheat', 'Beans', 'Peas', 'Ornamentals']
      },
      {
        name: 'Boron Deficiency',
        description: 'Lack of boron causes distorted growth, cracked stems, and poor fruit development.',
        symptoms: [
          'Distorted, thickened leaves',
          'Cracked stems',
          'Poor fruit development',
          'Death of growing points',
          'Hollow or cracked fruits'
        ],
        prevention: [
          'Test soil regularly',
          'Add organic matter',
          'Maintain proper soil pH',
          'Use balanced fertilizers',
          'Avoid over-liming'
        ],
        treatment: [
          'Apply borax or boric acid (use carefully - toxic in excess)',
          'Use foliar boron sprays',
          'Add compost',
          'Maintain proper soil pH',
          'Use balanced fertilizers'
        ],
        affectedPlants: ['Beets', 'Broccoli', 'Cauliflower', 'Apples', 'Celery']
      },
      {
        name: 'Copper Deficiency',
        description: 'Lack of copper causes distorted growth and reduced yields.',
        symptoms: [
          'Distorted, twisted leaves',
          'Stunted growth',
          'Reduced yields',
          'Dieback of growing tips',
          'Most common in sandy, acidic soils'
        ],
        prevention: [
          'Test soil regularly',
          'Maintain proper soil pH',
          'Add organic matter',
          'Use balanced fertilizers',
          'Avoid over-liming'
        ],
        treatment: [
          'Apply copper sulfate',
          'Use foliar copper sprays',
          'Add compost',
          'Adjust soil pH',
          'Use balanced fertilizers'
        ],
        affectedPlants: ['Wheat', 'Oats', 'Corn', 'Fruit trees']
      },
      {
        name: 'Molybdenum Deficiency',
        description: 'Lack of molybdenum causes yellowing and reduced nitrogen fixation.',
        symptoms: [
          'Yellowing between veins',
          'Reduced growth',
          'Poor nitrogen fixation in legumes',
          'Cupped or rolled leaves',
          'Most common in acidic soils'
        ],
        prevention: [
          'Test and adjust soil pH',
          'Add organic matter',
          'Use balanced fertilizers',
          'Maintain proper soil pH',
          'Avoid over-acidifying'
        ],
        treatment: [
          'Apply lime to raise pH',
          'Use molybdenum supplements',
          'Add compost',
          'Adjust soil pH',
          'Use balanced fertilizers'
        ],
        affectedPlants: ['Legumes', 'Brassicas', 'Cauliflower', 'Broccoli']
      },
      {
        name: 'Chlorine Deficiency',
        description: 'Rare deficiency that causes wilting and reduced growth.',
        symptoms: [
          'Wilting',
          'Reduced growth',
          'Yellowing leaves',
          'Bronzing of leaves',
          'Very rare in most soils'
        ],
        prevention: [
          'Use quality water sources',
          'Maintain soil health',
          'Add organic matter',
          'Use balanced fertilizers',
          'Test soil regularly'
        ],
        treatment: [
          'Use quality water sources',
          'Add compost',
          'Use balanced fertilizers',
          'Improve soil health',
          'Very rarely needs treatment'
        ],
        affectedPlants: ['All plants', 'Very rare']
      },
      {
        name: 'Over-Fertilization',
        description: 'Excessive fertilizer causes salt burn, reduced growth, and environmental damage.',
        symptoms: [
          'Burned leaf edges',
          'Wilting despite adequate water',
          'Stunted growth',
          'Reduced yields',
          'White crust on soil surface'
        ],
        prevention: [
          'Test soil before fertilizing',
          'Follow fertilizer instructions',
          'Use organic fertilizers',
          'Fertilize based on plant needs',
          'Avoid over-fertilizing'
        ],
        treatment: [
          'Leach soil with deep watering',
          'Remove excess fertilizer',
          'Improve drainage',
          'Add organic matter',
          'Wait before fertilizing again'
        ],
        affectedPlants: ['All plants', 'Especially in containers']
      },
      {
        name: 'pH Problems',
        description: 'Soil pH that is too high or too low prevents nutrient availability.',
        symptoms: [
          'Nutrient deficiencies',
          'Stunted growth',
          'Yellowing leaves',
          'Poor yields',
          'Symptoms vary by pH level'
        ],
        prevention: [
          'Test soil pH regularly',
          'Know your plant\'s pH preferences',
          'Adjust pH gradually',
          'Add organic matter',
          'Monitor pH over time'
        ],
        treatment: [
          'Test soil pH',
          'Add lime to raise pH (if too acidic)',
          'Add sulfur to lower pH (if too alkaline)',
          'Add organic matter',
          'Adjust gradually over time'
        ],
        affectedPlants: ['All plants', 'pH preferences vary by plant']
      }
    ]
  },
  {
    name: 'Environmental Issues',
    description: 'Problems caused by growing conditions',
    color: 'blue',
    icon: '🌡️',
    issues: [
      {
        name: 'Sunburn',
        description: 'Damage caused by excessive direct sunlight, especially on fruits and tender leaves.',
        symptoms: [
          'White or bleached patches on leaves',
          'Brown, leathery spots on fruits',
          'Wilting during hottest part of day',
          'Leaf scorching and browning',
          'Most common on south or west-facing sides'
        ],
        prevention: [
          'Provide afternoon shade for sensitive plants',
          'Use shade cloth during heat waves',
          'Water deeply to help plants cope',
          'Mulch to keep roots cool',
          'Choose heat-tolerant varieties'
        ],
        treatment: [
          'Move container plants to shadier location',
          'Install temporary shade structures',
          'Increase watering frequency',
          'Remove severely damaged leaves',
          'Protect fruits with shade cloth'
        ],
        affectedPlants: ['Lettuce', 'Spinach', 'Peppers', 'Tomatoes', 'Cucumbers']
      },
      {
        name: 'Frost Damage',
        description: 'Damage caused by freezing temperatures, especially on tender plants.',
        symptoms: [
          'Blackened or translucent leaves',
          'Wilting after frost',
          'Stem damage and splitting',
          'Complete plant collapse',
          'Damage appears within hours of frost'
        ],
        prevention: [
          'Know your last frost date',
          'Cover plants with frost cloth or blankets',
          'Use cold frames or cloches',
          'Choose frost-tolerant varieties',
          'Plant in protected microclimates'
        ],
        treatment: [
          'Cover plants before frost',
          'Water soil before frost (releases heat)',
          'Remove damaged parts after frost',
          'Wait to see if plant recovers',
          'Protect with mulch around base'
        ],
        affectedPlants: ['Tomatoes', 'Peppers', 'Basil', 'Tender annuals']
      },
      {
        name: 'Overwatering',
        description: 'Excessive water causes root suffocation and fungal problems.',
        symptoms: [
          'Wilting despite wet soil',
          'Yellowing leaves',
          'Root rot and mushy roots',
          'Mold or algae on soil surface',
          'Stunted growth'
        ],
        prevention: [
          'Check soil before watering',
          'Use well-draining soil',
          'Ensure containers have drainage holes',
          'Water deeply but less frequently',
          'Adjust watering based on weather'
        ],
        treatment: [
          'Reduce watering frequency',
          'Improve soil drainage',
          'Remove standing water',
          'Repot with fresh, well-draining soil',
          'Allow soil to dry between waterings'
        ],
        affectedPlants: ['All plants', 'Especially in containers']
      },
      {
        name: 'Underwatering',
        description: 'Insufficient water causes wilting, stress, and reduced yields.',
        symptoms: [
          'Wilting and drooping leaves',
          'Dry, crispy leaf edges',
          'Soil pulling away from container edges',
          'Reduced growth and yields',
          'Flower and fruit drop'
        ],
        prevention: [
          'Water deeply and regularly',
          'Mulch to retain soil moisture',
          'Use self-watering containers',
          'Group plants with similar water needs',
          'Monitor soil moisture regularly'
        ],
        treatment: [
          'Water deeply immediately',
          'Increase watering frequency',
          'Add mulch to retain moisture',
          'Soak containers in water if severely dry',
          'Provide shade during recovery'
        ],
        affectedPlants: ['All plants', 'Especially in hot weather']
      },
      {
        name: 'Wind Damage',
        description: 'Strong winds cause physical damage and desiccation.',
        symptoms: [
          'Broken stems and branches',
          'Torn or tattered leaves',
          'Plants leaning or uprooted',
          'Desiccated (dried out) leaves',
          'Reduced growth on exposed side'
        ],
        prevention: [
          'Install windbreaks or barriers',
          'Stake tall plants',
          'Choose wind-tolerant varieties',
          'Plant in protected locations',
          'Use trellises for support'
        ],
        treatment: [
          'Stake damaged plants',
          'Prune broken branches',
          'Provide temporary wind protection',
          'Water to help recovery',
          'Replant if uprooted'
        ],
        affectedPlants: ['Tall plants', 'Tomatoes', 'Peppers', 'Corn', 'Trees']
      },
      {
        name: 'Heat Stress',
        description: 'Excessive heat causes wilting, sunscald, and reduced growth.',
        symptoms: [
          'Wilting during hottest part of day',
          'Sunscald on fruits and leaves',
          'Flower and fruit drop',
          'Reduced growth',
          'Leaf curling or cupping'
        ],
        prevention: [
          'Provide afternoon shade',
          'Use shade cloth during heat waves',
          'Water deeply and regularly',
          'Mulch to keep roots cool',
          'Choose heat-tolerant varieties'
        ],
        treatment: [
          'Provide temporary shade',
          'Increase watering frequency',
          'Mulch around plants',
          'Move container plants to shadier location',
          'Mist plants in early morning'
        ],
        affectedPlants: ['Lettuce', 'Spinach', 'Peas', 'Cool-season crops', 'Most plants in extreme heat']
      },
      {
        name: 'Cold Stress',
        description: 'Temperatures below plant tolerance cause damage and reduced growth.',
        symptoms: [
          'Wilting and drooping',
          'Darkened or water-soaked leaves',
          'Stunted growth',
          'Delayed flowering',
          'Plant death in severe cases'
        ],
        prevention: [
          'Know your plant\'s cold tolerance',
          'Cover plants before cold snaps',
          'Use cold frames or cloches',
          'Choose cold-tolerant varieties',
          'Plant in protected microclimates'
        ],
        treatment: [
          'Cover plants with frost cloth or blankets',
          'Move container plants indoors',
          'Water soil before cold (releases heat)',
          'Remove damaged parts after cold',
          'Provide heat sources for critical plants'
        ],
        affectedPlants: ['Tender annuals', 'Tropical plants', 'Warm-season vegetables']
      },
      {
        name: 'Transplant Shock',
        description: 'Stress plants experience when moved, causing wilting and slowed growth.',
        symptoms: [
          'Wilting after transplanting',
          'Yellowing leaves',
          'Stunted growth',
          'Leaf drop',
          'Slow recovery'
        ],
        prevention: [
          'Harden off seedlings gradually',
          'Transplant on cloudy days or evening',
          'Water thoroughly before and after',
          'Minimize root disturbance',
          'Transplant at right time for plant'
        ],
        treatment: [
          'Water deeply and regularly',
          'Provide temporary shade',
          'Avoid fertilizing immediately',
          'Protect from wind and sun',
          'Be patient - recovery takes time'
        ],
        affectedPlants: ['All transplanted plants', 'Especially seedlings']
      },
      {
        name: 'Soil Compaction',
        description: 'Dense, compressed soil restricts root growth and water movement.',
        symptoms: [
          'Stunted growth',
          'Poor root development',
          'Water pooling on surface',
          'Difficulty inserting tools',
          'Reduced yields'
        ],
        prevention: [
          'Avoid working wet soil',
          'Use raised beds',
          'Add organic matter regularly',
          'Minimize foot traffic in beds',
          'Use wide paths between beds'
        ],
        treatment: [
          'Add organic matter (compost, aged manure)',
          'Use cover crops to break up soil',
          'Double dig or till (when dry)',
          'Create raised beds',
          'Improve drainage'
        ],
        affectedPlants: ['All plants', 'Especially root crops', 'Heavy feeders']
      },
      {
        name: 'Poor Drainage',
        description: 'Excess water in soil causes root suffocation and disease.',
        symptoms: [
          'Water pooling on surface',
          'Wilting despite wet soil',
          'Yellowing leaves',
          'Root rot',
          'Stunted growth'
        ],
        prevention: [
          'Test soil drainage before planting',
          'Create raised beds',
          'Add organic matter to improve structure',
          'Avoid overwatering',
          'Choose well-draining locations'
        ],
        treatment: [
          'Improve soil structure with organic matter',
          'Create raised beds',
          'Install drainage systems',
          'Reduce watering frequency',
          'Add sand or perlite to heavy soils'
        ],
        affectedPlants: ['All plants', 'Especially in heavy clay soils']
      },
      {
        name: 'Salt Buildup',
        description: 'Excessive salts in soil cause leaf burn and reduced growth.',
        symptoms: [
          'Brown leaf edges and tips',
          'Stunted growth',
          'Wilting despite adequate water',
          'White crust on soil surface',
          'Reduced yields'
        ],
        prevention: [
          'Use quality water sources',
          'Avoid over-fertilizing',
          'Water deeply to leach salts',
          'Test soil regularly',
          'Use organic fertilizers'
        ],
        treatment: [
          'Leach soil with deep watering',
          'Improve drainage',
          'Add organic matter',
          'Reduce fertilizer use',
          'Use quality water sources'
        ],
        affectedPlants: ['All plants', 'Especially in containers', 'Areas with hard water']
      },
      {
        name: 'Light Deficiency',
        description: 'Insufficient light causes leggy growth and poor flowering.',
        symptoms: [
          'Leggy, stretched growth',
          'Small, pale leaves',
          'Reduced flowering',
          'Plants leaning toward light',
          'Weak stems'
        ],
        prevention: [
          'Choose appropriate plants for light conditions',
          'Provide adequate light for plant needs',
          'Prune surrounding plants if needed',
          'Use grow lights for indoor plants',
          'Position plants correctly'
        ],
        treatment: [
          'Move plants to brighter location',
          'Prune to allow more light',
          'Use grow lights',
          'Reflect light with mirrors or white surfaces',
          'Choose shade-tolerant varieties'
        ],
        affectedPlants: ['All plants', 'Especially flowering plants', 'Indoor plants']
      },
      {
        name: 'Light Excess',
        description: 'Too much direct sunlight causes leaf burn and stress.',
        symptoms: [
          'Bleached or scorched leaves',
          'Brown leaf edges',
          'Wilting in afternoon',
          'Reduced growth',
          'Flower and fruit drop'
        ],
        prevention: [
          'Choose appropriate plants for light conditions',
          'Provide afternoon shade for sensitive plants',
          'Use shade cloth during peak sun',
          'Position plants correctly',
          'Choose sun-tolerant varieties'
        ],
        treatment: [
          'Provide temporary shade',
          'Move container plants to shadier location',
          'Increase watering',
          'Use shade cloth',
          'Prune to create dappled shade'
        ],
        affectedPlants: ['Shade-loving plants', 'Tender seedlings', 'Cool-season crops']
      },
      {
        name: 'Drought Stress',
        description: 'Prolonged lack of water causes wilting, reduced growth, and plant death.',
        symptoms: [
          'Wilting and drooping',
          'Dry, crispy leaves',
          'Reduced growth',
          'Flower and fruit drop',
          'Plant death in severe cases'
        ],
        prevention: [
          'Water deeply and regularly',
          'Mulch to retain moisture',
          'Choose drought-tolerant varieties',
          'Improve soil organic matter',
          'Use efficient irrigation'
        ],
        treatment: [
          'Water deeply immediately',
          'Increase watering frequency',
          'Add mulch',
          'Provide shade temporarily',
          'Improve soil water retention'
        ],
        affectedPlants: ['All plants', 'Especially in hot, dry conditions']
      },
      {
        name: 'Flooding',
        description: 'Excessive water causes root suffocation, disease, and plant death.',
        symptoms: [
          'Wilting despite wet soil',
          'Yellowing leaves',
          'Root rot',
          'Plant collapse',
          'Death within days'
        ],
        prevention: [
          'Improve soil drainage',
          'Create raised beds',
          'Avoid low-lying areas',
          'Install drainage systems',
          'Choose flood-tolerant varieties'
        ],
        treatment: [
          'Improve drainage immediately',
          'Remove standing water',
          'Aerate soil',
          'Remove damaged plants',
          'Replant in better-draining areas'
        ],
        affectedPlants: ['All plants', 'Especially in low-lying areas']
      },
      {
        name: 'Hail Damage',
        description: 'Hailstones cause physical damage to leaves, stems, and fruits.',
        symptoms: [
          'Torn or shredded leaves',
          'Bruised fruits',
          'Broken stems',
          'Pockmarks on leaves',
          'Reduced yields'
        ],
        prevention: [
          'Use row covers or netting',
          'Provide overhead protection',
          'Plant in protected areas',
          'Monitor weather forecasts',
          'Use hail nets'
        ],
        treatment: [
          'Remove damaged plant parts',
          'Support broken stems',
          'Provide extra care',
          'Harvest damaged fruits',
          'Be patient - plants often recover'
        ],
        affectedPlants: ['All plants', 'Especially leafy vegetables', 'Fruit trees']
      },
      {
        name: 'Chemical Damage',
        description: 'Herbicide drift, pesticide misuse, or soil contamination causes plant damage.',
        symptoms: [
          'Distorted, curled leaves',
          'Yellowing or browning',
          'Stunted growth',
          'Plant death',
          'Symptoms appear quickly'
        ],
        prevention: [
          'Read and follow label instructions',
          'Avoid herbicide drift',
          'Use chemicals carefully',
          'Test soil for contamination',
          'Use organic alternatives when possible'
        ],
        treatment: [
          'Rinse plants with water',
          'Remove contaminated soil',
          'Provide extra care',
          'Wait for recovery',
          'Start over if severe'
        ],
        affectedPlants: ['All plants', 'Especially sensitive species']
      },
      {
        name: 'Air Pollution',
        description: 'Pollutants in air cause leaf damage and reduced growth.',
        symptoms: [
          'Brown or yellow spots on leaves',
          'Reduced growth',
          'Premature leaf drop',
          'Stunted plants',
          'Most common in urban areas'
        ],
        prevention: [
          'Choose pollution-tolerant varieties',
          'Plant in protected areas',
          'Improve air circulation',
          'Use air filters for indoor plants',
          'Avoid planting near roads'
        ],
        treatment: [
          'Rinse leaves with water',
          'Provide extra care',
          'Use air filters',
          'Move plants if possible',
          'Choose tolerant varieties'
        ],
        affectedPlants: ['All plants', 'Especially in urban areas']
      },
      {
        name: 'Weed Competition',
        description: 'Weeds compete with plants for water, nutrients, and light.',
        symptoms: [
          'Stunted growth',
          'Reduced yields',
          'Yellowing plants',
          'Poor plant health',
          'Weeds overtaking garden'
        ],
        prevention: [
          'Mulch to suppress weeds',
          'Remove weeds when small',
          'Use landscape fabric',
          'Practice good garden hygiene',
          'Use pre-emergent herbicides carefully'
        ],
        treatment: [
          'Remove weeds by hand',
          'Apply mulch',
          'Use hoe or cultivator',
          'Use post-emergent herbicides carefully',
          'Improve garden maintenance'
        ],
        affectedPlants: ['All plants', 'Especially young plants']
      },
      {
        name: 'Allelopathy',
        description: 'Some plants release chemicals that inhibit growth of nearby plants.',
        symptoms: [
          'Stunted growth near certain plants',
          'Yellowing',
          'Reduced germination',
          'Poor plant health',
          'Specific to certain plant combinations'
        ],
        prevention: [
          'Research plant compatibility',
          'Avoid allelopathic plants',
          'Use companion planting guides',
          'Space plants appropriately',
          'Rotate crops'
        ],
        treatment: [
          'Remove allelopathic plants',
          'Improve soil health',
          'Add activated charcoal',
          'Wait before replanting',
          'Choose compatible plants'
        ],
        affectedPlants: ['Varies by plant', 'Common with walnuts', 'Black locust', 'Eucalyptus']
      },
      {
        name: 'Soil Erosion',
        description: 'Loss of topsoil reduces soil quality and exposes roots.',
        symptoms: [
          'Exposed roots',
          'Reduced soil depth',
          'Poor plant growth',
          'Water runoff',
          'Loss of nutrients'
        ],
        prevention: [
          'Use ground covers',
          'Plant on contours',
          'Build terraces',
          'Use mulch',
          'Avoid bare soil'
        ],
        treatment: [
          'Add topsoil',
          'Plant ground covers',
          'Use mulch',
          'Build terraces',
          'Improve soil structure'
        ],
        affectedPlants: ['All plants', 'Especially on slopes']
      },
      {
        name: 'Compacted Soil',
        description: 'Dense, compressed soil restricts root growth and water movement.',
        symptoms: [
          'Stunted growth',
          'Poor root development',
          'Water pooling on surface',
          'Difficulty inserting tools',
          'Reduced yields'
        ],
        prevention: [
          'Avoid working wet soil',
          'Use raised beds',
          'Add organic matter regularly',
          'Minimize foot traffic',
          'Use wide paths'
        ],
        treatment: [
          'Add organic matter',
          'Use cover crops',
          'Double dig or till (when dry)',
          'Create raised beds',
          'Improve drainage'
        ],
        affectedPlants: ['All plants', 'Especially root crops']
      }
    ]
  }
]

export default function CommonIssuesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null)
  const [topYoutubeByIssue, setTopYoutubeByIssue] = useState<Record<string, YoutubeTopResult>>({})
  const [youtubeTitleByUrl, setYoutubeTitleByUrl] = useState<Record<string, string>>({})
  const [wikiByIssue, setWikiByIssue] = useState<Record<string, WikiResult>>({})

  const expandedIssueObj = useMemo(() => {
    if (!selectedCategory || !expandedIssue) return null
    const category = COMMON_ISSUES.find((c) => c.name === selectedCategory)
    return category?.issues.find((i) => i.name === expandedIssue) ?? null
  }, [selectedCategory, expandedIssue])

  useEffect(() => {
    let cancelled = false

    const loadTopYoutube = async () => {
      if (!expandedIssueObj) return
      const issueName = expandedIssueObj.name
      if (topYoutubeByIssue[issueName]) return

      try {
        const res = await fetch(`/api/youtube-top?q=${encodeURIComponent(issueName + ' control')}`)
        if (!res.ok) return
        const data = await res.json()
        if (!data?.url || typeof data.url !== 'string') return
        if (!data?.title || typeof data.title !== 'string') return
        if (cancelled) return
        setTopYoutubeByIssue((prev) => ({ ...prev, [issueName]: { url: data.url, title: data.title } }))
      } catch {
        // ignore (we fall back to showing a non-clickable placeholder)
      }
    }

    loadTopYoutube()
    return () => {
      cancelled = true
    }
  }, [expandedIssueObj, topYoutubeByIssue])

  useEffect(() => {
    let cancelled = false

    const loadYoutubeTitles = async () => {
      if (!expandedIssueObj) return
      const resources = getIssueResources(expandedIssueObj)
      const youtubeUrls = resources
        .filter((r) => r.source === 'YouTube' && r.url.startsWith('http'))
        .map((r) => r.url)

      const missing = youtubeUrls.filter((u) => !youtubeTitleByUrl[u])
      if (missing.length === 0) return

      await Promise.all(
        missing.map(async (url) => {
          try {
            const res = await fetch(`/api/youtube-oembed?url=${encodeURIComponent(url)}`)
            if (!res.ok) return
            const data = await res.json()
            if (!data?.title || typeof data.title !== 'string') return
            if (cancelled) return
            setYoutubeTitleByUrl((prev) => ({ ...prev, [url]: data.title }))
          } catch {
            // ignore
          }
        })
      )
    }

    loadYoutubeTitles()
    return () => {
      cancelled = true
    }
  }, [expandedIssueObj, youtubeTitleByUrl])

  useEffect(() => {
    let cancelled = false

    const loadWiki = async () => {
      if (!expandedIssueObj) return
      const issueName = expandedIssueObj.name
      if (wikiByIssue[issueName]) return

      // If a Wikipedia link is already explicitly present, we don't need to fetch.
      const resources = getIssueResources(expandedIssueObj)
      const hasWiki = resources.some((r) => r.source === 'Wikipedia')
      if (hasWiki) return

      try {
        const res = await fetch(`/api/wiki-page?term=${encodeURIComponent(issueName)}`)
        if (!res.ok) return
        const data = await res.json()
        if (!data?.url || typeof data.url !== 'string') return
        if (!data?.title || typeof data.title !== 'string') return
        if (cancelled) return
        setWikiByIssue((prev) => ({ ...prev, [issueName]: { url: data.url, title: data.title } }))
      } catch {
        // ignore
      }
    }

    loadWiki()
    return () => {
      cancelled = true
    }
  }, [expandedIssueObj, wikiByIssue])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Common Issues</h1>
          <p className="text-gray-600 text-lg">
            A comprehensive guide to identifying, preventing, and treating common plant problems
          </p>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {COMMON_ISSUES.map((category) => {
            const isSelected = selectedCategory === category.name
            const colorClasses = {
              red: isSelected ? 'border-red-500 bg-red-50' : '',
              orange: isSelected ? 'border-orange-500 bg-orange-50' : '',
              yellow: isSelected ? 'border-yellow-500 bg-yellow-50' : '',
              blue: isSelected ? 'border-blue-500 bg-blue-50' : ''
            }
            
            return (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(
                selectedCategory === category.name ? null : category.name
              )}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? colorClasses[category.color as keyof typeof colorClasses]
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
              </div>
              <p className="text-sm text-gray-600">{category.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                {category.issues.length} issues
              </p>
            </button>
            )
          })}
        </div>

        {/* Issues List */}
        {selectedCategory && (
          <div className="space-y-6">
            {COMMON_ISSUES
              .find(cat => cat.name === selectedCategory)
              ?.issues.map((issue) => (
                <div
                  key={issue.name}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedIssue(
                      expandedIssue === issue.name ? null : issue.name
                    )}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {issue.name}
                      </h3>
                      <p className="text-gray-600">{issue.description}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        expandedIssue === issue.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedIssue === issue.name && (
                    <div className="px-6 pb-6 space-y-6 border-t border-gray-200 pt-6">
                      {/* Symptoms */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Symptoms
                        </h4>
                        <ul className="space-y-2 ml-4">
                          {issue.symptoms.map((symptom, i) => (
                            <li key={i} className="text-gray-700 flex items-start gap-2">
                              <span className="text-gray-400 mt-1">•</span>
                              <span>{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Prevention */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Prevention
                        </h4>
                        <ul className="space-y-2 ml-4">
                          {issue.prevention.map((prevent, i) => (
                            <li key={i} className="text-gray-700 flex items-start gap-2">
                              <span className="text-green-500 mt-1">✓</span>
                              <span>{prevent}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Treatment */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Treatment
                        </h4>
                        <ul className="space-y-2 ml-4">
                          {issue.treatment.map((treat, i) => (
                            <li key={i} className="text-gray-700 flex items-start gap-2">
                              <span className="text-blue-500 mt-1">→</span>
                              <span>{treat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Resources */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Useful resources
                        </h4>

                        {/* Embedded videos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {getIssueResources(issue)
                            .filter((r) => r.source === 'YouTube' && r.url.startsWith('http'))
                            .map((r) => {
                              const embed = parseYouTubeEmbed(r.url)
                              if (!embed) return null
                              const title = youtubeTitleByUrl[r.url] ?? r.title
                              return (
                                <div key={`embed:${r.url}`} className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                                  <div className="px-3 py-2 border-b border-gray-200">
                                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{title}</p>
                                  </div>
                                  <div className="aspect-video bg-black">
                                    <iframe
                                      src={embed.embedUrl}
                                      title={title}
                                      className="w-full h-full"
                                      loading="lazy"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    />
                                  </div>
                                </div>
                              )
                            })}
                        </div>

                        <ul className="space-y-2 ml-4">
                          {getIssueResources(issue).filter((r) => r.source !== 'YouTube').map((res) => {
                            const isYoutubePlaceholder = res.url.startsWith('__youtube_top__:')
                            const yt = topYoutubeByIssue[issue.name]
                            const finalUrl = isYoutubePlaceholder ? (yt?.url ?? '') : res.url
                            const finalTitle = isYoutubePlaceholder ? (yt?.title ?? res.title) : res.title
                            const resolvedYoutubeTitle =
                              res.source === 'YouTube' && youtubeTitleByUrl[res.url]
                                ? youtubeTitleByUrl[res.url]
                                : null
                            const displayTitle = resolvedYoutubeTitle ?? finalTitle
                            const isClickable = Boolean(finalUrl)

                            return (
                              <li key={res.url} className="text-gray-700 flex items-start gap-2">
                                <span className="text-purple-500 mt-1">↗</span>
                                {isClickable ? (
                                  <a
                                    href={finalUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="text-purple-700 hover:text-purple-800 underline decoration-purple-300 hover:decoration-purple-500"
                                  >
                                    {displayTitle}
                                  </a>
                                ) : (
                                  <span className="text-gray-500">
                                    {displayTitle} <span className="text-xs">(loading…)</span>
                                  </span>
                                )}
                                {res.source && (
                                  <span className="text-xs text-gray-500 mt-1">({res.source})</span>
                                )}
                              </li>
                            )
                          })}

                          {/* Ensure every issue has a Wikipedia page link */}
                          {!getIssueResources(issue).some((r) => r.source === 'Wikipedia') && (
                            <li className="text-gray-700 flex items-start gap-2">
                              <span className="text-purple-500 mt-1">↗</span>
                              {wikiByIssue[issue.name]?.url ? (
                                <a
                                  href={wikiByIssue[issue.name].url}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="text-purple-700 hover:text-purple-800 underline decoration-purple-300 hover:decoration-purple-500"
                                >
                                  {wikiByIssue[issue.name].title}
                                </a>
                              ) : (
                                <span className="text-gray-500">Wikipedia <span className="text-xs">(loading…)</span></span>
                              )}
                              <span className="text-xs text-gray-500 mt-1">(Wikipedia)</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Affected Plants */}
                      {issue.affectedPlants && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Commonly Affected Plants
                          </h4>
                          <p className="text-gray-700 ml-4">
                            {issue.affectedPlants.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* No Category Selected */}
        {!selectedCategory && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">
              Select a category above to view common issues and their solutions
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
