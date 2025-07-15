#!/bin/bash

# Script de démarrage NoteCibolt v2 avec Docker Compose
echo "🐳 Démarrage NoteCibolt v2 avec Docker Compose"
echo "=============================================="

# Vérifier si on est dans le bon répertoire
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le répertoire notecibolt-v2"
    echo "💡 Usage: cd notecibolt-v2 && ./scripts/start-docker.sh"
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

# Fonction pour arrêter proprement
cleanup() {
    echo ""
    echo "🛑 Arrêt des services..."
    docker-compose down
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

echo ""
echo "📦 Arrêt des services existants..."
docker-compose down

echo ""
echo "🧹 Nettoyage des conteneurs orphelins..."
docker-compose down --remove-orphans

echo ""
echo "🔨 Construction et démarrage des services..."
echo "   (Cela peut prendre quelques minutes la première fois)"

# Construire et démarrer les services
if docker-compose up --build -d; then
    echo ""
    echo "✅ Services démarrés avec succès !"
    echo ""
    echo "🌐 Services disponibles:"
    echo "   • Frontend:   http://localhost:5173"
    echo "   • Backend API: http://localhost:3001"
    echo "   • PostgreSQL:  localhost:5433"
    echo "   • Redis:       localhost:6379"
    echo "   • Adminer:     http://localhost:8080"
    echo "   • MailPit:     http://localhost:8025"
    echo ""
    echo "👤 Comptes de test:"
    echo "   • Admin:      admin@notecibolt.com / admin123"
    echo "   • Enseignant: teacher@notecibolt.com / teacher123"
    echo "   • Étudiant:   student@notecibolt.com / student123"
    echo "   • Parent:     parent@notecibolt.com / parent123"
    echo "   • Superviseur: supervisor@notecibolt.com / supervisor123"
    echo ""
    echo "📊 Statut des services:"
    docker-compose ps
    echo ""
    echo "📝 Logs en temps réel (Ctrl+C pour arrêter):"
    echo "=============================================="
    
    # Afficher les logs en temps réel
    docker-compose logs -f
else
    echo "❌ Erreur lors du démarrage des services"
    echo "📋 Vérification des logs:"
    docker-compose logs
    exit 1
fi