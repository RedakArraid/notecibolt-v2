import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadCriticalComponents } from './utils/lazyComponents'
import { globalCache, measureBundleSize } from './utils/performance'

// Précharger les composants critiques (après le chargement du DOM)
setTimeout(() => {
  preloadCriticalComponents();
}, 1000);

// Mesurer la taille des bundles en développement
if (import.meta.env.DEV) {
  setTimeout(() => {
    measureBundleSize();
  }, 2000);
}

// Nettoyer le cache périodiquement
setInterval(() => {
  globalCache.clear();
}, 30 * 60 * 1000); // Nettoyer toutes les 30 minutes

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)