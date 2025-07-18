#!/bin/bash

echo "🧪 Test complet des filtres, pagination et recherche..."
echo ""

cd /Users/kader/Desktop/projet-en-cours/notecibolt-v2

# Rendre les scripts exécutables
chmod +x *.sh

echo "1️⃣ Vérification de la base de données..."
cd backend

# S'assurer que la base est initialisée
echo "📦 Installation des dépendances..."
npm install --silent

echo "🗄️ Génération du client Prisma..."
npx prisma generate

echo "🌱 Seeding de la base de données..."
npx prisma db seed

echo "✅ Base de données prête !"
echo ""

# Démarrer le backend
echo "🚀 Démarrage du backend..."
npm run dev &
BACKEND_PID=$!

echo "⏳ Attente du démarrage (15 secondes)..."
sleep 15

echo "🧪 Tests des fonctionnalités..."
echo ""

echo "🔍 Test 1: Pagination basique"
echo "Page 1, 5 résultats:"
curl -s "http://localhost:3001/api/v1/students?page=1&limit=5" | jq '.data | {totalCount: .totalCount, currentPage: .currentPage, studentsReturned: (.students | length)}'
echo ""

echo "Page 2, 5 résultats:"
curl -s "http://localhost:3001/api/v1/students?page=2&limit=5" | jq '.data | {totalCount: .totalCount, currentPage: .currentPage, studentsReturned: (.students | length)}'
echo ""

echo "🔍 Test 2: Recherche par nom"
echo "Recherche 'Diop':"
curl -s "http://localhost:3001/api/v1/students?search=Diop&limit=3" | jq '.data.students[] | {name: .name, email: .email}'
echo ""

echo "🔍 Test 3: Filtre par statut"
echo "Seulement les actifs:"
curl -s "http://localhost:3001/api/v1/students?isActive=true&limit=3" | jq '.data.students[] | {name: .name, isActive: .isActive}'
echo ""

echo "🔍 Test 4: Tri par nom (descendant)"
echo "Tri Z->A:"
curl -s "http://localhost:3001/api/v1/students?sortBy=name&sortOrder=desc&limit=3" | jq '.data.students[] | {name: .name}'
echo ""

echo "🔍 Test 5: Recherche avancée"
echo "Recherche d'étudiants avec 'Ba':"
curl -s "http://localhost:3001/api/v1/students/search?q=Ba" | jq '.data[] | {name: .name, studentId: .studentId}'
echo ""

echo "🔍 Test 6: Classes disponibles"
echo "Classes avec nombre d'étudiants:"
curl -s "http://localhost:3001/api/v1/students/classes" | jq '.data[] | {name: .name, level: .level, currentCount: .currentCount, capacity: .capacity}'
echo ""

echo "🔍 Test 7: Filtre par classe"
# Récupérer l'ID de la première classe
CLASS_ID=$(curl -s "http://localhost:3001/api/v1/students/classes" | jq -r '.data[0].id // empty')
if [ ! -z "$CLASS_ID" ]; then
    echo "Test avec classe ID: $CLASS_ID"
    curl -s "http://localhost:3001/api/v1/students?classId=$CLASS_ID&limit=3" | jq '.data.students[] | {name: .name, class: .class.name}'
else
    echo "❌ Aucune classe trouvée"
fi
echo ""

echo "🔍 Test 8: Statistiques générales"
curl -s "http://localhost:3001/api/v1/students/stats" | jq '.data'
echo ""

echo "🔍 Test 9: Combinaison de filtres"
echo "Recherche 'a' + tri par nom + page 1:"
curl -s "http://localhost:3001/api/v1/students?search=a&sortBy=name&sortOrder=asc&page=1&limit=2" | jq '.data.students[] | {name: .name}'
echo ""

echo "🔍 Test 10: Métadonnées de pagination"
echo "Informations de pagination complètes:"
curl -s "http://localhost:3001/api/v1/students?page=2&limit=10" | jq '.data | {totalCount: .totalCount, totalPages: .totalPages, currentPage: .currentPage, hasMore: .hasMore, studentsCount: (.students | length)}'
echo ""

# Arrêter le backend
kill $BACKEND_PID

echo "✅ Tests terminés !"
echo ""
echo "📋 Résumé des tests:"
echo "✓ Pagination avec page et limit"
echo "✓ Recherche par nom/email/studentId"
echo "✓ Filtre par statut actif/inactif"
echo "✓ Tri par nom (asc/desc)"
echo "✓ Recherche avancée avec endpoint /search"
echo "✓ Liste des classes disponibles"
echo "✓ Filtre par classe"
echo "✓ Statistiques générales"
echo "✓ Combinaison de filtres"
echo "✓ Métadonnées de pagination"
echo ""
echo "🎯 Si tous les tests montrent des données, la correction est réussie !"
echo "🚀 Maintenant, démarrez l'application avec: ./start-with-real-data.sh"