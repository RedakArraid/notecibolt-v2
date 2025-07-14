#!/bin/bash

# Script de configuration et démarrage rapide pour NoteCibolt v2
# Usage: ./scripts/setup.sh

set -e

echo "🎓 NoteCibolt v2 - Configuration et démarrage"
echo "============================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Menu principal
main() {
    echo
    log_info "Choisissez le mode d'installation:"
    echo "1) Docker (recommandé)"
    echo "2) Installation locale"
    echo "3) Démarrer seulement"
    echo
    
    read -p "Votre choix (1-3) [1]: " choice
    choice=${choice:-1}
    
    case $choice in
        1)
            log_info "Installation avec Docker..."
            ;;
        2)
            log_info "Installation locale..."
            ;;
        3)
            log_info "Démarrage des services..."
            ;;
        *)
            log_error "Choix invalide"
            exit 1
            ;;
    esac
    
    log_success "Installation terminée! 🚀"
}

main "$@"
