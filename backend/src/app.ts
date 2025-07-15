import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './shared/middleware/errorHandler';
import { notFoundHandler } from './shared/middleware/notFoundHandler';
import { authMiddleware } from './shared/middleware/authMiddleware';

// Import des routes
import authRoutes from './modules/auth/routes';
import userRoutes from './modules/users/routes';
import studentRoutes from './modules/students/routes';
import teacherRoutes from './modules/teachers/routes';
import parentRoutes from './modules/parents/routes';
import classRoutes from './modules/classes/routes';
import subjectRoutes from './modules/subjects/routes';
import gradeRoutes from './modules/grades/routes';
import assignmentRoutes from './modules/assignments/routes';
import attendanceRoutes from './modules/attendance/routes';
import scheduleRoutes from './modules/schedule/routes';
import admissionRoutes from './modules/admissions/routes';
import financeRoutes from './modules/finance/routes';
import messageRoutes from './modules/messages/routes';
import achievementRoutes from './modules/achievements/routes';
import reportRoutes from './modules/reports/routes';
import resourceRoutes from './modules/resources/routes';
import virtualClassRoutes from './modules/virtual-classes/routes';
import notificationRoutes from './modules/notifications/routes';
import adminRoutes from './modules/admin/routes';

const app = express();

// ===========================
// MIDDLEWARE DE SÉCURITÉ
// ===========================

// Helmet pour sécuriser les headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard.',
    retryAfter: Math.ceil(config.rateLimitWindowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ===========================
// MIDDLEWARE GÉNÉRAUX
// ===========================

// Compression des réponses
app.use(compression());

// Logging des requêtes
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Parsing du JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Headers de réponse personnalisés
app.use((_req, res, next) => {
  res.setHeader('X-API-Version', config.apiVersion);
  res.setHeader('X-School-Name', config.schoolName);
  next();
});

// ===========================
// ROUTES PUBLIQUES
// ===========================

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: config.apiVersion,
    environment: config.nodeEnv,
    school: config.schoolName,
  });
});

// Health check API versionné (public)
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: config.apiVersion,
    environment: config.nodeEnv,
    school: config.schoolName,
  });
});

// Documentation API
app.get('/api/docs', (_req, res) => {
  res.json({
    message: 'Documentation API NoteCibolt',
    version: config.apiVersion,
    baseUrl: `/api/${config.apiVersion}`,
    endpoints: {
      auth: `/api/${config.apiVersion}/auth`,
      users: `/api/${config.apiVersion}/users`,
      students: `/api/${config.apiVersion}/students`,
      teachers: `/api/${config.apiVersion}/teachers`,
      parents: `/api/${config.apiVersion}/parents`,
      classes: `/api/${config.apiVersion}/classes`,
      subjects: `/api/${config.apiVersion}/subjects`,
      grades: `/api/${config.apiVersion}/grades`,
      assignments: `/api/${config.apiVersion}/assignments`,
      attendance: `/api/${config.apiVersion}/attendance`,
      schedule: `/api/${config.apiVersion}/schedule`,
      admissions: `/api/${config.apiVersion}/admissions`,
      finance: `/api/${config.apiVersion}/finance`,
      messages: `/api/${config.apiVersion}/messages`,
      achievements: `/api/${config.apiVersion}/achievements`,
      reports: `/api/${config.apiVersion}/reports`,
      resources: `/api/${config.apiVersion}/resources`,
      virtualClasses: `/api/${config.apiVersion}/virtual-classes`,
      notifications: `/api/${config.apiVersion}/notifications`,
    },
  });
});

// ===========================
// ROUTES API
// ===========================

const apiRouter = express.Router();

// Routes d'authentification (publiques)
apiRouter.use('/auth', authRoutes);

// Middleware d'authentification pour toutes les autres routes
apiRouter.use(authMiddleware);

// Routes protégées
apiRouter.use('/users', userRoutes);
apiRouter.use('/students', studentRoutes);
apiRouter.use('/teachers', teacherRoutes);
apiRouter.use('/parents', parentRoutes);
apiRouter.use('/classes', classRoutes);
apiRouter.use('/subjects', subjectRoutes);
apiRouter.use('/grades', gradeRoutes);
apiRouter.use('/assignments', assignmentRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/schedule', scheduleRoutes);
apiRouter.use('/admissions', admissionRoutes);
apiRouter.use('/finance', financeRoutes);
apiRouter.use('/messages', messageRoutes);
apiRouter.use('/achievements', achievementRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/resources', resourceRoutes);
apiRouter.use('/virtual-classes', virtualClassRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/admin', adminRoutes);

// Monter le router API
app.use(`/api/${config.apiVersion}`, apiRouter);

// ===========================
// MIDDLEWARE DE GESTION D'ERREURS
// ===========================

// Route non trouvée
app.use(notFoundHandler);

// Gestionnaire d'erreurs global
app.use(errorHandler);

// ===========================
// DÉMARRAGE DU SERVEUR
// ===========================

const PORT = config.port || 3001;

const server = app.listen(PORT, () => {
  console.log(`
🚀 NoteCibolt Backend Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Environment: ${config.nodeEnv}
🌐 Server: http://localhost:${PORT}
📚 API Base: http://localhost:${PORT}/api/${config.apiVersion}
📖 Health: http://localhost:${PORT}/health
📋 Docs: http://localhost:${PORT}/api/docs
🏫 School: ${config.schoolName}
📅 Academic Year: ${config.academicYear}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

// Gestion des signaux de fermeture
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

export default app;
