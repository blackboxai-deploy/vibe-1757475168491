'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import type { Teacher, ProgressStatus } from '@/lib/types'
import { PROGRESS_STATUS_CONFIG } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TeacherTableProps {
  teachers: Teacher[]
  onUpdateTeacher: (teacherId: string, updates: Partial<Teacher>) => void
  onDeleteTeacher: (teacherId: string) => void
  selectedTeachers: string[]
  onToggleSelection: (teacherId: string) => void
  onSelectAll: () => void
  onClearSelection: () => void
  sortConfig: { key: keyof Teacher | null; direction: 'asc' | 'desc' }
  onSort: (key: keyof Teacher) => void
  className?: string
}

export function TeacherTable({
  teachers,
  onUpdateTeacher,
  onDeleteTeacher,
  selectedTeachers,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  sortConfig,
  onSort,
  className
}: TeacherTableProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([])

  // Toggle row expansion for mobile view
  const toggleRowExpansion = (teacherId: string) => {
    setExpandedRows(prev => 
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    )
  }

  // Handle progress status update
  const handleStatusUpdate = (teacherId: string, newStatus: ProgressStatus) => {
    onUpdateTeacher(teacherId, { progressStatus: newStatus })
  }

  // Sort indicator component
  const SortIndicator = ({ column }: { column: keyof Teacher }) => {
    if (sortConfig.key !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  if (teachers.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data guru</h3>
          <p className="text-gray-600 text-center max-w-md">
            Mulai dengan menambahkan data guru baru menggunakan form di atas.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span>Data Guru Pensiun ({teachers.length})</span>
          </CardTitle>
          
          {selectedTeachers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedTeachers.length} dipilih
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
              >
                Batal Pilih
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="w-12 p-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTeachers.length === teachers.length && teachers.length > 0}
                    onChange={selectedTeachers.length === teachers.length ? onClearSelection : onSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="w-20 p-3 text-left font-medium text-gray-900">Foto</th>
                <th className="p-3 text-left">
                  <button
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-blue-600"
                    onClick={() => onSort('name')}
                  >
                    <span>Nama</span>
                    <SortIndicator column="name" />
                  </button>
                </th>
                <th className="p-3 text-left">
                  <button
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-blue-600"
                    onClick={() => onSort('nip')}
                  >
                    <span>NIP</span>
                    <SortIndicator column="nip" />
                  </button>
                </th>
                <th className="p-3 text-left">
                  <button
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-blue-600"
                    onClick={() => onSort('position')}
                  >
                    <span>Jabatan</span>
                    <SortIndicator column="position" />
                  </button>
                </th>
                <th className="p-3 text-left">
                  <button
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-blue-600"
                    onClick={() => onSort('school')}
                  >
                    <span>Sekolah</span>
                    <SortIndicator column="school" />
                  </button>
                </th>
                <th className="p-3 text-left">
                  <button
                    className="flex items-center space-x-1 font-medium text-gray-900 hover:text-blue-600"
                    onClick={() => onSort('retirementDate')}
                  >
                    <span>Tanggal Pensiun</span>
                    <SortIndicator column="retirementDate" />
                  </button>
                </th>
                <th className="p-3 text-left font-medium text-gray-900">Status Progress</th>
                <th className="p-3 text-left font-medium text-gray-900">Link Berkas</th>
                <th className="w-24 p-3 text-center font-medium text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacher.id)}
                      onChange={() => onToggleSelection(teacher.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-3">
                    <img
                      src={teacher.photo}
                      alt={`Foto ${teacher.name}`}
                      className="w-12 h-16 object-cover rounded border"
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-900">{teacher.name}</td>
                  <td className="p-3 text-gray-600 font-mono">{teacher.nip}</td>
                  <td className="p-3 text-gray-600">{teacher.position}</td>
                  <td className="p-3 text-gray-600">{teacher.school}</td>
                  <td className="p-3 text-gray-600">{formatDate(teacher.retirementDate)}</td>
                  <td className="p-3">
                    <Select
                      value={teacher.progressStatus}
                      onValueChange={(value: ProgressStatus) => handleStatusUpdate(teacher.id, value)}
                    >
                      <SelectTrigger className="w-auto min-w-36">
                        <Badge 
                          variant={PROGRESS_STATUS_CONFIG[teacher.progressStatus].variant}
                          className={PROGRESS_STATUS_CONFIG[teacher.progressStatus].color}
                        >
                          {PROGRESS_STATUS_CONFIG[teacher.progressStatus].label}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Belum Diajukan">Belum Diajukan</SelectItem>
                        <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                        <SelectItem value="Disetujui">Disetujui</SelectItem>
                        <SelectItem value="Ditolak">Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    {teacher.documentLink ? (
                      <a
                        href={teacher.documentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        Lihat Berkas
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Data Guru</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus data guru <strong>{teacher.name}</strong>? 
                            Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteTeacher(teacher.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 p-4">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedTeachers.includes(teacher.id)}
                    onChange={() => onToggleSelection(teacher.id)}
                    className="mt-1 rounded border-gray-300"
                  />
                  
                  <img
                    src={teacher.photo}
                    alt={`Foto ${teacher.name}`}
                    className="w-16 h-20 object-cover rounded border flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900 truncate">{teacher.name}</h3>
                        <p className="text-sm text-gray-600 font-mono">{teacher.nip}</p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(teacher.id)}
                        className="p-1"
                      >
                        <svg
                          className={cn(
                            "w-4 h-4 transition-transform",
                            expandedRows.includes(teacher.id) && "rotate-180"
                          )}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Button>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Jabatan:</span> {teacher.position}</p>
                      <p><span className="text-gray-500">Sekolah:</span> {teacher.school}</p>
                      <p><span className="text-gray-500">Pensiun:</span> {formatDate(teacher.retirementDate)}</p>
                    </div>
                    
                    {expandedRows.includes(teacher.id) && (
                      <div className="mt-4 space-y-3 border-t pt-3">
                        {/* Status Update */}
                        <div>
                          <label className="text-sm text-gray-500 mb-1 block">Status Progress:</label>
                          <Select
                            value={teacher.progressStatus}
                            onValueChange={(value: ProgressStatus) => handleStatusUpdate(teacher.id, value)}
                          >
                            <SelectTrigger className="w-full">
                              <Badge 
                                variant={PROGRESS_STATUS_CONFIG[teacher.progressStatus].variant}
                                className={PROGRESS_STATUS_CONFIG[teacher.progressStatus].color}
                              >
                                {PROGRESS_STATUS_CONFIG[teacher.progressStatus].label}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Belum Diajukan">Belum Diajukan</SelectItem>
                              <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                              <SelectItem value="Disetujui">Disetujui</SelectItem>
                              <SelectItem value="Ditolak">Ditolak</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Document Link */}
                        {teacher.documentLink && (
                          <div>
                            <label className="text-sm text-gray-500 mb-1 block">Berkas:</label>
                            <a
                              href={teacher.documentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline text-sm"
                            >
                              Lihat Berkas →
                            </a>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex justify-end">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                Hapus Data
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Data Guru</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus data guru <strong>{teacher.name}</strong>? 
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDeleteTeacher(teacher.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}