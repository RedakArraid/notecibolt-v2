import React, { useState } from 'react';
import { 
  Mail, Phone, MessageSquare, Send, Users, Calendar, 
  FileText, Download, Eye, Edit, Trash2, Plus, Filter,
  Clock, CheckCircle, AlertTriangle, Star, Bell
} from 'lucide-react';

interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'letter';
  category: 'acceptance' | 'rejection' | 'interview' | 'reminder' | 'welcome';
  subject: string;
  content: string;
  variables: string[];
  lastUsed?: string;
  usageCount: number;
}

interface CommunicationHistory {
  id: string;
  recipientName: string;
  recipientEmail: string;
  type: 'email' | 'sms' | 'call' | 'meeting';
  subject: string;
  content: string;
  sentAt: string;
  sentBy: string;
  status: 'sent' | 'delivered' | 'read' | 'replied' | 'failed';
  applicationId: string;
}

export const AdmissionCommunication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'history' | 'compose'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  // Templates de communication
  const communicationTemplates: CommunicationTemplate[] = [
    {
      id: 'tpl-1',
      name: 'Accusé de réception',
      type: 'email',
      category: 'reminder',
      subject: 'Réception de votre dossier de candidature',
      content: `Madame, Monsieur {{parent_name}},

Nous accusons réception du dossier de candidature de {{student_name}} pour une inscription en classe de {{desired_class}} pour l'année scolaire {{academic_year}}.

Votre dossier porte le numéro de référence : {{application_id}}

Nous procédons actuellement à l'étude de votre demande. Vous recevrez une réponse dans un délai de {{processing_time}} jours ouvrables.

Pour toute question, n'hésitez pas à nous contacter.

Cordialement,
L'équipe d'admission
EduCloud Pro`,
      variables: ['parent_name', 'student_name', 'desired_class', 'academic_year', 'application_id', 'processing_time'],
      lastUsed: '2025-01-15T10:30:00Z',
      usageCount: 45
    },
    {
      id: 'tpl-2',
      name: 'Convocation entretien',
      type: 'email',
      category: 'interview',
      subject: 'Convocation à un entretien d\'admission',
      content: `Madame, Monsieur {{parent_name}},

Suite à l'étude du dossier de candidature de {{student_name}}, nous avons le plaisir de vous convoquer à un entretien d'admission.

Détails de l'entretien :
- Date : {{interview_date}}
- Heure : {{interview_time}}
- Lieu : {{interview_location}}
- Durée estimée : 30 minutes

Merci de vous présenter avec :
- Une pièce d'identité
- Le carnet de correspondance de l'élève
- Les derniers bulletins scolaires

En cas d'empêchement, merci de nous contacter au plus vite.

Cordialement,
L'équipe d'admission`,
      variables: ['parent_name', 'student_name', 'interview_date', 'interview_time', 'interview_location'],
      lastUsed: '2025-01-14T14:20:00Z',
      usageCount: 23
    },
    {
      id: 'tpl-3',
      name: 'Acceptation de candidature',
      type: 'email',
      category: 'acceptance',
      subject: 'Félicitations ! Admission acceptée',
      content: `Madame, Monsieur {{parent_name}},

Nous avons le plaisir de vous informer que la candidature de {{student_name}} a été acceptée pour une inscription en classe de {{desired_class}} pour l'année scolaire {{academic_year}}.

Pour finaliser l'inscription, vous devez :
1. Confirmer votre acceptation avant le {{confirmation_deadline}}
2. Régler les frais d'inscription : {{registration_fee}}
3. Fournir les documents complémentaires listés en pièce jointe

Nous vous félicitons pour cette admission et nous réjouissons d'accueillir {{student_name}} dans notre établissement.

Cordialement,
La Direction`,
      variables: ['parent_name', 'student_name', 'desired_class', 'academic_year', 'confirmation_deadline', 'registration_fee'],
      lastUsed: '2025-01-13T16:45:00Z',
      usageCount: 67
    },
    {
      id: 'tpl-4',
      name: 'Refus de candidature',
      type: 'email',
      category: 'rejection',
      subject: 'Réponse à votre demande d\'admission',
      content: `Madame, Monsieur {{parent_name}},

Nous vous remercions de l'intérêt que vous portez à notre établissement pour la scolarité de {{student_name}}.

Après étude attentive de votre dossier, nous regrettons de ne pouvoir donner une suite favorable à votre demande d'admission en classe de {{desired_class}} pour l'année scolaire {{academic_year}}.

Cette décision ne remet nullement en cause les qualités de votre enfant. Elle s'explique par {{rejection_reason}}.

Nous vous encourageons à renouveler votre candidature l'année prochaine.

Cordialement,
La Direction`,
      variables: ['parent_name', 'student_name', 'desired_class', 'academic_year', 'rejection_reason'],
      lastUsed: '2025-01-12T11:15:00Z',
      usageCount: 12
    },
    {
      id: 'tpl-5',
      name: 'Rappel documents manquants',
      type: 'email',
      category: 'reminder',
      subject: 'Documents manquants - Dossier {{application_id}}',
      content: `Madame, Monsieur {{parent_name}},

Nous étudions actuellement le dossier de candidature de {{student_name}} (référence {{application_id}}).

Cependant, nous constatons que les documents suivants sont manquants :
{{missing_documents}}

Merci de nous faire parvenir ces pièces dans les plus brefs délais afin que nous puissions poursuivre l'étude de votre dossier.

Vous pouvez les déposer directement au secrétariat ou les envoyer par email.

Cordialement,
Le Secrétariat`,
      variables: ['parent_name', 'student_name', 'application_id', 'missing_documents'],
      lastUsed: '2025-01-11T09:30:00Z',
      usageCount: 18
    }
  ];

  // Historique des communications
  const communicationHistory: CommunicationHistory[] = [
    {
      id: 'comm-1',
      recipientName: 'Michel Bernard',
      recipientEmail: 'michel.bernard@email.com',
      type: 'email',
      subject: 'Convocation à un entretien d\'admission',
      content: 'Suite à l\'étude du dossier de candidature de Lucas Bernard...',
      sentAt: '2025-01-15T14:30:00Z',
      sentBy: 'Marie Kouassi',
      status: 'read',
      applicationId: 'adm-1'
    },
    {
      id: 'comm-2',
      recipientName: 'Anne Bernard',
      recipientEmail: 'anne.bernard@email.com',
      type: 'sms',
      subject: 'Rappel entretien demain',
      content: 'Rappel : entretien d\'admission demain 10h. Merci de confirmer votre présence.',
      sentAt: '2025-01-14T18:00:00Z',
      sentBy: 'Secrétariat',
      status: 'delivered',
      applicationId: 'adm-1'
    },
    {
      id: 'comm-3',
      recipientName: 'Pierre Dubois',
      recipientEmail: 'pierre.dubois@email.com',
      type: 'email',
      subject: 'Félicitations ! Admission acceptée',
      content: 'Nous avons le plaisir de vous informer que la candidature de Marie Dubois...',
      sentAt: '2025-01-13T16:45:00Z',
      sentBy: 'Direction',
      status: 'replied',
      applicationId: 'adm-2'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'read': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'replied': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent': return 'Envoyé';
      case 'delivered': return 'Délivré';
      case 'read': return 'Lu';
      case 'replied': return 'Répondu';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'acceptance': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejection': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'interview': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'reminder': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'welcome': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="all">Toutes les catégories</option>
            <option value="acceptance">Acceptation</option>
            <option value="rejection">Refus</option>
            <option value="interview">Entretien</option>
            <option value="reminder">Rappel</option>
            <option value="welcome">Bienvenue</option>
          </select>
        </div>
        <button 
          onClick={() => setShowTemplateEditor(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau template
        </button>
      </div>

      {/* Liste des templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {communicationTemplates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {template.subject}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Type: {template.type.toUpperCase()}</span>
                  <span>Utilisé {template.usageCount} fois</span>
                  {template.lastUsed && (
                    <span>Dernière utilisation: {new Date(template.lastUsed).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button 
                  onClick={() => setSelectedTemplate(template)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Aperçu du contenu */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {template.content.substring(0, 150)}...
              </p>
            </div>

            {/* Variables */}
            <div className="flex flex-wrap gap-1 mb-4">
              {template.variables.slice(0, 4).map((variable, index) => (
                <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                  {`{{${variable}}}`}
                </span>
              ))}
              {template.variables.length > 4 && (
                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  +{template.variables.length - 4} variables
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Send className="w-4 h-4" />
                Utiliser
              </button>
              <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Filter className="w-4 h-4 text-gray-400" />
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="all">Tous les types</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="call">Appel</option>
            <option value="meeting">Réunion</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="all">Tous les statuts</option>
            <option value="sent">Envoyé</option>
            <option value="delivered">Délivré</option>
            <option value="read">Lu</option>
            <option value="replied">Répondu</option>
            <option value="failed">Échec</option>
          </select>
          <input
            type="date"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Liste des communications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Destinataire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type / Sujet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date d'envoi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Candidature
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {communicationHistory.map((comm) => (
                <tr key={comm.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {comm.recipientName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {comm.recipientEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {comm.type === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                        {comm.type === 'sms' && <MessageSquare className="w-4 h-4 text-green-600" />}
                        {comm.type === 'call' && <Phone className="w-4 h-4 text-purple-600" />}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {comm.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {comm.subject}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comm.sentAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(comm.sentAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      par {comm.sentBy}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(comm.status)}`}>
                      {getStatusLabel(comm.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      #{comm.applicationId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
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
    </div>
  );

  const renderComposeTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Composer un message
        </h4>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de communication
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="letter">Courrier</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Template
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Sélectionner un template</option>
                {communicationTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Destinataires
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Rechercher des candidatures..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button type="button" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Sélectionner
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Objet
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Objet du message"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Contenu du message..."
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Envoyer maintenant
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Programmer
            </button>
            <button
              type="button"
              className="px-6 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Brouillon
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Communication avec les familles
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestion des templates et historique des communications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                98.5% de délivrabilité
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'templates', label: 'Templates', icon: FileText },
              { id: 'history', label: 'Historique', icon: Clock },
              { id: 'compose', label: 'Composer', icon: Edit }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
          {activeTab === 'templates' && renderTemplatesTab()}
          {activeTab === 'history' && renderHistoryTab()}
          {activeTab === 'compose' && renderComposeTab()}
        </div>
      </div>

      {/* Modal de prévisualisation de template */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedTemplate.name}
                </h3>
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Objet:</label>
                  <p className="text-gray-900 dark:text-white">{selectedTemplate.subject}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contenu:</label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-sans">
                      {selectedTemplate.content}
                    </pre>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Variables disponibles:</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTemplate.variables.map((variable, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Utiliser ce template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};