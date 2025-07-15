# 🤖 Guide IA - Intégration Frontend NoteCibolt → NoteCibolt-v2

## 📋 Instructions pour Assistant IA

**Contexte** : Vous devez intégrer le frontend complet de NoteCibolt dans l'architecture NoteCibolt-v2 en suivant exactement ces étapes séquentielles.

**Règles strictes** :
- ✅ Suivre l'ordre exact des étapes
- ✅ Valider chaque étape avant de passer à la suivante
- ✅ Créer les fichiers avec le contenu exact spécifié
- ✅ Tester chaque modification
- ✅ Documenter chaque problème rencontré

---

## 🎯 PHASE 0 : PRÉPARATION ENVIRONNEMENT

### Étape 0.1 : Mise à jour package.json frontend

**Fichier** : `notecibolt-v2/frontend/package.json`

**Action** : Remplacer le contenu par :

```json
{
  "name": "notecibolt-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.344.0",
    "axios": "^1.6.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "recharts": "^2.8.0",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "vitest": "^1.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6"
  }
}
```

**Validation** :
```bash
cd notecibolt-v2/frontend
npm install
# Vérifier qu'il n'y a pas d'erreurs
```

### Étape 0.2 : Configuration Tailwind CSS

**Fichier** : `notecibolt-v2/frontend/tailwind.config.js`

**Action** : Créer le fichier avec :

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
```

**Fichier** : `notecibolt-v2/frontend/postcss.config.js`

**Action** : Créer le fichier avec :

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Étape 0.3 : Structure des dossiers

**Action** : Créer la structure suivante dans `notecibolt-v2/frontend/src/` :

```bash
mkdir -p src/components/{Auth,Dashboard,Layout,Admin,Teacher,Student,Parent,Supervisor}
mkdir -p src/components/{Messages,Attendance,Schedule,Finance,Reports,Admissions}
mkdir -p src/components/{LearningResources,VirtualClasses,Achievements,Demo}
mkdir -p src/{types,services,hooks,utils,data,styles}
```

**Validation** :
```bash
ls -la src/
# Vérifier que tous les dossiers sont créés
```

---

## 🏗️ PHASE 1 : TYPES ET INFRASTRUCTURE

### Étape 1.1 : Migration des types TypeScript

**Fichier** : `notecibolt-v2/frontend/src/types/index.ts`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/types/index.ts`

**Fichier** : `notecibolt-v2/frontend/src/types/api.ts`

**Action** : Créer avec le contenu :

```typescript
// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  success: false;
  message: string;
  errors: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'supervisor';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Validation** :
```bash
npx tsc --noEmit
# Vérifier qu'il n'y a pas d'erreurs TypeScript
```

### Étape 1.2 : Service d'authentification

**Fichier** : `notecibolt-v2/frontend/src/services/authService.ts`

**Action** : Créer avec le contenu :

```typescript
import { ApiResponse, LoginRequest, LoginResponse, User } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

