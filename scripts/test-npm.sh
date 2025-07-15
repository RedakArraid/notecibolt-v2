#!/bin/bash

# Test d'installation simple et direct
echo "🧪 TEST SIMPLE D'INSTALLATION NPM"
echo "================================="

cd frontend

echo ""
echo "📋 Étape 1: Nettoyage local"
rm -rf node_modules package-lock.json

echo ""
echo "📦 Étape 2: Installation fraîche"
npm install

echo ""
echo "✅ Étape 3: Vérification des dépendances critiques"
echo "TailwindCSS installé ?"
npm list tailwindcss

echo "Lucide React installé ?"
npm list lucide-react

echo "React installé ?"
npm list react

echo ""
echo "🚀 Étape 4: Test de démarrage local"
echo "Test du serveur Vite..."
timeout 10s npm run dev &
PID=$!
sleep 5

if kill -0 $PID 2>/dev/null; then
    echo "✅ Vite démarre correctement en local"
    kill $PID
else
    echo "❌ Problème avec le démarrage Vite"
fi

echo ""
echo "🐳 Étape 5: Création d'un Dockerfile minimal pour test"
cat > Dockerfile.test << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm list --depth=0
CMD ["npm", "list", "tailwindcss"]
EOF

echo ""
echo "🔨 Test de build Docker minimal..."
if docker build -f Dockerfile.test -t test-npm . > build.log 2>&1; then
    echo "✅ Build Docker minimal réussi"
    echo "Test d'exécution..."
    docker run --rm test-npm
else
    echo "❌ Build Docker minimal échoué"
    echo "Logs d'erreur:"
    cat build.log
fi

# Nettoyage
rm -f Dockerfile.test build.log

echo ""
echo "📊 RÉSULTAT DU TEST:"
if [ -d "node_modules" ] && [ -f "node_modules/tailwindcss/package.json" ]; then
    echo "✅ Installation locale : OK"
    echo "✅ TailwindCSS : OK"
    echo "💡 Le problème est spécifique à Docker"
else
    echo "❌ Installation locale : ÉCHEC"
    echo "💡 Le problème est dans le package.json ou l'environnement local"
fi
