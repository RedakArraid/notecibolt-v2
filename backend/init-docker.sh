#!/bin/sh

echo "🚀 Initialisation du backend NoteCibolt v2 dans Docker"

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente de PostgreSQL..."
until nc -z postgres 5432; do
  echo "PostgreSQL pas encore prêt, attente..."
  sleep 2
done
echo "✅ PostgreSQL prêt"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.installed" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    touch node_modules/.installed
fi

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Appliquer les migrations
echo "🗄️ Application des migrations..."
npx prisma migrate deploy 2>/dev/null || {
    echo "Migration échouée, tentative de push..."
    npx prisma db push --force-reset
}

# Seeder la base de données si elle est vide (mode développement uniquement)
echo "🌱 Vérification du seeding..."
if [ "$NODE_ENV" = "development" ]; then
    echo "Mode développement détecté, seeding des données..."
    npx prisma db seed 2>/dev/null || {
        echo "⚠️ Seeding échoué, mais on continue..."
    }
else
    echo "Mode production, seeding ignoré"
fi

echo "✅ Initialisation terminée, démarrage du serveur..."

# Démarrer le serveur avec gestion d'erreurs améliorée
exec nodemon --watch src --ext ts --exec "ts-node --transpile-only -r tsconfig-paths/register src/app.ts"
