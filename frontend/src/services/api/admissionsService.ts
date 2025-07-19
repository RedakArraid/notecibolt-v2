import { apiService } from './apiService';

export const admissionsService = {
  async getAll() {
    const res = await apiService.get('/admissions');
    return res.data;
  },
  // Tu pourras ajouter ici create, update, delete, etc.
  async create(data) {
    const res = await apiService.post('/admissions', data);
    return res.data;
  },
  async update(id, data) {
    const res = await apiService.patch(`/admissions/${id}`, data);
    return res.data;
  },
}; 