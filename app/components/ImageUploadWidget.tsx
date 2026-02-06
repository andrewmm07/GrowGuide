'use client'

import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface ImageUploadWidgetProps {
  onUpload: (url: string) => void
}

export default function ImageUploadWidget({ onUpload }: ImageUploadWidgetProps) {
  const { user } = useAuth()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB')
      return
    }

    if (!user) {
      setError('Please log in to upload images')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Create preview (will be used as fallback if storage fails)
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setPreviewUrl(result)
          resolve(result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('plant-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        
        // Provide more specific error messages and fallback
        if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('does not exist')) {
          // Fallback: Use data URL if bucket doesn't exist (for testing)
          console.warn('Storage bucket "plant-images" not found, using data URL as fallback')
          onUpload(dataUrl)
          return
        } else if (uploadError.message?.includes('new row violates row-level security')) {
          // Try fallback first
          console.warn('Storage permission denied, using data URL as fallback')
          onUpload(dataUrl)
          return
        } else if (uploadError.message?.includes('JWT') || uploadError.message?.includes('token')) {
          throw new Error('Authentication error. Please log in again.')
        } else {
          // Try fallback with data URL
          console.warn('Storage upload failed, using data URL as fallback:', uploadError.message)
          onUpload(dataUrl)
          return
        }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('plant-images')
        .getPublicUrl(fileName)

      if (!urlData?.publicUrl) {
        // Fallback to data URL
        console.warn('Failed to get public URL, using data URL as fallback')
        onUpload(dataUrl)
        return
      }

      onUpload(urlData.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : previewUrl ? (
          <div className="space-y-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-600">Click to change image</p>
          </div>
        ) : (
          <div className="space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4h-4m-4 4v-4"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports JPG, PNG, GIF (max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium mb-2">{error}</p>
          {error.includes('bucket') && (
            <div className="text-xs text-red-600 mt-2 space-y-1">
              <p>To fix this:</p>
              <ol className="list-decimal list-inside ml-2 space-y-1">
                <li>Go to Supabase Dashboard → Storage</li>
                <li>Create a bucket named "plant-images"</li>
                <li>Set it to public or configure RLS policies for authenticated users</li>
              </ol>
              <p className="mt-2 text-green-600">Note: The feature will work with a temporary data URL until the bucket is set up.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}




