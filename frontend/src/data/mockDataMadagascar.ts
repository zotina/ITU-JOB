// Données mockées pour Madagascar

export const mockOffers = [
  {
    id: '1',
    title: 'Développeur Full Stack',
    company: 'Orange Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: '2-3M Ar/mois',
    type: 'CDI',
    status: 'active',
    matchingScore: 92,
    description: 'Rejoignez notre équipe technique pour développer des solutions digitales innovantes. Nous recherchons un développeur passionné avec de bonnes connaissances en technologies web modernes.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript'],
    posted: '2024-01-15',
    requirements: ['3+ ans d\'expérience', 'Maîtrise des technologies web', 'Connaissance des API REST']
  },
  {
    id: '2',
    title: 'Data Scientist',
    company: 'Telma Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: '2.5-3.5M Ar/mois',
    type: 'CDI',
    status: 'active',
    matchingScore: 87,
    description: 'Analyse de données et développement de modèles prédictifs pour améliorer nos services clients. Opportunité de travailler sur des projets d\'intelligence artificielle.',
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'SQL'],
    posted: '2024-01-12',
    requirements: ['Diplôme en informatique ou statistiques', 'Connaissance Python', 'Expérience en ML']
  },
  {
    id: '3',
    title: 'Développeur Mobile',
    company: 'Airtel Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: '1.8-2.8M Ar/mois',
    type: 'CDI',
    status: 'active',
    matchingScore: 75,
    description: 'Développement d\'applications mobiles pour les services financiers et de téléphonie mobile. Nous cherchons un développeur mobile expérimenté.',
    technologies: ['React Native', 'JavaScript', 'Firebase', 'Redux', 'REST APIs'],
    posted: '2024-01-10',
    requirements: ['Expérience en développement mobile', 'Connaissance des stores mobiles', 'Portfolio mobile']
  },
  {
    id: '4',
    title: 'Ingénieur DevOps',
    company: 'SystAsia Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: '2.5-3.8M Ar/mois',
    type: 'CDI',
    status: 'active',
    matchingScore: 83,
    description: 'Responsable de l\'infrastructure cloud et de l\'automatisation des déploiements. Expérience avec les technologies cloud et CI/CD requise.',
    technologies: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
    posted: '2024-01-08',
    requirements: ['Expérience DevOps', 'Connaissance des plateformes cloud', 'Automatisation CI/CD']
  }
];

export const mockCandidates = [
  {
    id: '1',
    name: 'Andriamalala Raviro',
    title: 'Développeur Full Stack',
    location: 'Antananarivo, Madagascar',
    matchingScore: 94,
    skills: ['React', 'Node.js', 'MongoDB', 'Python', 'TypeScript'],
    experience: '4 ans',
    availability: 'Immédiate',
    appliedJobs: ['Développeur Full Stack', 'Ingénieur DevOps'],
    status: 'pending'
  },
  {
    id: '2',
    name: 'Rakotoarisoa Fanantenana',
    title: 'Data Scientist',
    location: 'Antananarivo, Madagascar',
    matchingScore: 89,
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas'],
    experience: '3 ans',
    availability: 'Disponible à partir de février',
    appliedJobs: ['Data Scientist'],
    status: 'accepted'
  },
  {
    id: '3',
    name: 'Razafindramary Hasina',
    title: 'Développeur Mobile',
    location: 'Antananarivo, Madagascar',
    matchingScore: 85,
    skills: ['React Native', 'Flutter', 'Firebase', 'JavaScript', 'Redux'],
    experience: '2 ans',
    availability: 'Immédiat',
    appliedJobs: ['Développeur Mobile'],
    status: 'pending'
  }
];

export const mockUsers = [
  {
    id: '1',
    name: 'Andriamalala Raviro',
    email: 'andriamalala.raviro@etu.uit.mg',
    type: 'student',
    status: 'active',
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Rakotoarisoa Fanantenana',
    email: 'rakotoarisoa.fanantenana@etu.uit.mg',
    type: 'student',
    status: 'active',
    joinDate: '2024-01-12'
  },
  {
    id: '3',
    name: 'Razafindramary Hasina',
    email: 'razafindramary.hasina@etu.uit.mg',
    type: 'student',
    status: 'pending',
    joinDate: '2024-01-20'
  },
  {
    id: '4',
    name: 'Rajoelina Marie',
    email: 'marie.r@orange.mg',
    type: 'recruiter',
    status: 'active',
    joinDate: '2024-01-10'
  },
  {
    id: '5',
    name: 'Randrianarisoa Patrick',
    email: 'patrick.randrianarisoa@telma.mg',
    type: 'recruiter',
    status: 'pending',
    joinDate: '2024-01-22'
  }
];

