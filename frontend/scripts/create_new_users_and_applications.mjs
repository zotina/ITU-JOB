import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs, query, where, addDoc } from 'firebase/firestore';
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

// List of 10 new students with varied profiles
const newStudents = [
  {
    email: 'aina.rabe@gmail.com',
    password: 'SecurePassword123!',
    prenom: 'Aina',
    nom: 'Rabe',
    role: 'student',
    
    personalInfo: {
      title: 'Développeur Frontend',
      description: 'Passionné par le développement web et les interfaces utilisateur modernes. Je suis constamment à la recherche de nouvelles technologies pour améliorer mon expertise.',
      phone: '+261 33 123 4567',
      location: 'Antananarivo, Madagascar',
      coordinates: [-18.9137, 47.5361],
      linkedin: 'https://linkedin.com/in/aina-rabe',
      github: 'https://github.com/ainarabe',
      website: 'https://aina.dev',
      availability: 'Disponible immédiatement',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Frontend',
        skills: [
          { name: 'React', level: 'Avancé', years: 3 },
          { name: 'Vue.js', level: 'Intermédiaire', years: 2 },
          { name: 'JavaScript', level: 'Avancé', years: 4 },
          { name: 'CSS', level: 'Avancé', years: 3 }
        ]
      },
      {
        category: 'Backend',
        skills: [
          { name: 'Node.js', level: 'Intermédiaire', years: 2 },
          { name: 'Express', level: 'Intermédiaire', years: 2 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Intermédiaire', certification: 'TOEIC 700' },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Travail en équipe',
      'Communication',
      'Résolution de problèmes',
      'Gestion de projet'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'Développeur Frontend',
        company: 'TechStart Madagascar',
        location: 'Antananarivo, Madagascar',
        period: '2022 - Présent',
        type: 'CDI',
        description: 'Développement d\'applications web modernes avec React et technologies associées.',
        technologies: ['React', 'JavaScript', 'CSS', 'HTML'],
        achievements: [
          'Développement de 5+ applications utilisées par des milliers d\'utilisateurs',
          'Optimisation des performances de 30%'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'Université d\'Antananarivo',
        degree: 'Licence en Informatique',
        fieldOfStudy: 'Développement Web',
        period: '2019 - 2022',
        description: 'Formation en développement logiciel et technologies web.',
        grade: 'Mention Bien',
        achievements: []
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Application de gestion de projet',
        description: 'SPA pour la gestion collaborative de projets avec suivi en temps réel.',
        link: 'https://github.com/ainarabe/project-app',
        technologies: ['React', 'Firebase', 'Tailwind CSS'],
        image: null,
        achievements: [
          '1500+ utilisateurs actifs',
          'Intégration continue automatisée'
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
    email: 'marie.razafima@gmail.com',
    password: 'SecurePassword123!',
    prenom: 'Marie',
    nom: 'Razafima',
    role: 'student',
    
    personalInfo: {
      title: 'Data Analyst',
      description: 'Spécialisée dans l\'analyse de données et la visualisation. Je combine compétences techniques et compréhension métier pour transformer les données en insights actionnables.',
      phone: '+261 32 234 5678',
      location: 'Fianarantsoa, Madagascar',
      coordinates: [-19.5579, 47.0822],
      linkedin: 'https://linkedin.com/in/marie-razafima',
      github: 'https://github.com/marieraz',
      website: 'https://marie-data.com',
      availability: 'Disponible à partir de janvier 2024',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Data Science',
        skills: [
          { name: 'Python', level: 'Avancé', years: 3 },
          { name: 'Pandas', level: 'Avancé', years: 3 },
          { name: 'SQL', level: 'Avancé', years: 2 },
          { name: 'R', level: 'Intermédiaire', years: 1 }
        ]
      },
      {
        category: 'Visualization',
        skills: [
          { name: 'Power BI', level: 'Intermédiaire', years: 2 },
          { name: 'Tableau', level: 'Débutant', years: 1 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Courant', certification: 'TOEFL 95' },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Analyse critique',
      'Communication',
      'Rigueur',
      'Adaptabilité'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'Data Analyst',
        company: 'DataMad Solutions',
        location: 'Antananarivo, Madagascar',
        period: '2021 - Présent',
        type: 'CDI',
        description: 'Analyse de données clients et création de tableaux de bord pour la prise de décision.',
        technologies: ['Python', 'SQL', 'Power BI', 'Excel'],
        achievements: [
          'Création de 10+ tableaux de bord interactifs',
          'Réduction de 25% du temps d\'analyse'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'Université de Fianarantsoa',
        degree: 'Master en Statistiques',
        fieldOfStudy: 'Analyse de données',
        period: '2018 - 2021',
        description: 'Formation en statistiques et analyse de données.',
        grade: 'Mention Très Bien',
        achievements: [
          'Major de promotion',
          'Meilleur mémoire de fin d\'étude'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Analyse prédictive du marché immobilier',
        description: 'Modèle ML pour prédire les tendances du marché immobilier à Madagascar.',
        link: 'https://github.com/marieraz/real-estate-analysis',
        technologies: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib'],
        image: null,
        achievements: [
          'Modèle avec 88% de précision',
          'Présenté à une conférence nationale'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'Microsoft Power BI Data Analyst',
        issuer: 'Microsoft',
        date: '2023',
        link: 'https://www.credential.net/...'
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
    email: 'faneva.randria@gmail.com',
    password: 'SecurePassword123!',
    prenom: 'Faneva',
    nom: 'Randria',
    role: 'student',
    
    personalInfo: {
      title: 'Développeur Mobile',
      description: 'Expert en développement d\'applications mobiles natives et multiplateformes. Toujours à l\'affût des dernières tendances en matière de développement mobile.',
      phone: '+261 33 345 6789',
      location: 'Toamasina, Madagascar',
      coordinates: [-18.1125, 49.3778],
      linkedin: 'https://linkedin.com/in/faneva-randria',
      github: 'https://github.com/fanevarand',
      website: 'https://faneva.dev',
      availability: 'Disponible immédiatement',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Mobile Development',
        skills: [
          { name: 'Flutter', level: 'Avancé', years: 2 },
          { name: 'React Native', level: 'Avancé', years: 2 },
          { name: 'Dart', level: 'Avancé', years: 2 },
          { name: 'Kotlin', level: 'Intermédiaire', years: 1 }
        ]
      },
      {
        category: 'Backend',
        skills: [
          { name: 'Firebase', level: 'Avancé', years: 2 },
          { name: 'Node.js', level: 'Intermédiaire', years: 1 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Intermédiaire', certification: null },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Créativité',
      'Travail en équipe',
      'Adaptabilité',
      'Gestion de projet'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'Développeur Mobile',
        company: 'AppMad Studio',
        location: 'Antananarivo, Madagascar',
        period: '2022 - Présent',
        type: 'CDI',
        description: 'Développement d\'applications mobiles pour des clients locaux et internationaux.',
        technologies: ['Flutter', 'Dart', 'Firebase', 'React Native'],
        achievements: [
          'Publication de 6 applications sur les stores',
          '100k+ téléchargements au total',
          'Note moyenne 4.7/5'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'Université de Toamasina',
        degree: 'Licence en Informatique',
        fieldOfStudy: 'Systèmes d\'information',
        period: '2019 - 2022',
        description: 'Formation en développement logiciel et systèmes d\'information.',
        grade: 'Mention Bien',
        achievements: []
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Application de suivi médical',
        description: 'Application mobile pour le suivi des patients et la gestion des rendez-vous médicaux.',
        link: 'https://github.com/fanevarand/medical-tracker',
        technologies: ['Flutter', 'Dart', 'Firebase', 'Node.js'],
        image: null,
        achievements: [
          'Adoptée par 3 cliniques locales',
          'Prix de l\'innovation digitale étudiante'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'Flutter Developer',
        issuer: 'Google',
        date: '2022',
        link: 'https://www.credential.net/...'
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
    email: 'tiana.heriso@gmail.com',
    password: 'SecurePassword123!',
    prenom: 'Tiana',
    nom: 'Heriso',
    role: 'student',
    
    personalInfo: {
      title: 'Ingénieur DevOps',
      description: 'Spécialiste de l\'intégration continue et du déploiement automatisé. Convaincu que la bonne pratique DevOps permet d\'accélérer la livraison de logiciels de qualité.',
      phone: '+261 34 456 7890',
      location: 'Antsirabe, Madagascar',
      coordinates: [-19.8615, 47.0492],
      linkedin: 'https://linkedin.com/in/tiana-heriso',
      github: 'https://github.com/tianaheriso',
      website: 'https://tiana-devops.com',
      availability: 'Disponible immédiatement',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'DevOps',
        skills: [
          { name: 'Docker', level: 'Avancé', years: 3 },
          { name: 'Kubernetes', level: 'Intermédiaire', years: 2 },
          { name: 'Jenkins', level: 'Avancé', years: 2 },
          { name: 'AWS', level: 'Intermédiaire', years: 1 }
        ]
      },
      {
        category: 'Programming',
        skills: [
          { name: 'Python', level: 'Intermédiaire', years: 2 },
          { name: 'Bash', level: 'Avancé', years: 3 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Courant', certification: 'IELTS 7.0' },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Résolution de problèmes',
      'Autonomie',
      'Pédagogie',
      'Travail en équipe'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'DevOps Engineer',
        company: 'CloudMad Services',
        location: 'Antananarivo, Madagascar',
        period: '2021 - Présent',
        type: 'CDI',
        description: 'Mise en place d\'environnements CI/CD et gestion de l\'infrastructure cloud.',
        technologies: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform'],
        achievements: [
          'Automatisation de 90% des déploiements',
          'Réduction de 50% du MTTR',
          'Formation de 5 collègues'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'ESIM - SUPETRI Madagascar',
        degree: 'Licence en Réseaux & Télécoms',
        fieldOfStudy: 'Administation Systèmes',
        period: '2018 - 2021',
        description: 'Formation en administration systèmes et réseaux.',
        grade: 'Mention Bien',
        achievements: [
          'Projet de fin d\'étude sur l\'orchestration de conteneurs'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Plateforme CI/CD cloud-native',
        description: 'Pipeline d\'intégration continue basé sur Kubernetes et GitLab CI.',
        link: 'https://github.com/tianaheriso/cicd-platform',
        technologies: ['Kubernetes', 'Docker', 'Jenkins', 'GitLab CI', 'Terraform'],
        image: null,
        achievements: [
          'Déploiement sur 3 environnements',
          'Support de 10+ projets simultanés'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'AWS Certified DevOps Engineer',
        issuer: 'Amazon Web Services',
        date: '2023',
        link: 'https://www.credential.net/...'
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
    email: 'sonia.ranto@gmail.com',
    password: 'SecurePassword123!',
    prenom: 'Sonia',
    nom: 'Ranto',
    role: 'student',
    
    personalInfo: {
      title: 'UI/UX Designer',
      description: 'Designer passionnée qui croit que la bonne expérience utilisateur est au coeur de tout produit digital réussi. Spécialisée dans la création d\'interfaces intuitives et esthétiques.',
      phone: '+261 32 567 8901',
      location: 'Toliara, Madagascar',
      coordinates: [-23.3485, 43.7225],
      linkedin: 'https://linkedin.com/in/sonia-ranto',
      github: 'https://github.com/soniaranto',
      website: 'https://sonia.design',
      availability: 'Disponible à partir de février 2024',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Design Tools',
        skills: [
          { name: 'Figma', level: 'Avancé', years: 3 },
          { name: 'Adobe XD', level: 'Avancé', years: 2 },
          { name: 'Sketch', level: 'Intermédiaire', years: 1 },
          { name: 'Photoshop', level: 'Avancé', years: 3 }
        ]
      },
      {
        category: 'Prototyping',
        skills: [
          { name: 'InVision', level: 'Intermédiaire', years: 2 },
          { name: 'Principle', level: 'Débutant', years: 1 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Intermédiaire', certification: 'TOEIC 750' },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Créativité',
      'Empathie utilisateur',
      'Communication',
      'Travail en équipe'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'UI/UX Designer',
        company: 'DesignMad Agency',
        location: 'Antananarivo, Madagascar',
        period: '2022 - Présent',
        type: 'CDI',
        description: 'Conception et prototypage d\'interfaces utilisateur pour des applications mobiles et web.',
        technologies: ['Figma', 'Adobe XD', 'InVision', 'Sketch'],
        achievements: [
          'Création de 15+ interfaces utilisateur',
          'Amélioration de 40% de l\'UX',
          'Création d\'un design system'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'Université de Toliara',
        degree: 'Licence en Arts Numériques',
        fieldOfStudy: 'Design Graphique',
        period: '2019 - 2022',
        description: 'Formation en design graphique et multimédia.',
        grade: 'Mention Très Bien',
        achievements: [
          'Meilleur portfolio de la promotion',
          'Prix de l\'innovation design'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Application bancaire mobile',
        description: 'Redesign complet de l\'interface d\'une application de banking mobile.',
        link: 'https://figma.com/...',
        technologies: ['Figma', 'Adobe XD', 'Sketch', 'Principle'],
        image: null,
        achievements: [
          'Augmentation de 35% de l\'adoption',
          'Meilleure note UX des 6 derniers mois'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'UI/UX Design Certification',
        issuer: 'CalArts',
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
    email: 'mika.randri@gmail.com',
    password: 'SecurePassword123!',
    prenom: 'Mika',
    nom: 'Randri',
    role: 'student',
    
    personalInfo: {
      title: 'Cybersecurity Specialist',
      description: 'Spécialisé dans la sécurité des systèmes d\'information et la protection des données. Convaincu que la cybersécurité est essentielle pour la transformation digitale des entreprises.',
      phone: '+261 33 678 9012',
      location: 'Mahajanga, Madagascar',
      coordinates: [-15.7149, 46.3392],
      linkedin: 'https://linkedin.com/in/mika-randri',
      github: 'https://github.com/mikarandri',
      website: 'https://mika-security.com',
      availability: 'Disponible immédiatement',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Security',
        skills: [
          { name: 'Penetration Testing', level: 'Avancé', years: 3 },
          { name: 'Network Security', level: 'Avancé', years: 2 },
          { name: 'Vulnerability Assessment', level: 'Avancé', years: 2 },
          { name: 'SIEM', level: 'Intermédiaire', years: 1 }
        ]
      },
      {
        category: 'Networking',
        skills: [
          { name: 'Firewalls', level: 'Avancé', years: 2 },
          { name: 'IDS/IPS', level: 'Intermédiaire', years: 1 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Courant', certification: 'TOEFL 90' },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Analyse critique',
      'Rigueur',
      'Résolution de problèmes',
      'Confidentialité'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'Security Analyst',
        company: 'SecureMad Solutions',
        location: 'Antananarivo, Madagascar',
        period: '2021 - Présent',
        type: 'CDI',
        description: 'Analyse des vulnérabilités et protection des systèmes d\'information.',
        technologies: ['Nessus', 'Nmap', 'Wireshark', 'Metasploit', 'Splunk'],
        achievements: [
          'Identification de 25+ vulnérabilités critiques',
          'Mise en place de 5 procédures de sécurité',
          'Formation de 10 collègues'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'Université de Mahajanga',
        degree: 'Master en Sécurité Informatique',
        fieldOfStudy: 'Cybersécurité',
        period: '2019 - 2022',
        description: 'Formation spécialisée en sécurité des systèmes d\'information.',
        grade: 'Mention Très Bien',
        achievements: [
          'Certification CEH obtenue',
          'Meilleur mémoire sur la cybersécurité'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Audit de sécurité réseau',
        description: 'Audit complet de la sécurité d\'un réseau d\'entreprise avec recommandations.',
        link: 'https://github.com/mikarandri/security-audit',
        technologies: ['Nmap', 'Nessus', 'Wireshark', 'Metasploit'],
        image: null,
        achievements: [
          '30+ recommandations implémentées',
          'Réduction de 60% des vulnérabilités'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'Certified Ethical Hacker (CEH)',
        issuer: 'EC-Council',
        date: '2022',
        link: 'https://www.eccouncil.org/...'
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
    email: 'nirina.fidy@gmail.com',
    password: 'SecurePassword123!',
    prenom: 'Nirina',
    nom: 'Fidy',
    role: 'student',
    
    personalInfo: {
      title: 'Full Stack Developer',
      description: 'Développeur passionné par la création de produits digitaux complets. Expérience dans le développement frontend et backend avec une attention particulière portée à la qualité du code.',
      phone: '+261 34 789 0123',
      location: 'Antananarivo, Madagascar',
      coordinates: [-18.9137, 47.5361],
      linkedin: 'https://linkedin.com/in/nirina-fidy',
      github: 'https://github.com/nirinafidy',
      website: 'https://nirina-dev.com',
      availability: 'Disponible immédiatement',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Frontend',
        skills: [
          { name: 'React', level: 'Avancé', years: 3 },
          { name: 'Vue.js', level: 'Avancé', years: 2 },
          { name: 'Angular', level: 'Intermédiaire', years: 1 },
          { name: 'TypeScript', level: 'Avancé', years: 2 }
        ]
      },
      {
        category: 'Backend',
        skills: [
          { name: 'Node.js', level: 'Avancé', years: 3 },
          { name: 'Python', level: 'Intermédiaire', years: 2 },
          { name: 'Django', level: 'Intermédiaire', years: 2 },
          { name: 'Express', level: 'Avancé', years: 3 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Courant', certification: 'TOEFL 95' },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Adaptabilité',
      'Leadership',
      'Résolution de problèmes',
      'Travail en équipe'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'Full Stack Developer',
        company: 'Nexus Technologies',
        location: 'Antananarivo, Madagascar',
        period: '2021 - Présent',
        type: 'CDI',
        description: 'Développement de solutions web complètes de la conception à la mise en production.',
        technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB'],
        achievements: [
          'Développement de 8+ produits digitaux',
          'Architecture de microservices',
          'Mentorat de 4 développeurs juniors'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'Institut Supérieur d\'Informatique',
        degree: 'Licence en Génie Logiciel',
        fieldOfStudy: 'Développement Full Stack',
        period: '2018 - 2021',
        description: 'Formation en développement logiciel et architecture de systèmes.',
        grade: 'Mention Très Bien',
        achievements: [
          'Meilleur projet de fin d\'étude',
          'Prix de l\'innovation technologique'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Plateforme de e-learning',
        description: 'Solution complète de formation en ligne avec suivi et évaluations.',
        link: 'https://github.com/nirinafidy/elearning-platform',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
        image: null,
        achievements: [
          '5000+ utilisateurs',
          'Système de certification',
          'Support mobile'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'Full Stack Development Certification',
        issuer: 'FreeCodeCamp',
        date: '2022',
        link: 'https://www.freecodecamp.org/...'
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
    email: 'anja.rasolo@gmail.com',
    password: 'SecurePassword123!',
    prenom: 'Anja',
    nom: 'Rasolo',
    role: 'student',
    
    personalInfo: {
      title: 'Product Manager',
      description: 'Gestionnaire de produit passionné par la création de produits qui répondent aux besoins réels des utilisateurs. Expérience dans la coordination entre les équipes techniques et métiers.',
      phone: '+261 32 890 1234',
      location: 'Antananarivo, Madagascar',
      coordinates: [-18.9137, 47.5361],
      linkedin: 'https://linkedin.com/in/anja-rasolo',
      github: 'https://github.com/AnjaRasolo',
      website: 'https://anja-pm.com',
      availability: 'Disponible immédiatement',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Product Management',
        skills: [
          { name: 'Product Strategy', level: 'Avancé', years: 3 },
          { name: 'Roadmapping', level: 'Avancé', years: 3 },
          { name: 'User Research', level: 'Avancé', years: 2 },
          { name: 'Agile Methodologies', level: 'Avancé', years: 3 }
        ]
      },
      {
        category: 'Business Analysis',
        skills: [
          { name: 'Data Analysis', level: 'Intermédiaire', years: 2 },
          { name: 'A/B Testing', level: 'Intermédiaire', years: 1 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Courant', certification: 'TOEIC 800' },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Leadership',
      'Communication',
      'Stratégie',
      'Analyse'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'Product Manager',
        company: 'Innovate Madagascar',
        location: 'Antananarivo, Madagascar',
        period: '2022 - Présent',
        type: 'CDI',
        description: 'Conception et gestion de produits digitaux pour le marché malgache.',
        technologies: ['Jira', 'Figma', 'Google Analytics', 'SQL'],
        achievements: [
          'Lancement de 3 produits avec succès',
          'Croissance de 150% de l\'utilisation',
          'Coordination de 12 ingénieurs'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'ESAN Graduate School of Management',
        degree: 'Master en Management',
        fieldOfStudy: 'Product Management',
        period: '2020 - 2022',
        description: 'Formation en gestion de produits et stratégie digitale.',
        grade: 'Mention Bien',
        achievements: [
          'Stage dans une startup de renom',
          'Projet de recherche sur l\'innovation produit'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Application de services à la personne',
        description: 'Platforme de services à la personne avec système de notation et suivi.',
        link: 'https://github.com/AnjaRasolo/service-marketplace',
        technologies: ['Product Strategy', 'User Research', 'Agile', 'Analytics'],
        image: null,
        achievements: [
          '3000+ utilisateurs en 3 mois',
          'Meilleure UX du secteur',
          'Partenariat avec 50+ prestataires'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'Certified Scrum Product Owner',
        issuer: 'Scrum Alliance',
        date: '2022',
        link: 'https://www.scrumalliance.org/...'
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
    email: 'harinoro.tovo@gmail.com',
    password: 'SecurePassword123!',
    prenom: 'Harinoro',
    nom: 'Tovo',
    role: 'student',
    
    personalInfo: {
      title: 'Cloud Engineer',
      description: 'Ingénieur cloud passionné par la conception d\'architectures scalables et sécurisées. Expérience dans l\'utilisation des plateformes cloud pour optimiser les performances et réduire les coûts.',
      phone: '+261 33 901 2345',
      location: 'Antananarivo, Madagascar',
      coordinates: [-18.9137, 47.5361],
      linkedin: 'https://linkedin.com/in/harinoro-tovo',
      github: 'https://github.com/harinorotovo',
      website: 'https://harinoro.cloud',
      availability: 'Disponible immédiatement',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Cloud Platforms',
        skills: [
          { name: 'AWS', level: 'Avancé', years: 3 },
          { name: 'Azure', level: 'Intermédiaire', years: 2 },
          { name: 'Google Cloud', level: 'Intermédiaire', years: 1 }
        ]
      },
      {
        category: 'Infrastructure',
        skills: [
          { name: 'Terraform', level: 'Avancé', years: 2 },
          { name: 'CloudFormation', level: 'Intermédiaire', years: 1 },
          { name: 'Kubernetes', level: 'Intermédiaire', years: 1 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Courant', certification: 'TOEFL 85' },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Résolution de problèmes',
      'Adaptabilité',
      'Autonomie',
      'Collaboration'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'Cloud Engineer',
        company: 'CloudMad Services',
        location: 'Antananarivo, Madagascar',
        period: '2022 - Présent',
        type: 'CDI',
        description: 'Conception et déploiement d\'architectures cloud pour les clients de l\'entreprise.',
        technologies: ['AWS', 'Terraform', 'Kubernetes', 'Docker'],
        achievements: [
          'Migration de 20+ applications vers le cloud',
          'Réduction de 40% des coûts d\'infrastructure',
          'Mise en place de CI/CD cloud-native'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'Institut National des Sciences Appliquées',
        degree: 'Master en Systèmes d\'Information',
        fieldOfStudy: 'Cloud Computing',
        period: '2019 - 2022',
        description: 'Formation en architectures cloud et systèmes distribués.',
        grade: 'Mention Très Bien',
        achievements: [
          'Certifications AWS obtenues',
          'Meilleur projet sur l\'optimisation cloud'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'Multi-cloud architecture',
        description: 'Architecture hybride multi-cloud avec haute disponibilité et tolérance aux pannes.',
        link: 'https://github.com/harinorotovo/multi-cloud-arch',
        technologies: ['AWS', 'Azure', 'Terraform', 'Docker', 'Kubernetes'],
        image: null,
        achievements: [
          '99.9% de disponibilité',
          'Réplication cross-region',
          'Outils de monitoring avancés'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023',
        link: 'https://www.credential.net/...'
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
    email: 'mialy.sarah@gmail.com',
    password: 'SecurePassword123!',
    prenom: 'Mialy',
    nom: 'Sarah',
    role: 'student',
    
    personalInfo: {
      title: 'Blockchain Developer',
      description: 'Développeuse passionnée par les technologies blockchain et leur potentiel de transformation des industries. Expérience dans le développement de smart contracts et DApps.',
      phone: '+261 34 012 3456',
      location: 'Antananarivo, Madagascar',
      coordinates: [-18.9137, 47.5361],
      linkedin: 'https://linkedin.com/in/mialy-sarah',
      github: 'https://github.com/mialysarah',
      website: 'https://mialy-blockchain.com',
      availability: 'Disponible à partir de mars 2024',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Blockchain',
        skills: [
          { name: 'Ethereum', level: 'Avancé', years: 2 },
          { name: 'Smart Contracts', level: 'Avancé', years: 2 },
          { name: 'Solidity', level: 'Avancé', years: 2 },
          { name: 'Web3.js', level: 'Intermédiaire', years: 1 }
        ]
      },
      {
        category: 'Development',
        skills: [
          { name: 'JavaScript', level: 'Avancé', years: 3 },
          { name: 'Python', level: 'Intermédiaire', years: 1 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Courant', certification: 'TOEFL 90' },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Innovation',
      'Résolution de problèmes',
      'Apprentissage rapide',
      'Travail indépendant'
    ],
    
    experiences: [
      {
        id: 'exp-1',
        title: 'Blockchain Developer',
        company: 'CryptoMad Labs',
        location: 'Antananarivo, Madagascar',
        period: '2022 - Présent',
        type: 'CDI',
        description: 'Développement de solutions blockchain pour divers secteurs d\'activité.',
        technologies: ['Ethereum', 'Solidity', 'Web3.js', 'IPFS'],
        achievements: [
          'Développement de 5 smart contracts en production',
          'Création d\'une DApp avec 1000+ utilisateurs',
          'Audit de sécurité pour 3 projets'
        ]
      }
    ],
    
    formations: [
      {
        id: 'form-1',
        institution: 'Université d\'Antananarivo - Ecole Doctorale',
        degree: 'Master en Technologies Émergentes',
        fieldOfStudy: 'Blockchain & Cryptocurrencies',
        period: '2020 - 2022',
        description: 'Formation spécialisée dans les technologies blockchain et décentralisées.',
        grade: 'Mention Bien',
        achievements: [
          'Publication dans une conférence internationale',
          'Meilleur mémoire sur les DeFi'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        title: 'DApp de microcrédit',
        description: 'Plateforme de microcrédit décentralisée pour les entrepreneurs locaux.',
        link: 'https://github.com/mialysarah/microcredit-dapp',
        technologies: ['Ethereum', 'Solidity', 'React', 'Web3.js', 'IPFS'],
        image: null,
        achievements: [
          '200+ prêts distribués',
          'Taux de remboursement de 95%',
          'Prix de l\'innovation sociale'
        ]
      }
    ],
    
    certifications: [
      {
        name: 'Blockchain Fundamentals',
        issuer: 'Linux Foundation',
        date: '2022',
        link: 'https://www.credential.net/...'
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

// Function to get all users with role 'student' from Firestore
async function getAllStudents() {
  try {
    const usersQuery = query(collection(db, 'users'), where('role', '==', 'student'));
    const usersSnapshot = await getDocs(usersQuery);
    
    const students = [];
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      students.push({
        id: userDoc.id,
        ...userData
      });
    }
    
    return students;
  } catch (error) {
    console.error('Error getting students:', error);
    return [];
  }
}

// Function to get Orange Madagascar recruiter ID
async function getOrangeRecruiterId() {
  try {
    const usersQuery = query(collection(db, 'users'), where('company.name', '==', 'Orange Madagascar'));
    const usersSnapshot = await getDocs(usersQuery);
    
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      return userDoc.id;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting Orange recruiter ID:', error);
    return null;
  }
}

// Function to get all offers from Orange Madagascar
async function getOrangeOffers() {
  try {
    const offersQuery = query(collection(db, 'offers'), where('companyName', '==', 'Orange Madagascar'));
    const offersSnapshot = await getDocs(offersQuery);
    
    const offers = [];
    for (const offerDoc of offersSnapshot.docs) {
      const offerData = offerDoc.data();
      offers.push({
        id: offerDoc.id,
        ...offerData
      });
    }
    
    return offers;
  } catch (error) {
    console.error('Error getting Orange offers:', error);
    return [];
  }
}

// Function to create a new application
async function createApplication(applicationData) {
  try {
    const docRef = await addDoc(collection(db, 'applications'), applicationData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating application:', error);
    return null;
  }
}

// Function to create new users
async function createNewUsers() {
  console.log('\n🎓 Création de 10 nouveaux utilisateurs étudiants...\n');
  
  const createdUserIds = {};
  
  for (const studentData of newStudents) {
    try {
      // Create the Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        studentData.email, 
        studentData.password
      );
      const userId = userCredential.user.uid;
      
      // Prepare data for Firestore (without password)
      const { password, ...firestoreData } = studentData;
      
      // Add timestamps
      const userData = {
        ...firestoreData,
        id: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Create the document in Firestore
      const batch = writeBatch(db);
      batch.set(doc(db, 'users', userId), userData);
      await batch.commit();
      
      // Store the ID for reference
      createdUserIds[studentData.email] = userId;
      
      console.log(`   ✅ ${studentData.prenom} ${studentData.nom} - ${studentData.email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`   ⚠️  ${studentData.email} existe déjà`);
      } else {
        console.error(`   ❌ Erreur pour ${studentData.email}:`, error.message);
      }
    }
  }
  
  return createdUserIds;
}

// Function to create applications for all users (new, Zotina, and existing)
async function createApplicationsForOrangeOffers() {
  console.log('\n📝 Création des candidatures pour les offres Orange Madagascar...\n');
  
  // Get all necessary data
  const orangeRecruiterId = await getOrangeRecruiterId();
  if (!orangeRecruiterId) {
    console.log('❌ Impossible de trouver le recruteur Orange Madagascar');
    return;
  }
  
  const orangeOffers = await getOrangeOffers();
  if (orangeOffers.length === 0) {
    console.log('❌ Aucune offre Orange Madagascar trouvée');
    return;
  }
  
  const existingStudents = await getAllStudents();
  
  // Combine all users: new users, existing students and Zotina
  const allUsers = [
    // New students from this script
    ...newStudents.map(student => ({
      id: null, // Will be found after creation
      email: student.email,
      prenom: student.prenom,
      nom: student.nom
    })),
    // Existing students
    ...existingStudents.map(student => ({
      id: student.id,
      email: student.email,
      prenom: student.prenom,
      nom: student.nom
    }))
  ];
  
  console.log(`📊 ${allUsers.length} utilisateurs identifiés pour la création de candidatures`);
  console.log(`📊 ${orangeOffers.length} offres Orange Madagascar trouvées`);
  
  // For each user, create a random number of applications to Orange offers
  for (const user of allUsers) {
    // Determine how many applications this user should have (random between 1-5)
    const appCount = Math.floor(Math.random() * 5) + 1;
    
    // Select random offers for this user
    const selectedOffers = [];
    for (let i = 0; i < appCount; i++) {
      // Select a random offer that hasn't been selected yet for this user
      let randomOffer;
      do {
        randomOffer = orangeOffers[Math.floor(Math.random() * orangeOffers.length)];
      } while (selectedOffers.some(o => o.id === randomOffer.id));
      
      selectedOffers.push(randomOffer);
    }
    
    // Create applications for this user
    for (const offer of selectedOffers) {
      const application = {
        offerId: offer.id,
        offerTitle: offer.title,
        position: offer.title, // Add the position field for compatibility
        studentId: user.id, // Use correct field name: studentId, not candidateId
        studentName: `${user.prenom} ${user.nom}`, // Use correct field name: studentName, not candidateName
        candidateEmail: user.email,
        companyName: 'Orange Madagascar',
        company: 'Orange Madagascar', // Also add company field
        location: offer.location, // Add location for consistency
        salary: offer.salary, // Add salary for consistency
        type: offer.type, // Add type for consistency
        recruiterId: orangeRecruiterId,
        status: ['pending', 'accepted', 'rejected'][Math.floor(Math.random() * 3)],
        matchingScore: Math.floor(Math.random() * 40) + 50, // Random score between 50-90
        appliedDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(), // Within last 7 days
        coverLetter: `Madame, Monsieur,\n\nJe me permets de vous adresser ma candidature pour le poste de ${offer.title} au sein d'Orange Madagascar.\n\nFort de mes compétences en ${offer.technologies ? offer.technologies.slice(0, 2).join(' et ') : 'développement informatique'}, je suis particulièrement intéressé par cette opportunité.\n\nJe reste à votre disposition pour un entretien.\n\nCordialement,\n${user.prenom} ${user.nom}`,
        createdAt: new Date().toISOString()
      };
      
      const appId = await createApplication(application);
      if (appId) {
        console.log(`   ✅ ${user.prenom} ${user.nom} → ${offer.title}`);
      } else {
        console.log(`   ❌ Échec pour ${user.prenom} ${user.nom} → ${offer.title}`);
      }
    }
  }
  
  console.log(`\n🎉 Toutes les candidatures ont été créées avec succès!`);
}

// Main function to execute everything
async function createUsersAndApplications() {
  console.log('\n🚀 CRÉATION DE NOUVEAUX UTILISATEURS ET CANDIDATURES\n');
  console.log('=' .repeat(60));
  
  try {
    // Create new users first
    await createNewUsers();
    
    // Then create applications for all users (including new ones, existing ones, and Zotina)
    await createApplicationsForOrangeOffers();
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ CRÉATION TERMINÉE AVEC SUCCÈS !');
    console.log('='.repeat(60));
    console.log(`📊 ${newStudents.length} nouveaux utilisateurs créés`);
    console.log(`📋 Nombre variable de candidatures créées selon l'algorithme`);
    console.log('\n💡 Les utilisateurs utilisent le mot de passe: SecurePassword123!');
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Execute the function
createUsersAndApplications();