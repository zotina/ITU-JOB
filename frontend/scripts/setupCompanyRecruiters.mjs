// scripts/setupCompanyRecruiters.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, doc, query, where, getDocs, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration - use the same as in your config/firebase.ts
const firebaseConfig = {
  // You'll need to add your actual Firebase config here
  // This is just a placeholder - replace with your actual config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Company data
const companies = [
  {
    id: '1',
    name: 'Orange Madagascar',
    email: 'recruiter@orange.mg',
    password: 'SecurePassword123!',
    role: 'recruiter'
  },
  {
    id: '2',
    name: 'Yas Madagascar',
    email: 'recruiter@yas.mg',
    password: 'SecurePassword123!',
    role: 'recruiter'
  },
  {
    id: '3',
    name: 'Airtel Madagascar',
    email: 'recruiter@airtel.mg',
    password: 'SecurePassword123!',
    role: 'recruiter'
  },
  {
    id: '4',
    name: 'SystAsia Madagascar',
    email: 'recruiter@systasia.mg',
    password: 'SecurePassword123!',
    role: 'recruiter'
  },
  {
    id: '5',
    name: 'Microlink Madagascar',
    email: 'recruiter@microlink.mg',
    password: 'SecurePassword123!',
    role: 'recruiter'
  }
];

async function setupCompanyRecruiters() {
  console.log('Setting up company recruiter users...');
  
  for (const company of companies) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, company.email, company.password);
      const userId = userCredential.user.uid;
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userId), {
        id: userId,
        email: company.email,
        prenom: 'Recruiter',
        nom: company.name,
        role: 'recruiter',
        companyName: company.name, // Associate user with company
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`Created recruiter user for ${company.name} with email: ${company.email}`);
    } catch (error) {
      console.error(`Error setting up recruiter for ${company.name}:`, error.message);
    }
  }
  
  console.log('Company recruiter setup completed!');
}

// Run the setup
setupCompanyRecruiters().catch(console.error);