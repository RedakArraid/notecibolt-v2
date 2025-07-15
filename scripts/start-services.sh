#!/bin/bash

# Script pour démarrer uniquement les services Docker (PostgreSQL, Redis, etc.)
echo "🔧 Démarrage des services NoteCibolt v2 (PostgreSQL, Redis, MailPit, Adminer)"
echo "============================================================================="

# Vérifier si on est dans le bon répertoire
if [ ! -f "docker-compose.services.yml" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le répertoire notecibolt-v2"
    echo "💡 Usage: cd notecibolt-v2 && ./scripts/start-services.sh"
    exit 1
fi

echo ""
echo "🔧 Vérification de Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

echo "✅ Docker et Docker Compose sont disponibles"

echo ""
echo "📦 Arrêt des services existants..."
docker-compose -f docker-compose.services.yml down

echo ""
echo "🚀 Démarrage des services en arrière-plan..."
docker-compose -f docker-compose.services.yml up -d

echo ""
echo "⏳ Attente du démarrage des services..."
sleep 10

echo ""
echo "✅ Services démarrés avec succès !"
echo ""
echo "🔧 Services disponibles:"
echo "   • PostgreSQL:  localhost:5433"
echo "   • Redis:       localhost:6380"
echo "   • Adminer:     http://localhost:8080"
echo "   • MailHog:     http://localhost:8025"
echo ""
echo "🗄️  Connexion PostgreSQL:"
echo "   • Host: localhost"
echo "   • Port: 5433"
echo "   • Database: notecibolt_db"
echo "   • Username: notecibolt_user"
echo "   • Password: notecibolt_password"
echo ""
echo "📊 Statut des services:"
docker-compose -f docker-compose.services.yml ps
echo ""
echo "💡 Pour arrêter les services:"
echo "   docker-compose -f docker-compose.services.yml down"
echo ""
echo "🚀 Vous pouvez maintenant démarrer le frontend en mode développement:"
echo "   cd frontend && npm run dev"