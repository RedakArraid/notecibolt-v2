import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Données mockées pour les tests
const mockAssignments = [
  {
    id: '1',
    title: 'Dissertation sur Voltaire',
    subject: 'Français',
    dueDate: '2025-01-25',
    description: 'Analyser les thèmes principaux dans Candide',
    priority: 'high',
    completed: false,
    type: 'homework',
    maxGrade: 20,
    teacherId: 'teacher-2'
  },
  {
    id: '2',
    title: 'Contrôle Intégrales',
    subject: 'Mathématiques',
    dueDate: '2025-01-22',
    description: 'Évaluation sur le calcul intégral',
    priority: 'high',
    completed: false,
    type: 'exam',
    maxGrade: 20,
    teacherId: 'teacher-1'
  },
  {
    id: '3',
    title: 'Oral d\'anglais',
    subject: 'Anglais',
    dueDate: '2025-01-30',
    description: 'Présentation de 10 minutes sur un sujet libre',
    priority: 'medium',
    completed: false,
    type: 'project',
    maxGrade: 20,
    teacherId: 'teacher-3'
  },
  {
    id: '4',
    title: 'TP Chimie',
    subject: 'Physique-Chimie',
    dueDate: '2025-01-20',
    description: 'Synthèse de l\'aspirine',
    priority: 'low',
    completed: false,
    type: 'homework',
    maxGrade: 20,
    teacherId: 'teacher-1'
  }
];

// GET /api/v1/assignments/me/upcoming - Devoirs à venir de l'utilisateur connecté
router.get('/me/upcoming', (_req: Request, res: Response) => {
  console.log('📝 GET /api/v1/assignments/me/upcoming');
  
  // Filtrer les devoirs non terminés et les trier par date d'échéance
  const upcomingAssignments = mockAssignments
    .filter(assignment => !assignment.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  res.json({
    success: true,
    data: upcomingAssignments,
    message: 'Devoirs à venir récupérés avec succès'
  });
});

// GET /api/v1/assignments/student/:id/upcoming - Devoirs à venir d'un étudiant
router.get('/student/:id/upcoming', (req: Request, res: Response) => {
  const studentId = req.params.id;
  console.log(`📝 GET /api/v1/assignments/student/${studentId}/upcoming`);
  
  const upcomingAssignments = mockAssignments
    .filter(assignment => !assignment.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  res.json({
    success: true,
    data: upcomingAssignments,
    message: `Devoirs à venir de l'étudiant ${studentId} récupérés avec succès`
  });
});

// GET /api/v1/assignments/:id - Détails d'un devoir
router.get('/:id', (req: Request, res: Response) => {
  const assignmentId = req.params.id;
  console.log(`📝 GET /api/v1/assignments/${assignmentId}`);
  
  const assignment = mockAssignments.find(a => a.id === assignmentId);
  
  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: 'Devoir non trouvé'
    });
  }
  
  return res.json({
    success: true,
    data: assignment,
    message: 'Devoir récupéré avec succès'
  });
});

export default router;