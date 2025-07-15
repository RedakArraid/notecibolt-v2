import React from 'react';
import { Calendar, Clock, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

export const UpcomingAssignments: React.FC = () => {
  const { upcomingAssignments, isLoading, error, refresh } = useDashboard();
  
  const pendingAssignments = upcomingAssignments.filter(a => !a.completed);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'medium':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate);
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Demain";
    if (days < 0) return `En retard de ${Math.abs(days)} jour${Math.abs(days) > 1 ? 's' : ''}`;
    return `Dans ${days} jour${days > 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-32">
          <Loader className="w-6 h-6 animate-spin text-orange-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des devoirs...</span>
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
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
          <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Devoirs à rendre
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {pendingAssignments.length} devoir{pendingAssignments.length > 1 ? 's' : ''} en attente
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

      {pendingAssignments.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Aucun devoir en attente</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Données chargées depuis l'API backend
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingAssignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue < 0;
            const isUrgent = daysUntilDue <= 1 && daysUntilDue >= 0;

            return (
              <div
                key={assignment.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
                  isOverdue ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' :
                  isUrgent ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10' :
                  'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {assignment.title}
                      </h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority === 'high' ? 'Urgent' :
                         assignment.priority === 'medium' ? 'Moyen' : 'Faible'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span className="font-medium">{assignment.subject}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {assignment.description}
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      isOverdue ? 'text-red-600' :
                      isUrgent ? 'text-orange-600' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {isOverdue || isUrgent ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      <span>{formatDueDate(assignment.dueDate)}</span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(assignment.dueDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="text-xs text-center text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
            📅 Données en temps réel depuis la base de données
          </div>
        </div>
      )}
    </div>
  );
};