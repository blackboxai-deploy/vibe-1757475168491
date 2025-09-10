import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO, isValid, startOfDay, endOfDay } from "date-fns"
import { id as localeId } from "date-fns/locale"
import type { Teacher, FilterOptions, TeacherFormData, ProgressStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate unique ID for teachers
export function generateId(): string {
  return `teacher_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Date formatting utilities
export function formatDate(dateString: string, formatString: string = "dd MMMM yyyy"): string {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return "Invalid Date"
    return format(date, formatString, { locale: localeId })
  } catch {
    return "Invalid Date"
  }
}

export function formatDateForInput(dateString: string): string {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return ""
    return format(date, "yyyy-MM-dd")
  } catch {
    return ""
  }
}

export function isValidDate(dateString: string): boolean {
  try {
    const date = parseISO(dateString)
    return isValid(date)
  } catch {
    return false
  }
}

// Image utilities
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = () => reject(new Error('File reading failed'))
    reader.readAsDataURL(file)
  })
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'
    }
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Ukuran file terlalu besar. Maksimal 5MB.'
    }
  }
  
  return { isValid: true }
}

// URL validation
export function isValidURL(url: string): boolean {
  if (!url) return true // Empty URL is considered valid (optional field)
  
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

// Form validation utilities
export function validateTeacherForm(data: TeacherFormData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  
  if (!data.name.trim()) {
    errors.name = 'Nama wajib diisi'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Nama minimal 2 karakter'
  }
  
  if (!data.nip.trim()) {
    errors.nip = 'NIP wajib diisi'
  } else if (!/^\d+$/.test(data.nip.trim())) {
    errors.nip = 'NIP harus berupa angka'
  } else if (data.nip.trim().length < 8) {
    errors.nip = 'NIP minimal 8 digit'
  }
  
  if (!data.position.trim()) {
    errors.position = 'Jabatan wajib diisi'
  }
  
  if (!data.school.trim()) {
    errors.school = 'Nama sekolah wajib diisi'
  }
  
  if (!data.retirementDate) {
    errors.retirementDate = 'Tanggal pensiun wajib diisi'
  } else if (!isValidDate(data.retirementDate)) {
    errors.retirementDate = 'Format tanggal tidak valid'
  }
  
  if (!data.photo) {
    errors.photo = 'Foto guru wajib diupload'
  }
  
  if (data.documentLink && !isValidURL(data.documentLink)) {
    errors.documentLink = 'URL dokumen tidak valid'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Data filtering utilities
export function filterTeachers(teachers: Teacher[], filters: FilterOptions): Teacher[] {
  return teachers.filter(teacher => {
    // Text search across multiple fields
    const searchText = filters.searchText.toLowerCase()
    const textMatch = !searchText || 
      teacher.name.toLowerCase().includes(searchText) ||
      teacher.nip.includes(searchText) ||
      teacher.position.toLowerCase().includes(searchText) ||
      teacher.school.toLowerCase().includes(searchText) ||
      teacher.progressStatus.toLowerCase().includes(searchText)
    
    // Date range filter
    const retirementDate = parseISO(teacher.retirementDate)
    let dateMatch = true
    
    if (filters.startDate) {
      const startDate = startOfDay(parseISO(filters.startDate))
      dateMatch = dateMatch && retirementDate >= startDate
    }
    
    if (filters.endDate) {
      const endDate = endOfDay(parseISO(filters.endDate))
      dateMatch = dateMatch && retirementDate <= endDate
    }
    
    // Progress status filter
    const statusMatch = filters.progressStatus === 'all' || 
      teacher.progressStatus === filters.progressStatus
    
    return textMatch && dateMatch && statusMatch
  })
}

// Local storage utilities
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return defaultValue
  }
}

// Sort utilities
export function sortTeachers(teachers: Teacher[], sortBy: keyof Teacher, sortOrder: 'asc' | 'desc' = 'asc'): Teacher[] {
  return [...teachers].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    
    // Handle date sorting
    if (sortBy === 'retirementDate' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
      const aDate = parseISO(aValue as string)
      const bDate = parseISO(bValue as string)
      return sortOrder === 'asc' 
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime()
    }
    
    // Handle string sorting
    const aStr = String(aValue).toLowerCase()
    const bStr = String(bValue).toLowerCase()
    
    if (aStr < bStr) return sortOrder === 'asc' ? -1 : 1
    if (aStr > bStr) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
}

// Data transformation utilities
export function createTeacherFromFormData(formData: TeacherFormData, photoBase64: string): Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    photo: photoBase64,
    name: formData.name.trim(),
    nip: formData.nip.trim(),
    position: formData.position.trim(),
    school: formData.school.trim(),
    retirementDate: formData.retirementDate,
    progressStatus: 'Belum Diajukan' as ProgressStatus,
    documentLink: formData.documentLink.trim() || undefined
  }
}

// Export filename generator
export function generateExportFilename(prefix: string = 'data_pensiun_guru'): string {
  const now = new Date()
  const timestamp = format(now, 'yyyy-MM-dd_HH-mm-ss')
  return `${prefix}_${timestamp}.xlsx`
}

// Debounce utility for search input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
