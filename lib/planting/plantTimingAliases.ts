import { plantNamesMatch } from '@/lib/planting/fortnightTiming'

/** Expand DB plant names to equivalent planting-matrix labels. */
function expandTimingNames(name: string): Set<string> {
  const base = name
    .replace(/\s*\([^)]*\)\s*$/g, '')
    .trim()
    .toLowerCase()

  const names = new Set<string>([base])

  if (base === 'rocket' || base === 'arugula' || base === 'mizuna') {
    names.add('asian greens')
    names.add('rocket')
  }
  if (base === 'spinach' || base === 'english spinach') {
    names.add('spinach')
    names.add('english spinach')
  }
  if (base === 'radish sprouts' || base === 'radish sprout') {
    names.add('radish')
  }
  if (base === 'silverbeet' || base === 'swiss chard') {
    names.add('silverbeet')
  }
  if (base === 'beans' || base === 'green beans' || base === 'bush beans') {
    names.add('beans')
  }
  // Shelling peas only — snap/snow types have their own (narrower) calendar entries.
  if (
    base === 'peas' ||
    base === 'pea shoots' ||
    base === 'early peas'
  ) {
    names.add('peas')
  }
  if (base === 'carrots' || base === 'early carrots') {
    names.add('carrots')
  }
  if (base === 'corn' || base === 'sweet corn') {
    names.add('sweet corn')
    names.add('corn')
  }
  if (
    base === 'potato' ||
    base === 'potatoes' ||
    base === 'early potatoes'
  ) {
    names.add('potatoes')
  }
  if (base === 'jerusalem artichokes' || base === 'jerusalem artichoke') {
    names.add('jerusalem artichokes')
  }
  if (base === 'artichoke' || base === 'globe artichoke' || base === 'cardoon') {
    names.add('globe artichoke')
    names.add('artichoke')
  }
  if (base === 'endive' || base === 'chicory' || base === 'radicchio') {
    names.add('lettuce')
  }
  if (base === 'watercress') {
    names.add('lettuce')
  }
  if (base === 'warrigal greens') {
    names.add('asian greens')
  }
  if (base === 'celeriac') {
    names.add('celery')
  }
  if (base === 'asian greens' || base === 'mizuna' || base === 'bok choy') {
    names.add('asian greens')
  }
  if (base === 'spring onions' || base === 'spring onion') {
    names.add('spring onion')
  }
  if (base === 'strawberries' || base === 'strawberry') {
    names.add('strawberry')
  }
  if (base === 'swede' || base === 'swedes') {
    names.add('swede')
  }
  if (base === 'english spinach') {
    names.add('spinach')
  }
  if (base === 'cucumbers') {
    names.add('cucumber')
  }
  if (base === 'sweet potato') {
    names.add('sweet potatoes')
  }
  if (base === 'cabbage' || base === 'chinese cabbage') {
    names.add('winter cabbage')
    names.add('brassicas')
  }
  if (base === 'peppers' || base === 'pepper' || base === 'chilli' || base === 'chillies') {
    names.add('capsicum')
    names.add('chillies')
  }
  if (base === 'capsicum') {
    names.add('peppers')
    names.add('chilli')
  }
  if (base === 'pumpkin') {
    names.add('pumpkins')
  }
  if (base === 'pumpkins') {
    names.add('pumpkin')
  }

  return names
}

/** Match a DB plant name to a planting-calendar matrix entry. */
export function plantingMatrixMatches(plantName: string, matrixEntry: string): boolean {
  if (plantNamesMatch(plantName, matrixEntry)) return true

  const plantForms = expandTimingNames(plantName)
  const entryForms = expandTimingNames(matrixEntry)

  for (const p of plantForms) {
    for (const e of entryForms) {
      if (plantNamesMatch(p, e)) return true
    }
  }

  return false
}

/** Crops that must be direct-sown — never treat sow windows as seedling plant-out. */
export function isDirectSowOnly(plantName: string): boolean {
  const base = plantName
    .replace(/\s*\([^)]*\)\s*$/g, '')
    .trim()
    .toLowerCase()

  return (
    base === 'peas' ||
    base === 'pea shoots' ||
    base === 'snow peas' ||
    base === 'sugar snap peas' ||
    base === 'carrot' ||
    base === 'carrots' ||
    base === 'parsnip' ||
    base === 'parsnips' ||
    base === 'radish' ||
    base === 'radish sprouts' ||
    base === 'radish sprout' ||
    base === 'broad beans' ||
    base === 'beans' ||
    base === 'green beans' ||
    base === 'corn' ||
    base === 'sweet corn' ||
    base === 'garlic'
  )
}
