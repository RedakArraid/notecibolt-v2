import React, { useState, useEffect } from 'react';
import { Calculator, FileText, CreditCard, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AdmissionCalculatorProps {
  selectedLevel?: string;
  onLevelChange?: (level: string) => void;
}

export const AdmissionCalculator: React.FC<AdmissionCalculatorProps> = ({ 
  selectedLevel = '', 
  onLevelChange 
}) => {
  const [level, setLevel] = useState(selectedLevel);
  const [showDetails, setShowDetails] = useState(false);
  const [submittedDocuments, setSubmittedDocuments] = useState<string[]>([]);

  const levels = [
    '6e', '5e', '4e', '3e', '2nde', '1re', 'Terminale'
  ];

  useEffect(() => {
    if (selectedLevel) {
      setLevel(selectedLevel);
    }
  }, [selectedLevel]);

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    onLevelChange?.(newLevel);
  };

  const registrationFee = level ? {
    level: level,
    inscription: 100,
    fraisAnnexes: 50,
    includes: ['Frais de scolarité', 'Droit d\'examen', 'Extrait de naissance'],
    total: 150
  } : null;

  const tuitionPayment = level ? {
    level: level,
    payments: [
      { description: 'Frais de scolarité mensuel', amount: 100 },
      { description: 'Frais de scolarité trimestriel', amount: 300 },
      { description: 'Frais de scolarité annuel', amount: 1200 }
    ],
    total: 1600
  } : null;

  const examFee = level ? {
    level: level,
    amount: 50
  } : null;

  const totalCost = level ? {
    level: level,
    registration: 150,
    tuition: 1600,
    examFee: 50,
    total: 1800
  } : null;

  const documentValidation = {
    valid: true,
    missing: []
  };

  const toggleDocument = (docId: string) => {
    setSubmittedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de niveau */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Calculateur de frais d'inscription
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sélectionnez le niveau pour voir les frais détaillés
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {levels.map((levelOption) => (
            <button
              key={levelOption}
              onClick={() => handleLevelChange(levelOption)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                level === levelOption
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{levelOption}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {level && totalCost && (
        <>
          {/* Résumé des coûts */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Coût total pour {level}</h3>
                <div className="space-y-1 text-blue-100">
                  <div>Frais d'inscription: {totalCost.registration}</div>
                  <div>Frais de scolarité: {totalCost.tuition}</div>
                  {totalCost.examFee > 0 && (
                    <div>Droit d'examen: {totalCost.examFee}</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{totalCost.total}</div>
                <div className="text-blue-100">Total à payer</div>
              </div>
            </div>
          </div>

          {/* Détails des frais */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Frais d'inscription */}
            {registrationFee && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Frais d'inscription - {registrationFee.level}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Inscription</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {registrationFee.inscription}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Frais annexes</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {registrationFee.fraisAnnexes}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {registrationFee.total}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Inclus dans les frais annexes:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {registrationFee.includes.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Modalités de paiement */}
            {tuitionPayment && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Modalités de paiement - Scolarité
                </h4>
                <div className="space-y-3">
                  {tuitionPayment.payments.map((payment, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">
                        {payment.description}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {payment.amount}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">Total scolarité</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {tuitionPayment.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Droit d'examen */}
          {examFee && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                  Droit d'examen - {examFee.level}
                </h4>
              </div>
              <p className="text-yellow-800 dark:text-yellow-200">
                Un droit d'examen de <strong>{examFee.amount}</strong> est requis pour les élèves de {examFee.level}.
              </p>
            </div>
          )}

          {/* Documents requis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Documents requis pour l'inscription
              </h4>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                documentValidation.valid 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {submittedDocuments.length}/À implémenter documents requis
              </div>
            </div>

            <div className="space-y-3">
              {/* À implémenter: Charger les documents requis depuis une source */}
              <div className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => toggleDocument('doc1')}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    submittedDocuments.includes('doc1')
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                  }`}
                >
                  {submittedDocuments.includes('doc1') && (
                    <CheckCircle className="w-3 h-3" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      submittedDocuments.includes('doc1') 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      Extrait de naissance
                    </span>
                    <span className="text-red-500 text-sm">*</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Délivré par le service des impôts. Doit être daté de moins de 3 mois.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => toggleDocument('doc2')}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    submittedDocuments.includes('doc2')
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                  }`}
                >
                  {submittedDocuments.includes('doc2') && (
                    <CheckCircle className="w-3 h-3" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      submittedDocuments.includes('doc2') 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      Attestation de résidence
                    </span>
                    <span className="text-red-500 text-sm">*</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Délivrée par le service des impôts. Doit être datée de moins de 3 mois.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => toggleDocument('doc3')}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    submittedDocuments.includes('doc3')
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                  }`}
                >
                  {submittedDocuments.includes('doc3') && (
                    <CheckCircle className="w-3 h-3" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      submittedDocuments.includes('doc3') 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      Attestation de scolarité
                    </span>
                    <span className="text-red-500 text-sm">*</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Délivrée par l'école précédente. Doit être datée de moins de 3 mois.
                  </p>
                </div>
              </div>
            </div>

            {documentValidation.missing.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Documents manquants
                  </span>
                </div>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {documentValidation.missing.map((doc, index) => (
                    <li key={index}>• {doc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Avantages inclus */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Avantages inclus dans le paiement
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* À implémenter: Charger les avantages inclus depuis une source */}
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="font-medium text-green-900 dark:text-green-100">
                    Frais de scolarité
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Paiement mensuel, trimestriel ou annuel.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="font-medium text-green-900 dark:text-green-100">
                    Droit d'examen
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Un droit d'examen est requis pour l'inscription.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="font-medium text-green-900 dark:text-green-100">
                    Extrait de naissance
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Nécessaire pour l'inscription.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="font-medium text-green-900 dark:text-green-100">
                    Attestation de résidence
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Nécessaire pour l'inscription.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Règles importantes */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Règles importantes
              </h4>
            </div>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                Les frais de scolarité doivent être soldés avant le début des cours
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                Aucun versement auprès d'un agent non habilité ne sera accepté
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                Le non-respect du calendrier de paiement entraîne l'exclusion
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                L'extrait de naissance doit dater de moins de 3 mois
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};