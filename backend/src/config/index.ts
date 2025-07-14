import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

interface Config {
  // Serveur
  port: number;
  nodeEnv: string;
  apiVersion: string;
  
  // Base de données
  databaseUrl: string;
  
  // JWT
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
  
  // CORS
  frontendUrl: string;
  allowedOrigins: string[];
  
  // Email
  emailConfig: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };
  
  // Upload de fichiers
  uploadConfig: {
    path: string;
    maxFileSize: number;
    allowedTypes: string[];
  };
  
  // Sécurité
  bcryptRounds: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  
  // École
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolAddress: string;
  academicYear: string;
  currentSemester: string;
  
  // Redis
  redisUrl: string;
  
  // AWS S3
  awsConfig: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    s3Bucket: string;
  };
  
  // Logging
  logLevel: string;
  logFile: string;
  
  // WebSocket
  socketPort: number;
}

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

// Vérifier que les variables d'environnement requises sont présentes
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable d'environnement manquante: ${envVar}`);
  }
}

export const config: Config = {
  // Serveur
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  
  // Base de données
  databaseUrl: process.env.DATABASE_URL!,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  
  // Email
  emailConfig: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'NoteCibolt <noreply@notecibolt.com>',
  },
  
  // Upload de fichiers
  uploadConfig: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
  },
  
  // Sécurité
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // École
  schoolName: process.env.SCHOOL_NAME || 'École NoteCibolt',
  schoolEmail: process.env.SCHOOL_EMAIL || 'contact@notecibolt.com',
  schoolPhone: process.env.SCHOOL_PHONE || '+33 1 23 45 67 89',
  schoolAddress: process.env.SCHOOL_ADDRESS || '123 Rue de l\'Éducation, 75001 Paris',
  academicYear: process.env.ACADEMIC_YEAR || '2024-2025',
  currentSemester: process.env.CURRENT_SEMESTER || 'S1',
  
  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // AWS S3
  awsConfig: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'eu-west-1',
    s3Bucket: process.env.AWS_S3_BUCKET || 'notecibolt-files',
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || './logs/app.log',
  
  // WebSocket
  socketPort: parseInt(process.env.SOCKET_PORT || '3002', 10),
};

// Validation des configurations
export const validateConfig = (): void => {
  const errors: string[] = [];
  
  if (config.port < 1 || config.port > 65535) {
    errors.push('Port doit être entre 1 et 65535');
  }
  
  if (config.bcryptRounds < 10 || config.bcryptRounds > 15) {
    errors.push('BCRYPT_ROUNDS doit être entre 10 et 15');
  }
  
  if (config.rateLimitWindowMs < 60000) { // Minimum 1 minute
    errors.push('RATE_LIMIT_WINDOW_MS doit être au minimum 60000 (1 minute)');
  }
  
  if (config.rateLimitMaxRequests < 1) {
    errors.push('RATE_LIMIT_MAX_REQUESTS doit être au minimum 1');
  }
  
  if (config.uploadConfig.maxFileSize < 1024) { // Minimum 1KB
    errors.push('MAX_FILE_SIZE doit être au minimum 1024 (1KB)');
  }
  
  if (errors.length > 0) {
    throw new Error(`Erreurs de configuration:\n${errors.join('\n')}`);
  }
};

// Valider la configuration au chargement
validateConfig();

export default config;
