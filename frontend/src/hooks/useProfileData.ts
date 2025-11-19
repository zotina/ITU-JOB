import { useState, useEffect } from "react";
import { getStudentProfile, updateStudentProfile, mockAppointments } from "@/data/mockData";
import { Appointment } from "@/types/appointment";
import { dataProvider } from "@/data/dataProvider";
import { useToast } from '@/hooks/use-toast';

export interface ProfileData {
  id?: string;
  email: string;
  prenom: string;
  nom: string;
  role: string;
  personalInfo?: {
    title?: string;
    description?: string;
    phone?: string;
    location?: string;
    coordinates?: [number, number];
    linkedin?: string;
    github?: string;
    website?: string;
    availability?: string;
    remoteWork?: boolean;
    profileImage?: string;
  };
  company?: {
    name: string;
    description?: string;
    logo?: string;
    address?: {
      street?: string;
      city?: string;
      country?: string;
    };
    website?: string;
    email?: string;
    phone?: string;
    coordinates?: [number, number];
    industry?: string;
    size?: string;
    verified?: boolean;
    featured?: boolean;
  };
  recruiterInfo?: {
    position?: string;
    phone?: string;
    bio?: string;
  };
  technicalSkills?: {
    title: string;
    skills: { name: string; level: string; years?: number }[];
  }[];
  languages?: {
    name: string;
    level: string;
  }[];
  softSkills?: string[];
  projects?: {
    id?: string;
    title: string;
    description: string;
    link?: string;
    technologies?: string[];
    image?: string;
    achievements?: string[];
  }[];
  experiences?: {
    id: string;
    title: string;
    company: string;
    location: string;
    period: string;
    type: string;
    description: string;
    technologies: string[];
    achievements?: string[];
  }[];
  formations?: {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    period: string;
    description?: string;
    grade?: string;
    achievements?: string[];
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    link?: string;
  }[];
  stats?: {
    totalApplications?: number;
    pendingApplications?: number;
    acceptedApplications?: number;
    profileViews?: number;
    totalOffers?: number;
    activeOffers?: number;
    totalApplicationsReceived?: number;
  };
  appointments: Appointment[];
}

// Initialiser à partir des données de mockData
const initialProfileData: ProfileData = {
  id: '',
  email: '',
  prenom: '',
  nom: '',
  role: 'student',
  ...getStudentProfile(),
  appointments: mockAppointments
};

import { useAuth } from './useAuth';

interface UseProfileDataOptions {
  specificUserId?: string; // Option to load a specific user's profile instead of the current user's
}

export const useProfileData = (options?: UseProfileDataOptions) => {
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<ProfileData>(initialProfileData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const startEditing = () => {
    setEditingData({ ...profileData });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditingData({ ...profileData });
    setIsEditing(false);
  };

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      setProfileData({ ...editingData });
      // Mettre à jour les données dans mockData
      updateStudentProfile({ ...editingData });
      
      // ✅ Sauvegarder sur Firestore si l'utilisateur est authentifié
      // ET qu'il modifie son propre profil (pas celui d'un autre utilisateur)
      const userIdToSave = options?.specificUserId || currentUser?.id;
      
      if (currentUser && userIdToSave === currentUser.id) {
        // ✅ On sauvegarde uniquement si c'est le profil de l'utilisateur connecté
        await dataProvider.saveUserProfile(currentUser.id, editingData);
        
        // Si le prénom ou le nom a été mis à jour, envoyer un événement
        const updatedFirstName = editingData.prenom || currentUser.prenom;
        const updatedLastName = editingData.nom || currentUser.nom;
        
        if (updatedFirstName !== currentUser.prenom || updatedLastName !== currentUser.nom) {
          const updatedUser = {
            ...currentUser,
            prenom: updatedFirstName,
            nom: updatedLastName
          };
          
          sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          const event = new CustomEvent('userUpdated', { detail: updatedUser });
          window.dispatchEvent(event);
        }
      } else if (currentUser && userIdToSave !== currentUser.id) {
        // ❌ Un recruteur ne peut pas sauvegarder le profil d'un autre utilisateur
        console.warn('Cannot save another user\'s profile');
        toast({
          title: "Action non autorisée",
          description: "Vous ne pouvez pas modifier le profil d'un autre utilisateur.",
          variant: "destructive"
        });
        return; // Ne pas sauvegarder
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const startEditingWithData = (newData: ProfileData) => {
    setEditingData(newData);
    setIsEditing(true);
  };

  const updateEditingData = (newData: Partial<ProfileData>) => {
  setEditingData(prev => {
    // Clone profond pour les objets imbriqués
    const result = { ...prev };
    
    for (const [key, value] of Object.entries(newData)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Fusionner les objets imbriqués
        result[key] = { ...prev[key], ...value };
      } else {
        // Remplacer directement pour les primitives et tableaux
        result[key] = value;
      }
    }
    
    return result;
  });
};

  // Appointment management functions
  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAppointment = {
      ...appointment,
      id: `appointment-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setProfileData(prev => ({
      ...prev,
      appointments: [...prev.appointments, newAppointment]
    }));
    setEditingData(prev => ({
      ...prev,
      appointments: [...prev.appointments, newAppointment]
    }));
  };

  const updateAppointment = (id: string, updatedData: Partial<Appointment>) => {
    setProfileData(prev => ({
      ...prev,
      appointments: prev.appointments.map(app => 
        app.id === id ? { ...app, ...updatedData, updatedAt: new Date() } : app
      )
    }));
    setEditingData(prev => ({
      ...prev,
      appointments: prev.appointments.map(app => 
        app.id === id ? { ...app, ...updatedData, updatedAt: new Date() } : app
      )
    }));
  };

  const deleteAppointment = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      appointments: prev.appointments.filter(app => app.id !== id)
    }));
    setEditingData(prev => ({
      ...prev,
      appointments: prev.appointments.filter(app => app.id !== id)
    }));
  };

  // Charger le profil depuis Firestore
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        
        // Determine which user's profile to load
        const userIdToLoad = options?.specificUserId || currentUser?.id;
        
        if (userIdToLoad) {
          const profileFromFirestore = await dataProvider.getUserProfile(userIdToLoad);
          if (profileFromFirestore) {
            // Ensure the profile data is in the correct format for the UI
            // The Firestore data has prenom, nom at root level, but UI might expect personalInfo structure
            const normalizedProfile = {
              ...initialProfileData, // Start with defaults
              ...profileFromFirestore // Override with Firestore data
            };
            setProfileData(normalizedProfile);
            setEditingData(normalizedProfile);
          } else {
            // If profile is not found in Firestore, use initial data with the ID
            const profileWithId = {
              ...initialProfileData,
              id: userIdToLoad,
              // Don't override prenom, nom, etc. if they don't exist in Firestore
              // Keep them as empty strings or defaults from initialProfileData
            };
            setProfileData(profileWithId);
            setEditingData(profileWithId);
          }
        } else {
          // If no user is authenticated and no specific user ID is provided, use the initial data
          setProfileData(initialProfileData);
          setEditingData(initialProfileData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // On error, use the initial data
        setProfileData(initialProfileData);
        setEditingData(initialProfileData);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [currentUser?.id, options?.specificUserId]);

  return {
    profileData: isEditing ? editingData : profileData,
    setProfileData, // Exposer la fonction de mise à jour directe
    isEditing,
    isLoading,
    startEditing,
    cancelEditing,
    saveChanges,
    startEditingWithData,
    updateEditingData,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };
};