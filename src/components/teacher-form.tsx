'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhotoUpload } from './photo-upload'
import { validateTeacherForm } from '@/lib/utils'
import type { TeacherFormData } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TeacherFormProps {
  onSubmit: (data: TeacherFormData) => Promise<{ success: boolean; error?: string }>
  isLoading?: boolean
  className?: string
}

export function TeacherForm({ onSubmit, isLoading = false, className }: TeacherFormProps) {
  const [formData, setFormData] = useState<TeacherFormData>({
    photo: null,
    name: '',
    nip: '',
    position: '',
    school: '',
    retirementDate: '',
    documentLink: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle input changes
  const handleInputChange = (field: keyof TeacherFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Handle photo change
  const handlePhotoChange = (photo: File | null) => {
    setFormData(prev => ({ ...prev, photo }))
    
    // Clear photo error when user selects a photo
    if (errors.photo && photo) {
      setErrors(prev => ({ ...prev, photo: '' }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validation = validateTeacherForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const result = await onSubmit(formData)
      
      if (result.success) {
        // Reset form on success
        setFormData({
          photo: null,
          name: '',
          nip: '',
          position: '',
          school: '',
          retirementDate: '',
          documentLink: ''
        })
      } else {
        // Show error from submission
        if (result.error) {
          setErrors({ general: result.error })
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({ general: 'Terjadi kesalahan yang tidak terduga' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if form has any data (for unsaved changes warning)
  const hasUnsavedChanges = Object.values(formData).some(value => {
    if (value === null || value === '') return false
    return true
  })

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span>Tambah Data Guru Baru</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo">Foto Guru *</Label>
            <PhotoUpload
              value={formData.photo}
              onChange={handlePhotoChange}
              error={errors.photo}
              disabled={isSubmitting || isLoading}
            />
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="Masukkan nama lengkap guru"
                disabled={isSubmitting || isLoading}
                className={cn(errors.name && "border-red-300")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* NIP */}
            <div className="space-y-2">
              <Label htmlFor="nip">NIP *</Label>
              <Input
                id="nip"
                type="text"
                value={formData.nip}
                onChange={handleInputChange('nip')}
                placeholder="Nomor Induk Pegawai"
                disabled={isSubmitting || isLoading}
                className={cn(errors.nip && "border-red-300")}
              />
              {errors.nip && (
                <p className="text-sm text-red-600">{errors.nip}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position">Jabatan *</Label>
              <Input
                id="position"
                type="text"
                value={formData.position}
                onChange={handleInputChange('position')}
                placeholder="Guru/Kepala Sekolah/Staff"
                disabled={isSubmitting || isLoading}
                className={cn(errors.position && "border-red-300")}
              />
              {errors.position && (
                <p className="text-sm text-red-600">{errors.position}</p>
              )}
            </div>

            {/* School */}
            <div className="space-y-2">
              <Label htmlFor="school">Nama Sekolah *</Label>
              <Input
                id="school"
                type="text"
                value={formData.school}
                onChange={handleInputChange('school')}
                placeholder="Nama sekolah tempat bertugas"
                disabled={isSubmitting || isLoading}
                className={cn(errors.school && "border-red-300")}
              />
              {errors.school && (
                <p className="text-sm text-red-600">{errors.school}</p>
              )}
            </div>
          </div>

          {/* Retirement Date */}
          <div className="space-y-2">
            <Label htmlFor="retirementDate">Tanggal Pensiun *</Label>
            <Input
              id="retirementDate"
              type="date"
              value={formData.retirementDate}
              onChange={handleInputChange('retirementDate')}
              disabled={isSubmitting || isLoading}
              className={cn(errors.retirementDate && "border-red-300")}
            />
            {errors.retirementDate && (
              <p className="text-sm text-red-600">{errors.retirementDate}</p>
            )}
          </div>

          {/* Document Link */}
          <div className="space-y-2">
            <Label htmlFor="documentLink">Link Berkas (Opsional)</Label>
            <Input
              id="documentLink"
              type="url"
              value={formData.documentLink}
              onChange={handleInputChange('documentLink')}
              placeholder="https://drive.google.com/... atau URL dokumen lainnya"
              disabled={isSubmitting || isLoading}
              className={cn(errors.documentLink && "border-red-300")}
            />
            {errors.documentLink && (
              <p className="text-sm text-red-600">{errors.documentLink}</p>
            )}
            <p className="text-xs text-gray-500">
              Masukkan URL ke dokumen pendukung (Google Drive, Dropbox, dll.)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            {hasUnsavedChanges && !isSubmitting && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm('Hapus semua data yang belum disimpan?')) {
                    setFormData({
                      photo: null,
                      name: '',
                      nip: '',
                      position: '',
                      school: '',
                      retirementDate: '',
                      documentLink: ''
                    })
                    setErrors({})
                  }
                }}
              >
                Reset Form
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="min-w-32"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </div>
              ) : (
                'Simpan Data Guru'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}