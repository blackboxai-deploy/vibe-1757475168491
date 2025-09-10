'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Teacher, FilterOptions, TeacherFormData, UIState } from '@/lib/types'
import { 
  generateId, 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  filterTeachers,
  sortTeachers,
  createTeacherFromFormData,
  convertFileToBase64
} from '@/lib/utils'
import { STORAGE_KEYS } from '@/lib/types'

// Custom hook for managing teacher retirement data
export function useTeacherData() {
  // State management
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: '',
    startDate: '',
    endDate: '',
    progressStatus: 'all'
  })
  const [uiState, setUIState] = useState<UIState>({
    isLoading: false,
    isExporting: false,
    selectedTeachers: [],
    showDeleteDialog: false,
    teacherToDelete: undefined
  })
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Teacher | null
    direction: 'asc' | 'desc'
  }>({
    key: null,
    direction: 'asc'
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTeachers = loadFromLocalStorage<Teacher[]>(STORAGE_KEYS.TEACHERS, [])
    setTeachers(savedTeachers)
  }, [])

  // Apply filters and sorting whenever teachers or filters change
  useEffect(() => {
    let result = filterTeachers(teachers, filters)
    
    if (sortConfig.key) {
      result = sortTeachers(result, sortConfig.key, sortConfig.direction)
    }
    
    setFilteredTeachers(result)
  }, [teachers, filters, sortConfig])

  // Save to localStorage whenever teachers change
  useEffect(() => {
    if (teachers.length >= 0) { // Save even if empty array
      saveToLocalStorage(STORAGE_KEYS.TEACHERS, teachers)
    }
  }, [teachers])

  // Add new teacher
  const addTeacher = useCallback(async (formData: TeacherFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      setUIState(prev => ({ ...prev, isLoading: true }))

      if (!formData.photo) {
        return { success: false, error: 'Foto guru wajib diupload' }
      }

      // Convert photo to base64
      const photoBase64 = await convertFileToBase64(formData.photo)
      
      // Create teacher object
      const teacherData = createTeacherFromFormData(formData, photoBase64)
      const newTeacher: Teacher = {
        id: generateId(),
        ...teacherData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Add to state
      setTeachers(prev => [...prev, newTeacher])
      
      return { success: true }
    } catch (error) {
      console.error('Error adding teacher:', error)
      return { 
        success: false, 
        error: 'Terjadi kesalahan saat menambah data guru' 
      }
    } finally {
      setUIState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  // Update teacher
  const updateTeacher = useCallback((teacherId: string, updates: Partial<Teacher>): void => {
    setTeachers(prev => 
      prev.map(teacher => 
        teacher.id === teacherId 
          ? { ...teacher, ...updates, updatedAt: new Date().toISOString() }
          : teacher
      )
    )
  }, [])

  // Delete teacher
  const deleteTeacher = useCallback((teacherId: string): void => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId))
    setUIState(prev => ({ 
      ...prev, 
      selectedTeachers: prev.selectedTeachers.filter(id => id !== teacherId),
      showDeleteDialog: false,
      teacherToDelete: undefined
    }))
  }, [])

  // Delete multiple teachers
  const deleteMultipleTeachers = useCallback((teacherIds: string[]): void => {
    setTeachers(prev => prev.filter(teacher => !teacherIds.includes(teacher.id)))
    setUIState(prev => ({ 
      ...prev, 
      selectedTeachers: [],
      showDeleteDialog: false
    }))
  }, [])

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<FilterOptions>): void => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Clear filters
  const clearFilters = useCallback((): void => {
    setFilters({
      searchText: '',
      startDate: '',
      endDate: '',
      progressStatus: 'all'
    })
  }, [])

  // Sorting
  const requestSort = useCallback((key: keyof Teacher): void => {
    setSortConfig(prev => {
      if (prev.key === key && prev.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return { key, direction: 'asc' }
    })
  }, [])

  // Selection management
  const toggleTeacherSelection = useCallback((teacherId: string): void => {
    setUIState(prev => ({
      ...prev,
      selectedTeachers: prev.selectedTeachers.includes(teacherId)
        ? prev.selectedTeachers.filter(id => id !== teacherId)
        : [...prev.selectedTeachers, teacherId]
    }))
  }, [])

  const selectAllTeachers = useCallback((): void => {
    setUIState(prev => ({
      ...prev,
      selectedTeachers: filteredTeachers.map(teacher => teacher.id)
    }))
  }, [filteredTeachers])

  const clearSelection = useCallback((): void => {
    setUIState(prev => ({ ...prev, selectedTeachers: [] }))
  }, [])

  // UI state management
  const setLoading = useCallback((loading: boolean): void => {
    setUIState(prev => ({ ...prev, isLoading: loading }))
  }, [])

  const setExporting = useCallback((exporting: boolean): void => {
    setUIState(prev => ({ ...prev, isExporting: exporting }))
  }, [])

  const showDeleteConfirmation = useCallback((teacherId?: string): void => {
    setUIState(prev => ({ 
      ...prev, 
      showDeleteDialog: true, 
      teacherToDelete: teacherId 
    }))
  }, [])

  const hideDeleteConfirmation = useCallback((): void => {
    setUIState(prev => ({ 
      ...prev, 
      showDeleteDialog: false, 
      teacherToDelete: undefined 
    }))
  }, [])

  // Statistics
  const getStatistics = useCallback(() => {
    const total = teachers.length
    const statusCounts = teachers.reduce((acc, teacher) => {
      acc[teacher.progressStatus] = (acc[teacher.progressStatus] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const currentYear = new Date().getFullYear()
    const retiringSoon = teachers.filter(teacher => {
      const retirementDate = new Date(teacher.retirementDate)
      return retirementDate.getFullYear() === currentYear
    }).length

    return {
      total,
      statusCounts,
      retiringSoon,
      filtered: filteredTeachers.length
    }
  }, [teachers, filteredTeachers])

  // Check if teacher exists (by NIP)
  const teacherExists = useCallback((nip: string, excludeId?: string): boolean => {
    return teachers.some(teacher => 
      teacher.nip === nip && teacher.id !== excludeId
    )
  }, [teachers])

  // Bulk operations
  const updateMultipleTeachers = useCallback((
    teacherIds: string[], 
    updates: Partial<Pick<Teacher, 'progressStatus'>>
  ): void => {
    setTeachers(prev => 
      prev.map(teacher => 
        teacherIds.includes(teacher.id)
          ? { ...teacher, ...updates, updatedAt: new Date().toISOString() }
          : teacher
      )
    )
  }, [])

  return {
    // Data
    teachers,
    filteredTeachers,
    filters,
    uiState,
    sortConfig,
    
    // Actions
    addTeacher,
    updateTeacher,
    deleteTeacher,
    deleteMultipleTeachers,
    
    // Filtering & Sorting
    updateFilters,
    clearFilters,
    requestSort,
    
    // Selection
    toggleTeacherSelection,
    selectAllTeachers,
    clearSelection,
    
    // UI State
    setLoading,
    setExporting,
    showDeleteConfirmation,
    hideDeleteConfirmation,
    
    // Utilities
    getStatistics,
    teacherExists,
    updateMultipleTeachers
  }
}