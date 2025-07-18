import { Router, Request, Response } from 'express';
import { 
  getUsersWithFilters,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  searchUsers,
  type UserFilters,
  type CreateUserRequest,
  type UpdateUserRequest
} from './services';
import { authMiddleware, requireAdmin } from '../../shared/middleware/authMiddleware';

const router = Router();

// ===========================
// ROUTES PRINCIPALES
// ===========================

/**
 * GET /api/v1/users
 * Récupère la liste des utilisateurs avec filtres et pagination
 */
router.get('/', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const filters: UserFilters = {
      search: req.query.search as string,
      role: req.query.role as any,
      isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
      sortBy: req.query.sortBy as any || 'name',
      sortOrder: req.query.sortOrder as any || 'asc'
    };

    const result = await getUsersWithFilters(page, limit, filters);
    
    res.json({
      success: true,
      data: result.users,
      pagination: {
        currentPage: page,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        hasMore: result.hasMore,
        limit
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des utilisateurs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/v1/users/stats
 * Récupère les statistiques des utilisateurs
 */
router.get('/stats', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const stats = await getUserStats();
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des statistiques utilisateurs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/v1/users/search
 * Recherche d'utilisateurs
 */
router.get('/search', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La requête de recherche doit contenir au moins 2 caractères'
      });
    }

    const filters: Omit<UserFilters, 'search'> = {
      role: req.query.role as any,
      isActive: req.query.isActive ? req.query.isActive === 'true' : undefined
    };

    const users = await searchUsers(query.trim(), filters);
    
    res.json({
      success: true,
      data: users,
      count: users.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche d\'utilisateurs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/v1/users/:id
 * Récupère un utilisateur par ID
 */
router.get('/:id', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID utilisateur requis'
      });
    }

    const user = await getUserById(id);
    
    res.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors du chargement de l\'utilisateur:', error);
    
    if (error.message === 'Utilisateur non trouvé') {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement de l\'utilisateur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/v1/users
 * Crée un nouvel utilisateur
 */
router.post('/', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const userData: CreateUserRequest = req.body;
    
    // Validation de base
    if (!userData.name || !userData.email || !userData.role) {
      return res.status(400).json({
        success: false,
        message: 'Nom, email et rôle sont requis'
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }

    const user = await createUser(userData);
    
    res.status(201).json({
      success: true,
      data: user,
      message: 'Utilisateur créé avec succès',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    
    if (error.message === 'Un utilisateur avec cet email existe déjà') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/v1/users/:id
 * Met à jour un utilisateur
 */
router.put('/:id', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userData: UpdateUserRequest = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID utilisateur requis'
      });
    }

    const user = await updateUser(id, userData);
    
    res.json({
      success: true,
      data: user,
      message: 'Utilisateur mis à jour avec succès',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    
    if (error.message === 'Utilisateur non trouvé') {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * DELETE /api/v1/users/:id
 * Supprime un utilisateur (soft delete)
 */
router.delete('/:id', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID utilisateur requis'
      });
    }

    await deleteUser(id);
    
    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    
    if (error.message === 'Utilisateur non trouvé') {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/v1/users/health
 * Endpoint de santé pour vérifier le statut du service users
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const userCount = await getUserStats();
    
    res.json({
      success: true,
      status: 'healthy',
      services: {
        database: 'connected',
        user_services: 'operational'
      },
      data: {
        totalUsers: userCount.totalUsers
      },
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    });
  } catch (error) {
    console.error('Erreur health check users:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      services: {
        database: 'disconnected',
        user_services: 'error'
      },
      error: 'Service users indisponible',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
