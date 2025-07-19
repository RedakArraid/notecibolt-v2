import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Plus, Edit, Trash2 } from 'lucide-react';
// TODO: Adapter l'import des types et des données mockées pour la v2
// import { Schedule } from '../../types';
// import { schedules } from '../../data/mockData';

export const ScheduleManagement: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week
  const [selectedClass, setSelectedClass] = useState('class-terminale-s');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const daysOfWeek = [
    'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Mock schedule data for the week (à remplacer par appel API plus tard)
  const weekSchedule = [
    // Lundi
    {
      id: 'sched-1',
      classId: 'class-terminale-s',
      teacherId: 'teacher-1',
      teacherName: 'M. Martin',
      subject: 'Mathématiques',
      room: 'Salle 201',
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '10:00',
      duration: 120,
      academicYear: '2024-2025',
      semester: 'S1'
    },
    {
      id: 'sched-2',
      classId: 'class-terminale-s',
      teacherId: 'teacher-2',
      teacherName: 'Mme Leroy',
      subject: 'Français',
      room: 'Salle 105',
      dayOfWeek: 1,
      startTime: '10:15',
      endTime: '12:15',
      duration: 120,
      academicYear: '2024-2025',
      semester: 'S1'
    },
    // Mardi
    {
      id: 'sched-3',
      classId: 'class-terminale-s',
      teacherId: 'teacher-1',
      teacherName: 'M. Martin',
      subject: 'Physique-Chimie',
      room: 'Labo 1',
      dayOfWeek: 2,
      startTime: '09:00',
      endTime: '11:00',
      duration: 120,
      academicYear: '2024-2025',
      semester: 'S1'
    },
    {
      id: 'sched-4',
      classId: 'class-terminale-s',
      teacherId: 'teacher-2',
      teacherName: 'Mme Leroy',
      subject: 'Français',
      room: 'Salle 105',
      dayOfWeek: 2,
      startTime: '14:00',
      endTime: '16:00',
      duration: 120,
      academicYear: '2024-2025',
      semester: 'S1'
    },
    // Mercredi
    {
      id: 'sched-5',
      classId: 'class-terminale-s',
      teacherId: 'teacher-1',
      teacherName: 'M. Martin',
      subject: 'Mathématiques',
      room: 'Salle 201',
      dayOfWeek: 3,
      startTime: '08:00',
      endTime: '10:00',
      duration: 120,
      academicYear: '2024-2025',
      semester: 'S1'
    }
  ];

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathématiques': 'bg-red-100 text-red-800 border-red-200',
      'Français': 'bg-green-100 text-green-800 border-green-200',
      'Physique-Chimie': 'bg-blue-100 text-blue-800 border-blue-200',
      'Anglais': 'bg-purple-100 text-purple-800 border-purple-200',
      'Histoire-Géo': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'SVT': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTimeSlotIndex = (time: string) => {
    return timeSlots.indexOf(time);
  };

  const getCourseDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des emplois du temps
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Planification et organisation des cours
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Nouveau cours
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Importer
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Classe:
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="class-terminale-s">Terminale S1</option>
                <option value="class-premiere-s">Première S1</option>
                <option value="class-seconde-a">Seconde A</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Semaine:
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={-1}>Semaine précédente</option>
                <option value={0}>Semaine actuelle</option>
                <option value={1}>Semaine suivante</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'day'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Jour
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-8 bg-gray-50 dark:bg-gray-700/50">
              <div className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600">
                Horaires
              </div>
              {daysOfWeek.slice(1, 6).map((day, index) => (
                <div key={day} className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 text-center border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Time slots */}
            {timeSlots.slice(0, -1).map((time, timeIndex) => (
              <div key={time} className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                <div className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
                  {time}
                </div>
                {[1, 2, 3, 4, 5].map((dayOfWeek) => {
                  const coursesInSlot = weekSchedule.filter(course => {
                    const courseStartIndex = getTimeSlotIndex(course.startTime);
                    const courseEndIndex = getTimeSlotIndex(course.endTime);
                    return course.dayOfWeek === dayOfWeek && 
                           timeIndex >= courseStartIndex && 
                           timeIndex < courseEndIndex;
                  });

                  return (
                    <div key={dayOfWeek} className="relative min-h-[60px] border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                      {coursesInSlot.map((course) => {
                        const isFirstSlot = timeIndex === getTimeSlotIndex(course.startTime);
                        if (!isFirstSlot) return null;

                        const duration = getCourseDuration(course.startTime, course.endTime);
                        const height = duration * 60; // 60px per hour

                        return (
                          <div
                            key={course.id}
                            className={`absolute inset-x-1 top-1 rounded-lg border-l-4 p-2 ${getSubjectColor(course.subject)} hover:shadow-md transition-shadow cursor-pointer group`}
                            style={{ height: `${height - 8}px` }}
                          >
                            <div className="text-xs font-semibold mb-1">
                              {course.subject}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {course.teacherName} • {course.room}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs">
                                {course.startTime} - {course.endTime}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 