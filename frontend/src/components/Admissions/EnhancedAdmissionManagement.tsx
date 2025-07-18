import React, { useState } from 'react';
import { 
  FileText, Calendar, User, CheckCircle, XCircle, Clock, Eye, Download, 
  Plus, Search, Filter, UserPlus, Users, Phone, Mail, MapPin, Star,
  AlertTriangle, Edit, Trash2, Send, Heart, Award, Target, Calculator,
  CreditCard, BarChart3, MessageSquare, Settings, Workflow, TrendingUp
} from 'lucide-react';
import { AdmissionApplication } from '../../types';
import { admissionApplications } from '../../data/mockData';
import { AdmissionCalculator } from './AdmissionCalculator';
import { AdmissionWorkflow } from './AdmissionWorkflow';
import { AdmissionAnalytics } from './AdmissionAnalytics';
import { AdmissionCommunication } from './AdmissionCommunication';
import { AdmissionReports } from './AdmissionReports';
import { formatAmount } from '../../data/admissionRules';

interface ProspectParent {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  occupation?: string;
  childrenCount: number;
  registeredChildren: number;
  status: 'prospect' | 'parent' | 'inactive';
  firstContact: string;
  lastContact: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  source: 'website' | 'referral' | 'event' | 'social' | 'other';
}

