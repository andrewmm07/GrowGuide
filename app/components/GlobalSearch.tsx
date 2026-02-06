'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  name: string
  category: string
  image?: string
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (term.length < 2) {
      setResults([])
      return
    }

    // Mock search results - replace with actual API call
    const searchResults: SearchResult[] = [
      { id: 'tomatoes', name: 'Tomatoes', category: 'Vegetables' },
      { id: 'basil', name: 'Basil', category: 'Herbs' },
      // Add more mock results
    ].filter(item => 
      item.name.toLowerCase().includes(term.toLowerCase())
    )
    
    setResults(searchResults)
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search plants..."
          className="w-64 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        <button className="ml-2 p-2 text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              className="w-full px-4 py-2 text-left hover:bg-gray-50"
              onClick={() => {
                router.push(`/plants/${result.id}`)
                setIsOpen(false)
              }}
            >
              {result.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 