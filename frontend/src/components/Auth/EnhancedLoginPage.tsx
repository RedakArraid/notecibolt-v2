import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { User, Lock, Eye, EyeOff, ArrowRight, Users, Shield, GraduationCap, Heart, UserCheck, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export const EnhancedLoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Comptes de démonstration (temporaire, en attendant l'API)
  const demoAccounts = [
    {
      id: 'admin',
      name: 'Marie Dubois',
      email: 'admin@notecibolt.com',
      password: 'admin123',
      role: 'admin',
      description: 'Administrateur système',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b386?w=150&h=150&fit=crop&crop=face',
      icon: Shield,
      color: 'red'
    },
    {
      id: 'teacher',
      name: 'Jean Martin',
      email: 'teacher@notecibolt.com',
      password: 'teacher123',
      role: 'teacher',
      description: 'Professeur de Mathématiques',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      icon: GraduationCap,
      color: 'blue'
    },
    {
      id: 'student',
      name: 'Emma Rousseau',
      email: 'student@notecibolt.com',
      password: 'student123',
      role: 'student',
      description: 'Élève de Terminale S',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      icon: User,
      color: 'green'
    },
    {
      id: 'parent',
      name: 'Pierre Rousseau',
      email: 'parent@notecibolt.com',
      password: 'parent123',
      role: 'parent',
      description: 'Parent d\'élève',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      icon: Heart,
      color: 'purple'
    },
    {
      id: 'supervisor',
      name: 'Sophie Leroy',
      email: 'supervisor@notecibolt.com',
      password: 'supervisor123',
      role: 'supervisor',
      description: 'Superviseur académique',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      icon: UserCheck,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-600 dark:text-red-400',
        button: 'bg-red-600 hover:bg-red-700'
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        button: 'bg-green-600 hover:bg-green-700'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-600 dark:text-purple-400',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-600 dark:text-orange-400',
        button: 'bg-orange-600 hover:bg-orange-700'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await login({ email, password });
      setSuccess('Connexion réussie !');
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (account: any) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await login({ email: account.email, password: account.password });
      setSuccess(`Connexion réussie ! Bienvenue ${account.name}`);
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (account: any) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">NC</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              NoteCibolt v2
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Système de gestion scolaire moderne
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500">
            Connectez-vous avec vos identifiants ou testez nos comptes de démonstration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Connexion sécurisée
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Accédez à votre espace personnel
              </p>
            </div>

            {/* Messages d'état */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300">{success}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="votre.email@notecibolt.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Votre mot de passe"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Se souvenir de moi</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  disabled={isLoading}
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Comptes de test disponibles
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Utilisez ces comptes pour tester toutes les fonctionnalités
              </p>
            </div>

            <div className="space-y-4">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                const colors = getColorClasses(account.color);
                
                return (
                  <div
                    key={account.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${colors.bg} ${colors.border} border-2 rounded-full flex items-center justify-center`}>
                          <Icon className={`w-3 h-3 ${colors.text}`} />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {account.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {account.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {account.email}
                          </code>
                          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {account.password}
                          </code>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleQuickLogin(account)}
                          disabled={isLoading}
                          className={`px-4 py-2 ${colors.button} text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50`}
                        >
                          {isLoading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            'Connexion directe'
                          )}
                        </button>
                        <button
                          onClick={() => fillCredentials(account)}
                          disabled={isLoading}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                          Remplir le formulaire
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Authentification sécurisée
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Système d'authentification complet avec JWT et gestion de sessions.
                  </p>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• Tokens JWT avec refresh automatique</li>
                    <li>• Contrôle d'accès basé sur les rôles</li>
                    <li>• API backend sécurisée</li>
                    <li>• Interface adaptée à chaque profil</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};