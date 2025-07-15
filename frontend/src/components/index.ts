// Export central de tous les composants Phase 6

// Error handling
export { ErrorBoundary, ErrorMessage, useErrorHandler } from './Error/ErrorBoundary';

// Loading components
export { 
  LoadingSpinner, 
  Loading, 
  PageLoading,
  StatCardSkeleton,
  ListSkeleton,
  TableSkeleton,
  DashboardSkeleton,
  ProfileSkeleton,
  ProgressLoading,
  useLoading
} from './Loading/LoadingComponents';

// Fallback components
export { 
  ComingSoon,
  MessageComingSoon,
  StudentManagementComingSoon,
  AttendanceComingSoon,
  ScheduleComingSoon,
  FinanceComingSoon,
  ReportsComingSoon,
  ModuleError
} from './Fallback/ComingSoon';

// Layout components (déjà existants)
export { Layout } from './Layout/Layout';
export { Header } from './Layout/Header';
export { Sidebar } from './Layout/Sidebar';
export { Breadcrumbs } from './Layout/Breadcrumbs';

// Auth components (déjà existants)
export { EnhancedLoginPage } from './Auth/EnhancedLoginPage';
