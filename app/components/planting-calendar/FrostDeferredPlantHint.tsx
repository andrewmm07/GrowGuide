'use client'

interface FrostDeferredPlantHintProps {
  names?: string[]
  className?: string
}

/** Shown when frost modifiers defer tender crops from the plant-out list. */
export default function FrostDeferredPlantHint({ names, className = '' }: FrostDeferredPlantHintProps) {
  if (!names?.length) return null

  const label = names.length === 1 ? 'is' : 'are'
  const list = names.join(', ')

  return (
    <p
      className={`text-xs text-gray-700 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 ${className}`.trim()}
      role="status"
    >
      Frost risk: {list} {label} held from outdoor planting this month. Check the sow list for protected or indoor
      starts.
    </p>
  )
}
