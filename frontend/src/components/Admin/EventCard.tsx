import React from 'react';
import { Users, DollarSign, AlertTriangle, Award, Clock } from 'lucide-react';

interface EventCardProps {
  event: {
    id: string;
    type: 'admission' | 'payment' | 'incident' | 'achievement';
    title: string;
    description: string;
    time: string;
    icon: string;
    color: string;
  };
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'DollarSign': return DollarSign;
      case 'AlertTriangle': return AlertTriangle;
      case 'Award': return Award;
      default: return Clock;
    }
  };

  const getEventColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const Icon = getEventIcon(event.icon);

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getEventColor(event.color)}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
          {event.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {event.description}
        </p>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          Il y a {event.time}
        </span>
      </div>
    </div>
  );
};
