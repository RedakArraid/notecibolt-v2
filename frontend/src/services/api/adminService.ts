import axios, { AxiosInstance, AxiosResponse } from 'axios';

// ===========================
// CONFIGURATION API
// ===========================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Instance axios configurée
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('notecibolt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré, rediriger vers la connexion
      localStorage.removeItem('notecibolt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===========================
// INTERFACES TYPESCRIPT
// ===========================

export interface SystemMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalClasses: number;
  averageClassSize: number;
  attendanceRate: number;
  academicPerformance: number;
  financialHealth: number;
  parentSatisfaction: number;
  teacherRetention: number;
  lastUpdate: string;
}

export interface FinancialData {
  totalRevenue: number;
  pendingPayments: number;
  monthlyExpenses: number;
  profitMargin: number;
  budgetUtilization: number;
}

export interface Alert {
  id: string;
  type: 'financial' | 'academic' | 'staff' | 'infrastructure';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  count: number;
  action: string;
}

export interface Event {
  id: string;
  type: 'admission' | 'payment' | 'incident' | 'achievement';
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

export interface DepartmentStat {
  name: string;
  teachers: number;
  students: number;
  averageGrade: number;
  satisfaction: number;
  color: string;
}

export interface AdminMetrics {
  systemMetrics: SystemMetrics;
  financialData: FinancialData;
  alerts: Alert[];
  events: Event[];
  departments: DepartmentStat[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
  count?: number;
}

// ===========================
// SERVICE ADMIN API
// ===========================

class AdminService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Gestion du cache
  private getCacheKey(endpoint: string, params?: any): string {
    return `admin_${endpoint}_${JSON.stringify(params || {})}`;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      console.log(`📋 Cache hit pour ${key}`);
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
    console.log(`💾 Données mises en cache pour ${key}`);
  }

  // Méthode principale : récupérer toutes les métriques
  async getMetrics(period: string = 'current_month'): Promise<AdminMetrics> {
    const cacheKey = this.getCacheKey('metrics', { period });
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      console.log('🔍 Appel API /admin/metrics...');
      const response: AxiosResponse<ApiResponse<AdminMetrics>> = await apiClient.get(
        `/admin/metrics?period=${period}`
      );
      
      if (response.data.success) {
        this.setCachedData(cacheKey, response.data.data);
        console.log('✅ Métriques admin chargées depuis l\'API');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement des métriques');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des métriques admin:', error);
      throw error;
    }
  }

  // Méthodes spécialisées pour chaque type de données
  async getSystemMetrics(): Promise<SystemMetrics> {
    const cacheKey = this.getCacheKey('system');
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response: AxiosResponse<ApiResponse<SystemMetrics>> = await apiClient.get('/admin/system');
      
      if (response.data.success) {
        this.setCachedData(cacheKey, response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement des métriques système');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des métriques système:', error);
      throw error;
    }
  }

  async getFinancialData(): Promise<FinancialData> {
    const cacheKey = this.getCacheKey('financial');
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response: AxiosResponse<ApiResponse<FinancialData>> = await apiClient.get('/admin/financial');
      
      if (response.data.success) {
        this.setCachedData(cacheKey, response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement des données financières');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données financières:', error);
      throw error;
    }
  }

  async getAlerts(): Promise<Alert[]> {
    const cacheKey = this.getCacheKey('alerts');
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response: AxiosResponse<ApiResponse<Alert[]>> = await apiClient.get('/admin/alerts');
      
      if (response.data.success) {
        this.setCachedData(cacheKey, response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement des alertes');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des alertes:', error);
      throw error;
    }
  }

  async getEvents(): Promise<Event[]> {
    const cacheKey = this.getCacheKey('events');
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response: AxiosResponse<ApiResponse<Event[]>> = await apiClient.get('/admin/events');
      
      if (response.data.success) {
        this.setCachedData(cacheKey, response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement des événements');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des événements:', error);
      throw error;
    }
  }

  async getDepartmentStats(): Promise<DepartmentStat[]> {
    const cacheKey = this.getCacheKey('departments');
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response: AxiosResponse<ApiResponse<DepartmentStat[]>> = await apiClient.get('/admin/departments');
      
      if (response.data.success) {
        this.setCachedData(cacheKey, response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement des statistiques des départements');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques des départements:', error);
      throw error;
    }
  }

  // Méthodes utilitaires
  async getCriticalAlerts(): Promise<Alert[]> {
    try {
      const response: AxiosResponse<ApiResponse<Alert[]>> = await apiClient.get('/admin/alerts/critical');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement des alertes critiques');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des alertes critiques:', error);
      throw error;
    }
  }

  async getOverview(): Promise<any> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await apiClient.get('/admin/stats/overview');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement de la vue d\'ensemble');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la vue d\'ensemble:', error);
      throw error;
    }
  }

  async refreshMetrics(): Promise<AdminMetrics> {
    try {
      const response: AxiosResponse<ApiResponse<AdminMetrics>> = await apiClient.post('/admin/refresh');
      
      if (response.data.success) {
        // Vider le cache pour forcer le rechargement
        this.clearCache();
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erreur lors du rafraîchissement des métriques');
      }
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement des métriques:', error);
      throw error;
    }
  }

  // Gestion du cache
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Cache admin vidé');
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Test de connectivité
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Test de connexion API:', API_BASE_URL);
      
      // Test health check général d'abord
      const healthResponse = await axios.get(`${API_BASE_URL.replace('/api/v1', '')}/health`, {
        timeout: 5000
      });
      
      if (healthResponse.status === 200) {
        console.log('✅ Health check général OK');
        
        // Test endpoint admin
        const adminResponse: AxiosResponse<ApiResponse<any>> = await apiClient.get('/admin/health');
        console.log('✅ Health check admin OK');
        return adminResponse.data.success;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Test de connexion échoué:', {
        url: API_BASE_URL,
        error: error.message,
        code: error.code
      });
      return false;
    }
  }

  // Méthodes de fallback avec données mockées
  getFallbackMetrics(): AdminMetrics {
    return {
      systemMetrics: {
        totalStudents: 856,
        totalTeachers: 45,
        totalStaff: 57,
        totalClasses: 28,
        averageClassSize: 30.6,
        attendanceRate: 94.8,
        academicPerformance: 15.2,
        financialHealth: 87.5,
        parentSatisfaction: 92.3,
        teacherRetention: 96.7,
        lastUpdate: new Date().toISOString()
      },
      financialData: {
        totalRevenue: 245750000,
        pendingPayments: 18500000,
        monthlyExpenses: 42300000,
        profitMargin: 23.5,
        budgetUtilization: 78.2
      },
      alerts: [
        {
          id: 'alert-1',
          type: 'financial',
          severity: 'high',
          title: 'Retards de paiement',
          message: '23 familles ont des impayés de plus de 30 jours',
          count: 23,
          action: 'Voir les détails'
        },
        {
          id: 'alert-2',
          type: 'academic',
          severity: 'medium',
          title: 'Résultats en baisse',
          message: 'Classe de 3eB: moyenne générale sous 10/20',
          count: 1,
          action: 'Analyser'
        },
        {
          id: 'alert-3',
          type: 'staff',
          severity: 'high',
          title: 'Absence enseignant',
          message: 'M. Dupont absent depuis 3 jours sans justificatif',
          count: 1,
          action: 'Contacter'
        },
        {
          id: 'alert-4',
          type: 'infrastructure',
          severity: 'low',
          title: 'Maintenance requise',
          message: 'Laboratoire de chimie: équipement à réviser',
          count: 3,
          action: 'Planifier'
        }
      ],
      events: [
        {
          id: 'event-1',
          type: 'admission',
          title: 'Nouvelle inscription',
          description: 'Lucas Bernard - Seconde A',
          time: '2h',
          icon: 'Users',
          color: 'blue'
        },
        {
          id: 'event-2',
          type: 'payment',
          title: 'Paiement reçu',
          description: '450,000 FCFA - Famille Diallo',
          time: '4h',
          icon: 'DollarSign',
          color: 'green'
        },
        {
          id: 'event-3',
          type: 'incident',
          title: 'Incident disciplinaire',
          description: 'Altercation en cours de récréation',
          time: '6h',
          icon: 'AlertTriangle',
          color: 'orange'
        },
        {
          id: 'event-4',
          type: 'achievement',
          title: 'Résultat exceptionnel',
          description: 'Marie Dubois - 20/20 en Mathématiques',
          time: '1j',
          icon: 'Award',
          color: 'purple'
        }
      ],
      departments: [
        {
          name: 'Sciences',
          teachers: 12,
          students: 245,
          averageGrade: 14.8,
          satisfaction: 89.2,
          color: 'blue'
        },
        {
          name: 'Lettres',
          teachers: 10,
          students: 298,
          averageGrade: 15.1,
          satisfaction: 91.5,
          color: 'green'
        },
        {
          name: 'Langues',
          teachers: 8,
          students: 856,
          averageGrade: 14.2,
          satisfaction: 87.8,
          color: 'purple'
        },
        {
          name: 'Arts & Sports',
          teachers: 6,
          students: 412,
          averageGrade: 16.3,
          satisfaction: 94.1,
          color: 'orange'
        }
      ]
    };
  }
}

// ===========================
// EXPORT SINGLETON
// ===========================

export const adminService = new AdminService();
export type { SystemMetrics, FinancialData, Alert, Event, DepartmentStat, AdminMetrics };
