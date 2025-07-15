import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Données mockées pour les tests
const mockSubjects = [
  { 
    id: 'mathematics', 
    name: 'Mathématiques', 
    color: '#EF4444', 
    average: 17.5,
    teacher: 'M. Martin',
    code: 'MATH',
    description: 'Mathématiques niveau Terminale S',
    department: 'Sciences',
    credits: 6
  },
  { 
    id: 'french', 
    name: 'Français', 
    color: '#10B981', 
    average: 15.2,
    teacher: 'Mme Leroy',
    code: 'FR',
    description: 'Français niveau Terminale',
    department: 'Lettres',
    credits: 4
  },
  { 
    id: 'physics', 
    name: 'Physique-Chimie', 
    color: '#3B82F6', 
    average: 16.8,
    teacher: 'M. Martin',
    code: 'PC',
    description: 'Physique-Chimie niveau Terminale S',
    department: 'Sciences',
    credits: 6
  },
  { 
    id: 'english', 
    name: 'Anglais', 
    color: '#8B5CF6', 
    average: 14.7,
    teacher: 'Mrs. Johnson',
    code: 'ENG',
    description: 'Anglais LV1',
    department: 'Langues',
    credits: 3
  }
];

// GET /api/v1/subjects/me - Matières de l'utilisateur connecté
router.get('/me', (_req: Request, res: Response) => {
  console.log('📚 GET /api/v1/subjects/me');
  res.json({
    success: true,
    data: mockSubjects,
    message: 'Matières récupérées avec succès'
  });
});

// GET /api/v1/subjects/student/:id - Matières d'un étudiant
router.get('/student/:id', (req: Request, res: Response) => {
  const studentId = req.params.id;
  console.log(`📚 GET /api/v1/subjects/student/${studentId}`);
  
  res.json({
    success: true,
    data: mockSubjects,
    message: `Matières de l'étudiant ${studentId} récupérées avec succès`
  });
});

// GET /api/v1/subjects - Toutes les matières
router.get('/', (_req: Request, res: Response) => {
  console.log('📚 GET /api/v1/subjects');
  res.json({
    success: true,
    data: mockSubjects,
    message: 'Toutes les matières récupérées avec succès'
  });
});

export default router;