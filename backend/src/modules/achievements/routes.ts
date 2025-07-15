import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Données mockées pour les tests
const mockAchievements = [
  {
    id: '1',
    title: 'Mathématicien prodige',
    description: 'Obtenir plus de 17/20 en mathématiques pendant 3 évaluations consécutives',
    icon: 'Calculator',
    category: 'academic',
    points: 50,
    rarity: 'rare',
    earned: true,
    earnedDate: '2025-01-15'
  },
  {
    id: '2',
    title: 'Présence exemplaire',
    description: 'Aucune absence non justifiée pendant un trimestre',
    icon: 'Calendar',
    category: 'behavior',
    points: 30,
    rarity: 'uncommon',
    earned: false
  },
  {
    id: '3',
    title: 'Participation active',
    description: 'Participer activement en classe pendant un mois',
    icon: 'MessageCircle',
    category: 'participation',
    points: 25,
    rarity: 'common',
    earned: true,
    earnedDate: '2025-01-10'
  },
  {
    id: '4',
    title: 'Esprit d\'équipe',
    description: 'Aider ses camarades et collaborer efficacement',
    icon: 'Users',
    category: 'leadership',
    points: 40,
    rarity: 'uncommon',
    earned: false
  },
  {
    id: '5',
    title: 'Créativité exceptionnelle',
    description: 'Projet créatif remarquable en arts ou littérature',
    icon: 'Palette',
    category: 'creativity',
    points: 35,
    rarity: 'rare',
    earned: false
  }
];

// GET /api/v1/achievements/me - Achievements de l'utilisateur connecté
router.get('/me', (_req: Request, res: Response) => {
  console.log('🏆 GET /api/v1/achievements/me');
  
  res.json({
    success: true,
    data: mockAchievements,
    message: 'Achievements récupérés avec succès'
  });
});

// GET /api/v1/achievements/me/earned - Achievements obtenus par l'utilisateur
router.get('/me/earned', (_req: Request, res: Response) => {
  console.log('🏆 GET /api/v1/achievements/me/earned');
  
  const earnedAchievements = mockAchievements.filter(achievement => achievement.earned);
  
  res.json({
    success: true,
    data: earnedAchievements,
    message: 'Achievements obtenus récupérés avec succès'
  });
});

// GET /api/v1/achievements/available - Tous les achievements disponibles
router.get('/available', (_req: Request, res: Response) => {
  console.log('🏆 GET /api/v1/achievements/available');
  
  res.json({
    success: true,
    data: mockAchievements,
    message: 'Tous les achievements disponibles récupérés avec succès'
  });
});

// GET /api/v1/achievements/me/points - Total des points de l'utilisateur
router.get('/me/points', (_req: Request, res: Response) => {
  console.log('🏆 GET /api/v1/achievements/me/points');
  
  const totalPoints = mockAchievements
    .filter(achievement => achievement.earned)
    .reduce((total, achievement) => total + achievement.points, 0);
  
  res.json({
    success: true,
    data: { totalPoints },
    message: 'Total des points récupéré avec succès'
  });
});

export default router;