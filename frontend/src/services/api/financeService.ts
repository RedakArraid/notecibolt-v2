import { apiService } from './apiService';
import type { FinancialRecord } from '../../types';

export const financeService = {
  async getAll(): Promise<FinancialRecord[]> {
    const res = await apiService.get('/finance');
    // On suppose que l'API renvoie { success, data }
    return res.data as FinancialRecord[];
  },
  // Tu pourras ajouter ici create, update, delete, etc.
}; 