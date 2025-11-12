// src/data/dataProvider.ts
import { firebaseService, Company, JobOffer, Candidate, Application } from '@/services/firebaseService';
import { mockCompanies, mockOffers, mockCandidates } from './mockData';
import { getApplications as getMockApplications, addApplication as addMockApplication } from './applicationStore';

// Data provider that uses Firebase as primary source but falls back to mock data
export const dataProvider = {
  // Companies
  getCompanies: async (): Promise<Company[]> => {
    try {
      return await firebaseService.getCompanies();
    } catch (error) {
      console.warn('Firebase failed, using mock data for companies', error);
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
  },

  getCompanyById: async (id: string): Promise<Company | null> => {
    try {
      return await firebaseService.getCompanyById(id);
    } catch (error) {
      console.warn('Firebase failed, using mock data for company', error);
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
  },

  // Job Offers
  getOffers: async (): Promise<JobOffer[]> => {
    try {
      return await firebaseService.getOffers();
    } catch (error) {
      console.warn('Firebase failed, using mock data for offers', error);
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
  },

  getOfferById: async (id: string): Promise<JobOffer | null> => {
    try {
      return await firebaseService.getOfferById(id);
    } catch (error) {
      console.warn('Firebase failed, using mock data for offer', error);
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
  },

  // Candidates
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      return await firebaseService.getCandidates();
    } catch (error) {
      console.warn('Firebase failed, using mock data for candidates', error);
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
  },

  getCandidateById: async (id: string): Promise<Candidate | null> => {
    try {
      return await firebaseService.getCandidateById(id);
    } catch (error) {
      console.warn('Firebase failed, using mock data for candidate', error);
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
  },

  // Applications - We'll use Firebase primarily but fallback to mock system
  getApplications: async (userId?: string): Promise<Application[]> => {
    try {
      const firebaseApps = await firebaseService.getApplications(userId);
      if (firebaseApps.length > 0) {
        return firebaseApps;
      } else {
        // If Firebase has no data, return mock data
        const mockApps = getMockApplications();
        return mockApps.map(app => ({
          id: app.id,
          studentId: app.studentId || 'mock-student',
          studentName: app.studentName || 'Mock Student',
          company: app.company,
          position: app.position,
          location: app.location,
          salary: app.salary,
          type: app.type,
          status: app.status || 'pending',
          appliedDate: app.appliedDate || new Date().toISOString(),
          offerId: app.offerId
        }));
      }
    } catch (error) {
      console.warn('Firebase failed, using mock data for applications', error);
      const mockApps = getMockApplications();
      return mockApps.map(app => ({
        id: app.id,
        studentId: app.studentId || 'mock-student',
        studentName: app.studentName || 'Mock Student',
        company: app.company,
        position: app.position,
        location: app.location,
        salary: app.salary,
        type: app.type,
        status: app.status || 'pending',
        appliedDate: app.appliedDate || new Date().toISOString(),
        offerId: app.offerId
      }));
    }
  },

  addApplication: async (applicationData: Omit<Application, 'id' | 'appliedDate'>): Promise<void> => {
    try {
      // Try to add to Firebase first
      const id = await firebaseService.addApplication(applicationData);
      if (!id) {
        // If Firebase fails or returns null, use mock data function
        addMockApplication({
          company: applicationData.company,
          position: applicationData.position,
          location: applicationData.location,
          salary: applicationData.salary,
          type: applicationData.type,
          offerId: applicationData.offerId,
          studentId: applicationData.studentId,
          studentName: applicationData.studentName
        });
      }
    } catch (error) {
      console.warn('Firebase failed, adding to mock data', error);
      // Fallback to mock data
      addMockApplication({
        company: applicationData.company,
        position: applicationData.position,
        location: applicationData.location,
        salary: applicationData.salary,
        type: applicationData.type,
        offerId: applicationData.offerId,
        studentId: applicationData.studentId,
        studentName: applicationData.studentName
      });
    }
  },
  
  updateApplication: async (id: string, data: Partial<Application>): Promise<void> => {
    try {
      await firebaseService.updateApplication(id, data);
      // If Firebase fails, we might want to update mock data as well, but generally
      // updates to existing applications are less critical than creating new ones
    } catch (error) {
      console.warn('Firebase failed, updating mock data', error);
    }
  },
  
  // User profile operations
  getUserProfile: async (userId: string) => {
    try {
      const profile = await firebaseService.getUserProfile(userId);
      if (profile) {
        return profile;
      } else {
        // Fallback to mock data if no profile found in Firebase
        return null;
      }
    } catch (error) {
      console.warn('Firebase failed, getting profile from mock data', error);
      return null;
    }
  },
  
  saveUserProfile: async (userId: string, profileData: any) => {
    try {
      await firebaseService.saveUserProfile(userId, profileData);
      // If Firebase succeeds, we don't need to update mock data
    } catch (error) {
      console.warn('Firebase failed, saving to mock data', error);
      // Could consider fallback to saving to mock data if needed
    }
  }
};