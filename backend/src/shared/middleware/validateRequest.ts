import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { errors } from './errorHandler';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Retourner toutes les erreurs
      stripUnknown: true, // Supprimer les champs non définis
      convert: true // Convertir automatiquement les types
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      res.status(400).json({
        success: false,
        message: 'Données invalides',
        code: 'VALIDATION_ERROR',
        errors: errorMessages
      });
      return;
    }

    // Remplacer req.body par les données validées
    req.body = value;
    next();
  };
};

// Validation des paramètres d'URL
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      res.status(400).json({
        success: false,
        message: 'Paramètres invalides',
        code: 'VALIDATION_ERROR',
        errors: errorMessages
      });
      return;
    }

    req.params = value;
    next();
  };
};

// Validation des query parameters
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      res.status(400).json({
        success: false,
        message: 'Paramètres de requête invalides',
        code: 'VALIDATION_ERROR',
        errors: errorMessages
      });
      return;
    }

    req.query = value;
    next();
  };
};

// Schémas de validation communs
export const commonSchemas = {
  id: Joi.string().required().messages({
    'any.required': 'ID requis',
    'string.empty': 'ID ne peut pas être vide'
  }),
  
  uuid: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.guid': 'ID invalide',
    'any.required': 'ID requis'
  }),
  
  email: Joi.string().email().required().messages({
    'string.email': 'Email invalide',
    'any.required': 'Email requis'
  }),
  
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'string.pattern.base': 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre',
    'any.required': 'Mot de passe requis'
  }),
  
  phone: Joi.string().pattern(/^[+]?[0-9\s-()]+$/).messages({
    'string.pattern.base': 'Numéro de téléphone invalide'
  }),
  
  date: Joi.date().iso().messages({
    'date.format': 'Format de date invalide (ISO 8601 requis)',
    'date.base': 'Date invalide'
  }),
  
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc')
  }),
  
  search: Joi.object({
    q: Joi.string().min(2).max(100).optional(),
    filters: Joi.object().unknown(true).optional()
  })
};
