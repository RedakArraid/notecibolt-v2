import Joi from 'joi';

// Schéma de validation pour la connexion
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email invalide',
      'any.required': 'Email requis'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Mot de passe requis'
    }),
  rememberMe: Joi.boolean().default(false)
});

// Schéma de validation pour l'inscription
export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email invalide',
      'any.required': 'Email requis'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre',
      'any.required': 'Mot de passe requis'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Les mots de passe ne correspondent pas',
      'any.required': 'Confirmation du mot de passe requise'
    }),
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères',
      'any.required': 'Nom requis'
    }),
  role: Joi.string()
    .valid('STUDENT', 'TEACHER', 'PARENT', 'ADMIN')
    .required()
    .messages({
      'any.only': 'Rôle invalide',
      'any.required': 'Rôle requis'
    }),
  phone: Joi.string()
    .pattern(/^[+]?[0-9\s-()]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Numéro de téléphone invalide'
    }),
  address: Joi.string().max(500).optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  avatar: Joi.string().uri().optional(),
  
  // Champs spécifiques aux étudiants
  parentIds: Joi.when('role', {
    is: 'STUDENT',
    then: Joi.array().items(Joi.string()).optional(),
    otherwise: Joi.forbidden()
  }),
  allergies: Joi.when('role', {
    is: 'STUDENT',
    then: Joi.array().items(Joi.string()).optional(),
    otherwise: Joi.forbidden()
  }),
  medications: Joi.when('role', {
    is: 'STUDENT',
    then: Joi.array().items(Joi.string()).optional(),
    otherwise: Joi.forbidden()
  }),
  emergencyMedicalContact: Joi.when('role', {
    is: 'STUDENT',
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }),
  
  // Champs spécifiques aux enseignants
  department: Joi.when('role', {
    is: 'TEACHER',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  qualifications: Joi.when('role', {
    is: 'TEACHER',
    then: Joi.array().items(Joi.string()).optional(),
    otherwise: Joi.forbidden()
  }),
  
  // Champs spécifiques aux parents
  occupation: Joi.when('role', {
    is: 'PARENT',
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }),
  preferredContactMethod: Joi.when('role', {
    is: 'PARENT',
    then: Joi.string().valid('EMAIL', 'SMS', 'PHONE').default('EMAIL'),
    otherwise: Joi.forbidden()
  }),
  
  // Champs spécifiques aux administrateurs
  permissions: Joi.when('role', {
    is: 'ADMIN',
    then: Joi.array().items(Joi.string()).optional(),
    otherwise: Joi.forbidden()
  })
});

// Schéma pour mot de passe oublié
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email invalide',
      'any.required': 'Email requis'
    })
});

// Schéma pour réinitialisation du mot de passe
export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token requis'
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre',
      'any.required': 'Nouveau mot de passe requis'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Les mots de passe ne correspondent pas',
      'any.required': 'Confirmation du mot de passe requise'
    })
});

// Schéma pour rafraîchir le token
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Token de rafraîchissement requis'
    })
});

// Schéma pour vérification d'email
export const verifyEmailSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token de vérification requis'
    })
});

// Schéma pour renvoyer la vérification
export const resendVerificationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email invalide',
      'any.required': 'Email requis'
    })
});

// Schéma pour changement de mot de passe (utilisateur connecté)
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Mot de passe actuel requis'
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre',
      'any.required': 'Nouveau mot de passe requis'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Les mots de passe ne correspondent pas',
      'any.required': 'Confirmation du mot de passe requise'
    })
});
