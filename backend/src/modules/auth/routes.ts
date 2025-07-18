import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/v1/auth/me - Obtenir les informations de l'utilisateur connecté
router.get('/me', (req: Request, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }
    
    console.log(`👤 User info requested for ${user.name}`);
    
    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('❌ Error getting user info:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des informations utilisateur',
      error: error.message
    });
  }
});

// POST /api/v1/auth/login - Authentification
router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔐 Login attempt for ${email}`);
    
    // Pour les tests, accepter toute connexion
    const mockUser = {
      id: 'user-123',
      email: email || 'student@notecibolt.com',
      name: 'Aicha Diallo',
      role: 'student'
    };
    
    res.json({
      success: true,
      data: {
        user: mockUser,
        token: 'mock-jwt-token-123',
        refreshToken: 'mock-refresh-token-123'
      },
      message: 'Connexion réussie'
    });
  } catch (error: any) {
    console.error('❌ Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
});

// POST /api/v1/auth/logout - Déconnexion
router.post('/logout', (req: Request, res: Response) => {
  try {
    console.log(`🚪 Logout for user ${req.user?.name || 'unknown'}`);
    
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error: any) {
    console.error('❌ Error during logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion',
      error: error.message
    });
  }
});

export default router;
