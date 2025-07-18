import React, { useState, useEffect } from 'react';
import { 
  User, Search, Plus, AlertCircle, GraduationCap, Calendar, Users, 
  UserPlus, Edit, Trash2, Eye
} from 'lucide-react';
import { studentsService, type Student, type StudentStats } from '../../services/api';

// Données de fallback si API indisponible
const fallbackStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Martin',
    email: 'alice.martin@student.notecibolt.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix, 75001 Paris',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612345c?w=150',
    role: 'student',
    isActive: true,
    dateOfBirth: '2006-03-15',
    enrollmentDate: '2024-09-01',
    studentId: 'STU-2024-001',
    class: {
      id: 'class-1',
      name: '3ème A',
      level: 'Collège'
    },
    parent: {
      id: 'parent-1',
      name: 'Marie Martin',
      email: 'marie.martin@email.com',
      phone: '+33 6 98 76 54 32'
    },
    academicInfo: {
      currentGPA: 15.5,
      totalCredits: 120,
      completedCredits: 95,
      attendanceRate: 92.5
    },
    createdAt: '2024-09-01T08:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    email: 'thomas.dubois@student.notecibolt.com',
    phone: '+33 6 11 22 33 44',
    address: '456 Avenue des Champs, 75008 Paris',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'student',
    isActive: true,
    dateOfBirth: '2005-07-22',
    enrollmentDate: '2024-09-01',
    studentId: 'STU-2024-002',
    class: {
      id: 'class-2',
      name: '2nde B',
      level: 'Lycée'
    },
    academicInfo: {
      currentGPA: 13.8,
      totalCredits: 140,
      completedCredits: 110,
      attendanceRate: 88.0
    },
    createdAt: '2024-09-01T08:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z'
  }
];

const fallbackStats: StudentStats = {
  totalStudents: 2,
  activeStudents: 2,
  newStudentsThisMonth: 2,
  averageAttendance: 90.25,
  averageGPA: 14.65
};

interface StudentManagementProps {
  onStudentSelect?: (student: Student) => void;
  compactMode?: boolean;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ 
  onStudentSelect, 
  compactMode = false 
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  
  // Chargement des données
  const loadStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Chargement des étudiants depuis l\'API...');
      
      const result = await studentsService.getStudents(1, compactMode ? 5 : 20);
      
      setStudents(result.students);
      setApiConnected(true);
      
      console.log('✅ Étudiants chargés depuis l\'API:', result.students.length);
      
    } catch (err) {
      console.warn('⚠️ Erreur API, utilisation des données de fallback:', err);
      setStudents(fallbackStudents);
      setApiConnected(false);
      setError('Connexion API indisponible - Mode dégradé');
    } finally {
      setLoading(false);
    }
  };

  // Chargement des statistiques
  const loadStats = async () => {
    try {
      const statsData = await studentsService.getStudentStats();
      setStats(statsData);
    } catch (err) {
      console.warn('⚠️ Erreur lors du chargement des statistiques:', err);
      setStats(fallbackStats);
    }
  };

  // Effet initial
  useEffect(() => {
    loadStudents();
    loadStats();
  }, []);

  // Actions sur les étudiants
  const handleAddStudent = () => {
    console.log('Ajouter un étudiant');
  };

  const handleEditStudent = (student: Student) => {
    console.log('Éditer étudiant:', student.name);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      try {
        await studentsService.deleteStudent(studentId);
        loadStudents();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  // Utilitaires
  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement des étudiants...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statut API */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {compactMode ? 'Étudiants' : 'Gestion des étudiants'}
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              {compactMode ? `${students.length} étudiants` : 'Gérez les étudiants de l\'établissement'}
            </p>
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              apiConnected 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
            }`}>
              <div className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-500' : 'bg-orange-500'}`}></div>
              {apiConnected ? 'API connectée' : 'Mode dégradé'}
            </div>
          </div>
        </div>
        {!compactMode && (
          <button 
            onClick={handleAddStudent}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter un étudiant
          </button>
        )}
      </div>

      {/* Affichage d'erreur */}
      {error && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-orange-800 dark:text-orange-200">{error}</span>
          </div>
        </div>
      )}

      {/* Statistiques */}
      {!compactMode && stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Actifs</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.activeStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nouveaux</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.newStudentsThisMonth}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Présence moy.</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.averageAttendance.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Moyenne gén.</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.averageGPA.toFixed(1)}/20
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des étudiants */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {students.length === 0 ? (
          <div className="p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun étudiant trouvé
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Commencez par ajouter des étudiants.
            </p>
            <button 
              onClick={handleAddStudent}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter le premier étudiant
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Classe
                  </th>
                  {!compactMode && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Performance
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => onStudentSelect?.(student)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {student.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={student.avatar}
                              alt={student.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.studentId}
                          </div>
                          {!compactMode && (
                            <div className="text-xs text-gray-400">
                              {student.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {student.class?.name || 'Non assigné'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {student.class?.level}
                      </div>
                    </td>
                    {!compactMode && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.academicInfo && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              Moyenne: {student.academicInfo.currentGPA.toFixed(1)}/20
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Présence: {student.academicInfo.attendanceRate.toFixed(1)}%
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${Math.min(100, (student.academicInfo.currentGPA / 20) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.isActive)}`}>
                        {student.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onStudentSelect?.(student)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Voir le profil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!compactMode && (
                          <>
                            <button 
                              onClick={() => handleEditStudent(student)}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bouton d'actualisation */}
      <div className="flex justify-center">
        <button
          onClick={() => loadStudents()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <div className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}>🔄</div>
          {loading ? 'Actualisation...' : 'Actualiser les données'}
        </button>
      </div>
    </div>
  );
};
