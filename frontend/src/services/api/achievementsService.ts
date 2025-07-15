import { apiService } from './apiService';
import { achievements as fallbackAchievements } from '../../data/mockData';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'academic' | 'behavior' | 'participation' | 'leadership' | 'creativity';
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  earned?: boolean;
  earnedDate?: string;
}

class AchievementsService {
  async getStudentAchievements(studentId?: string): Promise<Achievement[]> {
    try {
      const endpoint = studentId ? `/achievements/student/${studentId}` : '/achievements/me';
      const response = await apiService.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch achievements from API, using fallback data:', error);
      return fallbackAchievements;
    }
  }

  async getAvailableAchievements(): Promise<Achievement[]> {
    try {
      const response = await apiService.get('/achievements/available');
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch available achievements from API:', error);
      return fallbackAchievements;
    }
  }

  async getEarnedAchievements(studentId?: string): Promise<Achievement[]> {
    try {
      const endpoint = studentId ? `/achievements/student/${studentId}/earned` : '/achievements/me/earned';
      const response = await apiService.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch earned achievements from API:', error);
      return fallbackAchievements.filter(a => a.earned);
    }
  }

  async getTotalPoints(studentId?: string): Promise<number> {
    try {
      const endpoint = studentId ? `/achievements/student/${studentId}/points` : '/achievements/me/points';
      const response = await apiService.get(endpoint);
      return response.data?.totalPoints || response.totalPoints || 0;
    } catch (error) {
      console.warn('Failed to fetch total points from API:', error);
      return fallbackAchievements
        .filter(a => a.earned)
        .reduce((total, a) => total + a.points, 0);
    }
  }
}

export const achievementsService = new AchievementsService();