export const mockPendingOffers = [
  {
    id: '5',
    title: 'Stage Ingénieur Logiciel',
    company: 'Microlink Madagascar',
    location: 'Antananarivo, Madagascar',
    salary: '400€/mois',
    type: 'Stage',
    description: 'Stage de 6 mois en développement logiciel pour projets web et mobiles.',
    technologies: ['Angular', 'Spring Boot', 'PostgreSQL', 'Docker'],
    submittedDate: '2024-01-23',
    submittedBy: 'Admin ITU',
    submittedFor: 'Microlink Madagascar',
    urgent: true
  },
  {
    id: '6',
    title: 'Développeur React Junior',
    company: 'SystAsia Madagascar',
    location: 'Antananarivo, Madagascar',
    salary: '2-3M Ar/mois',
    type: 'CDI',
    description: 'Poste de développeur React dans une entreprise informatique leader à Madagascar.',
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
    name: 'Orange Madagascar',
    description: 'Orange Madagascar est un opérateur de télécommunication de premier plan à Madagascar, spécialisé dans les services mobiles et internet à très haut débit. Nous proposons des solutions digitales innovantes pour les particuliers et les entreprises.',
    logo: '/src/assets/company-logos/orange.png',
    address: {
      city: 'Antananarivo',
      country: 'Madagascar'
    },
    website: 'https://www.orange.mg',
    contact: 'contact@orange.mg',
    coordinates: [47.5061, -18.9121] as [number, number],
    offers: 5
  },
  {
    id: '2',
    name: 'Telma Madagascar',
    description: 'Telma Madagascar est l\'un des principaux opérateurs de téléphonie mobile à Madagascar. Nous nous engageons à fournir des services de télécommunication de qualité et des solutions numériques adaptées aux besoins de nos clients.',
    logo: '/src/assets/company-logos/telma.png',
    address: {
      city: 'Antananarivo',
      country: 'Madagascar'
    },
    website: 'https://www.telma.mg',
    contact: 'info@telma.mg',
    coordinates: [47.5061, -18.9121] as [number, number],
    offers: 3
  },
  {
    id: '3',
    name: 'Airtel Madagascar',
    description: 'Airtel Madagascar est une entreprise de télécommunications qui propose des services de téléphonie mobile, d\'internet et de services financiers numériques. Nous investissons constamment dans l\'innovation technologique.',
    logo: '/src/assets/company-logos/airtel.png',
    address: {
      city: 'Antananarivo',
      country: 'Madagascar'
    },
    website: 'https://www.airtel.mg',
    contact: 'hello@airtel.mg',
    coordinates: [47.5061, -18.9121] as [number, number],
    offers: 2
  },
  {
    id: '4',
    name: 'SystAsia Madagascar',
    description: 'SystAsia Madagascar est une entreprise spécialisée dans le développement de logiciels et solutions informatiques. Nous accompagnons les entreprises dans leur transformation digitale avec des solutions sur mesure.',
    logo: '/src/assets/company-logos/systasia.png',
    address: {
      city: 'Antananarivo',
      country: 'Madagascar'
    },
    website: 'https://www.systasia.mg',
    contact: 'contact@systasia.mg',
    coordinates: [47.5061, -18.9121] as [number, number],
    offers: 4
  },
  {
    id: '5',
    name: 'Microlink Madagascar',
    description: 'Microlink Madagascar propose des services de développement logiciel, d\'hébergement web et de solutions informatiques aux entreprises et particuliers. Nous mettons l\'accent sur la qualité et la proximité.',
    logo: '/src/assets/company-logos/microlink.png',
    address: {
      city: 'Antananarivo',
      country: 'Madagascar'
    },
    website: 'https://www.microlink.mg',
    contact: 'info@microlink.mg',
    coordinates: [47.5061, -18.9121] as [number, number],
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
    message: 'Andriamalala Raviro a postulé pour le poste de Développeur Full Stack',
    time: 'Il y a 5 minutes',
    read: false,
    user: 'recruiter'
  },
  {
    id: '2',
    type: 'offer_published',
    target: '1',
    title: 'Offre validée',
    message: 'Votre offre "Développeur Full Stack" a été validée et publiée',
    time: 'Il y a 2 heures',
    read: false,
    user: 'recruiter'
  },
  {
    id: '3',
    type: 'candidate_application',
    target: '2',
    title: 'Nouvelle candidature',
    message: 'Rakotoarisoa Fanantenana a postulé pour le poste de Data Scientist',
    time: 'Hier',
    read: true,
    user: 'recruiter'
  },
  {
    id: '4',
    type: 'message',
    target: '5',
    title: 'Nouveau message',
    message: 'Orange Madagascar vous a envoyé un message concernant votre candidature',
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
    name: "Andriamalala Raviro",
    title: "Développeur Full Stack",
    description: "Passionné par le développement web moderne avec 4 ans d'expérience dans la création d'applications React et Node.js. Spécialisé dans l'architecture frontend et l'optimisation des performances. Expert dans les technologies web modernes et la conception de solutions scalables.",
    email: "andriamalala.raviro@etu.uit.mg",
    phone: "+261 34 12 345 678",
    location: "Antananarivo, Madagascar",
    coordinates: [47.5061, -18.9121],
    linkedin: "linkedin.com/in/andriamalala-raviro",
    github: "github.com/andriamalala-raviro",
    website: "andriamalala-raviro.mg",
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
        { name: "MongoDB", level: "Avancé" },
        { name: "Docker", level: "Intermédiaire" }
      ]
    }
  ],
  languages: [
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "Courant" },
    { name: "Malgache", level: "Natif" }
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
      title: "Plateforme E-commerce locale",
      description: "Application complète de commerce électronique avec React, Node.js et MongoDB, adaptée au marché malgache",
      link: "github.com/andriamalala/ecommerce-malgache"
    },
    {
      title: "Dashboard Analytics",
      description: "Tableau de bord d'analyse de données en temps réel avec D3.js et Python",
      link: "github.com/andriamalala/dashboard"
    }
  ],
  experiences: [
    {
      title: "Lead Developer",
      company: "SystAsia Madagascar",
      location: "Antananarivo, Madagascar",
      period: "2022 - Présent",
      type: "CDI",
      description: "Direction de l'équipe frontend et architecture des applications React pour les services bancaires et de télécommunication",
      technologies: ["React", "TypeScript", "Node.js", "MongoDB"]
    }
  ],
  formations: [
    {
      id: "1",
      institution: "Institut Universitaire de Technologie d'Antananarivo",
      degree: "Master en Informatique",
      fieldOfStudy: "Génie Logiciel",
      period: "2020 - 2022",
      description: "Spécialisation en développement d'applications web et mobiles. Projet de fin d'études sur l'optimisation des performances des bases de données NoSQL."
    },
    {
      id: "2",
      institution: "Université d'Antananarivo",
      degree: "Licence en Informatique",
      period: "2017 - 2020",
      description: "Formation fondamentale en informatique, programmation orientée objet et systèmes d'information."
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

// Données de rendez-vous
export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  location: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  type: 'interview' | 'meeting' | 'other';
  participants: string[]; // User IDs or emails
  createdBy: string; // ID of the user who created the appointment
  createdAt: Date;
  updatedAt: Date;
}

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Entretien Technique - Développeur Full Stack',
    description: 'Entretien technique avec l\'équipe de développement pour le poste de Développeur Full Stack',
    date: new Date(2025, 10, 15), // Format: année, mois (0-indexé), jour
    startTime: '10:00',
    endTime: '11:00',
    location: 'Orange Madagascar, Antananarivo',
    status: 'confirmed',
    type: 'interview',
    participants: ['student1', 'recruiter1'],
    createdBy: 'recruiter1',
    createdAt: new Date(2025, 10, 10),
    updatedAt: new Date(2025, 10, 12)
  },
  {
    id: '2',
    title: 'Réunion de démarrage - Projet Mobile',
    description: 'Réunion de présentation du projet mobile et des attentes pour les prochaines semaines',
    date: new Date(2025, 10, 18),
    startTime: '14:30',
    endTime: '15:30',
    location: 'SystAsia Madagascar, Antananarivo',
    status: 'pending',
    type: 'meeting',
    participants: ['recruiter2', 'student2'],
    createdBy: 'recruiter2',
    createdAt: new Date(2025, 10, 14),
    updatedAt: new Date(2025, 10, 14)
  },
  {
    id: '3',
    title: 'Entretien Final - Data Scientist',
    description: 'Entretien final pour le poste de Data Scientist. Discussion sur les conditions de travail et la rémunération',
    date: new Date(2025, 10, 20),
    startTime: '16:00',
    endTime: '17:00',
    location: 'Telma Madagascar, Antananarivo',
    status: 'confirmed',
    type: 'interview',
    participants: ['recruiter3', 'student3'],
    createdBy: 'recruiter3',
    createdAt: new Date(2025, 10, 16),
    updatedAt: new Date(2025, 10, 18)
  },
  {
    id: '4',
    title: 'Présentation du projet - Application React Native',
    description: 'Présentation des spécifications techniques pour l\'application mobile React Native',
    date: new Date(2025, 10, 22),
    startTime: '09:30',
    endTime: '10:30',
    location: 'Télétravail',
    status: 'pending',
    type: 'meeting',
    participants: ['recruiter4', 'student4'],
    createdBy: 'recruiter4',
    createdAt: new Date(2025, 10, 19),
    updatedAt: new Date(2025, 10, 19)
  },
  {
    id: '5',
    title: 'Entretien RH - Développeur React',
    description: 'Entretien RH pour le poste de Développeur React. Discussion sur la culture d\'entreprise',
    date: new Date(2025, 10, 12),
    startTime: '11:00',
    endTime: '12:00',
    location: 'Airtel Madagascar, Antananarivo',
    status: 'completed',
    type: 'interview',
    participants: ['recruiter1', 'student1'],
    createdBy: 'recruiter1',
    createdAt: new Date(2025, 10, 8),
    updatedAt: new Date(2025, 10, 12)
  }
];

