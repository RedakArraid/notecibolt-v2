import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Middleware d'authentification robuste
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token d\'authentification requis'
    });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'notecibolt-secret-key-dev';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return res.status(403).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
};

// Middleware pour vérifier les rôles spécifiques
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôles autorisés: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

// Middleware spécifique pour les administrateurs
export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Privilèges administrateur requis.'
    });
  }
  
  next();
};

// Middleware pour vérifier la propriété des ressources
export const ownershipMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (resourceUserId && resourceUserId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Accès non autorisé à cette ressource'
    });
  }

  next();
};

// Middleware de test pour le développement
export const testAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Simuler un utilisateur admin pour les tests
  req.user = {
    id: 'admin-123',
    email: 'admin@notecibolt.com',
    name: 'Directrice Martin',
    role: 'ADMIN'
  };
  
  next();
};

// Export des middlewares pour compatibilité
export const authenticateToken = authMiddleware;
export const requireRole = roleMiddleware;
export const requireOwnership = ownershipMiddleware;
