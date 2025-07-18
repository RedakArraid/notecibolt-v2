#!/bin/bash

echo "🔧 Réparation rapide Docker - NoteCibolt v2"
echo "=========================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🛑 Arrêt du backend...${NC}"
docker-compose stop backend

echo -e "${BLUE}🔨 Reconstruction du backend uniquement...${NC}"
docker-compose build --no-cache backend

echo -e "${BLUE}🚀 Redémarrage du backend...${NC}"
docker-compose up -d backend

echo -e "${BLUE}⏳ Attente du démarrage (30 secondes)...${NC}"
sleep 30

echo -e "${BLUE}📊 Statut des conteneurs...${NC}"
docker-compose ps

echo -e "${BLUE}🔍 Test de l'API...${NC}"
if curl -s http://localhost:3001/health | grep -q "OK"; then
    echo -e "${GREEN}✅ Backend opérationnel !${NC}"
    
    # Test de l'API admin
    if curl -s http://localhost:3001/api/v1/admin/health > /dev/null; then
        echo -e "${GREEN}✅ API Admin accessible !${NC}"
        echo -e "${GREEN}🎉 Problème résolu ! L'interface admin devrait maintenant fonctionner.${NC}"
    else
        echo -e "${YELLOW}⚠️ API Admin pas encore prête, attendre quelques secondes...${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Backend encore en cours de démarrage...${NC}"
    echo "Logs du backend:"
    docker-compose logs --tail=20 backend
fi

echo -e "\n${YELLOW}🌐 URLs à tester:${NC}"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001/health"
echo "Admin:    http://localhost:3001/api/v1/admin/health"
