#!/bin/bash

# Script de correction amélioré pour Docker NoteCibolt v2
echo "🔧 Correction Docker NoteCibolt v2 - Version améliorée"
echo "=================================================="

# Vérifier si on est dans le bon répertoire
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le répertoire notecibolt-v2"
    exit 1
fi

echo ""
echo "📋 Étape 1: Vérification des fichiers requis..."
./scripts/check-files.sh

echo ""
echo "🛑 Étape 2: Arrêt propre des services..."
docker-compose down --remove-orphans

echo ""
echo "🧹 Étape 3: Nettoyage complet..."
# Supprimer les volumes
echo "Suppression des volumes..."
docker volume rm notecibolt-v2_frontend_node_modules 2>/dev/null || true
docker volume rm notecibolt-v2_backend_node_modules 2>/dev/null || true

# Supprimer les images
echo "Suppression des images pour reconstruction..."
docker rmi notecibolt-v2_frontend 2>/dev/null || true
docker rmi notecibolt-v2_backend 2>/dev/null || true

# Nettoyer le cache Docker
echo "Nettoyage du cache Docker..."
docker builder prune -f

echo ""
echo "🔨 Étape 4: Test de build frontend..."
echo "Construction de l'image frontend..."
if docker-compose build --no-cache frontend; then
    echo "✅ Build frontend réussi"
else
    echo "❌ Échec du build frontend"
    echo ""
    echo "🔍 Diagnostic détaillé:"
    echo "1. Vérifier les logs de build:"
    echo "   docker-compose build --no-cache --progress=plain frontend"
    echo ""
    echo "2. Vérifier les fichiers manquants:"
    echo "   ls -la frontend/"
    echo ""
    echo "3. Test local des dépendances:"
    echo "   cd frontend && npm install && npm run build"
    exit 1
fi

echo ""
echo "🚀 Étape 5: Démarrage des services..."
if docker-compose up -d; then
    echo ""
    echo "✅ Services démarrés avec succès !"
    echo ""
    echo "📊 État des services:"
    docker-compose ps
    echo ""
    echo "🌐 URLs disponibles:"
    echo "   • Frontend:  http://localhost:5173"
    echo "   • Backend:   http://localhost:3001"
    echo "   • Adminer:   http://localhost:8080"
    echo "   • MailPit:   http://localhost:8025"
    echo ""
    echo "📝 Pour voir les logs en temps réel:"
    echo "   docker-compose logs -f frontend"
    echo ""
    echo "🎯 Test de santé dans 10 secondes..."
    sleep 10
    
    # Test de santé du frontend
    if curl -s http://localhost:5173 > /dev/null; then
        echo "✅ Frontend accessible sur http://localhost:5173"
    else
        echo "⚠️ Frontend pas encore accessible, vérifiez les logs:"
        echo "   docker-compose logs frontend"
    fi
    
else
    echo "❌ Erreur lors du démarrage des services"
    echo ""
    echo "📋 Diagnostic:"
    echo "1. Vérifier les logs complets:"
    echo "   docker-compose logs"
    echo ""
    echo "2. Vérifier l'état des conteneurs:"
    echo "   docker-compose ps"
    echo ""
    echo "3. Redémarrer manuellement:"
    echo "   docker-compose up --force-recreate"
    exit 1
fi

echo ""
echo "🎉 Correction terminée avec succès !"
echo "L'application est maintenant disponible sur http://localhost:5173"
