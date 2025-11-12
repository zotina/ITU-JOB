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
      
      // Create user profile in Firestore with full profile data
      let userProfile;
      
      if (userData.role === 'student') {
        // Full student profile structure
        userProfile = {
          id: userId,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: userData.createdAt,
          personalInfo: {
            name: userData.name,
            title: 'Développeur Full Stack',
            description: 'Passionné de développement web et mobile avec 3 ans d\'expérience dans les technologies JavaScript.',
            email: userData.email,
            phone: '+261 34 123 4567',
            location: 'Antananarivo, Madagascar',
            coordinates: [-18.9137, 47.5361],
            linkedin: 'https://linkedin.com/in/etudiant-test',
            github: 'https://github.com/etudiant-test',
            website: 'https://etudiant-test.com',
            availability: 'Immédiatement',
            remoteWork: true,
            profileImage: 'https://via.placeholder.com/150'
          },
          technicalSkills: [
            {
              title: 'Langages de programmation',
              skills: [
                { name: 'JavaScript', level: 'Avancé' },
                { name: 'TypeScript', level: 'Avancé' },
                { name: 'Python', level: 'Intermédiaire' },
                { name: 'Java', level: 'Intermédiaire' }
              ]
            },
            {
              title: 'Frameworks & Librairies',
              skills: [
                { name: 'React', level: 'Avancé' },
                { name: 'Node.js', level: 'Avancé' },
                { name: 'Vue.js', level: 'Intermédiaire' },
                { name: 'Express', level: 'Intermédiaire' }
              ]
            },
            {
              title: 'Technologies & Outils',
              skills: [
                { name: 'Firebase', level: 'Avancé' },
                { name: 'MongoDB', level: 'Intermédiaire' },
                { name: 'PostgreSQL', level: 'Intermédiaire' },
                { name: 'Git', level: 'Avancé' }
              ]
            }
          ],
          languages: [
            { name: 'Français', level: 'Courant' },
            { name: 'Anglais', level: 'Courant' },
            { name: 'Malgache', level: 'Natif' }
          ],
          softSkills: [
            'Travail en équipe',
            'Communication',
            'Gestion de projet',
            'Résolution de problèmes',
            'Créativité'
          ],
          projects: [
            {
              title: 'Plateforme de gestion de recrutement',
              description: 'Développement d\'une plateforme complète de gestion de recrutement avec React et Firebase.',
              link: 'https://github.com/etudiant-test/recruitment-platform'
            },
            {
              title: 'Application mobile de suivi agricole',
              description: 'Application mobile pour suivre les cultures et les rendements agricoles.',
              link: 'https://github.com/etudiant-test/agricultural-tracking'
            }
          ],
          experiences: [
            {
              title: 'Développeur Full Stack',
              company: 'TechStart Madagascar',
              location: 'Antananarivo',
              period: 'Jan 2023 - Présent',
              type: 'CDI',
              description: 'Développement d\'applications web et mobiles pour divers clients.',
              technologies: ['React', 'Node.js', 'Firebase']
            },
            {
              title: 'Stagiaire Développeur',
              company: 'Digital Solutions',
              location: 'Antananarivo',
              period: 'Jui 2022 - Déc 2022',
              type: 'Stage',
              description: 'Participation au développement d\'un système de gestion.',
              technologies: ['Vue.js', 'Express', 'MongoDB']
            }
          ],
          formations: [
            {
              id: 'form1',
              institution: 'Université d\'Antananarivo',
              degree: 'Licence en Informatique',
              fieldOfStudy: 'Développement Web',
              period: '2020 - 2023',
              description: 'Spécialisation en développement full stack et systèmes d\'information'
            },
            {
              id: 'form2',
              institution: 'Lycée Andohalo',
              degree: 'Baccalauréat',
              fieldOfStudy: 'Scientifique',
              period: '2017 - 2020',
              description: 'Option Mathématiques et Sciences Physiques'
            }
          ],
          appointments: [] // Empty appointments array
        };
      } else if (userData.role === 'recruiter') {
        // Full recruiter profile structure
        userProfile = {
          id: userId,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: userData.createdAt,
          company: {
            id: 'techstart-solutions',
            name: 'TechStart Solutions',
            description: 'Startup innovante spécialisée dans le développement d\'applications web modernes et de solutions SaaS pour les entreprises.',
            industry: 'Technologie / Software',
            size: '50-100 employés',
            website: 'https://techstart-solutions.com',
            location: 'Paris, France',
            email: 'contact@techstart-solutions.com',
            phone: '+33 1 23 45 67 89',
            founded: '2019',
            logo: 'https://via.placeholder.com/150'
          },
          recruiter: {
            name: userData.name,
            role: 'Responsable Recrutement',
            email: userData.email,
            phone: '+33 6 12 34 56 78'
          },
          updatedAt: new Date().toISOString()
        };
      } else {
        // Default profile if role is not specified
        userProfile = {
          id: userId,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: userData.createdAt
        };
      }
      
      await setDoc(doc(db, 'users', userId), userProfile);
      console.log(`Added user with email: ${userData.email} and role: ${userData.role}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`User with email ${userData.email} already exists. Skipping creation.`);
        
        // In this case, try to get the existing user and update their profile
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        try {
          // Sign in to get the user ID
          const signInCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
          const userId = signInCredential.user.uid;
          
          // Create the appropriate profile structure
          let userProfile;
          if (userData.role === 'student') {
            userProfile = {
              id: userId,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              createdAt: userData.createdAt,
              personalInfo: {
                name: userData.name,
                title: 'Développeur Full Stack',
                description: 'Passionné de développement web et mobile avec 3 ans d\'expérience dans les technologies JavaScript.',
                email: userData.email,
                phone: '+261 34 123 4567',
                location: 'Antananarivo, Madagascar',
                coordinates: [-18.9137, 47.5361],
                linkedin: 'https://linkedin.com/in/etudiant-test',
                github: 'https://github.com/etudiant-test',
                website: 'https://etudiant-test.com',
                availability: 'Immédiatement',
                remoteWork: true,
                profileImage: 'https://via.placeholder.com/150'
              },
              technicalSkills: [
                {
                  title: 'Langages de programmation',
                  skills: [
                    { name: 'JavaScript', level: 'Avancé' },
                    { name: 'TypeScript', level: 'Avancé' },
                    { name: 'Python', level: 'Intermédiaire' },
                    { name: 'Java', level: 'Intermédiaire' }
                  ]
                },
                {
                  title: 'Frameworks & Librairies',
                  skills: [
                    { name: 'React', level: 'Avancé' },
                    { name: 'Node.js', level: 'Avancé' },
                    { name: 'Vue.js', level: 'Intermédiaire' },
                    { name: 'Express', level: 'Intermédiaire' }
                  ]
                },
                {
                  title: 'Technologies & Outils',
                  skills: [
                    { name: 'Firebase', level: 'Avancé' },
                    { name: 'MongoDB', level: 'Intermédiaire' },
                    { name: 'PostgreSQL', level: 'Intermédiaire' },
                    { name: 'Git', level: 'Avancé' }
                  ]
                }
              ],
              languages: [
                { name: 'Français', level: 'Courant' },
                { name: 'Anglais', level: 'Courant' },
                { name: 'Malgache', level: 'Natif' }
              ],
              softSkills: [
                'Travail en équipe',
                'Communication',
                'Gestion de projet',
                'Résolution de problèmes',
                'Créativité'
              ],
              projects: [
                {
                  title: 'Plateforme de gestion de recrutement',
                  description: 'Développement d\'une plateforme complète de gestion de recrutement avec React et Firebase.',
                  link: 'https://github.com/etudiant-test/recruitment-platform'
                },
                {
                  title: 'Application mobile de suivi agricole',
                  description: 'Application mobile pour suivre les cultures et les rendements agricoles.',
                  link: 'https://github.com/etudiant-test/agricultural-tracking'
                }
              ],
              experiences: [
                {
                  title: 'Développeur Full Stack',
                  company: 'TechStart Madagascar',
                  location: 'Antananarivo',
                  period: 'Jan 2023 - Présent',
                  type: 'CDI',
                  description: 'Développement d\'applications web et mobiles pour divers clients.',
                  technologies: ['React', 'Node.js', 'Firebase']
                },
                {
                  title: 'Stagiaire Développeur',
                  company: 'Digital Solutions',
                  location: 'Antananarivo',
                  period: 'Jui 2022 - Déc 2022',
                  type: 'Stage',
                  description: 'Participation au développement d\'un système de gestion.',
                  technologies: ['Vue.js', 'Express', 'MongoDB']
                }
              ],
              formations: [
                {
                  id: 'form1',
                  institution: 'Université d\'Antananarivo',
                  degree: 'Licence en Informatique',
                  fieldOfStudy: 'Développement Web',
                  period: '2020 - 2023',
                  description: 'Spécialisation en développement full stack et systèmes d\'information'
                },
                {
                  id: 'form2',
                  institution: 'Lycée Andohalo',
                  degree: 'Baccalauréat',
                  fieldOfStudy: 'Scientifique',
                  period: '2017 - 2020',
                  description: 'Option Mathématiques et Sciences Physiques'
                }
              ],
              appointments: [] // Empty appointments array
            };
          } else if (userData.role === 'recruiter') {
            userProfile = {
              id: userId,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              createdAt: userData.createdAt,
              company: {
                id: 'techstart-solutions',
                name: 'TechStart Solutions',
                description: 'Startup innovante spécialisée dans le développement d\'applications web modernes et de solutions SaaS pour les entreprises.',
                industry: 'Technologie / Software',
                size: '50-100 employés',
                website: 'https://techstart-solutions.com',
                location: 'Paris, France',
                email: 'contact@techstart-solutions.com',
                phone: '+33 1 23 45 67 89',
                founded: '2019',
                logo: 'https://via.placeholder.com/150'
              },
              recruiter: {
                name: userData.name,
                role: 'Responsable Recrutement',
                email: userData.email,
                phone: '+33 6 12 34 56 78'
              },
              updatedAt: new Date().toISOString()
            };
          } else {
            userProfile = {
              id: userId,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              createdAt: userData.createdAt
            };
          }
          
          // Update the user profile in Firestore
          await setDoc(doc(db, 'users', userId), userProfile);
          console.log(`Updated profile for existing user with email: ${userData.email}`);
        } catch (signInError) {
          console.error(`Error signing in user ${userData.email}:`, signInError);
        }
      } else {
        console.error(`Error adding user ${userData.email}:`, error);
      }
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