import { useState, useEffect } from 'react';
import { dashboardService, type DashboardData } from '../services/api';
import { useAuthStore, useAppStore } from '../store';

export const useDashboard = () => {
  const user = useAuthStore(state => state.user);
  const dashboardVersion = useAppStore(state => state.dashboardVersion);
  const isMessageRead = useAppStore(state => state.isMessageRead);
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

  // Charger les données au montage du composant et quand l'utilisateur change ou que dashboardVersion change
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user?.id, dashboardVersion]); // Ajouter dashboardVersion comme dépendance

  // Fonction pour recharger manuellement
  const refresh = () => {
    loadDashboardData(true);
  };

  // Recalculer les statistiques en prenant en compte l'état du store
  const getUpdatedStats = () => {
    if (!data) {
      return {
        overallAverage: 0,
        pendingAssignments: 0,
        unreadMessages: 0,
        earnedAchievements: 0,
      };
    }

    // Recalculer les messages non lus en prenant en compte le store
    const unreadMessages = data.messages.filter(m => !(m.read || isMessageRead(m.id))).length;

    return {
      ...data.stats,
      unreadMessages
    };
  };

  return {
    data,
    isLoading,
    error,
    refresh,
    // Statistiques rapides avec recalcul des messages non lus
    stats: getUpdatedStats(),
    // Données individuelles pour faciliter l'accès
    recentGrades: data?.recentGrades || [],
    subjects: data?.subjects || [],
    upcomingAssignments: data?.upcomingAssignments || [],
    messages: data?.messages || [],
    achievements: data?.achievements || [],
    // Statut de connexion
    connectionStatus: error ? 'disconnected' : 'connected',
  };
};