class AuthService {
  private readonly TOKEN_KEY = 'notecibolt_token';
  private readonly REFRESH_TOKEN_KEY = 'notecibolt_refresh_token';
  private readonly USER_KEY = 'notecibolt_user';

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password } as LoginRequest),
    });

    if (!response.ok) {
      throw new Error('Échec de la connexion');
    }

    const data: ApiResponse<LoginResponse> = await response.json();
    
    if (data.success) {
      this.setTokens(data.data.accessToken, data.data.refreshToken);
      this.setCurrentUser(data.data.user);
      return data.data;
    } else {
      throw new Error(data.message || 'Erreur de connexion');
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

export const authService = new AuthService();
```

### Étape 1.3 : Hook d'authentification

**Fichier** : `notecibolt-v2/frontend/src/hooks/useAuth.ts`

**Action** : Créer avec le contenu :

```typescript
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: authService.isAuthenticated(),
    login,
    logout,
  };
};
```

**Validation** :
```bash
npx tsc --noEmit
npm run dev
# Vérifier que l'application démarre sans erreur
```

---

## 🔐 PHASE 2 : AUTHENTIFICATION

### Étape 2.1 : Composant LoginPage basique

**Fichier** : `notecibolt-v2/frontend/src/components/Auth/LoginPage.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Auth/LoginPage.tsx`

**Adaptations nécessaires** :
1. Remplacer les imports relatifs :
   - `../../types` → `../../types`
   - `../../services` → `../../services`
   - `../../hooks` → `../../hooks`

### Étape 2.2 : Composant EnhancedLoginPage

**Fichier** : `notecibolt-v2/frontend/src/components/Auth/EnhancedLoginPage.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Auth/EnhancedLoginPage.tsx`

**Adaptations nécessaires** :
1. Remplacer les imports relatifs
2. Adapter la fonction de login pour utiliser le nouveau authService

### Étape 2.3 : Composant UserProfile

**Fichier** : `notecibolt-v2/frontend/src/components/Auth/UserProfile.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Auth/UserProfile.tsx`

**Validation** :
```bash
npm run dev
# Aller sur http://localhost:5173
# Vérifier que la page de login s'affiche correctement
```

---

## 📱 PHASE 3 : LAYOUT DE BASE

### Étape 3.1 : Composant Header

**Fichier** : `notecibolt-v2/frontend/src/components/Layout/Header.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Layout/Header.tsx`

**Adaptations** :
- Adapter les imports
- S'assurer que les props correspondent

### Étape 3.2 : Composant Sidebar

**Fichier** : `notecibolt-v2/frontend/src/components/Layout/Sidebar.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Layout/Sidebar.tsx`

**Adaptations** :
- Adapter les imports
- Vérifier la logique de navigation

### Étape 3.3 : Migration des données mock temporaires

**Fichier** : `notecibolt-v2/frontend/src/data/mockData.ts`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/data/mockData.ts`

**Validation** :
```bash
npx tsc --noEmit
# Vérifier qu'il n'y a pas d'erreurs de compilation
```

---

## 📊 PHASE 4 : DASHBOARD DE BASE

### Étape 4.1 : Composant StatCard

**Fichier** : `notecibolt-v2/frontend/src/components/Dashboard/StatCard.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Dashboard/StatCard.tsx`

### Étape 4.2 : Composant RecentGrades

**Fichier** : `notecibolt-v2/frontend/src/components/Dashboard/RecentGrades.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Dashboard/RecentGrades.tsx`

### Étape 4.3 : Composant UpcomingAssignments

**Fichier** : `notecibolt-v2/frontend/src/components/Dashboard/UpcomingAssignments.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Dashboard/UpcomingAssignments.tsx`

### Étape 4.4 : Composant SubjectOverview

**Fichier** : `notecibolt-v2/frontend/src/components/Dashboard/SubjectOverview.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Dashboard/SubjectOverview.tsx`

**Validation** :
```bash
npm run dev
# Vérifier que les composants Dashboard s'affichent correctement
```

---

## 👑 PHASE 5 : DASHBOARDS PAR RÔLE

### Étape 5.1 : Admin Dashboard

**Fichier** : `notecibolt-v2/frontend/src/components/Admin/AdminDashboard.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Admin/AdminDashboard.tsx`

**Adaptations** :
- Remplacer tous les imports relatifs
- Vérifier que toutes les icônes lucide-react sont importées

### Étape 5.2 : Teacher Dashboard

**Fichier** : `notecibolt-v2/frontend/src/components/Teacher/TeacherDashboard.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Teacher/TeacherDashboard.tsx`

### Étape 5.3 : Student Dashboard

**Fichier** : `notecibolt-v2/frontend/src/components/Student/StudentDashboard.tsx`

**Action** : Créer un composant simple pour l'étudiant basé sur les composants Dashboard existants

### Étape 5.4 : Parent Dashboard

**Fichier** : `notecibolt-v2/frontend/src/components/Parent/ParentDashboard.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Parent/ParentDashboard.tsx`

### Étape 5.5 : Supervisor Dashboard

