import { apiService } from './apiService';
import { User } from '../../types/api';

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  classId?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  [key: string]: any;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {}

class UsersService {
  private readonly baseUrl = '/users';

  async getUsers(page = 1, limit = 20, filters?: UserFilters) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(filters?.search ? { search: filters.search } : {}),
      ...(filters?.role ? { role: filters.role } : {}),
      ...(filters?.isActive !== undefined ? { isActive: String(filters.isActive) } : {}),
      ...(filters?.sortBy ? { sortBy: filters.sortBy } : {}),
      ...(filters?.sortOrder ? { sortOrder: filters.sortOrder } : {}),
    }).toString();
    const response = await apiService.get(`${this.baseUrl}?${params}`);
    return response;
  }

  async getUserById(id: string) {
    return apiService.get(`${this.baseUrl}/${id}`);
  }

  async createUser(data: CreateUserRequest) {
    return apiService.post(this.baseUrl, data);
  }

  async updateUser(id: string, data: UpdateUserRequest) {
    return apiService.put(`${this.baseUrl}/${id}`, data);
  }

  async deleteUser(id: string) {
    return apiService.delete(`${this.baseUrl}/${id}`);
  }

  async getUserStats() {
    return apiService.get(`${this.baseUrl}/stats`);
  }

  async searchUsers(query: string, filters?: Omit<UserFilters, 'search'>) {
    const params = new URLSearchParams({
      q: query,
      ...(filters?.role ? { role: filters.role } : {}),
      ...(filters?.isActive !== undefined ? { isActive: String(filters.isActive) } : {}),
    }).toString();
    return apiService.get(`${this.baseUrl}/search?${params}`);
  }
}

export const usersService = new UsersService(); 