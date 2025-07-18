import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, Calendar, Target, Award,
  PieChart, Activity, Filter, Download, RefreshCw, Eye
} from 'lucide-react';

export const AdmissionAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_year');
  const [selectedMetric, setSelectedMetric] = useState('applications');

  // Données analytiques
  const analyticsData = {
    totalApplications: 245,
    acceptedApplications: 189,
    rejectedApplications: 31,
    pendingApplications: 25,
    acceptanceRate: 77.1,
    averageProcessingTime: 12.5, // jours
    conversionRate: 85.2, // prospects vers candidatures
    enrollmentRate: 92.1 // acceptés vers inscrits
  };

  // Données par mois
  const monthlyData = [
    { month: 'Sept', applications: 45, accepted: 38, rejected: 5, pending: 2 },
    { month: 'Oct', applications: 52, accepted: 41, rejected: 8, pending: 3 },
    { month: 'Nov', applications: 38, accepted: 29, rejected: 6, pending: 3 },
    { month: 'Déc', applications: 28, accepted: 22, rejected: 4, pending: 2 },
    { month: 'Jan', applications: 82, accepted: 59, rejected: 8, pending: 15 }
  ];

  // Données par niveau
  const levelData = [
    { level: '6e', applications: 45, accepted: 38, rate: 84.4 },
    { level: '5e', applications: 32, accepted: 28, rate: 87.5 },
    { level: '4e', applications: 28, accepted: 22, rate: 78.6 },
    { level: '3e', applications: 35, accepted: 29, rate: 82.9 },
    { level: '2nde', applications: 58, accepted: 42, rate: 72.4 },
    { level: '1re', applications: 25, accepted: 18, rate: 72.0 },
    { level: 'Terminale', applications: 22, accepted: 12, rate: 54.5 }
  ];

  // Sources de candidatures
  const sourceData = [
    { source: 'Site web', count: 98, percentage: 40.0 },
    { source: 'Recommandations', count: 73, percentage: 29.8 },
    { source: 'Événements', count: 45, percentage: 18.4 },
    { source: 'Réseaux sociaux', count: 19, percentage: 7.8 },
    { source: 'Autres', count: 10, percentage: 4.0 }
  ];

  // Motifs de refus
  const rejectionReasons = [
    { reason: 'Niveau académique insuffisant', count: 12, percentage: 38.7 },
    { reason: 'Dossier incomplet', count: 8, percentage: 25.8 },
    { reason: 'Places limitées', count: 6, percentage: 19.4 },
    { reason: 'Profil inadéquat', count: 3, percentage: 9.7 },
    { reason: 'Autres', count: 2, percentage: 6.4 }
  ];

  // Temps de traitement par étape
  const processingTimes = [
    { step: 'Réception dossier', avgDays: 1.2, target: 1 },
    { step: 'Vérification documents', avgDays: 2.8, target: 2 },
    { step: 'Évaluation académique', avgDays: 4.5, target: 3 },
    { step: 'Entretien famille', avgDays: 2.1, target: 2 },
    { step: 'Décision finale', avgDays: 1.9, target: 2 }
  ];

  const getSourceColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-gray-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analyses des admissions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Statistiques et tendances du processus d'admission
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="current_month">Ce mois</option>
              <option value="current_quarter">Ce trimestre</option>
              <option value="current_year">Cette année</option>
              <option value="last_year">Année dernière</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.totalApplications}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Candidatures</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+15% vs année dernière</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.acceptanceRate}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Taux d'acceptation</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+2.3% vs année dernière</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.averageProcessingTime}j
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Temps moyen</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">-1.2j vs objectif</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.enrollmentRate}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Taux d'inscription</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+3.1% vs année dernière</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution mensuelle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Évolution mensuelle
          </h4>
          
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {month.month}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(month.applications / 82) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {month.applications} candidatures
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-green-600 dark:text-green-400 font-medium">
                    {month.accepted} acceptées
                  </div>
                  <div className="text-red-600 dark:text-red-400">
                    {month.rejected} refusées
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance par niveau */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Performance par niveau
          </h4>
          
          <div className="space-y-4">
            {levelData.map((level, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {level.level}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {level.applications} candidatures
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {level.rate}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {level.accepted} acceptées
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sources de candidatures */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Sources de candidatures
          </h4>
          
          <div className="space-y-4">
            {sourceData.map((source, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${getSourceColor(index)}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {source.source}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {source.count} ({source.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getSourceColor(index)}`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motifs de refus */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Motifs de refus
          </h4>
          
          <div className="space-y-3">
            {rejectionReasons.map((reason, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-900 dark:text-red-100">
                    {reason.reason}
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300">
                    {reason.percentage}% des refus
                  </div>
                </div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {reason.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Temps de traitement par étape */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Performance du processus
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Étape
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Temps moyen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Objectif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {processingTimes.map((item, index) => {
                const isOnTarget = item.avgDays <= item.target;
                const variance = ((item.avgDays - item.target) / item.target * 100);
                
                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.step}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {item.avgDays} jours
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.target} jours
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        isOnTarget 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {isOnTarget ? '✓' : '⚠'} 
                        {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};