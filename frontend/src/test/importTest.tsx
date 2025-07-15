// Test des imports Phase 6
import React from 'react';

// Test des dashboards
import { AdminDashboard } from '../components/Admin/AdminDashboard';
import { TeacherDashboard } from '../components/Teacher/TeacherDashboard';
import { ParentDashboard } from '../components/Parent/ParentDashboard';
import { SupervisorDashboard } from '../components/Supervisor/SupervisorDashboard';
import { StudentDashboard } from '../components/Dashboard/StudentDashboard';

// Test des composants Phase 6
import { ErrorBoundary } from '../components/Error/ErrorBoundary';
import { LoadingSpinner, DashboardSkeleton } from '../components/Loading/LoadingComponents';
import { ComingSoon } from '../components/Fallback/ComingSoon';

// Test des utils
import { globalCache, measureBundleSize } from '../utils/performance';
import { preloadCriticalComponents } from '../utils/lazyComponents';

// Test du store
import { useAuthStore, useAppStore } from '../store';

console.log('✅ Tous les imports Phase 6 sont valides !');

export const TestComponent: React.FC = () => {
  return (
    <div>
      <h1>Test Phase 6 - Tous les imports OK !</h1>
    </div>
  );
};
