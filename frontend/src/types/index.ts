// Types pour les utilisateurs - Copié de la v1
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin' | 'staff';
  avatar?: string;
  classId?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  parentIds: string[];
  classId: string;
  admissionDate: string;
  academicYear: string;
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    emergencyMedicalContact?: string;
  };
  academicHistory: AcademicRecord[];
}

export interface Teacher extends User {
  role: 'teacher';
  employeeId: string;
  subjects: string[];
  classes: string[];
  qualifications: string[];
  hireDate: string;
  department: string;
}

export interface Parent extends User {
  role: 'parent';
  childrenIds: string[];
  occupation?: string;
  preferredContactMethod: 'email' | 'sms' | 'phone';
}

export interface AcademicRecord {
  year: string;
  class: string;
  grades: Grade[];
  attendance: AttendanceRecord[];
  behavior: BehaviorRecord[];
  achievements: string[];
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  value: number;
  maxValue: number;
  date: string;
  type: 'homework' | 'test' | 'quiz' | 'project' | 'exam';
  comment?: string;
  teacherId: string;
  competencies?: CompetencyEvaluation[];
}

export interface CompetencyEvaluation {
  competencyId: string;
  level: 'insufficient' | 'fragile' | 'satisfactory' | 'good' | 'excellent';
  comment?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  period?: string;
  subject?: string;
  teacherId: string;
  reason?: string;
  notifiedParents: boolean;
  createdAt: string;
}

export interface BehaviorRecord {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;
  type: 'positive' | 'negative' | 'neutral';
  category: 'discipline' | 'participation' | 'homework' | 'social' | 'other';
  description: string;
  severity?: 'minor' | 'moderate' | 'major';
  actionTaken?: string;
  parentNotified: boolean;
  followUpRequired: boolean;
}

// Types pour les réponses API (existant déjà mais étendu)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp?: string;
  count?: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type { FinancialRecord } from './FinancialRecord';
// À décommenter quand FinancialRecord sera défini

export type { AdmissionApplication } from './AdmissionApplication';
