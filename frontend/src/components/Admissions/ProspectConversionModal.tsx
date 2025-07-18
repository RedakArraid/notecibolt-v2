import React, { useState } from 'react';
import { UserPlus, ArrowRight, CheckCircle, X, AlertCircle } from 'lucide-react';

interface ProspectConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: any;
  onConvert: (prospectId: string) => void;
}

export const ProspectConversionModal: React.FC<ProspectConversionModalProps> = ({
  isOpen,
  onClose,
  prospect,
  onConvert
}) => {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStep, setConversionStep] = useState(1);

  if (!isOpen || !prospect) return null;

  const handleConvert = async () => {
    setIsConverting(true);
    setConversionStep(2);
    
    // Simulation du processus de conversion
    await new Promise(resolve => setTimeout(resolve, 1500));
    setConversionStep(3);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    onConvert(prospect.id);
    onClose();
    setIsConverting(false);
    setConversionStep(1);
  };

  const renderStepContent = () => {
    switch (conversionStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Convertir en client
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vous êtes sur le point de convertir ce prospect en client actif
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Informations du prospect
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Nom:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{prospect.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Email:</span>
                  <span className="text-gray-900 dark:text-white">{prospect.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Téléphone:</span>
                  <span className="text-gray-900 dark:text-white">{prospect.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Enfants:</span>
                  <span className="text-gray-900 dark:text-white">{prospect.childrenCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Priorité:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    prospect.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    prospect.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {prospect.priority === 'high' ? 'Haute' :
                     prospect.priority === 'medium' ? 'Moyenne' : 'Faible'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Actions de conversion
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Changement du statut de "Prospect" à "Client"</li>
                <li>• Création d'un dossier client complet</li>
                <li>• Activation des services de suivi</li>
                <li>• Notification automatique à l'équipe commerciale</li>
                <li>• Historique des interactions conservé</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Attention
                  </h5>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Cette action est irréversible. Une fois converti, le prospect deviendra un client actif 
                    et sera inclus dans tous les processus de suivi client.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Conversion en cours...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mise à jour du statut et création du dossier client
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Conversion réussie !
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {prospect.name} est maintenant un client actif
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Conversion de prospect
            </h3>
            {conversionStep === 1 && (
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {renderStepContent()}
        </div>

        {conversionStep === 1 && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConvert}
              disabled={isConverting}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4" />
              Convertir en client
            </button>
          </div>
        )}
      </div>
    </div>
  );
};