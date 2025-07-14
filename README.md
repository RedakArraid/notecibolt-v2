# 🎓 NoteCibolt v2 - Système de Gestion Scolaire

## 📋 Vue d'ensemble

**NoteCibolt v2** est une plateforme complète de gestion scolaire moderne, développée avec une architecture modulaire séparant le backend et le frontend. Le système offre une solution intégrée pour la gestion des élèves, enseignants, parents et administration.

## ✨ Fonctionnalités principales

### 👤 Gestion des utilisateurs
- **Élèves** : Profils complets, suivi académique, badges de réussite
- **Enseignants** : Gestion des classes, création de devoirs, suivi des notes
- **Parents** : Accès aux informations de leurs enfants, communication avec l'école
- **Administrateurs** : Gestion complète de l'établissement

### 📚 Module académique
- **Notes et évaluations** : Système de notation avec évaluation par compétences
- **Devoirs et projets** : Création, distribution et correction en ligne
- **Emploi du temps** : Planning interactif pour classes et enseignants
- **Matières et programmes** : Gestion des curricula et compétences

### 🎯 Fonctionnalités avancées
- **Présences** : Pointage électronique avec notifications automatiques
- **Admissions** : Processus de candidature et workflow personnalisable
- **Finance** : Gestion des frais de scolarité et paiements
- **Communication** : Messagerie interne et notifications
- **Rapports** : Tableaux de bord et analyses détaillées
- **Classes virtuelles** : Intégration de visioconférence
- **Ressources pédagogiques** : Bibliothèque de contenus numériques

## 🏗️ Architecture technique

### Backend
- **Framework** : Node.js + Express + TypeScript
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : JWT + bcrypt
- **API** : RESTful avec documentation Swagger
- **Temps réel** : WebSocket (Socket.io)
- **Email** : Nodemailer avec templates HTML

### Frontend
- **Framework** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS
- **État** : Zustand
- **Formulaires** : React Hook Form + Zod
- **HTTP** : Axios
- **Charts** : Recharts

## 🚀 Installation rapide

### Avec Docker (Recommandé)
```bash
# Cloner le projet
git clone <repository-url>
cd notecibolt-v2

# Démarrer l'installation automatique
chmod +x scripts/setup.sh
./scripts/setup.sh

# Ou directement avec Docker
docker-compose up -d
```

### Installation locale
```bash
# Backend
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

## 🌐 Accès à l'application

Une fois installé, accédez à :
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3001
- **Base de données** : http://localhost:8080 (Adminer)
- **Emails de test** : http://localhost:8025 (MailHog)

## 👤 Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@notecibolt.com | admin123 |
| Enseignant | teacher@notecibolt.com | teacher123 |
| Élève | student@notecibolt.com | student123 |
| Parent | parent@notecibolt.com | parent123 |

## 📁 Structure du projet

```
notecibolt-v2/
├── 📁 backend/           # API Node.js + Express + Prisma
├── 📁 frontend/          # Interface React + TypeScript + Vite
├── 📁 shared/            # Types partagés
├── 📁 docs/              # Documentation
├── 📁 scripts/           # Scripts utilitaires
└── 📄 docker-compose.yml # Configuration Docker
```

## 🔌 API Endpoints principaux

```http
# Authentification
POST /api/v1/auth/login
POST /api/v1/auth/register
GET  /api/v1/auth/me

# Utilisateurs
GET  /api/v1/users
GET  /api/v1/students
GET  /api/v1/teachers
GET  /api/v1/parents

# Académique
GET  /api/v1/grades
POST /api/v1/assignments
GET  /api/v1/attendance
GET  /api/v1/schedule

# Communication
GET  /api/v1/messages
POST /api/v1/notifications

# Finance
GET  /api/v1/finance/records
POST /api/v1/finance/payments
```

## 🛠️ Développement

### Commandes utiles

```bash
# Backend
npm run dev              # Serveur de développement
npm run build            # Build pour production
npm run test             # Tests
npm run prisma:studio    # Interface graphique DB

# Frontend
npm run dev              # Serveur de développement
npm run build            # Build pour production
npm run preview          # Prévisualiser le build

# Docker
docker-compose up -d     # Démarrer tous les services
docker-compose logs -f   # Voir les logs
docker-compose down      # Arrêter les services
```

### Tests
- **Backend** : Jest + Supertest
- **Frontend** : Vitest + Testing Library
- **E2E** : Playwright (à venir)

## 📊 Fonctionnalités métier détaillées

### Module Notes & Évaluations
- Système de notation flexible (sur 20, pourcentages, lettres)
- Évaluation par compétences avec niveaux
- Moyennes automatiques pondérées
- Bulletins générés automatiquement
- Historique complet des évaluations

### Module Présences
- Pointage électronique par l'enseignant
- Notifications automatiques aux parents
- Justificatifs d'absence numériques
- Rapports de présence détaillés
- Statistiques par classe/élève

### Module Communication
- Messagerie interne sécurisée
- Notifications push et email
- Carnets de liaison numériques
- Annonces de l'administration
- Communication parents-enseignants

### Module Finance
- Facturation automatique des frais
- Suivi des paiements en temps réel
- Échéanciers personnalisés
- Relances automatiques
- Rapports financiers

## 🔒 Sécurité

- **Authentification JWT** avec tokens courts et de rafraîchissement
- **Hashage des mots de passe** avec bcrypt (12 rounds)
- **Rate limiting** : 100 requêtes/15min par IP
- **Validation** stricte de toutes les entrées
- **CORS** configuré pour les origines autorisées
- **Headers de sécurité** avec Helmet

## 📈 Performance

- **Cache Redis** pour les données fréquentes
- **Pagination** automatique des listes
- **Optimisation** des requêtes Prisma
- **Compression** des réponses HTTP
- **Code splitting** avec Vite

## 🔧 Configuration

### Variables d'environnement Backend
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/notecibolt"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
EMAIL_HOST="smtp.gmail.com"
SCHOOL_NAME="École NoteCibolt"
```

### Variables d'environnement Frontend
```bash
VITE_API_URL="http://localhost:3001/api/v1"
VITE_WS_URL="ws://localhost:3002"
VITE_APP_NAME="NoteCibolt"
```

## 📚 Documentation

- [Documentation API complète](docs/API.md)
- [Guide de déploiement](docs/DEPLOYMENT.md)
- [Manuel utilisateur](docs/USER_GUIDE.md)
- [Guide développeur](docs/DEVELOPER.md)

## 🤝 Contribution

1. Fork du repository
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit des changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- **Issues** : GitHub Issues pour les bugs
- **Discussions** : GitHub Discussions pour les questions
- **Email** : support@notecibolt.com

---

<div align="center">

**🎓 NoteCibolt v2 - L'avenir de l'éducation numérique**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/notecibolt/v2)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)](https://www.typescriptlang.org/)

</div>
