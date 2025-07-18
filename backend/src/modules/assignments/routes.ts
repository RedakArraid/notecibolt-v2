import { Router, Request, Response } from 'express';

const router = Router();

// Mock data pour les devoirs
const mockAssignments = [
  {
    id: '1',
    title: 'Résolution d\'équations du second degré',
    subject: 'Mathématiques',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Exercices 1 à 15 page 87',
    teacher: 'M. Traoré',
    completed: false,
    priority: 'high'
  },
  {
    id: '2',
    title: 'Exposé sur la Révolution française',
    subject: 'Histoire',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Présentation de 10 minutes sur les causes de la Révolution',
    teacher: 'Mme Coulibaly',
    completed: false,
    priority: 'medium'
  }
];

// GET /api/v1/assignments/me/upcoming - Obtenir les devoirs à venir
router.get('/me/upcoming', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.user?.id;
    
    console.log(`📝 Fetching ${limit} upcoming assignments for user ${userId}`);
    
    const upcomingAssignments = mockAssignments
      .filter(assignment => !assignment.completed)
      .slice(0, limit);
    
    res.json({
      success: true,
      data: upcomingAssignments,
      count: upcomingAssignments.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Error fetching upcoming assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des devoirs à venir',
      error: error.message
    });
  }
});

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: mockAssignments, message: 'Assignments endpoint' });
});

export default router;
