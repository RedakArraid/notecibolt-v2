import React from 'react';
import { StatCard } from './StatCard';
import { RecentGrades } from './RecentGrades';
import { UpcomingAssignments } from './UpcomingAssignments';
import { SubjectOverview } from './SubjectOverview';
import { MessageList } from '../Messages/MessageList';
import { AchievementGrid } from '../Achievements/AchievementGrid';
import { useDashboard } from '../../hooks/useDashboard';
import {
  BarChart3,
  BookOpen,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { stats, isLoading, error, refresh, connectionStatus } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête étudiant */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">NoteCibolt v2 - Espace Élève</h2>
            <p className="text-blue-100">
              Tableau de bord personnel • Année scolaire 2024-2025
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-blue-200">
              <span>Moyenne: {stats?.averageGrade || 15.2}/20</span>
              <span>Devoirs: {stats?.pendingAssignments || 3} en cours</span>
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
          <div className="text-right">
            <div className="text-3xl font-bold">{stats?.earnedAchievements || 12}</div>
            <div className="text-blue-100">Badges obtenus</div>
            <button
              onClick={refresh}
              disabled={isLoading}
              className="mt-2 flex items-center gap-2 px-3 py-1 text-sm bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Moyenne générale"
          value={`${stats?.averageGrade || 15.2}/20`}
          subtitle="Toutes matières"
          icon={BarChart3}
          trend={{ value: 2.3, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Devoirs en cours"
          value={(stats?.pendingAssignments || 3).toString()}
          subtitle="À rendre prochainement"
          icon={BookOpen}
          color="orange"
        />
        <StatCard
          title="Messages non lus"
          value={(stats?.unreadMessages || 2).toString()}
          subtitle="Nouveaux messages"
          icon={MessageSquare}
          color="purple"
        />
        <StatCard
          title="Badges obtenus"
          value={(stats?.earnedAchievements || 12).toString()}
          subtitle="Réussites débloquées"
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
          color="green"
        />
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RecentGrades />
          <MessageList />
        </div>
        <div className="space-y-6">
          <UpcomingAssignments />
          <SubjectOverview />
        </div>
      </div>

      {/* Badges et réussites */}
      <AchievementGrid />

      {/* Bannière info Phase 6 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              ✅ Phase 6 : Router SPA + Navigation avancée
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Dashboard étudiant intégré dans le système de routing avec URLs dédiées et navigation fluide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
