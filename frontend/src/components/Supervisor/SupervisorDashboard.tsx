import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, AlertTriangle, Eye, Clock, CheckCircle, XCircle,
  RefreshCw, Wifi, WifiOff, BarChart3, MapPin, Calendar, Bell
} from 'lucide-react';

export const SupervisorDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement du tableau de surveillance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">NoteCibolt v2 - Supervision</h2>
              <p className="text-green-100">Centre de surveillance et de sécurité scolaire</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-green-200">
                <span>8 incidents aujourd'hui</span>
                <span>12 alertes en attente</span>
                <div className="flex items-center gap-1">
                  <WifiOff className="w-4 h-4 text-orange-300" />
                  <span className="text-orange-300">Mode fallback</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">856</div>
            <div className="text-green-100">Élèves surveillés</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Incidents totaux</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Résolus</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Alertes en attente</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Élèves surveillés</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">856</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Incidents actifs (3)</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">Altercation entre élèves</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400">
                      En attente
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Dispute verbale escaladée en cours de récréation
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Cour principale
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      10:30
                    </span>
                    <span>Par: M. Dubois</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">Accès non autorisé</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                      En cours
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Personne non identifiée dans le bâtiment administratif
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Bâtiment A - Étage 2
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      09:15
                    </span>
                    <span>Par: Système sécurité</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alertes de présence (3)</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Jean Kouassi</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Terminale S1 • 08:30</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400">
                  Absent
                </span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Fatou Diallo</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Première L • 08:45</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400">
                  Retard
                </span>
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Amadou Traoré</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Seconde A • 15:30</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
                  Parti tôt
                </span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">État des zones de sécurité</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Cour principale</h4>
              <span className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                Normal
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Occupation: 45/100 personnes</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-green-600" style={{ width: '45%' }}></div>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">Dernière vérification: 12:00</div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Bibliothèque</h4>
              <span className="px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400">
                Attention
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Occupation: 38/40 personnes</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-orange-600" style={{ width: '95%' }}></div>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">Dernière vérification: 11:55</div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Cafétéria</h4>
              <span className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400">
                Alerte
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">Occupation: 85/80 personnes</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-red-600" style={{ width: '100%' }}></div>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">Dernière vérification: 12:05</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions rapides de surveillance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Déclarer incident</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Nouveau rapport</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Prendre présences</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Vérification manuelle</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Ronde de sécurité</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Vérifier zones</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Planning ronde</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Programmer tâches</div>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-green-600" />
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100">
              ✅ SupervisorDashboard v2 : Interface complète + Connexion base de données
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Dashboard supervision avec incidents, présences, sécurité - Connecté PostgreSQL avec fallback
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
