import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ0Ikd6MqVw5hL4TgzZ3bEZahHKfhkaaw",
  authDomain: "sample-firebase-ai-app-9f955.firebaseapp.com",
  projectId: "sample-firebase-ai-app-9f955",
  storageBucket: "sample-firebase-ai-app-9f955.firebasestorage.app",
  messagingSenderId: "229864401136",
  appId: "1:229864401136:web:5d05e0a280a4bf7a76fa35"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ============================================
// STRUCTURE SIMPLIFIÉE : TOUT DANS USERS
// ============================================

// RECRUTEURS : Contiennent toutes les infos de l'entreprise
const mockRecruiters = [
  {
    email: 'recruiter@orange.mg',
    password: 'SecurePassword123!',
    prenom: 'Jean',
    nom: 'Rakoto',
    role: 'recruiter',
    
    // Informations de l'entreprise (intégrées)
    company: {
      name: 'Orange Madagascar',
      description: 'Orange Madagascar est un opérateur de télécommunication de premier plan à Madagascar, spécialisé dans les services mobiles et internet à très haut débit. Nous proposons des solutions digitales innovantes pour les particuliers et les entreprises.',
      logo: '/src/assets/company-logos/orange.png',
      address: {
        street: 'Immeuble Fitaratra, Ankorondrano',
        city: 'Antananarivo',
        country: 'Madagascar'
      },
      website: 'https://www.orange.mg',
      email: 'contact@orange.mg',
      phone: '+261 20 22 222 22',
      coordinates: [47.5229909, -18.8842199],
      industry: 'Télécommunications',
      size: '500-1000 employés',
      verified: true,
      featured: true
    },
    
    // Informations du recruteur
    recruiterInfo: {
      position: 'Responsable Ressources Humaines',
      phone: '+261 34 123 4567',
      bio: 'Responsable du recrutement et de la gestion des talents chez Orange Madagascar.'
    },
    
    // Statistiques
    stats: {
      totalOffers: 0,
      activeOffers: 0,
      totalApplications: 0
    }
  },
  {
    email: 'recruiter@yas.mg',
    password: 'SecurePassword123!',
    prenom: 'Marie',
    nom: 'Andrianjaka',
    role: 'recruiter',
    
    company: {
      name: 'Yas Madagascar',
      description: 'Yas Madagascar est l\'un des principaux opérateurs de téléphonie mobile à Madagascar. Nous nous engageons à fournir des services de télécommunication de qualité et des solutions numériques adaptées aux besoins de nos clients.',
      logo: '/src/assets/company-logos/yas.png',
      address: {
        street: 'Ankorondrano',
        city: 'Antananarivo',
        country: 'Madagascar'
      },
      website: 'https://www.yas.mg',
      email: 'info@telma.mg',
      phone: '+261 20 22 333 33',
      coordinates: [47.52566623322738, -18.909228523929638],
      industry: 'Télécommunications',
      size: '200-500 employés',
      verified: true,
      featured: false
    },
    
    recruiterInfo: {
      position: 'Chargée de recrutement',
      phone: '+261 34 234 5678',
      bio: 'Passionnée par le développement des talents dans le secteur des télécommunications.'
    },
    
    stats: {
      totalOffers: 0,
      activeOffers: 0,
      totalApplications: 0
    }
  },
  {
    email: 'recruiter@airtel.mg',
    password: 'SecurePassword123!',
    prenom: 'Paul',
    nom: 'Ramaroson',
    role: 'recruiter',
    
    company: {
      name: 'Airtel Madagascar',
      description: 'Airtel Madagascar est une entreprise de télécommunications qui propose des services de téléphonie mobile, d\'internet et de services financiers numériques. Nous investissons constamment dans l\'innovation technologique.',
      logo: '/src/assets/company-logos/airtel.png',
      address: {
        street: 'Immeuble ARO, Ankorondrano',
        city: 'Antananarivo',
        country: 'Madagascar'
      },
      website: 'https://www.airtel.mg',
      email: 'hello@airtel.mg',
      phone: '+261 20 22 444 44',
      coordinates: [47.519278, -18.8753376],
      industry: 'Télécommunications',
      size: '300-600 employés',
      verified: true,
      featured: false
    },
    
    recruiterInfo: {
      position: 'HR Manager',
      phone: '+261 34 345 6789',
      bio: 'Expert en gestion des ressources humaines avec 10 ans d\'expérience.'
    },
    
    stats: {
      totalOffers: 0,
      activeOffers: 0,
      totalApplications: 0
    }
  },
  {
    email: 'recruiter@systasia.mg',
    password: 'SecurePassword123!',
    prenom: 'Sophie',
    nom: 'Razafindrakoto',
    role: 'recruiter',
    
    company: {
      name: 'SystAsia Madagascar',
      description: 'SystAsia Madagascar est une entreprise spécialisée dans le développement de logiciels et solutions informatiques. Nous accompagnons les entreprises dans leur transformation digitale avec des solutions sur mesure.',
      logo: '/src/assets/company-logos/systasia.png',
      address: {
        street: 'Immeuble Galaxy, Andraharo',
        city: 'Antananarivo',
        country: 'Madagascar'
      },
      website: 'https://www.systasia.mg',
      email: 'contact@systasia.mg',
      phone: '+261 20 22 555 55',
      coordinates: [47.5061, -18.9121],
      industry: 'Technologie / IT',
      size: '100-250 employés',
      verified: true,
      featured: true
    },
    
    recruiterInfo: {
      position: 'Directrice des Ressources Humaines',
      phone: '+261 34 456 7890',
      bio: 'Spécialisée dans le recrutement de profils techniques et IT.'
    },
    
    stats: {
      totalOffers: 0,
      activeOffers: 0,
      totalApplications: 0
    }
  },
  {
    email: 'recruiter@microlink.mg',
    password: 'SecurePassword123!',
    prenom: 'David',
    nom: 'Rakotomalala',
    role: 'recruiter',
    
    company: {
      name: 'Microlink Madagascar',
      description: 'Microlink Madagascar propose des services de développement logiciel, d\'hébergement web et de solutions informatiques aux entreprises et particuliers. Nous mettons l\'accent sur la qualité et la proximité.',
      logo: '/src/assets/company-logos/microlink.png',
      address: {
        street: 'Immeuble TANA 2000, Analakely',
        city: 'Antananarivo',
        country: 'Madagascar'
      },
      website: 'https://www.microlink.mg',
      email: 'info@microlink.mg',
      phone: '+261 20 22 666 66',
      coordinates: [47.5061, -18.9121],
      industry: 'Technologie / IT',
      size: '50-100 employés',
      verified: false,
      featured: false
    },
    
    recruiterInfo: {
      position: 'Responsable recrutement',
      phone: '+261 34 567 8901',
      bio: 'À la recherche de jeunes talents pour rejoindre notre équipe dynamique.'
    },
    
    stats: {
      totalOffers: 0,
      activeOffers: 0,
      totalApplications: 0
    }
  }
];

