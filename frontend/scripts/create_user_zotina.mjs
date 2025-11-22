import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration (identique à init_firestore-nouveau.mjs)
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

// Données de l'utilisateur à créer
const zotinaUser = {
  email: 'zotinafiti@gmail.com',
  password: 'SecurePassword123!',
  prenom: 'Zotina',
  nom: 'Rasetrarinjanahary',
  role: 'student',
  
  // Structure minimale pour un étudiant (similaire aux autres étudiants mais vide)
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
  experiences: [],
  formations: [],
  projects: [],
  certifications: [],
  
  stats: {
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    profileViews: 0
  }
};

async function createZotinaUser() {
  console.log('\n🎓 Création de l\'utilisateur Zotina...');
  
  try {
    // Créer le compte Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      zotinaUser.email, 
      zotinaUser.password
    );
    const userId = userCredential.user.uid;
    
    console.log(`   ✅ Compte authentifié créé: ${zotinaUser.email}`);
    
    // Préparer les données pour Firestore (sans le password)
    const { password, ...firestoreData } = zotinaUser;
    
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
    
    console.log(`   ✅ Utilisateur enregistré dans Firestore: ${zotinaUser.prenom} ${zotinaUser.nom} (ID: ${userId})`);
    console.log(`   💡 Email: ${zotinaUser.email} | Mot de passe: ${zotinaUser.password}`);
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`   ⚠️  L'email ${zotinaUser.email} existe déjà`);
    } else {
      console.error(`   ❌ Erreur lors de la création de l'utilisateur:`, error.message);
    }
  }
}

// Exécution
createZotinaUser();