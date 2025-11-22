import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, deleteUser } from 'firebase/auth';
import { getAuth as adminAuth, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getApps } from 'firebase-admin/app';

// Configuration Firebase
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

// Pour supprimer les utilisateurs authentifiés, nous avons besoin de l'admin SDK
// Cependant, l'admin SDK n'est pas disponible dans l'environnement client
// Donc, cette approche ne fonctionnera que si vous avez un backend approprié

async function deleteAuthUsers() {
  console.log('\n🗑️ Suppression des utilisateurs authentifiés...');
  
  // Cette fonction ne peut pas être exécutée dans un environnement client
  // car elle nécessite les droits admin
  console.log('⚠️ Cette opération nécessite les droits Firebase Admin (backend).');
  console.log('ℹ️ Vous devez utiliser Firebase Functions ou un backend avec les droits admin pour effectuer cette opération.');
}

// Fonction alternative pour supprimer uniquement les documents Firestore
async function deleteFirestoreUsers() {
  console.log('\n🗑️ Suppression des utilisateurs dans Firestore...');
  
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    if (usersSnapshot.empty) {
      console.log('   ℹ️ Collection users déjà vide');
      return;
    }
    
    let deletedCount = 0;
    for (const userDoc of usersSnapshot.docs) {
      await deleteDoc(userDoc.ref);
      deletedCount++;
    }
    
    console.log(`   ✅ ${deletedCount} documents utilisateurs supprimés de Firestore`);
  } catch (error) {
    console.error('   ❌ Erreur lors de la suppression des documents Firestore:', error.message);
  }
}

// Fonction pour supprimer tous les documents des collections liées
async function deleteAllCollections() {
  console.log('\n🗑️ Suppression des autres collections...');
  
  const collections = ['offers', 'applications', 'notifications', 'ai_recommendations'];
  
  for (const collectionName of collections) {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`   ℹ️ Collection ${collectionName} déjà vide`);
        continue;
      }
      
      let deletedCount = 0;
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
        deletedCount++;
      }
      
      console.log(`   ✅ ${deletedCount} documents supprimés de ${collectionName}`);
    } catch (error) {
      console.error(`   ❌ Erreur lors de la suppression de ${collectionName}:`, error.message);
    }
  }
}

// Fonction principale
async function deleteAllUsersAndData() {
  console.log('\n🚀 SUPPRESSION DE TOUS LES UTILISATEURS ET DONNÉES\n');
  console.log('=' .repeat(60));
  
  try {
    await deleteFirestoreUsers();
    await deleteAllCollections();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SUPPRESSION DES DONNÉES FIRESTORE TERMINÉE !');
    console.log('='.repeat(60));
    
    await deleteAuthUsers(); // Cette fonction ne fonctionnera pas dans le client
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécution
deleteAllUsersAndData();