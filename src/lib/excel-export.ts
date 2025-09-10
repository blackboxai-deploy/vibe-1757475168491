// @ts-ignore
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
// @ts-ignore
import { id as localeId } from 'date-fns/locale'
import type { Teacher, ExcelExportOptions } from './types'
import { formatDate } from './utils'

// Excel export functionality for teacher retirement data
export class TeacherExcelExporter {
  private workbook: any

  constructor() {
    this.workbook = XLSX.utils.book_new()
  }

  // Main export function
  exportTeachers(
    teachers: Teacher[], 
    options: Partial<ExcelExportOptions> = {}
  ): void {
    const defaultOptions: ExcelExportOptions = {
      includePhotos: false, // Photos are base64 strings, too large for Excel
      includeDocumentLinks: true,
      filename: this.generateFilename()
    }

    const exportOptions = { ...defaultOptions, ...options }
    
    // Create main data sheet
    this.createMainDataSheet(teachers, exportOptions)
    
    // Create summary sheet
    this.createSummarySheet(teachers)
    
    // Create progress tracking sheet
    this.createProgressSheet(teachers)
    
    // Save the file
    XLSX.writeFile(this.workbook, exportOptions.filename)
  }

  protected createMainDataSheet(teachers: Teacher[], options: ExcelExportOptions): void {
    const worksheetData: any[][] = []
    
    // Headers
    const headers = [
      'No',
      'Nama',
      'NIP',
      'Jabatan',
      'Nama Sekolah',
      'Tanggal Pensiun',
      'Status Progres',
      'Tanggal Dibuat',
      'Terakhir Diupdate'
    ]
    
    if (options.includeDocumentLinks) {
      headers.push('Link Berkas')
    }
    
    worksheetData.push(headers)
    
    // Data rows
    teachers.forEach((teacher, index) => {
      const row = [
        index + 1,
        teacher.name,
        teacher.nip,
        teacher.position,
        teacher.school,
        formatDate(teacher.retirementDate),
        teacher.progressStatus,
        formatDate(teacher.createdAt, 'dd/MM/yyyy HH:mm'),
        formatDate(teacher.updatedAt, 'dd/MM/yyyy HH:mm')
      ]
      
      if (options.includeDocumentLinks) {
        row.push(teacher.documentLink || '-')
      }
      
      worksheetData.push(row)
    })
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    
    // Set column widths
    const columnWidths = [
      { wch: 5 },  // No
      { wch: 25 }, // Nama
      { wch: 20 }, // NIP
      { wch: 20 }, // Jabatan
      { wch: 30 }, // Nama Sekolah
      { wch: 15 }, // Tanggal Pensiun
      { wch: 15 }, // Status Progres
      { wch: 18 }, // Tanggal Dibuat
      { wch: 18 }, // Terakhir Diupdate
    ]
    
    if (options.includeDocumentLinks) {
      columnWidths.push({ wch: 40 }) // Link Berkas
    }
    
    worksheet['!cols'] = columnWidths
    
    // Style headers
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
      if (!worksheet[cellAddress]) continue
      
      worksheet[cellAddress].s = {
        fill: { fgColor: { rgb: "007BFF" } },
        font: { bold: true, color: { rgb: "FFFFFF" } },
        alignment: { horizontal: "center" }
      }
    }
    
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Data Guru Pensiun')
  }

  private createSummarySheet(teachers: Teacher[]): void {
    const worksheetData: any[][] = []
    
    // Title
    worksheetData.push(['RINGKASAN DATA PENSIUN GURU'])
    worksheetData.push([]) // Empty row
    
    // General statistics
    worksheetData.push(['Total Data Guru:', teachers.length])
    worksheetData.push([]) // Empty row
    
    // Status breakdown
    const statusCounts = this.getStatusCounts(teachers)
    worksheetData.push(['BREAKDOWN STATUS PENGAJUAN'])
    Object.entries(statusCounts).forEach(([status, count]) => {
      worksheetData.push([status, count])
    })
    
    worksheetData.push([]) // Empty row
    
    // Monthly retirement breakdown
    const monthlyBreakdown = this.getMonthlyRetirementBreakdown(teachers)
    worksheetData.push(['RENCANA PENSIUN PER BULAN'])
    Object.entries(monthlyBreakdown).forEach(([month, count]) => {
      worksheetData.push([month, count])
    })
    
    worksheetData.push([]) // Empty row
    
    // School breakdown (top 10)
    const schoolBreakdown = this.getSchoolBreakdown(teachers)
    worksheetData.push(['BREAKDOWN PER SEKOLAH (Top 10)'])
    Object.entries(schoolBreakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([school, count]) => {
        worksheetData.push([school, count])
      })
    
    worksheetData.push([]) // Empty row
    worksheetData.push([`Laporan dibuat pada: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: localeId })}`])
    
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 35 },
      { wch: 15 }
    ]
    
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Ringkasan')
  }

  private createProgressSheet(teachers: Teacher[]): void {
    const worksheetData: any[][] = []
    
    // Group teachers by status
    const groupedByStatus = teachers.reduce((acc, teacher) => {
      if (!acc[teacher.progressStatus]) {
        acc[teacher.progressStatus] = []
      }
      acc[teacher.progressStatus].push(teacher)
      return acc
    }, {} as Record<string, Teacher[]>)
    
    // Create sections for each status
    Object.entries(groupedByStatus).forEach(([status, teachersInStatus], index) => {
      if (index > 0) {
        worksheetData.push([]) // Empty row between sections
      }
      
      const teachersList = teachersInStatus as Teacher[]
      worksheetData.push([`${status.toUpperCase()} (${teachersList.length} guru)`])
      worksheetData.push(['Nama', 'NIP', 'Sekolah', 'Tanggal Pensiun'])
      
      teachersList.forEach(teacher => {
        worksheetData.push([
          teacher.name,
          teacher.nip,
          teacher.school,
          formatDate(teacher.retirementDate)
        ])
      })
    })
    
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 25 }, // Nama
      { wch: 20 }, // NIP
      { wch: 30 }, // Sekolah
      { wch: 15 }  // Tanggal Pensiun
    ]
    
    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Progress Tracking')
  }

  private getStatusCounts(teachers: Teacher[]): Record<string, number> {
    return teachers.reduce((acc, teacher) => {
      acc[teacher.progressStatus] = (acc[teacher.progressStatus] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  private getMonthlyRetirementBreakdown(teachers: Teacher[]): Record<string, number> {
    return teachers.reduce((acc, teacher) => {
      const monthYear = format(new Date(teacher.retirementDate), 'MMMM yyyy', { locale: localeId })
      acc[monthYear] = (acc[monthYear] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  private getSchoolBreakdown(teachers: Teacher[]): Record<string, number> {
    return teachers.reduce((acc, teacher) => {
      acc[teacher.school] = (acc[teacher.school] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  private generateFilename(): string {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss')
    return `data_pensiun_guru_${timestamp}.xlsx`
  }
}

// Convenience function for simple exports
export function exportTeachersToExcel(
  teachers: Teacher[], 
  filename?: string
): void {
  const exporter = new TeacherExcelExporter()
  exporter.exportTeachers(teachers, { filename })
}

// Export filtered data
export function exportFilteredTeachersToExcel(
  teachers: Teacher[],
  filterDescription: string,
  filename?: string
): void {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss')
  const defaultFilename = `data_pensiun_guru_filtered_${timestamp}.xlsx`
  
  // Simple approach - just export with custom filename
  const exporter = new TeacherExcelExporter()
  exporter.exportTeachers(teachers, { 
    filename: filename || defaultFilename 
  })
}