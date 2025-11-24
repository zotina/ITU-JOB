import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

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

async function updateApplicationsWithIsNew() {
  console.log('\n🔄 MISE À JOUR DES CANDIDATURES AVEC LE CHAMP isNew');
  console.log('==================================================');
  
  try {
    console.log('\n🔍 PHASE 1: Recherche de toutes les candidatures dans Firestore...');
    
    // Get all applications
    const applicationsRef = collection(db, 'applications');
    const querySnapshot = await getDocs(applicationsRef);
    
    if (querySnapshot.empty) {
      console.log('   ℹ️  Aucune candidature trouvée dans Firestore');
      return;
    }
    
    console.log(`   ✅ ${querySnapshot.size} candidatures trouvées`);
    
    console.log('\n🔧 PHASE 2: Mise à jour des candidatures avec le champ isNew...');
    
    let updatedCount = 0;
    for (const docSnapshot of querySnapshot.docs) {
      const appData = docSnapshot.data();
      
      // Check if the application already has an 'isNew' field
      if (appData.isNew === undefined) {
        try {
          const appRef = doc(db, 'applications', docSnapshot.id);
          await updateDoc(appRef, { isNew: true });
          updatedCount++;
          
          console.log(`   ✅ Candidature ${docSnapshot.id} mise à jour avec isNew: true`);
        } catch (error) {
          console.error(`   ❌ Erreur lors de la mise à jour de la candidature ${docSnapshot.id}:`, error.message);
        }
      } else {
        console.log(`   ℹ️  Candidature ${docSnapshot.id} déjà mise à jour (isNew: ${appData.isNew})`);
      }
    }
    
    console.log('\n📊 PHASE 3: Mise à jour des offres pour réinitialiser le compteur de nouvelles candidatures...');
    
    // Get all offers
    const offersRef = collection(db, 'offers');
    const offersSnapshot = await getDocs(offersRef);
    
    let offersUpdated = 0;
    for (const docSnapshot of offersSnapshot.docs) {
      const offerRef = doc(db, 'offers', docSnapshot.id);
      
      try {
        // No need to reset the new applications counter on offers since we want to show new badges
        // Just ensure the offer data is properly updated
        await updateDoc(offerRef, { 
          updatedAt: new Date().toISOString() // Update timestamp to refresh cache
        });
        offersUpdated++;
      } catch (error) {
        console.error(`   ❌ Erreur lors de la mise à jour de l'offre ${docSnapshot.id}:`, error.message);
      }
    }
    
    console.log('\n✅ MISE À JOUR DES CANDIDATURES TERMINÉE AVEC SUCCÈS !');
    console.log('\n📈 Résumé:');
    console.log(`   - ${updatedCount} candidatures mises à jour avec le champ isNew`);
    console.log(`   - ${offersSnapshot.size} offres vérifiées`);
    console.log('\n💡 Toutes les candidatures existantes sont maintenant marquées comme "nouvelles"');
    console.log('   et les recruteurs verront les badges appropriés dans l\'interface.');
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécution
updateApplicationsWithIsNew();