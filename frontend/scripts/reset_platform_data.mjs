import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs, deleteDoc, query, where, updateDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration (same as other scripts)
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
// DONNÉES INITIALES (copiées de init_firestore-nouveau.mjs)
// ============================================

// OFFRES INITIALES
const initialOffers = [
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
  },
  {
    id: 'offer-9',
    title: 'Stage Ingénieur Bases de Données',
    companyName: 'Orange Madagascar',
    recruiterId: null,
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5229909, -18.8842199],
    salary: 'Gratification de stage',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage d'ingénieur bases de données chez Orange Madagascar - l'un des leaders des télécommunications à Madagascar. Vous participerez à la gestion, l'optimisation et le développement des systèmes de gestion de données qui supportent nos services critiques pour des millions d'utilisateurs.

## Vos missions

- Administration et maintenance des bases de données PostgreSQL et MySQL
- Optimisation des performances et des requêtes SQL
- Participation aux projets de migration et d'évolution des systèmes de données
- Mise en place de solutions de sauvegarde et de sécurité
- Collaboration avec les équipes de développement et de sécurité

## Ce que vous apporterez

- Une formation en informatique ou systèmes d'information
- Une curiosité pour les systèmes de gestion de données
- Une rigueur et une attention aux détails
- Une bonne capacité d'analyse`,
    requirements: [
      'Étudiant en informatique ou en systèmes d\'information',
      'Connaissance des bases de données relationnelles (SQL)',
      'Intérêt pour PostgreSQL et MySQL',
      'Capacité d\'analyse et de résolution de problèmes',
      'Bon esprit d\'équipe'
    ],
    niceToHave: [
      'Connaissance de Oracle',
      'Familiarité avec les outils de gestion de bases de données',
      'Notions de sécurité des données'
    ],
    technologies: ['PostgreSQL', 'MySQL', 'SQL', 'Oracle', 'Git', 'Linux'],
    benefits: [
      'Encadrement par des experts',
      'Accès aux technologies de pointe',
      'Formation continue',
      'Possibilité d\'embauche'
    ],
    postedDate: new Date('2024-01-25').toISOString(),
    deadline: new Date('2024-03-25').toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'offer-10',
    title: 'Stage Ingénieur Réseau Télécoms',
    companyName: 'Orange Madagascar',
    recruiterId: null,
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5229909, -18.8842199],
    salary: 'Gratification de stage',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage d'ingénieur réseau télécoms chez Orange Madagascar. Vous participerez à la conception, l'implémentation et la maintenance de nos infrastructures réseau qui supportent les services de télécommunications pour des millions de clients à Madagascar.

## Vos missions

- Support dans la conception et l'optimisation des infrastructures réseau
- Participation à la configuration et au déploiement d'équipements réseaux
- Surveillance et analyse des performances du réseau
- Support dans la résolution des problèmes techniques
- Documentation des procédures et configurations réseau

## Ce que vous apporterez

- Une formation en télécommunications, génie informatique ou réseau
- Des connaissances de base en protocoles réseaux
- Une passion pour les technologies de réseau
- Un esprit d'analyse et de synthèse`,
    requirements: [
      'Étudiant en télécommunications ou en génie informatique',
      'Connaissance des protocoles réseaux (TCP/IP, DHCP, DNS)',
      'Familiarité avec les équipements réseaux (routeurs, commutateurs)',
      'Compétences en analyse et résolution de problèmes',
      'Capacité de travail en équipe'
    ],
    niceToHave: [
      'Connaissance des équipements Cisco ou Huawei',
      'Certification réseau (CCNA, etc.)',
      'Expérience avec des outils de surveillance réseau'
    ],
    technologies: ['TCP/IP', 'Cisco', 'Huawei', 'SNMP', 'VPN', 'Firewall', 'Linux'],
    benefits: [
      'Encadrement par des ingénieurs expérimentés',
      'Accès à l'infrastructure réseau d'un opérateur de premier plan',
      'Formation continue',
      'Possibilité de CDI après le stage'
    ],
    postedDate: new Date('2024-01-26').toISOString(),
    deadline: new Date('2024-03-30').toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  }
];

