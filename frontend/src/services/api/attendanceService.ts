import { apiService } from './apiService';
import { globalCache } from '../../utils/cache';

// Types pour le module Attendance
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  className: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timeIn?: string;
  timeOut?: string;
  notes?: string;
  justification?: string;
  justificationFile?: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceStats {
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
  punctualityRate: number;
}

export interface AttendanceFilters {
  studentId?: string;
  classId?: string;
  teacherId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceRecord['status'][];
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'studentName' | 'className' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface AttendanceCreateData {
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceRecord['status'];
  timeIn?: string;
  timeOut?: string;
  notes?: string;
  justification?: string;
}

export interface AttendanceBulkData {
  classId: string;
  date: string;
  records: Array<{
    studentId: string;
    status: AttendanceRecord['status'];
    timeIn?: string;
    timeOut?: string;
    notes?: string;
  }>;
}

class AttendanceService {
  private readonly baseUrl = '/attendance';
  private readonly cachePrefix = 'attendance';
  private readonly cacheTTL = 5 * 60 * 1000; // 5 minutes

  // Obtenir les présences avec filtres et pagination
  async getAttendance(filters: AttendanceFilters = {}): Promise<{
    records: AttendanceRecord[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const cacheKey = `${this.cachePrefix}_list_${JSON.stringify(filters)}`;
    
    try {
      // Vérifier le cache
      const cached = globalCache.get(cacheKey);
      if (cached) return cached;

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await apiService.get(`${this.baseUrl}?${params}`);
      
      // Mettre en cache
      globalCache.set(cacheKey, response.data, this.cacheTTL);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des présences:', error);
      
      // Fallback avec données mockées
      return this.getFallbackAttendance(filters);
    }
  }

  // Obtenir les présences d'un étudiant
  async getStudentAttendance(studentId: string, filters: Omit<AttendanceFilters, 'studentId'> = {}): Promise<{
    records: AttendanceRecord[];
    stats: AttendanceStats;
  }> {
    const cacheKey = `${this.cachePrefix}_student_${studentId}_${JSON.stringify(filters)}`;
    
    try {
      const cached = globalCache.get(cacheKey);
      if (cached) return cached;

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await apiService.get(`${this.baseUrl}/student/${studentId}?${params}`);
      
      globalCache.set(cacheKey, response.data, this.cacheTTL);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des présences étudiant:', error);
      return this.getFallbackStudentAttendance(studentId);
    }
  }

  // Obtenir les présences d'une classe
  async getClassAttendance(classId: string, date?: string): Promise<{
    records: AttendanceRecord[];
    classInfo: {
      id: string;
      name: string;
      studentCount: number;
    };
  }> {
    const cacheKey = `${this.cachePrefix}_class_${classId}_${date || 'today'}`;
    
    try {
      const cached = globalCache.get(cacheKey);
      if (cached) return cached;

      const params = date ? `?date=${date}` : '';
      const response = await apiService.get(`${this.baseUrl}/class/${classId}${params}`);
      
      globalCache.set(cacheKey, response.data, this.cacheTTL);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des présences classe:', error);
      return this.getFallbackClassAttendance(classId);
    }
  }

  // Créer un enregistrement de présence
  async createAttendance(data: AttendanceCreateData): Promise<AttendanceRecord> {
    try {
      const response = await apiService.post(this.baseUrl, data);
      
      // Invalider les caches pertinents
      this.invalidateAttendanceCaches(data.studentId, data.classId);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la présence:', error);
      throw error;
    }
  }

  // Créer des présences en lot pour une classe
  async createBulkAttendance(data: AttendanceBulkData): Promise<AttendanceRecord[]> {
    try {
      const response = await apiService.post(`${this.baseUrl}/bulk`, data);
      
      // Invalider les caches
      this.invalidateAttendanceCaches(undefined, data.classId);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création des présences en lot:', error);
      throw error;
    }
  }

  // Mettre à jour une présence
  async updateAttendance(id: string, data: Partial<AttendanceCreateData>): Promise<AttendanceRecord> {
    try {
      const response = await apiService.patch(`${this.baseUrl}/${id}`, data);
      
      // Invalider les caches
      this.invalidateAllCaches();
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence:', error);
      throw error;
    }
  }

  // Supprimer une présence
  async deleteAttendance(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
      
      // Invalider les caches
      this.invalidateAllCaches();
    } catch (error) {
      console.error('Erreur lors de la suppression de la présence:', error);
      throw error;
    }
  }

