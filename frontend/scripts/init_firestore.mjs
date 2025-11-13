import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ0Ikd6MqVw5hL4TgzZ3bEZahHKfhkaaw",
  authDomain: "sample-firebase-ai-app-9f955.firebaseapp.com",
  projectId: "sample-firebase-ai-app-9f955",
  storageBucket: "sample-firebase-ai-app-9f955.firebasestorage.app",
  messagingSenderId: "229864401136",
  appId: "1:229864401136:web:5d05e0a280a4bf7a76fa35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Mock data that we'll upload to Firestore
const mockCompanies = [
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
    coordinates: [47.5229909, -18.8842199],
    offers: 5,
    industry: 'Télécommunications',
    size: '500-1000 employés'
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
    coordinates: [47.52566623322738, -18.909228523929638],
    offers: 3,
    industry: 'Télécommunications',
    size: '200-500 employés'
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
    coordinates: [47.519278, -18.8753376],
    offers: 2,
    industry: 'Télécommunications',
    size: '300-600 employés'
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
    coordinates: [47.5061, -18.9121],
    offers: 4,
    industry: 'Technologie / IT',
    size: '100-250 employés'
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
    coordinates: [47.5061, -18.9121],
    offers: 1,
    industry: 'Technologie / IT',
    size: '50-100 employés'
  }
];

const mockOffers = [
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
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
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
    postedDate: '2024-01-12',
    deadline: '2024-02-12',
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
    postedDate: '2024-01-10',
    deadline: '2024-02-10',
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
    postedDate: '2024-01-08',
    deadline: '2024-02-08',
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
    postedDate: '2024-01-18',
    deadline: '2024-02-18',
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
    postedDate: '2024-01-16',
    deadline: '2024-02-16',
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
    postedDate: '2024-01-20',
    deadline: '2024-02-20',
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
    postedDate: '2024-01-22',
    deadline: '2024-02-22',
    requirements: ['Bonne connaissance en développement mobile', 'Portfolio d\'applications', 'Passionné de tech']
  }
];

const mockCandidates = [
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
    status: 'accepted',
    email: 'fanantenana@itu.ac.mg',
    phone: '+261 34 123 4567',
    experiences: [
      {
        title: 'Data Scientist',
        company: 'TechCorp Madagascar',
        location: 'Antananarivo',
        period: '2021 - Présent',
        type: 'CDI',
        description: 'Analyse de données et développement de modèles prédictifs',
        technologies: ['Python', 'TensorFlow', 'Pandas']
      }
    ],
    education: [
      {
        institution: 'Université d\'Antananarivo',
        degree: 'Master en Data Science',
        period: '2018 - 2021',
        description: 'Spécialisation en intelligence artificielle et big data'
      }
    ],
    applications: ['2']
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
    status: 'pending',
    email: 'raviro@itu.ac.mg',
    phone: '+261 34 987 6543',
    experiences: [
      {
        title: 'Développeur Full Stack',
        company: 'DigitMad',
        location: 'Antananarivo',
        period: '2020 - Présent',
        type: 'CDI',
        description: 'Développement d\'applications web et mobiles',
        technologies: ['React', 'Node.js', 'MongoDB']
      }
    ],
    education: [
      {
        institution: 'ESIM - SUPETRI Madagascar',
        degree: 'Licence en Informatique',
        period: '2016 - 2020',
        description: 'Spécialisation en développement logiciel'
      }
    ],
    applications: ['5']
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
    status: 'pending',
    email: 'hasina@itu.ac.mg',
    phone: '+261 32 123 4567',
    experiences: [
      {
        title: 'Développeur Mobile',
        company: 'AppMad',
        location: 'Antananarivo',
        period: '2022 - Présent',
        type: 'CDI',
        description: 'Développement d\'applications mobiles natives et hybrides',
        technologies: ['React Native', 'Flutter', 'Firebase']
      }
    ],
    education: [
      {
        institution: 'Université de Toamasina',
        degree: 'Licence en Informatique',
        period: '2019 - 2022',
        description: 'Spécialisation en développement mobile'
      }
    ],
    applications: ['3']
  }
];

// Function to delete all documents in a collection
async function deleteCollection(collectionName) {
  console.log(`Deleting all documents in collection: ${collectionName}`);
  
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    const deletePromises = [];
    snapshot.forEach(doc => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletePromises);
    console.log(`Deleted ${snapshot.size} documents from ${collectionName} collection.`);
  } catch (error) {
    console.error(`Error deleting collection ${collectionName}:`, error);
  }
}

