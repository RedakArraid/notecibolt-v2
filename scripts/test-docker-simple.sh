#!/bin/bash

# Script de test Docker simplifié - À lancer depuis notecibolt-v2
echo "🧪 TEST DOCKER SIMPLIFIÉ"
echo "========================"

# Vérifier qu'on est dans le bon répertoire
if [ ! -d "frontend" ]; then
    echo "❌ Erreur: Ce script doit être lancé depuis le répertoire notecibolt-v2"
    echo "💡 Usage: cd notecibolt-v2 && ./scripts/test-docker-simple.sh"
    exit 1
fi

echo ""
echo "📁 Répertoire courant: $(pwd)"
echo "📋 Contenu:"
ls -la

echo ""
echo "🔍 Vérification du Dockerfile.simple..."
if [ -f "frontend/Dockerfile.simple" ]; then
    echo "✅ Dockerfile.simple trouvé"
else
    echo "❌ Dockerfile.simple manquant, création..."
    cat > frontend/Dockerfile.simple << 'EOF'
# Dockerfile simplifié pour diagnostic
FROM node:18-alpine

# Installer git pour les dépendances npm
RUN apk add --no-cache git

# Créer le répertoire de l'application
WORKDIR /app

# Méthode alternative : copier tout d'abord puis installer
COPY . .

# Supprimer node_modules local s'il existe
RUN rm -rf node_modules package-lock.json

# Installer les dépendances avec logs verbeux
RUN npm cache clean --force
RUN npm install --loglevel verbose

# Vérifier l'installation
RUN echo "=== VÉRIFICATION FINALE ===" && \
    npm list --depth=0 && \
    echo "=== TAILWINDCSS SPÉCIFIQUEMENT ===" && \
    npm list tailwindcss

# Exposer le port Vite
EXPOSE 5173

# Commande de démarrage
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
EOF
    echo "✅ Dockerfile.simple créé"
fi

echo ""
echo "🔨 Construction de l'image de test..."
cd frontend
if docker build -f Dockerfile.simple -t test-frontend . 2>&1 | tee build.log; then
    echo ""
    echo "✅ Build réussi !"
    echo ""
    echo "🚀 Test de démarrage du conteneur..."
    echo "Appuyez sur Ctrl+C pour arrêter quand Vite sera démarré"
    echo ""
    docker run --rm -p 5173:5173 test-frontend
else
    echo ""
    echo "❌ Build échoué"
    echo "📋 Logs d'erreur:"
    cat build.log
fi

# Retour au répertoire parent
cd ..
