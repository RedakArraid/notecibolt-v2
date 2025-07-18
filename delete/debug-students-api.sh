#!/bin/bash

echo "🔍 Test de debugging des filtres API Students..."
echo ""

# Démarrer le backend en arrière-plan
cd /Users/kader/Desktop/projet-en-cours/notecibolt-v2/backend
npm run dev &
BACKEND_PID=$!

echo "⏳ Attente du démarrage du backend (10 secondes)..."
sleep 10

echo "🧪 Tests des différents endpoints..."
echo ""

echo "1️⃣ Test basique - Tous les étudiants (page 1, limit 3) :"
curl -s "http://localhost:3001/api/v1/students?page=1&limit=3" | jq '.data.students[] | {name: .name, email: .email, studentId: .studentId, class: .class.name}'
echo ""

echo "2️⃣ Test pagination - Page 2 :"
curl -s "http://localhost:3001/api/v1/students?page=2&limit=3" | jq '.data.students[] | {name: .name, email: .email, studentId: .studentId}'
echo ""

echo "3️⃣ Test recherche - Recherche 'Fatou' :"
curl -s "http://localhost:3001/api/v1/students?search=Fatou&limit=5" | jq '.data.students[] | {name: .name, email: .email, studentId: .studentId}'
echo ""

echo "4️⃣ Test filtre actif - Seulement les actifs :"
curl -s "http://localhost:3001/api/v1/students?isActive=true&limit=3" | jq '.data.students[] | {name: .name, isActive: .isActive}'
echo ""

echo "5️⃣ Test statistiques :"
curl -s "http://localhost:3001/api/v1/students/stats" | jq '.data'
echo ""

echo "6️⃣ Test classes disponibles :"
curl -s "http://localhost:3001/api/v1/students/classes" | jq '.data[] | {id: .id, name: .name, currentCount: .currentCount}'
echo ""

echo "7️⃣ Test recherche avancée :"
curl -s "http://localhost:3001/api/v1/students/search?q=Diop" | jq '.data[] | {name: .name, email: .email}'
echo ""

echo "8️⃣ Test tri par nom descendant :"
curl -s "http://localhost:3001/api/v1/students?sortBy=name&sortOrder=desc&limit=3" | jq '.data.students[] | {name: .name}'
echo ""

echo "9️⃣ Test filtre par classe (si des classes existent) :"
# D'abord récupérer l'ID d'une classe
CLASS_ID=$(curl -s "http://localhost:3001/api/v1/students/classes" | jq -r '.data[0].id // empty')
if [ ! -z "$CLASS_ID" ]; then
    echo "Classe testée: $CLASS_ID"
    curl -s "http://localhost:3001/api/v1/students?classId=$CLASS_ID&limit=3" | jq '.data.students[] | {name: .name, class: .class.name}'
else
    echo "Aucune classe trouvée pour le test"
fi
echo ""

echo "🔟 Test métadonnées de pagination :"
curl -s "http://localhost:3001/api/v1/students?page=1&limit=5" | jq '.data | {totalCount: .totalCount, totalPages: .totalPages, currentPage: .currentPage, hasMore: .hasMore}'
echo ""

# Arrêter le backend
kill $BACKEND_PID

echo "✅ Tests terminés !"
echo ""
echo "Si vous voyez des erreurs ou des données vides, cela indique un problème avec :"
echo "- Les données de la base (exécuter: npx prisma db seed)"
echo "- Les filtres/requêtes Prisma"
echo "- La structure des données"