// Données mockées pour Madagascar

export const mockOffers = [
  {
    id: '1',
    title: 'Développeur Full Stack',
    company: 'Orange Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: '2-3M MGA/mois',
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
    company: 'Yas Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: '2.5-3.5M MGA/mois',
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
    salary: '1.8-2.8M MGA/mois',
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
    salary: '2.5-3.8M MGA/mois',
    type: 'CDI',
    status: 'active',
    matchingScore: 83,
    description: 'Responsable de l\'infrastructure cloud et de l\'automatisation des déploiements. Expérience avec les technologies cloud et CI/CD requise.',
    technologies: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
    posted: '2024-01-08',
    requirements: ['Expérience DevOps', 'Connaissance des plateformes cloud', 'Automatisation CI/CD']
  },
  {
    id: '5',
    title: 'Stage Développeur Web',
    company: 'Microlink Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: '',
    type: 'Stage',
    status: 'active',
    matchingScore: 88,
    description: 'Stage de 6 mois en développement web pour découvrir les technologies modernes et participer à des projets réels.',
    technologies: ['React', 'Node.js', 'JavaScript', 'CSS', 'HTML'],
    posted: '2024-01-18',
    requirements: ['Étudiant en informatique', 'Bonnes bases en programmation', 'Motivation']
  },
  {
    id: '6',
    title: 'Stage Data Analyst',
    company: 'Orange Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: '',
    type: 'Stage',
    status: 'active',
    matchingScore: 80,
    description: 'Stage de 4 mois en analyse de données pour apprendre à manipuler les données massives et créer des rapports.',
    technologies: ['Python', 'Pandas', 'SQL', 'Excel', 'Power BI'],
    posted: '2024-01-16',
    requirements: ['Étudiant en data science', 'Compétences en statistiques', 'Maîtrise Python']
  },
  {
    id: '7',
    title: 'Stage DevOps Junior',
    company: 'Yas Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: '',
    type: 'Stage',
    status: 'active',
    matchingScore: 75,
    description: 'Stage de 6 mois en DevOps pour apprendre les outils d\'automatisation et les pratiques CI/CD.',
    technologies: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform'],
    posted: '2024-01-20',
    requirements: ['Connaissances en administration système', 'Intérêt pour l\'automatisation', 'Maîtrise Linux']
  },
  {
    id: '8',
    title: 'Stage Mobile App Developer',
    company: 'Airtel Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: '',
    type: 'Stage',
    status: 'active',
    matchingScore: 82,
    description: 'Stage de 5 mois en développement mobile pour participer à la création d\'applications mobiles à fort trafic.',
    technologies: ['React Native', 'Flutter', 'JavaScript', 'Firebase', 'REST APIs'],
    posted: '2024-01-22',
    requirements: ['Bonne connaissance en développement mobile', 'Portfolio d\'applications', 'Passionné de tech']
  }
];