**Fichier** : `notecibolt-v2/frontend/src/components/Supervisor/SupervisorDashboard.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Supervisor/SupervisorDashboard.tsx`

**Validation** :
```bash
# Tester chaque rôle en modifiant manuellement le localStorage
localStorage.setItem('notecibolt_user', JSON.stringify({role: 'admin', name: 'Test Admin'}))
# Recharger la page et vérifier que le bon dashboard s'affiche
```

---

## 📋 PHASE 6 : APP PRINCIPAL

### Étape 6.1 : Migration de App.tsx

**Fichier** : `notecibolt-v2/frontend/src/App.tsx`

**Action** : Remplacer COMPLÈTEMENT le contenu actuel par le contenu de `notecibolt/src/App.tsx`

**Adaptations critiques** :
1. Remplacer tous les imports relatifs
2. Adapter la logique d'authentification pour utiliser useAuth
3. S'assurer que tous les composants importés existent

**Template de base** :
```typescript
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { EnhancedLoginPage } from './components/Auth/EnhancedLoginPage';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';
import { ParentDashboard } from './components/Parent/ParentDashboard';
import { SupervisorDashboard } from './components/Supervisor/SupervisorDashboard';
// ... autres imports

function App() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <EnhancedLoginPage onLogin={login} />;
  }

  // Logique de rendu basée sur le rôle et l'onglet actif
  const renderContent = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      // ... autres cas
      default:
        return <div>Rôle non reconnu</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={user?.role || 'student'}
          onLogout={logout}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onMenuClick={() => setSidebarOpen(true)} 
            currentUser={user}
            onLogout={logout}
          />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
```

### Étape 6.2 : Mise à jour des styles globaux

**Fichier** : `notecibolt-v2/frontend/src/index.css`

**Action** : Remplacer par :

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

/* Styles personnalisés pour les composants */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

**Validation** :
```bash
npm run dev
# Tester la connexion avec les identifiants de démo
# Vérifier que chaque rôle affiche le bon dashboard
```

---

## 📚 PHASE 7 : MODULES MÉTIER ESSENTIELS

### Étape 7.1 : Module Messages

**Fichier** : `notecibolt-v2/frontend/src/components/Messages/MessageList.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Messages/MessageList.tsx`

### Étape 7.2 : Module Students

**Fichier** : `notecibolt-v2/frontend/src/components/Students/StudentManagement.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Students/StudentManagement.tsx`

### Étape 7.3 : Module Attendance

**Fichier** : `notecibolt-v2/frontend/src/components/Attendance/AttendanceManagement.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Attendance/AttendanceManagement.tsx`

### Étape 7.4 : Module Schedule

**Fichier** : `notecibolt-v2/frontend/src/components/Schedule/ScheduleManagement.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Schedule/ScheduleManagement.tsx`

**Validation après chaque module** :
```bash
npm run dev
# Tester la navigation vers le nouveau module
# Vérifier qu'il n'y a pas d'erreurs console
# S'assurer que l'interface s'affiche correctement
```

---

## 💰 PHASE 8 : MODULES AVANCÉS

### Étape 8.1 : Module Finance

**Fichier** : `notecibolt-v2/frontend/src/components/Finance/FinanceManagement.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Finance/FinanceManagement.tsx`

### Étape 8.2 : Module Reports

**Fichier** : `notecibolt-v2/frontend/src/components/Reports/ReportsManagement.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Reports/ReportsManagement.tsx`

### Étape 8.3 : Module Learning Resources

**Fichier** : `notecibolt-v2/frontend/src/components/LearningResources/LearningResourcesManagement.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/LearningResources/LearningResourcesManagement.tsx`

---

## 🎓 PHASE 9 : MODULES SPÉCIALISÉS

### Étape 9.1 : Module Admissions (COMPLEXE)

**Ordre de migration** :
1. `AdmissionManagement.tsx`
2. `EnhancedAdmissionManagement.tsx`
3. `CandidatureForm.tsx`
4. `ProspectForm.tsx`
5. `ProspectConversionModal.tsx`
6. `AdmissionWorkflow.tsx`
7. `AdmissionAnalytics.tsx`
8. `AdmissionReports.tsx`
9. `AdmissionCommunication.tsx`
10. `AdmissionCalculator.tsx`