// Function to add documents to a collection
async function addDocumentsToCollection(collectionName, documents) {
  console.log(`Adding documents to ${collectionName} collection...`);
  
  for (const docData of documents) {
    try {
      // Use the document's id as the document ID, or generate one if not provided
      const docId = docData.id || null;
      let docRef;
      
      if (docId) {
        // Use setDoc to set the document with a specific ID
        docRef = doc(db, collectionName, docId);
        await setDoc(docRef, docData);
      } else {
        // Use addDoc to generate an auto-ID
        docRef = await addDoc(collection(db, collectionName), docData);
      }
      
      console.log(`Added document with ID: ${docId || docRef.id}`);
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
    }
  }
}

// Function to create company recruiters with users array format
async function createCompanyRecruiters() {
  console.log('Creating company recruiter users...');
  
  const users = [
    {
      id: 'orange-recruiter',
      email: 'recruiter@orange.mg',
    password: 'SecurePassword123!',
      name: 'Recruteur Orange Madagascar',
      role: 'recruiter',
      companyName: 'Orange Madagascar',
      createdAt: new Date().toISOString()
    },
    {
      id: 'yas-recruiter',
      email: 'recruiter@yas.mg',
      password: 'SecurePassword123!',
      name: 'Recruteur Yas Madagascar',
      role: 'recruiter',
      companyName: 'Yas Madagascar',
      createdAt: new Date().toISOString()
    },
    {
      id: 'airtel-recruiter',
      email: 'recruiter@airtel.mg',
      password: 'SecurePassword123!',
      name: 'Recruteur Airtel Madagascar',
      role: 'recruiter',
      companyName: 'Airtel Madagascar',
      createdAt: new Date().toISOString()
    },
    {
      id: 'systasia-recruiter',
      email: 'recruiter@systasia.mg',
      password: 'SecurePassword123!',
      name: 'Recruteur SystAsia Madagascar',
      role: 'recruiter',
      companyName: 'SystAsia Madagascar',
      createdAt: new Date().toISOString()
    },
    {
      id: 'microlink-recruiter',
      email: 'recruiter@microlink.mg',
      password: 'SecurePassword123!',
      name: 'Recruteur Microlink Madagascar',
      role: 'recruiter',
      companyName: 'Microlink Madagascar',
      createdAt: new Date().toISOString()
    }
  ];

  for (const userData of users) {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const userId = userCredential.user.uid;
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userId), {
        id: userId,
        email: userData.email,
        prenom: userData.name.split(' ')[0],
        nom: userData.name.split(' ').slice(1).join(' '),
        role: userData.role,
        companyName: userData.companyName, // Associate user with company
        createdAt: userData.createdAt,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Created recruiter user for ${userData.companyName} with email: ${userData.email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`Recruiter user for ${userData.name} already exists. Skipping creation.`);
      } else {
        console.error(`Error setting up recruiter for ${userData.name}:`, error.message);
      }
    }
  }
}

