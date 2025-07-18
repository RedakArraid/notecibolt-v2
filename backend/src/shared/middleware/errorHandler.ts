import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response<any> => {
  console.error('❌ Erreur globale:', error);

  // Erreur Prisma
  if (error.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Conflit de données - cette ressource existe déjà',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }

  // Erreur JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    });
  }

  // Erreur de validation
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: error.details || error.message
    });
  }

  // Erreur par défaut
  return res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};
