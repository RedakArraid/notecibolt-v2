import { apiService } from './apiService';

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  pendingAdmissions: number;
  activeAlerts: number;
  monthlyRevenue: number;
  attendanceRate: number;
  averageGrade: number;
}

export interface AdminActivity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  priority: 'info' | 'success' | 'warning' | 'error';
}

export interface AdminAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentActivities: AdminActivity[];
  systemAlerts: AdminAlert[];
}

class AdminService {
  async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await apiService.get('/admin/stats');
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch admin stats from API:', error);
      // Fallback data
      return {
        totalStudents: 847,
        totalTeachers: 45,
        totalClasses: 28,
        pendingAdmissions: 12,
        activeAlerts: 3,
        monthlyRevenue: 450750,
        attendanceRate: 94.2,
        averageGrade: 15.3
      };
    }
  }

  async getRecentActivities(): Promise<AdminActivity[]> {
    try {
      const response = await apiService.get('/admin/activities');
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch admin activities from API:', error);
      return [];
    }
  }

  async getSystemAlerts(): Promise<AdminAlert[]> {
    try {
      const response = await apiService.get('/admin/alerts');
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch admin alerts from API:', error);
      return [];
    }
  }

  async getAdminDashboardData(): Promise<AdminDashboardData> {
    try {
      const response = await apiService.get('/admin/dashboard');
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch admin dashboard from API:', error);
      
      // Fallback data
      return {
        stats: {
          totalStudents: 847,
          totalTeachers: 45,
          totalClasses: 28,
          pendingAdmissions: 12,
          activeAlerts: 3,
          monthlyRevenue: 450750,
          attendanceRate: 94.2,
          averageGrade: 15.3
        },
        recentActivities: [],
        systemAlerts: []
      };
    }
  }
}

export const adminService = new AdminService();