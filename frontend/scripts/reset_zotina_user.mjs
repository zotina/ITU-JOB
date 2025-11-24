import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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

// The target user data
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
      institution: 'Université XXX',
      degree: 'Licence en Informatique',
      fieldOfStudy: 'Informatique',
      period: '2022 - 2025', // 3rd year student
      description: 'Formation en informatique générale',
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

async function resetZotinaUser() {
  console.log('\n🎓 RÉINITIALISATION DE L\'UTILISATEUR ZOTINA');
  console.log('==========================================');
  
  try {
    console.log('\n🔍 PHASE 1: Recherche de l\'utilisateur Zotina...');
    
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
    
    console.log('\n🔧 PHASE 2: Mise à jour des données de l\'utilisateur...');
    
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
    
    console.log('\n✅ RÉINITIALISATION TERMINÉE AVEC SUCCÈS !');
    console.log('\n💡 Le profil de Zotina est maintenant prêt pour l\'import de CV.');
    console.log('   - Aucune expérience professionnelle');
    console.log('   - Aucune compétence technique enregistrée');
    console.log('   - Profil minimum pour permettre l\'import de CV');
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécution
resetZotinaUser();