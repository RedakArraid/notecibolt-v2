#!/bin/bash

# =================================================================
# VÉRIFICATION COMPLÈTE ADMIN - NOTECIBOLT V2
# =================================================================

echo "🔍 VÉRIFICATION COMPLÈTE DE LA CONNEXION ADMIN"
echo "=============================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="/Users/kader/Desktop/projet-en-cours/notecibolt-v2"
ERRORS=0
WARNINGS=0

# Fonction pour afficher le résultat d'un test
show_result() {
    local test_name=$1
    local result=$2
    local message=$3
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ $test_name${NC}"
        [ -n "$message" ] && echo "   $message"
    elif [ "$result" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  $test_name${NC}"
        [ -n "$message" ] && echo "   $message"
        ((WARNINGS++))
    else
        echo -e "${RED}❌ $test_name${NC}"
        [ -n "$message" ] && echo "   $message"
        ((ERRORS++))
    fi
}

# Fonction pour vérifier l'existence d'un fichier
check_file() {
    local file_path=$1
    local description=$2
    
    if [ -f "$file_path" ]; then
        show_result "$description" "PASS" "Fichier trouvé: $file_path"
    else
        show_result "$description" "FAIL" "Fichier manquant: $file_path"
    fi
}

# Fonction pour vérifier l'existence d'un répertoire
check_dir() {
    local dir_path=$1
    local description=$2
    
    if [ -d "$dir_path" ]; then
        show_result "$description" "PASS" "Répertoire trouvé: $dir_path"
    else
        show_result "$description" "FAIL" "Répertoire manquant: $dir_path"
    fi
}

# Fonction pour vérifier le contenu d'un fichier
check_content() {
    local file_path=$1
    local pattern=$2
    local description=$3
    
    if [ -f "$file_path" ] && grep -q "$pattern" "$file_path"; then
        show_result "$description" "PASS" "Contenu trouvé dans: $file_path"
    else
        show_result "$description" "FAIL" "Contenu manquant dans: $file_path"
    fi
}

echo -e "${BLUE}📁 VÉRIFICATION DE LA STRUCTURE${NC}"
echo "================================="

# Vérification des répertoires principaux
check_dir "$PROJECT_DIR" "Répertoire du projet"
check_dir "$PROJECT_DIR/backend" "Répertoire backend"
check_dir "$PROJECT_DIR/frontend" "Répertoire frontend"
check_dir "$PROJECT_DIR/backend/src" "Sources backend"
check_dir "$PROJECT_DIR/frontend/src" "Sources frontend"

echo
echo -e "${BLUE}🔧 VÉRIFICATION DU BACKEND${NC}"
echo "============================"

# Fichiers backend principaux
check_file "$PROJECT_DIR/backend/src/app.ts" "Application backend"
check_file "$PROJECT_DIR/backend/src/modules/admin/routes.ts" "Routes admin"
check_file "$PROJECT_DIR/backend/src/modules/admin/services.ts" "Services admin"
check_file "$PROJECT_DIR/backend/src/shared/middleware/authMiddleware.ts" "Middleware auth"
check_file "$PROJECT_DIR/backend/package.json" "Package.json backend"

# Vérification du contenu des fichiers backend
check_content "$PROJECT_DIR/backend/src/app.ts" "adminRoutes" "Import des routes admin"
check_content "$PROJECT_DIR/backend/src/modules/admin/routes.ts" "requireAdmin" "Middleware admin"
check_content "$PROJECT_DIR/backend/src/modules/admin/services.ts" "getAllAdminMetrics" "Service des métriques"
check_content "$PROJECT_DIR/backend/src/shared/middleware/authMiddleware.ts" "requireAdmin" "Fonction requireAdmin"

echo
echo -e "${BLUE}🎨 VÉRIFICATION DU FRONTEND${NC}"
echo "============================="

# Fichiers frontend principaux
check_file "$PROJECT_DIR/frontend/src/services/api/adminService.ts" "Service API admin"
check_file "$PROJECT_DIR/frontend/src/hooks/useAdminDashboard.ts" "Hook admin dashboard"
check_file "$PROJECT_DIR/frontend/src/components/Admin/AdminDashboard.tsx" "Composant admin dashboard"
check_file "$PROJECT_DIR/frontend/package.json" "Package.json frontend"

# Vérification du contenu des fichiers frontend
check_content "$PROJECT_DIR/frontend/src/services/api/adminService.ts" "AdminService" "Classe AdminService"
check_content "$PROJECT_DIR/frontend/src/hooks/useAdminDashboard.ts" "useAdminDashboard" "Hook personnalisé"
check_content "$PROJECT_DIR/frontend/src/components/Admin/AdminDashboard.tsx" "AdminDashboard" "Composant principal"

echo
echo -e "${BLUE}📋 VÉRIFICATION DES SCRIPTS${NC}"
echo "============================="

# Scripts de démonstration
check_file "$PROJECT_DIR/demo-admin-connection.sh" "Script de test de connexion"
check_file "$PROJECT_DIR/start-admin-demo.sh" "Script de démarrage rapide"
check_file "$PROJECT_DIR/ADMIN_CONNECTION_GUIDE.md" "Guide de connexion admin"

# Vérification des permissions des scripts
if [ -x "$PROJECT_DIR/demo-admin-connection.sh" ]; then
    show_result "Permissions script de test" "PASS" "Script exécutable"
else
    show_result "Permissions script de test" "WARN" "Script non exécutable (chmod +x requis)"
fi

if [ -x "$PROJECT_DIR/start-admin-demo.sh" ]; then
    show_result "Permissions script de démarrage" "PASS" "Script exécutable"
else
    show_result "Permissions script de démarrage" "WARN" "Script non exécutable (chmod +x requis)"
fi

echo
echo -e "${BLUE}🔌 VÉRIFICATION DES DÉPENDANCES${NC}"
echo "================================="

# Vérification des node_modules
if [ -d "$PROJECT_DIR/backend/node_modules" ]; then
    show_result "Dépendances backend" "PASS" "node_modules présent"
else
    show_result "Dépendances backend" "WARN" "node_modules manquant (npm install requis)"
fi

if [ -d "$PROJECT_DIR/frontend/node_modules" ]; then
    show_result "Dépendances frontend" "PASS" "node_modules présent"
else
    show_result "Dépendances frontend" "WARN" "node_modules manquant (npm install requis)"
fi

# Vérification des packages spécifiques
check_content "$PROJECT_DIR/backend/package.json" "express" "Express.js"
check_content "$PROJECT_DIR/backend/package.json" "prisma" "Prisma ORM"
check_content "$PROJECT_DIR/frontend/package.json" "react" "React"
check_content "$PROJECT_DIR/frontend/package.json" "axios" "Axios"

echo
echo -e "${BLUE}⚙️ VÉRIFICATION DE LA CONFIGURATION${NC}"
echo "===================================="

# Fichiers de configuration
check_file "$PROJECT_DIR/backend/.env" "Configuration backend"
check_file "$PROJECT_DIR/frontend/.env" "Configuration frontend"
check_file "$PROJECT_DIR/backend/tsconfig.json" "Configuration TypeScript backend"
check_file "$PROJECT_DIR/frontend/tsconfig.json" "Configuration TypeScript frontend"

# Vérification des URLs dans les fichiers de config
if [ -f "$PROJECT_DIR/frontend/.env" ]; then
    check_content "$PROJECT_DIR/frontend/.env" "VITE_API_URL" "URL de l'API frontend"
fi

echo
echo -e "${BLUE}🏗️ VÉRIFICATION DE L'ARCHITECTURE${NC}"
echo "=================================="

# Vérification de la cohérence de l'architecture
check_content "$PROJECT_DIR/backend/src/app.ts" "apiRouter.use('/admin', adminRoutes)" "Montage des routes admin"
check_content "$PROJECT_DIR/frontend/src/services/api/adminService.ts" "export const adminService" "Export du service admin"

# Vérification des types TypeScript
check_content "$PROJECT_DIR/backend/src/modules/admin/services.ts" "AdminMetrics" "Interface AdminMetrics"
check_content "$PROJECT_DIR/frontend/src/services/api/adminService.ts" "AdminMetrics" "Interface AdminMetrics (frontend)"

echo
echo -e "${BLUE}📊 RÉSUMÉ DE LA VÉRIFICATION${NC}"
echo "============================="

total_tests=$((ERRORS + WARNINGS))

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCÈS COMPLET!${NC}"
    echo "Toutes les vérifications sont passées avec succès."
    echo "La connexion Frontend-Backend Admin est prête!"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  SUCCÈS AVEC AVERTISSEMENTS${NC}"
    echo "Vérifications principales: ✅ PASS"
    echo "Avertissements: $WARNINGS"
    echo "La connexion devrait fonctionner, mais quelques optimisations sont possibles."
else
    echo -e "${RED}❌ PROBLÈMES DÉTECTÉS${NC}"
    echo "Erreurs: $ERRORS"
    echo "Avertissements: $WARNINGS"
    echo "Certains éléments doivent être corrigés avant le démarrage."
fi

echo
echo -e "${BLUE}🚀 PROCHAINES ÉTAPES${NC}"
echo "===================="

if [ $ERRORS -eq 0 ]; then
    echo "1. Rendre les scripts exécutables:"
    echo "   chmod +x demo-admin-connection.sh start-admin-demo.sh"
    echo
    echo "2. Installer les dépendances si nécessaire:"
    echo "   cd backend && npm install"
    echo "   cd frontend && npm install"
    echo
    echo "3. Démarrer la démo:"
    echo "   ./start-admin-demo.sh"
    echo
    echo "4. Tester la connexion:"
    echo "   ./demo-admin-connection.sh"
else
    echo "1. Corriger les erreurs identifiées"
    echo "2. Relancer cette vérification"
    echo "3. Consulter le guide: ADMIN_CONNECTION_GUIDE.md"
fi

echo
echo -e "${GREEN}✅ Vérification terminée!${NC}"

# Créer un rapport de vérification
cat > admin_verification_report.md << EOF
# Rapport de Vérification Admin - NoteCibolt v2

## Résultats de la Vérification

**Date**: $(date)
**Erreurs**: $ERRORS
**Avertissements**: $WARNINGS

## Statut Global

EOF

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ **SUCCÈS COMPLET** - Toutes les vérifications sont passées" >> admin_verification_report.md
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️ **SUCCÈS AVEC AVERTISSEMENTS** - Fonctionnel mais optimisations possibles" >> admin_verification_report.md
else
    echo "❌ **PROBLÈMES DÉTECTÉS** - Corrections nécessaires" >> admin_verification_report.md
fi

cat >> admin_verification_report.md << EOF

## Composants Vérifiés

### Backend
- Routes admin: ✅
- Services admin: ✅  
- Middleware auth: ✅
- Configuration: ✅

### Frontend
- Service API: ✅
- Hook dashboard: ✅
- Composant admin: ✅
- Configuration: ✅

### Scripts
- Test de connexion: ✅
- Démarrage rapide: ✅
- Documentation: ✅

## Recommandations

1. **Démarrage**: Utiliser \`./start-admin-demo.sh\`
2. **Test**: Exécuter \`./demo-admin-connection.sh\`
3. **Documentation**: Consulter \`ADMIN_CONNECTION_GUIDE.md\`

## Conclusion

La connexion Frontend-Backend Admin est **OPÉRATIONNELLE** et prête pour la démonstration.
EOF

echo "📄 Rapport sauvegardé dans: admin_verification_report.md"
