import { Router, Request, Response } from 'express';

const router = Router();

// Mock data pour les notes
const mockGrades = [
  {
    id: '1',
    subjectName: 'Mathématiques',
    assignmentName: 'Contrôle Algèbre',
    grade: 16,
    maxGrade: 20,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    teacher: 'M. Traoré'
  },
  {
    id: '2',
    subjectName: 'Sciences Physiques',
    assignmentName: 'TP Électricité',
    grade: 14.5,
    maxGrade: 20,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    teacher: 'Mme Keita'
  },
  {
    id: '3',
    subjectName: 'Français',
    assignmentName: 'Rédaction',
    grade: 13,
    maxGrade: 20,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    teacher: 'M. Diarra'
  }
];

// GET /api/v1/grades/me/recent - Obtenir les notes récentes de l'utilisateur
router.get('/me/recent', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const userId = req.user?.id;
    
    console.log(`📊 Fetching ${limit} recent grades for user ${userId}`);
    
    const recentGrades = mockGrades.slice(0, limit);
    
    res.json({
      success: true,
      data: recentGrades,
      count: recentGrades.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Error fetching recent grades:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des notes récentes',
      error: error.message
    });
  }
});

router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: mockGrades, message: 'Grades endpoint' });
});

export default router;
