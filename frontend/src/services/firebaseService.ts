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
  QueryConstraint
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

  // Company operations
  async getCompanies(): Promise<Company[]> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const q = query(collection(db, 'companies'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
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
        const docRef = doc(db, 'companies', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Company;
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
  async getOffers(): Promise<JobOffer[]> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const q = query(collection(db, 'offers'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobOffer));
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
          return { id: docSnap.id, ...docSnap.data() } as JobOffer;
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

  // Candidate operations
  async getCandidates(): Promise<Candidate[]> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        const q = query(collection(db, 'candidates'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
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
        const docRef = doc(db, 'candidates', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Candidate;
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
  async getApplications(userId?: string): Promise<Application[]> {
    try {
      const useFirebase = await this.ensureInitialized();
      if (useFirebase && this.currentUser) {
        let q;
        if (userId) {
          q = query(collection(db, 'applications'), where('studentId', '==', userId));
        } else {
          q = query(collection(db, 'applications'));
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
        const docRef = await addDoc(collection(db, 'applications'), {
          ...applicationData,
          appliedDate: serverTimestamp(),
          status: 'pending',
          isNew: true, // Mark as new when first created
          // Use the studentId from applicationData if provided, otherwise use the authenticated user's UID
          studentId: applicationData.studentId || this.currentUser.uid,
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
}

export const firebaseService = new FirebaseService();