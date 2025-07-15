import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { EnhancedLoginPage } from '../components/Auth/EnhancedLoginPage';
import { AdminDashboard } from '../components/Admin/AdminDashboard';
import { TeacherDashboard } from '../components/Teacher/TeacherDashboard';
import { ParentDashboard } from '../components/Parent/ParentDashboard';
import { SupervisorDashboard } from '../components/Supervisor/SupervisorDashboard';
import { StudentDashboard } from '../components/Dashboard/StudentDashboard';
import { ProtectedRoute, RoleBasedRedirect } from './ProtectedRoute';

// Composant pour le dashboard étudiant (utilise les composants existants)
const StudentDashboardWrapper: React.FC = () => {
  return <StudentDashboard />;
};

// Composant de layout principal avec Sidebar et Header
const AppLayout: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// Configuration du router
const router = createBrowserRouter([
  {
    path: '/login',
    element: <EnhancedLoginPage />
  },
  {
    path: '/',
    element: <RoleBasedRedirect />
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Routes Admin
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/students',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Gestion des élèves</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Module de gestion des élèves - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/teachers',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Gestion des enseignants</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Module de gestion des enseignants - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/finance',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Gestion financière</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Module de gestion financière - À implémenter en Phase 8
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/reports',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Rapports et analytiques</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Module de rapports - À implémenter en Phase 8
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      
      // Routes Teacher
      {
        path: '/teacher',
        element: (
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/teacher/grades',
        element: (
          <ProtectedRoute allowedRoles={['teacher']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Gestion des notes</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Module de saisie et gestion des notes - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/teacher/assignments',
        element: (
          <ProtectedRoute allowedRoles={['teacher']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Gestion des devoirs</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Module de création et gestion des devoirs - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/teacher/attendance',
        element: (
          <ProtectedRoute allowedRoles={['teacher']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Gestion des présences</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Module de prise de présences - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/teacher/schedule',
        element: (
          <ProtectedRoute allowedRoles={['teacher']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Emploi du temps</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Module d'emploi du temps - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      
      // Routes Student
      {
        path: '/student',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboardWrapper />
          </ProtectedRoute>
        )
      },
      {
        path: '/student/grades',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Mes notes</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Consultation détaillée des notes - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/student/assignments',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Mes devoirs</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Consultation et soumission des devoirs - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/student/schedule',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Mon emploi du temps</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Consultation de l'emploi du temps - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/student/achievements',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Mes réussites</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Badges et réussites - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      
      // Routes Parent
      {
        path: '/parent',
        element: (
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/parent/grades',
        element: (
          <ProtectedRoute allowedRoles={['parent']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Notes des enfants</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Consultation détaillée des notes des enfants - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/parent/attendance',
        element: (
          <ProtectedRoute allowedRoles={['parent']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Présences des enfants</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Suivi des présences et absences des enfants - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/parent/finance',
        element: (
          <ProtectedRoute allowedRoles={['parent']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Finances scolaires</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Gestion des paiements et factures - À implémenter en Phase 8
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      
      // Routes Supervisor
      {
        path: '/supervisor',
        element: (
          <ProtectedRoute allowedRoles={['supervisor']}>
            <SupervisorDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/supervisor/incidents',
        element: (
          <ProtectedRoute allowedRoles={['supervisor']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Gestion des incidents</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Gestion détaillée des incidents - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/supervisor/attendance',
        element: (
          <ProtectedRoute allowedRoles={['supervisor']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Contrôle des présences</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Surveillance générale des présences - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      
      // Routes communes
      {
        path: '/messages',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent', 'supervisor']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Messages</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Système de messagerie interne - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent', 'supervisor']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Mon profil</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Gestion du profil utilisateur - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'parent', 'supervisor']}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                  Configuration et préférences - À implémenter en Phase 7
                </p>
              </div>
            </div>
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Page non trouvée</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