// ÉTUDIANTS : Structure détaillée
const mockStudents = [
  {
    email: 'fanantenana@itu.ac.mg',
    password: 'SecurePassword123!',
    prenom: 'Fanantenana',
    nom: 'Rakotoarisoa',
    role: 'student',
    
    personalInfo: {
      title: 'Data Scientist',
      description: 'Passionné par l\'intelligence artificielle et l\'analyse de données. Je cherche à mettre mes compétences au service d\'une entreprise innovante.',
      phone: '+261 34 123 4567',
      location: 'Antananarivo, Madagascar',
      coordinates: [-18.9137, 47.5361],
      linkedin: 'https://linkedin.com/in/fanantenana-rakotoarisoa',
      github: 'https://github.com/fanantenana',
      website: 'https://fanantenana.portfolio.com',
      availability: 'Disponible à partir de février 2024',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Langages de programmation',
        skills: [
          { name: 'Python', level: 'Avancé', years: 3 },
          { name: 'R', level: 'Intermédiaire', years: 2 },
          { name: 'SQL', level: 'Avancé', years: 3 },
          { name: 'JavaScript', level: 'Intermédiaire', years: 1 }
        ]
      },
      {
        category: 'Machine Learning & IA',
        skills: [
          { name: 'TensorFlow', level: 'Intermédiaire', years: 2 },
          { name: 'Scikit-learn', level: 'Avancé', years: 3 },
          { name: 'PyTorch', level: 'Débutant', years: 1 },
          { name: 'Keras', level: 'Intermédiaire', years: 2 }
        ]
      },
      {
        category: 'Data Science',
        skills: [
          { name: 'Pandas', level: 'Avancé', years: 3 },
          { name: 'NumPy', level: 'Avancé', years: 3 },
          { name: 'Matplotlib', level: 'Avancé', years: 2 },
          { name: 'Jupyter', level: 'Avancé', years: 3 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Intermédiaire', certification: 'TOEIC 750' },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Analyse et résolution de problèmes',
      'Travail en équipe',
      'Communication efficace',
      'Pensée critique',
      'Gestion de projet',
      'Adaptabilité'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'Data Scientist',
        company: 'TechCorp Madagascar',
        location: 'Antananarivo, Madagascar',
        period: '2021 - Présent',
        type: 'CDI',
        description: 'Analyse de données clients, développement de modèles prédictifs pour optimiser les ventes, et création de tableaux de bord interactifs pour la direction.',
        technologies: ['Python', 'TensorFlow', 'Pandas', 'Power BI'],
        achievements: [
          'Augmentation de 25% de la précision des prévisions de ventes',
          'Automatisation de 80% des rapports mensuels',
          'Formation de 5 collègues aux techniques de ML'
        ]
      },
      {
        id: 'exp-2',
        title: 'Stagiaire Data Analyst',
        company: 'DataMad',
        location: 'Antananarivo, Madagascar',
        period: '2020 - 2021',
        type: 'Stage',
        description: 'Analyse exploratoire de données, nettoyage de bases de données, et création de visualisations.',
        technologies: ['Python', 'SQL', 'Excel', 'Tableau'],
        achievements: [
          'Nettoyage d\'une base de 500,000+ enregistrements',
          'Création de 10+ dashboards interactifs'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'Université d\'Antananarivo',
        degree: 'Master en Data Science',
        fieldOfStudy: 'Intelligence Artificielle et Big Data',
        period: '2018 - 2021',
        description: 'Formation approfondie en machine learning, deep learning, et traitement de données massives.',
        grade: 'Mention Très Bien',
        achievements: [
          'Major de promotion',
          'Projet de fin d\'études publié dans une conférence internationale'
        ]
      },
      {
        id: 'form-2',
        institution: 'Université d\'Antananarivo',
        degree: 'Licence en Mathématiques Appliquées',
        fieldOfStudy: 'Statistiques et Probabilités',
        period: '2015 - 2018',
        description: 'Fondamentaux mathématiques pour la data science.',
        grade: 'Mention Bien',
        achievements: []
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Système de recommandation e-commerce',
        description: 'Développement d\'un système de recommandation de produits basé sur le collaborative filtering et le deep learning.',
        link: 'https://github.com/fanantenana/recommendation-system',
        technologies: ['Python', 'TensorFlow', 'Flask', 'MongoDB'],
        image: null,
        achievements: [
          'Précision de 87% sur le dataset de test',
          '1000+ stars sur GitHub'
        ]
      },
      {
        id: 'proj-2',
        title: 'Prédiction de prix immobiliers Madagascar',
        description: 'Modèle de ML pour prédire les prix des biens immobiliers à Antananarivo.',
        link: 'https://github.com/fanantenana/real-estate-prediction',
        technologies: ['Python', 'Scikit-learn', 'Pandas', 'Streamlit'],
        image: null,
        achievements: [
          'R² score de 0.92',
          'Application web déployée avec Streamlit'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'TensorFlow Developer Certificate',
        issuer: 'Google',
        date: '2023',
        link: 'https://www.credential.net/...'
      },
      {
        name: 'Machine Learning Specialization',
        issuer: 'Stanford University (Coursera)',
        date: '2022',
        link: 'https://www.coursera.org/...'
      }
    ],
    
    stats: {
      totalApplications: 0,
      pendingApplications: 0,
      acceptedApplications: 0,
      profileViews: 0
    }
  },
  {
    email: 'raviro@itu.ac.mg',
    password: 'SecurePassword123!',
    prenom: 'Raviro',
    nom: 'Andriamalala',
    role: 'student',
    
    personalInfo: {
      title: 'Développeur Full Stack',
      description: 'Développeur passionné par les technologies web modernes. J\'aime créer des applications performantes et élégantes.',
      phone: '+261 34 987 6543',
      location: 'Antananarivo, Madagascar',
      coordinates: [-18.9137, 47.5361],
      linkedin: 'https://linkedin.com/in/raviro-andriamalala',
      github: 'https://github.com/raviro',
      website: 'https://raviro.dev',
      availability: 'Immédiate',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Frontend',
        skills: [
          { name: 'React', level: 'Avancé', years: 4 },
          { name: 'TypeScript', level: 'Avancé', years: 3 },
          { name: 'Next.js', level: 'Intermédiaire', years: 2 },
          { name: 'Tailwind CSS', level: 'Avancé', years: 2 }
        ]
      },
      {
        category: 'Backend',
        skills: [
          { name: 'Node.js', level: 'Avancé', years: 4 },
          { name: 'Express', level: 'Avancé', years: 4 },
          { name: 'NestJS', level: 'Intermédiaire', years: 1 },
          { name: 'Python', level: 'Intermédiaire', years: 2 }
        ]
      },
      {
        category: 'Bases de données',
        skills: [
          { name: 'MongoDB', level: 'Avancé', years: 3 },
          { name: 'PostgreSQL', level: 'Intermédiaire', years: 2 },
          { name: 'Redis', level: 'Intermédiaire', years: 1 }
        ]
      },
      {
        category: 'DevOps',
        skills: [
          { name: 'Docker', level: 'Intermédiaire', years: 2 },
          { name: 'Git', level: 'Avancé', years: 4 },
          { name: 'CI/CD', level: 'Intermédiaire', years: 1 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Courant', certification: 'TOEFL 95' },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Créativité et innovation',
      'Autonomie',
      'Adaptabilité',
      'Leadership',
      'Gestion du temps',
      'Esprit d\'équipe'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'Développeur Full Stack',
        company: 'DigitMad',
        location: 'Antananarivo, Madagascar',
        period: '2020 - Présent',
        type: 'CDI',
        description: 'Développement d\'applications web et mobiles pour des clients locaux et internationaux.',
        technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
        achievements: [
          'Livré 15+ projets clients avec succès',
          'Réduction de 40% du temps de chargement des applications',
          'Mentorat de 3 développeurs juniors'
        ]
      },
      {
        id: 'exp-2',
        title: 'Développeur Frontend',
        company: 'WebStudio',
        location: 'Antananarivo, Madagascar',
        period: '2019 - 2020',
        type: 'Freelance',
        description: 'Développement de sites web responsifs et applications React.',
        technologies: ['React', 'JavaScript', 'CSS', 'HTML'],
        achievements: [
          '10+ sites web développés',
          'Satisfaction client de 100%'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'ESIM - SUPETRI Madagascar',
        degree: 'Licence en Informatique',
        fieldOfStudy: 'Génie Logiciel',
        period: '2016 - 2020',
        description: 'Formation complète en développement logiciel et ingénierie informatique.',
        grade: 'Mention Bien',
        achievements: [
          'Prix du meilleur projet de fin d\'études'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Plateforme e-commerce Madagascar',
        description: 'Marketplace complète avec paiement en ligne, gestion de stock, et tableau de bord vendeur.',
        link: 'https://github.com/raviro/ecommerce-platform',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
        image: null,
        achievements: [
          '500+ utilisateurs actifs',
          '100+ produits vendus'
        ]
      },
      {
        id: 'proj-2',
        title: 'Application de gestion de tâches',
        description: 'To-do list collaborative avec fonctionnalités temps réel.',
        link: 'https://github.com/raviro/task-manager',
        technologies: ['React', 'Firebase', 'Material-UI'],
        image: null,
        achievements: [
          '2000+ téléchargements'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'React Developer Certification',
        issuer: 'Meta',
        date: '2023',
        link: 'https://www.coursera.org/...'
      }
    ],
    
    stats: {
      totalApplications: 0,
      pendingApplications: 0,
      acceptedApplications: 0,
      profileViews: 0
    }
  },
  {
    email: 'hasina@itu.ac.mg',
    password: 'SecurePassword123!',
    prenom: 'Hasina',
    nom: 'Razafindramary',
    role: 'student',
    
    personalInfo: {
      title: 'Développeur Mobile',
      description: 'Spécialisé en développement mobile cross-platform. Passionné par la création d\'expériences utilisateur fluides et intuitives.',
      phone: '+261 32 123 4567',
      location: 'Antananarivo, Madagascar',
      coordinates: [-18.9137, 47.5361],
      linkedin: 'https://linkedin.com/in/hasina-razafindramary',
      github: 'https://github.com/hasina',
      website: 'https://hasina.mobile.dev',
      availability: 'Immédiat',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Mobile Development',
        skills: [
          { name: 'React Native', level: 'Avancé', years: 3 },
          { name: 'Flutter', level: 'Avancé', years: 2 },
          { name: 'Swift', level: 'Débutant', years: 1 },
          { name: 'Kotlin', level: 'Débutant', years: 1 }
        ]
      },
      {
        category: 'Frontend',
        skills: [
          { name: 'JavaScript', level: 'Avancé', years: 3 },
          { name: 'TypeScript', level: 'Intermédiaire', years: 2 },
          { name: 'Redux', level: 'Intermédiaire', years: 2 }
        ]
      },
      {
        category: 'Backend & Services',
        skills: [
          { name: 'Firebase', level: 'Avancé', years: 3 },
          { name: 'REST APIs', level: 'Avancé', years: 3 },
          { name: 'GraphQL', level: 'Débutant', years: 1 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Intermédiaire', certification: null },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Innovation',
      'Rigueur et attention aux détails',
      'Communication',
      'Gestion du temps',
      'Résolution de problèmes',
      'Esprit d\'initiative'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'Développeur Mobile',
        company: 'AppMad',
        location: 'Antananarivo, Madagascar',
        period: '2022 - Présent',
        type: 'CDI',
        description: 'Développement d\'applications mobiles natives et hybrides pour iOS et Android.',
        technologies: ['React Native', 'Flutter', 'Firebase', 'Redux'],
        achievements: [
          '8 applications publiées sur les stores',
          'Note moyenne de 4.5/5 sur Google Play',
          'Plus de 50,000 téléchargements cumulés'
        ]
      },
      {
        id: 'exp-2',
        title: 'Stagiaire Mobile Developer',
        company: 'MobileTech',
        location: 'Antananarivo, Madagascar',
        period: '2021 - 2022',
        type: 'Stage',
        description: 'Développement de features pour une application de e-commerce mobile.',
        technologies: ['React Native', 'JavaScript', 'Firebase'],
        achievements: [
          'Implémentation du système de paiement',
          'Optimisation des performances de 30%'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'Université de Toamasina',
        degree: 'Licence en Informatique',
        fieldOfStudy: 'Systèmes et Réseaux',
        period: '2019 - 2022',
        description: 'Formation en informatique avec spécialisation en développement mobile.',
        grade: 'Mention Bien',
        achievements: []
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Application de livraison de nourriture',
        description: 'Application mobile de livraison à la demande avec tracking en temps réel.',
        link: 'https://github.com/hasina/delivery-app',
        technologies: ['React Native', 'Firebase', 'Google Maps', 'Stripe'],
        image: null,
        achievements: [
          '1000+ téléchargements en 3 mois',
          'Intégration avec 20+ restaurants'
        ]
      },
      {
        id: 'proj-2',
        title: 'App de suivi fitness',
        description: 'Application de suivi d\'activités sportives avec statistiques détaillées.',
        link: 'https://github.com/hasina/fitness-tracker',
        technologies: ['Flutter', 'Dart', 'SQLite'],
        image: null,
        achievements: [
          'Featured sur Product Hunt',
          '500+ utilisateurs actifs'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'React Native Certification',
        issuer: 'Udemy',
        date: '2022',
        link: 'https://www.udemy.com/...'
      }
    ],
    
    stats: {
      totalApplications: 0,
      pendingApplications: 0,
      acceptedApplications: 0,
      profileViews: 0
    }
  }
];

// ============================================
// OFFERS avec nom de l'entreprise (dénormalisé)
// ============================================
const mockOffers = [
  {
    id: 'offer-1',
    title: 'Développeur Full Stack Senior',
    companyName: 'Orange Madagascar',  // Dénormalisé depuis users.company.name
    recruiterId: null,  // Sera rempli après création du recruteur
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5229909, -18.8842199],
    salary: '2,000,000 - 3,000,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Rejoignez notre équipe technique pour développer des solutions digitales innovantes qui transforment la vie de millions de Malgaches. Nous recherchons un développeur full stack passionné pour participer à nos projets d'envergure.

## Responsabilités

- Développer et maintenir nos applications web et mobiles
- Participer à la conception d'architectures techniques
- Collaborer avec les équipes produit et design
- Assurer la qualité du code via code reviews
- Mentorat des développeurs juniors

## Environnement de travail

- Équipe dynamique et collaborative
- Technologies modernes
- Formation continue
- Horaires flexibles
- Télétravail partiel possible`,
    requirements: [
      'Minimum 3 ans d\'expérience en développement web',
      'Maîtrise de React et Node.js',
      'Expérience avec les bases de données NoSQL',
      'Connaissance des API REST',
      'Expérience avec Git et CI/CD',
      'Bon niveau en anglais technique'
    ],
    niceToHave: [
      'Expérience avec TypeScript',
      'Connaissance de Docker',
      'Expérience en architecture microservices'
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Docker', 'AWS'],
    benefits: [
      'Assurance santé',
      'Formation continue',
      'Équipement moderne',
      'Team building réguliers',
      'Primes de performance'
    ],
    postedDate: new Date('2024-01-15').toISOString(),
    deadline: new Date('2024-02-15').toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'offer-2',
    title: 'Data Scientist',
    companyName: 'Yas Madagascar',
    recruiterId: null,
    location: 'Antananarivo, Madagascar',
    coordinates: [47.52566623322738, -18.909228523929638],
    salary: '2,500,000 - 3,500,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Analyse de données et développement de modèles prédictifs pour améliorer nos services clients. Opportunité unique de travailler sur des projets d'intelligence artificielle à fort impact.

## Responsabilités

- Analyser les données clients et identifier les tendances
- Développer des modèles de machine learning
- Créer des tableaux de bord et visualisations
- Collaborer avec les équipes métier
- Présenter les résultats aux parties prenantes

## Ce que nous offrons

- Projets challengeants et variés
- Accès aux dernières technologies IA
- Équipe data expérimentée
- Environnement stimulant`,
    requirements: [
      'Diplôme en informatique, statistiques ou domaine connexe',
      'Excellente maîtrise de Python',
      'Expérience avec les librairies ML (Scikit-learn, TensorFlow)',
      'Compétences en SQL',
      'Capacité à communiquer des insights complexes'
    ],
    niceToHave: [
      'Expérience avec le Big Data',
      'Connaissance de Spark',
      'Publications ou contributions open source'
    ],
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'SQL', 'Power BI'],
    benefits: [
      'Assurance santé complète',
      'Formations certifiantes',
      'Conférences internationales',
      'Équipement haute performance'
    ],
    postedDate: new Date('2024-01-12').toISOString(),
    deadline: new Date('2024-02-12').toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'offer-3',
    title: 'Développeur Mobile React Native',
    companyName: 'Airtel Madagascar',
    recruiterId: null,
    location: 'Antananarivo, Madagascar',
    coordinates: [47.519278, -18.8753376],
    salary: '1,800,000 - 2,800,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Développement d'applications mobiles pour nos services financiers et de téléphonie mobile. Rejoignez une équipe qui impacte la vie quotidienne de millions d'utilisateurs.

## Responsabilités

- Développer des applications mobiles performantes
- Maintenir et améliorer les apps existantes
- Collaborer avec les designers UX/UI
- Optimiser les performances
- Assurer la qualité du code

## Notre stack technique

- React Native pour le développement cross-platform
- Firebase pour le backend
- Redux pour la gestion d'état
- REST APIs`,
    requirements: [
      'Expérience significative en développement mobile',
      'Maîtrise de React Native',
      'Connaissance de JavaScript/TypeScript',
      'Expérience avec les stores mobiles (Google Play, App Store)',
      'Portfolio d\'applications publiées'
    ],
    niceToHave: [
      'Expérience avec Flutter',
      'Connaissance des développements natifs (Swift/Kotlin)',
      'Expérience avec les notifications push'
    ],
    technologies: ['React Native', 'JavaScript', 'Firebase', 'Redux', 'REST APIs', 'TypeScript'],
    benefits: [
      'Package attractif',
      'Matériel de développement fourni',
      'Formation continue',
      'Horaires flexibles'
    ],
    postedDate: new Date('2024-01-10').toISOString(),
    deadline: new Date('2024-02-10').toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'offer-4',
    title: 'Ingénieur DevOps',
    companyName: 'SystAsia Madagascar',
    recruiterId: null,
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: '2,500,000 - 3,800,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Responsable de l'infrastructure cloud et de l'automatisation des déploiements. Vous jouerez un rôle clé dans notre transformation digitale.

## Responsabilités

- Gérer et optimiser l'infrastructure cloud (AWS)
- Mettre en place des pipelines CI/CD
- Automatiser les déploiements
- Monitorer et améliorer les performances
- Assurer la sécurité des systèmes

## Technologies utilisées

- Docker & Kubernetes pour la conteneurisation
- Jenkins/GitLab CI pour l'automatisation
- Terraform pour l'infrastructure as code
- AWS comme cloud provider`,
    requirements: [
      'Expérience confirmée en DevOps',
      'Maîtrise de Docker et Kubernetes',
      'Connaissance des plateformes cloud (AWS, Azure ou GCP)',
      'Expérience avec les outils CI/CD',
      'Compétences en scripting (Bash, Python)'
    ],
    niceToHave: [
      'Certifications cloud',
      'Expérience avec Terraform',
      'Connaissance en sécurité',
      'Expérience avec monitoring (Prometheus, Grafana)'
    ],
    technologies: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Python', 'Linux'],
    benefits: [
      'Salaire compétitif',
      'Certifications prises en charge',
      'Équipement premium',
      'Télétravail possible'
    ],
    postedDate: new Date('2024-01-08').toISOString(),
    deadline: new Date('2024-02-08').toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'offer-5',
    title: 'Stage Développeur Web (6 mois)',
    companyName: 'Microlink Madagascar',
    recruiterId: null,
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: 'Gratification de stage',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage de 6 mois en développement web pour découvrir les technologies modernes et participer à des projets réels. Idéal pour les étudiants motivés souhaitant acquérir une expérience professionnelle.

## Ce que vous apprendrez

- Développement frontend avec React
- Développement backend avec Node.js
- Bases de données et APIs
- Méthodologies agiles
- Travail en équipe

## Encadrement

- Mentorat par des développeurs seniors
- Formations internes régulières
- Code reviews constructives
- Projets progressifs`,
    requirements: [
      'Étudiant en informatique (Licence ou Master)',
      'Bonnes bases en programmation',
      'Connaissance de JavaScript',
      'HTML/CSS',
      'Motivation et volonté d\'apprendre',
      'Disponible 6 mois'
    ],
    niceToHave: [
      'Projets personnels ou académiques',
      'Connaissance de React',
      'Compte GitHub actif'
    ],
    technologies: ['React', 'Node.js', 'JavaScript', 'CSS', 'HTML', 'Git'],
    benefits: [
      'Gratification mensuelle',
      'Formation continue',
      'Possibilité d\'embauche',
      'Environnement d\'apprentissage'
    ],
    postedDate: new Date('2024-01-18').toISOString(),
    deadline: new Date('2024-02-18').toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'offer-6',
    title: 'Stage Data Analyst (4 mois)',
    companyName: 'Orange Madagascar',
    recruiterId: null,
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5229909, -18.8842199],
    salary: 'Gratification de stage',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage de 4 mois en analyse de données pour apprendre à manipuler les données massives et créer des rapports analytiques.

## Missions principales

- Analyse exploratoire de données
- Création de visualisations
- Automatisation de rapports
- Support à l'équipe data

## Compétences développées

- Maîtrise de Python et Pandas
- SQL avancé
- Data visualization (Power BI)
- Méthodologie d\'analyse`,
    requirements: [
      'Étudiant en data science, statistiques ou informatique',
      'Compétences en statistiques',
      'Maîtrise de Python',
      'Connaissance de base en SQL',
      'Curiosité pour les données'
    ],
    niceToHave: [
      'Projets d\'analyse de données',
      'Kaggle competitions',
      'Connaissance de Power BI'
    ],
    technologies: ['Python', 'Pandas', 'SQL', 'Excel', 'Power BI', 'Jupyter'],
    benefits: [
      'Gratification attractive',
      'Données réelles',
      'Mentorat expert',
      'Possibilité de CDI'
    ],
    postedDate: new Date('2024-01-16').toISOString(),
    deadline: new Date('2024-02-16').toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'offer-7',
    title: 'Stage DevOps Junior (6 mois)',
    companyName: 'Yas Madagascar',
    recruiterId: null,
    location: 'Antananarivo, Madagascar',
    coordinates: [47.52566623322738, -18.909228523929638],
    salary: 'Gratification de stage',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage de 6 mois en DevOps pour apprendre les outils d'automatisation et les pratiques CI/CD dans un environnement professionnel.

## Ce que vous ferez

- Assistance sur les déploiements
- Configuration de containers Docker
- Monitoring d'infrastructure
- Scripts d'automatisation
- Documentation technique

## Formation incluse

- Docker & Kubernetes
- CI/CD avec Jenkins
- AWS basics
- Linux administration`,
    requirements: [
      'Connaissances en administration système',
      'Intérêt pour l\'automatisation',
      'Maîtrise Linux de base',
      'Bases en scripting (Bash ou Python)',
      'Rigueur et autonomie'
    ],
    niceToHave: [
      'Certifications Linux',
      'Lab personnel',
      'Contribution open source'
    ],
    technologies: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Linux', 'Terraform', 'Git'],
    benefits: [
      'Gratification',
      'Environnement cloud',
      'Certifications possibles',
      'Perspectives d\'emploi'
    ],
    postedDate: new Date('2024-01-20').toISOString(),
    deadline: new Date('2024-02-20').toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'offer-8',
    title: 'Stage Mobile App Developer (5 mois)',
    companyName: 'Airtel Madagascar',
    recruiterId: null,
    location: 'Antananarivo, Madagascar',
    coordinates: [47.519278, -18.8753376],
    salary: 'Gratification de stage',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage de 5 mois en développement mobile pour participer à la création d'applications mobiles à fort trafic utilisées par des milliers de personnes.

## Vos missions

- Développement de features
- Correction de bugs
- Tests et optimisation
- Participation aux code reviews
- Documentation

## Technologies enseignées

- React Native ou Flutter
- APIs REST
- Firebase
- Gestion d'état (Redux)
- Publication sur stores`,
    requirements: [
      'Bonne connaissance en développement mobile',
      'Portfolio d\'applications (même académiques)',
      'Passionné de technologie',
      'Connaissance JavaScript ou Dart',
      'Anglais technique'
    ],
    niceToHave: [
      'Application publiée sur store',
      'Connaissance UI/UX',
      'Expérience Git'
    ],
    technologies: ['React Native', 'Flutter', 'JavaScript', 'Dart', 'Firebase', 'REST APIs'],
    benefits: [
      'Gratification compétitive',
      'App millions d\'users',
      'Équipe expérimentée',
      'Embauche possible'
    ],
    postedDate: new Date('2024-01-22').toISOString(),
    deadline: new Date('2024-02-22').toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  }
];

// ============================================
// APPLICATIONS - Candidatures avec infos dénormalisées
// ============================================
const mockApplications = [
  {
    id: 'app-1',
    offerId: 'offer-2',
    offerTitle: 'Data Scientist',
    candidateId: null,  // Sera rempli après création de l'étudiant
    candidateName: 'Fanantenana Rakotoarisoa',
    candidateEmail: 'fanantenana@itu.ac.mg',
    companyName: 'Yas Madagascar',
    recruiterId: null,  // Sera rempli après création du recruteur
    status: 'accepted',
    matchingScore: 94,
    appliedDate: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
    coverLetter: `Madame, Monsieur,

Je me permets de vous adresser ma candidature pour le poste de Data Scientist au sein de Yas Madagascar.

Diplômé d'un Master en Data Science et fort de 3 ans d'expérience chez TechCorp Madagascar, j'ai développé une expertise solide en machine learning et en analyse de données. J'ai notamment contribué à l'amélioration de 25% de la précision des prévisions de ventes grâce au développement de modèles prédictifs innovants.

Passionné par l'intelligence artificielle et ses applications concrètes, je suis particulièrement attiré par l'opportunité de travailler sur des projets à fort impact dans le secteur des télécommunications.

Ma maîtrise de Python, TensorFlow et des techniques de ML, combinée à ma capacité à communiquer des insights complexes aux équipes métier, me permettrait de contribuer efficacement à vos projets d'analyse de données.

Je reste à votre disposition pour un entretien.

Cordialement,
Fanantenana Rakotoarisoa`,
    recruiterNotes: 'Excellent profil ! Expérience solide et compétences techniques parfaitement alignées.',
    interviewDate: new Date('2024-02-05T10:00:00').toISOString(),
    interviewType: 'video',
    interviewLink: 'https://meet.google.com/xxx-yyyy-zzz'
  },
  {
    id: 'app-2',
    offerId: 'offer-5',
    offerTitle: 'Stage Développeur Web (6 mois)',
    candidateId: null,
    candidateName: 'Raviro Andriamalala',
    candidateEmail: 'raviro@itu.ac.mg',
    companyName: 'Microlink Madagascar',
    recruiterId: null,
    status: 'pending',
    matchingScore: 60,
    appliedDate: new Date('2024-01-22').toISOString(),
    updatedAt: new Date('2024-01-22').toISOString(),
    coverLetter: `Bonjour,

Je postule pour le stage de développeur web de 6 mois au sein de Microlink Madagascar.

Actuellement développeur Full Stack chez DigitMad avec 4 ans d'expérience, je souhaite enrichir mes compétences en travaillant sur de nouveaux projets et technologies.

Ma maîtrise de React, Node.js et MongoDB, ainsi que mon expérience dans la livraison de 15+ projets clients avec succès, me permettront de contribuer efficacement dès le premier jour.

Je suis motivé par l'apprentissage continu et le partage de connaissances.

Cordialement,
Raviro Andriamalala`,
    recruiterNotes: 'Profil surqualifié pour un stage. À discuter avec lui de ses motivations.'
  },
  {
    id: 'app-3',
    offerId: 'offer-3',
    offerTitle: 'Développeur Mobile React Native',
    candidateId: null,
    candidateName: 'Hasina Razafindramary',
    candidateEmail: 'hasina@itu.ac.mg',
    companyName: 'Airtel Madagascar',
    recruiterId: null,
    status: 'pending',
    matchingScore: 85,
    appliedDate: new Date('2024-01-23').toISOString(),
    updatedAt: new Date('2024-01-23').toISOString(),
    coverLetter: `Madame, Monsieur,

Je vous adresse ma candidature pour le poste de Développeur Mobile React Native chez Airtel Madagascar.

Avec 2 ans d'expérience chez AppMad où j'ai développé 8 applications publiées avec plus de 50,000 téléchargements cumulés, je possède une solide expertise en développement mobile cross-platform.

Ma maîtrise de React Native, Flutter et Firebase, ainsi que mon attention particulière portée à l'expérience utilisateur, me permettront de contribuer au développement d'applications performantes et intuitives pour vos millions d'utilisateurs.

Je serais ravi de mettre mes compétences au service de vos projets ambitieux.

Cordialement,
Hasina Razafindramary`,
    recruiterNotes: null
  }
];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

// Supprimer tous les documents d'une collection
async function deleteCollection(collectionName) {
  console.log(`🗑️  Suppression de la collection: ${collectionName}`);
  
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      console.log(`   ℹ️  Collection ${collectionName} déjà vide`);
      return;
    }
    
    const batch = writeBatch(db);
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`   ✅ ${snapshot.size} documents supprimés de ${collectionName}`);
  } catch (error) {
    console.error(`   ❌ Erreur lors de la suppression de ${collectionName}:`, error.message);
  }
}

// Créer les utilisateurs recruteurs
async function createRecruiterUsers() {
  console.log('\n👔 Création des utilisateurs recruteurs...');
  
  const recruiterIds = {};
  
  for (const recruiterData of mockRecruiters) {
    try {
      // Créer le compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        recruiterData.email, 
        recruiterData.password
      );
      const userId = userCredential.user.uid;
      
      // Préparer les données pour Firestore (sans le password)
      const { password, ...firestoreData } = recruiterData;
      
      // Ajouter les timestamps
      const userData = {
        ...firestoreData,
        id: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Créer le document dans Firestore
      const batch = writeBatch(db);
      batch.set(doc(db, 'users', userId), userData);
      await batch.commit();
      
      // Stocker l'ID pour référence
      recruiterIds[recruiterData.company.name] = userId;
      
      console.log(`   ✅ ${recruiterData.prenom} ${recruiterData.nom} (${recruiterData.company.name})`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`   ⚠️  ${recruiterData.email} existe déjà`);
      } else {
        console.error(`   ❌ Erreur pour ${recruiterData.email}:`, error.message);
      }
    }
  }
  
  return recruiterIds;
}

// Créer les utilisateurs étudiants
async function createStudentUsers() {
  console.log('\n🎓 Création des utilisateurs étudiants...');
  
  const studentIds = {};
  
  for (const studentData of mockStudents) {
    try {
      // Créer le compte Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        studentData.email, 
        studentData.password
      );
      const userId = userCredential.user.uid;
      
      // Préparer les données pour Firestore (sans le password)
      const { password, ...firestoreData } = studentData;
      
      // Ajouter les timestamps
      const userData = {
        ...firestoreData,
        id: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Créer le document dans Firestore
      const batch = writeBatch(db);
      batch.set(doc(db, 'users', userId), userData);
      await batch.commit();
      
      // Stocker l'ID pour référence
      studentIds[studentData.email] = userId;
      
      console.log(`   ✅ ${studentData.prenom} ${studentData.nom}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`   ⚠️  ${studentData.email} existe déjà`);
      } else {
        console.error(`   ❌ Erreur pour ${studentData.email}:`, error.message);
      }
    }
  }
  
  return studentIds;
}

// Créer les offres d'emploi
async function createOffers(recruiterIds) {
  console.log('\n💼 Création des offres d\'emploi...');
  
  const batch = writeBatch(db);
  let count = 0;
  
  for (const offer of mockOffers) {
    try {
      // Trouver l'ID du recruteur correspondant
      const recruiterId = recruiterIds[offer.companyName];
      
      const offerData = {
        ...offer,
        recruiterId: recruiterId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const offerRef = doc(db, 'offers', offer.id);
      batch.set(offerRef, offerData);
      count++;
      
      console.log(`   ✅ ${offer.title} - ${offer.companyName}`);
    } catch (error) {
      console.error(`   ❌ Erreur pour ${offer.title}:`, error.message);
    }
  }
  
  await batch.commit();
  console.log(`   📊 ${count} offres créées`);
}

// Créer les candidatures
async function createApplications(studentIds, recruiterIds) {
  console.log('\n📝 Création des candidatures...');
  
  const batch = writeBatch(db);
  let count = 0;
  
  for (const application of mockApplications) {
    try {
      const candidateId = studentIds[application.candidateEmail];
      const recruiterId = recruiterIds[application.companyName];
      
      const appData = {
        ...application,
        candidateId: candidateId || null,
        recruiterId: recruiterId || null,
        createdAt: new Date().toISOString()
      };
      
      const appRef = doc(db, 'applications', application.id);
      batch.set(appRef, appData);
      count++;
      
      console.log(`   ✅ ${application.candidateName} → ${application.offerTitle}`);
    } catch (error) {
      console.error(`   ❌ Erreur pour candidature:`, error.message);
    }
  }
  
  await batch.commit();
  console.log(`   📊 ${count} candidatures créées`);
}

// ============================================
// FONCTION PRINCIPALE
// ============================================

async function initializeFirestore() {
  console.log('\n🚀 INITIALISATION DE LA BASE DE DONNÉES FIRESTORE\n');
  console.log('=' .repeat(60));
  
  try {
    // 1. Nettoyage
    console.log('\n📦 PHASE 1: Nettoyage des données existantes');
    await deleteCollection('users');
    await deleteCollection('offers');
    await deleteCollection('applications');
    await deleteCollection('notifications');
    await deleteCollection('ai_recommendations');
    
    // 2. Création des utilisateurs
    console.log('\n📦 PHASE 2: Création des utilisateurs');
    const recruiterIds = await createRecruiterUsers();
    const studentIds = await createStudentUsers();
    
    // 3. Création des offres
    console.log('\n📦 PHASE 3: Création des offres');
    await createOffers(recruiterIds);
    
    // 4. Création des candidatures
    console.log('\n📦 PHASE 4: Création des candidatures');
    await createApplications(studentIds, recruiterIds);
    
    // Résumé
    console.log('\n' + '='.repeat(60));
    console.log('✅ INITIALISATION TERMINÉE AVEC SUCCÈS !');
    console.log('='.repeat(60));
    console.log('\n📊 Résumé:');
    console.log(`   👔 Recruteurs: ${Object.keys(recruiterIds).length}`);
    console.log(`   🎓 Étudiants: ${Object.keys(studentIds).length}`);
    console.log(`   💼 Offres: ${mockOffers.length}`);
    console.log(`   📝 Candidatures: ${mockApplications.length}`);
    console.log('\n💡 Comptes de test:');
    console.log('   Recruteur: recruiter@orange.mg / SecurePassword123!');
    console.log('   Étudiant: fanantenana@itu.ac.mg / SecurePassword123!');
    console.log('\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécution
initializeFirestore();