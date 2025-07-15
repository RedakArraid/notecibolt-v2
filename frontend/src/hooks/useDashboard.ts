import { useState, useEffect } from 'react';
import { dashboardService, type DashboardData } from '../services/api';
import { useAuthStore } from '../store';

export const useDashboard = () => {
  const user = useAuthStore(state => state.user);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async (forceRefresh = false) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Loading dashboard data for user:', user.name);
      
      // Utiliser l'ID de l'utilisateur si c'est un étudiant, sinon null pour "me"
      const studentId = user.role === 'student' ? user.id : undefined;
      
      const dashboardData = await dashboardService.getDashboardData(studentId);
      setData(dashboardData);
      
      console.log('✅ Dashboard data loaded successfully');
    } catch (err) {
      console.error('❌ Failed to load dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant et quand l'utilisateur change
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user?.id]);

  // Fonction pour recharger manuellement
  const refresh = () => {
    loadDashboardData(true);
  };

  return {
    data,
    isLoading,
    error,
    refresh,
    // Statistiques rapides
    stats: data?.stats || {
      overallAverage: 0,
      pendingAssignments: 0,
      unreadMessages: 0,
      earnedAchievements: 0,
    },
    // Données individuelles pour faciliter l'accès
    recentGrades: data?.recentGrades || [],
    subjects: data?.subjects || [],
    upcomingAssignments: data?.upcomingAssignments || [],
    messages: data?.messages || [],
    achievements: data?.achievements || [],
  };
};
