import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-500',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800'
  },
  green: {
    bg: 'bg-green-500',
    lightBg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800'
  },
  purple: {
    bg: 'bg-purple-500',
    lightBg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800'
  },
  orange: {
    bg: 'bg-orange-500',
    lightBg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800'
  },
  red: {
    bg: 'bg-red-500',
    lightBg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800'
  }
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color
}) => {
  const styles = colorStyles[color];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 ${styles.lightBg} ${styles.border} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${styles.text}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </h3>
              {trend && (
                <div className={`text-xs flex items-center gap-1 ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span>{trend.isPositive ? '↗' : '↘'}</span>
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </div>
          {subtitle && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
