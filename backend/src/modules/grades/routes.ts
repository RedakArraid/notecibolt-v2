import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Données mockées pour les tests
const mockGrades = [
  {
    id: '1',
    studentId: '1',
    subject: 'Mathématiques',
    value: 18,
    maxValue: 20,
    date: '2025-01-15',
    type: 'test',
    comment: 'Excellent travail sur les équations différentielles',
    teacherId: 'teacher-1'
  },
  {
    id: '2',
    studentId: '1',
    subject: 'Français',
    value: 15,
    maxValue: 20,
    date: '2025-01-14',
    type: 'homework',
    comment: 'Bonne analyse littéraire, développer l\'argumentation',
    teacherId: 'teacher-2'
  },
  {
    id: '3',
    studentId: '1',
    subject: 'Physique',
    value: 16.5,
    maxValue: 20,
    date: '2025-01-12',
    type: 'quiz',
    comment: 'Très bonne compréhension des concepts',
    teacherId: 'teacher-1'
  }
];

// GET /api/v1/grades/me/recent - Notes récentes de l'utilisateur connecté
router.get('/me/recent', (_req: Request, res: Response) => {
  console.log('📊 GET /api/v1/grades/me/recent');
  res.json({
    success: true,
    data: mockGrades,
    message: 'Notes récentes récupérées avec succès'
  });
});

// GET /api/v1/grades/student/:id/recent - Notes récentes d'un étudiant
router.get('/student/:id/recent', (req: Request, res: Response) => {
  const studentId = req.params.id;
  console.log(`📊 GET /api/v1/grades/student/${studentId}/recent`);
  
  const studentGrades = mockGrades.filter(grade => grade.studentId === studentId);
  res.json({
    success: true,
    data: studentGrades,
    message: `Notes récentes de l'étudiant ${studentId} récupérées avec succès`
  });
});

// GET /api/v1/grades/me/average - Moyenne de l'utilisateur connecté
router.get('/me/average', (_req: Request, res: Response) => {
  console.log('📊 GET /api/v1/grades/me/average');
  
  const total = mockGrades.reduce((sum, grade) => sum + grade.value, 0);
  const average = total / mockGrades.length;
  
  res.json({
    success: true,
    data: { average: Number(average.toFixed(2)) },
    message: 'Moyenne calculée avec succès'
  });
});

export default router;