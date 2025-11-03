// Données mockées pour la démonstration

export const mockOffers = [
  {
    id: '1',
    title: 'Développeur Frontend React',
    company: 'TechStart Solutions',
    location: 'Paris, France',
    coordinates: [2.3522, 48.8566],
    salary: '35-45k€',
    type: 'CDI',
    status: 'active',
    matchingScore: 92,
    description: 'Rejoignez notre équipe dynamique pour développer des applications React modernes. Nous recherchons un développeur passionné avec de bonnes connaissances en TypeScript.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    posted: '2024-01-15',
    requirements: ['2+ ans d\'expérience React', 'Maîtrise TypeScript', 'Connaissance des API REST']
  },
  {
    id: '2',
    title: 'Développeur Full Stack',
    company: 'InnovateCorp',
    location: 'Lyon, France',
    coordinates: [4.8357, 45.7640],
    salary: '40-50k€',
    type: 'CDI',
    status: 'pending',
    matchingScore: 87,
    description: 'Développement d\'applications web complètes avec une stack moderne. Opportunité de travailler sur des projets variés et innovants.',
    technologies: ['Vue.js', 'Node.js', 'Express', 'MongoDB', 'Docker'],
    posted: '2024-01-12',
    requirements: ['3+ ans d\'expérience', 'Connaissance des bases de données', 'Expérience avec les conteneurs']
  },
  {
    id: '3',
    title: 'Data Scientist Junior',
    company: 'DataIntel Labs',
    location: 'Marseille, France',
    coordinates: [5.3698, 43.2965],
    salary: '38-48k€',
    type: 'CDI',
    status: 'active',
    matchingScore: 75,
    description: 'Analyse de données et développement de modèles d\'apprentissage automatique. Formation continue assurée.',
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'SQL'],
    posted: '2024-01-10',
    requirements: ['Diplôme en informatique ou statistiques', 'Connaissance Python', 'Bases en ML']
  },
  {
    id: '4',
    title: 'Développeur Mobile React Native',
    company: 'MobileFirst Agency',
    location: 'Bordeaux, France',
    coordinates: [-0.5792, 44.8378],
    salary: '42-52k€',
    type: 'CDI',
    status: 'expired',
    matchingScore: 83,
    description: 'Développement d\'applications mobiles cross-platform avec React Native. Projets clients variés.',
    technologies: ['React Native', 'JavaScript', 'Firebase', 'Redux', 'REST APIs'],
    posted: '2024-01-08',
    requirements: ['Expérience React Native', 'Connaissance des stores mobiles', 'Portfolio mobile']
  }
];

export const mockCandidates = [
  {
    id: '1',
    name: 'Alexandre Martin',
    title: 'Développeur Full Stack',
    location: 'Paris, France',
    matchingScore: 94,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    experience: '3 ans',
    availability: 'Immédiate',
    appliedJobs: ['Développeur Frontend React', 'Développeur Full Stack'],
    status: 'pending'
  },
  {
    id: '2',
    name: 'Sophie Dubois',
    title: 'Data Scientist',
    location: 'Lyon, France',
    matchingScore: 89,
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    experience: '2 ans',
    availability: '1 mois',
    appliedJobs: ['Data Scientist Junior'],
    status: 'accepted'
  },
  {
    id: '3',
    name: 'Thomas Laurent',
    title: 'Développeur Mobile',
    location: 'Toulouse, France',
    matchingScore: 85,
    skills: ['React Native', 'Flutter', 'Firebase', 'JavaScript'],
    experience: '4 ans',
    availability: '2 semaines',
    appliedJobs: ['Développeur Mobile React Native'],
    status: 'rejected'
  }
];

export const mockUsers = [
  {
    id: '1',
    name: 'Alexandre Martin',
    email: 'alexandre.martin@itu.edu',
    type: 'student',
    status: 'active',
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Sophie Dubois',
    email: 'sophie.dubois@itu.edu',
    type: 'student',
    status: 'active',
    joinDate: '2024-01-12'
  },
  {
    id: '3',
    name: 'Thomas Laurent',
    email: 'thomas.laurent@itu.edu',
    type: 'student',
    status: 'pending',
    joinDate: '2024-01-20'
  },
  {
    id: '4',
    name: 'Marie Durand',
    email: 'marie.durand@techstart.com',
    type: 'recruiter',
    status: 'active',
    joinDate: '2024-01-10'
  },
  {
    id: '5',
    name: 'Pierre Moreau',
    email: 'pierre.moreau@innovate.com',
    type: 'recruiter',
    status: 'pending',
    joinDate: '2024-01-22'
  }
];

