import { useState, useEffect, useCallback } from 'react';
import { adminService, type AdminMetrics } from '../services/api/adminService';

interface UseAdminDashboardReturn {
  metrics: AdminMetrics | null;
  isLoading: boolean;
  error: string | null;
  connectionStatus: 'connected' | 'disconnected';
  lastRefresh: Date;
  refreshMetrics: () => Promise<void>;
  clearError: () => void;
}

export const useAdminDashboard = (period: string = 'current_month'): UseAdminDashboardReturn => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fonction pour charger les métriques
  const loadMetrics = useCallback(async (showLoading: boolean = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Test de connectivité d'abord
      const isConnected = await adminService.testConnection();
      
      if (isConnected) {
        // Charger les vraies données depuis l'API
        const data = await adminService.getMetrics(period);
        setMetrics(data);
        setConnectionStatus('connected');
        console.log('✅ Métriques admin chargées depuis l\'API');
      } else {
        throw new Error('API indisponible');
      }
    } catch (err) {
      console.log('🔄 Basculement vers les données mockées:', err);
      
      // Utiliser les données de fallback
      const fallbackData = adminService.getFallbackMetrics();
      setMetrics(fallbackData);
      setConnectionStatus('disconnected');
      setError('Connexion API indisponible - Mode fallback activé');
    } finally {
      setIsLoading(false);
      setLastRefresh(new Date());
    }
  }, [period]);

  // Fonction de rafraîchissement manuel
  const refreshMetrics = useCallback(async () => {
    try {
      await adminService.clearCache();
      await loadMetrics(false);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement:', err);
    }
  }, [loadMetrics]);

  // Fonction pour nettoyer les erreurs
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Effet de chargement initial
  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  // Effet de rafraîchissement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionStatus === 'connected') {
        loadMetrics(false);
      }
    }, 5 * 60 * 1000); // Rafraîchir toutes les 5 minutes

    return () => clearInterval(interval);
  }, [connectionStatus, loadMetrics]);

  return {
    metrics,
    isLoading,
    error,
    connectionStatus,
    lastRefresh,
    refreshMetrics,
    clearError
  };
};
