import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Vérification...')
  const [backendData, setBackendData] = useState<any>(null)

  useEffect(() => {
    // Tester la connexion au backend
    fetch('http://localhost:3001/health')
      .then(response => response.json())
      .then(data => {
        setBackendStatus('✅ Connecté')
        setBackendData(data)
      })
      .catch(error => {
        setBackendStatus('❌ Erreur de connexion')
        console.error('Erreur:', error)
      })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎓 NoteCibolt v2</h1>
        <h2>Système de Gestion Scolaire</h2>
        
        <div className="status-card">
          <h3>Status du Backend</h3>
          <p><strong>État:</strong> {backendStatus}</p>
          {backendData && (
            <div>
              <p><strong>Message:</strong> {backendData.message}</p>
              <p><strong>Port:</strong> {backendData.port}</p>
              <p><strong>Heure:</strong> {new Date(backendData.timestamp).toLocaleString()}</p>
            </div>
          )}
        </div>

        <div className="services-grid">
          <div className="service-card">
            <h4>🌐 Frontend</h4>
            <p>React + TypeScript + Vite</p>
            <span className="status-badge success">✅ Actif</span>
          </div>
          
          <div className="service-card">
            <h4>🔧 Backend API</h4>
            <p>Node.js + Express</p>
            <span className={`status-badge ${backendData ? 'success' : 'error'}`}>
              {backendData ? '✅ Actif' : '❌ Inactif'}
            </span>
          </div>
          
          <div className="service-card">
            <h4>🗄️ Base de données</h4>
            <p>PostgreSQL + Prisma</p>
            <span className="status-badge success">✅ Actif</span>
          </div>
          
          <div className="service-card">
            <h4>📧 Emails</h4>
            <p>MailPit</p>
            <span className="status-badge success">✅ Actif</span>
          </div>
        </div>

        <div className="links-section">
          <h3>🔗 Liens utiles</h3>
          <div className="links-grid">
            <a href="http://localhost:3001/health" target="_blank" rel="noopener noreferrer">
              📊 Health Check
            </a>
            <a href="http://localhost:3001/api/docs" target="_blank" rel="noopener noreferrer">
              📚 API Docs
            </a>
            <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">
              🗄️ Admin DB
            </a>
            <a href="http://localhost:8025" target="_blank" rel="noopener noreferrer">
              📧 MailPit
            </a>
          </div>
        </div>

        <div className="info-section">
          <h3>👤 Comptes de test</h3>
          <div className="accounts-grid">
            <div className="account-card">
              <strong>Admin:</strong> admin@notecibolt.com / password123
            </div>
            <div className="account-card">
              <strong>Enseignant:</strong> teacher@notecibolt.com / password123
            </div>
            <div className="account-card">
              <strong>Élève:</strong> student@notecibolt.com / password123
            </div>
            <div className="account-card">
              <strong>Parent:</strong> parent@notecibolt.com / password123
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App