export const mockPendingOffers = [
  {
    id: '5',
    title: 'Stage Développeur Python',
    company: 'DataCorp Solutions',
    location: 'Nice, France',
    salary: '1200€/mois',
    type: 'Stage',
    description: 'Stage de 6 mois en développement Python pour projets data science.',
    technologies: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    submittedDate: '2024-01-23',
    submittedBy: 'Admin ITU',
    submittedFor: 'DataCorp Solutions',
    urgent: true
  },
  {
    id: '6',
    title: 'Développeur React Junior',
    company: 'StartupTech',
    location: 'Marseille, France',
    salary: '32-38k€',
    type: 'CDI',
    description: 'Poste de développeur React dans une startup innovante.',
    technologies: ['React', 'TypeScript', 'Node.js'],
    submittedDate: '2024-01-22',
    submittedBy: 'Jean Dupont',
    submittedFor: null,
    urgent: false
  }
];

// Interface pour les entreprises
export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  address: {
    city: string;
    country: string;
  };
  website?: string;
  contact?: string;
  coordinates: [number, number];
  offers: number;
}

// Données d'entreprises pour la carte
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechStart Solutions',
    description: 'TechStart Solutions est une entreprise innovante spécialisée dans le développement d\'applications web et mobiles. Nous utilisons les dernières technologies pour créer des solutions sur mesure pour nos clients du monde entier.',
    logo: '/src/assets/company-logos/techstart.png',
    address: {
      city: 'Paris',
      country: 'France'
    },
    website: 'https://www.techstartsolutions.com',
    contact: 'contact@techstartsolutions.com',
    coordinates: [2.3522, 48.8566] as [number, number],
    offers: 3
  },
  {
    id: '2',
    name: 'InnovateCorp',
    description: 'InnovateCorp est un leader dans le développement de solutions logicielles pour les entreprises. Nous aidons nos clients à transformer leurs idées en produits numériques performants.',
    logo: '/src/assets/company-logos/innovatecorp.png',
    address: {
      city: 'Lyon',
      country: 'France'
    },
    website: 'https://www.innovatecorp.com',
    contact: 'info@innovatecorp.com',
    coordinates: [4.8357, 45.7640] as [number, number],
    offers: 2
  },
  {
    id: '3',
    name: 'DataIntel Labs',
    description: 'DataIntel Labs est un laboratoire de recherche et développement spécialisé dans l\'intelligence artificielle et l\'analyse de données. Nous transformons les données en insights stratégiques.',
    logo: '/src/assets/company-logos/dataintellabs.png',
    address: {
      city: 'Marseille',
      country: 'France'
    },
    website: 'https://www.dataintellabs.com',
    contact: 'hello@dataintellabs.com',
    coordinates: [5.3698, 43.2965] as [number, number],
    offers: 1
  },
  {
    id: '4',
    name: 'MobileFirst Agency',
    description: 'MobileFirst Agency conçoit et développe des applications mobiles natives et hybrides de haute qualité pour les marchés iOS et Android. Nous mettons l\'utilisateur au cœur de notre processus de conception.',
    logo: '/src/assets/company-logos/mobilefirst.png',
    address: {
      city: 'Bordeaux',
      country: 'France'
    },
    website: 'https://www.mobilefirstagency.com',
    contact: 'contact@mobilefirstagency.com',
    coordinates: [-0.5792, 44.8378] as [number, number],
    offers: 2
  },
  {
    id: '5',
    name: 'DevCorp Solutions',
    description: 'DevCorp Solutions propose des services de développement logiciel complet, de l\'analyse des besoins à la maintenance. Notre équipe d\'experts accompagne les entreprises dans leur transformation digitale.',
    logo: '/src/assets/company-logos/devcorpsolutions.png',
    address: {
      city: 'Toulouse',
      country: 'France'
    },
    website: 'https://www.devcorp-solutions.com',
    contact: 'contact@devcorp-solutions.com',
    coordinates: [1.4442, 43.6047] as [number, number],
    offers: 1
  }
];

// Fonction pour mettre à jour les données de l'entreprise
export const updateCompany = (companyId: string, updatedData: Partial<Company>) => {
  const companyIndex = mockCompanies.findIndex(company => company.id === companyId);
  if (companyIndex !== -1) {
    mockCompanies[companyIndex] = { ...mockCompanies[companyIndex], ...updatedData };
  }
};

// Données de notifications
export interface Notification {
  id: string;
  type: 'candidate_application' | 'offer_published' | 'message';
  target: string; // ID cible (ex: offre_id, candidature_id)
  title: string;
  message: string;
  time: string;
  read: boolean;
  user: 'student' | 'recruiter';
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'candidate_application',
    target: '1',
    title: 'Nouvelle candidature reçue',
    message: 'Jean Dupont a postulé pour le poste de Développeur Full Stack',
    time: 'Il y a 5 minutes',
    read: false,
    user: 'recruiter'
  },
  {
    id: '2',
    type: 'offer_published',
    target: '1',
    title: 'Offre validée',
    message: 'Votre offre "Développeur React" a été validée et publiée',
    time: 'Il y a 2 heures',
    read: false,
    user: 'recruiter'
  },
  {
    id: '3',
    type: 'candidate_application',
    target: '2',
    title: 'Nouvelle candidature',
    message: 'Marie Martin a postulé pour le poste de Data Scientist',
    time: 'Hier',
    read: true,
    user: 'recruiter'
  },
  {
    id: '4',
    type: 'message',
    target: '5',
    title: 'Nouveau message',
    message: 'TechCorp vous a envoyé un message concernant votre candidature',
    time: 'Il y a 3 jours',
    read: false,
    user: 'student'
  }
];

