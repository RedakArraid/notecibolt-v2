import { Request, Response, NextFunction } from 'express';

// Version simplifiée pour les tests sans Prisma
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Pour les tests, créer un utilisateur admin fictif
      req.user = {
        id: 'admin-123',
        email: 'admin@notecibolt.com',
        name: 'Fatima Kané - Directrice',
        role: 'ADMIN',
        isActive: true
      };
      return next();
    }

    // En production, vérifier le JWT ici
    // Pour les tests avec token, simuler un administrateur authentifié
    req.user = {
      id: 'admin-123',
      email: 'admin@notecibolt.com',
      name: 'Fatima Kané - Directrice',
      role: 'ADMIN',
      isActive: true
    };
    
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Middleware pour vérifier les rôles
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentification requise',
        code: 'AUTHENTICATION_REQUIRED'
      });
      return;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
};

// Middleware spécialisé pour admin
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentification requise',
      code: 'AUTHENTICATION_REQUIRED'
    });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      message: 'Accès refusé. Rôle administrateur requis.',
      code: 'ADMIN_ROLE_REQUIRED',
      userRole: req.user.role
    });
    return;
  }

  next();
};

// Middleware pour vérifier si l'utilisateur peut accéder à une ressource spécifique
export const requireOwnershipOrRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentification requise',
        code: 'AUTHENTICATION_REQUIRED'
      });
      return;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    const resourceUserId = req.params.userId || req.params.id;
    
    // Vérifier si l'utilisateur a le bon rôle OU s'il accède à ses propres données
    if (allowedRoles.includes(req.user.role) || req.user.id === resourceUserId) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Accès non autorisé à cette ressource',
      code: 'ACCESS_DENIED'
    });
  };
};

// Middleware optionnel d'authentification (ne bloque pas si pas de token)
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    // Pour les tests, simuler un utilisateur admin authentifié
    req.user = {
      id: 'admin-123',
      email: 'admin@notecibolt.com',
      name: 'Fatima Kané - Directrice',
      role: 'ADMIN',
      isActive: true
    };

    next();
  } catch (error) {
    console.error('Erreur dans optionalAuth:', error);
    next(); // Continuer même en cas d'erreur
  }
};
