import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { EnhancedLoginPage } from '../components/Auth/EnhancedLoginPage';
import { ErrorBoundary } from '../components/Error/ErrorBoundary';
import { PageLoading, DashboardSkeleton } from '../components/Loading/LoadingComponents';
import { ProtectedRoute, RoleBasedRedirect } from './ProtectedRoute';

// Lazy loading des dashboards avec ErrorBoundary
import {
  AdminDashboard,
  TeacherDashboard,
  ParentDashboard,
  SupervisorDashboard,
  StudentDashboard
} from '../utils/lazyComponents';

// Composants fallback pour les modules non implémentés
import { ComingSoon } from '../components/Fallback/ComingSoon';
import { MessageList } from '../components/Messages/MessageList';
import { UserManagement } from '../components/Admin/UserManagement';
import { EnhancedAdmissionManagement } from '../components/Admissions/EnhancedAdmissionManagement';
import { FinanceManagement } from '../components/Finance/FinanceManagement';
import { AdminSettings } from '../components/Admin/AdminSettings';
import { ScheduleManagement } from '../components/Schedule/ScheduleManagement';

// Création des composants fallback pour le router
const MessageComingSoon = () => <ComingSoon moduleName="Système de Messagerie" expectedPhase={7} />;
const AttendanceComingSoon = () => <ComingSoon moduleName="Gestion des Présences" expectedPhase={7} />;
const ScheduleComingSoon = () => <ComingSoon moduleName="Emploi du Temps" expectedPhase={7} />;
const FinanceComingSoon = () => <ComingSoon moduleName="Gestion Financière" expectedPhase={8} />;
const ReportsComingSoon = () => <ComingSoon moduleName="Rapports et Analytiques" expectedPhase={8} />;

// Wrapper avec Error Boundary et Suspense pour tous les dashboards
const DashboardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Composant de layout principal avec Sidebar et Header
const AppLayout: React.FC = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
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
            <DashboardWrapper>
              <AdminDashboard />
            </DashboardWrapper>
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/students',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoading />}>
                <div className="p-6">
                  <UserManagement />
                </div>
              </Suspense>
            </ErrorBoundary>
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/teachers',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ErrorBoundary>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Gestion des enseignants</h1>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    Module de gestion des enseignants - À implémenter en Phase 7
                  </p>
                </div>
              </div>
            </ErrorBoundary>
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/finance',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoading />}>
                <div className="p-6">
                  <FinanceManagement />
                </div>
              </Suspense>
            </ErrorBoundary>
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/reports',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ErrorBoundary>
              <ReportsComingSoon />
            </ErrorBoundary>
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/admissions',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoading />}>
                <div className="p-6">
                  <EnhancedAdmissionManagement />
                </div>
              </Suspense>
            </ErrorBoundary>
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/settings',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoading />}>
                <div className="p-6">
                  <AdminSettings />
                </div>
              </Suspense>
            </ErrorBoundary>
          </ProtectedRoute>
        )
      },
      {
        path: '/admin/schedule',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoading />}>
                <div className="p-6">
                  <ScheduleManagement />
                </div>
              </Suspense>
            </ErrorBoundary>
          </ProtectedRoute>
        )
      },
      
      // Routes Teacher
      {
        path: '/teacher',
        element: (
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardWrapper>
              <TeacherDashboard />
            </DashboardWrapper>
          </ProtectedRoute>
        )
      },
      {
        path: '/teacher/grades',
        element: (
          <ProtectedRoute allowedRoles={['teacher']}>
            <ErrorBoundary>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Gestion des notes</h1>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    Module de saisie et gestion des notes - À implémenter en Phase 7
                  </p>
                </div>
              </div>
            </ErrorBoundary>
          </ProtectedRoute>
        )
      },
      {
        path: '/teacher/assignments',
        element: (
          <ProtectedRoute allowedRoles={['teacher']}>
            <ErrorBoundary>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Gestion des devoirs</h1>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    Module de création et gestion des devoirs - À implémenter en Phase 7
                  </p>
                </div>
              </div>
            </ErrorBoundary>
          </ProtectedRoute>
        )
      },
      {
        path: '/teacher/attendance',
        element: (
          <ProtectedRoute allowedRoles={['teacher']}>
            <ErrorBoundary>
              <AttendanceComingSoon />
            </ErrorBoundary>
          </ProtectedRoute>
        )
      },
      {
        path: '/teacher/schedule',
        element: (
          <ProtectedRoute allowedRoles={['teacher']}>
            <ErrorBoundary>
              <ScheduleComingSoon />
            </ErrorBoundary>
          </ProtectedRoute>
        )
      },
      
      // Routes Student
      {
        path: '/student',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardWrapper>
              <StudentDashboard />
            </DashboardWrapper>
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
            <DashboardWrapper>
              <ParentDashboard />
            </DashboardWrapper>
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
            <DashboardWrapper>
              <SupervisorDashboard />
            </DashboardWrapper>
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
            <ErrorBoundary>
              <Suspense fallback={<DashboardSkeleton />}>
                <MessageList />
              </Suspense>
            </ErrorBoundary>
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
