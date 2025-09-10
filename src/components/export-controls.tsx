'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { Teacher, ExcelExportOptions } from '@/lib/types'
import { exportTeachersToExcel, exportFilteredTeachersToExcel } from '@/lib/excel-export'
import { generateExportFilename } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ExportControlsProps {
  teachers: Teacher[]
  filteredTeachers: Teacher[]
  selectedTeachers: string[]
  hasActiveFilters: boolean
  className?: string
}

export function ExportControls({
  teachers,
  filteredTeachers,
  selectedTeachers,
  hasActiveFilters,
  className
}: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExcelExportOptions>({
    includePhotos: false,
    includeDocumentLinks: true,
    filename: generateExportFilename()
  })

  // Handle export option changes
  const updateExportOption = (key: keyof ExcelExportOptions, value: boolean | string) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Export all data
  const handleExportAll = async () => {
    try {
      setIsExporting(true)
      exportTeachersToExcel(teachers, exportOptions.filename)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Gagal mengekspor data. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  // Export filtered data
  const handleExportFiltered = async () => {
    try {
      setIsExporting(true)
      exportFilteredTeachersToExcel(
        filteredTeachers,
        'Data Terfilter',
        exportOptions.filename
      )
    } catch (error) {
      console.error('Export failed:', error)
      alert('Gagal mengekspor data. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  // Export selected data
  const handleExportSelected = async () => {
    try {
      setIsExporting(true)
      const selectedData = teachers.filter(teacher => 
        selectedTeachers.includes(teacher.id)
      )
      exportFilteredTeachersToExcel(
        selectedData,
        `Data Terpilih (${selectedData.length} guru)`,
        exportOptions.filename
      )
    } catch (error) {
      console.error('Export failed:', error)
      alert('Gagal mengekspor data. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  // Quick export (all data, default settings)
  const handleQuickExport = async () => {
    try {
      setIsExporting(true)
      exportTeachersToExcel(teachers)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Gagal mengekspor data. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span>Ekspor Data Excel</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Export */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleQuickExport}
            disabled={isExporting || teachers.length === 0}
            className="flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Mengekspor...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Ekspor Semua ({teachers.length})</span>
              </>
            )}
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={teachers.length === 0}
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <span>Ekspor Kustom</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Pengaturan Ekspor</DialogTitle>
                <DialogDescription>
                  Pilih data yang ingin diekspor dan atur pengaturan file.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Export Options */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Pengaturan File</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeDocumentLinks"
                        checked={exportOptions.includeDocumentLinks}
                        onCheckedChange={(checked) => 
                          updateExportOption('includeDocumentLinks', checked as boolean)
                        }
                      />
                      <Label htmlFor="includeDocumentLinks" className="text-sm">
                        Sertakan link berkas
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includePhotos"
                        checked={exportOptions.includePhotos}
                        onCheckedChange={(checked) => 
                          updateExportOption('includePhotos', checked as boolean)
                        }
                        disabled={true} // Photos are too large for Excel
                      />
                      <Label htmlFor="includePhotos" className="text-sm text-gray-500">
                        Sertakan foto (tidak tersedia)
                      </Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="filename" className="text-sm">Nama File</Label>
                    <Input
                      id="filename"
                      value={exportOptions.filename}
                      onChange={(e) => updateExportOption('filename', e.target.value)}
                      placeholder="data_pensiun_guru.xlsx"
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Export Actions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Pilih Data</h4>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      onClick={() => {
                        handleExportAll()
                        setIsDialogOpen(false)
                      }}
                      disabled={isExporting || teachers.length === 0}
                      variant="outline"
                      className="justify-start text-sm"
                    >
                      <span>Semua Data ({teachers.length} guru)</span>
                    </Button>

                    {hasActiveFilters && (
                      <Button
                        onClick={() => {
                          handleExportFiltered()
                          setIsDialogOpen(false)
                        }}
                        disabled={isExporting || filteredTeachers.length === 0}
                        variant="outline"
                        className="justify-start text-sm"
                      >
                        <span>Data Terfilter ({filteredTeachers.length} guru)</span>
                      </Button>
                    )}

                    {selectedTeachers.length > 0 && (
                      <Button
                        onClick={() => {
                          handleExportSelected()
                          setIsDialogOpen(false)
                        }}
                        disabled={isExporting}
                        variant="outline"
                        className="justify-start text-sm"
                      >
                        <span>Data Terpilih ({selectedTeachers.length} guru)</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Export Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{teachers.length}</div>
            <div className="text-sm text-gray-600">Total Data</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{filteredTeachers.length}</div>
            <div className="text-sm text-gray-600">Data Terfilter</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{selectedTeachers.length}</div>
            <div className="text-sm text-gray-600">Data Terpilih</div>
          </div>
        </div>

        {/* Export Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Format Ekspor Excel:</p>
              <ul className="space-y-1 text-xs">
                <li>• Sheet 1: Data lengkap guru</li>
                <li>• Sheet 2: Ringkasan statistik</li>
                <li>• Sheet 3: Progress tracking per status</li>
                <li>• Foto tidak disertakan (ukuran file)</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}