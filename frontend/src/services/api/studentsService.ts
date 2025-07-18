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
    
    // Force l'invalidation du cache à chaque appel pour diagnostic
    globalCache.delete(cacheKey);
    // Vérifier le cache d'abord
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Construction de la query string pour les filtres
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(filters?.search ? { search: filters.search } : {}),
        ...(filters?.classId ? { classId: filters.classId } : {}),
        ...(filters?.isActive !== undefined ? { isActive: String(filters.isActive) } : {}),
        ...(filters?.enrollmentYear ? { enrollmentYear: String(filters.enrollmentYear) } : {}),
        ...(filters?.sortBy ? { sortBy: filters.sortBy } : {}),
        ...(filters?.sortOrder ? { sortOrder: filters.sortOrder } : {}),
      }).toString();
      const response = await apiService.get(`${this.baseUrl}?${params}`);
      const result = response.data;
      globalCache.set(cacheKey, result, 5 * 60 * 1000); // Cache 5 minutes
      // Correction du mapping pour supporter tableau ou objet
      let studentsArr: Student[] = [];
      if (Array.isArray(result)) {
        studentsArr = result;
      } else if (Array.isArray(result.data)) {
        studentsArr = result.data;
      }
      return {
        students: studentsArr,
        totalCount: result.totalCount || 0,
        totalPages: result.totalPages || 1,
        hasMore: result.hasMore || false
      };
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
      const stats = response.data?.data || response.data;
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
      // Construction de la query string pour la recherche
      const params = new URLSearchParams({
        q: query,
        ...(filters?.classId ? { classId: filters.classId } : {}),
        ...(filters?.isActive !== undefined ? { isActive: String(filters.isActive) } : {}),
        ...(filters?.enrollmentYear ? { enrollmentYear: String(filters.enrollmentYear) } : {}),
        ...(filters?.sortBy ? { sortBy: filters.sortBy } : {}),
        ...(filters?.sortOrder ? { sortOrder: filters.sortOrder } : {}),
      }).toString();
      const response = await apiService.get(`${this.baseUrl}/search?${params}`);
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
      const students = response.data?.data || response.data || [];
      globalCache.set(cacheKey, students, 10 * 60 * 1000); // Cache 10 minutes
      return students;
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants de la classe:', error);
      throw error;
    }
  }
}

export const studentsService = new StudentsService();