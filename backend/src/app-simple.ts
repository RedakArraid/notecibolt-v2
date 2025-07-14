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

// Import des routes existantes
import authRoutes from './modules/auth/routes';

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
  origin: config.allowedOrigins || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard.',
    retryAfter: 900,
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
app.use(morgan('dev'));

// Parsing du JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Headers de réponse personnalisés
app.use((req, res, next) => {
  res.setHeader('X-API-Version', 'v1');
  res.setHeader('X-School-Name', 'École NoteCibolt');
  next();
});

// ===========================
// ROUTES PUBLIQUES
// ===========================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: 'v1',
    environment: process.env.NODE_ENV || 'development',
    school: 'École NoteCibolt',
  });
});

// Documentation API
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'Documentation API NoteCibolt',
    version: 'v1',
    baseUrl: '/api/v1',
    endpoints: {
      auth: '/api/v1/auth',
      health: '/health',
    },
  });
});

// ===========================
// ROUTES API
// ===========================

const apiRouter = express.Router();

// Routes d'authentification (publiques)
apiRouter.use('/auth', authRoutes);

// Route de test protégée
apiRouter.get('/test', authMiddleware, (req, res) => {
  res.json({
    message: 'Route protégée accessible',
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

// Monter le router API
app.use('/api/v1', apiRouter);

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

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`
🚀 NoteCibolt Backend Server Started (Simplified)!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server: http://localhost:${PORT}
📚 API Base: http://localhost:${PORT}/api/v1
📖 Health: http://localhost:${PORT}/health
📋 Docs: http://localhost:${PORT}/api/docs
🏫 School: École NoteCibolt
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
