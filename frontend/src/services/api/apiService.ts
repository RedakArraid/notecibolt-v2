import { authService } from '../authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = authService.getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async get(endpoint: string) {
    return this.makeRequest(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data: any) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.makeRequest(endpoint, { method: 'DELETE' });
  }

  async patch(endpoint: string, data: any) {
    return this.makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
