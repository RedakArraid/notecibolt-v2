import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({ error, errorInfo });
    
    // Appeler le callback d'erreur si fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log vers un service d'erreur (Sentry, LogRocket, etc.)
    // this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Intégration future avec service de logging
    console.log('Logging error to service:', { error, errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Utiliser le fallback personnalisé si fourni
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Interface d'erreur par défaut
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Oops ! Quelque chose s'est mal passé
                </h1>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Une erreur inattendue s'est produite. Nos équipes ont été notifiées.
                </p>

                {/* Détails de l'erreur en mode développement */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                      Détails de l'erreur :
                    </h3>
                    <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all">
                      {this.state.error.message}
                    </p>
                    {this.state.errorInfo && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                          Stack trace
                        </summary>
                        <pre className="text-xs text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap overflow-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={this.handleRetry}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Réessayer
                  </button>
                  
                  <button
                    onClick={this.handleGoHome}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    Accueil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pour capturer les erreurs dans les composants fonctionnels
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // Log vers service d'erreur
    // logErrorToService(error, errorInfo);
  }, []);

  return handleError;
};

// Composant d'erreur simple pour les cas spécifiques
interface ErrorMessageProps {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: 'error' | 'warning' | 'info';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Erreur",
  message,
  action,
  type = 'error'
}) => {
  const iconColors = {
    error: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20',
    warning: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20',
    info: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[type]}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {message}
          </p>
          
          {action && (
            <button
              onClick={action.onClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
