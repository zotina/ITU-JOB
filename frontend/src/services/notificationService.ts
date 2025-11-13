import { dataProvider } from '@/data/dataProvider';
import { useAuth } from '@/hooks/useAuth';

// Types for notifications
export interface Notification {
  id: string;
  userId: string; // Recipient user ID
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'application' | 'offer' | 'system';
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  actionUrl?: string; // Optional URL for notification action
  metadata?: Record<string, any>; // Additional data related to the notification
}

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'application' | 'offer' | 'system';
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  private static readonly COLLECTION_NAME = 'notifications';
  
  /**
   * Get all notifications for a specific user
   */
  static async getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    try {
      return await dataProvider.getUserNotifications(userId, limit);
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }
  
  /**
   * Get unread notifications for a specific user
   */
  static async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      return await dataProvider.getUnreadNotifications(userId);
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      throw error;
    }
  }
  
  /**
   * Create a new notification
   */
  static async createNotification(notificationData: CreateNotificationData): Promise<string> {
    try {
      return await dataProvider.createNotification(notificationData);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
  
  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      await dataProvider.markNotificationAsRead(notificationId, userId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
  
  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      await dataProvider.markAllNotificationsAsRead(userId);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
  
  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      await dataProvider.deleteNotification(notificationId, userId);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
  
  /**
   * Create and send a notification to a specific user
   */
  static async sendNotification(
    userId: string, 
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' | 'application' | 'offer' | 'system' = 'info',
    actionUrl?: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    const notificationData: CreateNotificationData = {
      userId,
      title,
      message,
      type,
      actionUrl,
      metadata
    };
    
    return await this.createNotification(notificationData);
  }
  
  /**
   * Create a notification for application status update
   */
  static async createApplicationNotification(
    userId: string,
    applicationId: string,
    applicationStatus: string,
    offerTitle: string,
    company: string
  ): Promise<string> {
    let title = '';
    let message = '';
    let type: 'info' | 'success' | 'warning' | 'error' | 'application' | 'offer' | 'system' = 'info';
    
    switch (applicationStatus.toLowerCase()) {
      case 'accepted':
        title = 'Candidature acceptée';
        message = `Félicitations ! Votre candidature pour ${offerTitle} chez ${company} a été acceptée.`;
        type = 'success';
        break;
      case 'rejected':
        title = 'Candidature rejetée';
        message = `Votre candidature pour ${offerTitle} chez ${company} a été rejetée.`;
        type = 'error';
        break;
      case 'interview':
        title = 'Entretien programmé';
        message = `Votre entretien pour ${offerTitle} chez ${company} a été programmé.`;
        type = 'info';
        break;
      case 'offered':
        title = 'Offre d\'emploi reçue';
        message = `Vous avez reçu une offre d'emploi pour ${offerTitle} chez ${company}.`;
        type = 'success';
        break;
      default:
        title = 'Mise à jour de candidature';
        message = `Statut mis à jour pour votre candidature à ${offerTitle} chez ${company}.`;
        type = 'info';
    }
    
    return await this.sendNotification(
      userId,
      title,
      message,
      type,
      `/student/applications`,
      {
        applicationId,
        applicationStatus,
        offerTitle,
        company
      }
    );
  }
  
  /**
   * Create a notification for new job offers
   */
  static async createNewOfferNotification(
    userId: string,
    offerId: string,
    offerTitle: string,
    company: string
  ): Promise<string> {
    const title = 'Nouvelle offre correspondante';
    const message = `Une nouvelle offre "${offerTitle}" chez ${company} correspond à votre profil.`;
    
    return await this.sendNotification(
      userId,
      title,
      message,
      'offer',
      `/student/offers/${offerId}`,
      {
        offerId,
        offerTitle,
        company
      }
    );
  }
}