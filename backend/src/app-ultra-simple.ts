import express from 'express';
import cors from 'cors';

const app = express();

// Middleware basiques
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'NoteCibolt Backend is running!',
  });
});

// Route de test
app.get('/api/v1/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
🚀 NoteCibolt Backend (Ultra Simple) Started!
🌐 Server: http://localhost:${PORT}
📖 Health: http://localhost:${PORT}/health
📚 Test: http://localhost:${PORT}/api/v1/test
  `);
});
