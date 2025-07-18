#!/bin/bash

echo "🔧 Fix des erreurs Vite - Phase 6"
echo "================================="

cd /Users/kader/Desktop/projet-en-cours/notecibolt-v2/frontend

echo "📦 Installation des dépendances..."
npm install

echo "🧹 Nettoyage du cache..."
rm -rf node_modules/.vite
rm -rf dist

echo "🚀 Démarrage du serveur de développement..."
npm run dev

echo ""
echo "✅ Corrections appliquées :"
echo "- lazyComponents.tsx : Import direct des fallbacks"
echo "- main.tsx : Timeouts pour préchargement"
echo "- performance.ts : Gestion d'erreurs robuste"
echo "- Préchargement sécurisé des composants"
echo ""
echo "🎯 L'application devrait maintenant démarrer sans erreurs !"