export const mockAnalytics = {
  student: {
    applications: 12,
    responses: 8,
    interviews: 3,
    offers: 1,
    profileViews: 45,
    matchingAverage: 82
  },
  recruiter: {
    activeOffers: 6,
    totalApplications: 127,
    shortlisted: 23,
    interviews: 15,
    hires: 4,
    averageMatchingScore: 78
  }
};

import { ProfileData } from '@/hooks/useProfileData';

// État global pour le profil étudiant avec position
export let studentProfileData: ProfileData = {
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
  ],
  formations: [
    {
      id: "1",
      institution: "Université de Paris",
      degree: "Master en Informatique",
      fieldOfStudy: "Génie Logiciel",
      period: "2019 - 2021",
      description: "Spécialisation en développement d'applications web et mobiles. Projet de fin d'études sur l'optimisation des performances des bases de données NoSQL."
    },
    {
      id: "2",
      institution: "École 42",
      degree: "Architecte en technologies numériques",
      period: "2016 - 2019",
      description: "Formation par projets axée sur la programmation C, les algorithmes et les systèmes Unix."
    }
  ]
};

export const updateStudentProfile = (newProfileData: ProfileData) => {
  studentProfileData = newProfileData;
};

export const getStudentProfile = () => studentProfileData;

// Ancienne fonction pour la localisation
export const updateStudentLocation = (location: string, coordinates: [number, number]) => {
  studentProfileData.personalInfo.location = location;
  studentProfileData.personalInfo.coordinates = coordinates;
};

export const getStudentLocation = () => studentProfileData.personalInfo;



export const preRempliCV: ProfileData = {
  personalInfo: {
    name: "Jeanne Dupont",
    title: "Data Scientist & Analyste de Données",
    description: "Analyste de données curieuse et motivée, avec une première expérience en machine learning et une passion pour la résolution de problèmes complexes. Je cherche à appliquer mes compétences analytiques et de programmation dans un environnement stimulant.",
    email: "jeanne.dupont.cv@email.com",
    phone: "+33 7 98 76 54 32",
    location: "Lyon, France",
    coordinates: [4.8357, 45.7640],
    linkedin: "linkedin.com/in/jeanne-dupont-cv",
    github: "github.com/jeanne-dupont-cv",
    website: "jeanne-dupont.io",
    availability: "Disponible à partir de septembre",
    remoteWork: true,
    profileImage: "/src/assets/profile-photo.jpg"
  },
  technicalSkills: [
    {
      title: "Science des Données",
      skills: [
        { name: "Python", level: "Avancé" },
        { name: "Pandas & NumPy", level: "Avancé" },
        { name: "Scikit-learn", level: "Intermédiaire" },
        { name: "SQL", level: "Avancé" },
        { name: "Tableau", level: "Intermédiaire" }
      ]
    },
    {
      title: "Développement",
      skills: [
        { name: "Git", level: "Avancé" },
        { name: "Docker", level: "Débutant" },
        { name: "API REST", level: "Intermédiaire" }
      ]
    }
  ],
  languages: [
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "Courant" }
  ],
  softSkills: [
    "Esprit critique",
    "Analyse de données",
    "Communication",
    "Autonomie",
    "Curiosité intellectuelle"
  ],
  projects: [
    {
      title: "Analyse de sentiment sur des avis clients",
      description: "Projet universitaire utilisant le NLP pour classifier des milliers d'avis clients. Modèle basé sur Scikit-learn avec un score F1 de 88%.",
      link: "github.com/jeanne-dupont-cv/nlp-project"
    }
  ],
  experiences: [
    {
      title: "Stage - Data Analyst",
      company: "DataIntel Labs",
      location: "Lyon, France",
      period: "Mars 2023 - Août 2023",
      type: "Stage",
      description: "Nettoyage et analyse de grands ensembles de données clients pour identifier des tendances de consommation. Création de dashboards de suivi sur Tableau.",
      technologies: ["Python", "SQL", "Tableau"]
    }
  ],
  formations: [
    {
      id: "1",
      institution: "Université Claude Bernard Lyon 1",
      degree: "Master en Science des Données",
      fieldOfStudy: "Statistiques et Informatique",
      period: "2021 - 2023",
      description: "Master spécialisé dans l'apprentissage automatique, les bases de données et la visualisation de données."
    },
    {
      id: "2",
      institution: "Université Lumière Lyon 2",
      degree: "Licence en Économie et Gestion",
      period: "2018 - 2021",
      description: "Parcours économétrie."
    }
  ]
};