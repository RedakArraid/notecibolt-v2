import { Router, Request, Response } from 'express';

// Extension de l'interface Request pour TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

const router = Router();

// Mock data pour les messages
const mockMessages = [
  {
    id: '1',
    senderName: 'Marie Dubois',
    senderRole: 'Directrice',
    senderId: 'admin1',
    content: 'Réunion pédagogique prévue vendredi 15h en salle de conférence. Présence obligatoire pour tous les enseignants.',
    type: 'announcement',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    recipientId: 'current-user'
  },
  {
    id: '2',
    senderName: 'Jean-Baptiste Traoré',
    senderRole: 'Enseignant Mathématiques',
    senderId: 'teacher1',
    content: 'Les notes du contrôle de mathématiques sont disponibles. Moyenne de classe: 14.2/20',
    type: 'message',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: true,
    recipientId: 'current-user'
  },
  {
    id: '3',
    senderName: 'Système NoteCibolt',
    senderRole: 'Système',
    senderId: 'system',
    content: 'Nouveau devoir en Sciences Physiques: "Électricité et magnétisme" à rendre avant le 25/01/2025',
    type: 'alert',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: false,
    recipientId: 'current-user'
  },
  {
    id: '4',
    senderName: 'Famille Diallo',
    senderRole: 'Parent',
    senderId: 'parent1',
    content: 'Mon enfant sera absent demain pour raisons médicales. Merci de bien vouloir justifier cette absence.',
    type: 'message',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true,
    recipientId: 'current-user'
  },
  {
    id: '5',
    senderName: 'Amadou Koné',
    senderRole: 'Surveillant',
    senderId: 'supervisor1',
    content: 'Incident mineur signalé en récréation. Rapport disponible dans le système de gestion des incidents.',
    type: 'alert',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: false,
    recipientId: 'current-user'
  }
];

const mockContacts = [
  {
    id: 'admin1',
    name: 'Marie Dubois',
    role: 'Directrice',
    email: 'marie.dubois@notecibolt.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
  },
  {
    id: 'teacher1',
    name: 'Jean-Baptiste Traoré',
    role: 'Enseignant Mathématiques',
    email: 'jb.traore@notecibolt.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 'teacher2',
    name: 'Sophie Martin',
    role: 'Enseignante Français',
    email: 'sophie.martin@notecibolt.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  },
  {
    id: 'parent1',
    name: 'Famille Diallo',
    role: 'Parent',
    email: 'famille.diallo@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'supervisor1',
    name: 'Amadou Koné',
    role: 'Surveillant',
    email: 'amadou.kone@notecibolt.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  }
];

// GET /api/v1/messages/recent - Obtenir les messages récents
router.get('/recent', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.user?.id;
    
    console.log(`📬 Fetching ${limit} recent messages for user ${userId}`);
    
    // Filtrer et limiter les messages
    const recentMessages = mockMessages
      .filter(msg => msg.recipientId === 'current-user') // En production: msg.recipientId === userId
      .slice(0, limit)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    res.json({
      success: true,
      data: recentMessages,
      count: recentMessages.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Error fetching recent messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des messages récents',
      error: error.message
    });
  }
});

// POST /api/v1/messages/send - Envoyer un message
router.post('/send', (req: Request, res: Response) => {
  try {
    const { recipientId, content, type = 'message' } = req.body;
    const senderId = req.user?.id;
    const senderName = req.user?.name || 'Utilisateur';
    const senderRole = req.user?.role || 'Utilisateur';
    
    console.log(`📤 Sending message from ${senderName} to ${recipientId}`);
    
    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Destinataire et contenu requis'
      });
    }
    
    // Créer le nouveau message
    const newMessage = {
      id: Date.now().toString(),
      senderName,
      senderRole,
      senderId: senderId || '',
      content,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      recipientId
    };
    
    // Ajouter à la liste (en production: sauvegarder en base)
    mockMessages.unshift(newMessage);
    
    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Message envoyé avec succès'
    });
  } catch (error: any) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: error.message
    });
  }
});

// PATCH /api/v1/messages/:id/read - Marquer un message comme lu
router.patch('/:id/read', (req: Request, res: Response) => {
  try {
    const messageId = req.params.id;
    const userId = req.user?.id;
    
    console.log(`📖 Marking message ${messageId} as read for user ${userId}`);
    
    // Trouver et marquer le message comme lu
    const messageIndex = mockMessages.findIndex(msg => 
      msg.id === messageId && msg.recipientId === 'current-user'
    );
    
    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }
    
    mockMessages[messageIndex].read = true;
    
    res.json({
      success: true,
      message: 'Message marqué comme lu',
      data: mockMessages[messageIndex]
    });
  } catch (error: any) {
    console.error('❌ Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage du message',
      error: error.message
    });
  }
});

// GET /api/v1/messages/unread-count - Obtenir le nombre de messages non lus
router.get('/unread-count', (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const unreadCount = mockMessages.filter(msg => 
      msg.recipientId === 'current-user' && !msg.read
    ).length;
    
    console.log(`📊 Unread messages count for user ${userId}: ${unreadCount}`);
    
    res.json({
      success: true,
      data: { count: unreadCount }
    });
  } catch (error: any) {
    console.error('❌ Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du comptage des messages non lus',
      error: error.message
    });
  }
});

// GET /api/v1/messages/contacts - Obtenir la liste des contacts
router.get('/contacts', (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    
    let contacts = mockContacts;
    
    // Filtrer par recherche si fournie
    if (search) {
      contacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.email.toLowerCase().includes(search.toLowerCase()) ||
        contact.role.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    console.log(`👥 Fetching contacts, search: "${search || 'all'}", found: ${contacts.length}`);
    
    res.json({
      success: true,
      data: contacts
    });
  } catch (error: any) {
    console.error('❌ Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des contacts',
      error: error.message
    });
  }
});

export default router;
