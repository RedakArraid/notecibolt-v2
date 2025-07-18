// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'supervisor';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Types pour le module Students
export interface Student extends User {
  role: 'student';
  address?: string;
  dateOfBirth?: string;
  enrollmentDate: string;
  studentId: string;
  class?: {
    id: string;
    name: string;
    level: string;
  };
  parent?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  academicInfo?: {
    currentGPA: number;
    totalCredits: number;
    completedCredits: number;
    attendanceRate: number;
  };
}

export interface Teacher extends User {
  role: 'teacher';
  address?: string;
  specialization?: string;
  department?: string;
  employeeId: string;
  subjects?: string[];
  classes?: string[];
}

export interface Parent extends User {
  role: 'parent';
  address?: string;
  children?: {
    id: string;
    name: string;
    class: string;
  }[];
}