import { apiService } from './apiService';
import { recentGrades as fallbackGrades } from '../../data/mockData';

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  value: number;
  maxValue: number;
  date: string;
  type: 'test' | 'homework' | 'quiz' | 'project' | 'exam';
  comment?: string;
  teacherId: string;
}

class GradesService {
  async getRecentGrades(studentId?: string): Promise<Grade[]> {
    try {
      const endpoint = studentId ? `/grades/student/${studentId}/recent` : '/grades/me/recent';
      const response = await apiService.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch grades from API, using fallback data:', error);
      return fallbackGrades;
    }
  }

  async getGradesBySubject(subjectId: string, studentId?: string): Promise<Grade[]> {
    try {
      const endpoint = studentId 
        ? `/grades/student/${studentId}/subject/${subjectId}`
        : `/grades/me/subject/${subjectId}`;
      const response = await apiService.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch subject grades from API:', error);
      return [];
    }
  }

  async getStudentAverage(studentId?: string): Promise<number> {
    try {
      const endpoint = studentId ? `/grades/student/${studentId}/average` : '/grades/me/average';
      const response = await apiService.get(endpoint);
      return response.data?.average || response.average || 0;
    } catch (error) {
      console.warn('Failed to fetch average from API:', error);
      // Calcul de fallback avec les données mockées
      const grades = fallbackGrades;
      return grades.reduce((acc, grade) => acc + (grade.value / grade.maxValue * 20), 0) / grades.length;
    }
  }
}

export const gradesService = new GradesService();
