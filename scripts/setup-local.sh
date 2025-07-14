#!/bin/bash

# Script d'installation locale pour NoteCibolt v2 (sans Docker)
# Usage: ./scripts/setup-local.sh

set -e

echo "🎓 NoteCibolt v2 - Installation locale"
echo "====================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Vérifier les prérequis
log_info "Vérification des prérequis..."

# Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé. Installez Node.js 18+ depuis https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js 18+ requis. Version actuelle: $(node --version)"
    exit 1
fi

# PostgreSQL
if ! command -v psql &> /dev/null; then
    log_warning "PostgreSQL n'est pas installé. Installation..."
    if command -v brew &> /dev/null; then
        brew install postgresql
        brew services start postgresql
    else
        log_error "Veuillez installer PostgreSQL manuellement"
        exit 1
    fi
fi

log_success "Prérequis vérifiés"

# Configuration de la base de données
log_info "Configuration de la base de données..."
createdb notecibolt_db 2>/dev/null || log_warning "La base de données existe déjà"

# Installation du backend
log_info "Installation du backend..."
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    log_success "Fichier .env créé"
fi

npm install
log_success "Dépendances installées"

# Prisma
log_info "Configuration de Prisma..."
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
log_success "Base de données initialisée"

# Créer les dossiers nécessaires
mkdir -p uploads logs

cd ..

log_success "🎉 Installation terminée!"
echo
echo "🚀 Pour démarrer le backend:"
echo "   cd backend && npm run dev"
echo
echo "🌐 Backend sera accessible sur:"
echo "   http://localhost:3001"
echo "   http://localhost:3001/api/docs"
echo "   http://localhost:3001/health"
