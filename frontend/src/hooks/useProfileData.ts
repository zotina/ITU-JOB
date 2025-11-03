import { useState } from "react";
import { getStudentProfile, updateStudentProfile } from "@/data/mockData";

export interface ProfileData {
  personalInfo: {
    name: string;
    title: string;
    description: string;
    email: string;
    phone: string;
    location: string;
    coordinates?: [number, number];
    linkedin: string;
    github?: string;
    website?: string;
    availability: string;
    remoteWork: boolean;
    profileImage: string;
  };
  technicalSkills: {
    title: string;
    skills: { name: string; level: string }[];
  }[];
  languages: {
    name: string;
    level: string;
  }[];
  softSkills: string[];
  projects: {
    title: string;
    description: string;
    link?: string;
  }[];
  experiences: {
    title: string;
    company: string;
    location: string;
    period: string;
    type: string;
    description: string;
    technologies: string[];
  }[];
  formations: {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    period: string;
    description?: string;
  }[];
}

// Initialiser à partir des données de mockData
const initialProfileData: ProfileData = getStudentProfile();

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

  return {
    profileData: isEditing ? editingData : profileData,
    setProfileData, // Exposer la fonction de mise à jour directe
    isEditing,
    startEditing,
    cancelEditing,
    saveChanges,
    startEditingWithData,
    updateEditingData
  };
};