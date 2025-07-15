import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Données mockées pour les tests
const mockMessages = [
  {
    id: '1',
    senderName: 'M. Martin',
    senderRole: 'Professeur de Mathématiques',
    subject: 'Félicitations',
    content: 'Félicitations pour votre excellent résultat au dernier contrôle ! Continuez ainsi.',
    timestamp: '2025-01-15T14:30:00Z',
    read: false,
    priority: 'medium',
    type: 'message'
  },
  {
    id: '2',
    senderName: 'Administration',
    senderRole: 'Secrétariat',
    subject: 'Réunion parents-professeurs',
    content: 'Rappel : Réunion parents-professeurs le 25 janvier à 18h00 en salle polyvalente.',
    timestamp: '2025-01-15T09:00:00Z',
    read: true,
    priority: 'high',
    type: 'announcement'
  },
  {
    id: '3',
    senderName: 'Mme Leroy',
    senderRole: 'Professeur de Français',
    subject: 'Dissertation à rendre',
    content: 'N\'oubliez pas de rendre votre dissertation sur Voltaire avant le 25 janvier.',
    timestamp: '2025-01-14T16:00:00Z',
    read: false,
    priority: 'medium',
    type: 'message'
  }
];

// GET /api/v1/messages/me/recent - Messages récents de l'utilisateur connecté
router.get('/me/recent', (_req: Request, res: Response) => {
  console.log('💬 GET /api/v1/messages/me/recent');
  
  // Trier par timestamp décroissant (plus récents en premier)
  const recentMessages = mockMessages
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10); // Limiter à 10 messages récents
  
  res.json({
    success: true,
    data: recentMessages,
    message: 'Messages récents récupérés avec succès'
  });
});

// GET /api/v1/messages/me - Tous les messages de l'utilisateur connecté
router.get('/me', (_req: Request, res: Response) => {
  console.log('💬 GET /api/v1/messages/me');
  
  const allMessages = mockMessages
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  res.json({
    success: true,
    data: allMessages,
    message: 'Tous les messages récupérés avec succès'
  });
});

// GET /api/v1/messages/me/unread-count - Nombre de messages non lus
router.get('/me/unread-count', (_req: Request, res: Response) => {
  console.log('💬 GET /api/v1/messages/me/unread-count');
  
  const unreadCount = mockMessages.filter(message => !message.read).length;
  
  res.json({
    success: true,
    data: { count: unreadCount },
    message: 'Nombre de messages non lus récupéré avec succès'
  });
});

// PUT /api/v1/messages/:id/read - Marquer un message comme lu
router.put('/:id/read', (req: Request, res: Response) => {
  const messageId = req.params.id;
  console.log(`💬 PUT /api/v1/messages/${messageId}/read`);
  
  const message = mockMessages.find(m => m.id === messageId);
  
  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message non trouvé'
    });
  }
  
  message.read = true;
  
  return res.json({
    success: true,
    data: message,
    message: 'Message marqué comme lu'
  });
});

export default router;