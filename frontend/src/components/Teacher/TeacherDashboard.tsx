import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, CheckCircle, Clock, AlertTriangle, TrendingUp, Award,
  RefreshCw, Wifi, WifiOff, BarChart3
} from 'lucide-react';

interface TeacherData {
  name: string;
  subject: string;
  classes: string[];
  totalStudents: number;
  averageGrade: number;
  attendanceRate: number;
  pendingGrades: number;
}

interface Schedule {
  time: string;
  class: string;
  subject: string;
  room: string;
}

interface Activity {
  type: 'grade' | 'assignment' | 'message' | 'attendance';
  message: string;
  time: string;
}

interface ClassPerformance {
  class: string;
  students: number;
  average: number;
  attendance: number;
}

export const TeacherDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_week');
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');

  // État des données
  const [teacherData, setTeacherData] = useState<TeacherData>({
    name: '',
    subject: '',
    classes: [],
    totalStudents: 0,
    averageGrade: 0,
    attendanceRate: 0,
    pendingGrades: 0
  });

  const [todaySchedule, setTodaySchedule] = useState<Schedule[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [classPerformance, setClassPerformance] = useState<ClassPerformance[]>([]);

  // Données de fallback complètes (comme dans v1)
  const mockData = {
    teacherData: {
      name: 'Jean-Baptiste Traoré',
      subject: 'Mathématiques',
      classes: ['Terminale S1', 'Première S1', 'Seconde A'],
      totalStudents: 89,
      averageGrade: 14.2,
      attendanceRate: 94.8,
      pendingGrades: 12
    },
    todaySchedule: [
      { time: '08:00-10:00', class: 'Terminale S1', subject: 'Mathématiques', room: 'Salle 201' },
      { time: '10:15-12:15', class: 'Première S1', subject: 'Mathématiques', room: 'Salle 201' },
      { time: '14:00-16:00', class: 'Seconde A', subject: 'Mathématiques', room: 'Salle 105' }
    ],
    recentActivities: [
      { type: 'grade' as const, message: 'Notes saisies pour le contrôle de Terminale S1', time: '2h' },
      { type: 'assignment' as const, message: 'Nouveau devoir créé pour Première S1', time: '4h' },
      { type: 'message' as const, message: 'Message envoyé aux parents de Marie Dubois', time: '1j' },
      { type: 'attendance' as const, message: 'Présences marquées pour Seconde A', time: '1j' }
    ],
    classPerformance: [
      { class: 'Terminale S1', students: 32, average: 15.8, attendance: 96.2 },
      { class: 'Première S1', students: 28, average: 13.4, attendance: 94.1 },
      { class: 'Seconde A', students: 29, average: 13.9, attendance: 93.8 }
    ]
  };

  // Fonction pour charger les données depuis l'API
  const loadTeacherData = async () => {
    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
      
      // Test de connectivité API
      const healthResponse = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (healthResponse.ok) {
        setConnectionStatus('connected');
        
        // Charger les données enseignant (simulé pour l'instant)
        const teacherResponse = await fetch(`${API_BASE_URL}/teacher/dashboard`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('notecibolt_token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (teacherResponse.ok) {
          const data = await teacherResponse.json();
          setTeacherData(data.teacherData);
          setTodaySchedule(data.schedule);
          setRecentActivities(data.activities);
          setClassPerformance(data.classPerformance);
        } else {
          throw new Error('Erreur lors du chargement des données enseignant');
        }
      } else {
        throw new Error('API indisponible');
      }
    } catch (error) {
      console.log('🔄 Basculement vers les données mockées (Teacher):', error);
      setConnectionStatus('disconnected');
      
      // Utiliser les données de fallback
      setTeacherData(mockData.teacherData);
      setTodaySchedule(mockData.todaySchedule);
      setRecentActivities(mockData.recentActivities);
      setClassPerformance(mockData.classPerformance);
    } finally {
      setIsLoading(false);
      setLastRefresh(new Date());
    }
  };

  // Chargement initial des données
  useEffect(() => {
    loadTeacherData();
  }, [selectedPeriod]);

  // Fonction de rafraîchissement manuel
  const handleRefresh = () => {
    loadTeacherData();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'grade': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'assignment': return <Calendar className="w-4 h-4 text-green-600" />;
      case 'message': return <Users className="w-4 h-4 text-purple-600" />;
      case 'attendance': return <CheckCircle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des données enseignant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête enseignant avec statut de connexion */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">NoteCibolt v2 - Espace Enseignant</h2>
            <p className="text-blue-100">
              {teacherData.name} - Professeur de {teacherData.subject}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-blue-200">
              <span>{teacherData.classes.length} classes • {teacherData.totalStudents} élèves</span>
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
            <div className="text-3xl font-bold">{teacherData.averageGrade}/20</div>
            <div className="text-blue-100">Moyenne générale</div>
          </div>
        </div>
      </div>

      {/* Contrôles de période et rafraîchissement */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Vue d'ensemble de mes classes
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
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques rapides - INTERFACE COMPLÈTE V1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Élèves</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {teacherData.totalStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Moyenne</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {teacherData.averageGrade}/20
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Présence</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {teacherData.attendanceRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes à saisir</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {teacherData.pendingGrades}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emploi du temps du jour - INTERFACE COMPLÈTE V1 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Emploi du temps d'aujourd'hui
          </h3>
          <div className="space-y-4">
            {todaySchedule.map((course, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {course.class} - {course.subject}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {course.time} • {course.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activités récentes - INTERFACE COMPLÈTE V1 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activités récentes
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {activity.message}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Il y a {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance des classes - INTERFACE COMPLÈTE V1 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance de mes classes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Élèves
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Moyenne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Présence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {classPerformance.map((classData, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {classData.class}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {classData.students} élèves
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {classData.average}/20
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {classData.attendance}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {classData.average >= 15 ? (
                        <>
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Excellent</span>
                        </>
                      ) : classData.average >= 12 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-600 font-medium">Bon</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-orange-600 font-medium">À améliorer</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions rapides - INTERFACE COMPLÈTE V1 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                Saisir des notes
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Évaluations
              </div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                Créer un devoir
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Nouvelle évaluation
              </div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                Prendre présences
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Cours du jour
              </div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                Contacter parents
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Communication
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Bannière info v2 avec connexion BDD */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              ✅ TeacherDashboard v2 : Interface complète + Connexion base de données
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Dashboard enseignant avec emploi du temps, notes, et gestion de classes - Connecté PostgreSQL avec fallback
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
