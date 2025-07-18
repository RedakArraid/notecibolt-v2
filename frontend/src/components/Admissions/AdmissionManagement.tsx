import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, CheckCircle, XCircle, Clock, Eye, Download } from 'lucide-react';
import { admissionsService } from '../../services/api';
import type { AdmissionApplication } from '../../types';
// Retirer l'import admissionApplications
// import { admissionApplications } from '../../data/mockData';
import { ProspectForm } from './ProspectForm';
import { AdmissionWorkflow } from './AdmissionWorkflow';
import { AdmissionCalculator } from './AdmissionCalculator';
import { AdmissionCommunication } from './AdmissionCommunication';

export const AdmissionManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'candidatures' | 'prospects' | 'workflow' | 'calculateur' | 'communication'>('candidatures');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProspectOpen, setIsProspectOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await admissionsService.getAll();
        setApplications(data);
      } catch (e) {
        setApplications([]);
        setError('Erreur lors du chargement des candidatures');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleAddProspect = (data: any) => {
    // Ici, tu pourrais appeler l'API pour créer une nouvelle candidature
    // Pour l'instant, on ajoute localement (à adapter pour POST API)
    setApplications(prev => [
      {
        id: Math.random().toString(36).slice(2),
        applicationNumber: 'ADM-NEW-' + Date.now(),
        firstName: data.name,
        lastName: '',
        dateOfBirth: '',
        gender: 'OTHER',
        nationality: '',
        desiredClass: data.interestedLevels[0] || '',
        academicYear: '',
        fatherName: '',
        fatherEmail: '',
        fatherPhone: '',
        motherName: '',
        motherEmail: '',
        motherPhone: '',
        familyAddress: data.address,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
        documents: [],
      },
      ...prev
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'ACCEPTED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'WAITLISTED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'Soumise';
      case 'UNDER_REVIEW': return 'En cours d\'examen';
      case 'ACCEPTED': return 'Acceptée';
      case 'REJECTED': return 'Refusée';
      case 'WAITLISTED': return 'Liste d\'attente';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'UNDER_REVIEW': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  const filteredApplications = applications.filter(app => 
    selectedStatus === 'all' || app.status === selectedStatus
  );

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-4">
        <button className={`px-4 py-2 font-medium ${activeTab === 'candidatures' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setActiveTab('candidatures')}>Candidatures</button>
        <button className={`px-4 py-2 font-medium ${activeTab === 'prospects' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setActiveTab('prospects')}>Prospects</button>
        <button className={`px-4 py-2 font-medium ${activeTab === 'workflow' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setActiveTab('workflow')}>Workflow</button>
        <button className={`px-4 py-2 font-medium ${activeTab === 'calculateur' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setActiveTab('calculateur')}>Calculateur</button>
        <button className={`px-4 py-2 font-medium ${activeTab === 'communication' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setActiveTab('communication')}>Communication</button>
      </div>
      {/* Contenu selon l’onglet */}
      {activeTab === 'candidatures' && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestion des admissions
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez les candidatures et inscriptions des nouveaux élèves
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setIsProspectOpen(true)}>
                Nouvelle candidature
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Exporter
              </button>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {applications.length}
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
                    {applications.filter(app => app.status === 'UNDER_REVIEW').length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Acceptées</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {applications.filter(app => app.status === 'ACCEPTED').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Refusées</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {applications.filter(app => app.status === 'REJECTED').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Liste d'attente</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {applications.filter(app => app.status === 'WAITLISTED').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
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
                <option value="SUBMITTED">Soumises</option>
                <option value="UNDER_REVIEW">En cours d'examen</option>
                <option value="ACCEPTED">Acceptées</option>
                <option value="REJECTED">Refusées</option>
                <option value="WAITLISTED">Liste d'attente</option>
              </select>
            </div>
          </div>

          {/* Applications List */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Documents
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
                            {application.firstName} {application.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Classe demandée: {application.desiredClass}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Date de soumission: {new Date(application.submittedAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {application.desiredClass}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Année académique: <span className="text-gray-400 italic">Détail non disponible</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {new Date(application.submittedAt).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                            {getStatusLabel(application.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {Array.isArray(application.documents) ? application.documents.length : 0} document{Array.isArray(application.documents) && application.documents.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedApplication(application)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Application Detail Modal */}
          {selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Candidature - {selectedApplication.firstName} {selectedApplication.lastName}
                    </h3>
                    <button 
                      onClick={() => setSelectedApplication(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Student Info */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                      Informations de l'élève
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Nom complet:</span>
                        <p className="text-gray-900 dark:text-white">
                          {selectedApplication.firstName} {selectedApplication.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Classe demandée:</span>
                        <p className="text-gray-900 dark:text-white">
                          {selectedApplication.desiredClass}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Date de soumission:</span>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(selectedApplication.submittedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Statut:</span>
                        <p className="text-gray-900 dark:text-white">
                          {getStatusLabel(selectedApplication.status)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                      Documents soumis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {(selectedApplication.documents?.length || 0) === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">Aucun document soumis.</p>
                      ) : (
                        selectedApplication.documents?.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white">{doc.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
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
          )}
        </>
      )}
      {activeTab === 'workflow' && (
        <AdmissionWorkflow applicationId={selectedApplication?.id || ''} />
      )}
      {activeTab === 'calculateur' && (
        <AdmissionCalculator />
      )}
      {activeTab === 'communication' && (
        <AdmissionCommunication />
      )}
      <ProspectForm isOpen={isProspectOpen} onClose={() => setIsProspectOpen(false)} onSubmit={handleAddProspect} />
    </div>
  );
};