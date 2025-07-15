import React from 'react';
import { Construction, ArrowRight, Calendar, CheckCircle } from 'lucide-react';

interface ComingSoonProps {
  moduleName: string;
  description?: string;
  expectedPhase?: number;
  features?: string[];
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  moduleName,
  description,
  expectedPhase = 7,
  features = []
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Icône */}
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
            <Construction className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          {/* Titre */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {moduleName}
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {description || `Le module ${moduleName} sera bientôt disponible. Nous travaillons activement sur son développement.`}
          </p>
          
          {/* Badge de phase */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
            <Calendar className="w-4 h-4" />
            Planifié pour la Phase {expectedPhase}
          </div>
          
          {/* Fonctionnalités prévues */}
          {features.length > 0 && (
            <div className="text-left">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Fonctionnalités prévues :
              </h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Action */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
              En attendant, vous pouvez explorer les autres fonctionnalités disponibles
            </p>
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Versions spécialisées pour différents modules
export const MessageComingSoon: React.FC = () => (
  <ComingSoon
    moduleName="Système de Messagerie"
    description="Un système de communication interne complet avec messagerie temps réel, notifications et gestion des pièces jointes."
    expectedPhase={7}
    features={[
      "Messagerie instantanée",
      "Notifications en temps réel",
      "Pièces jointes et fichiers",
      "Groupes de discussion",
      "Historique des conversations"
    ]}
  />
);

export const StudentManagementComingSoon: React.FC = () => (
  <ComingSoon
    moduleName="Gestion des Élèves"
    description="Interface complète pour gérer les profils des élèves, leurs informations académiques et personnelles."
    expectedPhase={7}
    features={[
      "Profils détaillés des élèves",
      "Gestion des classes",
      "Suivi académique",
      "Import/export de données",
      "Recherche avancée"
    ]}
  />
);

export const AttendanceComingSoon: React.FC = () => (
  <ComingSoon
    moduleName="Gestion des Présences"
    description="Système de pointage électronique avec notifications automatiques et rapports détaillés."
    expectedPhase={7}
    features={[
      "Pointage électronique",
      "Notifications aux parents",
      "Justificatifs d'absence",
      "Rapports de présence",
      "Statistiques par classe"
    ]}
  />
);

export const ScheduleComingSoon: React.FC = () => (
  <ComingSoon
    moduleName="Emploi du Temps"
    description="Planificateur intelligent avec gestion des conflits et synchronisation en temps réel."
    expectedPhase={7}
    features={[
      "Planification interactive",
      "Détection de conflits",
      "Synchronisation multi-utilisateurs",
      "Vue calendrier avancée",
      "Export et partage"
    ]}
  />
);

export const FinanceComingSoon: React.FC = () => (
  <ComingSoon
    moduleName="Gestion Financière"
    description="Module complet pour la gestion des frais de scolarité, paiements et facturation."
    expectedPhase={8}
    features={[
      "Facturation automatique",
      "Suivi des paiements",
      "Échéanciers personnalisés",
      "Relances automatiques",
      "Rapports financiers"
    ]}
  />
);

export const ReportsComingSoon: React.FC = () => (
  <ComingSoon
    moduleName="Rapports et Analytiques"
    description="Générateur de rapports avancé avec visualisations et export de données."
    expectedPhase={8}
    features={[
      "Générateur de rapports",
      "Tableaux de bord analytiques",
      "Visualisations interactives",
      "Export multi-formats",
      "Rapports programmés"
    ]}
  />
);

// Composant générique pour les erreurs de chargement de modules
interface ModuleErrorProps {
  moduleName: string;
  error: Error;
  onRetry?: () => void;
}

export const ModuleError: React.FC<ModuleErrorProps> = ({
  moduleName,
  error,
  onRetry
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-red-200 dark:border-red-800 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <Construction className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Erreur de chargement
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Le module {moduleName} n'a pas pu être chargé.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-3 mb-6 text-left">
              <p className="text-xs text-red-600 dark:text-red-400 font-mono">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                Réessayer
              </button>
            )}
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