**Fichier de règles** : `notecibolt-v2/frontend/src/data/admissionRules.ts`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/data/admissionRules.ts`

### Étape 9.2 : Module Virtual Classes

**Fichier** : `notecibolt-v2/frontend/src/components/VirtualClasses/VirtualClassesManagement.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/VirtualClasses/VirtualClassesManagement.tsx`

### Étape 9.3 : Module Achievements

**Fichier** : `notecibolt-v2/frontend/src/components/Achievements/AchievementGrid.tsx`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/components/Achievements/AchievementGrid.tsx`

---

## 🎮 PHASE 10 : MODULES DÉMO ET FINALISATION

### Étape 10.1 : Module Demo

**Fichiers à migrer** :
1. `Demo/DemoSelector.tsx`
2. `Demo/AdminDemo.tsx`

### Étape 10.2 : Hooks personnalisés

**Fichier** : `notecibolt-v2/frontend/src/hooks/useTheme.ts`

**Action** : Copier EXACTEMENT le contenu de `notecibolt/src/hooks/useTheme.ts`

### Étape 10.3 : Mise à jour finale App.tsx

**Action** : S'assurer que App.tsx inclut TOUS les composants migrés avec la même logique de navigation que l'original.

---

## ✅ PHASE 11 : VALIDATION FINALE

### Étape 11.1 : Tests de fonctionnement

**Checklist complète** :
- [ ] Login avec chaque rôle (admin, teacher, student, parent, supervisor)
- [ ] Navigation entre tous les onglets
- [ ] Affichage correct de tous les dashboards
- [ ] Fonctionnement de tous les modules
- [ ] Responsive design sur mobile/desktop
- [ ] Mode sombre/clair
- [ ] Déconnexion

### Étape 11.2 : Performance

**Commandes de test** :
```bash
npm run build
npm run preview
# Vérifier que le build se fait sans erreur
# Tester les performances de l'application
```

### Étape 11.3 : Code quality

```bash
npm run lint
npx tsc --noEmit
# Corriger toutes les erreurs trouvées
```

---

## 🚨 PROTOCOLE DE DÉPANNAGE

### Si erreur TypeScript :
1. Vérifier que tous les types sont importés
2. S'assurer que les chemins d'import sont corrects
3. Vérifier que les interfaces correspondent

### Si composant ne s'affiche pas :
1. Vérifier les imports de lucide-react
2. S'assurer que Tailwind CSS est configuré
3. Vérifier la console pour les erreurs

### Si navigation ne fonctionne pas :
1. Vérifier la logique dans App.tsx
2. S'assurer que activeTab est géré correctement
3. Vérifier les props passées à Sidebar

---

## 📊 MÉTRIQUES DE SUCCÈS

### À la fin de chaque phase :
- [ ] Compilation TypeScript sans erreur
- [ ] Application démarre sans erreur console
- [ ] Navigation fonctionne
- [ ] Affichage correct des composants

### Validation finale :
- [ ] 32+ composants migrés
- [ ] Tous les rôles fonctionnels
- [ ] Tous les modules accessibles
- [ ] Performance < 3 secondes de chargement
- [ ] Build production réussi

---

## 💾 SAUVEGARDE ET VERSIONING

### À chaque phase complétée :
```bash
git add .
git commit -m "Phase X: Migration de [composants]"
git push origin feature/frontend-migration
```

### Points de sauvegarde critiques :
- Fin Phase 2 : Authentification
- Fin Phase 4 : Dashboard de base
- Fin Phase 5 : Tous les rôles
- Fin Phase 7 : Modules essentiels
- Fin Phase 11 : Migration complète

---

**Ce guide doit être suivi rigoureusement étape par étape, sans en omettre aucune, pour garantir une intégration réussie et complète du frontend NoteCibolt dans l'architecture NoteCibolt-v2.**