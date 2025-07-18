import { Router, Request, Response } from 'express';
import { 
  getAllAdminMetrics,
  getSystemMetrics, 
  getFinancialMetrics,
  getCriticalAlerts,
  getRecentEvents,
  getDepartmentStats 
} from './services';
import { authMiddleware, requireAdmin } from '../../shared/middleware/authMiddleware';

const router = Router();

// ===========================
// MIDDLEWARE DE VÉRIFICATION ADMIN
// ===========================

// Utilisation du middleware centralisé

// ===========================
// ROUTES PRINCIPALES
// ===========================

/**
 * GET /api/v1/admin/metrics
 * Récupère toutes les métriques admin en une seule requête
 */
router.get('/metrics', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const period = req.query.period as string || 'current_month';
    const metrics = await getAllAdminMetrics(period);
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement des métriques admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur lors du chargement des métriques',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * GET /api/v1/admin/system
 * Récupère uniquement les métriques système
 */
router.get('/system', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const systemMetrics = await getSystemMetrics();
    
    res.json({
      success: true,
      data: systemMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement des métriques système:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des métriques système',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * GET /api/v1/admin/financial
 * Récupère uniquement les données financières
 */
router.get('/financial', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const financialData = await getFinancialMetrics();
    
    res.json({
      success: true,
      data: financialData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement des données financières:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des données financières',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * GET /api/v1/admin/alerts
 * Récupère uniquement les alertes critiques
 */
router.get('/alerts', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const alerts = await getCriticalAlerts();
    
    res.json({
      success: true,
      data: alerts,
      count: alerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement des alertes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des alertes critiques',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * GET /api/v1/admin/events
 * Récupère uniquement les événements récents
 */
router.get('/events', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const events = await getRecentEvents();
    
    res.json({
      success: true,
      data: events,
      count: events.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement des événements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des événements récents',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * GET /api/v1/admin/departments
 * Récupère uniquement les statistiques des départements
 */
router.get('/departments', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const departments = await getDepartmentStats();
    
    res.json({
      success: true,
      data: departments,
      count: departments.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques des départements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des statistiques des départements',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * POST /api/v1/admin/refresh
 * Force le rafraîchissement de toutes les métriques
 */
router.post('/refresh', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    // Invalider les caches (si implémenté)
    // await invalidateAdminCaches();
    
    const metrics = await getAllAdminMetrics();
    
    res.json({
      success: true,
      data: metrics,
      message: 'Métriques rafraîchies avec succès',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des métriques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du rafraîchissement des métriques',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * GET /api/v1/admin/health
 * Endpoint de santé pour vérifier le statut du service admin
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Test de connexion base de données
    const systemMetrics = await getSystemMetrics();
    
    res.json({
      success: true,
      status: 'healthy',
      services: {
        database: 'connected',
        admin_services: 'operational'
      },
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    });
  } catch (error) {
    console.error('Erreur health check admin:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      services: {
        database: 'disconnected',
        admin_services: 'error'
      },
      error: 'Service admin indisponible',
      timestamp: new Date().toISOString()
    });
  }
});

// ===========================
// ROUTES SPÉCIALISÉES
// ===========================

/**
 * GET /api/v1/admin/stats/overview
 * Vue d'ensemble rapide pour le dashboard
 */
router.get('/stats/overview', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const [systemMetrics, financialData, alertsCount] = await Promise.all([
      getSystemMetrics(),
      getFinancialMetrics(),
      getCriticalAlerts().then(alerts => alerts.length)
    ]);
    
    res.json({
      success: true,
      data: {
        students: systemMetrics.totalStudents,
        teachers: systemMetrics.totalTeachers,
        classes: systemMetrics.totalClasses,
        attendance: systemMetrics.attendanceRate,
        performance: systemMetrics.academicPerformance,
        revenue: financialData.totalRevenue,
        pendingPayments: financialData.pendingPayments,
        criticalAlerts: alertsCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement de la vue d\'ensemble:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement de la vue d\'ensemble',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * GET /api/v1/admin/alerts/critical
 * Récupère uniquement les alertes critiques (severity: high)
 */
router.get('/alerts/critical', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const allAlerts = await getCriticalAlerts();
    const criticalAlerts = allAlerts.filter(alert => alert.severity === 'high');
    
    res.json({
      success: true,
      data: criticalAlerts,
      count: criticalAlerts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement des alertes critiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des alertes critiques',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * GET /api/v1/admin/performance/academic
 * Détails sur la performance académique
 */
router.get('/performance/academic', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const systemMetrics = await getSystemMetrics();
    const departments = await getDepartmentStats();
    
    res.json({
      success: true,
      data: {
        overallPerformance: systemMetrics.academicPerformance,
        attendanceRate: systemMetrics.attendanceRate,
        departmentBreakdown: departments.map(dept => ({
          name: dept.name,
          averageGrade: dept.averageGrade,
          studentCount: dept.students,
          teacherCount: dept.teachers
        }))
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement des performances académiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des performances académiques',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

/**
 * GET /api/v1/admin/financial/summary
 * Résumé financier détaillé
 */
router.get('/financial/summary', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const financialData = await getFinancialMetrics();
    const alerts = await getCriticalAlerts();
    const financialAlerts = alerts.filter(alert => alert.type === 'financial');
    
    res.json({
      success: true,
      data: {
        ...financialData,
        alerts: financialAlerts,
        healthStatus: financialData.profitMargin > 20 ? 'excellent' : 
                     financialData.profitMargin > 10 ? 'good' : 
                     financialData.profitMargin > 0 ? 'warning' : 'critical'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement du résumé financier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement du résumé financier',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// ===========================
// GESTION D'ERREURS
// ===========================

// Middleware de gestion d'erreurs pour les routes admin
router.use((error: any, req: Request, res: Response, next: any) => {
  console.error('Erreur dans les routes admin:', error);
  
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    timestamp: new Date().toISOString()
  });
});

export default router;
