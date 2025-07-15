import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from './Breadcrumbs';
import { useAppStore } from '../../store';
import { useNavigation } from '../../router/ProtectedRoute';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { currentSection, userRole } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentSection={currentSection}
          userRole={userRole}
        />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
          />
          
          {/* Breadcrumbs */}
          <Breadcrumbs />
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
