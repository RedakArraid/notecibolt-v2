#!/bin/bash

# Script de vérification avant Docker build
echo "🔍 Vérification des fichiers requis pour Docker"
echo "=============================================="

cd frontend

echo ""
echo "📦 Fichiers package :"
[ -f "package.json" ] && echo "✅ package.json" || echo "❌ package.json"
[ -f "package-lock.json" ] && echo "✅ package-lock.json" || echo "⚠️ package-lock.json (optionnel)"

echo ""
echo "🔧 Fichiers de configuration :"
[ -f "vite.config.ts" ] && echo "✅ vite.config.ts" || echo "❌ vite.config.ts"
[ -f "tailwind.config.js" ] && echo "✅ tailwind.config.js" || echo "❌ tailwind.config.js"
[ -f "postcss.config.js" ] && echo "✅ postcss.config.js" || echo "❌ postcss.config.js"
[ -f "tsconfig.json" ] && echo "✅ tsconfig.json" || echo "❌ tsconfig.json"
[ -f "tsconfig.app.json" ] && echo "✅ tsconfig.app.json" || echo "❌ tsconfig.app.json"
[ -f "tsconfig.node.json" ] && echo "✅ tsconfig.node.json" || echo "❌ tsconfig.node.json"

echo ""
echo "🌐 Fichiers web :"
[ -f "index.html" ] && echo "✅ index.html" || echo "❌ index.html"
[ -f ".env" ] && echo "✅ .env" || echo "❌ .env"
[ -f ".env.docker" ] && echo "✅ .env.docker" || echo "⚠️ .env.docker (optionnel)"

echo ""
echo "📁 Dossiers source :"
[ -d "src" ] && echo "✅ src/" || echo "❌ src/"
[ -d "public" ] && echo "✅ public/" || echo "❌ public/"

echo ""
echo "🧪 Test des dépendances critiques :"
if [ -f "package.json" ]; then
    if grep -q "tailwindcss" package.json; then
        echo "✅ tailwindcss dans package.json"
    else
        echo "❌ tailwindcss manquant dans package.json"
    fi
    
    if grep -q "lucide-react" package.json; then
        echo "✅ lucide-react dans package.json"
    else
        echo "❌ lucide-react manquant dans package.json"
    fi
else
    echo "❌ Impossible de vérifier les dépendances"
fi

echo ""
echo "🎯 Prêt pour Docker build !"
