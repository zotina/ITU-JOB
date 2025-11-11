import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';

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
    coordinates: [47.52566623322738, -18.909228523929638],
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
    coordinates: [47.519278, -18.8753376],
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
    coordinates: [47.5061, -18.9121],
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
    coordinates: [47.5061, -18.9121],
    offers: 1
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
      console.error(`Error adding document:`, error);
    }
  }
}

// Main function to initialize Firestore
async function initializeFirestore() {
  console.log('Initializing Firestore database...');
  
  try {
    // Add companies
    await addDocumentsToCollection('companies', mockCompanies);
    
    // Add offers
    await addDocumentsToCollection('offers', mockOffers);
    
    // Add candidates
    await addDocumentsToCollection('candidates', mockCandidates);
    
    console.log('Firestore database initialized successfully!');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
  }
}

// Run the initialization
initializeFirestore();