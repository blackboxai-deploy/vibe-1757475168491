'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { validateImageFile } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PhotoUploadProps {
  value: File | null
  onChange: (file: File | null) => void
  error?: string
  className?: string
  disabled?: boolean
}

export function PhotoUpload({ 
  value, 
  onChange, 
  error, 
  className, 
  disabled = false 
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) {
      setPreview(null)
      onChange(null)
      return
    }

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      // Error will be handled by parent component
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    onChange(file)
  }, [onChange])

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileSelect(file)
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file: File) => file.type.startsWith('image/'))
    
    if (imageFile) {
      handleFileSelect(imageFile)
    }
  }

  // Handle click to open file dialog
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Remove current photo
  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Card 
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          isDragOver && !disabled && "border-blue-400 bg-blue-50",
          error && "border-red-300",
          disabled && "opacity-50 cursor-not-allowed",
          !preview && !error && "border-gray-300 hover:border-gray-400",
          preview && !error && "border-green-300"
        )}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          {preview ? (
            // Photo preview
            <div className="relative">
              <img
                src={preview}
                alt="Preview foto guru"
                className="w-32 h-40 object-cover rounded-lg mx-auto border-2 border-gray-200"
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  {value?.name} ({(value?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                </p>
                <div className="flex justify-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClick()
                    }}
                    disabled={disabled}
                  >
                    Ganti Foto
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove()
                    }}
                    disabled={disabled}
                    className="text-red-600 hover:text-red-700"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Upload area
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload Foto Guru
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Drag & drop foto atau klik untuk memilih
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Format: JPG, PNG, WebP</p>
                <p>Ukuran maksimal: 5MB</p>
                <p>Rekomendasi: 400x500 pixels</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}

      {/* Success message */}
      {preview && !error && (
        <p className="text-sm text-green-600 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Foto berhasil dipilih</span>
        </p>
      )}
    </div>
  )
}