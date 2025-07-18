import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  UserCheck,
  Search,
  Download,
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  FileText,
  TrendingUp
} from 'lucide-react';
import { attendanceService, type AttendanceRecord, type AttendanceStats, type AttendanceFilters } from '../../services/api';
import { LoadingSpinner } from '../Loading/LoadingSpinner';

interface AttendanceManagementProps {
  mode?: 'full' | 'compact';
  classId?: string;
  studentId?: string;
  className?: string;
}

interface FilterState extends AttendanceFilters {
  searchTerm: string;
}

const statusConfig = {
  present: {
    label: 'Présent',
    color: 'text-green-600 bg-green-100',
    icon: CheckCircle,
    borderColor: 'border-green-200'
  },
  absent: {
    label: 'Absent',
    color: 'text-red-600 bg-red-100',
    icon: XCircle,
    borderColor: 'border-red-200'
  },
  late: {
    label: 'Retard',
    color: 'text-orange-600 bg-orange-100',
    icon: Clock,
    borderColor: 'border-orange-200'
  },
  excused: {
    label: 'Excusé',
    color: 'text-blue-600 bg-blue-100',
    icon: UserCheck,
    borderColor: 'border-blue-200'
  }
};

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({
  mode = 'full',
  classId,
  studentId,
  className = ''
}) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    page: 1,
    limit: mode === 'compact' ? 5 : 10,
    sortBy: 'date',
    sortOrder: 'desc',
    ...(classId && { classId }),
    ...(studentId && { studentId })
  });

  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Charger les données
  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (studentId) {
        const studentData = await attendanceService.getStudentAttendance(studentId, {
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder
        });
        
        setRecords(studentData.records);
        setStats(studentData.stats);
        setApiConnected(true);
      } else {
        const response = await attendanceService.getAttendance({
          ...filters,
          searchTerm: undefined
        });
        
        setRecords(response.records);
        setApiConnected(true);

        if (!classId && !studentId) {
          const globalStats = await attendanceService.getAttendanceStats();
          setStats(globalStats);
        }
      }

    } catch (err) {
      console.error('Erreur lors du chargement des présences:', err);
      setError('Impossible de charger les données de présence');
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, [filters.page, filters.limit, filters.sortBy, filters.sortOrder]);

  // Filtrer les enregistrements localement par terme de recherche
  const filteredRecords = records.filter(record => {
    if (!filters.searchTerm) return true;
    const searchLower = filters.searchTerm.toLowerCase();
    return (
      record.studentName.toLowerCase().includes(searchLower) ||
      record.className.toLowerCase().includes(searchLower) ||
      record.teacherName.toLowerCase().includes(searchLower) ||
      record.status.toLowerCase().includes(searchLower)
    );
  });

  // Gérer le changement de filtres
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 })
    }));
  };

  // Gérer la sélection d'enregistrements
  const toggleRecordSelection = (recordId: string) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const selectAllRecords = () => {
    setSelectedRecords(
      selectedRecords.length === filteredRecords.length 
        ? [] 
        : filteredRecords.map(r => r.id)
    );
  };

  // Statistiques pour mode compact
  const renderCompactStats = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Taux de présence</p>
              <p className="text-2xl font-bold text-green-700">{stats.attendanceRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Ponctualité</p>
              <p className="text-2xl font-bold text-blue-700">{stats.punctualityRate}%</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total cours</p>
              <p className="text-2xl font-bold text-gray-700">{stats.totalClasses}</p>
            </div>
            <Users className="h-8 w-8 text-gray-500" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Absences</p>
              <p className="text-2xl font-bold text-red-700">{stats.absentCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>
    );
  };

  // Statistiques détaillées pour mode full
  const renderFullStats = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total des cours</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Présences</p>
              <p className="text-3xl font-bold text-green-700">{stats.presentCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Absences</p>
              <p className="text-3xl font-bold text-red-700">{stats.absentCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-orange-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Retards</p>
              <p className="text-3xl font-bold text-orange-700">{stats.lateCount}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Excusés</p>
              <p className="text-3xl font-bold text-blue-700">{stats.excusedCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tableau des enregistrements
  const renderRecordsTable = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {mode === 'full' && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                    onChange={selectAllRecords}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Étudiant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Heure
              </th>
              {mode === 'full' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enseignant
                </th>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map((record) => {
              const statusInfo = statusConfig[record.status];
              const StatusIcon = statusInfo.icon;

              return (
                <tr key={record.id} className="hover:bg-gray-50">
                  {mode === 'full' && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => toggleRecordSelection(record.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                      <div className="text-sm text-gray-500">{record.studentEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.className}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.timeIn && (
                      <div>
                        <div className="text-sm">Arrivée: {record.timeIn}</div>
                        {record.timeOut && <div className="text-xs text-gray-500">Sortie: {record.timeOut}</div>}
                      </div>
                    )}
                  </td>
                  {mode === 'full' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.teacherName}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {record.status === 'absent' && !record.justification && (
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Justifier l'absence"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {mode === 'full' && (
                        <>
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Gestion du loading
  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <LoadingSpinner size="lg" text="Chargement des données de présence..." />
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-center text-red-600 mb-4">
            <AlertTriangle className="h-8 w-8 mr-3" />
            <span className="text-lg font-medium">Erreur de chargement</span>
          </div>
          <p className="text-center text-gray-600 mb-4">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={loadAttendanceData}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'compact' ? 'Présences' : 'Gestion des présences'}
          </h2>
          <p className="text-gray-600">
            {studentId 
              ? 'Suivi des présences de l\'étudiant'
              : classId 
              ? 'Présences de la classe'
              : 'Vue d\'ensemble des présences'}
          </p>
        </div>
        
        {mode === 'compact' && (
          <button
            onClick={loadAttendanceData}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        )}
      </div>

      {/* Statistiques */}
      {mode === 'compact' ? renderCompactStats() : renderFullStats()}

      {/* Barre d'outils (mode full seulement) */}
      {mode === 'full' && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, classe, enseignant..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Fonctionnalité d\'export à implémenter')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>

              <button
                onClick={loadAttendanceData}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle présence
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${apiConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {apiConnected ? 'Connecté à la base de données' : 'Mode fallback (données de démonstration)'}
            </div>
            
            {selectedRecords.length > 0 && (
              <div className="text-sm text-gray-600">
                {selectedRecords.length} élément(s) sélectionné(s)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message si aucun résultat */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune donnée de présence
          </h3>
          <p className="text-gray-600 mb-4">
            {filters.searchTerm 
              ? 'Aucun résultat ne correspond à vos critères de recherche.'
              : 'Aucune donnée de présence disponible pour cette période.'}
          </p>
          {filters.searchTerm && (
            <button
              onClick={() => handleFilterChange('searchTerm', '')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Réinitialiser la recherche
            </button>
          )}
        </div>
      ) : (
        renderRecordsTable()
      )}

      {/* Modal création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Créer une nouvelle présence</h3>
            <p className="text-gray-600 mb-4">Fonctionnalité à implémenter</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
