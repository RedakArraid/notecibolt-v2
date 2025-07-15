# 🐳 Guide de démarrage NoteCibolt v2 avec Docker

## 🎯 Options de démarrage

### Option 1 : Stack complète avec Docker Compose (Recommandé)
Démarre tous les services (frontend, backend, base de données, etc.)

```bash
cd notecibolt-v2
chmod +x scripts/*.sh
./scripts/start-docker.sh
```

**Services inclus :**
- ✅ Frontend React (port 5173)
- ✅ Backend API Node.js (port 3001)
- ✅ PostgreSQL (port 5433)
- ✅ Redis (port 6379)
- ✅ MailPit (port 8025)
- ✅ Adminer (port 8080)

### Option 2 : Services uniquement + Frontend en développement
Démarre les services Docker + frontend en mode dev local

```bash
# Terminal 1 : Démarrer les services
./scripts/start-services.sh

# Terminal 2 : Démarrer le frontend en développement
cd frontend
npm install
npm run dev
```

**Avantages :**
- Hot reload plus rapide pour le frontend
- Debugging plus facile
- Modification du code en temps réel

### Option 3 : Frontend uniquement (mode mocké)
Frontend seul avec comptes de démonstration

```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration Docker actuelle

### Services disponibles

| Service | Container | Port Local | Port Interne | Description |
|---------|-----------|------------|--------------|-------------|
| Frontend | `notecibolt_frontend` | 5173 | 5173 | Interface React + Vite |
| Backend | `notecibolt_backend` | 3001 | 3001 | API Node.js + Express |
| PostgreSQL | `notecibolt_postgres` | 5433 | 5432 | Base de données |
| Redis | `notecibolt_redis` | 6379 | 6379 | Cache mémoire |
| MailPit | `notecibolt_mailpit` | 8025 | 8025 | Interface emails |
| Adminer | `notecibolt_adminer` | 8080 | 8080 | Gestion BDD |

### Variables d'environnement

**Backend :**
```bash
NODE_ENV=development
DATABASE_URL=postgresql://notecibolt_user:notecibolt_password@postgres:5432/notecibolt_db
REDIS_URL=redis://redis:6379
JWT_SECRET=super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:5173
```

**Frontend :**
```bash
VITE_API_URL=http://localhost:3001/api/v1
VITE_WS_URL=ws://localhost:3002
VITE_DOCKER_MODE=true
```

## 🧪 Test de l'intégration

### 1. Vérifier les services
```bash
# Statut des conteneurs
docker-compose ps

# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs frontend
docker-compose logs backend
```

### 2. Test de connectivité

**Frontend :** http://localhost:5173
- Interface de connexion avec comptes démo
- Indicateur de statut API en temps réel
- Mode fallback si backend indisponible

**Backend API :** http://localhost:3001/api/v1/health
- Endpoint de santé de l'API
- Test de connectivité base de données

**Adminer :** http://localhost:8080
- Interface de gestion PostgreSQL
- Connexion : `postgres:5432`, `notecibolt_user`, `notecibolt_password`

### 3. Comptes de test
```
👤 Admin:      admin@notecibolt.com / admin123
👨‍🏫 Enseignant: teacher@notecibolt.com / teacher123
👨‍🎓 Étudiant:   student@notecibolt.com / student123
👨‍👩‍👧 Parent:     parent@notecibolt.com / parent123
👮 Superviseur: supervisor@notecibolt.com / supervisor123
```

## 🔄 Système de fallback

Le frontend implémente un **système de fallback intelligent** :

1. **Tentative de connexion à l'API** Docker backend
2. **Si échec** : Basculement automatique vers les comptes mockés
3. **Indicateur visuel** du mode de fonctionnement
4. **Test de reconnexion** disponible via l'interface

### Avantages du fallback
- ✅ **Développement continu** même sans backend
- ✅ **Tests indépendants** du frontend
- ✅ **Démonstration** toujours fonctionnelle
- ✅ **Transition transparente** vers l'API réelle

## 🛠️ Commandes utiles

### Gestion Docker
```bash
# Arrêter tous les services
docker-compose down

# Reconstruire les images
docker-compose up --build

# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart frontend

# Shell dans un conteneur
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Développement
```bash
# Mode développement frontend seul
cd frontend && npm run dev

# Build production
cd frontend && npm run build

# Tests TypeScript
cd frontend && npx tsc --noEmit

# Linting
cd frontend && npm run lint
```

### Nettoyage
```bash
# Supprimer les conteneurs et volumes
docker-compose down -v

# Nettoyer les images
docker system prune -a

# Supprimer les volumes Docker
docker volume prune
```

## 🐛 Résolution de problèmes

### Port déjà utilisé
```bash
# Vérifier les ports utilisés
lsof -i :5173
lsof -i :3001
lsof -i :5433

# Modifier les ports dans docker-compose.yml si nécessaire
```

### Problème de build
```bash
# Forcer la reconstruction
docker-compose up --build --force-recreate

# Supprimer les volumes et reconstruire
docker-compose down -v
docker-compose up --build
```

### Backend non disponible
Le frontend basculera automatiquement en mode mocké. Vérifiez :
1. Le conteneur backend est démarré : `docker-compose ps`
2. Les logs backend : `docker-compose logs backend`
3. La connectivité réseau : `docker network ls`

### Base de données
```bash
# Connexion PostgreSQL directe
docker-compose exec postgres psql -U notecibolt_user -d notecibolt_db

# Reset de la base de données
docker-compose down -v
docker-compose up
```

## 📊 Monitoring

### Health checks
Tous les services ont des health checks configurés :
- PostgreSQL : `pg_isready`
- Redis : `redis-cli ping`
- Backend : endpoint `/health`

### Logs structurés
Les logs incluent :
- Timestamps
- Niveaux de log
- Services identifiés
- Requêtes API tracées

## 🚀 Prochaines étapes

1. **Tester l'intégration complète** Docker
2. **Valider l'authentification** avec l'API backend
3. **Continuer la migration** des dashboards (Phase 4+)
4. **Optimiser les performances** Docker
5. **Ajouter les tests** automatisés

---

**🎉 Votre application NoteCibolt v2 est prête pour le développement avec Docker !**