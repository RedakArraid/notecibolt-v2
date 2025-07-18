import React from 'react';
import { TrendingUp } from 'lucide-react';

interface FinancialMetricsProps {
  financialData: {
    totalRevenue: number;
    pendingPayments: number;
    monthlyExpenses: number;
    profitMargin: number;
    budgetUtilization: number;
  };
}

export const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ financialData }) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Performance financière
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatAmount(financialData.totalRevenue)}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">Revenus totaux</div>
        </div>
        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {formatAmount(financialData.pendingPayments)}
          </div>
          <div className="text-sm text-orange-700 dark:text-orange-300">En attente</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Marge bénéficiaire</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {financialData.profitMargin}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Utilisation budget</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {financialData.budgetUtilization}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${financialData.budgetUtilization}%` }}
          />
        </div>
      </div>
    </div>
  );
};
