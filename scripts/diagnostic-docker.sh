#!/bin/bash

# Script de diagnostic Docker détaillé
echo "🔍 DIAGNOSTIC DOCKER DÉTAILLÉ"
echo "============================="

echo ""
echo "📁 1. Vérification des fichiers locaux:"
echo "---------------------------------------"
cd frontend

echo "Package.json existe ?"
if [ -f "package.json" ]; then
    echo "✅ package.json trouvé ($(wc -l < package.json) lignes)"
    echo "Première ligne:" 
    head -1 package.json
    echo "Dernière ligne:"
    tail -1 package.json
else
    echo "❌ package.json MANQUANT"
    exit 1
fi

echo ""
echo "📦 2. Test d'installation locale:"
echo "---------------------------------"
echo "Test npm install en local..."
if npm install --dry-run > /dev/null 2>&1; then
    echo "✅ npm install fonctionne en local"
else
    echo "❌ npm install échoue en local"
    echo "Erreur:"
    npm install --dry-run
fi

echo ""
echo "🐳 3. Test de construction Docker step by step:"
echo "-----------------------------------------------"

# Construire uniquement jusqu'à l'installation npm
echo "Construction jusqu'à npm install..."
docker build --target=$(echo 'FROM node:18-alpine
RUN apk add --no-cache git  
WORKDIR /app
COPY package.json ./
RUN cat package.json
RUN npm install --verbose
RUN npm list --depth=0' | docker build -t test-npm-install -f - . && docker run --rm test-npm-install)

echo ""
echo "🔍 4. Analyse du package.json:"
echo "------------------------------"
echo "Dépendances principales:"
grep -A 10 '"dependencies"' package.json

echo ""
echo "DevDependencies:"
grep -A 15 '"devDependencies"' package.json

echo ""
echo "🔧 5. Diagnostic des erreurs possibles:"
echo "---------------------------------------"

# Vérifier la syntaxe JSON
if jq empty package.json 2>/dev/null; then
    echo "✅ JSON valide"
else
    echo "❌ JSON invalide dans package.json"
    echo "Erreur de syntaxe:"
    jq . package.json
fi

# Vérifier les caractères spéciaux
if file package.json | grep -q "UTF-8"; then
    echo "✅ Encodage UTF-8 correct"
else
    echo "⚠️ Problème d'encodage possible"
    file package.json
fi

echo ""
echo "💡 Recommandations:"
echo "- Si npm install échoue en local → Corriger package.json"
echo "- Si JSON invalide → Vérifier la syntaxe"
echo "- Si encodage incorrect → Sauvegarder en UTF-8"
echo "- Si tout semble OK → Problème Docker spécifique"
