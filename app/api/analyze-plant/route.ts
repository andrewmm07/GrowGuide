import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://soxpxdosyrvnqptmwmon.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNveHB4ZG9zeXJ2bnFwdG13bW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MTUzNjEsImV4cCI6MjA4MTA5MTM2MX0.-RjAZu6aCqrEYOc1Z5oasTQsw5HBrLx2byL_LJr0GWg'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const { image_url, user_id } = await request.json()

    if (!image_url || !user_id) {
      return NextResponse.json(
        { error: 'Missing image_url or user_id' },
        { status: 400 }
      )
    }

    // Mock AI predictions based on image URL or random
    let predictions: Array<{ issue: string; confidence: number; notes: string }> = []

    // Simple mock logic based on URL patterns or random
    const urlLower = image_url.toLowerCase()
    
    if (urlLower.includes('white') || urlLower.includes('powdery')) {
      predictions = [
        { issue: 'Powdery Mildew', confidence: 0.87, notes: 'White powdery spots on leaves, usually in humid areas' },
        { issue: 'Leaf Spot', confidence: 0.65, notes: 'Brown or black spots on leaves, edges may yellow' },
        { issue: 'Nitrogen Deficiency', confidence: 0.40, notes: 'Yellowing leaves, especially older leaves at the base' }
      ]
    } else if (urlLower.includes('yellow') || urlLower.includes('yellowing')) {
      predictions = [
        { issue: 'Nitrogen Deficiency', confidence: 0.75, notes: 'Yellowing leaves, especially older leaves at the base' },
        { issue: 'Overwatering', confidence: 0.50, notes: 'Leaves may look limp or water-soaked' },
        { issue: 'Iron Deficiency', confidence: 0.45, notes: 'Yellowing between leaf veins on new growth' }
      ]
    } else if (urlLower.includes('brown') || urlLower.includes('spot')) {
      predictions = [
        { issue: 'Leaf Spot', confidence: 0.82, notes: 'Brown or black spots on leaves, edges may yellow' },
        { issue: 'Early Blight', confidence: 0.70, notes: 'Dark brown spots with target-like rings on leaves' },
        { issue: 'Blossom End Rot', confidence: 0.55, notes: 'Dark, sunken spots on fruit bottoms' }
      ]
    } else if (urlLower.includes('pest') || urlLower.includes('insect')) {
      predictions = [
        { issue: 'Aphids', confidence: 0.85, notes: 'Small insects clustering on new growth' },
        { issue: 'Spider Mites', confidence: 0.60, notes: 'Fine webbing on leaf undersides' },
        { issue: 'Whiteflies', confidence: 0.50, notes: 'Small white insects on leaf undersides' }
      ]
    } else {
      // Default random predictions
      const allIssues = [
        'Powdery Mildew',
        'Leaf Spot',
        'Nitrogen Deficiency',
        'Aphids',
        'Spider Mites',
        'Early Blight',
        'Overwatering',
        'Underwatering'
      ]
      
      // Shuffle and pick 3
      const shuffled = allIssues.sort(() => 0.5 - Math.random())
      predictions = shuffled.slice(0, 3).map((issue, index) => ({
        issue,
        confidence: 0.7 - (index * 0.15),
        notes: `Potential ${issue.toLowerCase()} detected`
      }))
    }

    // Save to Supabase (with fallback if it fails)
    let submissionId: string | null = null
    
    const { data: submissionData, error: submissionError } = await supabase
      .from('user_submissions')
      .insert({
        user_id,
        image_url,
        predicted_issues: predictions.map(p => p.issue),
        confidence: predictions.map(p => p.confidence),
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Supabase error:', submissionError)
      console.error('Error code:', submissionError.code)
      console.error('Error details:', submissionError.details)
      console.error('Error hint:', submissionError.hint)
      
      // Still return predictions even if save fails (for testing)
      // Generate a temporary ID for the response
      submissionId = `temp-${Date.now()}`
      
      // Log warning but don't fail the request
      console.warn('Failed to save submission to database, but continuing with predictions:', submissionError.message)
    } else {
      submissionId = submissionData.id
    }

    return NextResponse.json({
      predictions,
      submission_id: submissionId,
      save_error: submissionError ? {
        message: submissionError.message,
        code: submissionError.code,
        hint: submissionError.hint
      } : null
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}




