import { useState, useEffect } from "react";
import { getStudentProfile, updateStudentProfile, mockAppointments } from "@/data/mockData";
import { Appointment } from "@/types/appointment";
import { dataProvider } from "@/data/dataProvider";

export interface ProfileData {
  personalInfo: {
    nom: string;
    prenom : string;
    title?: string;
    description?: string;
    email: string;
    phone: string;
    location?: string;
    coordinates?: [number, number];
    linkedin?: string;
    github?: string;
    website?: string;
    availability?: string;
    remoteWork?: boolean;
    profileImage?: string;
  };
  technicalSkills?: {
    title: string;
    skills: { name: string; level: string }[];
  }[];
  languages?: {
    name: string;
    level: string;
  }[];
  softSkills?: string[];
  projects?: {
    title: string;
    description: string;
    link?: string;
  }[];
  experiences?: {
    title: string;
    company: string;
    location: string;
    period: string;
    type: string;
    description: string;
    technologies: string[];
  }[];
  formations?: {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    period: string;
    description?: string;
  }[];
  appointments: Appointment[];
}

// Initialiser à partir des données de mockData
const initialProfileData: ProfileData = {
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
      
      // Sauvegarder sur Firestore si l'utilisateur est authentifié et que ce n'est pas une consultation
      // (si specificUserId est fourni, on ne sauvegarde pas car c'est une visualisation de profil d'autrui)
      if (currentUser && !options?.specificUserId) {
        await dataProvider.saveUserProfile(currentUser.id, editingData);
        
        // Si le nom dans personalInfo a été mis à jour, envoyer un événement pour mettre à jour le contexte d'authentification
        if (editingData.personalInfo?.name) {
          const newName = editingData.personalInfo.name;
          // Extraire le prénom et le nom de famille à partir du nom complet
          const nameParts = newName.split(' ');
          const updatedFirstName = nameParts[0];
          const updatedLastName = nameParts.slice(1).join(' ') || currentUser.nom;
          
          // Si le nom a changé, envoyer un événement personnalisé pour mettre à jour le contexte
          if (updatedFirstName !== currentUser.prenom || updatedLastName !== currentUser.nom) {
            // Créer un nouvel objet utilisateur avec les nouvelles données
            const updatedUser = {
              ...currentUser,
              prenom: updatedFirstName,
              nom: updatedLastName
            };
            
            // Mettre à jour l'utilisateur dans le stockage de session
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            // Envoyer un événement personnalisé pour notifier les autres parties de l'application
            const event = new CustomEvent('userUpdated', { detail: updatedUser });
            window.dispatchEvent(event);
          }
        }
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditingWithData = (newData: ProfileData) => {
    setEditingData(newData);
    setIsEditing(true);
  };

  const updateEditingData = (newData: Partial<ProfileData>) => {
    setEditingData(prev => ({ ...prev, ...newData }));
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
            setProfileData(profileFromFirestore);
            setEditingData(profileFromFirestore);
          }
        } else {
          // If no user is authenticated and no specific user ID is provided, use the initial data
          setProfileData(initialProfileData);
          setEditingData(initialProfileData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
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