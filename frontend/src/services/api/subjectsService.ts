import { apiService } from './apiService';
import { subjects as fallbackSubjects } from '../../data/mockData';

export interface Subject {
  id: string;
  name: string;
  color: string;
  average?: number;
  teacher?: string;
  code?: string;
  description?: string;
  department?: string;
  credits?: number;
}

class SubjectsService {
  async getStudentSubjects(studentId?: string): Promise<Subject[]> {
    try {
      const endpoint = studentId ? `/subjects/student/${studentId}` : '/subjects/me';
      const response = await apiService.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch subjects from API, using fallback data:', error);
      return fallbackSubjects;
    }
  }

  async getSubjectById(subjectId: string): Promise<Subject | null> {
    try {
      const response = await apiService.get(`/subjects/${subjectId}`);
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch subject from API:', error);
      return null;
    }
  }

  async getSubjectAverage(subjectId: string, studentId?: string): Promise<number> {
    try {
      const endpoint = studentId 
        ? `/subjects/${subjectId}/student/${studentId}/average`
        : `/subjects/${subjectId}/me/average`;
      const response = await apiService.get(endpoint);
      return response.data?.average || response.average || 0;
    } catch (error) {
      console.warn('Failed to fetch subject average from API:', error);
      return 0;
    }
  }

  async getAllSubjects(): Promise<Subject[]> {
    try {
      const response = await apiService.get('/subjects');
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch all subjects from API:', error);
      return fallbackSubjects;
    }
  }
}

export const subjectsService = new SubjectsService();
