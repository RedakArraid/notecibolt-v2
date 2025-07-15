import { apiService } from './apiService';
import { assignments as fallbackAssignments } from '../../data/mockData';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  completed?: boolean;
  type?: 'homework' | 'project' | 'exam' | 'quiz';
  maxGrade?: number;
  teacherId?: string;
}

class AssignmentsService {
  async getUpcomingAssignments(studentId?: string): Promise<Assignment[]> {
    try {
      const endpoint = studentId ? `/assignments/student/${studentId}/upcoming` : '/assignments/me/upcoming';
      const response = await apiService.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch assignments from API, using fallback data:', error);
      return fallbackAssignments;
    }
  }

  async getAssignmentsBySubject(subjectId: string, studentId?: string): Promise<Assignment[]> {
    try {
      const endpoint = studentId 
        ? `/assignments/student/${studentId}/subject/${subjectId}`
        : `/assignments/me/subject/${subjectId}`;
      const response = await apiService.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch subject assignments from API:', error);
      return [];
    }
  }

  async getAssignmentById(assignmentId: string): Promise<Assignment | null> {
    try {
      const response = await apiService.get(`/assignments/${assignmentId}`);
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch assignment from API:', error);
      return null;
    }
  }

  async markAssignmentComplete(assignmentId: string): Promise<boolean> {
    try {
      await apiService.put(`/assignments/${assignmentId}/complete`, {});
      return true;
    } catch (error) {
      console.warn('Failed to mark assignment complete:', error);
      return false;
    }
  }
}

export const assignmentsService = new AssignmentsService();
