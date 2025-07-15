import React from 'react';
import { Loader2, BarChart3, Users, BookOpen, Calendar } from 'lucide-react';

// Loading spinner basique
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 
      className={`animate-spin text-blue-600 ${sizeClasses[size]} ${className}`} 
    />
  );
};

// Loading avec message
interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = "Chargement...", 
  size = 'md',
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size={size} />
      <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
        {message}
      </p>
    </div>
  );
};

// Loading page complète
export const PageLoading: React.FC<{ message?: string }> = ({ 
  message = "Chargement de la page..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
    </div>
  );
};

// Skeleton pour les cartes de statistiques
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      
      <div className="space-y-2">
        <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

// Skeleton pour une liste d'éléments
interface ListSkeletonProps {
  rows?: number;
  showHeader?: boolean;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ 
  rows = 5, 
  showHeader = true 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {showHeader && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      )}
      
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton pour tableau
interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  columns = 4, 
  rows = 5 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="grid border-b border-gray-200 dark:border-gray-700 p-4" 
           style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} 
             className="grid border-b border-gray-200 dark:border-gray-700 p-4 last:border-b-0"
             style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Skeleton pour dashboard
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      
      {/* Section principale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <ListSkeleton rows={3} showHeader={false} />
        </div>
        
        <div className="space-y-4">
          <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <ListSkeleton rows={3} showHeader={false} />
        </div>
      </div>
    </div>
  );
};

// Skeleton pour profil utilisateur
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div className="space-y-2">
          <div className="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading state avec progression
interface ProgressLoadingProps {
  progress: number;
  message?: string;
}

export const ProgressLoading: React.FC<ProgressLoadingProps> = ({ 
  progress, 
  message = "Chargement en cours..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
        {message}
      </p>
      <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
        {Math.round(progress)}%
      </p>
    </div>
  );
};

// Hook pour gérer les états de loading
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [loadingMessage, setLoadingMessage] = React.useState<string>();

  const startLoading = (message?: string) => {
    setIsLoading(true);
    setLoadingMessage(message);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage(undefined);
  };

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    setLoading: setIsLoading
  };
};
