#!/bin/bash

echo "🔧 Fix Docker NoteCibolt v2 - Connexion API"
echo "==========================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🛑 Arrêt des services existants...${NC}"
docker-compose down

echo -e "${BLUE}🧹 Nettoyage des volumes (optionnel)...${NC}"
read -p "Voulez-vous nettoyer les volumes Docker ? (y/N): " clean_volumes
if [[ $clean_volumes =~ ^[Yy]$ ]]; then
    docker-compose down -v
    echo -e "${YELLOW}✅ Volumes nettoyés${NC}"
fi

echo -e "${BLUE}🔨 Reconstruction des images...${NC}"
docker-compose build --no-cache

echo -e "${BLUE}🚀 Démarrage des services...${NC}"
docker-compose up -d

echo -e "${BLUE}⏳ Attente du démarrage complet...${NC}"
sleep 10

echo -e "${BLUE}📊 Vérification du statut...${NC}"
docker-compose ps

echo -e "${BLUE}🔍 Test de connectivité...${NC}"

# Test health check
echo "Test health check backend..."
for i in {1..5}; do
    if curl -s http://localhost:3001/health > /dev/null; then
        echo -e "${GREEN}✅ Backend accessible${NC}"
        break
    else
        echo "⏳ Tentative $i/5..."
        sleep 3
    fi
done

# Test API admin
echo "Test API admin..."
if curl -s http://localhost:3001/api/v1/admin/health > /dev/null; then
    echo -e "${GREEN}✅ API Admin accessible${NC}"
else
    echo -e "${RED}❌ API Admin non accessible${NC}"
    echo "Vérification des logs backend..."
    docker-compose logs --tail=20 backend
fi

# Test frontend
echo "Test frontend..."
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ Frontend accessible${NC}"
else
    echo -e "${RED}❌ Frontend non accessible${NC}"
    echo "Vérification des logs frontend..."
    docker-compose logs --tail=20 frontend
fi

echo -e "\n${YELLOW}🎯 URLs finales${NC}"
echo "Frontend:    http://localhost:5173"
echo "Backend:     http://localhost:3001"
echo "Admin API:   http://localhost:3001/api/v1/admin/health"
echo "Adminer:     http://localhost:8080"

echo -e "\n${YELLOW}👤 Comptes de test${NC}"
echo "Admin: admin@notecibolt.com / admin123"

echo -e "\n${GREEN}🎉 Fix terminé ! Testez maintenant l'interface admin.${NC}"
echo -e "${BLUE}Si le problème persiste, utilisez: ./diagnostic-docker.sh${NC}"
