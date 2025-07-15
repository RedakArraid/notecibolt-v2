import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Données mockées pour les statistiques admin
const mockAdminStats = {
  totalStudents: 847,
  totalTeachers: 45,
  totalClasses: 28,
  pendingAdmissions: 12,
  activeAlerts: 3,
  monthlyRevenue: 450750, // en FCFA
  attendanceRate: 94.2,
  averageGrade: 15.3,
  recentActivities: [
    {
      id: '1',
      type: 'admission',
      message: 'Nouvelle admission : Lucas Bernard (Seconde)',
      timestamp: '2025-01-15T12:00:00Z',
      priority: 'info'
    },
    {
      id: '2',
      type: 'report',
      message: 'Rapport mensuel généré et envoyé',
      timestamp: '2025-01-15T08:00:00Z',
      priority: 'success'
    },
    {
      id: '3',
      type: 'maintenance',
      message: 'Maintenance serveur programmée',
      timestamp: '2025-01-16T14:00:00Z',
      priority: 'warning'
    }
  ],
  systemAlerts: [
    {
      id: '1',
      type: 'attendance',
      title: 'Absentéisme élevé - Classe de 1ère ES',
      message: 'Taux d\'absence de 15% cette semaine',
      priority: 'high',
      timestamp: '2025-01-15T10:00:00Z'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Retards de paiement',
      message: '8 familles avec échéances dépassées',
      priority: 'medium',
      timestamp: '2025-01-15T09:00:00Z'
    },
    {
      id: '3',
      type: 'communication',
      title: 'Messages non traités',
      message: '12 messages de parents en attente',
      priority: 'low',
      timestamp: '2025-01-15T08:30:00Z'
    }
  ]
};

// GET /api/v1/admin/stats - Statistiques générales admin
router.get('/stats', (_req: Request, res: Response) => {
  console.log('📊 GET /api/v1/admin/stats');
  
  res.json({
    success: true,
    data: {
      totalStudents: mockAdminStats.totalStudents,
      totalTeachers: mockAdminStats.totalTeachers,
      totalClasses: mockAdminStats.totalClasses,
      pendingAdmissions: mockAdminStats.pendingAdmissions,
      activeAlerts: mockAdminStats.activeAlerts,
      monthlyRevenue: mockAdminStats.monthlyRevenue,
      attendanceRate: mockAdminStats.attendanceRate,
      averageGrade: mockAdminStats.averageGrade
    },
    message: 'Statistiques admin récupérées avec succès'
  });
});

// GET /api/v1/admin/activities - Activités récentes
router.get('/activities', (_req: Request, res: Response) => {
  console.log('🔄 GET /api/v1/admin/activities');
  
  res.json({
    success: true,
    data: mockAdminStats.recentActivities,
    message: 'Activités récentes récupérées avec succès'
  });
});

// GET /api/v1/admin/alerts - Alertes système
router.get('/alerts', (_req: Request, res: Response) => {
  console.log('⚠️ GET /api/v1/admin/alerts');
  
  res.json({
    success: true,
    data: mockAdminStats.systemAlerts,
    message: 'Alertes système récupérées avec succès'
  });
});

// GET /api/v1/admin/dashboard - Données complètes du dashboard admin
router.get('/dashboard', (_req: Request, res: Response) => {
  console.log('🎛️ GET /api/v1/admin/dashboard');
  
  res.json({
    success: true,
    data: {
      stats: {
        totalStudents: mockAdminStats.totalStudents,
        totalTeachers: mockAdminStats.totalTeachers,
        totalClasses: mockAdminStats.totalClasses,
        pendingAdmissions: mockAdminStats.pendingAdmissions,
        activeAlerts: mockAdminStats.activeAlerts,
        monthlyRevenue: mockAdminStats.monthlyRevenue,
        attendanceRate: mockAdminStats.attendanceRate,
        averageGrade: mockAdminStats.averageGrade
      },
      recentActivities: mockAdminStats.recentActivities,
      systemAlerts: mockAdminStats.systemAlerts
    },
    message: 'Dashboard admin récupéré avec succès'
  });
});

export default router;