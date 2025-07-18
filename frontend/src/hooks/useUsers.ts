import { useState, useCallback, useEffect } from 'react';
import { usersService, UserFilters, CreateUserRequest, UpdateUserRequest } from '../services/api/usersService';
import { User } from '../types/api';

interface UseUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  stats: any;
}

interface UseUsersActions {
  loadUsers: (page?: number, filters?: UserFilters) => Promise<void>;
  createUser: (data: CreateUserRequest) => Promise<void>;
  updateUser: (id: string, data: UpdateUserRequest) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  searchUsers: (query: string, filters?: Omit<UserFilters, 'search'>) => Promise<User[]>;
  loadStats: () => Promise<void>;
  clearError: () => void;
}

const initialState: UseUsersState = {
  users: [],
  loading: false,
  error: null,
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  hasMore: false,
  stats: null,
};

export const useUsers = (autoLoad = true): [UseUsersState, UseUsersActions] => {
  const [state, setState] = useState<UseUsersState>(initialState);

  const loadUsers = useCallback(async (page = 1, filters?: UserFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await usersService.getUsers(page, 20, filters);
      setState(prev => ({
        ...prev,
        users: response.data,
        totalCount: response.pagination?.totalCount || 0,
        totalPages: response.pagination?.totalPages || 1,
        currentPage: response.pagination?.currentPage || 1,
        hasMore: response.pagination?.hasMore || false,
        loading: false,
      }));
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message || 'Erreur lors du chargement des utilisateurs' }));
    }
  }, []);

  const createUser = useCallback(async (data: CreateUserRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await usersService.createUser(data);
      await loadUsers(state.currentPage);
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message || 'Erreur lors de la création' }));
    }
  }, [loadUsers, state.currentPage]);

  const updateUser = useCallback(async (id: string, data: UpdateUserRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await usersService.updateUser(id, data);
      await loadUsers(state.currentPage);
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message || 'Erreur lors de la modification' }));
    }
  }, [loadUsers, state.currentPage]);

  const deleteUser = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await usersService.deleteUser(id);
      await loadUsers(state.currentPage);
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message || 'Erreur lors de la suppression' }));
    }
  }, [loadUsers, state.currentPage]);

  const searchUsers = useCallback(async (query: string, filters?: Omit<UserFilters, 'search'>) => {
    try {
      const response = await usersService.searchUsers(query, filters);
      return response.data;
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message || 'Erreur lors de la recherche' }));
      return [];
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const response = await usersService.getUserStats();
      setState(prev => ({ ...prev, stats: response.data }));
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message || 'Erreur lors du chargement des stats' }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadUsers();
      loadStats();
    }
  }, [autoLoad, loadUsers, loadStats]);

  const actions: UseUsersActions = {
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    loadStats,
    clearError,
  };

  return [state, actions];
}; 