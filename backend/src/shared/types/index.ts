// Types communs utilisés dans toute l'application

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationError[];
  pagination?: PaginationInfo;
  meta?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  q?: string;
  filters?: Record<string, any>;
}

// Types pour les fichiers
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface FileInfo {
  id: string;
  name: string;
  originalName: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  createdAt: Date;
}

// Types pour les statistiques
export interface StatisticData {
  label: string;
  value: number;
  percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// Types pour les notifications
export interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'academic' | 'attendance' | 'financial' | 'administrative' | 'social';
  actionRequired?: boolean;
  actionUrl?: string;
  channels: ('email' | 'sms' | 'push' | 'in_app')[];
}

// Types pour les permissions
export interface Permission {
  resource: string;
  actions: string[];
}

export interface Role {
  name: string;
  permissions: Permission[];
}

// Types pour les audits
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Types pour les rapports
export interface ReportParams {
  type: string;
  startDate?: Date;
  endDate?: Date;
  filters?: Record<string, any>;
  format?: 'json' | 'pdf' | 'excel' | 'csv';
}

export interface ReportData {
  title: string;
  description: string;
  generatedAt: Date;
  generatedBy: string;
  data: any;
  summary?: Record<string, any>;
}

// Types pour les paramètres système
export interface SystemSettings {
  schoolName: string;
  schoolLogo?: string;
  academicYear: string;
  currentSemester: string;
  timezone: string;
  language: string;
  currency: string;
  features: {
    achievements: boolean;
    virtualClasses: boolean;
    finance: boolean;
    messaging: boolean;
    reports: boolean;
  };
  integrations: {
    email: boolean;
    sms: boolean;
    paymentGateway: boolean;
    videoConference: boolean;
  };
}

// Types pour les événements
export interface EventData {
  type: string;
  payload: any;
  userId?: string;
  timestamp: Date;
}

// Types pour la géolocalisation
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

// Types pour les horaires
export interface TimeSlot {
  startTime: string; // Format HH:MM
  endTime: string;   // Format HH:MM
  duration: number;  // en minutes
}

export interface WeeklySchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

// Types pour les communications
export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  type: 'email' | 'sms' | 'notification';
  category: string;
}

// Types pour les évaluations
export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number; // Pourcentage de la note finale
  rubric?: RubricLevel[];
}

export interface RubricLevel {
  level: number;
  description: string;
  points: number;
}

// Types pour les compétences
export interface CompetencyLevel {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
}

// Types pour les processus d'admission
export interface AdmissionStep {
  id: string;
  name: string;
  description: string;
  required: boolean;
  order: number;
  estimatedDuration: number; // en jours
  dependencies?: string[];
  documents?: string[];
  responsible: 'admin' | 'teacher' | 'parent' | 'student';
}

// Types pour les analyses
export interface AnalyticsData {
  metric: string;
  value: number;
  unit?: string;
  period: {
    start: Date;
    end: Date;
  };
  comparison?: {
    value: number;
    period: {
      start: Date;
      end: Date;
    };
    change: number;
    changeType: 'increase' | 'decrease' | 'stable';
  };
}

// Types pour les intégrations externes
export interface ExternalIntegration {
  id: string;
  name: string;
  type: 'lms' | 'payment' | 'communication' | 'analytics' | 'storage';
  enabled: boolean;
  config: Record<string, any>;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

// Types pour la sécurité
export interface SecurityEvent {
  type: 'login_attempt' | 'password_change' | 'data_access' | 'permission_change';
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  success: boolean;
  reason?: string;
  createdAt: Date;
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo?: string;
  ipAddress?: string;
  location?: Location;
  isActive: boolean;
  lastActivity: Date;
  expiresAt: Date;
}

// Types pour les sauvegardes
export interface BackupInfo {
  id: string;
  type: 'full' | 'incremental';
  status: 'in_progress' | 'completed' | 'failed';
  size?: number;
  location: string;
  createdAt: Date;
  completedAt?: Date;
}

// Types pour les tâches en arrière-plan
export interface BackgroundJob {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  data?: any;
  result?: any;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export default {};
