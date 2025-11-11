import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ0Ikd6MqVw5hL4TgzZ3bEZahHKfhkaaw",
  authDomain: "sample-firebase-ai-app-9f955.firebaseapp.com",
  projectId: "sample-firebase-ai-app-9f955",
  storageBucket: "sample-firebase-ai-app-9f955.firebasestorage.app",
  messagingSenderId: "229864401136",
  appId: "1:229864401136:web:5d05e0a280a4bf7a76fa35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to add users with passwords to Firebase Auth
async function addUsersWithAuth() {
  console.log('Adding users with authentication to Firebase...');
  
  const users = [
    {
      id: 'student1',
      email: 'student@example.com',
      password: 'password123',
      name: 'Etudiant Test',
      role: 'student',
      createdAt: new Date().toISOString()
    },
    {
      id: 'recruiter1',
      email: 'recruiter@example.com',
      password: 'password123',
      name: 'Recruteur Test',
      role: 'recruiter',
      createdAt: new Date().toISOString()
    }
  ];

  for (const userData of users) {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const userId = userCredential.user.uid;
      
      // Create user profile in Firestore
      const userProfile = {
        id: userId,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: userData.createdAt
      };
      
      await setDoc(doc(db, 'users', userId), userProfile);
      console.log(`Added user with email: ${userData.email} and role: ${userData.role}`);
    } catch (error) {
      console.error(`Error adding user ${userData.email}:`, error);
    }
  }
}

// Main function
async function initializeUsers() {
  console.log('Initializing users in Firebase Auth and Firestore...');
  
  try {
    await addUsersWithAuth();
    console.log('Users initialized successfully!');
  } catch (error) {
    console.error('Error initializing users:', error);
  }
}

// Run the initialization
initializeUsers();