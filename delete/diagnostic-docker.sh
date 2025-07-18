#!/bin/bash

echo "🐳 Diagnostic Docker NoteCibolt v2"
echo "=================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonction pour vérifier un service
check_service() {
    local service_name=$1
    local url=$2
    local description=$3
    
    echo -e "${BLUE}🔍 Test $description...${NC}"
    
    if curl -s --max-time 5 "$url" > /dev/null; then
        echo -e "${GREEN}✅ $service_name est accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name n'est pas accessible${NC}"
        return 1
    fi
}

echo -e "${YELLOW}📊 Statut des conteneurs Docker${NC}"
docker-compose ps

echo -e "\n${YELLOW}📋 Logs récents du backend${NC}"
docker-compose logs --tail=10 backend

echo -e "\n${YELLOW}📋 Logs récents du frontend${NC}"
docker-compose logs --tail=10 frontend

echo -e "\n${YELLOW}🔍 Tests de connectivité${NC}"

# Attendre que les services démarrent
echo "⏳ Attente du démarrage des services..."
sleep 5

# Test des services
check_service "PostgreSQL" "http://localhost:8080" "Adminer (interface DB)"
check_service "Backend Health" "http://localhost:3001/health" "Health check backend"
check_service "Backend API" "http://localhost:3001/api/v1/health" "API backend"
check_service "Admin Health" "http://localhost:3001/api/v1/admin/health" "Admin API"
check_service "Frontend" "http://localhost:5173" "Interface frontend"
check_service "MailPit" "http://localhost:8025" "Interface emails"

echo -e "\n${YELLOW}🔧 Configuration réseau${NC}"
echo "Network Docker:"
docker network ls | grep notecibolt

echo -e "\nContainers dans le réseau:"
docker network inspect notecibolt_notecibolt_network --format='{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}' 2>/dev/null || echo "Réseau non trouvé"

echo -e "\n${YELLOW}🌐 URLs de test${NC}"
echo "Frontend:     http://localhost:5173"
echo "Backend API:  http://localhost:3001"
echo "Health:       http://localhost:3001/health"
echo "Admin API:    http://localhost:3001/api/v1/admin/health"
echo "Adminer:      http://localhost:8080"
echo "MailPit:      http://localhost:8025"

echo -e "\n${YELLOW}📝 Variables d'environnement importantes${NC}"
echo "VITE_API_URL depuis le conteneur frontend:"
docker-compose exec -T frontend printenv | grep VITE_API_URL || echo "Variable non trouvée"

echo -e "\n${YELLOW}🔍 Test manuel de l'API${NC}"
echo "Pour tester manuellement:"
echo "curl http://localhost:3001/health"
echo "curl http://localhost:3001/api/v1/admin/health"

# Test final complet
echo -e "\n${BLUE}🧪 Test complet de l'API admin${NC}"
if curl -s "http://localhost:3001/api/v1/admin/health" | grep -q "success"; then
    echo -e "${GREEN}✅ API Admin fonctionnelle !${NC}"
    echo -e "${GREEN}Le problème vient probablement de la configuration frontend${NC}"
else
    echo -e "${RED}❌ API Admin non accessible${NC}"
    echo -e "${RED}Vérifiez les logs du backend ci-dessus${NC}"
fi

echo -e "\n${YELLOW}💡 Solutions suggérées${NC}"
echo "1. Vérifiez que tous les conteneurs sont démarrés: docker-compose ps"
echo "2. Redémarrez les services: docker-compose restart"
echo "3. Reconstruisez les images: docker-compose up --build"
echo "4. Vérifiez les logs: docker-compose logs backend"
echo "5. Testez l'API directement: curl http://localhost:3001/health"
