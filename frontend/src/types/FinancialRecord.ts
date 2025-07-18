export interface FinancialRecord {
  id: string;
  studentId: string;
  type: 'tuition' | 'fees' | 'materials' | 'transport' | 'meals' | 'other';
  amount: number;
  currency: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  description: string;
  invoiceNumber: string;
  createdAt: string;
  paidDate?: string;
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'mobile_money' | string;
} 