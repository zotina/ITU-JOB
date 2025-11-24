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

// Function to fix application field names
async function fixApplicationFieldNames() {
  console.log('\n🔧 FIXING APPLICATION FIELD NAMES...\n');
  
  try {
    // Get all applications
    const applicationsSnapshot = await getDocs(collection(db, 'applications'));
    
    let updatedCount = 0;
    
    for (const appDoc of applicationsSnapshot.docs) {
      const appData = appDoc.data();
      const updateData = {};
      
      // Change candidateId to studentId
      if (appData.candidateId && !appData.studentId) {
        updateData.studentId = appData.candidateId;
      }
      
      // Change candidateName to studentName
      if (appData.candidateName && !appData.studentName) {
        updateData.studentName = appData.candidateName;
      }
      
      // Add position field if missing but studentName exists (to indicate this is probably one of our generated apps)
      if (!appData.position && appData.offerTitle) {
        updateData.position = appData.offerTitle;
      }
      
      // Add company field if missing
      if (!appData.company && appData.companyName) {
        updateData.company = appData.companyName;
      }
      
      // Add location field if missing
      if (!appData.location) {
        updateData.location = 'Antananarivo, Madagascar'; // Default value
      }
      
      // Add type field if missing
      if (!appData.type) {
        updateData.type = 'CDI'; // Default value
      }
      
      // Add salary field if missing
      if (!appData.salary) {
        updateData.salary = 'Non spécifié';
      }
      
      // Update document if any fields need to be added
      if (Object.keys(updateData).length > 0) {
        await updateDoc(appDoc.ref, updateData);
        console.log(`   ✅ Updated application ${appDoc.id}`, Object.keys(updateData));
        updatedCount++;
      }
    }
    
    console.log(`\n✅ ${updatedCount} applications updated with correct field names.`);
    console.log(`📋 Fields updated: candidateId → studentId, candidateName → studentName, and missing standard fields`);
    
  } catch (error) {
    console.error('❌ Error fixing application field names:', error);
  }
}

// Execute the fix
fixApplicationFieldNames();