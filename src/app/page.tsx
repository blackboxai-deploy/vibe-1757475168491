'use client'

import { useState } from 'react'
import { TeacherForm } from '@/components/teacher-form'
import { FilterControls } from '@/components/filter-controls'
import { TeacherTable } from '@/components/teacher-table'
import { ExportControls } from '@/components/export-controls'
import { useTeacherData } from '@/hooks/use-teacher-data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function HomePage() {
  const {
    teachers,
    filteredTeachers,
    filters,
    uiState,
    sortConfig,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    updateFilters,
    clearFilters,
    requestSort,
    toggleTeacherSelection,
    selectAllTeachers,
    clearSelection,
    getStatistics
  } = useTeacherData()

  const [activeTab, setActiveTab] = useState('form')
  const statistics = getStatistics()

  // Check if filters are active
  const hasActiveFilters = Boolean(
    filters.searchText || 
    filters.startDate || 
    filters.endDate || 
    filters.progressStatus !== 'all'
  )

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Pensiun Guru
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola data pensiun guru dengan sistem tracking terintegrasi
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="px-3 py-1.5">
              <span className="font-medium">{statistics.total}</span>
              <span className="ml-1">Total Guru</span>
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5">
              <span className="font-medium">{statistics.retiringSoon}</span>
              <span className="ml-1">Pensiun Tahun Ini</span>
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5">
              <span className="font-medium">{statistics.statusCounts['Belum Diajukan'] || 0}</span>
              <span className="ml-1">Belum Diajukan</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="form" className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="hidden sm:inline">Tambah Data</span>
            <span className="sm:hidden">Form</span>
          </TabsTrigger>
          
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Data Guru</span>
            <span className="sm:hidden">Data</span>
            {teachers.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {statistics.filtered}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="filter" className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">Filter</span>
            <span className="sm:hidden">Filter</span>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="export" className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Ekspor</span>
            <span className="sm:hidden">Excel</span>
          </TabsTrigger>
        </TabsList>

        {/* Form Tab */}
        <TabsContent value="form" className="space-y-6">
          <TeacherForm
            onSubmit={addTeacher}
            isLoading={uiState.isLoading}
          />
          
          {/* Recent additions preview */}
          {teachers.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Data Terbaru Ditambahkan
                </h3>
                <div className="space-y-3">
                  {teachers.slice(-3).reverse().map((teacher) => (
                    <div key={teacher.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={teacher.photo}
                        alt={`Foto ${teacher.name}`}
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{teacher.name}</p>
                        <p className="text-sm text-gray-600">{teacher.school}</p>
                      </div>
                      <Badge 
                        variant="secondary"
                        className="text-xs"
                      >
                        {teacher.progressStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab('data')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Lihat Semua Data →
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-6">
          <TeacherTable
            teachers={filteredTeachers}
            onUpdateTeacher={updateTeacher}
            onDeleteTeacher={deleteTeacher}
            selectedTeachers={uiState.selectedTeachers}
            onToggleSelection={toggleTeacherSelection}
            onSelectAll={selectAllTeachers}
            onClearSelection={clearSelection}
            sortConfig={sortConfig}
            onSort={requestSort}
          />
        </TabsContent>

        {/* Filter Tab */}
        <TabsContent value="filter" className="space-y-6">
          <FilterControls
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
            totalRecords={teachers.length}
            filteredRecords={filteredTeachers.length}
          />
          
          {/* Filter Results Preview */}
          {filteredTeachers.length > 0 && filteredTeachers.length < teachers.length && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Hasil Filter ({filteredTeachers.length} guru)
                  </h3>
                  <button
                    onClick={() => setActiveTab('data')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Lihat Detail →
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredTeachers.slice(0, 6).map((teacher) => (
                    <div key={teacher.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={teacher.photo}
                        alt={`Foto ${teacher.name}`}
                        className="w-10 h-10 object-cover rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{teacher.name}</p>
                        <p className="text-xs text-gray-600 truncate">{teacher.school}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredTeachers.length > 6 && (
                  <p className="text-center text-gray-600 text-sm mt-3">
                    +{filteredTeachers.length - 6} guru lainnya
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-6">
          <ExportControls
            teachers={teachers}
            filteredTeachers={filteredTeachers}
            selectedTeachers={uiState.selectedTeachers}
            hasActiveFilters={hasActiveFilters}
          />
        </TabsContent>
      </Tabs>

      {/* Loading Overlay */}
      {(uiState.isLoading || uiState.isExporting) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-900">
              {uiState.isLoading ? 'Memproses data...' : 'Mengekspor file...'}
            </span>
          </div>
        </div>
      )}

      {/* Success Messages */}
      {teachers.length === 0 && (
        <div className="fixed bottom-6 right-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm shadow-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-blue-900">Selamat datang!</p>
              <p className="text-blue-800 mt-1">
                Mulai dengan menambahkan data guru pensiun pertama Anda.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}