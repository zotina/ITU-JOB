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

// Données d'entreprises pour la carte
export const mockCompanies = [
  {
    id: '1',
    name: 'TechStart Solutions',
    location: 'Paris, France',
    coordinates: [2.3522, 48.8566] as [number, number],
    offers: 3
  },
  {
    id: '2',
    name: 'InnovateCorp',
    location: 'Lyon, France',
    coordinates: [4.8357, 45.7640] as [number, number],
    offers: 2
  },
  {
    id: '3',
    name: 'DataIntel Labs',
    location: 'Marseille, France',
    coordinates: [5.3698, 43.2965] as [number, number],
    offers: 1
  },
  {
    id: '4',
    name: 'MobileFirst Agency',
    location: 'Bordeaux, France',
    coordinates: [-0.5792, 44.8378] as [number, number],
    offers: 2
  },
  {
    id: '5',
    name: 'DevCorp Solutions',
    location: 'Toulouse, France',
    coordinates: [1.4442, 43.6047] as [number, number],
    offers: 1
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