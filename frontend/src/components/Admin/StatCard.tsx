import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'stable';
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'up',
  color
}) => {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    };
    return colors[color] || colors.blue;
  };

  const getTrendColor = (direction: string) => {
    if (direction === 'up') return 'text-green-600';
    if (direction === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const TrendIcon = trendDirection === 'up' ? TrendingUp : 
                   trendDirection === 'down' ? TrendingDown : Minus;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2">
          <TrendIcon className={`w-4 h-4 ${getTrendColor(trendDirection)}`} />
          <span className={`text-sm font-medium ${getTrendColor(trendDirection)}`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};