// Function to create student users from the candidates using users array format
async function createStudentUsersFromCandidates() {
  console.log('Creating student users from candidates...');
  
  const defaultPassword = 'SecurePassword123!';
  
  for (const candidate of mockCandidates) {
    try {
      // Create user account using the candidate's email
      const userCredential = await createUserWithEmailAndPassword(auth, candidate.email, defaultPassword);
      const userId = userCredential.user.uid;
      
      // Create full student profile from the candidate data
      const [prenom, ...nomParts] = candidate.name.split(' ');
      const nom = nomParts.join(' ');
      
      await setDoc(doc(db, 'users', userId), {
        id: userId,
        email: candidate.email,
        prenom,
        nom,
        role: 'student',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        personalInfo: {
          name: candidate.name,
          title: candidate.title,
          description: `Étudiant passionné par le développement ${candidate.title.toLowerCase()}.`,
          email: candidate.email,
          phone: candidate.phone || '+261 34 123 4567',
          location: candidate.location,
          coordinates: [-18.9137, 47.5361], // Default coordinates for Antananarivo
          linkedin: `https://linkedin.com/in/${prenom.toLowerCase()}-${nom?.toLowerCase() || ''}`,
          github: `https://github.com/${prenom.toLowerCase()}`,
          website: `https://${prenom.toLowerCase()}.portfolio.com`,
          availability: candidate.availability || 'Immédiatement',
          remoteWork: true,
          profileImage: 'https://via.placeholder.com/150'
        },
        technicalSkills: [
          {
            title: 'Compétences techniques',
            skills: candidate.skills.map(skill => ({ 
              name: skill, 
              level: 'Avancé' // Default level for now
            }))
          }
        ],
        languages: [
          { name: 'Français', level: 'Courant' },
          { name: 'Anglais', level: 'Intermédiaire' },
          { name: 'Malgache', level: 'Natif' }
        ],
        softSkills: [
          'Travail en équipe',
          'Communication',
          'Gestion de projet',
          'Résolution de problèmes',
          'Créativité'
        ],
        projects: [
          {
            title: 'Projet de fin d\'étude',
            description: 'Projet académique démontrant les compétences techniques.',
            link: `https://github.com/${prenom.toLowerCase()}/projet-fin-etude`
          }
        ],
        experiences: candidate.experiences || [
          {
            title: candidate.title,
            company: 'Société en cours',
            location: 'Antananarivo',
            period: 'En cours',
            type: 'Stage',
            description: `Expérience en ${candidate.title.toLowerCase()}.`,
            technologies: ['']
          }
        ],
        formations: candidate.education || [
          {
            id: `form-${userId}`,
            institution: 'Université d\'Antananarivo',
            degree: 'Licence en Informatique',
            fieldOfStudy: 'Informatique',
            period: '2020 - 2024',
            description: 'Spécialisation en développement logiciel'
          }
        ],
        appointments: [] // Empty appointments array initially
      });
      
      console.log(`Created student user for ${candidate.name} with email: ${candidate.email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`Student user for ${candidate.name} already exists. Skipping creation.`);
      } else {
        console.error(`Error setting up student for ${candidate.name}:`, error.message);
      }
    }
  }
}

// Main function to initialize Firestore with cleanup
async function initializeFirestoreWithCleanup() {
  console.log('Starting Firestore database reset and initialization...');
  
  try {
    // Delete existing data
    console.log('Deleting existing data...');
    await deleteCollection('companies');
    await deleteCollection('offers');
    await deleteCollection('candidates');
    await deleteCollection('users');
    await deleteCollection('applications');
    await deleteCollection('ai_recommendations');
    await deleteCollection('notifications');
    
    console.log('All existing data deleted. Adding new data...');
    
    // Add companies
    await addDocumentsToCollection('companies', mockCompanies);
    
    // Add offers
    await addDocumentsToCollection('offers', mockOffers);
    
    // Add candidates
    await addDocumentsToCollection('candidates', mockCandidates);
    
    // Add company recruiters
    await createCompanyRecruiters();
    
    // Add student users from candidates
    await createStudentUsersFromCandidates();
    
    console.log('Firestore database initialized successfully with fresh data!');
  } catch (error) {
    console.error('Error during Firestore initialization:', error);
  }
}

// Function to only initialize without cleanup
async function initializeFirestoreOnly() {
  console.log('Initializing Firestore database without cleaning up...');
  
  try {
    // Add companies
    await addDocumentsToCollection('companies', mockCompanies);
    
    // Add offers
    await addDocumentsToCollection('offers', mockOffers);
    
    // Add candidates
    await addDocumentsToCollection('candidates', mockCandidates);
    
    // Add company recruiters
    await createCompanyRecruiters();
    
    // Add student users from candidates
    await createStudentUsersFromCandidates();
    
    console.log('Firestore database initialized successfully!');
  } catch (error) {
    console.error('Error during Firestore initialization:', error);
  }
}

// Check command line arguments to determine execution mode
const args = process.argv.slice(2);
const mode = args[0];

if (mode === '--reset' || mode === '-r') {
  console.log('Reset mode: Deleting all existing data before initialization');
  initializeFirestoreWithCleanup();
} else if (mode === '--init' || mode === '-i') {
  console.log('Init mode: Adding data without deleting existing data');
  initializeFirestoreOnly();
} else {
  console.log('Default mode: Deleting all existing data before initialization');
  console.log('Usage: node init_firestore.mjs [option]');
  console.log('Options:');
  console.log('  --reset, -r   : Delete all existing data and initialize with fresh data (default)');
  console.log('  --init, -i    : Add data without deleting existing data');
  initializeFirestoreWithCleanup();
}