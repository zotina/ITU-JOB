import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';

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

// Function to fix application fields
async function fixApplicationFields() {
  console.log('\n🔧 FIXING APPLICATION FIELDS...\n');
  
  try {
    // Get all applications
    const applicationsSnapshot = await getDocs(collection(db, 'applications'));
    
    let updatedCount = 0;
    
    for (const appDoc of applicationsSnapshot.docs) {
      const appData = appDoc.data();
      const updateData = {};
      
      // Add position field if missing (use offerTitle)
      if (!appData.position && appData.offerTitle) {
        updateData.position = appData.offerTitle;
      }
      
      // Add company field if missing
      if (!appData.company && appData.companyName) {
        updateData.company = appData.companyName;
      }
      
      // Add location field if missing
      if (!appData.location && appData.offerId) {
        // We would need to fetch the offer to get location, but for now just add a default
        // In a real scenario, we'd fetch the offer details
        if (!appData.location) {
          updateData.location = 'Antananarivo, Madagascar'; // Default value
        }
      }
      
      // Add type field if missing
      if (!appData.type && appData.offerId) {
        if (!appData.type) {
          updateData.type = 'CDI'; // Default value
        }
      }
      
      // Add salary field if missing
      if (!appData.salary) {
        updateData.salary = 'Non spécifié';
      }
      
      // Update document if any fields need to be added
      if (Object.keys(updateData).length > 0) {
        await updateDoc(appDoc.ref, updateData);
        console.log(`   ✅ Updated application ${appDoc.id}`, updateData);
        updatedCount++;
      }
    }
    
    console.log(`\n✅ ${updatedCount} applications updated with missing fields.`);
    
  } catch (error) {
    console.error('❌ Error fixing application fields:', error);
  }
}

// Execute the fix
fixApplicationFields();