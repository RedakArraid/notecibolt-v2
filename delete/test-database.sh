#!/bin/bash

echo "🔧 Test rapide de la connexion à la base de données..."

cd /Users/kader/Desktop/projet-en-cours/notecibolt-v2/backend

echo "🗄️ Génération du client Prisma..."
npx prisma generate

echo "🌱 Seeding de la base de données..."
npx prisma db seed

echo "📊 Vérification des données créées..."
echo ""

# Démarrer le backend temporairement pour tester l'API
echo "🎯 Démarrage temporaire du backend..."
npm run dev &
BACKEND_PID=$!

echo "⏳ Attente du démarrage (10 secondes)..."
sleep 10

echo "🧪 Test de l'API students..."
echo ""

# Test de l'endpoint des statistiques
echo "📈 Test des statistiques :"
curl -s http://localhost:3001/api/v1/students/stats | jq .

echo ""
echo "👥 Test de la liste des étudiants (5 premiers) :"
curl -s "http://localhost:3001/api/v1/students?limit=5" | jq .

echo ""
echo "🏫 Test des classes disponibles :"
curl -s http://localhost:3001/api/v1/students/classes | jq .

echo ""
echo "✅ Tests terminés !"

# Arrêter le backend
kill $BACKEND_PID

echo ""
echo "🎉 La base de données est prête avec les vraies données !"
echo "Utilisez maintenant : ./start-with-real-data.sh"