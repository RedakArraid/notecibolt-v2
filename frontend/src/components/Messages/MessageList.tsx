import React, { useState, useEffect } from 'react';
import { MessageSquare, Bell, AlertTriangle, Clock, Send, Plus, Search, Filter } from 'lucide-react';
import { ErrorBoundary } from '../Error/ErrorBoundary';
import { LoadingSpinner, Loading } from '../Loading/LoadingComponents';
import { useAppStore } from '../../store';
import { messagesService } from '../../services/api';
import { messages as fallbackMessages } from '../../data/mockData';

interface Message {
  id: string;
  senderName: string;
  senderRole: string;
  content: string;
  type: 'message' | 'announcement' | 'alert';
  timestamp: string;
  read: boolean;
  recipientId?: string;
  attachments?: string[];
}

interface MessageListProps {
  compactMode?: boolean;
  maxMessages?: number;
  showCompose?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  compactMode = false, 
  maxMessages = 10,
  showCompose = true 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'announcements'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { addNotification, markMessageAsRead, isMessageRead } = useAppStore();

  // Charger les messages au démarrage
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Essayer de charger depuis l'API
      const apiMessages = await messagesService.getRecentMessages(maxMessages);
      setMessages(apiMessages);
      
    } catch (err: any) {
      console.warn('API non disponible, utilisation des données de fallback');
      
      // Utiliser les données de fallback
      const limitedMessages = fallbackMessages.slice(0, maxMessages);
      setMessages(limitedMessages);
      
      if (!err.message?.includes('Network')) {
        setError('Erreur lors du chargement des messages');
        addNotification({
          type: 'warning',
          title: 'Messages',
          message: 'Utilisation des données hors ligne'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      // Marquer dans le store global d'abord (pour l'UI immédiate)
      markMessageAsRead(messageId);
      
      // Mettre à jour l'état local
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      
      // Envoyer la mise à jour à l'API en arrière-plan
      await messagesService.markAsRead(messageId);
      
    } catch (err) {
      console.warn('Erreur lors de la synchronisation avec l\'API:', err);
      // L'état local et le store sont déjà mis à jour, donc l'UI reste cohérente
    }
  };

  const sendMessage = async (recipient: string, content: string, type: 'message' | 'announcement' = 'message') => {
    try {
      const newMessage = await messagesService.sendMessage({
        recipientId: recipient,
        content,
        type
      });
      
      // Ajouter le message à la liste si c'est pour nous
      setMessages(prev => [newMessage, ...prev]);
      
      addNotification({
        type: 'success',
        title: 'Message envoyé',
        message: 'Votre message a été envoyé avec succès'
      });
      
      setShowComposeModal(false);
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'envoyer le message'
      });
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return Bell;
      case 'alert':
        return AlertTriangle;
      default:
        return MessageSquare;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'alert':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      default:
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Il y a quelques minutes';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    return `Il y a ${diffDays} jours`;
  };

  // Filtrer les messages
  const filteredMessages = messages.filter(message => {
    const isRead = message.read || isMessageRead(message.id);
    if (filter === 'unread' && isRead) return false;
    if (filter === 'announcements' && message.type !== 'announcement') return false;
    if (searchTerm && !message.content.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !message.senderName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const unreadCount = messages.filter(m => !(m.read || isMessageRead(m.id))).length;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <Loading message="Chargement des messages..." />
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadMessages}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div>Erreur dans le composant Messages</div>}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {compactMode ? 'Messages' : 'Messages récents'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''} message{unreadCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showCompose && (
              <button
                onClick={() => setShowComposeModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Nouveau
              </button>
            )}
            <button
              onClick={loadMessages}
              disabled={loading}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {loading ? <LoadingSpinner size="sm" /> : '🔄'}
            </button>
          </div>
        </div>

        {/* Filters and Search - Only in full mode */}
        {!compactMode && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous</option>
              <option value="unread">Non lus</option>
              <option value="announcements">Annonces</option>
            </select>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'unread' ? 'Aucun message non lu' : 
                 filter === 'announcements' ? 'Aucune annonce' :
                 searchTerm ? 'Aucun message trouvé' : 'Aucun message'}
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => {
              const Icon = getMessageIcon(message.type);
              const colorClass = getMessageColor(message.type);
              
              // Combiner l'état du backend et du store local
              const isRead = message.read || isMessageRead(message.id);

              return (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                    !isRead
                      ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                  }`}
                  onClick={() => !isRead && markAsRead(message.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {message.senderName}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {message.senderRole}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                      <p className={`text-sm text-gray-700 dark:text-gray-300 ${
                        compactMode ? 'line-clamp-2' : ''
                      }`}>
                        {message.content}
                      </p>
                      {!isRead && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                            Nouveau
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Compose Modal */}
        {showComposeModal && (
          <ComposeMessageModal
            onClose={() => setShowComposeModal(false)}
            onSend={sendMessage}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

// Composant modal pour composer un message
interface ComposeMessageModalProps {
  onClose: () => void;
  onSend: (recipient: string, content: string, type?: 'message' | 'announcement') => void;
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({ onClose, onSend }) => {
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'message' | 'announcement'>('message');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!recipient.trim() || !content.trim()) return;
    
    setSending(true);
    try {
      await onSend(recipient, content, type);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Nouveau message
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Destinataire
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Nom ou email du destinataire"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="message">Message privé</option>
              <option value="announcement">Annonce</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tapez votre message ici..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSend}
            disabled={!recipient.trim() || !content.trim() || sending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            {sending ? <LoadingSpinner size="sm" /> : <Send className="w-4 h-4" />}
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};
