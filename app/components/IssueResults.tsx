'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface IssueResult {
  issue: string
  confidence: number
  notes: string
  symptoms?: string[]
  treatment?: string[]
  images?: string[]
}

interface IssueResultsProps {
  submissionId: string | null
  predictions?: Array<{ issue: string; confidence: number; notes: string }>
}

export default function IssueResults({ submissionId, predictions: initialPredictions }: IssueResultsProps) {
  const [results, setResults] = useState<IssueResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialPredictions) {
      // Use predictions directly if provided (fallback when DB save fails)
      fetchIssueDetails(initialPredictions)
    } else if (submissionId) {
      // Fetch from database
      fetchResults()
    }
  }, [submissionId, initialPredictions])

  const fetchIssueDetails = async (preds: Array<{ issue: string; confidence: number; notes: string }>) => {
    setIsLoading(true)
    setError(null)

    try {
      const issueDetails: IssueResult[] = []

      for (const pred of preds) {
        // Fetch from issues table
        const { data: issueData, error: issueError } = await supabase
          .from('issues')
          .select('*')
          .eq('name', pred.issue)
          .single()

        if (issueError && issueError.code !== 'PGRST116') {
          console.warn(`Issue not found in database: ${pred.issue}`, issueError)
        }

        issueDetails.push({
          issue: pred.issue,
          confidence: pred.confidence,
          notes: pred.notes,
          symptoms: issueData?.symptoms || [],
          treatment: issueData?.treatment || [],
          images: issueData?.images || [],
        })
      }

      setResults(issueDetails)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results')
      console.error('Fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchResults = async () => {
    if (!submissionId) return
    
    setIsLoading(true)
    setError(null)

    try {
      // Fetch submission
      const { data: submission, error: submissionError } = await supabase
        .from('user_submissions')
        .select('*')
        .eq('id', submissionId)
        .single()

      if (submissionError) throw submissionError

      if (!submission) {
        throw new Error('Submission not found')
      }

      // Fetch detailed issue information
      const issueNames = submission.predicted_issues || []
      const confidences = submission.confidence || []

      const issueDetails: IssueResult[] = []

      for (let i = 0; i < issueNames.length; i++) {
        const issueName = issueNames[i]
        const confidence = confidences[i] || 0

        // Fetch from issues table
        const { data: issueData, error: issueError } = await supabase
          .from('issues')
          .select('*')
          .eq('name', issueName)
          .single()

        if (issueError && issueError.code !== 'PGRST116') {
          console.warn(`Issue not found in database: ${issueName}`, issueError)
        }

        issueDetails.push({
          issue: issueName,
          confidence: confidence,
          notes: `Confidence: ${Math.round(confidence * 100)}%`,
          symptoms: issueData?.symptoms || [],
          treatment: issueData?.treatment || [],
          images: issueData?.images || [],
        })
      }

      setResults(issueDetails)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results')
      console.error('Fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }


  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading results...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No results found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h2>
        <p className="text-gray-600 mb-6">
          Top {results.length} potential issues identified:
        </p>

        {/* Issue Cards */}
        <div className="grid md:grid-cols-1 gap-6 mb-6">
          {results.map((result, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {result.issue}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              {result.symptoms && result.symptoms.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Symptoms
                  </h4>
                  <ul className="space-y-1 ml-4">
                    {result.symptoms.map((symptom, i) => (
                      <li key={i} className="text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Treatment */}
              {result.treatment && result.treatment.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Treatment
                  </h4>
                  <ul className="space-y-1 ml-4">
                    {result.treatment.map((treatment, i) => (
                      <li key={i} className="text-gray-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">→</span>
                        <span>{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Images */}
              {result.images && result.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Reference Images</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {result.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${result.issue} example ${i + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}




