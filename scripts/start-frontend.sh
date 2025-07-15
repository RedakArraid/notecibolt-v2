#!/bin/bash

# Script de démarrage NoteCibolt v2 Frontend
echo "🚀 Démarrage NoteCibolt v2 Frontend"
echo "====================================="

# Vérifier si on est dans le bon répertoire
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le répertoire notecibolt-v2"
    echo "💡 Usage: cd notecibolt-v2 && ./scripts/start-frontend.sh"
    exit 1
fi

cd frontend

echo ""
echo "📦 Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
    echo "📥 Installation des dépendances..."
    npm install
else
    echo "✅ Dépendances déjà installées"
fi

echo ""
echo "🔧 Vérification de la configuration..."

# Vérifier que les fichiers essentiels existent
essential_files=(
    "src/App.tsx"
    "src/components/Auth/EnhancedLoginPage.tsx"
    "src/components/Layout/Header.tsx"
    "src/components/Layout/Sidebar.tsx"
    "tailwind.config.js"
    ".env"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file manquant"
        exit 1
    fi
done

echo ""
echo "🎨 Vérification TypeScript..."
if npx tsc --noEmit --skipLibCheck > /dev/null 2>&1; then
    echo "✅ TypeScript OK"
else
    echo "⚠️  Avertissements TypeScript détectés (continuons quand même)"
fi

echo ""
echo "🌐 Lancement du serveur de développement..."
echo ""
echo "📱 Application disponible sur:"
echo "   • Local:   http://localhost:5173"
echo "   • Network: http://0.0.0.0:5173"
echo ""
echo "👤 Comptes de test disponibles:"
echo "   • Admin:      admin@notecibolt.com / admin123"
echo "   • Enseignant: teacher@notecibolt.com / teacher123"
echo "   • Étudiant:   student@notecibolt.com / student123"
echo "   • Parent:     parent@notecibolt.com / parent123"
echo "   • Superviseur: supervisor@notecibolt.com / supervisor123"
echo ""
echo "⚡ Hot reload activé - L'application se recharge automatiquement"
echo "🛑 Appuyez sur Ctrl+C pour arrêter"
echo ""

# Démarrer Vite
npm run dev