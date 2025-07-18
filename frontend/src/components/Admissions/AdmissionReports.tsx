import React, { useState } from 'react';
import { 
  FileText, Download, Calendar, BarChart3, PieChart, TrendingUp,
  Users, Target, Award, Clock, Filter, Eye, Printer, Share2
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'summary' | 'detailed' | 'analytics' | 'financial';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  lastGenerated?: string;
  recipients: string[];
  automated: boolean;
}

export const AdmissionReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showReportBuilder, setShowReportBuilder] = useState(false);

  // Templates de rapports prédéfinis
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'rpt-1',
      name: 'Rapport mensuel des admissions',
      description: 'Synthèse complète des candidatures, acceptations et refus du mois',
      type: 'summary',
      frequency: 'monthly',
      lastGenerated: '2025-01-15T09:00:00Z',
      recipients: ['direction@school.edu', 'admin@school.edu'],
      automated: true
    },
    {
      id: 'rpt-2',
      name: 'Analyse des performances par niveau',
      description: 'Détail des taux d\'acceptation et temps de traitement par classe',
      type: 'analytics',
      frequency: 'quarterly',
      lastGenerated: '2025-01-01T10:00:00Z',
      recipients: ['direction@school.edu'],
      automated: false
    },
    {
      id: 'rpt-3',
      name: 'Rapport financier des inscriptions',
      description: 'Revenus générés par les nouvelles inscriptions et frais collectés',
      type: 'financial',
      frequency: 'monthly',
      lastGenerated: '2025-01-10T14:30:00Z',
      recipients: ['comptabilite@school.edu', 'direction@school.edu'],
      automated: true
    },
    {
      id: 'rpt-4',
      name: 'Suivi détaillé des candidatures',
      description: 'Liste exhaustive de toutes les candidatures avec leur statut détaillé',
      type: 'detailed',
      frequency: 'weekly',
      lastGenerated: '2025-01-14T16:00:00Z',
      recipients: ['secretariat@school.edu'],
      automated: true
    },
    {
      id: 'rpt-5',
      name: 'Analyse des sources de candidatures',
      description: 'Efficacité des différents canaux d\'acquisition de candidats',
      type: 'analytics',
      frequency: 'quarterly',
      recipients: ['marketing@school.edu', 'direction@school.edu'],
      automated: false
    }
  ];

  // Données pour les rapports
  const reportData = {
    summary: {
      totalApplications: 245,
      acceptedApplications: 189,
      rejectedApplications: 31,
      pendingApplications: 25,
      acceptanceRate: 77.1,
      averageProcessingTime: 12.5,
      totalRevenue: 18750000, // FCFA
      projectedEnrollment: 174
    },
    trends: {
      applicationsGrowth: 15.2,
      acceptanceRateChange: 2.3,
      processingTimeImprovement: -8.5,
      revenueGrowth: 22.1
    },
    byLevel: [
      { level: '6e', applications: 45, accepted: 38, revenue: 2660000 },
      { level: '5e', applications: 32, accepted: 28, revenue: 1960000 },
      { level: '4e', applications: 28, accepted: 22, revenue: 1540000 },
      { level: '3e', applications: 35, accepted: 29, revenue: 2175000 },
      { level: '2nde', applications: 58, accepted: 42, revenue: 3360000 },
      { level: '1re', applications: 25, accepted: 18, revenue: 1440000 },
      { level: 'Terminale', applications: 22, accepted: 12, revenue: 1080000 }
    ],
    sources: [
      { source: 'Site web', applications: 98, conversion: 78.6 },
      { source: 'Recommandations', applications: 73, conversion: 82.2 },
      { source: 'Événements', applications: 45, conversion: 71.1 },
      { source: 'Réseaux sociaux', applications: 19, conversion: 63.2 },
      { source: 'Autres', applications: 10, conversion: 60.0 }
    ]
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'summary': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'detailed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'analytics': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'financial': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'summary': return 'Synthèse';
      case 'detailed': return 'Détaillé';
      case 'analytics': return 'Analytique';
      case 'financial': return 'Financier';
      default: return type;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const generateReport = (templateId: string) => {
    // Simulation de génération de rapport
    console.log(`Génération du rapport ${templateId}`);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Rapports d'admission
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Génération et gestion des rapports statistiques
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="current_week">Cette semaine</option>
              <option value="current_month">Ce mois</option>
              <option value="current_quarter">Ce trimestre</option>
              <option value="current_year">Cette année</option>
            </select>
            <button 
              onClick={() => setShowReportBuilder(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Nouveau rapport
            </button>
          </div>
        </div>
      </div>

      {/* Aperçu des métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportData.summary.totalApplications}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Candidatures</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              +{reportData.trends.applicationsGrowth}% vs période précédente
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportData.summary.acceptanceRate}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Taux d'acceptation</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              +{reportData.trends.acceptanceRateChange}% vs période précédente
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportData.summary.averageProcessingTime}j
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Temps moyen</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              {reportData.trends.processingTimeImprovement}j vs période précédente
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(reportData.summary.totalRevenue)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Revenus générés</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              +{reportData.trends.revenueGrowth}% vs période précédente
            </span>
          </div>
        </div>
      </div>

      {/* Templates de rapports */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Rapports disponibles
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reportTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(template.type)}`}>
                      {getTypeLabel(template.type)}
                    </span>
                    {template.automated && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                        Auto
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Fréquence: {template.frequency}</span>
                    {template.lastGenerated && (
                      <span>
                        Dernière génération: {new Date(template.lastGenerated).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Destinataires */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Destinataires:</div>
                <div className="flex flex-wrap gap-1">
                  {template.recipients.map((recipient, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                      {recipient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => generateReport(template.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Générer
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Eye className="w-4 h-4" />
                  Aperçu
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Données détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance par niveau */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Performance par niveau
          </h4>
          
          <div className="space-y-4">
            {reportData.byLevel.map((level, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {level.level}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {level.applications} candidatures • {level.accepted} acceptées
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatAmount(level.revenue)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round((level.accepted / level.applications) * 100)}% acceptation
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Efficacité des sources */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Efficacité des sources
          </h4>
          
          <div className="space-y-4">
            {reportData.sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {source.source}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {source.applications} candidatures
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${source.conversion}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {source.conversion}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions rapides
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Rapport complet</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Toutes les métriques</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Analyse visuelle</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Graphiques détaillés</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Printer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Impression</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Format papier</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Planification</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Rapports automatiques</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};