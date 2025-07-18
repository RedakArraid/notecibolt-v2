import React, { useState, useEffect } from 'react';
import { User, Search, Plus, Filter, MoreVertical, Phone, Mail, MapPin, RefreshCw, AlertCircle, CheckCircle, Users, GraduationCap, UserCheck, Activity } from 'lucide-react';
import { useStudents } from '../../hooks/useStudents';
import { Student } from '../../types/api';

interface StudentManagementProps {
  onStudentSelect?: (student: Student) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ onStudentSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);

  // Utilisation du hook useStudents pour gérer l'état et les données
  const [studentsState, studentsActions] = useStudents(true);

  const {
    students,
    stats,
    loading,
    loadingStats,
    error,
    isConnected,
    lastRefresh,
    totalCount,
    totalPages,
    hasMore
  } = studentsState;

  const {
    loadStudents,
    refreshData,
    searchStudents,
    clearError
  } = studentsActions;

  // Effet pour charger les classes disponibles
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/students/classes');
        const result = await response.json();
        if (result.success) {
          setAvailableClasses(result.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des classes:', error);
      }
    };
    
    loadClasses();
  }, []);

  // Effet pour recharger les données quand les filtres changent
  useEffect(() => {
    const delayedLoad = setTimeout(() => {
      const filters = {
        search: searchTerm || undefined,
        isActive: selectedFilter === 'active' ? true : selectedFilter === 'inactive' ? false : undefined,
        classId: selectedClassFilter !== 'all' ? selectedClassFilter : undefined,
        sortBy: 'name' as const,
        sortOrder: 'asc' as const
      };

      console.log('🔄 Loading students with filters:', filters, 'page:', currentPage);
      loadStudents(currentPage, filters);
    }, 300); // Debounce de 300ms pour éviter trop d'appels

    return () => clearTimeout(delayedLoad);
  }, [searchTerm, selectedFilter, selectedClassFilter, currentPage]); // Retirer loadStudents des dépendances

  const handleRefresh = async () => {
    clearError();
    await refreshData();
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Revenir à la première page lors d'une recherche
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleClassFilterChange = (classId: string) => {
    setSelectedClassFilter(classId);
    setCurrentPage(1);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'teacher': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'parent': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student': return 'Élève';
      case 'teacher': return 'Enseignant';
      case 'parent': return 'Parent';
      case 'admin': return 'Administrateur';
      case 'staff': return 'Personnel';
      default: return role;
    }
  };

  const formatGPA = (gpa: number) => {
    return `${gpa.toFixed(1)}/20`;
  };

  const formatAttendance = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header avec statut de connexion */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des élèves
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-600 dark:text-gray-400">
              Gérez les élèves de l'établissement
            </p>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Connecté à la BDD</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Mode démonstration</span>
                </div>
              )}
              {lastRefresh && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Dernière MAJ: {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Ajouter un élève
          </button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
            <button
              onClick={clearError}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou ID étudiant..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
            <select
              value={selectedClassFilter}
              onChange={(e) => handleClassFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Toutes les classes</option>
              {availableClasses.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.currentCount}/{cls.capacity})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total élèves</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {loadingStats ? '...' : stats?.totalStudents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Élèves actifs</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {loadingStats ? '...' : stats?.activeStudents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Moyenne générale</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {loadingStats ? '...' : stats ? formatGPA(stats.averageGPA) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Taux présence</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {loadingStats ? '...' : stats ? formatAttendance(stats.averageAttendance) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Chargement des élèves...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Aucun élève trouvé</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Élève
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Classe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Performance
                    </th>
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
                              ID: {student.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.class ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.class.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {student.class.level}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Non assigné</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="space-y-1">
                          {student.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{student.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-32">{student.email}</span>
                          </div>
                          {student.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-32">{student.address}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.academicInfo ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs">Moyenne:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatGPA(student.academicInfo.currentGPA)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">Présence:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatAttendance(student.academicInfo.attendanceRate)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {student.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Affichage de {((currentPage - 1) * 20) + 1} à {Math.min(currentPage * 20, totalCount)} sur {totalCount} élèves
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Précédent
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};