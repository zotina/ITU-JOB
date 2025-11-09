import { useState } from "react";
import { getStudentProfile, updateStudentProfile, mockAppointments } from "@/data/mockData";
import { Appointment } from "@/types/appointment";

export interface ProfileData {
  personalInfo: {
    name: string;
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

export const useProfileData = () => {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<ProfileData>(initialProfileData);

  const startEditing = () => {
    setEditingData({ ...profileData });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditingData({ ...profileData });
    setIsEditing(false);
  };

  const saveChanges = () => {
    setProfileData({ ...editingData });
    // Mettre à jour les données dans mockData
    updateStudentProfile({ ...editingData });
    setIsEditing(false);
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

  return {
    profileData: isEditing ? editingData : profileData,
    setProfileData, // Exposer la fonction de mise à jour directe
    isEditing,
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