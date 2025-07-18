import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

export const config = {
  // Environnement
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  
  // API
  apiVersion: 'v1',
  
  // Base de données
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/notecibolt_dev',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'notecibolt-secret-key-dev',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'notecibolt-refresh-secret-key-dev',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // CORS
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173'
  ],
  
  // École
  schoolName: process.env.SCHOOL_NAME || 'NoteCibolt v2',
  academicYear: process.env.ACADEMIC_YEAR || '2024-2025',
  
  // Email (optionnel)
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  
  // Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  uploadDir: process.env.UPLOAD_DIR || 'uploads/',
  
  // Sécurité
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  
  // Redis (optionnel pour le cache)
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validation des configurations critiques
if (config.nodeEnv === 'production') {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in production');
  }
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be defined in production');
  }
}

export default config;
