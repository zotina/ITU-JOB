// NOTE IMPORTANTE:
// Ce script ne fonctionne que dans un environnement Node.js avec Firebase Admin SDK
// Il ne fonctionnera PAS dans le navigateur ou dans un environnement client
// Vous devez l'exécuter dans un backend ou une fonction Firebase

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, deleteUser } from 'firebase/auth';
import { initializeApp as initializeAdminApp, getApps } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZ0Ikd6MqVw5hL4TgzZ3bEZahHKfhkaaw",
  authDomain: "sample-firebase-ai-app-9f955.firebaseapp.com",
  projectId: "sample-firebase-ai-app-9f955",
  storageBucket: "sample-firebase-ai-app-9f955.firebasestorage.app",
  messagingSenderId: "229864401136",
  appId: "1:229864401136:web:5d05e0a280a4bf7a76fa35"
};

// Initialiser l'application
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Pour supprimer les utilisateurs authentifiés, nous avons besoin de l'admin SDK
// Cela ne fonctionnera que si vous avez initialisé l'admin SDK
// Cela nécessite un fichier de service account Firebase Admin

let adminApp;
let adminAuth;

try {
  // Vérifier si l'admin app est déjà initialisée
  if (getApps().length === 0) {
    // Vous devez avoir un fichier de service account pour l'admin SDK
    // Cette initialisation échouera si vous n'avez pas les droits admin appropriés
    adminApp = initializeAdminApp({
      credential: require('./path/to/serviceAccountKey.json'), // Vous devez remplacer par votre fichier de service account
      projectId: firebaseConfig.projectId
    });
  } else {
    adminApp = getApps()[0];
  }
  
  adminAuth = getAdminAuth(adminApp);
} catch (error) {
  console.error('❌ Erreur d\'initialisation de l\'admin SDK:', error.message);
  console.log('ℹ️ Pour supprimer les utilisateurs authentifiés, vous devez suivre l\'une des méthodes suivantes:');
  console.log('   1. Utiliser la console Firebase (https://console.firebase.google.com)');
  console.log('   2. Utiliser Firebase Functions avec les droits admin');
  console.log('   3. Créer un script backend avec le service account Firebase');
  console.log('   4. Utiliser Firebase CLI: firebase auth:export users.json && firebase auth:import users.json --hash-algo=HMAC_SHA256');
}

// Fonction pour supprimer les documents Firestore
async function deleteFirestoreUsers() {
  console.log('\n🗑️ Suppression des documents utilisateurs dans Firestore...');
  
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    if (usersSnapshot.empty) {
      console.log('   ℹ️ Collection users déjà vide');
      return 0;
    }
    
    let deletedCount = 0;
    for (const userDoc of usersSnapshot.docs) {
      await deleteDoc(userDoc.ref);
      deletedCount++;
    }
    
    console.log(`   ✅ ${deletedCount} documents utilisateurs supprimés de Firestore`);
    return deletedCount;
  } catch (error) {
    console.error('   ❌ Erreur lors de la suppression des documents Firestore:', error.message);
    return 0;
  }
}

// Fonction pour supprimer tous les documents des collections liées
async function deleteAllCollections() {
  console.log('\n🗑️ Suppression des autres collections...');
  
  const collections = ['offers', 'applications', 'notifications', 'ai_recommendations'];
  let totalDeleted = 0;
  
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
      
      totalDeleted += deletedCount;
      console.log(`   ✅ ${deletedCount} documents supprimés de ${collectionName}`);
    } catch (error) {
      console.error(`   ❌ Erreur lors de la suppression de ${collectionName}:`, error.message);
    }
  }
  
  return totalDeleted;
}

// Fonction pour supprimer des utilisateurs authentifiés (nécessite admin SDK)
async function deleteAuthUsers() {
  if (!adminAuth) {
    console.log('\n⚠️ Impossible de supprimer les utilisateurs authentifiés sans les droits admin');
    console.log('ℹ️ Veuillez utiliser l\'une des méthodes suivantes:');
    console.log('   - Console Firebase: https://console.firebase.google.com/project/VOTRE_PROJET/authentication/users');
    console.log('   - Firebase CLI: firebase auth:delete-confirmed-users --project=VOTRE_PROJET');
    console.log('   - Une fonction backend avec Firebase Admin SDK');
    return 0;
  }
  
  try {
    console.log('\n🗑️ Récupération et suppression des utilisateurs authentifiés...');
    
    // Récupérer tous les utilisateurs (par lots de 1000 max)
    let pageToken;
    let totalDeleted = 0;
    let allUsers = [];
    
    do {
      const result = await adminAuth.listUsers(1000, pageToken);
      allUsers = allUsers.concat(result.users);
      pageToken = result.pageToken;
    } while (pageToken);
    
    console.log(`   ℹ️ Trouvé ${allUsers.length} utilisateurs authentifiés`);
    
    for (const user of allUsers) {
      await adminAuth.deleteUser(user.uid);
      console.log(`   ✅ Utilisateur supprimé: ${user.email} (UID: ${user.uid})`);
      totalDeleted++;
    }
    
    console.log(`\n   ✅ ${totalDeleted} utilisateurs authentifiés supprimés`);
    return totalDeleted;
  } catch (error) {
    console.error('   ❌ Erreur lors de la suppression des utilisateurs authentifiés:', error.message);
    return 0;
  }
}

// Fonction principale
async function deleteAllFirestoreAndAuthData() {
  console.log('\n🚀 SUPPRESSION DE TOUS LES UTILISATEURS ET DONNÉES\n');
  console.log('=' .repeat(60));
  
  try {
    // Supprimer d'abord les données Firestore
    const firestoreUsersDeleted = await deleteFirestoreUsers();
    const otherCollectionsDeleted = await deleteAllCollections();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SUPPRESSION DES DONNÉES FIRESTORE TERMINÉE !');
    console.log('='.repeat(60));
    console.log(`📊 Résumé Firestore:`);
    console.log(`   📝 Documents utilisateurs supprimés: ${firestoreUsersDeleted}`);
    console.log(`   📝 Autres documents supprimés: ${otherCollectionsDeleted}`);
    
    // Puis supprimer les utilisateurs authentifiés (si possible)
    const authUsersDeleted = await deleteAuthUsers();
    
    console.log('\n📊 Résumé total:');
    console.log(`   📝 Documents Firestore supprimés: ${firestoreUsersDeleted + otherCollectionsDeleted}`);
    console.log(`   👤 Utilisateurs authentifiés supprimés: ${authUsersDeleted}`);
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécution
deleteAllFirestoreAndAuthData();