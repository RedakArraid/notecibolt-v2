#!/bin/bash

# Script de correction pour le problème TailwindCSS Docker
echo "🔧 Correction du problème TailwindCSS Docker"
echo "==========================================="

# Vérifier si on est dans le bon répertoire
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le répertoire notecibolt-v2"
    exit 1
fi

echo ""
echo "🛑 Arrêt de tous les services..."
docker-compose down

echo ""
echo "🧹 Nettoyage des volumes node_modules..."
docker volume rm notecibolt-v2_frontend_node_modules 2>/dev/null || true
docker volume rm notecibolt-v2_backend_node_modules 2>/dev/null || true

echo ""
echo "🗑️ Suppression des images pour forcer la reconstruction..."
docker rmi notecibolt-v2_frontend 2>/dev/null || true
docker rmi notecibolt-v2_backend 2>/dev/null || true

echo ""
echo "🧹 Nettoyage des conteneurs orphelins..."
docker-compose down --remove-orphans

echo ""
echo "🔨 Reconstruction et démarrage des services..."
echo "   (Cela va prendre quelques minutes pour réinstaller les dépendances)"

if docker-compose up --build --force-recreate; then
    echo ""
    echo "✅ Services redémarrés avec succès !"
else
    echo ""
    echo "❌ Erreur lors du redémarrage"
    echo ""
    echo "📋 Diagnostic :"
    echo "1. Vérifier les logs : docker-compose logs frontend"
    echo "2. Vérifier l'installation npm : docker-compose exec frontend npm list"
    echo "3. Reconstruire manuellement : docker-compose build --no-cache frontend"
    exit 1
fi
