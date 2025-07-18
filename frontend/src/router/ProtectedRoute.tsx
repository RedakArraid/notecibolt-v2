import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, type User } from '../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: User['role'][];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Non authentifié -> redirection vers login
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Rôle non autorisé -> redirection vers dashboard de base
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleDefaultPath(user.role)} replace />;
  }

  return <>{children}</>;
};

// Composant pour rediriger automatiquement selon le rôle
export const RoleBasedRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getRoleDefaultPath(user.role)} replace />;
};

// Utilitaire pour obtenir le chemin par défaut selon le rôle
export const getRoleDefaultPath = (role: User['role']): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'teacher':
      return '/teacher';
    case 'parent':
      return '/parent';
    case 'supervisor':
      return '/supervisor';
    case 'student':
    default:
      return '/student';
  }
};

// Hook pour obtenir les informations de navigation
export const useNavigation = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/teacher')) return 'teacher';
    if (path.startsWith('/parent')) return 'parent';
    if (path.startsWith('/supervisor')) return 'supervisor';
    if (path.startsWith('/student')) return 'student';
    return 'dashboard';
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getPageTitle = () => {
    const section = getCurrentSection();
    switch (section) {
      case 'admin':
        return 'Administration';
      case 'teacher':
        return 'Espace Enseignant';
      case 'parent':
        return 'Espace Parent';
      case 'supervisor':
        return 'Surveillance';
      case 'student':
        return 'Espace Élève';
      default:
        return 'NoteCibolt';
    }
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs = [
      { label: 'Accueil', path: '/' }
    ];

    if (segments.length > 0) {
      const section = segments[0];
      const sectionLabel = {
        admin: 'Administration',
        teacher: 'Enseignant',
        parent: 'Parent',
        supervisor: 'Surveillance',
        student: 'Élève'
      }[section] || section;

      breadcrumbs.push({
        label: sectionLabel,
        path: `/${section}`
      });

      // Ajouter des sous-sections si elles existent
      if (segments.length > 1) {
        const subsection = segments[1];
        const subsectionLabel = {
          grades: 'Notes',
          assignments: 'Devoirs',
          attendance: 'Présences',
          schedule: 'Emploi du temps',
          messages: 'Messages',
          students: 'Élèves',
          finance: 'Finances',
          reports: 'Rapports',
          settings: 'Paramètres'
        }[subsection] || subsection;

        breadcrumbs.push({
          label: subsectionLabel,
          path: `/${section}/${subsection}`
        });
      }
    }

    return breadcrumbs;
  };

  return {
    currentSection: getCurrentSection(),
    currentPath: location.pathname,
    isCurrentPath,
    pageTitle: getPageTitle(),
    breadcrumbs: getBreadcrumbs(),
    userRole: user?.role,
    defaultPath: user ? getRoleDefaultPath(user.role) : '/login'
  };
};

// Types pour les routes
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  allowedRoles: User['role'][];
  title: string;
  showInNavigation?: boolean;
  icon?: string;
  children?: RouteConfig[];
}