export const mockCandidates = [
  {
    id: '1',
    name: 'Rakotoarisoa Fanantenana',
    title: 'Data Scientist',
    location: 'Antananarivo, Madagascar',
    matchingScore: 94,
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas'],
    experience: '3 ans',
    availability: 'Disponible à partir de février',
    appliedJobs: ['Data Scientist'],
    status: 'accepted'
  },
  {
    id: '2',
    name: 'Andriamalala Raviro',
    title: 'Développeur Full Stack',
    location: 'Antananarivo, Madagascar',
    matchingScore: 60,
    skills: ['React', 'Node.js', 'MongoDB', 'Python', 'TypeScript'],
    experience: '4 ans',
    availability: 'Immédiate',
    appliedJobs: ['Stage Développeur Web'],
    status: 'pending'
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
    salary: '400MGA/mois',
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
    salary: '2-3M MGA/mois',
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
    coordinates: [47.5229909, -18.8842199] as [number, number],
    offers: 5
  },
  {
    id: '2',
    name: 'Yas Madagascar',
    description: 'Yas Madagascar est l\'un des principaux opérateurs de téléphonie mobile à Madagascar. Nous nous engageons à fournir des services de télécommunication de qualité et des solutions numériques adaptées aux besoins de nos clients.',
    logo: '/src/assets/company-logos/yas.png',
    address: {
      city: 'Antananarivo',
      country: 'Madagascar'
    },
    website: 'https://www.yas.mg',
    contact: 'info@telma.mg',
    coordinates: [47.52566623322738, -18.909228523929638] as [number, number],
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
    coordinates: [47.519278, -18.8753376] as [number, number],
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
    message: 'Andriamalala Raviro a postulé pour le poste de Stage Développeur Web',
    time: 'Il y a 5 minutes',
    read: false,
    user: 'recruiter'
  }
  // {
  //   id: '2',
  //   type: 'offer_published',
  //   target: '1',
  //   title: 'Offre validée',
  //   message: 'Votre offre "Développeur Full Stack" a été validée et publiée',
  //   time: 'Il y a 2 heures',
  //   read: false,
  //   user: 'recruiter'
  // },
  // {
  //   id: '3',
  //   type: 'candidate_application',
  //   target: '2',
  //   title: 'Nouvelle candidature',
  //   message: 'Rakotoarisoa Fanantenana a postulé pour le poste de Data Scientist',
  //   time: 'Hier',
  //   read: true,
  //   user: 'recruiter'
  // },
  // {
  //   id: '4',
  //   type: 'message',
  //   target: '5',
  //   title: 'Nouveau message',
  //   message: 'Orange Madagascar vous a envoyé un message concernant votre candidature',
  //   time: 'Il y a 3 jours',
  //   read: false,
  //   user: 'student'
  // }
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
    name: "Rasetrarinjanahary Zo Tina",
    email: "zotinafifi@gmail.com",
    phone: "+261382010328",
    // title: "Développeur Full Stack",
    // description: "Je suis passionné par le développement informatique et les technologies de pointe. Je cherche à rejoindre une équipe dynamique pour contribuer à des projets innovants.",
    location: "Antananarivo, Madagascar",
    coordinates: [-18.9121064, 47.5255857],
    linkedin: "linkedin.com/in/zo-tina-rasetrarinjanahary",
    // github: "github.com/zotina",
    // website: "zotina.mg",
    // availability: "Disponible immédiatement",
    // remoteWork: true,
    profileImage: "/src/assets/non-profil.png"
  },
  technicalSkills: undefined,
  languages: undefined,
  softSkills: undefined,
  projects: undefined,
  experiences: undefined,
  formations: undefined
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
  email:"zotinafifi@gmail.com",
  personalInfo: {
    title: "Développeur Java",
    description: "En tant que développeur avec une passion pour l'architecture des bases de données, je suis actuellement en 3ème année à ITUniversity. Mon engagement dans la conception de systèmes robustes et évolutifs me permet de transformer les besoins systèmes en solutions adaptées, particulièrement grâce à mes compétences en développement et en gestion de projet. Je m'investis dans le développement et la conception d'applications, en analysant les besoins des clients pour proposer des solutions innovantes qui renforcent la performance des systèmes existants.",
    email: "zotinafifi@gmail.com",
    phone: "+261382010328",
    location: "Antananarivo 105 Ambohidratrimo",
    coordinates: [-18.7667, 47.4333],
    linkedin: "linkedin.com/in/zo-tina-rasetrarinjanahary-659638272",
    github: "",
    website: "",
    availability: "Disponible",
    remoteWork: true,
    profileImage: "/src/assets/profil.jpeg"
  },
  technicalSkills: [
    {
      title: "Langages de programmation",
      skills: [
        { name: "Java", level: "Avancé" },
        { name: "PHP", level: "Avancé" },
        { name: "JavaScript", level: "Avancé" },
        { name: "Python", level: "Intermédiaire" }
      ]
    },
    {
      title: "Bases de données",
      skills: [
        { name: "PostgreSQL", level: "Avancé" },
        { name: "MySQL", level: "Avancé" },
        { name: "Oracle", level: "Intermédiaire" }
      ]
    },
    {
      title: "Frameworks et Technologies",
      skills: [
        { name: "Laravel", level: "Avancé" },
        { name: "Spring Boot", level: "Avancé" },
        { name: "Vue.js", level: "Avancé" },
        { name: "Express.js", level: "Avancé" },
        { name: "React Native", level: "Intermédiaire" }
      ]
    },
    {
      title: "DevOps et Outils",
      skills: [
        { name: "Docker", level: "Intermédiaire" },
        { name: "Git", level: "Avancé" },
        { name: "Gantt", level: "Avancé" },
        { name: "Looping", level: "Avancé" }
      ]
    },
    {
      title: "Compétences techniques avancées",
      skills: [
        { name: "Architecture de systèmes distribués", level: "Avancé" },
        { name: "Conception de bases de données", level: "Expert" },
        { name: "Services REST", level: "Avancé" },
        { name: "Optimisation des performances", level: "Avancé" },
        { name: "Pipeline CI/CD", level: "Intermédiaire" },
        { name: "ETL", level: "Intermédiaire" }
      ]
    }
  ],
  languages: [
    { name: "Français", level: "Avancé (C1)" },
    { name: "Anglais", level: "Intermédiaire supérieur (B2)" },
    { name: "Malgache", level: "Natif" }
  ],
  softSkills: [
    "Capacité d'adaptation rapide",
    "Forte collaboration en équipe",
    "Gestion efficace du temps",
    "Présentation de projets",
    "Communication efficace",
    "Leadership et gestion d'équipe",
    "Analyse des besoins des clients"
  ],
  projects: [
    {
      title: "Framework Java personnalisé",
      description: "Création d'un framework Java sur mesure, inspiré de Spring, conçu pour optimiser la légèreté et l'efficacité des applications web. Développement de modules essentiels tels que l'authentification, la validation, le téléchargement de fichiers, ainsi que des services REST et la gestion des sessions, permettant aux développeurs de se concentrer uniquement sur des fonctionnalités nécessaires sans complexité superflue.",
      link: "",
      technologies: ["Java", "Framework", "REST", "Authentification"],
      period: "Jan 2025 - Jan 2025"
    },
    {
      title: "E-Kaly",
      description: "Conception complète de l'architecture de base de données pour la plateforme de livraison E-KALY, incluant un backend robuste avec un système d'assignation automatique des livreurs via géolocalisation. Mise en œuvre d'alertes automatiques optimisant le processus de commande, et création d'une interface intuitive pour la sélection de restaurants et visualisation des plats du jour.",
      link: "",
      technologies: ["Géolocalisation", "Spring Boot", "JavaScript", "HTML", "MySQL"],
      period: "Apr 2024 - Jun 2024"
    },
    {
      title: "HRMS - Système de Gestion des Ressources Humaines",
      description: "Conception et développement d'une plateforme web intégrée pour la gestion des ressources humaines, incluant un module complet pour la gestion des employés, le calcul automatisé des fiches de paie et un système de gestion des congés avec approbation et suivi en temps réel.",
      link: "",
      technologies: ["Gestion RH", "Full-stack", "Base de données relationnelle", "Workflow"],
      period: "Feb 2024 - Feb 2024"
    }
  ],
  experiences: [
    {
      title: "Consultant en Digitalisation et Formateur",
      company: "Communes de Mahitsy",
      location: "Mahitsy, Ambohidratrimo, Antananarivo",
      period: "Oct 2024 - Oct 2024",
      type: "Mission",
      description: "Formation de professionnels des administrations communales à l'utilisation d'outils de digitalisation des registres d'état civil. J'ai proposé des recommandations pour la mise en place d'un système automatisé de génération de registres (naissances, décès, etc.), contribuant ainsi à la modernisation des processus administratifs grâce à des solutions innovantes pour l'automatisation des copies de registres.",
      technologies: ["Formation", "Conseil en digitalisation", "Administration publique", "Transformation numérique", "Processus administratifs", "Gestion de données"]
    }
  ],
  formations: [
    {
      id: "1",
      institution: "IT University",
      degree: "Développeur Java",
      fieldOfStudy: "Développement informatique - Architecture des bases de données et développement full-stack Java",
      period: "Aug 2022 - Jun 2025",
      description: "À IT University, je me suis vraiment plongé dans le développement informatique, avec une affection particulière pour l'architecture des bases de données et le développement full-stack Java. J'ai eu l'occasion de maîtriser des langages comme PHP, Python et JavaScript, et de me familiariser avec des frameworks comme Laravel et Spring Boot. J'ai aussi développé une bonne poigne avec les bases de données PostgreSQL et MySQL, et j'ai touché à des sujets plus avancés comme la conteneurisation avec Docker, les pipelines CI/CD, le Gantt Looping et l'ETF."
    }
  ]
};