export const EnhancedAdmissionManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'prospects' | 'workflow' | 'analytics' | 'calculator' | 'communication' | 'reports' | 'settings'>('applications');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<ProspectParent | null>(null);
  const [showNewProspectModal, setShowNewProspectModal] = useState(false);
  const [showNewApplicationModal, setShowNewApplicationModal] = useState(false);

  // Mock data pour les prospects parents
  const prospectParents: ProspectParent[] = [
    {
      id: 'prospect-1',
      name: 'Amadou Koné',
      email: 'amadou.kone@email.com',
      phone: '+225 07 12 34 56 78',
      address: 'Cocody, Abidjan',
      occupation: 'Directeur commercial',
      childrenCount: 3,
      registeredChildren: 0,
      status: 'prospect',
      firstContact: '2025-01-10',
      lastContact: '2025-01-15',
      notes: 'Intéressé par l\'inscription de ses 3 enfants. Souhaite visiter l\'établissement.',
      priority: 'high',
      source: 'website'
    },
    {
      id: 'prospect-2',
      name: 'Fatoumata Diallo',
      email: 'fatoumata.diallo@email.com',
      phone: '+225 05 98 76 54 32',
      address: 'Plateau, Abidjan',
      occupation: 'Médecin',
      childrenCount: 2,
      registeredChildren: 1,
      status: 'prospect',
      firstContact: '2025-01-05',
      lastContact: '2025-01-12',
      notes: 'A déjà inscrit un enfant. Souhaite inscrire le second.',
      priority: 'medium',
      source: 'referral'
    },
    {
      id: 'parent-1',
      name: 'Ibrahim Traoré',
      email: 'ibrahim.traore@email.com',
      phone: '+225 01 23 45 67 89',
      address: 'Marcory, Abidjan',
      occupation: 'Ingénieur',
      childrenCount: 2,
      registeredChildren: 2,
      status: 'parent',
      firstContact: '2024-08-15',
      lastContact: '2025-01-10',
      notes: 'Parent actif, très satisfait. Recommande l\'école.',
      priority: 'low',
      source: 'event'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'under_review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'waitlisted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getProspectStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'parent': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'website': return <Search className="w-4 h-4" />;
      case 'referral': return <Users className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'social': return <Heart className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const filteredApplications = admissionApplications.filter(app => 
    selectedStatus === 'all' || app.status === selectedStatus
  );

  const renderApplicationsTab = () => (
    <div className="space-y-6">
      {/* Statistiques financières */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Candidatures</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {admissionApplications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenus estimés</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatAmount(15750000)} {/* Estimation basée sur les candidatures */}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En attente</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {admissionApplications.filter(app => app.status === 'under_review').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Taux acceptation</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {Math.round((admissionApplications.filter(app => app.status === 'accepted').length / admissionApplications.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtrer par statut:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="submitted">Soumises</option>
            <option value="under_review">En cours d'examen</option>
            <option value="accepted">Acceptées</option>
            <option value="rejected">Refusées</option>
            <option value="waitlisted">Liste d'attente</option>
          </select>
        </div>
      </div>

      {/* Liste des candidatures */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Candidat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Classe demandée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date de soumission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {application.studentInfo.firstName} {application.studentInfo.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {application.parentInfo.father.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {application.academicInfo.desiredClass}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(application.submittedAt).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status === 'submitted' ? 'Soumise' :
                       application.status === 'under_review' ? 'En examen' :
                       application.status === 'accepted' ? 'Acceptée' :
                       application.status === 'rejected' ? 'Refusée' : 'Liste d\'attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedApplication(application)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProspectsTab = () => (
    <div className="space-y-6">
      {/* Actions rapides */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un prospect..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="all">Tous les statuts</option>
            <option value="prospect">Prospects</option>
            <option value="parent">Parents</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
        <button 
          onClick={() => setShowNewProspectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau prospect
        </button>
      </div>

      {/* Statistiques prospects */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prospects actifs</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {prospectParents.filter(p => p.status === 'prospect').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Parents actifs</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {prospectParents.filter(p => p.status === 'parent').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Priorité haute</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {prospectParents.filter(p => p.priority === 'high').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Taux conversion</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {Math.round((prospectParents.filter(p => p.status === 'parent').length / prospectParents.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des prospects */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Enfants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dernier contact
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {prospectParents.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {prospect.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {prospect.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {prospect.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {prospect.registeredChildren}/{prospect.childrenCount} inscrits
                    </div>
                    {prospect.registeredChildren >= 2 && (
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Éligible parent
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProspectStatusColor(prospect.status)}`}>
                      {prospect.status === 'prospect' ? 'Prospect' :
                       prospect.status === 'parent' ? 'Parent' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(prospect.priority)}`}>
                      {prospect.priority === 'high' ? 'Haute' :
                       prospect.priority === 'medium' ? 'Moyenne' : 'Faible'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {getSourceIcon(prospect.source)}
                      <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {prospect.source}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(prospect.lastContact).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedProspect(prospect)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des admissions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Système complet de gestion des candidatures et processus d'admission
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowNewApplicationModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle candidature
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'applications', label: 'Candidatures', icon: FileText },
              { id: 'prospects', label: 'Prospects', icon: Users },
              { id: 'workflow', label: 'Workflow', icon: Workflow },
              { id: 'calculator', label: 'Calculateur', icon: Calculator },
              { id: 'communication', label: 'Communication', icon: MessageSquare },
              { id: 'analytics', label: 'Analyses', icon: BarChart3 },
              { id: 'reports', label: 'Rapports', icon: TrendingUp },
              { id: 'settings', label: 'Paramètres', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'applications' && renderApplicationsTab()}
          {activeTab === 'prospects' && renderProspectsTab()}
          {activeTab === 'workflow' && <AdmissionWorkflow applicationId="adm-1" />}
          {activeTab === 'calculator' && <AdmissionCalculator />}
          {activeTab === 'communication' && <AdmissionCommunication />}
          {activeTab === 'analytics' && <AdmissionAnalytics />}
          {activeTab === 'reports' && <AdmissionReports />}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Paramètres du module Admissions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Configuration des processus, notifications et règles d'admission.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal détail candidature */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Candidature - {selectedApplication.studentInfo.firstName} {selectedApplication.studentInfo.lastName}
                </h3>
                <button 
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Informations de l'élève
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Nom complet:</span>
                      <p className="text-gray-900 dark:text-white">
                        {selectedApplication.studentInfo.firstName} {selectedApplication.studentInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Date de naissance:</span>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedApplication.studentInfo.dateOfBirth).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    Refuser
                  </button>
                  <button className="px-4 py-2 text-yellow-600 border border-yellow-300 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
                    Liste d'attente
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Accepter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal détail prospect */}
      {selectedProspect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Prospect - {selectedProspect.name}
                </h3>
                <button 
                  onClick={() => setSelectedProspect(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Email:</label>
                    <p className="text-gray-900 dark:text-white">{selectedProspect.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Téléphone:</label>
                    <p className="text-gray-900 dark:text-white">{selectedProspect.phone}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Notes:</label>
                  <p className="text-gray-900 dark:text-white">{selectedProspect.notes}</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {selectedProspect.registeredChildren >= 2 && selectedProspect.status === 'prospect' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Convertir en parent
                    </button>
                  )}
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Contacter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};