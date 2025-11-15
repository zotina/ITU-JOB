// src/services/firebaseService.ts
import { db, auth } from '@/config/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  addDoc, 
  updateDoc,
  serverTimestamp,
  QueryConstraint,
  deleteDoc
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { mockCompanies, mockOffers, mockCandidates } from '@/data/mockData';

// Types for our data models
export interface Company {
  id: string;
  name: string;
  location: string;
  coordinates?: [number, number];
  offers: number;
  logo?: string;
  description?: string;
  industry?: string;
  size?: string;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  technologies: string[];
  description: string;
  matchingScore: number;
  status?: string; // Add status field
  postedDate?: string;
  deadline?: string;
  requirements?: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  skills: string[];
  experiences: any[];
  education: any[];
  applications: string[];
  profilePicture?: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  type: string;
  status: 'pending' | 'accepted' | 'rejected' | 'interview' | 'offered';
  appliedDate: string;
  offerId: string;
  companyId?: string;
}

// Service class to handle Firebase operations
class FirebaseService {
  private currentUser: FirebaseUser | null = null;
  private initialized = false;

  constructor() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (!user) {
        // Sign in anonymously if no user is signed in
        this.signInAnonymously();
      }
    });
  }

  private async signInAnonymously() {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      // Continue with mock data if Firebase fails
    }
  }

  // Wait for initialization and current user
  private async ensureInitialized(): Promise<boolean> {
    if (this.initialized) return true;
    
    // Sign in anonymously if needed
    if (!this.currentUser) {
      await this.signInAnonymously();
    }
    
    this.initialized = true;
    return !!this.currentUser;
  }

  // Company operations - now companies are stored within user profiles
  async getCompanies(): Promise<Company[]> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        // Get users with role 'recruiter' which contain company information
        const q = query(collection(db, 'users'), where('role', '==', 'recruiter'));
        const querySnapshot = await getDocs(q);
        
        const companies: Company[] = [];
        for (const doc of querySnapshot.docs) {
          const userData = doc.data();
          // Extract company information from user profile if present
          if (userData.company) {
            companies.push({
              id: doc.id,
              name: userData.company.name || userData.companyName || 'Company Name',
              location: userData.company.address?.city || userData.company.address?.street || 'Location',
              coordinates: userData.company.coordinates || [47.5, -18.9], // Default Madagascar coordinates
              offers: userData.stats?.totalOffers || 0,
              logo: userData.company.logo || '/src/assets/company-logos/default.png',
              description: userData.company.description || '',
              industry: userData.company.industry || '',
              size: userData.company.size || ''
            });
          }
        }
        return companies;
      } else {
        // Fallback to mock data
        return mockCompanies.map(company => ({
          id: company.id,
          name: company.name,
          location: company.location,
          coordinates: company.coordinates,
          offers: company.offers,
          logo: company.logo,
          description: company.description || '',
          industry: company.industry || '',
          size: company.size || ''
        }));
      }
    } catch (error) {
      console.error('Error getting companies:', error);
      // Fallback to mock data
      return mockCompanies.map(company => ({
        id: company.id,
        name: company.name,
        location: company.location,
        coordinates: company.coordinates,
        offers: company.offers,
        logo: company.logo,
        description: company.description || '',
        industry: company.industry || '',
        size: company.size || ''
      }));
    }
  }

  async getCompanyById(id: string): Promise<Company | null> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          // Extract company information from user profile if present
          if (userData.role === 'recruiter' && userData.company) {
            return {
              id: docSnap.id,
              name: userData.company.name || userData.companyName || 'Company Name',
              location: userData.company.address?.city || userData.company.address?.street || 'Location',
              coordinates: userData.company.coordinates || [47.5, -18.9], // Default Madagascar coordinates
              offers: userData.stats?.totalOffers || 0,
              logo: userData.company.logo || '/src/assets/company-logos/default.png',
              description: userData.company.description || '',
              industry: userData.company.industry || '',
              size: userData.company.size || ''
            };
          }
        }
      }
      // Fallback to mock data
      const company = mockCompanies.find(c => c.id === id);
      if (company) {
        return {
          id: company.id,
          name: company.name,
          location: company.location,
          coordinates: company.coordinates,
          offers: company.offers,
          logo: company.logo,
          description: company.description || '',
          industry: company.industry || '',
          size: company.size || ''
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting company by ID:', error);
      // Fallback to mock data
      const company = mockCompanies.find(c => c.id === id);
      if (company) {
        return {
          id: company.id,
          name: company.name,
          location: company.location,
          coordinates: company.coordinates,
          offers: company.offers,
          logo: company.logo,
          description: company.description || '',
          industry: company.industry || '',
          size: company.size || ''
        };
      }
      return null;
    }
  }

  // Job offer operations
  async getOffers(userId?: string): Promise<JobOffer[]> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        let q;
        if (userId) {
          // Get the user profile to check if they're a recruiter and which company they belong to
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'recruiter' && userData.companyName) {
              // If user is a recruiter, only show offers from their company
              q = query(collection(db, 'offers'), where('companyName', '==', userData.companyName));
            } else {
              // For students or other roles, show all offers
              q = query(collection(db, 'offers'));
            }
          } else {
            // If no user profile exists, show all offers
            q = query(collection(db, 'offers'));
          }
        } else {
          // If no userId provided, show all offers
          q = query(collection(db, 'offers'));
        }
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
          const offerData = doc.data();
          return {
            id: doc.id,
            ...offerData,
            // Ensure the company name is available in the expected format
            company: offerData.companyName || offerData.company || 'Unknown Company'
          } as JobOffer;
        });
      } else {
        // Fallback to mock data
        return mockOffers.map(offer => ({
          id: offer.id,
          title: offer.title,
          company: offer.company,
          location: offer.location,
          salary: offer.salary,
          type: offer.type,
          technologies: offer.technologies,
          description: offer.description,
          matchingScore: offer.matchingScore,
          postedDate: offer.postedDate || new Date().toISOString().split('T')[0],
          deadline: offer.deadline || '',
          requirements: offer.requirements || []
        }));
      }
    } catch (error) {
      console.error('Error getting offers:', error);
      // Fallback to mock data
      return mockOffers.map(offer => ({
        id: offer.id,
        title: offer.title,
        company: offer.company,
        location: offer.location,
        salary: offer.salary,
        type: offer.type,
        technologies: offer.technologies,
        description: offer.description,
        matchingScore: offer.matchingScore,
        postedDate: offer.postedDate || new Date().toISOString().split('T')[0],
        deadline: offer.deadline || '',
        requirements: offer.requirements || []
      }));
    }
  }

  async getOfferById(id: string): Promise<JobOffer | null> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const docRef = doc(db, 'offers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const offerData = docSnap.data();
          return {
            id: docSnap.id,
            ...offerData,
            // Ensure the company name is available in the expected format
            company: offerData.companyName || offerData.company || 'Unknown Company'
          } as JobOffer;
        }
      }
      // Fallback to mock data
      const offer = mockOffers.find(o => o.id === id);
      if (offer) {
        return {
          id: offer.id,
          title: offer.title,
          company: offer.company,
          location: offer.location,
          salary: offer.salary,
          type: offer.type,
          technologies: offer.technologies,
          description: offer.description,
          matchingScore: offer.matchingScore,
          postedDate: offer.postedDate || new Date().toISOString().split('T')[0],
          deadline: offer.deadline || '',
          requirements: offer.requirements || []
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting offer by ID:', error);
      // Fallback to mock data
      const offer = mockOffers.find(o => o.id === id);
      if (offer) {
        return {
          id: offer.id,
          title: offer.title,
          company: offer.company,
          location: offer.location,
          salary: offer.salary,
          type: offer.type,
          technologies: offer.technologies,
          description: offer.description,
          matchingScore: offer.matchingScore,
          postedDate: offer.postedDate || new Date().toISOString().split('T')[0],
          deadline: offer.deadline || '',
          requirements: offer.requirements || []
        };
      }
      return null;
    }
  }

  // Candidate operations - now candidates are stored within user profiles
  async getCandidates(): Promise<Candidate[]> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        // Get users with role 'student' which contain candidate information
        const q = query(collection(db, 'users'), where('role', '==', 'student'));
        const querySnapshot = await getDocs(q);
        
        const candidates: Candidate[] = [];
        for (const doc of querySnapshot.docs) {
          const userData = doc.data();
          // Extract candidate information from user profile
          candidates.push({
            id: doc.id,
            name: `${userData.prenom || ''} ${userData.nom || ''}`.trim(),
            email: userData.email,
            phone: userData.personalInfo?.phone || userData.phone || '',
            location: userData.personalInfo?.location || 'Location inconnue',
            skills: userData.technicalSkills?.flatMap((category: any) => 
              category.skills?.map((skill: any) => skill.name) || []
            ) || [],
            experiences: userData.experiences || [],
            education: userData.formations || [],
            applications: userData.stats?.totalApplications || [],
            profilePicture: userData.personalInfo?.profileImage || userData.profileImage
          });
        }
        return candidates;
      } else {
        // Fallback to mock data
        return mockCandidates.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          location: candidate.location,
          skills: candidate.skills,
          experiences: candidate.experiences || [],
          education: candidate.education || [],
          applications: candidate.applications || [],
          profilePicture: candidate.profilePicture
        }));
      }
    } catch (error) {
      console.error('Error getting candidates:', error);
      // Fallback to mock data
      return mockCandidates.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        location: candidate.location,
        skills: candidate.skills,
        experiences: candidate.experiences || [],
        education: candidate.education || [],
        applications: candidate.applications || [],
        profilePicture: candidate.profilePicture
      }));
    }
  }

  async getCandidateById(id: string): Promise<Candidate | null> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          // Extract candidate information from user profile if it's a student
          if (userData.role === 'student') {
            return {
              id: docSnap.id,
              name: `${userData.prenom || ''} ${userData.nom || ''}`.trim(),
              email: userData.email,
              phone: userData.personalInfo?.phone || userData.phone || '',
              location: userData.personalInfo?.location || 'Location inconnue',
              skills: userData.technicalSkills?.flatMap((category: any) => 
                category.skills?.map((skill: any) => skill.name) || []
              ) || [],
              experiences: userData.experiences || [],
              education: userData.formations || [],
              applications: userData.stats?.totalApplications || [],
              profilePicture: userData.personalInfo?.profileImage || userData.profileImage
            };
          }
        }
      }
      // Fallback to mock data
      const candidate = mockCandidates.find(c => c.id === id);
      if (candidate) {
        return {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          location: candidate.location,
          skills: candidate.skills,
          experiences: candidate.experiences || [],
          education: candidate.education || [],
          applications: candidate.applications || [],
          profilePicture: candidate.profilePicture
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting candidate by ID:', error);
      // Fallback to mock data
      const candidate = mockCandidates.find(c => c.id === id);
      if (candidate) {
        return {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          location: candidate.location,
          skills: candidate.skills,
          experiences: candidate.experiences || [],
          education: candidate.education || [],
          applications: candidate.applications || [],
          profilePicture: candidate.profilePicture
        };
      }
      return null;
    }
  }

  // Application operations
  async getApplications(userId?: string, offerId?: string): Promise<Application[]> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        let q;
        if (userId) {
          // Get the user profile to check if they're a recruiter
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'recruiter' && userData.companyName) {
              // If user is a recruiter, get applications for offers from their company
              if (offerId) {
                // If specific offerId is provided, only get applications for that offer
                // Also ensure it belongs to their company
                const offerDoc = await getDoc(doc(db, 'offers', offerId));
                if (offerDoc.exists() && offerDoc.data().company === userData.companyName) {
                  q = query(
                    collection(db, 'applications'), 
                    where('offerId', '==', offerId)
                  );
                } else {
                  // If offer doesn't belong to their company, return empty results
                  q = query(
                    collection(db, 'applications'),
                    where('offerId', '==', 'nonexistent')
                  );
                }
              } else {
                // Get all applications for offers from their company
                // First get the offers from their company
                const offersSnapshot = await getDocs(
                  query(collection(db, 'offers'), where('company', '==', userData.companyName))
                );
                const offerIds = offersSnapshot.docs.map(doc => doc.id);
                
                if (offerIds.length > 0) {
                  q = query(
                    collection(db, 'applications'),
                    where('offerId', 'in', offerIds)
                  );
                } else {
                  // If no offers found for the company, return empty array
                  q = query(
                    collection(db, 'applications'),
                    where('offerId', '==', 'nonexistent')
                  );
                }
              }
            } else {
              // For students, only show their own applications
              q = query(collection(db, 'applications'), where('studentId', '==', userId));
            }
          } else {
            // Default to student's applications if no user profile
            q = query(collection(db, 'applications'), where('studentId', '==', userId));
          }
        } else {
          // If no userId provided, return empty array as default behavior
          q = query(
            collection(db, 'applications'),
            where('studentId', '==', 'nonexistent')
          );
        }
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
      } else {
        // Return mock applications
        return [];
      }
    } catch (error) {
      console.error('Error getting applications:', error);
      return [];
    }
  }

  async addApplication(applicationData: Omit<Application, 'id' | 'appliedDate'>): Promise<string | null> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        // Get the offer details to retrieve the company information
        let companyId: string | undefined;
        let companyName: string | undefined;
        
        if (applicationData.offerId) {
          const offerDoc = await getDoc(doc(db, 'offers', applicationData.offerId));
          if (offerDoc.exists()) {
            const offerData = offerDoc.data();
            // In the new structure, company name is stored as companyName in the offer
            companyName = offerData.companyName || offerData.company;
            
            // In the new structure, the recruiter user ID serves as company ID
            // The offer might have a recruiterId field that links to the company/user
            if (offerData.recruiterId) {
              companyId = offerData.recruiterId;
            } else {
              // Try to find the company by name in users collection
              const recruitersSnapshot = await getDocs(
                query(collection(db, 'users'), where('companyName', '==', companyName))
              );
              if (!recruitersSnapshot.empty) {
                // Use the first matching recruiter's ID as company ID
                companyId = recruitersSnapshot.docs[0].id;
              }
            }
          }
        }
        
        const docRef = await addDoc(collection(db, 'applications'), {
          ...applicationData,
          appliedDate: serverTimestamp(),
          status: 'pending',
          isNew: true, // Mark as new when first created
          // Use the studentId from applicationData if provided, otherwise use the authenticated user's UID
          studentId: applicationData.studentId || this.currentUser.uid,
          // Add company details if available
          companyId,
          company: companyName || applicationData.company || '', // Use provided company name if offer lookup fails
        });
        return docRef.id;
      } else {
        // For now, just return null since we don't want to modify mock data directly
        return null;
      }
    } catch (error) {
      console.error('Error adding application:', error);
      return null;
    }
  }

  async updateApplication(id: string, data: Partial<Application>): Promise<void> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const docRef = doc(db, 'applications', id);
        await updateDoc(docRef, data);
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  }

  // User profile operations
  async getUserProfile(userId: string): Promise<any> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          // Create default profile if it doesn't exist
          return null;
        }
      }
      // For now, return null to use existing mock data approach
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async saveUserProfile(userId: string, profileData: any): Promise<void> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
          ...profileData,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  // AI Recommendations operations
  async getAIRecommendations(userId: string): Promise<any | null> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const docRef = doc(db, 'ai_recommendations', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          // No recommendations found for this user
          return null;
        }
      }
      // For now, return null to use existing mock data approach
      return null;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return null;
    }
  }

  async saveAIRecommendations(recommendations: any): Promise<void> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const docRef = doc(db, 'ai_recommendations', recommendations.userId);
        // Clean the recommendations object to remove any undefined values and convert dates to timestamps
        const cleanedRecommendations = this.cleanObjectForFirestore(recommendations);
        await updateDoc(docRef, {
          ...cleanedRecommendations,
          lastUpdated: serverTimestamp(),
          generatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error saving AI recommendations:', error);
    }
  }

  // Helper function to clean objects for Firestore compatibility
  private cleanObjectForFirestore(obj: any): any {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) {
        continue; // Skip undefined values
      } else if (value instanceof Date) {
        // Convert dates to timestamps for Firestore
        cleaned[key] = serverTimestamp();
      } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        // Recursively clean nested objects
        cleaned[key] = this.cleanObjectForFirestore(value);
      } else {
        // Keep primitive values and arrays as is
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  // Notification operations
  async getUserNotifications(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const q = query(
          collection(db, 'notifications'), 
          where('userId', '==', userId),
          // Order by createdAt descending to get newest notifications first
          // Limit the results
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        // Fallback to mock data
        return [];
      }
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  async getUnreadNotifications(userId: string): Promise<any[]> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const q = query(
          collection(db, 'notifications'), 
          where('userId', '==', userId),
          where('read', '==', false)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        // Fallback to mock data
        return [];
      }
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      return [];
    }
  }

  async createNotification(notificationData: any): Promise<string> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        // Create a new notification document
        const docRef = await addDoc(collection(db, 'notifications'), {
          ...notificationData,
          read: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return docRef.id;
      } else {
        // Fallback to mock data - return a generated ID
        return `notification-${Date.now()}`;
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const docRef = doc(db, 'notifications', notificationId);
        // First, verify that the notification belongs to the user
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.userId === userId) {
            await updateDoc(docRef, {
              read: true,
              updatedAt: serverTimestamp()
            });
          } else {
            throw new Error('Unauthorized: Notification does not belong to user');
          }
        } else {
          throw new Error('Notification not found');
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        // Get all unread notifications for the user
        const q = query(
          collection(db, 'notifications'), 
          where('userId', '==', userId),
          where('read', '==', false)
        );
        const querySnapshot = await getDocs(q);
        
        // Update each notification to mark as read
        const batch = doc(db, 'notifications');
        const updates = querySnapshot.docs.map(docSnap => {
          return updateDoc(doc(db, 'notifications', docSnap.id), {
            read: true,
            updatedAt: serverTimestamp()
          });
        });
        
        await Promise.all(updates);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const docRef = doc(db, 'notifications', notificationId);
        // First, verify that the notification belongs to the user
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.userId === userId) {
            await deleteDoc(docRef);
          } else {
            throw new Error('Unauthorized: Notification does not belong to user');
          }
        } else {
          throw new Error('Notification not found');
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

export const firebaseService = new FirebaseService();