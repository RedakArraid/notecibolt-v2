import { useState, useEffect, useCallback } from 'react';
import { studentsService, StudentStats, StudentFilters, CreateStudentRequest, UpdateStudentRequest } from '../services/api/studentsService';
import { Student } from '../types/api';

interface UseStudentsState {
  // Données
  students: Student[];
  stats: StudentStats | null;
  availableClasses: any[];
  availableParents: any[];
  
  // État de chargement
  loading: boolean;
  loadingStats: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  
  // Pagination
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  
  // Erreurs
  error: string | null;
  
  // Connexion API
  isConnected: boolean;
  lastRefresh: Date | null;
}

interface UseStudentsActions {
  // Chargement des données
  loadStudents: (page?: number, filters?: StudentFilters) => Promise<void>;
  loadStats: () => Promise<void>;
  refreshData: () => Promise<void>;
  
  // CRUD operations
  createStudent: (data: CreateStudentRequest) => Promise<Student | null>;
  updateStudent: (id: string, data: UpdateStudentRequest) => Promise<Student | null>;
  deleteStudent: (id: string) => Promise<boolean>;
  
  // Recherche et filtres
  searchStudents: (query: string, filters?: Omit<StudentFilters, 'search'>) => Promise<Student[]>;
  getStudentsByClass: (classId: string) => Promise<Student[]>;
  
  // Utilitaires
  clearError: () => void;
  resetFilters: () => void;
  
  // Import/Export
  importStudents: (file: File) => Promise<any>;
  exportStudents: (format: 'csv' | 'excel', filters?: StudentFilters) => Promise<void>;
}

const initialState: UseStudentsState = {
  students: [],
  stats: null,
  availableClasses: [],
  availableParents: [],
  loading: false,
  loadingStats: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  hasMore: false,
  error: null,
  isConnected: false,
  lastRefresh: null,
};

