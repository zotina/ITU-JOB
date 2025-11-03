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
    github: "github.com/alexandre-martin",
    website: "alexandre-martin.dev",
    availability: "Disponible immédiatement",
    remoteWork: true,
    profileImage: "/src/assets/profile-photo.jpg"
  },
  technicalSkills: [
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
    }
  ],
  languages: [
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "Courant" },
    { name: "Espagnol", level: "Intermédiaire" }
  ],
  softSkills: [
    "Leadership d'équipe",
    "Communication efficace",
    "Gestion de projet",
    "Travail d'équipe",
    "Résolution de problèmes",
    "Adaptabilité"
  ],
  projects: [
    {
      title: "Plateforme E-commerce",
      description: "Application complète de commerce électronique avec React, Node.js et Stripe",
      link: "github.com/alexandre/ecommerce"
    },
    {
      title: "Dashboard Analytics",
      description: "Tableau de bord d'analyse de données en temps réel avec D3.js",
      link: "github.com/alexandre/dashboard"
    }
  ],
  experiences: [
    {
      title: "Lead Developer",
      company: "TechStart Solutions",
      location: "Paris, France",
      period: "2021 - Présent",
      type: "CDI",
      description: "Direction de l'équipe frontend et architecture des applications React",
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"]
    }
  ]
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