export const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newAppointment: Appointment = {
    ...appointment,
    id: `appointment-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockAppointments.push(newAppointment);
  return newAppointment;
};

export const updateAppointment = (id: string, updatedData: Partial<Appointment>) => {
  const appointmentIndex = mockAppointments.findIndex(app => app.id === id);
  if (appointmentIndex !== -1) {
    mockAppointments[appointmentIndex] = { 
      ...mockAppointments[appointmentIndex], 
      ...updatedData,
      updatedAt: new Date()
    };
  }
};

export const deleteAppointment = (id: string) => {
  const appointmentIndex = mockAppointments.findIndex(app => app.id === id);
  if (appointmentIndex !== -1) {
    mockAppointments.splice(appointmentIndex, 1);
  }
};



export const preRempliCV: ProfileData = {
  nom: "Rasetrarinjanahary",
  prenom :"Zo Tina",
  email:"zotinafiti@gmail.com",
  personalInfo: {
    name: "Andriamalala Raviro",
    title: "Ingénieur Logiciel & Développeur Full Stack",
    description: "Ingénieur logiciel passionné et motivé, avec une expérience solide en développement web et mobile. Je cherche à appliquer mes compétences techniques dans un environnement technologique stimulant à Madagascar.",
    email: "andriamalala.raviro@etu.uit.mg",
    phone: "+261 34 12 345 678",
    location: "Antananarivo, Madagascar",
    coordinates: [47.5061, -18.9121],
    linkedin: "linkedin.com/in/andriamalala-raviro",
    github: "github.com/andriamalala-raviro",
    website: "andriamalala-raviro.mg",
    availability: "Disponible immédiatement",
    remoteWork: true,
    profileImage: "/src/assets/profile-photo.jpg"
  },
  technicalSkills: [
    {
      title: "Technologies Web",
      skills: [
        { name: "React", level: "Expert" },
        { name: "TypeScript", level: "Avancé" },
        { name: "Next.js", level: "Avancé" },
        { name: "Node.js", level: "Avancé" },
        { name: "Express", level: "Avancé" }
      ]
    },
    {
      title: "Base de données & Autres",
      skills: [
        { name: "MongoDB", level: "Avancé" },
        { name: "PostgreSQL", level: "Avancé" },
        { name: "Docker", level: "Intermédiaire" },
        { name: "Git", level: "Expert" }
      ]
    }
  ],
  languages: [
    { name: "Malgache", level: "Natif" },
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "Courant" }
  ],
  softSkills: [
    "Leadership",
    "Résolution de problèmes",
    "Communication",
    "Autonomie",
    "Travail d'équipe",
    "Adaptabilité"
  ],
  projects: [
    {
      title: "Système de gestion scolaire pour écoles malgaches",
      description: "Projet universitaire d'un système de gestion scolaire adapté aux besoins locaux. Technologies: React, Node.js, MongoDB.",
      link: "github.com/andriamalala/school-management"
    }
  ],
  experiences: [
    {
      title: "Développeur Full Stack",
      company: "SystAsia Madagascar",
      location: "Antananarivo, Madagascar",
      period: "Juin 2023 - Août 2023",
      type: "Stage",
      description: "Développement d'une application mobile pour un service de transfert d'argent local. Collaboration avec l'équipe technique pour la conception et l'implémentation.",
      technologies: ["React Native", "Node.js", "MongoDB"]
    }
  ],
  formations: [
    {
      id: "1",
      institution: "Institut Universitaire de Technologie d'Antananarivo",
      degree: "Master en Informatique",
      fieldOfStudy: "Génie Logiciel",
      period: "2020 - 2022",
      description: "Spécialisation en développement d'applications web et mobiles. Mémoire sur l'optimisation des performances des applications web à forte charge."
    },
    {
      id: "2",
      institution: "Université d'Antananarivo",
      degree: "Licence en Informatique",
      period: "2017 - 2020",
      description: "Formation fondamentale en informatique avec des cours en programmation, algorithmique et systèmes d'information."
    }
  ]
};