// Configuration des routes par rôle
export const getRoutesByRole = (role: User['role']): RouteConfig[] => {
  const commonRoutes: RouteConfig[] = [
    {
      path: '/profile',
      element: null, // À implémenter
      allowedRoles: ['admin', 'teacher', 'student', 'parent', 'supervisor'],
      title: 'Profil',
      showInNavigation: true,
      icon: 'User'
    },
    {
      path: '/messages',
      element: null, // À implémenter
      allowedRoles: ['admin', 'teacher', 'student', 'parent', 'supervisor'],
      title: 'Messages',
      showInNavigation: true,
      icon: 'MessageSquare'
    }
  ];

  const roleSpecificRoutes: Record<User['role'], RouteConfig[]> = {
    admin: [
      {
        path: '/admin',
        element: null,
        allowedRoles: ['admin'],
        title: 'Tableau de bord',
        showInNavigation: true,
        icon: 'BarChart3'
      },
      {
        path: '/admin/students',
        element: null,
        allowedRoles: ['admin'],
        title: 'Gestion des utilisateurs',
        showInNavigation: true,
        icon: 'Users'
      },
      {
        path: '/admin/teachers',
        element: null,
        allowedRoles: ['admin'],
        title: 'Gestion des enseignants',
        showInNavigation: true,
        icon: 'UserPlus'
      },
      {
        path: '/admin/finance',
        element: null,
        allowedRoles: ['admin'],
        title: 'Finances',
        showInNavigation: true,
        icon: 'CreditCard'
      },
      {
        path: '/admin/reports',
        element: null,
        allowedRoles: ['admin'],
        title: 'Rapports',
        showInNavigation: true,
        icon: 'FileText'
      }
    ],
    teacher: [
      {
        path: '/teacher',
        element: null,
        allowedRoles: ['teacher'],
        title: 'Mon tableau de bord',
        showInNavigation: true,
        icon: 'Home'
      },
      {
        path: '/teacher/grades',
        element: null,
        allowedRoles: ['teacher'],
        title: 'Notes',
        showInNavigation: true,
        icon: 'BookOpen'
      },
      {
        path: '/teacher/assignments',
        element: null,
        allowedRoles: ['teacher'],
        title: 'Devoirs',
        showInNavigation: true,
        icon: 'ClipboardCheck'
      },
      {
        path: '/teacher/attendance',
        element: null,
        allowedRoles: ['teacher'],
        title: 'Présences',
        showInNavigation: true,
        icon: 'Users'
      },
      {
        path: '/teacher/schedule',
        element: null,
        allowedRoles: ['teacher'],
        title: 'Emploi du temps',
        showInNavigation: true,
        icon: 'Calendar'
      }
    ],
    student: [
      {
        path: '/student',
        element: null,
        allowedRoles: ['student'],
        title: 'Mon tableau de bord',
        showInNavigation: true,
        icon: 'Home'
      },
      {
        path: '/student/grades',
        element: null,
        allowedRoles: ['student'],
        title: 'Mes notes',
        showInNavigation: true,
        icon: 'BookOpen'
      },
      {
        path: '/student/assignments',
        element: null,
        allowedRoles: ['student'],
        title: 'Mes devoirs',
        showInNavigation: true,
        icon: 'ClipboardCheck'
      },
      {
        path: '/student/schedule',
        element: null,
        allowedRoles: ['student'],
        title: 'Mon emploi du temps',
        showInNavigation: true,
        icon: 'Calendar'
      },
      {
        path: '/student/achievements',
        element: null,
        allowedRoles: ['student'],
        title: 'Mes réussites',
        showInNavigation: true,
        icon: 'Award'
      }
    ],
    parent: [
      {
        path: '/parent',
        element: null,
        allowedRoles: ['parent'],
        title: 'Suivi de mes enfants',
        showInNavigation: true,
        icon: 'Home'
      },
      {
        path: '/parent/grades',
        element: null,
        allowedRoles: ['parent'],
        title: 'Notes des enfants',
        showInNavigation: true,
        icon: 'BookOpen'
      },
      {
        path: '/parent/attendance',
        element: null,
        allowedRoles: ['parent'],
        title: 'Présences',
        showInNavigation: true,
        icon: 'Users'
      },
      {
        path: '/parent/finance',
        element: null,
        allowedRoles: ['parent'],
        title: 'Finances',
        showInNavigation: true,
        icon: 'CreditCard'
      }
    ],
    supervisor: [
      {
        path: '/supervisor',
        element: null,
        allowedRoles: ['supervisor'],
        title: 'Centre de surveillance',
        showInNavigation: true,
        icon: 'Shield'
      },
      {
        path: '/supervisor/incidents',
        element: null,
        allowedRoles: ['supervisor'],
        title: 'Incidents',
        showInNavigation: true,
        icon: 'AlertTriangle'
      },
      {
        path: '/supervisor/attendance',
        element: null,
        allowedRoles: ['supervisor'],
        title: 'Contrôle présences',
        showInNavigation: true,
        icon: 'Eye'
      }
    ]
  };

  return [...(roleSpecificRoutes[role] || []), ...commonRoutes];
};
