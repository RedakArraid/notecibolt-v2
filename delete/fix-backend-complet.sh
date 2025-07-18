#!/bin/bash

echo "🔧 FIX COMPLET - Backend NoteCibolt v2"
echo "===================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🛑 Arrêt complet des services...${NC}"
docker-compose down

echo -e "${BLUE}🧹 Nettoyage des volumes et caches...${NC}"
docker-compose down -v
docker system prune -f

echo -e "${BLUE}🔨 Reconstruction complète des images...${NC}"
docker-compose build --no-cache

echo -e "${BLUE}🚀 Démarrage des services en mode détaché...${NC}"
docker-compose up -d

echo -e "${BLUE}⏳ Attente du démarrage complet (60 secondes)...${NC}"
echo "Services en cours de démarrage..."

# Attendre et surveiller les services
for i in {1..12}; do
    echo "⏳ Vérification $i/12..."
    sleep 5
    
    # Vérifier postgres
    if docker-compose ps postgres | grep -q "healthy"; then
        echo -e "${GREEN}✅ PostgreSQL: Healthy${NC}"
    else
        echo -e "${YELLOW}⏳ PostgreSQL: En cours...${NC}"
    fi
    
    # Vérifier backend
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend: Accessible${NC}"
        break
    else
        echo -e "${YELLOW}⏳ Backend: En cours de démarrage...${NC}"
    fi
done

echo -e "\n${BLUE}📊 Statut final des conteneurs:${NC}"
docker-compose ps

echo -e "\n${BLUE}🔍 Tests de connectivité finaux:${NC}"

# Test PostgreSQL via Adminer
if curl -s http://localhost:8080 > /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL (Adminer): Accessible${NC}"
else
    echo -e "${RED}❌ PostgreSQL (Adminer): Non accessible${NC}"
fi

# Test Backend Health
if curl -s http://localhost:3001/health | grep -q "OK"; then
    echo -e "${GREEN}✅ Backend Health: OK${NC}"
    
    # Test API Admin
    if curl -s http://localhost:3001/api/v1/admin/health > /dev/null; then
        echo -e "${GREEN}✅ API Admin: Accessible${NC}"
        echo -e "${GREEN}🎉 PROBLÈME RÉSOLU! Interface admin devrait maintenant fonctionner.${NC}"
    else
        echo -e "${YELLOW}⚠️ API Admin: Pas encore prête${NC}"
        echo "Vérification des logs backend:"
        docker-compose logs --tail=10 backend
    fi
else
    echo -e "${RED}❌ Backend Health: Échec${NC}"
    echo "Logs du backend:"
    docker-compose logs --tail=20 backend
fi

# Test Frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ Frontend: Accessible${NC}"
else
    echo -e "${YELLOW}⚠️ Frontend: Problème de démarrage${NC}"
fi

echo -e "\n${YELLOW}🌐 URLs finales:${NC}"
echo "Frontend:     http://localhost:5173"
echo "Backend:      http://localhost:3001/health"
echo "Admin API:    http://localhost:3001/api/v1/admin/health"
echo "Adminer (DB): http://localhost:8080"
echo "MailPit:      http://localhost:8025"

echo -e "\n${YELLOW}👤 Comptes de test:${NC}"
echo "Admin: admin@notecibolt.com / admin123"
echo "Teacher: teacher1@notecibolt.com / teacher123"
echo "Student: student1@notecibolt.com / student123"

echo -e "\n${YELLOW}🔧 Si le problème persiste:${NC}"
echo "1. Vérifiez les logs: docker-compose logs -f backend"
echo "2. Testez l'API: curl http://localhost:3001/health"
echo "3. Redémarrez juste le backend: docker-compose restart backend"

echo -e "\n${GREEN}✅ Fix terminé!${NC}"
