import { useState } from "react";

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
  skills: {
    title: string;
    skills: { name: string; level: string }[];
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
}

const initialProfileData: ProfileData = {
  personalInfo: {
    name: "Alexandre Martin",
    title: "Développeur Full Stack",
    description: "Passionné par le développement web moderne avec 5 ans d'expérience dans la création d'applications React et Node.js. Spécialisé dans l'architecture frontend et l'optimisation des performances.",
    email: "alexandre.martin@email.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    coordinates: [2.3522, 48.8566],
    linkedin: "linkedin.com/in/alexandre-martin",
    github: "",
    website: "",
    availability: "Disponible immédiatement",
    remoteWork: true,
    profileImage: "/src/assets/profile-photo.jpg"
  },
  skills: [
    {
      title: "Développement Frontend",
      skills: [
        { name: "React", level: "Expert" },
        { name: "TypeScript", level: "Avancé" },
        { name: "Next.js", level: "Avancé" },
        { name: "Tailwind CSS", level: "Expert" },
        { name: "Vue.js", level: "Intermédiaire" }
      ]
    },
    {
      title: "Développement Backend",
      skills: [
        { name: "Node.js", level: "Avancé" },
        { name: "Express", level: "Avancé" },
        { name: "PostgreSQL", level: "Avancé" },
        { name: "MongoDB", level: "Intermédiaire" },
        { name: "Docker", level: "Intermédiaire" }
      ]
    },
    {
      title: "Langues",
      skills: [
        { name: "Français", level: "Natif" },
        { name: "Anglais", level: "Courant" },
        { name: "Espagnol", level: "Intermédiaire" }
      ]
    },
    {
      title: "Compétences Interpersonnelles",
      skills: [
        { name: "Leadership d'équipe", level: "Avancé" },
        { name: "Communication", level: "Expert" },
        { name: "Gestion de projet", level: "Avancé" },
        { name: "Mentoring", level: "Intermédiaire" }
      ]
    }
  ],
  experiences: []
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
    setIsEditing(false);
  };

  const updateEditingData = (newData: Partial<ProfileData>) => {
    setEditingData(prev => ({ ...prev, ...newData }));
  };

  return {
    profileData: isEditing ? editingData : profileData,
    isEditing,
    startEditing,
    cancelEditing,
    saveChanges,
    updateEditingData
  };
};