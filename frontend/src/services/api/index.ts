// Export tous les services API
export { apiService } from './apiService';
export { gradesService, type Grade } from './gradesService';
export { assignmentsService, type Assignment } from './assignmentsService';
export { subjectsService, type Subject } from './subjectsService';
export { messagesService, type Message } from './messagesService';
export { achievementsService, type Achievement } from './achievementsService';
export { studentsService, type Student, type StudentStats, type StudentFilters } from './studentsService';
export { attendanceService, type AttendanceRecord, type AttendanceStats, type AttendanceFilters } from './attendanceService';
export { adminService, type AdminStats, type AdminActivity, type AdminAlert, type AdminDashboardData } from './adminService';
export { financeService } from './financeService';
export { admissionsService } from './admissionsService';

// Service centralisé pour le dashboard
import { gradesService } from './gradesService';
import { assignmentsService } from './assignmentsService';
import { subjectsService } from './subjectsService';
import { messagesService } from './messagesService';
import { achievementsService } from './achievementsService';

export interface DashboardData {
  recentGrades: any[];
  subjects: any[];
  upcomingAssignments: any[];
  messages: any[];
  achievements: any[];
  stats: {
    overallAverage: number;
    pendingAssignments: number;
    unreadMessages: number;
    earnedAchievements: number;
  };
}

class DashboardService {
  async getDashboardData(studentId?: string): Promise<DashboardData> {
    try {
      console.log('🔄 Fetching dashboard data from API...');
      
      // Appels parallèles pour optimiser les performances
      const [
        recentGrades,
        subjects,
        upcomingAssignments,
        messages,
        achievements,
      ] = await Promise.allSettled([
        gradesService.getRecentGrades(studentId),
        subjectsService.getStudentSubjects(studentId),
        assignmentsService.getUpcomingAssignments(studentId),
        messagesService.getRecentMessages(studentId),
        achievementsService.getStudentAchievements(studentId),
      ]);

      // Extraction des résultats avec gestion des erreurs
      const dashboardData: DashboardData = {
        recentGrades: recentGrades.status === 'fulfilled' ? recentGrades.value : [],
        subjects: subjects.status === 'fulfilled' ? subjects.value : [],
        upcomingAssignments: upcomingAssignments.status === 'fulfilled' ? upcomingAssignments.value : [],
        messages: messages.status === 'fulfilled' ? messages.value : [],
        achievements: achievements.status === 'fulfilled' ? achievements.value : [],
        stats: {
          overallAverage: 0,
          pendingAssignments: 0,
          unreadMessages: 0,
          earnedAchievements: 0,
        }
      };

      // Calcul des statistiques
      if (dashboardData.subjects.length > 0) {
        dashboardData.stats.overallAverage = dashboardData.subjects
          .reduce((acc, subject) => acc + (subject.average || 0), 0) / dashboardData.subjects.length;
      }

      dashboardData.stats.pendingAssignments = dashboardData.upcomingAssignments
        .filter(a => !a.completed).length;

      dashboardData.stats.unreadMessages = dashboardData.messages
        .filter(m => !m.read).length;

      dashboardData.stats.earnedAchievements = dashboardData.achievements
        .filter(a => a.earned).length;

      console.log('✅ Dashboard data loaded successfully:', {
        grades: dashboardData.recentGrades.length,
        subjects: dashboardData.subjects.length,
        assignments: dashboardData.upcomingAssignments.length,
        messages: dashboardData.messages.length,
        achievements: dashboardData.achievements.length,
      });

      return dashboardData;

    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
