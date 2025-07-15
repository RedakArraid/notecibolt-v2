import React from 'react';
import { lazy } from 'react';

// Lazy loading des dashboards
export const AdminDashboard = lazy(() => 
  import('../components/Admin/AdminDashboard').then(module => ({
    default: module.AdminDashboard
  }))
);

export const TeacherDashboard = lazy(() => 
  import('../components/Teacher/TeacherDashboard').then(module => ({
    default: module.TeacherDashboard
  }))
);

export const StudentDashboard = lazy(() => 
  import('../components/Dashboard/StudentDashboard').then(module => ({
    default: module.StudentDashboard
  }))
);

export const ParentDashboard = lazy(() => 
  import('../components/Parent/ParentDashboard').then(module => ({
    default: module.ParentDashboard
  }))
);

export const SupervisorDashboard = lazy(() => 
  import('../components/Supervisor/SupervisorDashboard').then(module => ({
    default: module.SupervisorDashboard
  }))
);

// Lazy loading des composants de modules métier (Phase 7+)
// Ces composants utilisent directement les fallbacks car les vrais composants
// seront créés en Phase 7
export const MessageList = lazy(() => 
  import('../components/Fallback/ComingSoon').then(module => ({
    default: () => module.MessageComingSoon()
  }))
);

export const StudentManagement = lazy(() => 
  import('../components/Fallback/ComingSoon').then(module => ({
    default: () => module.StudentManagementComingSoon()
  }))
);

export const AttendanceManagement = lazy(() => 
  import('../components/Fallback/ComingSoon').then(module => ({
    default: () => module.AttendanceComingSoon()
  }))
);

export const ScheduleManagement = lazy(() => 
  import('../components/Fallback/ComingSoon').then(module => ({
    default: () => module.ScheduleComingSoon()
  }))
);

export const FinanceManagement = lazy(() => 
  import('../components/Fallback/ComingSoon').then(module => ({
    default: () => module.FinanceComingSoon()
  }))
);

export const ReportsManagement = lazy(() => 
  import('../components/Fallback/ComingSoon').then(module => ({
    default: () => module.ReportsComingSoon()
  }))
);

// Utilitaires de performance
export const preloadComponent = (componentImport: () => Promise<any>) => {
  const componentImportPromise = componentImport();
  return () => componentImportPromise;
};

// Préchargement des composants critiques
export const preloadCriticalComponents = () => {
  try {
    // Précharger les dashboards selon le rôle
    const authData = localStorage.getItem('notecibolt-auth');
    if (!authData) return;
    
    const userRole = JSON.parse(authData).state?.user?.role;
    
    if (userRole === 'admin') {
      preloadComponent(() => import('../components/Admin/AdminDashboard'));
    } else if (userRole === 'teacher') {
      preloadComponent(() => import('../components/Teacher/TeacherDashboard'));
    } else if (userRole === 'parent') {
      preloadComponent(() => import('../components/Parent/ParentDashboard'));
    } else if (userRole === 'supervisor') {
      preloadComponent(() => import('../components/Supervisor/SupervisorDashboard'));
    } else {
      preloadComponent(() => import('../components/Dashboard/StudentDashboard'));
    }
  } catch (error) {
    // Pas d'utilisateur connecté ou erreur de parsing, pas de préchargement
    console.log('No user data for preloading components');
  }
};

// Hook pour lazy loading avec gestion d'erreur
export const useLazyLoad = () => {
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({});
  const [errors, setErrors] = React.useState<Record<string, Error>>({});

  const loadComponent = async (key: string, importFn: () => Promise<any>) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      await importFn();
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    } catch (error) {
      setErrors(prev => ({ ...prev, [key]: error as Error }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  return {
    loadingStates,
    errors,
    loadComponent,
    isLoading: (key: string) => loadingStates[key] || false,
    hasError: (key: string) => !!errors[key]
  };
};
