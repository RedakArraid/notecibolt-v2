import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, Settings, Sun, Moon, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuthStore, useAppStore } from '../../store';
import { useNavigation } from '../../router/ProtectedRoute';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useAppStore();
  const { pageTitle } = useNavigation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadMessages = 3; // Temporaire, sera remplacé par les données API
  const unreadNotifications = 2; // Temporaire

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administratrice';
      case 'teacher': return 'Enseignant';
      case 'student': return 'Élève';
      case 'parent': return 'Parent';
      case 'supervisor': return 'Superviseur';
      default: return 'Utilisateur';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">NC</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Phase 6 • Router SPA</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Toggle thème */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Messages */}
        <Link
          to="/messages"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          title="Messages"
        >
          <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </Link>

        {/* Notifications */}
        <button 
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </button>

        {/* Paramètres */}
        <Link
          to="/settings"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Paramètres"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>

        {/* Profil utilisateur */}
        <div className="relative ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || 'Utilisateur'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role ? getRoleDisplayName(user.role) : 'Invité'}
              </div>
            </div>
            <img
              src={user?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`}
              alt={user?.name || 'Avatar'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
            />
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          {/* Menu déroulant utilisateur */}
          {userMenuOpen && (
            <>
              {/* Overlay pour fermer le menu */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setUserMenuOpen(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                <Link
                  to="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Mon profil
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Paramètres
                </Link>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
