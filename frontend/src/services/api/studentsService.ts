import { apiService } from './apiService';
import { globalCache } from '../../utils/performance';
import { Student } from '../../types/api';

export interface CreateStudentRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  classId?: string;
  parentId?: string;
  studentId?: string;
}

export interface UpdateStudentRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  classId?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  newStudentsThisMonth: number;
  averageAttendance: number;
  averageGPA: number;
}

export interface StudentFilters {
  search?: string;
  classId?: string;
  isActive?: boolean;
  enrollmentYear?: number;
  sortBy?: 'name' | 'enrollmentDate' | 'gpa' | 'attendance';
  sortOrder?: 'asc' | 'desc';
}

class StudentsService {
  private readonly baseUrl = '/students';
  private readonly cachePrefix = 'students';

  // Obtenir tous les étudiants avec filtres et pagination
  async getStudents(
    page = 1, 
    limit = 20, 
    filters?: StudentFilters
  ): Promise<{
    students: Student[];
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  }> {
    const cacheKey = `${this.cachePrefix}-page-${page}-${limit}-${JSON.stringify(filters)}`;
    
    // Vérifier le cache d'abord
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiService.get(`${this.baseUrl}`, {
        params: {
          page,
          limit,
          ...filters
        }
      });
      
      const result = response.data;
      globalCache.set(cacheKey, result, 5 * 60 * 1000); // Cache 5 minutes
      return result;
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
      throw error;
    }
  }

  // Obtenir un étudiant par ID
  async getStudentById(id: string): Promise<Student> {
    const cacheKey = `${this.cachePrefix}-${id}`;
    
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiService.get(`${this.baseUrl}/${id}`);
      
      const student = response.data;
      globalCache.set(cacheKey, student, 10 * 60 * 1000); // Cache 10 minutes
      return student;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'étudiant:', error);
      throw error;
    }
  }

  // Créer un nouvel étudiant
  async createStudent(studentData: CreateStudentRequest): Promise<Student> {
    try {
      const response = await apiService.post(`${this.baseUrl}`, studentData);
      
      // Invalider les caches pertinents
      this.invalidateStudentCaches();
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'étudiant:', error);
      throw error;
    }
  }

  // Mettre à jour un étudiant
  async updateStudent(id: string, studentData: UpdateStudentRequest): Promise<Student> {
    try {
      const response = await apiService.patch(`${this.baseUrl}/${id}`, studentData);
      
      // Invalider les caches pertinents
      this.invalidateStudentCaches();
      globalCache.delete(`${this.cachePrefix}-${id}`);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'étudiant:', error);
      throw error;
    }
  }

  // Supprimer un étudiant (soft delete)
  async deleteStudent(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
      
      // Invalider les caches pertinents
      this.invalidateStudentCaches();
      globalCache.delete(`${this.cachePrefix}-${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'étudiant:', error);
      throw error;
    }
  }

  // Obtenir les statistiques des étudiants
  async getStudentStats(): Promise<StudentStats> {
    const cacheKey = `${this.cachePrefix}-stats`;
    
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiService.get(`${this.baseUrl}/stats`);
      
      const stats = response.data;
      globalCache.set(cacheKey, stats, 5 * 60 * 1000); // Cache 5 minutes
      return stats;
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      throw error;
    }
  }

  // Rechercher des étudiants
  async searchStudents(query: string, filters?: Omit<StudentFilters, 'search'>): Promise<Student[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/search`, {
        params: {
          q: query,
          ...filters
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'étudiants:', error);
      throw error;
    }
  }

  // Obtenir les étudiants d'une classe
  async getStudentsByClass(classId: string): Promise<Student[]> {
    const cacheKey = `${this.cachePrefix}-class-${classId}`;
    
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiService.get(`${this.baseUrl}/by-class/${classId}`);
      
      const students = response.data;
      globalCache.set(cacheKey, students, 10 * 60 * 1000); // Cache 10 minutes
      return students;
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants de la classe:', error);
      throw error;
    }
  }

  // Obtenir les classes disponibles
  async getAvailableClasses(): Promise<{
    id: string;
    name: string;
    level: string;
    capacity: number;
    currentCount: number;
  }[]> {
    const cacheKey = `${this.cachePrefix}-classes`;
    
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiService.get(`${this.baseUrl}/classes`);
      
      const classes = response.data;
      globalCache.set(cacheKey, classes, 15 * 60 * 1000); // Cache 15 minutes
      return classes;
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
      throw error;
    }
  }

  // Obtenir les parents disponibles
  async getAvailableParents(search?: string): Promise<{
    id: string;
    name: string;
    email: string;
    phone?: string;
  }[]> {
    const cacheKey = `${this.cachePrefix}-parents-${search || 'all'}`;
    
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiService.get(`${this.baseUrl}/parents`, {
        params: search ? { search } : {}
      });
      
      const parents = response.data;
      globalCache.set(cacheKey, parents, 10 * 60 * 1000); // Cache 10 minutes
      return parents;
    } catch (error) {
      console.error('Erreur lors du chargement des parents:', error);
      throw error;
    }
  }

  // Importer des étudiants en lot (CSV/Excel)
  async importStudents(file: File): Promise<{
    imported: number;
    failed: number;
    errors: string[];
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiService.post(`${this.baseUrl}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Invalider les caches après l'import
      this.invalidateStudentCaches();
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'import des étudiants:', error);
      throw error;
    }
  }

  // Exporter les étudiants
  async exportStudents(format: 'csv' | 'excel', filters?: StudentFilters): Promise<Blob> {
    try {
      const response = await apiService.get(`${this.baseUrl}/export`, {
        params: {
          format,
          ...filters
        },
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'export des étudiants:', error);
      throw error;
    }
  }

  // Obtenir l'historique des modifications d'un étudiant
  async getStudentHistory(id: string): Promise<{
    id: string;
    action: string;
    changes: Record<string, any>;
    performedBy: {
      id: string;
      name: string;
    };
    timestamp: string;
  }[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${id}/history`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      throw error;
    }
  }

  // Invalider tous les caches liés aux étudiants
  private invalidateStudentCaches(): void {
    const patterns = [
      `${this.cachePrefix}-page-`,
      `${this.cachePrefix}-stats`,
      `${this.cachePrefix}-class-`,
      `${this.cachePrefix}-classes`,
      `${this.cachePrefix}-parents-`
    ];
    
    patterns.forEach(pattern => {
      globalCache.deletePattern(pattern);
    });
  }

  // Obtenir les étudiants récemment inscrits
  async getRecentlyEnrolled(limit = 5): Promise<Student[]> {
    const cacheKey = `${this.cachePrefix}-recent-${limit}`;
    
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiService.get(`${this.baseUrl}/recent`, {
        params: { limit }
      });
      
      const students = response.data;
      globalCache.set(cacheKey, students, 5 * 60 * 1000); // Cache 5 minutes
      return students;
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants récents:', error);
      throw error;
    }
  }
}

export const studentsService = new StudentsService();
