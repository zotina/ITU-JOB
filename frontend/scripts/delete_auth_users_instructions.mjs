/**
 * SCRIPT POUR SUPPRIMER TOUS LES UTILISATEURS D'AUTHENTIFICATION FIREBASE
 * 
 * Problème: Lorsque vous supprimez les documents Firestore, les utilisateurs restent
 * dans l'extension d'authentification Firebase, ce qui explique le message d'erreur.
 * 
 * Solutions (à exécuter séparément, dans l'ordre indiqué):
 */

// === MÉTHODE 1: UTILISATION DE LA CONSOLE FIREBASE ===
// 1. Allez sur https://console.firebase.google.com/
// 2. Sélectionnez votre projet
// 3. Allez dans "Authentication" > "Users"
// 4. Sélectionnez tous les utilisateurs (ou supprimez-les un par un)
// 5. Cliquez sur "Delete" pour supprimer les utilisateurs authentifiés

// === MÉTHODE 2: UTILISATION DE FIREBASE CLI ===
/*
# Installez Firebase CLI si ce n'est pas fait
npm install -g firebase-tools

# Connectez-vous à votre compte
firebase login

# Sélectionnez votre projet
firebase use sample-firebase-ai-app-9f955

# Supprimez tous les utilisateurs confirmés (cette commande supprimera TOUS les utilisateurs)
firebase auth:delete-confirmed-users --project=sample-firebase-ai-app-9f955
*/

// === MÉTHODE 3: FONCTION CLOUD (à utiliser avec Firebase Functions) ===
/*
// Dans votre répertoire functions (backend)
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteAllUsers = functions.https.onCall(async (data, context) => {
  // Vérifiez que l'appelant est authentifié et autorisé
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Must be an admin to delete users');
  }
  
  try {
    let pageToken;
    let totalDeleted = 0;
    
    do {
      const result = await admin.auth().listUsers(1000, pageToken);
      const userIds = result.users.map(user => user.uid);
      
      if (userIds.length > 0) {
        const deleteResult = await admin.auth().deleteUsers(userIds);
        totalDeleted += deleteResult.successCount;
        console.log(`Supprimé ${deleteResult.successCount} utilisateurs, ${deleteResult.failureCount} échecs`);
      }
      
      pageToken = result.pageToken;
    } while (pageToken);
    
    return { message: `Suppression terminée: ${totalDeleted} utilisateurs supprimés` };
  } catch (error) {
    console.error('Erreur lors de la suppression des utilisateurs:', error);
    throw new functions.https.HttpsError('internal', 'Erreur de suppression des utilisateurs');
  }
});
*/

// === MÉTHODE 4: SCRIPT NODE.JS AVEC ADMIN SDK (backend) ===
/*
const admin = require('firebase-admin');

// Initialiser l'admin SDK avec votre fichier de service account
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function deleteAllAuthUsers() {
  try {
    let pageToken;
    let totalDeleted = 0;
    
    do {
      const result = await admin.auth().listUsers(1000, pageToken);
      const userIds = result.users.map(user => user.uid);
      
      if (userIds.length > 0) {
        const deleteResult = await admin.auth().deleteUsers(userIds);
        totalDeleted += deleteResult.successCount;
        console.log(`Supprimé ${deleteResult.successCount} utilisateurs, ${deleteResult.failureCount} échecs`);
      }
      
      pageToken = result.pageToken;
    } while (pageToken);
    
    console.log(`Total des utilisateurs supprimés: ${totalDeleted}`);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

deleteAllAuthUsers();
*/

// === RÉSUMÉ DES ÉTAPES À SUIVRE ===
/*
1. SUPPRIMEZ D'ABORD LES DOCUMENTS FIRESTORE (ce que vous faites déjà avec votre script)
2. SUPPRIMEZ LES UTILISATEURS D'AUTENTIFICATION AVEC L'UNE DES MÉTHODES CI-DESSUS
3. RECRÉEZ VOS UTILISATEURS AVEC LE SCRIPT init_firestore-nouveau.mjs

Cela résoudra le problème des utilisateurs fantômes qui empêchent la recréation.
*/