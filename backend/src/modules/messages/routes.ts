import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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
const prisma = new PrismaClient();

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
    read: false, // <-- forcer non lu
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
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Non authentifié' });
    const messages = await prisma.message.findMany({
      where: {
        recipients: { some: { id: userId } }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    res.json({ success: true, data: messages, count: messages.length, timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Erreur chargement messages récents', error: error.message });
  }
});

// POST /api/v1/messages/send - Envoyer un message (privé, multiple ou annonce)
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { recipientId, recipientIds, role, content, type = 'message', subject = '' } = req.body;
    const senderId = req.user?.id;
    if (!senderId || !content) {
      return res.status(400).json({ success: false, message: 'Expéditeur et contenu requis' });
    }
    // Vérifier que le senderId existe dans la table User
    const senderExists = await prisma.user.findUnique({ where: { id: senderId } });
    if (!senderExists) {
      return res.status(400).json({ success: false, message: 'L\'expéditeur (utilisateur connecté) n\'existe pas dans la base.' });
    }
    let targetUserIds: string[] = [];
    // Gestion des annonces par rôle
    if (type === 'ANNOUNCEMENT' && role) {
      const validRoles = ['STUDENT', 'PARENT', 'TEACHER', 'ADMIN'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: 'Rôle inconnu' });
      }
      // Récupérer tous les utilisateurs du rôle demandé (y compris ADMIN)
      const users = await prisma.user.findMany({ where: { role }, select: { id: true } });
      console.log('users trouvés pour le rôle', role, users);
      users.forEach(u => console.log('Type de u.id:', typeof u.id, u.id));
      targetUserIds = users.map(u => u.id).filter(id => typeof id === 'string' && id.length > 0);
      console.log('targetUserIds (IDs)', targetUserIds);
    } else if (Array.isArray(recipientIds) && recipientIds.length > 0) {
      targetUserIds = recipientIds.filter(id => typeof id === 'string' && id.length > 0);
    } else if (recipientId) {
      targetUserIds = [recipientId];
    } else {
      return res.status(400).json({ success: false, message: 'Aucun destinataire spécifié' });
    }
    if (targetUserIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucun destinataire valide' });
    }
    // Création d'un message pour chaque destinataire (pour gestion individuelle du "lu")
    const createdMessages = await Promise.all(targetUserIds.map(async (userId) => {
      return prisma.message.create({
        data: {
          senderId,
          recipients: { connect: [{ id: userId }] },
          subject,
          content,
          type,
          read: false
        }
      });
    }));
    res.status(201).json({ success: true, data: createdMessages, message: 'Message(s) envoyé(s) avec succès' });
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi du message:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du message', error: error.message });
  }
});

// PATCH /api/v1/messages/:id/read - Marquer un message comme lu
router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const messageId = req.params.id;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Non authentifié' });
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { read: true }
    });
    res.json({ success: true, message: 'Message marqué comme lu', data: message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Erreur lors du marquage du message', error: error.message });
  }
});

// GET /api/v1/messages/unread-count - Obtenir le nombre de messages non lus
router.get('/unread-count', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Non authentifié' });
    const count = await prisma.message.count({
      where: {
        recipients: { some: { id: userId } },
        read: false
      }
    });
    res.json({ success: true, data: { count } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Erreur lors du comptage des messages non lus', error: error.message });
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
