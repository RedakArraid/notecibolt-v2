import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  BarChart3,
  Users,
  Settings,
  Award,
  X,
  UserPlus,
  ClipboardCheck,
  CreditCard,
  Clock,
  FileText,
  Video,
  Library,
  Monitor,
  LogOut,
  Eye,
  DollarSign,
  Phone,
  Bell,
  Heart,
  GraduationCap,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { type User } from '../../store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string;
  userRole?: User['role'];
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: string;
}

// Définition des menus par rôle avec chemins de route
const getMenuItemsByRole = (role: User['role']): MenuItem[] => {
  switch (role) {
    case 'admin':
      return [
        { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/admin' },
        { id: 'users', label: 'Gestion des utilisateurs', icon: Users, path: '/admin/students' },
        { id: 'admissions', label: 'Gestion des admissions', icon: FileText, path: '/admin/admissions' },
        { id: 'finance', label: 'Gestion financière', icon: CreditCard, path: '/admin/finance' },
        { id: 'reports', label: 'Rapports', icon: FileText, path: '/admin/reports' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages', badge: '3' },
        { id: 'settings', label: 'Paramètres', icon: Settings, path: '/settings' }
      ];

    case 'teacher':
      return [
        { id: 'dashboard', label: 'Mon tableau de bord', icon: Home, path: '/teacher' },
        { id: 'grades', label: 'Gestion des notes', icon: BarChart3, path: '/teacher/grades' },
        { id: 'assignments', label: 'Devoirs', icon: BookOpen, path: '/teacher/assignments' },
        { id: 'attendance', label: 'Présences', icon: ClipboardCheck, path: '/teacher/attendance' },
        { id: 'schedule', label: 'Emploi du temps', icon: Calendar, path: '/teacher/schedule' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages', badge: '2' },
        { id: 'profile', label: 'Mon profil', icon: Users, path: '/profile' },
        { id: 'settings', label: 'Paramètres', icon: Settings, path: '/settings' }
      ];

    case 'student':
      return [
        { id: 'dashboard', label: 'Mon tableau de bord', icon: Home, path: '/student' },
        { id: 'grades', label: 'Mes notes', icon: BarChart3, path: '/student/grades' },
        { id: 'assignments', label: 'Mes devoirs', icon: BookOpen, path: '/student/assignments' },
        { id: 'schedule', label: 'Mon emploi du temps', icon: Calendar, path: '/student/schedule' },
        { id: 'achievements', label: 'Mes réussites', icon: Award, path: '/student/achievements' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages', badge: '1' },
        { id: 'profile', label: 'Mon profil', icon: Users, path: '/profile' },
        { id: 'settings', label: 'Paramètres', icon: Settings, path: '/settings' }
      ];

    case 'parent':
      return [
        { id: 'dashboard', label: 'Suivi de mes enfants', icon: Home, path: '/parent' },
        { id: 'grades', label: 'Notes des enfants', icon: BarChart3, path: '/parent/grades' },
        { id: 'attendance', label: 'Présences', icon: ClipboardCheck, path: '/parent/attendance' },
        { id: 'finance', label: 'Finances', icon: CreditCard, path: '/parent/finance' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages', badge: '4' },
        { id: 'profile', label: 'Mon profil', icon: Users, path: '/profile' },
        { id: 'settings', label: 'Paramètres', icon: Settings, path: '/settings' }
      ];

    case 'supervisor':
      return [
        { id: 'dashboard', label: 'Centre de surveillance', icon: Shield, path: '/supervisor' },
        { id: 'incidents', label: 'Gestion des incidents', icon: Bell, path: '/supervisor/incidents' },
        { id: 'attendance', label: 'Contrôle présences', icon: Eye, path: '/supervisor/attendance' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
        { id: 'profile', label: 'Mon profil', icon: Users, path: '/profile' },
        { id: 'settings', label: 'Paramètres', icon: Settings, path: '/settings' }
      ];

    default:
      return [
        { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/student' }
      ];
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentSection,
  userRole = 'student'
}) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const menuItems = getMenuItemsByRole(userRole);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getRoleDisplayName = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Administratrice';
      case 'teacher': return 'Enseignant';
      case 'student': return 'Élève';
      case 'parent': return 'Parent';
      case 'supervisor': return 'Superviseur';
      default: return 'Utilisateur';
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'from-indigo-500 to-purple-600';
      case 'teacher': return 'from-blue-500 to-indigo-600';
      case 'student': return 'from-blue-400 to-purple-500';
      case 'parent': return 'from-purple-500 to-pink-600';
      case 'supervisor': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          border-r border-gray-200 dark:border-gray-700
          flex flex-col
        `}
      >
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${getRoleColor(userRole)} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">NoteCibolt</h2>
                <p className="text-xs text-white/80">v2.0 SPA</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-white/20 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Profil utilisateur */}
          {user && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-white/70">{getRoleDisplayName(user.role)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
          
          {/* Version info */}
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Phase 6 • Router SPA
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