// APPLICATIONS INITIALES
const initialApplications = [
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

// PROFIL ZOTINA INITIAL (comme dans reset_zotina_user.mjs)
const zotinaUser = {
  email: 'zotinafiti@gmail.com',
  password: 'SecurePassword123!', // Note: Password can't be updated this way, only for reference
  prenom: 'Zotina',
  nom: 'Rasetrarinjanahary',
  role: 'student',
  
  // Structure minimale pour un étudiant de 3ème année sans expérience
  personalInfo: {
    title: 'Étudiant en informatique',
    description: 'Je suis étudiant en informatique et je cherche à améliorer mes compétences.',
    phone: '+261 34 123 4567',
    location: 'Antananarivo, Madagascar',
    coordinates: [-18.9137, 47.5361],
    linkedin: '',
    github: '',
    website: '',
    availability: 'Disponible',
    remoteWork: true,
    profileImage: 'https://via.placeholder.com/150'
  },
  
  technicalSkills: [],
  languages: [],
  softSkills: [],
  experiences: [], // No experience for 3rd year student
  formations: [
    {
      id: 'form-zotina-1',
      institution: 'IT University',
      degree: 'Licence en Informatique',
      fieldOfStudy: 'Informatique',
      period: '2022 - 2025',  
      description: 'Formation en developpement d\'applications',
      grade: '',
      achievements: []
    }
  ],
  projects: [],
  certifications: [],
  
  stats: {
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    profileViews: 0
  }
};

// OFFRES DE TEST POUR ZOTINA basées sur son profil (comme dans generate_test_offers.mjs)
const zotinaTestOffers = [
  {
    id: 'test-offer-1',
    title: 'Développeur Java Full Stack Senior',
    companyName: 'Orange Madagascar',  // Dénormalisé depuis users.company.name
    recruiterId: null,  // Sera rempli après création du recruteur
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5229909, -18.8842199],
    salary: '2,500,000 - 3,500,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Chez Orange Madagascar, nous recherchons un Développeur Java Full Stack Senior pour renforcer notre équipe technique dans le développement de solutions digitales innovantes. Vous participerez à la conception et au développement d'applications critiques pour notre infrastructure de télécommunications.

## Responsabilités

- Conception et développement d'applications Java full stack robustes et évolutives
- Conception et gestion d'architectures de systèmes distribués
- Collaboration avec les équipes produit, devops et sécurité
- Optimisation des performances des applications existantes
- Mentorat des développeurs juniors

## Environnement de travail

- Équipe technique expérimentée
- Technologies modernes et architecture avancée
- Formation continue
- Horaires flexibles
- Télétravail possible`,
    requirements: [
      'Minimum 3 ans d\'expérience en développement Java',
      'Maîtrise de Spring Boot et des frameworks Java avancés',
      'Expérience avec PostgreSQL et MySQL',
      'Connaissance des architectures distribuées',
      'Expérience avec Git et CI/CD',
      'Bon niveau en anglais technique'
    ],
    niceToHave: [
      'Expérience avec Docker et conteneurisation',
      'Connaissance des systèmes de télécommunications',
      'Expérience avec des ETL'
    ],
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'MySQL', 'Docker', 'Laravel', 'Vue.js', 'MongoDB', 'Git'],
    benefits: [
      'Assurance santé complémentaire',
      'Formation continue et certifications prises en charge',
      'Équipement de qualité',
      'Télétravail possible',
      'Horaires flexibles'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'test-offer-2',
    title: 'Ingénieur Bases de Données PostgreSQL',
    companyName: 'Orange Madagascar',  // Dénormalisé depuis users.company.name
    recruiterId: null,  // Sera rempli après création du recruteur
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5229909, -18.8842199],
    salary: '2,200,000 - 3,200,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Rejoignez notre équipe de gestion des bases de données chez Orange Madagascar. En tant qu'Ingénieur Bases de Données, vous serez responsable de la conception, de l'implémentation et de l'optimisation de nos systèmes de gestion de données critiques pour nos services de télécommunications.

## Responsabilités

- Conception et optimisation d'architectures de bases de données PostgreSQL
- Administration et maintenance des serveurs PostgreSQL
- Optimisation des performances et des requêtes SQL complexes
- Conception d'architectures de systèmes distribués pour les bases de données
- Mise en place de solutions ETL pour l'analyse de données
- Veille technologique et formation continue

## Environnement de travail

- Environnement technique de pointe
- Projets à fort impact sur des millions d'utilisateurs
- Équipe experte en bases de données
- Technologies modernes`,
    requirements: [
      'Maîtrise avancée de PostgreSQL et MySQL',
      'Expérience en conception d\'architectures de bases de données',
      'Compétences en optimisation des performances',
      'Connaissance des systèmes distribués',
      'Expérience avec des outils ETL',
      'Expérience avec Docker et conteneurisation'
    ],
    niceToHave: [
      'Connaissance d\'Oracle Database',
      'Expérience avec des plateformes cloud (AWS, Azure)',
      'Certifications PostgreSQL'
    ],
    technologies: ['PostgreSQL', 'MySQL', 'Oracle', 'Docker', 'ETL', 'Git', 'Gantt', 'Looping'],
    benefits: [
      'Package salarial compétitif',
      'Formation technique continue',
      'Accès aux dernières technologies',
      'Projets innovants',
      'Horaires flexibles'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'test-offer-3',
    title: 'Développeur Backend PHP Laravel',
    companyName: 'Yas Madagascar',  // Dénormalisé depuis users.company.name
    recruiterId: null,  // Sera rempli après création du recruteur
    location: 'Antananarivo, Madagascar',
    coordinates: [47.52566623322738, -18.909228523929638],
    salary: '1,800,000 - 2,800,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Chez Yas Madagascar, nous recherchons un Développeur Backend expérimenté en PHP Laravel pour participer au développement de nos plateformes de télécommunications et services numériques.

## Responsabilités

- Développement d'APIs robustes avec PHP Laravel
- Intégration avec les systèmes de télécommunications existants
- Gestion et optimisation des bases de données
- Collaboration avec les équipes frontend et DevOps
- Revue de code et maintenabilité

## Environnement de travail

- Équipe jeune et dynamique
- Technologies modernes
- Projet à impact national
- Croissance professionnelle`,
    requirements: [
      'Maîtrise avancée de PHP et du framework Laravel',
      'Expérience avec PostgreSQL et MySQL',
      'Connaissance des API RESTful',
      'Expérience avec Git et méthodologies agiles',
      'Bonne compréhension des architectures MVC'
    ],
    niceToHave: [
      'Expérience avec Node.js ou Python',
      'Connaissance de Docker',
      'Expérience avec des outils de monitoring'
    ],
    technologies: ['PHP', 'Laravel', 'PostgreSQL', 'MySQL', 'JavaScript', 'Git', 'Docker'],
    benefits: [
      'Salaire compétitif',
      'Équipement professionnel',
      'Formation continue',
      'Évolution de carrière',
      'Très bon environnement de travail'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'test-offer-4',
    title: 'Architecte Logiciel Full Stack',
    companyName: 'Yas Madagascar',  // Dénormalisé depuis users.company.name
    recruiterId: null,  // Sera rempli après création du recruteur
    location: 'Antananarivo, Madagascar',
    coordinates: [47.52566623322738, -18.909228523929638],
    salary: '3,000,000 - 4,500,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Chez Yas Madagascar, nous recherchons un Architecte Logiciel Full Stack pour concevoir et superviser le développement de nos applications et services critiques de télécommunications.

## Responsabilités

- Conception d'architectures logicielles scalables et sécurisées
- Supervision du développement full stack (frontend et backend)
- Prise de décisions techniques et stratégie technologique
- Encadrement des équipes de développement
- Gestion des performances et de la sécurité

## Environnement de travail

- Poste à hautes responsabilités
- Technologie de pointe
- Croissance professionnelle rapide
- Participation à la transformation digitale de Madagascar`,
    requirements: [
      'Expertise en développement full stack (Java, PHP, JavaScript)',
      'Expérience avancée en architecture logicielle',
      'Maîtrise de plusieurs bases de données (PostgreSQL, MySQL, Oracle)',
      'Compétences en gestion de projet et leadership',
      'Expérience avec des systèmes de télécommunications'
    ],
    niceToHave: [
      'Connaissance des plateformes cloud',
      'Expérience avec des outils DevOps',
      'Maîtrise des méthodologies CI/CD'
    ],
    technologies: ['Java', 'PHP', 'Laravel', 'Spring Boot', 'JavaScript', 'Vue.js', 'PostgreSQL', 'MySQL', 'Oracle', 'Docker', 'Git', 'Express.js'],
    benefits: [
      'Rémunération excellente',
      'Participation aux décisions stratégiques',
      'Formation continue avancée',
      'Équipement haut de gamme',
      'Conditions de travail exceptionnelles'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'test-offer-5',
    title: 'Développeur Backend Java Spring Boot',
    companyName: 'Airtel Madagascar',  // Dénormalisé depuis users.company.name
    recruiterId: null,  // Sera rempli après création du recruteur
    location: 'Antananarivo, Madagascar',
    coordinates: [47.519278, -18.8753376],
    salary: '2,000,000 - 3,000,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Airtel Madagascar recherche un Développeur Backend Java Spring Boot pour rejoindre son équipe technique dans le développement de solutions de télécommunications innovantes.

## Responsabilités

- Développement d'applications backend avec Java Spring Boot
- Conception d'APIs REST sécurisées et performantes
- Intégration avec les systèmes de télécommunications
- Optimisation des performances et de la sécurité
- Collaboration avec les équipes frontend et DevOps

## Environnement de travail

- Grand opérateur de télécommunications
- Environnement technique exigeant
- Projets à fort impact
- Technologies de pointe`,
    requirements: [
      'Maîtrise avancée de Java et Spring Boot',
      'Expérience avec PostgreSQL et MySQL',
      'Connaissance des API REST et de la sécurité web',
      'Expérience avec Git et CI/CD',
      'Bonnes capacités de travail en équipe'
    ],
    niceToHave: [
      'Expérience avec Docker et conteneurisation',
      'Connaissance des systèmes de télécommunications',
      'Expérience avec des outils de monitoring'
    ],
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'MySQL', 'JavaScript', 'Git', 'Docker', 'Express.js'],
    benefits: [
      'Package attractif',
      'Travail sur des projets à fort impact',
      'Formation continue',
      'Évolution de carrière',
      'Environnement professionnel stimulant'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  }
];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

// Fonction pour trouver les IDs des recruteurs existants
async function getRecruiterIds() {
  console.log('\n🔍 Recherche des IDs des recruteurs existants...');
  
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const recruiterIds = {};
  
  usersSnapshot.forEach(doc => {
    const userData = doc.data();
    if (userData.role === 'recruiter' && userData.company) {
      recruiterIds[userData.company.name] = doc.id;
      console.log(`   ✅ ${userData.company.name}: ${doc.id}`);
    }
  });
  
  return recruiterIds;
}

// Fonction pour trouver les IDs des étudiants existants
async function getStudentIds() {
  console.log('\n🔍 Recherche des IDs des étudiants existants...');
  
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const studentIds = {};
  
  usersSnapshot.forEach(doc => {
    const userData = doc.data();
    if (userData.role === 'student') {
      studentIds[userData.email] = doc.id;
      console.log(`   ✅ ${userData.prenom} ${userData.nom} (${userData.email}): ${doc.id}`);
    }
  });
  
  return studentIds;
}

// Réinitialiser les offres
async function resetOffers() {
  console.log('\n💼 RÉINITIALISATION DES OFFRES...');
  
  // Supprimer toutes les offres existantes
  console.log('   🗑️ Suppression des offres existantes...');
  const offersSnapshot = await getDocs(collection(db, 'offers'));
  const batch = writeBatch(db);
  
  offersSnapshot.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`   ✅ ${offersSnapshot.size} offres supprimées`);
  
  // Récupérer les IDs des recruteurs
  const recruiterIds = await getRecruiterIds();
  
  // Créer les offres initiales
  console.log('   📥 Création des offres initiales...');
  const newBatch = writeBatch(db);
  let count = 0;
  
  for (const offer of initialOffers) {
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
      newBatch.set(offerRef, offerData);
      count++;
      
      console.log(`   ✅ ${offer.title} - ${offer.companyName}`);
    } catch (error) {
      console.error(`   ❌ Erreur pour ${offer.title}:`, error.message);
    }
  }
  
  await newBatch.commit();
  console.log(`   📊 ${count} offres réinitialisées`);
}

// Réinitialiser les applications
async function resetApplications() {
  console.log('\n📝 RÉINITIALISATION DES CANDIDATURES...');
  
  // Supprimer toutes les applications existantes
  console.log('   🗑️ Suppression des candidatures existantes...');
  const applicationsSnapshot = await getDocs(collection(db, 'applications'));
  const batch = writeBatch(db);
  
  applicationsSnapshot.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`   ✅ ${applicationsSnapshot.size} candidatures supprimées`);
  
  // Récupérer les IDs des recruteurs et des étudiants
  const recruiterIds = await getRecruiterIds();
  const studentIds = await getStudentIds();
  
  // Créer les applications initiales
  console.log('   📥 Création des candidatures initiales...');
  const newBatch = writeBatch(db);
  let count = 0;
  
  for (const application of initialApplications) {
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
      newBatch.set(appRef, appData);
      count++;
      
      console.log(`   ✅ ${application.candidateName} → ${application.offerTitle}`);
    } catch (error) {
      console.error(`   ❌ Erreur pour candidature:`, error.message);
    }
  }
  
  await newBatch.commit();
  console.log(`   📊 ${count} candidatures réinitialisées`);
}

// Réinitialiser l'utilisateur Zotina
async function resetZotinaUser() {
  console.log('\n🎓 RÉINITIALISATION DE L\'UTILISATEUR ZOTINA...');
  
  try {
    console.log('   🔍 Recherche de l\'utilisateur Zotina...');
    
    // Query for the user with the specific email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', 'zotinafiti@gmail.com'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('   ❌ Aucun utilisateur trouvé avec l\'email: zotinafiti@gmail.com');
      console.log('   💡 Assurez-vous que l\'utilisateur existe avant de réinitialiser ses données.');
      return;
    }
    
    // Get the user document
    const userDoc = querySnapshot.docs[0];
    const userId = userDoc.id;
    
    console.log(`   ✅ Utilisateur trouvé: ${zotinaUser.prenom} ${zotinaUser.nom} (ID: ${userId})`);
    
    console.log('   🔧 Mise à jour des données de l\'utilisateur...');
    
    // Update the user document with the basic profile
    const userRef = doc(db, 'users', userId);
    const { password, ...updateData } = zotinaUser; // Exclude password from update
    
    // Add timestamp for the update
    const updatePayload = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(userRef, updatePayload);
    
    console.log('   ✅ Données utilisateur mises à jour avec succès');
    console.log(`   📧 Email: ${zotinaUser.email}`);
    console.log(`   👤 Nom: ${zotinaUser.prenom} ${zotinaUser.nom}`);
    console.log('   📊 Expérience: Aucune (profil 3ème année)');
    console.log('   📚 Compétences: Aucune (profil 3ème année)');
    
  } catch (error) {
    console.error('   ❌ ERREUR lors de la réinitialisation de l\'utilisateur Zotina:', error);
  }
}

// Réinitialiser les offres de test pour Zotina
async function resetZotinaTestOffers() {
  console.log('\n💼 RÉINITIALISATION DES OFFRES DE TEST POUR ZOTINA...');
  
  try {
    // Récupérer les IDs des recruteurs
    const recruiterIds = await getRecruiterIds();
    console.log('   🔍 IDs des recruteurs récupérés:', Object.keys(recruiterIds));
    
    // Supprimer les offres de test existantes
    console.log('   🗑️ Suppression des offres de test existantes...');
    const testOffersBatch = writeBatch(db);
    let deletedCount = 0;
    
    const allOffersSnapshot = await getDocs(collection(db, 'offers'));
    allOffersSnapshot.forEach(doc => {
      const offerData = doc.data();
      if (offerData.id && offerData.id.startsWith('test-offer')) {
        testOffersBatch.delete(doc.ref);
        deletedCount++;
      }
    });
    
    await testOffersBatch.commit();
    console.log(`   ✅ ${deletedCount} offres de test supprimées`);
    
    // Créer les offres de test pour Zotina
    console.log('   📥 Création des offres de test pour Zotina...');
    const newBatch = writeBatch(db);
    let count = 0;
    
    for (const offer of zotinaTestOffers) {
      try {
        const recruiterId = recruiterIds[offer.companyName];
        if (!recruiterId) {
          console.error(`   ❌ Aucun recruteur trouvé pour ${offer.companyName}`);
          continue;
        }
        
        const offerData = {
          ...offer,
          recruiterId: recruiterId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const offerRef = doc(db, 'offers', offer.id);
        newBatch.set(offerRef, offerData);
        
        console.log(`   ✅ ${offer.title} - ${offer.companyName}`);
        count++;
      } catch (error) {
        console.error(`   ❌ Erreur pour ${offer.title}:`, error.message);
      }
    }
    
    await newBatch.commit();
    console.log(`   📊 ${count} offres de test pour Zotina créées`);
    
  } catch (error) {
    console.error('   ❌ ERREUR lors de la réinitialisation des offres de test pour Zotina:', error);
  }
}

// ============================================
// FONCTION PRINCIPALE
// ============================================

async function resetPlatformData() {
  console.log('\n🚀 RÉINITIALISATION COMPLETE DE LA PLATEFORME');
  console.log('===========================================');
  console.log('\nℹ️  Cette opération va:');
  console.log('   • Réinitialiser toutes les offres à leur état initial');
  console.log('   • Réinitialiser toutes les candidatures à leur état initial');
  console.log('   • Créer des offres de test basées sur le profil de Zotina');
  console.log('   • Réinitialiser le profil de l\'utilisateur zotinafiti@gmail.com');
  console.log('   • Conserver tous les autres utilisateurs sans modifications');
  console.log('\n⚠️  Les collections affectées: offers, applications');
  console.log('ℹ️  Les collections non affectées: users (sauf zotinafiti@gmail.com)');
  
  try {
    console.log('\n📦 PHASE 1: Réinitialisation des offres');
    await resetOffers();
    
    console.log('\n📦 PHASE 2: Réinitialisation des candidatures');
    await resetApplications();
    
    console.log('\n📦 PHASE 3: Création des offres de test pour Zotina');
    await resetZotinaTestOffers();
    
    console.log('\n📦 PHASE 4: Réinitialisation de l\'utilisateur Zotina');
    await resetZotinaUser();
    
    // Résumé
    console.log('\n' + '='.repeat(60));
    console.log('✅ RÉINITIALISATION TERMINÉE AVEC SUCCÈS !');
    console.log('='.repeat(60));
    console.log('\n📊 Résumé:');
    console.log(`   💼 Offres réinitialisées: ${initialOffers.length}`);
    console.log(`   💼 Offres de test pour Zotina: ${zotinaTestOffers.length}`);
    console.log(`   📝 Candidatures réinitialisées: ${initialApplications.length}`);
    console.log('   👤 Zotina réinitialisé: Oui');
    console.log('   👥 Autres utilisateurs: Préservés');
    console.log('\n💡 La plateforme est maintenant dans son état initial avec les données de base.');
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécution
resetPlatformData();