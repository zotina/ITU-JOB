// src/data/dataProvider.ts
import { firebaseService, Company, JobOffer, Candidate, Application } from '@/services/firebaseService';
import { AIRecommendationsData } from '@/services/aiRecommendationsService';

// Data provider that uses Firebase as primary source but falls back to mock data
export const dataProvider = {
  // Companies
  getCompanies: async (): Promise<Company[]> => {
    try {
      return await firebaseService.getCompanies();
    } catch (error) {
      console.warn('Firebase failed, returning empty array for companies', error);
      return [];
    }
  },

  getCompanyById: async (id: string): Promise<Company | null> => {
    try {
      return await firebaseService.getCompanyById(id);
    } catch (error) {
      console.warn('Firebase failed, returning null for company', error);
      return null;
    }
  },

  // Job Offers
  getOffers: async (userId?: string): Promise<JobOffer[]> => {
    try {
      return await firebaseService.getOffers(userId);
    } catch (error) {
      console.warn('Firebase failed, returning empty array for offers', error);
      return [];
    }
  },

  getOfferById: async (id: string): Promise<JobOffer | null> => {
    try {
      return await firebaseService.getOfferById(id);
    } catch (error) {
      console.warn('Firebase failed, returning null for offer', error);
      return null;
    }
  },

  createOffer: async (offerData: Omit<JobOffer, 'id' | 'matchingScore' | 'nbCandidatures'>, userId: string): Promise<string> => {
    try {
      return await firebaseService.createOffer(offerData, userId);
    } catch (error) {
      console.warn('Firebase failed, offer not created', error);
      throw error; // Re-throw to let calling code handle the error
    }
  },

  // Candidates
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      return await firebaseService.getCandidates();
    } catch (error) {
      console.warn('Firebase failed, returning empty array for candidates', error);
      return [];
    }
  },

  getCandidateById: async (id: string): Promise<Candidate | null> => {
    try {
      return await firebaseService.getCandidateById(id);
    } catch (error) {
      console.warn('Firebase failed, returning null for candidate', error);
      return null;
    }
  },

  // Applications - Return empty array if no data in Firebase
  getApplications: async (userId?: string, offerId?: string): Promise<Application[]> => {
    try {
      return await firebaseService.getApplications(userId, offerId);
    } catch (error) {
      console.warn('Firebase failed, returning empty array for applications', error);
      return [];
    }
  },

  addApplication: async (applicationData: Omit<Application, 'id' | 'appliedDate'>): Promise<void> => {
    try {
      await firebaseService.addApplication(applicationData);
    } catch (error) {
      console.warn('Firebase failed, application not added', error);
      throw error; // Re-throw to let calling code handle the error
    }
  },
  
  updateApplication: async (id: string, data: Partial<Application>): Promise<void> => {
    try {
      await firebaseService.updateApplication(id, data);
    } catch (error) {
      console.warn('Firebase failed, application not updated', error);
      throw error; // Re-throw to let calling code handle the error
    }
  },
  
  markApplicationsAsViewed: async (applicationIds: string[]): Promise<void> => {
    try {
      await firebaseService.markApplicationsAsViewed(applicationIds);
    } catch (error) {
      console.warn('Firebase failed, applications not marked as viewed', error);
      throw error; // Re-throw to let calling code handle the error
    }
  },

  listenToApplications: (userId: string | undefined, offerId: string | undefined, callback: (applications: Application[]) => void) => {
    try {
      return firebaseService.listenToApplications(userId, offerId, callback);
    } catch (error) {
      console.warn('Firebase failed, cannot listen to applications', error);
      // Return a mock unsubscribe function
      return () => {};
    }
  },
  
  // User profile operations
  getUserProfile: async (userId: string) => {
    try {
      return await firebaseService.getUserProfile(userId);
    } catch (error) {
      console.warn('Firebase failed, returning null for user profile', error);
      return null;
    }
  },
  
  saveUserProfile: async (userId: string, profileData: any) => {
    try {
      await firebaseService.saveUserProfile(userId, profileData);
    } catch (error) {
      console.warn('Firebase failed, profile not saved', error);
      throw error; // Re-throw to let calling code handle the error
    }
  },
  
  // AI Recommendations operations
  getAIRecommendations: async (userId: string): Promise<AIRecommendationsData | null> => {
    try {
      return await firebaseService.getAIRecommendations(userId);
    } catch (error) {
      console.warn('Firebase failed, returning null for AI recommendations', error);
      return null;
    }
  },
  
  saveAIRecommendations: async (recommendations: AIRecommendationsData): Promise<void> => {
    try {
      await firebaseService.saveAIRecommendations(recommendations);
    } catch (error) {
      console.warn('Firebase failed, AI recommendations not saved', error);
      throw error; // Re-throw to let calling code handle the error
    }
  },

  // Notification operations
  getUserNotifications: async (userId: string, limit: number = 50): Promise<any[]> => {
    try {
      return await firebaseService.getUserNotifications(userId, limit);
    } catch (error) {
      console.warn('Firebase failed, getting notifications from mock data', error);
      // Fallback to mock data
      return [];
    }
  },

  getUnreadNotifications: async (userId: string): Promise<any[]> => {
    try {
      return await firebaseService.getUnreadNotifications(userId);
    } catch (error) {
      console.warn('Firebase failed, getting unread notifications from mock data', error);
      // Fallback to mock data
      return [];
    }
  },

  createNotification: async (notificationData: any): Promise<string> => {
    try {
      return await firebaseService.createNotification(notificationData);
    } catch (error) {
      console.warn('Firebase failed, creating notification in mock data', error);
      // Fallback to mock data - return a generated ID
      return `notification-${Date.now()}`;
    }
  },

  markNotificationAsRead: async (notificationId: string, userId: string): Promise<void> => {
    try {
      await firebaseService.markNotificationAsRead(notificationId, userId);
    } catch (error) {
      console.warn('Firebase failed, marking notification as read in mock data', error);
    }
  },

  markAllNotificationsAsRead: async (userId: string): Promise<void> => {
    try {
      await firebaseService.markAllNotificationsAsRead(userId);
    } catch (error) {
      console.warn('Firebase failed, marking all notifications as read in mock data', error);
    }
  },

  deleteNotification: async (notificationId: string, userId: string): Promise<void> => {
    try {
      await firebaseService.deleteNotification(notificationId, userId);
    } catch (error) {
      console.warn('Firebase failed, deleting notification in mock data', error);
    }
  }
};