  // Obtenir les statistiques de présence
  async getAttendanceStats(filters: {
    studentId?: string;
    classId?: string;
    teacherId?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<AttendanceStats> {
    const cacheKey = `${this.cachePrefix}_stats_${JSON.stringify(filters)}`;
    
    try {
      const cached = globalCache.get(cacheKey);
      if (cached) return cached;

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await apiService.get(`${this.baseUrl}/stats?${params}`);
      
      globalCache.set(cacheKey, response.data, this.cacheTTL);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return this.getFallbackStats();
    }
  }

  // Obtenir le rapport de présence pour export
  async getAttendanceReport(filters: AttendanceFilters = {}): Promise<{
    data: AttendanceRecord[];
    summary: AttendanceStats;
  }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const response = await apiService.get(`${this.baseUrl}/report?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      throw error;
    }
  }

  // Justifier une absence
  async justifyAbsence(id: string, justification: string, file?: File): Promise<AttendanceRecord> {
    try {
      const formData = new FormData();
      formData.append('justification', justification);
      if (file) {
        formData.append('file', file);
      }

      const response = await apiService.patch(`${this.baseUrl}/${id}/justify`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      this.invalidateAllCaches();
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la justification:', error);
      throw error;
    }
  }

  // Invalider les caches spécifiques
  private invalidateAttendanceCaches(studentId?: string, classId?: string): void {
    const patterns = [
      `${this.cachePrefix}_list`,
      `${this.cachePrefix}_stats`,
    ];
    
    if (studentId) {
      patterns.push(`${this.cachePrefix}_student_${studentId}`);
    }
    
    if (classId) {
      patterns.push(`${this.cachePrefix}_class_${classId}`);
    }
    
    globalCache.invalidateByPattern(patterns);
  }

  // Invalider tous les caches
  private invalidateAllCaches(): void {
    globalCache.invalidateByPattern([this.cachePrefix]);
  }

  // Données fallback pour les présences
  private getFallbackAttendance(filters: AttendanceFilters): {
    records: AttendanceRecord[];
    total: number;
    page: number;
    totalPages: number;
  } {
    const mockRecords: AttendanceRecord[] = [
      {
        id: '1',
        studentId: 'student1',
        studentName: 'Alice Martin',
        studentEmail: 'alice.martin@student.com',
        classId: 'class1',
        className: 'Terminal S',
        date: '2024-12-18',
        status: 'present',
        timeIn: '08:00',
        timeOut: '17:00',
        teacherId: 'teacher1',
        teacherName: 'Prof. Dubois',
        createdAt: '2024-12-18T08:00:00Z',
        updatedAt: '2024-12-18T08:00:00Z',
      },
      {
        id: '2',
        studentId: 'student2',
        studentName: 'Bob Dupont',
        studentEmail: 'bob.dupont@student.com',
        classId: 'class1',
        className: 'Terminal S',
        date: '2024-12-18',
        status: 'late',
        timeIn: '08:15',
        notes: 'Retard transport en commun',
        teacherId: 'teacher1',
        teacherName: 'Prof. Dubois',
        createdAt: '2024-12-18T08:15:00Z',
        updatedAt: '2024-12-18T08:15:00Z',
      },
      {
        id: '3',
        studentId: 'student3',
        studentName: 'Charlie Lambert',
        studentEmail: 'charlie.lambert@student.com',
        classId: 'class1',
        className: 'Terminal S',
        date: '2024-12-18',
        status: 'absent',
        teacherId: 'teacher1',
        teacherName: 'Prof. Dubois',
        createdAt: '2024-12-18T08:00:00Z',
        updatedAt: '2024-12-18T08:00:00Z',
      },
      {
        id: '4',
        studentId: 'student4',
        studentName: 'Diana Rousseau',
        studentEmail: 'diana.rousseau@student.com',
        classId: 'class2',
        className: 'Première ES',
        date: '2024-12-18',
        status: 'excused',
        justification: 'Rendez-vous médical',
        teacherId: 'teacher2',
        teacherName: 'Prof. Martin',
        createdAt: '2024-12-18T08:00:00Z',
        updatedAt: '2024-12-18T08:00:00Z',
      },
      {
        id: '5',
        studentId: 'student1',
        studentName: 'Alice Martin',
        studentEmail: 'alice.martin@student.com',
        classId: 'class1',
        className: 'Terminal S',
        date: '2024-12-17',
        status: 'present',
        timeIn: '08:00',
        timeOut: '17:00',
        teacherId: 'teacher1',
        teacherName: 'Prof. Dubois',
        createdAt: '2024-12-17T08:00:00Z',
        updatedAt: '2024-12-17T08:00:00Z',
      },
    ];

    // Appliquer les filtres
    let filteredRecords = mockRecords;
    
    if (filters.studentId) {
      filteredRecords = filteredRecords.filter(r => r.studentId === filters.studentId);
    }
    
    if (filters.classId) {
      filteredRecords = filteredRecords.filter(r => r.classId === filters.classId);
    }
    
    if (filters.status && filters.status.length > 0) {
      filteredRecords = filteredRecords.filter(r => filters.status!.includes(r.status));
    }
    
    if (filters.date) {
      filteredRecords = filteredRecords.filter(r => r.date === filters.date);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const total = filteredRecords.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      records: filteredRecords.slice(startIndex, endIndex),
      total,
      page,
      totalPages,
    };
  }

  // Données fallback pour un étudiant
  private getFallbackStudentAttendance(studentId: string): {
    records: AttendanceRecord[];
    stats: AttendanceStats;
  } {
    const allRecords = this.getFallbackAttendance({ studentId }).records;
    
    const stats: AttendanceStats = {
      totalClasses: 20,
      presentCount: 17,
      absentCount: 2,
      lateCount: 1,
      excusedCount: 0,
      attendanceRate: 85,
      punctualityRate: 94.4,
    };

    return { records: allRecords, stats };
  }

  // Données fallback pour une classe
  private getFallbackClassAttendance(classId: string): {
    records: AttendanceRecord[];
    classInfo: { id: string; name: string; studentCount: number };
  } {
    const records = this.getFallbackAttendance({ classId }).records;
    
    return {
      records,
      classInfo: {
        id: classId,
        name: 'Terminal S',
        studentCount: 25,
      },
    };
  }

  // Statistiques fallback
  private getFallbackStats(): AttendanceStats {
    return {
      totalClasses: 100,
      presentCount: 87,
      absentCount: 8,
      lateCount: 4,
      excusedCount: 1,
      attendanceRate: 87,
      punctualityRate: 91.5,
    };
  }
}

export const attendanceService = new AttendanceService();
