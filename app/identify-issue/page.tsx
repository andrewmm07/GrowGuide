'use client'

import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import ImageUploadWidget from '../components/ImageUploadWidget'
import IssueResults from '../components/IssueResults'

export default function IdentifyIssuePage() {
  const { user } = useAuth()
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Array<{ issue: string; confidence: number; notes: string }> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (url: string) => {
    setUploadedImageUrl(url)
    setSubmissionId(null) // Reset previous results
    setPredictions(null) // Reset predictions
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!uploadedImageUrl) {
      setError('Please upload an image first')
      return
    }

    if (!user) {
      setError('Please log in to analyse images')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze-plant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: uploadedImageUrl,
          user_id: user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze image')
      }

      const data = await response.json()
      setSubmissionId(data.submission_id)
      setPredictions(data.predictions)
      
      // Show warning if save failed but predictions are available
      if (data.save_error) {
        console.warn('Database save failed, but predictions are available:', data.save_error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Plant Issue Identification</h1>
          <p className="text-gray-600 text-lg">
            Upload an image of your plant to identify potential issues, diseases, or nutrient deficiencies
          </p>
        </div>

        {/* Image Upload Widget */}
        <div className="mb-6">
          <ImageUploadWidget onUpload={handleImageUpload} />
        </div>

        {/* Analyze Button */}
        {uploadedImageUrl && (
          <div className="mb-6">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                isAnalyzing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isAnalyzing ? 'Analysing...' : 'Analyse Plant'}
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium mb-2">{error}</p>
            {error.includes('Table') && (
              <div className="text-xs text-red-600 mt-2 space-y-1">
                <p>To fix this:</p>
                <ol className="list-decimal list-inside ml-2 space-y-1">
                  <li>Go to Supabase Dashboard → SQL Editor</li>
                  <li>Run the CREATE TABLE statement for user_submissions</li>
                  <li>Ensure the table has columns: id, user_id, image_url, predicted_issues, confidence, created_at, feedback</li>
                </ol>
              </div>
            )}
            {error.includes('Permission denied') && (
              <div className="text-xs text-red-600 mt-2 space-y-1">
                <p>To fix this:</p>
                <ol className="list-decimal list-inside ml-2 space-y-1">
                  <li>Go to Supabase Dashboard → Authentication → Policies</li>
                  <li>Create a policy for user_submissions table</li>
                  <li>Allow INSERT for authenticated users</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Results Display */}
        {(submissionId || predictions) && (
          <IssueResults 
            submissionId={submissionId} 
            predictions={predictions || undefined}
          />
        )}
      </div>
    </div>
  )
}




