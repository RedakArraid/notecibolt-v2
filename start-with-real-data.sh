#!/bin/bash

echo "🚀 Configuration de NoteCibolt v2 avec base de données..."

# Aller dans le répertoire backend
cd /Users/kader/Desktop/projet-en-cours/notecibolt-v2/backend

echo "📦 Installation des dépendances backend..."
npm install

echo "🗄️ Génération du client Prisma..."
npx prisma generate

echo "🔧 Application des migrations..."
npx prisma migrate dev --name init

echo "🌱 Seeding de la base de données avec 856 élèves..."
npx prisma db seed

echo "✅ Backend configuré avec succès !"
echo ""
echo "🎯 Démarrage du serveur backend..."
npm run dev &

echo "⏳ Attente du démarrage du backend (5 secondes)..."
sleep 5

# Aller dans le répertoire frontend
cd ../frontend

echo "📦 Installation des dépendances frontend..."
npm install

echo "🎯 Démarrage du serveur frontend..."
npm run dev &

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📍 Accès à l'application :"
echo "   🌐 Frontend : http://localhost:5173"
echo "   🔌 Backend  : http://localhost:3001"
echo "   📊 Health   : http://localhost:3001/health"
echo ""
echo "🔐 Comptes de test disponibles :"
echo "   👤 Admin      : admin@notecibolt.com / admin123"
echo "   👨‍🏫 Enseignant : teacher@notecibolt.com / teacher123"
echo "   🎓 Étudiant   : student@notecibolt.com / student123"
echo "   👪 Parent     : parent@notecibolt.com / parent123"
echo ""
echo "🎉 L'interface de gestion des élèves affiche maintenant les 856 vrais élèves de la BDD !"
echo ""
echo "Pour arrêter les serveurs, utilisez Ctrl+C"

# Garder le script ouvert
wait