#!/bin/bash

echo "🔍 Diagnostic rapide de la connexion BDD NoteCibolt v2..."
echo ""

cd /Users/kader/Desktop/projet-en-cours/notecibolt-v2

echo "📁 Structure du projet :"
ls -la
echo ""

echo "🗄️ Vérification du schéma Prisma :"
if [ -f "backend/prisma/schema.prisma" ]; then
    echo "✅ Schema Prisma trouvé"
else
    echo "❌ Schema Prisma manquant"
fi

echo ""
echo "🌱 Vérification du seed :"
if [ -f "backend/prisma/seed.ts" ]; then
    echo "✅ Seed file trouvé"
    echo "📊 Aperçu du seed :"
    head -20 backend/prisma/seed.ts
else
    echo "❌ Seed file manquant"
fi

echo ""
echo "📦 Vérification des dépendances backend :"
cd backend
if [ -f "package.json" ]; then
    echo "✅ package.json trouvé"
    if [ -d "node_modules" ]; then
        echo "✅ node_modules installé"
    else
        echo "⚠️ node_modules manquant - exécuter: npm install"
    fi
else
    echo "❌ package.json manquant"
fi

echo ""
echo "🔧 Variables d'environnement :"
if [ -f ".env" ]; then
    echo "✅ Fichier .env trouvé"
    echo "📋 Contenu (sans mots de passe) :"
    grep -v "PASSWORD\|SECRET" .env || echo "Fichier .env vide ou sans variables sensibles"
else
    echo "⚠️ Fichier .env manquant"
    echo "📝 Création d'un .env basique..."
    cat > .env << EOF
# Base de données
DATABASE_URL="postgresql://postgres:password@localhost:5432/notecibolt"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"

# Application
NODE_ENV="development"
PORT=3001
API_VERSION="v1"
SCHOOL_NAME="École NoteCibolt"
ACADEMIC_YEAR="2024-2025"

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
EOF
    echo "✅ Fichier .env créé"
fi

cd ..

echo ""
echo "📦 Vérification des dépendances frontend :"
cd frontend
if [ -f "package.json" ]; then
    echo "✅ package.json trouvé"
    if [ -d "node_modules" ]; then
        echo "✅ node_modules installé"
    else
        echo "⚠️ node_modules manquant - exécuter: npm install"
    fi
else
    echo "❌ package.json manquant"
fi

echo ""
echo "🎯 Prochaines étapes recommandées :"
echo "1. cd /Users/kader/Desktop/projet-en-cours/notecibolt-v2"
echo "2. chmod +x *.sh"
echo "3. ./test-database.sh"
echo "4. ./start-with-real-data.sh"
echo ""
echo "🎉 Une fois démarré, l'interface de gestion des élèves affichera les 856 vrais élèves !"