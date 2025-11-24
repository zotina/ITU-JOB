import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc } from 'firebase/firestore';

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

// Function to update all applications status to pending
async function updateAllApplicationsStatusToPending() {
  console.log('\n🔧 MISE À JOUR DE TOUTES LES CANDIDATURES À "EN ATTENTE"...\n');
  
  try {
    // Get all applications
    const applicationsSnapshot = await getDocs(collection(db, 'applications'));
    
    let updatedCount = 0;
    let unchangedCount = 0;
    
    for (const appDoc of applicationsSnapshot.docs) {
      const appData = appDoc.data();
      
      // Check if status is already pending
      if (appData.status === 'pending') {
        unchangedCount++;
        continue; // Skip if already pending
      }
      
      // Update the status to pending
      await updateDoc(appDoc.ref, {
        status: 'pending'
      });
      
      console.log(`   ✅ Updated application ${appDoc.id}: ${appData.status || 'undefined'} → pending`);
      updatedCount++;
    }
    
    console.log(`\n✅ ${updatedCount} applications mises à jour avec le statut 'pending'.`);
    console.log(`📊 ${unchangedCount} applications avaient déjà le statut 'pending' et n'ont pas été modifiées.`);
    
  } catch (error) {
    console.error('❌ Error updating application statuses:', error);
  }
}

// Execute the update
updateAllApplicationsStatusToPending();