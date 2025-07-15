import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from '../../router/ProtectedRoute';

export const Breadcrumbs: React.FC = () => {
  const { breadcrumbs, currentPath } = useNavigation();

  // Ne pas afficher les breadcrumbs sur la page d'accueil des dashboards
  if (breadcrumbs.length <= 2) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3">
      <nav className="flex items-center space-x-2 text-sm">
        <Home className="w-4 h-4 text-gray-500" />
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            {index === breadcrumbs.length - 1 ? (
              // Dernière miette - pas de lien
              <span className="font-medium text-gray-900 dark:text-white">
                {crumb.label}
              </span>
            ) : (
              // Autres miettes - avec lien
              <Link
                to={crumb.path}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};
