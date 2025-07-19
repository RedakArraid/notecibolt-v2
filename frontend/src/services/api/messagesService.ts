import { apiService } from './apiService';
import { globalCache } from '../../utils/cache';

export interface Message {
  id: string;
  senderName: string;
  senderRole: string;
  senderId: string;
  content: string;
  type: 'message' | 'announcement' | 'alert';
  timestamp: string;
  read: boolean;
  recipientId?: string;
  attachments?: {
    name: string;
    url: string;
    size: number;
  }[];
}

export interface SendMessageRequest {
  recipientId: string;
  content: string;
  type?: 'message' | 'announcement' | 'alert';
  attachments?: File[];
}

export interface MessageThread {
  id: string;
  participants: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}

function buildQueryString(params: Record<string, any>): string {
  const esc = encodeURIComponent;
  return (
    '?' +
    Object.keys(params)
      .filter((k) => params[k] !== undefined && params[k] !== null)
      .map((k) => esc(k) + '=' + esc(params[k]))
      .join('&')
  );
}

class MessagesService {
  private readonly baseUrl = '/messages';
  private readonly cachePrefix = 'messages';

  // Obtenir les messages récents
  async getRecentMessages(limit = 10): Promise<Message[]> {
    const cacheKey = `${this.cachePrefix}-recent-${limit}`;
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    try {
      const url = `${this.baseUrl}/recent${buildQueryString({ limit })}`;
      const res = await apiService.get(url);
      globalCache.set(cacheKey, res.data, 2 * 60 * 1000); // Cache 2 minutes
      return res.data;
    } catch (error) {
      console.error('Erreur lors du chargement des messages récents:', error);
      throw error;
    }
  }

  // Obtenir tous les messages pour l'utilisateur connecté
  async getMessages(page = 1, limit = 20): Promise<{
    messages: Message[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const cacheKey = `${this.cachePrefix}-page-${page}-${limit}`;
    try {
      const url = `${this.baseUrl}${buildQueryString({ page, limit })}`;
      const result = await apiService.get(url);
      globalCache.set(cacheKey, result, 5 * 60 * 1000); // Cache 5 minutes
      return result;
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      throw error;
    }
  }

  // Envoyer un message
  async sendMessage(messageData: SendMessageRequest): Promise<Message> {
    try {
      // Pour les fichiers, il faudrait adapter apiService pour gérer FormData, ici on fait simple
      return await apiService.post(`${this.baseUrl}/send`, messageData);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      throw error;
    }
  }

  // Marquer un message comme lu
  async markAsRead(messageId: string): Promise<void> {
    try {
      await apiService.put(`${this.baseUrl}/${messageId}/read`, {});
      this.invalidateMessageCaches();
      globalCache.delete(`${this.cachePrefix}-unread-count`);
      this.updateMessageInCache(messageId, { read: true });
    } catch (error) {
      console.error('Erreur lors du marquage du message comme lu:', error);
      throw error;
    }
  }

  // Mettre à jour un message dans le cache
  private updateMessageInCache(messageId: string, updates: Partial<Message>): void {
    // Mettre à jour les messages récents dans le cache
    const recentCacheKeys = [10, 20, 50].map(limit => `${this.cachePrefix}-recent-${limit}`);
    
    recentCacheKeys.forEach(cacheKey => {
      const cachedMessages = globalCache.get(cacheKey);
      if (cachedMessages && Array.isArray(cachedMessages)) {
        const updatedMessages = cachedMessages.map((msg: Message) => 
          msg.id === messageId ? { ...msg, ...updates } : msg
        );
        globalCache.set(cacheKey, updatedMessages, 2 * 60 * 1000);
      }
    });
    
    // Invalider le cache des messages non lus
    globalCache.delete(`${this.cachePrefix}-unread-count`);
  }

  // Obtenir le nombre de messages non lus
  async getUnreadCount(): Promise<number> {
    const cacheKey = `${this.cachePrefix}-unread-count`;
    const cached = globalCache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }
    try {
      const res = await apiService.get(`${this.baseUrl}/unread-count`);
      const count = res.data?.count ?? 0;
      globalCache.set(cacheKey, count, 1 * 60 * 1000); // Cache 1 minute
      return count;
    } catch (error) {
      console.error('Erreur lors du chargement du nombre de messages non lus:', error);
      return 0;
    }
  }

  // Obtenir les contacts/utilisateurs pour composer un message
  async getContacts(search?: string): Promise<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    email: string;
  }[]> {
    const cacheKey = `${this.cachePrefix}-contacts-${search || 'all'}`;
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    try {
      const url = `${this.baseUrl}/contacts${buildQueryString(search ? { search } : {})}`;
      const res = await apiService.get(url);
      const contacts = Array.isArray(res) ? res : res.data;
      globalCache.set(cacheKey, contacts, 10 * 60 * 1000); // Cache 10 minutes
      return contacts;
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      throw error;
    }
  }

  // Rechercher dans les messages
  async searchMessages(query: string, filters?: {
    type?: 'message' | 'announcement' | 'alert';
    senderId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Message[]> {
    try {
      const url = `${this.baseUrl}/search${buildQueryString({ q: query, ...filters })}`;
      return await apiService.get(url);
    } catch (error) {
      console.error('Erreur lors de la recherche de messages:', error);
      throw error;
    }
  }

  // Invalider tous les caches liés aux messages
  private invalidateMessageCaches(): void {
    // Utiliser la fonction d'invalidation par pattern du cache
    globalCache.invalidateByPattern([this.cachePrefix]);
  }

  // Polling pour les nouveaux messages (WebSocket alternative)
  startPolling(callback: (messages: Message[]) => void, interval = 30000): () => void {
    let isPolling = true;
    const poll = async () => {
      if (!isPolling) return;
      try {
        const messages = await this.getRecentMessages(5);
        callback(messages);
      } catch (error) {
        console.warn('Erreur lors du polling des messages:', error);
      }
      if (isPolling) {
        setTimeout(poll, interval);
      }
    };
    setTimeout(poll, interval);
    return () => {
      isPolling = false;
    };
  }
}

export const messagesService = new MessagesService();