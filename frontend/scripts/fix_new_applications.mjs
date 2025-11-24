import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where, writeBatch } from 'firebase/firestore';

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

async function fixNewApplications() {
  console.log('\n🔧 FIX DES APPLICATIONS - AJOUT DU CHAMP isNew');
  console.log('===============================================\n');
  
  try {
    // Get all applications
    console.log('🔍 Récupération de toutes les applications...');
    const applicationsSnapshot = await getDocs(collection(db, 'applications'));
    
    if (applicationsSnapshot.empty) {
      console.log('   ℹ️  Aucune application trouvée dans Firestore');
      return;
    }
    
    console.log(`   ✅ ${applicationsSnapshot.size} applications trouvées\n`);
    
    // Create a batch to update applications that don't have the isNew field
    const batch = writeBatch(db);
    let updatedCount = 0;
    
    for (const docSnapshot of applicationsSnapshot.docs) {
      const appData = docSnapshot.data();
      
      // Check if the application has an 'isNew' field
      if (appData.isNew === undefined || appData.isNew === null) {
        // For applications that don't have isNew field, set it based on status
        // If status is pending, consider it as new; otherwise, it's likely already processed
        const isNew = appData.status === 'pending';
        
        const appRef = doc(db, 'applications', docSnapshot.id);
        batch.update(appRef, { isNew: isNew });
        updatedCount++;
        
        console.log(`   ✅ Application ${docSnapshot.id} mise à jour avec isNew: ${isNew}`);
      } else {
        // Log existing state for verification
        console.log(`   ℹ️  Application ${docSnapshot.id} - isNew: ${appData.isNew} (déjà défini)`);
      }
    }
    
    if (updatedCount > 0) {
      console.log(`\n🔄 Validation du batch pour ${updatedCount} applications...`);
      await batch.commit();
      console.log(`   ✅ ${updatedCount} applications mises à jour avec le champ isNew`);
    } else {
      console.log(`   ℹ️  Aucune application n'a besoin d'être mise à jour`);
    }
    
    console.log('\n✅ MISE À JOUR DES APPLICATIONS TERMINÉE AVEC SUCCÈS !');
    console.log('\n💡 Ce script a assuré que toutes les applications ont un champ isNew.');
    console.log('   - Les applications existantes sans champ isNew ont reçu isNew: true/false selon le statut');
    console.log('   - Les applications existantes avec champ isNew n\'ont pas été modifiées');
    console.log('   - Cela permettra de bien distinguer les nouvelles applications non vues.');
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécution
fixNewApplications();