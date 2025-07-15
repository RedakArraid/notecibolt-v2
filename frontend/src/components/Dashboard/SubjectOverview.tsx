import React from 'react';
import { BookOpen, TrendingUp, Trophy, Loader, RefreshCw } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

export const SubjectOverview: React.FC = () => {
  const { subjects, stats, isLoading, error, refresh } = useDashboard();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-32">
          <Loader className="w-6 h-6 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des matières...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Erreur: {error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const getPerformanceLevel = (average: number) => {
    if (average >= 16) return { label: 'Excellent niveau', color: 'text-green-600 dark:text-green-400' };
    if (average >= 14) return { label: 'Bon niveau', color: 'text-blue-600 dark:text-blue-400' };
    if (average >= 12) return { label: 'Niveau satisfaisant', color: 'text-orange-600 dark:text-orange-400' };
    return { label: 'À améliorer', color: 'text-red-600 dark:text-red-400' };
  };

  const performance = getPerformanceLevel(stats.overallAverage);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Aperçu des matières
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Moyenne générale: {stats.overallAverage > 0 ? stats.overallAverage.toFixed(1) : '--'}/20
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
            <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className={`text-sm font-medium ${performance.color}`}>
              {performance.label}
            </span>
          </div>
          <button
            onClick={refresh}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Actualiser"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Aucune matière trouvée</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Données chargées depuis l'API backend
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {subject.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {subject.teacher || 'Enseignant non assigné'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {subject.average ? subject.average.toFixed(1) : '--'}/20
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      +0.5
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: subject.color,
                      width: `${subject.average ? ((subject.average / 20) * 100) : 0}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-center text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            📚 Données en temps réel depuis la base de données
          </div>
        </>
      )}
    </div>
  );
};