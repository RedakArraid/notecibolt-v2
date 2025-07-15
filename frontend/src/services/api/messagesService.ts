import { apiService } from './apiService';
import { messages as fallbackMessages } from '../../data/mockData';

export interface Message {
  id: string;
  senderName: string;
  senderRole: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  type?: 'message' | 'announcement' | 'alert';
}

class MessagesService {
  async getRecentMessages(userId?: string): Promise<Message[]> {
    try {
      const endpoint = userId ? `/messages/user/${userId}/recent` : '/messages/me/recent';
      const response = await apiService.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch messages from API, using fallback data:', error);
      return fallbackMessages;
    }
  }

  async getAllMessages(userId?: string): Promise<Message[]> {
    try {
      const endpoint = userId ? `/messages/user/${userId}` : '/messages/me';
      const response = await apiService.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.warn('Failed to fetch all messages from API:', error);
      return fallbackMessages;
    }
  }

  async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      await apiService.put(`/messages/${messageId}/read`, {});
      return true;
    } catch (error) {
      console.warn('Failed to mark message as read:', error);
      return false;
    }
  }

  async sendMessage(data: {
    recipientIds: string[];
    subject: string;
    content: string;
    priority?: 'low' | 'medium' | 'high';
  }): Promise<boolean> {
    try {
      await apiService.post('/messages', data);
      return true;
    } catch (error) {
      console.warn('Failed to send message:', error);
      return false;
    }
  }

  async getUnreadCount(userId?: string): Promise<number> {
    try {
      const endpoint = userId ? `/messages/user/${userId}/unread-count` : '/messages/me/unread-count';
      const response = await apiService.get(endpoint);
      return response.data?.count || response.count || 0;
    } catch (error) {
      console.warn('Failed to fetch unread count from API:', error);
      return fallbackMessages.filter(m => !m.read).length;
    }
  }
}

export const messagesService = new MessagesService();
