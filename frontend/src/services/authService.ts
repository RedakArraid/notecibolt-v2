import { ApiResponse, LoginRequest, LoginResponse, User } from '../types/api';

// Détecter si on est en mode Docker
const isDockerMode = import.meta.env.VITE_DOCKER_MODE === 'true';
const API_BASE_URL = isDockerMode 
  ? 'http://localhost:3001/api/v1'  // Backend Docker via proxy
  : import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

console.log('🐳 AuthService Configuration:', {
  dockerMode: isDockerMode,
  apiBaseUrl: API_BASE_URL,
  environment: import.meta.env.MODE
});

class AuthService {
  private readonly TOKEN_KEY = 'notecibolt_token';
  private readonly REFRESH_TOKEN_KEY = 'notecibolt_refresh_token';
  private readonly USER_KEY = 'notecibolt_user';

  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('🔐 Tentative de connexion:', { email, apiUrl: API_BASE_URL });
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password } as LoginRequest),
      });

      console.log('📡 Réponse API:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });

      if (!response.ok) {
        // Si l'API backend n'est pas disponible, utiliser les comptes mockés
        if (response.status === 0 || !response.status) {
          console.log('⚠️ API backend non disponible, utilisation des comptes mockés');
          return this.mockLogin(email, password);
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<LoginResponse> = await response.json();
      
      if (data.success) {
        this.setTokens(data.data.accessToken, data.data.refreshToken);
        this.setCurrentUser(data.data.user);
        console.log('✅ Connexion API réussie:', data.data.user.name);
        return data.data;
      } else {
        throw new Error(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.log('❌ Erreur API, fallback vers comptes mockés:', error);
      // Fallback vers les comptes mockés si l'API est indisponible
      return this.mockLogin(email, password);
    }
  }

  // Système de fallback avec comptes mockés
  private async mockLogin(email: string, password: string): Promise<LoginResponse> {
    const mockAccounts = [
      {
        email: 'admin@notecibolt.com',
        password: 'admin123',
        user: {
          id: 'mock-admin-1',
          name: 'Marie Dubois',
          email: 'admin@notecibolt.com',
          role: 'admin' as const,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b386?w=150&h=150&fit=crop&crop=face',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        email: 'teacher@notecibolt.com',
        password: 'teacher123',
        user: {
          id: 'mock-teacher-1',
          name: 'Jean Martin',
          email: 'teacher@notecibolt.com',
          role: 'teacher' as const,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        email: 'student@notecibolt.com',
        password: 'student123',
        user: {
          id: 'mock-student-1',
          name: 'Emma Rousseau',
          email: 'student@notecibolt.com',
          role: 'student' as const,
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        email: 'parent@notecibolt.com',
        password: 'parent123',
        user: {
          id: 'mock-parent-1',
          name: 'Pierre Rousseau',
          email: 'parent@notecibolt.com',
          role: 'parent' as const,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        email: 'supervisor@notecibolt.com',
        password: 'supervisor123',
        user: {
          id: 'mock-supervisor-1',
          name: 'Sophie Leroy',
          email: 'supervisor@notecibolt.com',
          role: 'supervisor' as const,
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    ];

    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    const account = mockAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (!account) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const mockResponse: LoginResponse = {
      user: account.user,
      accessToken: `mock-jwt-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`
    };

    this.setTokens(mockResponse.accessToken, mockResponse.refreshToken);
    this.setCurrentUser(mockResponse.user);
    
    console.log('✅ Connexion mockée réussie:', account.user.name);
    return mockResponse;
  }

  async logout(): Promise<void> {
    try {
      // Tenter de déconnecter via l'API si disponible
      if (!import.meta.env.VITE_DOCKER_MODE) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.log('⚠️ Erreur lors de la déconnexion API (mode fallback):', error);
    } finally {
      // Nettoyer le localStorage dans tous les cas
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      console.log('🔓 Déconnexion locale effectuée');
    }
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Méthode pour tester la connectivité API
  async testApiConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      const isConnected = response.ok;
      console.log(`🔗 Test connectivité API: ${isConnected ? '✅ Connecté' : '❌ Déconnecté'}`);
      return isConnected;
    } catch (error) {
      console.log('🔗 Test connectivité API: ❌ Erreur:', error);
      return false;
    }
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

export const authService = new AuthService();