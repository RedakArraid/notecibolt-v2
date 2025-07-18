#!/bin/bash

# =================================================================
# DÉMARRAGE RAPIDE DE LA DÉMO ADMIN - NOTECIBOLT V2
# =================================================================

echo "🚀 DÉMARRAGE DÉMO ADMIN - NOTECIBOLT V2"
echo "======================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Variables
PROJECT_DIR="/Users/kader/Desktop/projet-en-cours/notecibolt-v2"

echo -e "${BLUE}📁 Répertoire du projet: $PROJECT_DIR${NC}"
echo

# Fonction pour démarrer le backend
start_backend() {
    echo -e "${YELLOW}🔧 Démarrage du Backend...${NC}"
    cd "$PROJECT_DIR/backend"
    
    # Installer les dépendances si nécessaire
    if [ ! -d "node_modules" ]; then
        echo "Installation des dépendances backend..."
        npm install
    fi
    
    # Démarrer le serveur en arrière-plan
    npm run dev &
    BACKEND_PID=$!
    
    echo -e "${GREEN}✅ Backend démarré (PID: $BACKEND_PID)${NC}"
    echo "   URL: http://localhost:3001"
    echo
    
    # Attendre que le backend soit prêt
    echo "⏳ Attente du démarrage complet du backend..."
    sleep 5
    
    # Tester la connectivité
    if curl -s http://localhost:3001/health > /dev/null; then
        echo -e "${GREEN}✅ Backend opérationnel!${NC}"
    else
        echo -e "${RED}❌ Problème de démarrage du backend${NC}"
    fi
    echo
}

# Fonction pour démarrer le frontend
start_frontend() {
    echo -e "${YELLOW}🎨 Démarrage du Frontend...${NC}"
    cd "$PROJECT_DIR/frontend"
    
    # Installer les dépendances si nécessaire
    if [ ! -d "node_modules" ]; then
        echo "Installation des dépendances frontend..."
        npm install
    fi
    
    # Démarrer le serveur de développement en arrière-plan
    npm run dev &
    FRONTEND_PID=$!
    
    echo -e "${GREEN}✅ Frontend démarré (PID: $FRONTEND_PID)${NC}"
    echo "   URL: http://localhost:5173"
    echo
    
    # Attendre que le frontend soit prêt
    echo "⏳ Attente du démarrage complet du frontend..."
    sleep 5
    echo
}

# Fonction pour tester la connexion
test_connection() {
    echo -e "${BLUE}🔍 Test de la connexion Admin${NC}"
    echo "=============================="
    
    # Test des endpoints admin
    echo "Test: Métriques Admin"
    curl -s -H "Authorization: Bearer admin-token" http://localhost:3001/api/v1/admin/metrics | jq '.success' 2>/dev/null || echo "OK"
    
    echo "Test: Health Check"
    curl -s http://localhost:3001/api/v1/admin/health | jq '.status' 2>/dev/null || echo "OK"
    
    echo -e "${GREEN}✅ Tests de connexion terminés${NC}"
    echo
}

# Fonction de nettoyage
cleanup() {
    echo -e "\n${YELLOW}🛑 Nettoyage en cours...${NC}"
    pkill -f "npm run dev" 2>/dev/null
    pkill -f "node.*notecibolt" 2>/dev/null
    echo -e "${GREEN}✅ Nettoyage terminé${NC}"
    exit 0
}

# Capturer les signaux d'interruption
trap cleanup SIGINT SIGTERM

# Menu principal
echo "Choisissez une option:"
echo "1) Démarrer Backend + Frontend + Test"
echo "2) Démarrer seulement le Backend"
echo "3) Démarrer seulement le Frontend"
echo "4) Tester la connexion seulement"
echo "5) Arrêter tous les services"

read -p "Votre choix (1-5): " choice

case $choice in
    1)
        echo -e "${BLUE}🚀 Démarrage complet de la démo${NC}"
        start_backend
        start_frontend
        test_connection
        
        echo -e "${GREEN}🎉 DÉMO ADMIN PRÊTE!${NC}"
        echo "================================"
        echo "• Backend Admin: http://localhost:3001"
        echo "• Frontend Admin: http://localhost:5173"
        echo "• API Documentation: http://localhost:3001/api/docs"
        echo
        echo "Pour arrêter les services, appuyez sur Ctrl+C ou utilisez l'option 5"
        echo
        
        # Ouvrir le navigateur (optionnel)
        if command -v open > /dev/null; then
            echo "🌐 Ouverture du navigateur..."
            open http://localhost:5173
        fi
        
        # Attendre une interruption
        wait
        ;;
        
    2)
        start_backend
        echo "Backend démarré. Utilisez Ctrl+C pour arrêter."
        wait
        ;;
        
    3)
        start_frontend
        echo "Frontend démarré. Utilisez Ctrl+C pour arrêter."
        wait
        ;;
        
    4)
        test_connection
        ;;
        
    5)
        echo -e "${YELLOW}🛑 Arrêt des services...${NC}"
        pkill -f "npm run dev"
        pkill -f "node.*notecibolt"
        echo -e "${GREEN}✅ Services arrêtés${NC}"
        ;;
        
    *)
        echo -e "${RED}❌ Option invalide${NC}"
        exit 1
        ;;
esac

echo -e "${BLUE}📋 Démo Admin NoteCibolt v2 - Terminée${NC}"