export const useStudents = (autoLoad = true): [UseStudentsState, UseStudentsActions] => {
  const [state, setState] = useState<UseStudentsState>(initialState);

  // Test de connectivité API
  const testConnection = useCallback(async () => {
    try {
      await studentsService.getStudents(1, 1);
      setState(prev => ({ ...prev, isConnected: true }));
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, isConnected: false }));
      return false;
    }
  }, []);

  // Chargement des étudiants avec pagination et filtres
  const loadStudents = useCallback(async (page = 1, filters?: StudentFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await studentsService.getStudents(page, 20, filters);
      setState(prev => ({
        ...prev,
        students: result.students,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
        currentPage: page,
        hasMore: result.hasMore,
        loading: false,
        isConnected: true,
        lastRefresh: new Date(),
      }));
    } catch (error: any) {
      console.error('Erreur lors du chargement des étudiants:', error);
      // Fallback vers les données mockées si API indisponible
      const mockStudents = await loadMockStudents();
      setState(prev => ({
        ...prev,
        students: mockStudents,
        totalCount: mockStudents.length,
        totalPages: Math.ceil(mockStudents.length / 20),
        currentPage: page,
        hasMore: false,
        loading: false,
        isConnected: false,
        error: 'Connexion API indisponible, données de démonstration affichées',
        lastRefresh: new Date(),
      }));
    }
  }, []); // Pas de dépendances pour éviter les re-renders

  // Chargement des statistiques
  const loadStats = useCallback(async () => {
    setState(prev => ({ ...prev, loadingStats: true }));
    
    try {
      const stats = await studentsService.getStudentStats();
      setState(prev => ({
        ...prev,
        stats,
        loadingStats: false,
        isConnected: true,
      }));
    } catch (error: any) {
      console.error('Erreur lors du chargement des statistiques:', error);
      
      // Statistiques mockées en cas d'échec
      const mockStats = {
        totalStudents: 856,
        activeStudents: 834,
        newStudentsThisMonth: 23,
        averageAttendance: 94.8,
        averageGPA: 15.2,
      };
      
      setState(prev => ({
        ...prev,
        stats: mockStats,
        loadingStats: false,
        isConnected: false,
      }));
    }
  }, []);

  // Rafraîchissement des données
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadStudents(state.currentPage),
      loadStats(),
    ]);
  }, [loadStudents, loadStats, state.currentPage]);

  // Création d'un étudiant
  const createStudent = useCallback(async (data: CreateStudentRequest): Promise<Student | null> => {
    setState(prev => ({ ...prev, loadingCreate: true, error: null }));
    
    try {
      const newStudent = await studentsService.createStudent(data);
      
      // Recharger la liste après création
      await loadStudents(state.currentPage);
      await loadStats();
      
      setState(prev => ({ ...prev, loadingCreate: false }));
      return newStudent;
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'étudiant:', error);
      setState(prev => ({
        ...prev,
        loadingCreate: false,
        error: error.response?.data?.message || 'Erreur lors de la création de l\'étudiant',
      }));
      return null;
    }
  }, [loadStudents, loadStats, state.currentPage]);

  // Mise à jour d'un étudiant
  const updateStudent = useCallback(async (id: string, data: UpdateStudentRequest): Promise<Student | null> => {
    setState(prev => ({ ...prev, loadingUpdate: true, error: null }));
    
    try {
      const updatedStudent = await studentsService.updateStudent(id, data);
      
      // Mettre à jour la liste locale
      setState(prev => ({
        ...prev,
        students: prev.students.map(student => 
          student.id === id ? updatedStudent : student
        ),
        loadingUpdate: false,
      }));
      
      return updatedStudent;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'étudiant:', error);
      setState(prev => ({
        ...prev,
        loadingUpdate: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de l\'étudiant',
      }));
      return null;
    }
  }, []);

  // Suppression d'un étudiant
  const deleteStudent = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loadingDelete: true, error: null }));
    
    try {
      await studentsService.deleteStudent(id);
      
      // Retirer de la liste locale
      setState(prev => ({
        ...prev,
        students: prev.students.filter(student => student.id !== id),
        loadingDelete: false,
        totalCount: prev.totalCount - 1,
      }));
      
      await loadStats(); // Recharger les stats
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'étudiant:', error);
      setState(prev => ({
        ...prev,
        loadingDelete: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression de l\'étudiant',
      }));
      return false;
    }
  }, [loadStats]);

  // Recherche d'étudiants
  const searchStudents = useCallback(async (query: string, filters?: Omit<StudentFilters, 'search'>): Promise<Student[]> => {
    try {
      const results = await studentsService.searchStudents(query, filters);
      return results;
    } catch (error: any) {
      console.error('Erreur lors de la recherche:', error);
      
      // Recherche locale en fallback
      const filtered = state.students.filter(student =>
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.email.toLowerCase().includes(query.toLowerCase())
      );
      
      return filtered;
    }
  }, [state.students]);

  // Obtenir les étudiants par classe
  const getStudentsByClass = useCallback(async (classId: string): Promise<Student[]> => {
    try {
      return await studentsService.getStudentsByClass(classId);
    } catch (error: any) {
      console.error('Erreur lors du chargement des étudiants de la classe:', error);
      return [];
    }
  }, []);

  // Import d'étudiants
  const importStudents = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await studentsService.importStudents(file);
      
      // Recharger les données après import
      await refreshData();
      
      setState(prev => ({ ...prev, loading: false }));
      return result;
    } catch (error: any) {
      console.error('Erreur lors de l\'import:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Erreur lors de l\'import des étudiants',
      }));
      throw error;
    }
  }, [refreshData]);

  // Export d'étudiants
  const exportStudents = useCallback(async (format: 'csv' | 'excel', filters?: StudentFilters) => {
    try {
      const blob = await studentsService.exportStudents(format, filters);
      
      // Déclencher le téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Erreur lors de l\'export:', error);
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || 'Erreur lors de l\'export des étudiants',
      }));
    }
  }, []);

  // Utilitaires
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetFilters = useCallback(() => {
    loadStudents(1);
  }, [loadStudents]);

  // Données mockées pour le fallback
  const loadMockStudents = async (): Promise<Student[]> => {
    return [
      {
        id: '1',
        name: 'Fatou Diop',
        email: 'fatou.diop@notecibolt.com',
        phone: '+221 77 123 45 67',
        address: 'Dakar, Sénégal',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b15e2e6c?w=150',
        role: 'student',
        isActive: true,
        dateOfBirth: '2005-03-15',
        enrollmentDate: '2023-09-01',
        studentId: 'STU001',
        class: {
          id: 'class1',
          name: 'Terminale S',
          level: 'Terminale'
        },
        academicInfo: {
          currentGPA: 15.2,
          totalCredits: 120,
          completedCredits: 95,
          attendanceRate: 96.5
        },
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Moussa Ndiaye',
        email: 'moussa.ndiaye@notecibolt.com',
        phone: '+221 77 234 56 78',
        address: 'Thiès, Sénégal',
        role: 'student',
        isActive: true,
        dateOfBirth: '2004-11-22',
        enrollmentDate: '2022-09-01',
        studentId: 'STU002',
        class: {
          id: 'class2',
          name: 'Première L',
          level: 'Première'
        },
        academicInfo: {
          currentGPA: 14.8,
          totalCredits: 100,
          completedCredits: 85,
          attendanceRate: 93.2
        },
        createdAt: '2022-09-01T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z'
      },
      {
        id: '3',
        name: 'Aïssatou Ba',
        email: 'aissatou.ba@notecibolt.com',
        phone: '+221 77 345 67 89',
        address: 'Saint-Louis, Sénégal',
        role: 'student',
        isActive: true,
        dateOfBirth: '2005-07-08',
        enrollmentDate: '2023-09-01',
        studentId: 'STU003',
        class: {
          id: 'class1',
          name: 'Terminale S',
          level: 'Terminale'
        },
        academicInfo: {
          currentGPA: 16.1,
          totalCredits: 120,
          completedCredits: 98,
          attendanceRate: 98.1
        },
        createdAt: '2023-09-01T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      }
    ];
  };

  // Chargement automatique au démarrage
  useEffect(() => {
    if (autoLoad) {
      testConnection().then(connected => {
        if (connected) {
          loadStudents();
          loadStats();
        } else {
          // Charger les données mockées si pas de connexion
          loadStudents();
          loadStats();
        }
      });
    }
  }, [autoLoad, testConnection, loadStudents, loadStats]);

  const actions: UseStudentsActions = {
    loadStudents,
    loadStats,
    refreshData,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    getStudentsByClass,
    clearError,
    resetFilters,
    importStudents,
    exportStudents,
  };

  return [state, actions];
};
