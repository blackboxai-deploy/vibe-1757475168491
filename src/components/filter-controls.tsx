'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FilterOptions, ProgressStatus } from '@/lib/types'
import { debounce } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface FilterControlsProps {
  filters: FilterOptions
  onFiltersChange: (filters: Partial<FilterOptions>) => void
  onClearFilters: () => void
  totalRecords: number
  filteredRecords: number
  className?: string
}

export function FilterControls({
  filters,
  onFiltersChange,
  onClearFilters,
  totalRecords,
  filteredRecords,
  className
}: FilterControlsProps) {
  const [searchInput, setSearchInput] = useState(filters.searchText)

  // Debounced search to avoid excessive filtering
  const debouncedSearch = debounce((value: string) => {
    onFiltersChange({ searchText: value })
  }, 300)

  // Handle search input change
  useEffect(() => {
    debouncedSearch(searchInput)
  }, [searchInput, debouncedSearch])

  // Handle date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ startDate: e.target.value })
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ endDate: e.target.value })
  }

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    onFiltersChange({ 
      progressStatus: value as ProgressStatus | 'all' 
    })
  }

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    filters.searchText || 
    filters.startDate || 
    filters.endDate || 
    filters.progressStatus !== 'all'
  )

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span>Filter & Pencarian Data</span>
          </CardTitle>
          
          <div className="text-sm text-gray-600">
            Menampilkan {filteredRecords} dari {totalRecords} data
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Pencarian Teks</Label>
          <div className="relative">
            <Input
              id="search"
              type="text"
              placeholder="Cari berdasarkan nama, NIP, jabatan, atau sekolah..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Tanggal Mulai</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleStartDateChange}
              max={filters.endDate || undefined}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">Tanggal Akhir</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleEndDateChange}
              min={filters.startDate || undefined}
            />
          </div>
        </div>

        {/* Progress Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status">Status Progres Pengajuan</Label>
          <Select 
            value={filters.progressStatus} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status progres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Belum Diajukan">Belum Diajukan</SelectItem>
              <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
              <SelectItem value="Disetujui">Disetujui</SelectItem>
              <SelectItem value="Ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-sm text-gray-600">
            {hasActiveFilters ? (
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Filter aktif</span>
              </span>
            ) : (
              <span>Tidak ada filter aktif</span>
            )}
          </div>
          
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus Filter
            </Button>
          )}
        </div>

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Filter Aktif:</h4>
            <div className="space-y-1 text-sm text-blue-800">
              {filters.searchText && (
                <div>• Pencarian: "{filters.searchText}"</div>
              )}
              {filters.startDate && (
                <div>• Tanggal mulai: {new Date(filters.startDate).toLocaleDateString('id-ID')}</div>
              )}
              {filters.endDate && (
                <div>• Tanggal akhir: {new Date(filters.endDate).toLocaleDateString('id-ID')}</div>
              )}
              {filters.progressStatus !== 'all' && (
                <div>• Status: {filters.progressStatus}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}