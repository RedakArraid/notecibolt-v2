import React, { useState } from 'react';
import { 
  CheckCircle, Clock, AlertTriangle, User, FileText, Calendar, 
  Phone, Mail, MapPin, Edit, Trash2, Plus, ArrowRight, ArrowLeft,
  Download, Upload, Eye, MessageSquare, Star, Flag
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
  documents?: string[];
  notes?: string;
  estimatedDuration: number; // en jours
}

interface AdmissionWorkflowProps {
  applicationId: string;
  onStepUpdate?: (stepId: string, status: string) => void;
}

export const AdmissionWorkflow: React.FC<AdmissionWorkflowProps> = ({ 
  applicationId, 
  onStepUpdate 
}) => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);

  // Workflow standard d'admission
  const workflowSteps: WorkflowStep[] = [
    {
      id: 'step-1',
      name: 'Réception du dossier',
      description: 'Vérification de la complétude du dossier de candidature',
      status: 'completed',
      assignedTo: 'Secrétariat',
      completedAt: '2025-01-10T10:00:00Z',
      estimatedDuration: 1,
      documents: ['Fiche inscription', 'Extrait naissance', 'Bulletins']
    },
    {
      id: 'step-2',
      name: 'Vérification documents',
      description: 'Contrôle de l\'authenticité et validité des documents',
      status: 'completed',
      assignedTo: 'Administration',
      completedAt: '2025-01-11T14:30:00Z',
      estimatedDuration: 2,
      notes: 'Tous les documents sont conformes'
    },
    {
      id: 'step-3',
      name: 'Évaluation académique',
      description: 'Analyse du dossier scolaire et des résultats',
      status: 'in_progress',
      assignedTo: 'Directeur pédagogique',
      dueDate: '2025-01-20T17:00:00Z',
      estimatedDuration: 3,
      notes: 'Bon niveau général, quelques lacunes en mathématiques'
    },
    {
      id: 'step-4',
      name: 'Entretien famille',
      description: 'Rencontre avec les parents et l\'élève candidat',
      status: 'pending',
      assignedTo: 'Directrice',
      dueDate: '2025-01-25T10:00:00Z',
      estimatedDuration: 1
    },
    {
      id: 'step-5',
      name: 'Test de niveau',
      description: 'Évaluation des compétences dans les matières principales',
      status: 'pending',
      assignedTo: 'Enseignants',
      dueDate: '2025-01-27T14:00:00Z',
      estimatedDuration: 1
    },
    {
      id: 'step-6',
      name: 'Décision d\'admission',
      description: 'Délibération et prise de décision finale',
      status: 'pending',
      assignedTo: 'Conseil d\'admission',
      estimatedDuration: 2
    },
    {
      id: 'step-7',
      name: 'Notification famille',
      description: 'Communication de la décision à la famille',
      status: 'pending',
      assignedTo: 'Secrétariat',
      estimatedDuration: 1
    },
    {
      id: 'step-8',
      name: 'Finalisation inscription',
      description: 'Confirmation d\'inscription et paiement des frais',
      status: 'pending',
      assignedTo: 'Administration',
      estimatedDuration: 5
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-gray-400" />;
      case 'blocked': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'pending': return 'En attente';
      case 'blocked': return 'Bloqué';
      default: return status;
    }
  };

  const calculateProgress = () => {
    const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / workflowSteps.length) * 100);
  };

  const getEstimatedCompletion = () => {
    const remainingSteps = workflowSteps.filter(step => step.status !== 'completed');
    const totalDays = remainingSteps.reduce((sum, step) => sum + step.estimatedDuration, 0);
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + totalDays);
    return completionDate;
  };

  return (
    <div className="space-y-6">
      {/* En-tête du workflow */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Workflow d'admission
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Candidature #{applicationId}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {calculateProgress()}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Progression
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progression globale</span>
            <span>Fin estimée: {getEstimatedCompletion().toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Edit className="w-4 h-4" />
            Modifier étape
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <MessageSquare className="w-4 h-4" />
            Ajouter note
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Timeline des étapes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Étapes du processus
        </h4>

        <div className="space-y-6">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Ligne de connexion */}
              {index < workflowSteps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 dark:bg-gray-700" />
              )}

              <div className="flex items-start gap-4">
                {/* Icône de statut */}
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.status)}`}>
                  {getStatusIcon(step.status)}
                </div>

                {/* Contenu de l'étape */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {step.name}
                    </h5>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(step.status)}`}>
                        {getStatusLabel(step.status)}
                      </span>
                      {step.status === 'in_progress' && (
                        <button 
                          onClick={() => setSelectedStep(step.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {step.description}
                  </p>

                  {/* Informations détaillées */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Assigné à:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {step.assignedTo || 'Non assigné'}
                      </div>
                    </div>
                    
                    {step.dueDate && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Échéance:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(step.dueDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    )}

                    {step.completedAt && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Terminé le:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(step.completedAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Durée estimée:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {step.estimatedDuration} jour{step.estimatedDuration > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Documents associés */}
                  {step.documents && step.documents.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Documents:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {step.documents.map((doc, docIndex) => (
                          <span key={docIndex} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                            <FileText className="w-3 h-3" />
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {step.notes && (
                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Note:</div>
                          <div className="text-sm text-yellow-700 dark:text-yellow-300">{step.notes}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions pour l'étape */}
                  {step.status === 'in_progress' && (
                    <div className="mt-4 flex items-center gap-2">
                      <button 
                        onClick={() => onStepUpdate?.(step.id, 'completed')}
                        className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marquer terminé
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Flag className="w-4 h-4" />
                        Signaler problème
                      </button>
                    </div>
                  )}

                  {step.status === 'pending' && index > 0 && workflowSteps[index - 1].status === 'completed' && (
                    <div className="mt-4">
                      <button 
                        onClick={() => onStepUpdate?.(step.id, 'in_progress')}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Démarrer cette étape
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historique des actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Historique des actions
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Vérification documents terminée
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Par Administration • 11 janvier 2025 à 14:30
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Dossier complet reçu
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Par Secrétariat • 10 janvier 2025 à 10:00
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <User className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Candidature soumise
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Par Lucas Bernard • 8 janvier 2025 à 16:45
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};