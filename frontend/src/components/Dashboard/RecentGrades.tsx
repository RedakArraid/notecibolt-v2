import React from 'react';
import { BookOpen, TrendingUp, Loader, RefreshCw } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

export const RecentGrades: React.FC = () => {
  const { recentGrades, isLoading, error, refresh } = useDashboard();

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (percentage >= 60) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-32">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des notes...</span>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notes récentes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {recentGrades.length > 0 ? 'Vos dernières évaluations' : 'Données depuis la base de données'}
            </p>
          </div>
        </div>
        <button
          onClick={refresh}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Actualiser"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {recentGrades.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Aucune note récente trouvée</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Données chargées depuis l'API backend
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentGrades.map((grade) => (
            <div
              key={grade.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                  <BookOpen className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {grade.subject}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {grade.type === 'test' ? 'Contrôle' : 
                     grade.type === 'homework' ? 'Devoir' : 
                     grade.type === 'quiz' ? 'Interrogation' : 
                     grade.type === 'project' ? 'Projet' : 'Examen'}
                  </div>
                  {grade.comment && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {grade.comment}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.value, grade.maxValue)}`}>
                    {grade.value}/{grade.maxValue}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDate(grade.date)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="text-xs text-center text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
            📊 Données en temps réel depuis la base de données
          </div>
        </div>
      )}
    </div>
  );
};