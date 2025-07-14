import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log de l'erreur
  console.error('🚨 API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Déterminer le code de statut
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Erreur interne du serveur';
  let code = error.code || 'INTERNAL_ERROR';

  // Gestion des erreurs spécifiques
  
  // Erreurs de validation Joi/Zod
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Données invalides';
    code = 'VALIDATION_ERROR';
  }

  // Erreurs Prisma
  if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    code = 'DATABASE_ERROR';
    
    // Erreurs spécifiques Prisma
    switch ((error as any).code) {
      case 'P2002':
        message = 'Cette valeur existe déjà';
        code = 'DUPLICATE_ENTRY';
        break;
      case 'P2025':
        message = 'Enregistrement non trouvé';
        code = 'RECORD_NOT_FOUND';
        statusCode = 404;
        break;
      case 'P2003':
        message = 'Contrainte de clé étrangère violée';
        code = 'FOREIGN_KEY_CONSTRAINT';
        break;
      default:
        message = 'Erreur de base de données';
    }
  }

  // Erreur de validation Prisma
  if (error.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Données invalides pour la base de données';
    code = 'DATABASE_VALIDATION_ERROR';
  }

  // Erreur de connexion Prisma
  if (error.name === 'PrismaClientInitializationError') {
    statusCode = 500;
    message = 'Impossible de se connecter à la base de données';
    code = 'DATABASE_CONNECTION_ERROR';
  }

  // Erreurs JWT
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token invalide';
    code = 'INVALID_TOKEN';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expiré';
    code = 'TOKEN_EXPIRED';
  }

  // Erreurs de syntaxe JSON
  if (error.name === 'SyntaxError' && 'body' in error) {
    statusCode = 400;
    message = 'JSON invalide';
    code = 'INVALID_JSON';
  }

  // Erreurs de limite de taille
  if (error.message.includes('request entity too large')) {
    statusCode = 413;
    message = 'Fichier trop volumineux';
    code = 'FILE_TOO_LARGE';
  }

  // Erreurs de type MIME
  if (error.message.includes('LIMIT_UNEXPECTED_FILE')) {
    statusCode = 400;
    message = 'Type de fichier non autorisé';
    code = 'INVALID_FILE_TYPE';
  }

  // Ne pas exposer les détails des erreurs en production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse: any = {
    success: false,
    message,
    code,
    timestamp: new Date().toISOString(),
  };

  // Ajouter des détails supplémentaires en mode développement
  if (isDevelopment) {
    errorResponse.details = {
      stack: error.stack,
      originalError: error.details || error.message,
    };
  }

  res.status(statusCode).json(errorResponse);
};

// Middleware pour créer des erreurs personnalisées
export const createError = (
  statusCode: number,
  message: string,
  code?: string,
  details?: any
): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

// Fonction utilitaire pour les erreurs async
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Erreurs courantes prédéfinies
export const errors = {
  notFound: (resource: string = 'Ressource') => 
    createError(404, `${resource} non trouvé(e)`, 'NOT_FOUND'),
  
  unauthorized: (message: string = 'Non autorisé') => 
    createError(401, message, 'UNAUTHORIZED'),
  
  forbidden: (message: string = 'Accès interdit') => 
    createError(403, message, 'FORBIDDEN'),
  
  badRequest: (message: string = 'Requête invalide') => 
    createError(400, message, 'BAD_REQUEST'),
  
  conflict: (message: string = 'Conflit de données') => 
    createError(409, message, 'CONFLICT'),
  
  validationError: (message: string = 'Données invalides', details?: any) => 
    createError(400, message, 'VALIDATION_ERROR', details),
  
  serverError: (message: string = 'Erreur interne du serveur') => 
    createError(500, message, 'INTERNAL_ERROR'),
};
