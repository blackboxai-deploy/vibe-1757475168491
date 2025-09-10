// TypeScript definitions for Teacher Retirement Data Management System

export interface Teacher {
  id: string;
  photo: string; // Base64 encoded image data
  name: string;
  nip: string; // National Identification Number
  position: string; // Job position/title
  school: string;
  retirementDate: string; // ISO date string
  progressStatus: ProgressStatus;
  documentLink?: string; // Optional URL to documents
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type ProgressStatus = 
  | 'Belum Diajukan'    // Not submitted
  | 'Dalam Proses'      // In progress
  | 'Disetujui'         // Approved
  | 'Ditolak';          // Rejected

export interface TeacherFormData {
  photo: File | null;
  name: string;
  nip: string;
  position: string;
  school: string;
  retirementDate: string;
  documentLink: string;
}

export interface FilterOptions {
  searchText: string;
  startDate: string;
  endDate: string;
  progressStatus: ProgressStatus | 'all';
}

export interface ExcelExportOptions {
  includePhotos: boolean;
  includeDocumentLinks: boolean;
  filename: string;
}

// Form validation schemas
export interface TeacherFormErrors {
  photo?: string;
  name?: string;
  nip?: string;
  position?: string;
  school?: string;
  retirementDate?: string;
  documentLink?: string;
}

// UI States
export interface UIState {
  isLoading: boolean;
  isExporting: boolean;
  selectedTeachers: string[]; // Array of teacher IDs
  showDeleteDialog: boolean;
  teacherToDelete?: string;
}

// Local Storage Keys
export const STORAGE_KEYS = {
  TEACHERS: 'teachers-data',
  PREFERENCES: 'app-preferences'
} as const;

// Progress Status Colors and Labels
export const PROGRESS_STATUS_CONFIG = {
  'Belum Diajukan': {
    label: 'Belum Diajukan',
    color: 'bg-gray-100 text-gray-800',
    variant: 'secondary' as const
  },
  'Dalam Proses': {
    label: 'Dalam Proses',
    color: 'bg-blue-100 text-blue-800',
    variant: 'default' as const
  },
  'Disetujui': {
    label: 'Disetujui',
    color: 'bg-green-100 text-green-800',
    variant: 'default' as const
  },
  'Ditolak': {
    label: 'Ditolak',
    color: 'bg-red-100 text-red-800',
    variant: 'destructive' as const
  }
} as const;

// Constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Utility type for component props
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// API Response types (for future backend integration)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}