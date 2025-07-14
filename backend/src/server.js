const express = require('express');
const cors = require('cors');

const app = express();

// Middleware de base
app.use(cors());
app.use(express.json());

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'NoteCibolt Backend is running!',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3001
  });
});

// Route API de test
app.get('/api/v1/test', (req, res) => {
  res.json({
    message: 'API Backend NoteCibolt fonctionne!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Route de documentation simple
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'NoteCibolt API',
    description: 'Système de gestion scolaire',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      test: '/api/v1/test',
      docs: '/api/docs'
    }
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl,
    message: 'Vérifiez votre URL'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 NoteCibolt Backend démarré avec succès!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📖 Health: http://localhost:${PORT}/health`);
  console.log(`📚 API Test: http://localhost:${PORT}/api/v1/test`);
  console.log(`📋 Docs: http://localhost:${PORT}/api/docs`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});
