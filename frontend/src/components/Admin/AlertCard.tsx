import React from 'react';
import { AlertTriangle, DollarSign, BookOpen, Users, Wrench } from 'lucide-react';

interface AlertCardProps {
  alert: {
    id: string;
    type: 'financial' | 'academic' | 'staff' | 'infrastructure';
    severity: 'high' | 'medium' | 'low';
    title: string;
    message: string;
    count: number;
    action: string;
  };
  onActionClick?: (alertId: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onActionClick }) => {
  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      case 'medium': return 'bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300';
      case 'low': return 'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      default: return 'bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'financial': return DollarSign;
      case 'academic': return BookOpen;
      case 'staff': return Users;
      case 'infrastructure': return Wrench;
      default: return AlertTriangle;
    }
  };

  const Icon = getAlertIcon(alert.type);

  return (
    <div className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold">{alert.title}</h4>
              {alert.count > 1 && (
                <span className="px-2 py-1 bg-white/50 rounded-full text-xs font-medium">
                  {alert.count}
                </span>
              )}
            </div>
            <p className="text-sm opacity-90">{alert.message}</p>
          </div>
        </div>
        <button 
          onClick={() => onActionClick?.(alert.id)}
          className="ml-4 px-3 py-1 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
        >
          {alert.action}
        </button>
      </div>
    </div>
  );
};
