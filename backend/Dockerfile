# Dockerfile pour le backend NoteCibolt
FROM node:18-alpine

# Installer les dépendances système nécessaires
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl \
    dumb-init

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances (utilise npm install au lieu de npm ci pour plus de flexibilité)
RUN npm install --production=false

# Copier le reste du code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Créer les dossiers nécessaires
RUN mkdir -p uploads logs

# Compiler TypeScript pour la production
RUN npm run build

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S notecibolt -u 1001 -G nodejs

# Changer la propriété des fichiers
RUN chown -R notecibolt:nodejs /app

# Basculer vers l'utilisateur non-root
USER notecibolt

# Exposer le port
EXPOSE 3001

# Définir les variables d'environnement par défaut
ENV NODE_ENV=development
ENV PORT=3001

# Utiliser dumb-init pour gérer les signaux
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage (mode développement)
CMD ["npm", "run", "dev"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1
