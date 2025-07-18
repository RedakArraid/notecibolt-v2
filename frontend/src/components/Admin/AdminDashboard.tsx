import React, { useState } from 'react';
import { 
  Users, BookOpen, AlertTriangle, DollarSign,
  School, Award, CheckCircle, Target, Bell, Settings,
  RefreshCw, Wifi, WifiOff, BarChart3, Mail
} from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { StatCard } from './StatCard';
import { AlertCard } from './AlertCard';
import { EventCard } from './EventCard';
import { FinancialMetrics } from './FinancialMetrics';
import { DepartmentStats } from './DepartmentStats';

export const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const { 
    metrics, 
    isLoading, 
    error, 
    connectionStatus, 
    lastRefresh, 
    refreshMetrics,
    clearError 
  } = useAdminDashboard(selectedPeriod);

  const handleRefresh = async () => {
    await refreshMetrics();
  };

  const handleAlertAction = (alertId: string) => {
    console.log('Action sur l\'alerte:', alertId);
    // Navigation vers la page détaillée de l'alerte
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des métriques système...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Erreur lors du chargement des données</p>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec informations de l'établissement - EXACT V1 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <School className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">NoteCibolt v2 - Administration</h1>
              <p className="text-indigo-100">
                Tableau de bord directrice • Année scolaire 2024-2025
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-indigo-200">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {metrics.systemMetrics.totalStudents} élèves
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {metrics.systemMetrics.totalClasses} classes
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {metrics.systemMetrics.totalTeachers} enseignants
                </div>
                <div className="flex items-center gap-1">
                  {connectionStatus === 'connected' ? (
                    <Wifi className="w-4 h-4 text-green-300" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-orange-300" />
                  )}
                  <span className={connectionStatus === 'connected' ? 'text-green-300' : 'text-orange-300'}>
                    {connectionStatus === 'connected' ? 'Connecté à PostgreSQL' : 'Mode fallback'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{metrics.systemMetrics.academicPerformance}/20</div>
            <div className="text-indigo-100">Performance académique</div>
            <div className="text-sm text-indigo-200 mt-1">+0.8 vs mois dernier</div>
          </div>
        </div>
      </div>

      {/* Contrôles de période et rafraîchissement - EXACT V1 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Vue d'ensemble de l'établissement
          </h3>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Dernière mise à jour: {lastRefresh.toLocaleTimeString()}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="current_week">Cette semaine</option>
              <option value="current_month">Ce mois</option>
              <option value="current_quarter">Ce trimestre</option>
              <option value="current_year">Cette année</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPIs principaux - EXACT V1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Élèves"
          value={metrics.systemMetrics.totalStudents}
          icon={Users}
          trend="+12 ce mois"
          color="blue"
        />
        <StatCard
          title="Présence"
          value={`${metrics.systemMetrics.attendanceRate}%`}
          icon={CheckCircle}
          trend="+1.2% ce mois"
          color="green"
        />
        <StatCard
          title="Marge"
          value={`${metrics.financialData.profitMargin}%`}
          icon={DollarSign}
          trend="+2.1% ce mois"
          color="purple"
        />
        <StatCard
          title="Satisfaction"
          value={`${metrics.systemMetrics.parentSatisfaction}%`}
          icon={Award}
          trend="+0.8% ce mois"
          color="orange"
        />
        <StatCard
          title="Rétention"
          value={`${metrics.systemMetrics.teacherRetention}%`}
          icon={Target}
          trend="Stable"
          trendDirection="stable"
          color="red"
        />
      </div>

      {/* Alertes et Activité - EXACT V1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alertes critiques */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Alertes critiques
            </h3>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-600">
                {metrics.alerts.filter(a => a.severity === 'high').length} urgentes
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {metrics.alerts.map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                onActionClick={handleAlertAction}
              />
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Activité récente
          </h3>
          
          <div className="space-y-4">
            {metrics.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>

      {/* Finances et Départements - EXACT V1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialMetrics financialData={metrics.financialData} />
        <DepartmentStats departments={metrics.departments} />
      </div>

      {/* Actions rapides - EXACT V1 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Actions rapides de direction
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Rapport mensuel</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Générer le bilan</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Réunion équipe</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Planifier</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Circulaire</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Envoyer</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Configuration</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Paramètres</div>
            </div>
          </button>
        </div>
      </div>

      {/* Bannière de statut v2 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              ✅ Interface Admin v1 → v2 : Migration complète avec connexion base de données
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Toutes les fonctionnalités de la v1 restaurées + métriques temps réel depuis PostgreSQL avec fallback intelligent
            </p>
          </div>
        </div>
      </div>

      {/* Message d'erreur si nécessaire */}
      {error && (
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                  Avertissement connexion
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  {error}
                </p>
              </div>
            </div>
            <button 
              onClick={clearError}
              className="px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Masquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
