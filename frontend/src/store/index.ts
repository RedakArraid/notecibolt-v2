import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'supervisor';
  avatar?: string;
  permissions?: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  // Actions
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

interface AppState {
  // Navigation
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // API Status
  apiConnected: boolean | null;
  setApiConnected: (connected: boolean | null) => void;
  
  // Messages state
  readMessages: Set<string>;
  markMessageAsRead: (messageId: string) => void;
  isMessageRead: (messageId: string) => boolean;
  
  // Dashboard refresh trigger
  dashboardVersion: number;
  triggerDashboardRefresh: () => void;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
  }>;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Store d'authentification avec persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          // Simulation d'authentification - à remplacer par vraie API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Déterminer le rôle basé sur l'email
          let role: User['role'] = 'student';
          if (credentials.email.includes('admin')) role = 'admin';
          else if (credentials.email.includes('teacher')) role = 'teacher';
          else if (credentials.email.includes('parent')) role = 'parent';
          else if (credentials.email.includes('supervisor')) role = 'supervisor';

          const user: User = {
            id: '1',
            name: credentials.email.includes('admin') ? 'Marie Dubois' :
                  credentials.email.includes('teacher') ? 'Jean-Baptiste Traoré' :
                  credentials.email.includes('parent') ? 'Famille Diallo' :
                  credentials.email.includes('supervisor') ? 'Amadou Koné' :
                  'Aicha Diallo',
            email: credentials.email,
            role,
            avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000)}?w=400`
          };

          const token = 'mock_jwt_token_' + Date.now();
          
          set({
            user,
            isAuthenticated: true,
            token,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null
        });
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'notecibolt-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token
      })
    }
  )
);

// Store principal de l'application avec persistence pour les messages lus
export const useAppStore = create<AppState>()((
  persist(
    (set, get) => ({
      // Navigation
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Theme
      theme: (typeof window !== 'undefined' && localStorage.getItem('theme')) || (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
      toggleTheme: () => set(state => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (typeof window !== 'undefined') {
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          }
        }
        return { theme: newTheme };
      }),

      // API Status
      apiConnected: null,
      setApiConnected: (connected) => set({ apiConnected: connected }),

      // Messages state
      readMessages: new Set<string>(),
      markMessageAsRead: (messageId) => set(state => {
        const newState = {
          readMessages: new Set([...state.readMessages, messageId]),
          dashboardVersion: state.dashboardVersion + 1 // Trigger dashboard refresh
        };
        return newState;
      }),
      isMessageRead: (messageId) => get().readMessages.has(messageId),

      // Dashboard refresh trigger
      dashboardVersion: 0,
      triggerDashboardRefresh: () => set(state => ({
        dashboardVersion: state.dashboardVersion + 1
      })),

      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = {
          ...notification,
          id,
          timestamp: new Date()
        };
        set(state => ({
          notifications: [newNotification, ...state.notifications].slice(0, 10) // Garder les 10 dernières
        }));
        
        // Auto-remove après 5 secondes pour les notifications success/info
        if (['success', 'info'].includes(notification.type)) {
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        }
      },
      removeNotification: (id) => set(state => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'notecibolt-app',
      partialize: (state) => ({
        theme: state.theme,
        readMessages: Array.from(state.readMessages) // Convertir Set en Array pour la sérialisation
      }),
      // Reconstituer le Set à partir de l'Array lors du chargement
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray((state as any).readMessages)) {
          state.readMessages = new Set((state as any).readMessages);
        }
      }
    }
  )
));

// Sélecteurs utiles
export const selectUser = (state: AuthState) => state.user;
export const selectUserRole = (state: AuthState) => state.user?.role;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
