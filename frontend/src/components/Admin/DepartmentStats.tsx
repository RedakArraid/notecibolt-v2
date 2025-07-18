import React from 'react';
import { BookOpen, Users, Award } from 'lucide-react';

interface DepartmentStatsProps {
  departments: Array<{
    name: string;
    teachers: number;
    students: number;
    averageGrade: number;
    satisfaction: number;
    color: string;
  }>;
}

export const DepartmentStats: React.FC<DepartmentStatsProps> = ({ departments }) => {
  const getDepartmentColor = (color: string) => {
    const colors = {
      blue: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
      green: 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
      purple: 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20',
      orange: 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20',
      red: 'border-l-red-500 bg-red-50 dark:bg-red-900/20'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Performance par département
      </h3>
      
      <div className="space-y-4">
        {departments.map((dept, index) => (
          <div key={index} className={`p-4 rounded-lg border-l-4 ${getDepartmentColor(dept.color)}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">{dept.name}</h4>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {dept.averageGrade}/20
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Moyenne</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {dept.teachers}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Enseignants
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {dept.students}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Élèves
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {dept.satisfaction}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
