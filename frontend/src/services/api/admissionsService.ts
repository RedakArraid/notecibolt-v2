import { apiService } from './apiService';

export const admissionsService = {
  async getAll() {
    const res = await apiService.get('/admissions');
    return res.data;
  },
  // Tu pourras ajouter ici create, update, delete, etc.
}; 