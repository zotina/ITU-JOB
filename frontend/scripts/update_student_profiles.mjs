import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
const auth = getAuth(app);

// Updated student profiles for 3rd year students (minimal experience)
const updatedStudentProfiles = {
  'fanantenana@itu.ac.mg': {
    email: 'fanantenana@itu.ac.mg',
    prenom: 'Fanantenana',
    nom: 'Rakotoarisoa',
    
    personalInfo: {
      title: 'Étudiant en informatique - 3ème année',
      description: 'Je suis passionné par l\'intelligence artificielle et l\'analyse de données. Je cherche à approfondir mes connaissances dans le domaine de l\'informatique.',
      phone: '+261 34 123 4567',
      location: 'Antananarivo, Madagascar',
      coordinates: [-18.9137, 47.5361],
      linkedin: '',
      github: '',
      website: '',
      availability: 'Disponible à partir de septembre',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Langages de programmation',
        skills: [
          { name: 'Python', level: 'Intermédiaire', years: 1 },
          { name: 'JavaScript', level: 'Débutant', years: 0.5 }
        ]
      },
      {
        category: 'Technologies Web',
        skills: [
          { name: 'HTML', level: 'Intermédiaire', years: 1 },
          { name: 'CSS', level: 'Intermédiaire', years: 1 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Intermédiaire', certification: null },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Travail en équipe',
      'Communication',
      'Apprentissage rapide'
    ],
    
    experiences: [], // No professional experience as 3rd year
    
    formations: [
      {
        id: 'form-fana-1',
        institution: 'Université d\'Antananarivo',
        degree: 'Licence en Informatique',
        fieldOfStudy: 'Informatique',
        period: '2022 - 2025', // 3rd year student
        description: 'Formation en informatique générale avec introduction à l\'IA et à l\'analyse de données',
        grade: 'Bonne',
        achievements: [
          'Projet académique en intelligence artificielle',
          'Meilleur étudiant du module Python'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-fana-1',
        title: 'Application de gestion académique',
        description: 'Développement d\'une application de gestion pour les universités',
        link: '',
        technologies: ['Python', 'Flask', 'SQL'],
        image: null,
        achievements: [
          'Meilleur projet académique de la promotion'
        ]
      }
    ],
    
    certifications: [], // No certifications yet as 3rd year student
    
    stats: {
      totalApplications: 0,
      pendingApplications: 0,
      acceptedApplications: 0,
      profileViews: 0
    }
  },
  'raviro@itu.ac.mg': {
    email: 'raviro@itu.ac.mg',
    prenom: 'Raviro',
    nom: 'Andriamalala',
    
    personalInfo: {
      title: 'Étudiant en développement web - 3ème année',
      description: 'Développeur passionné par les technologies web modernes. J\'aime créer des applications simples et efficaces.',
      phone: '+261 34 987 6543',
      location: 'Antananarivo, Madagascar',
      coordinates: [-18.9137, 47.5361],
      linkedin: '',
      github: '',
      website: '',
      availability: 'Disponible à partir de septembre',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Langages de programmation',
        skills: [
          { name: 'JavaScript', level: 'Intermédiaire', years: 1 },
          { name: 'Python', level: 'Débutant', years: 0.5 }
        ]
      },
      {
        category: 'Technologies Web',
        skills: [
          { name: 'HTML', level: 'Avancé', years: 1.5 },
          { name: 'CSS', level: 'Avancé', years: 1.5 },
          { name: 'React', level: 'Débutant', years: 0.5 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Intermédiaire', certification: null },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Créativité',
      'Autonomie',
      'Gestion du temps'
    ],
    
    experiences: [], // No professional experience as 3rd year
    
    formations: [
      {
        id: 'form-raviro-1',
        institution: 'ESIM - SUPETRI Madagascar',
        degree: 'Licence en Informatique',
        fieldOfStudy: 'Génie Logiciel',
        period: '2022 - 2025', // 3rd year student
        description: 'Formation en développement logiciel et génie logiciel',
        grade: 'Bonne',
        achievements: [
          'Meilleur projet de développement web'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-raviro-1',
        title: 'Site web de portfolio',
        description: 'Portfolio personnel développé avec React',
        link: 'https://github.com/raviro/portfolio',
        technologies: ['React', 'JavaScript', 'CSS'],
        image: null,
        achievements: [
          'Portfolio mis en ligne',
          'Utilisation de frameworks modernes'
        ]
      }
    ],
    
    certifications: [], // No certifications yet as 3rd year student
    
    stats: {
      totalApplications: 0,
      pendingApplications: 0,
      acceptedApplications: 0,
      profileViews: 0
    }
  },
  'hasina@itu.ac.mg': {
    email: 'hasina@itu.ac.mg',
    prenom: 'Hasina',
    nom: 'Razafindramary',
    
    personalInfo: {
      title: 'Étudiant en développement mobile - 3ème année',
      description: 'Spécialisé en développement mobile. Passionné par la création d\'expériences utilisateur simples et efficaces.',
      phone: '+261 32 123 4567',
      location: 'Antananarivo, Madagascar',
      coordinates: [-18.9137, 47.5361],
      linkedin: '',
      github: '',
      website: '',
      availability: 'Disponible à partir de septembre',
      remoteWork: true,
      profileImage: 'https://via.placeholder.com/150'
    },
    
    technicalSkills: [
      {
        category: 'Langages de programmation',
        skills: [
          { name: 'JavaScript', level: 'Intermédiaire', years: 1 },
          { name: 'Java', level: 'Débutant', years: 0.5 }
        ]
      },
      {
        category: 'Technologies Mobiles',
        skills: [
          { name: 'React Native', level: 'Débutant', years: 0.5 },
          { name: 'Flutter', level: 'Débutant', years: 0.5 }
        ]
      }
    ],
    
    languages: [
      { name: 'Français', level: 'Courant', certification: null },
      { name: 'Anglais', level: 'Intermédiaire', certification: null },
      { name: 'Malgache', level: 'Natif', certification: null }
    ],
    
    softSkills: [
      'Innovation',
      'Communication',
      'Apprentissage rapide'
    ],
    
    experiences: [], // No professional experience as 3rd year
    
    formations: [
      {
        id: 'form-hasina-1',
        institution: 'Université de Toamasina',
        degree: 'Licence en Informatique',
        fieldOfStudy: 'Systèmes et Réseaux',
        period: '2022 - 2025', // 3rd year student
        description: 'Formation en informatique avec spécialisation en développement mobile',
        grade: 'Bonne',
        achievements: [
          'Meilleur projet mobile de la promotion'
        ]
      }
    ],
    
    projects: [
      {
        id: 'proj-hasina-1',
        title: 'Application de tâches simples',
        description: 'Application mobile de gestion de tâches personnelles',
        link: 'https://github.com/hasina/todo-app',
        technologies: ['React Native', 'JavaScript'],
        image: null,
        achievements: [
          'Application fonctionnelle',
          'Interface utilisateur intuitive'
        ]
      }
    ],
    
    certifications: [], // No certifications yet as 3rd year student
    
    stats: {
      totalApplications: 0,
      pendingApplications: 0,
      acceptedApplications: 0,
      profileViews: 0
    }
  }
};

async function updateStudentProfiles() {
  console.log('\n🎓 MISE À JOUR DES PROFILS ÉTUDIANTS (3ème année)');
  console.log('=================================================');
  
  try {
    console.log('\n🔍 PHASE 1: Recherche des profils étudiants à mettre à jour...');
    
    let updatedCount = 0;
    
    for (const [email, profileData] of Object.entries(updatedStudentProfiles)) {
      console.log(`\n🔄 Mise à jour du profil pour: ${email}`);
      
      try {
        // Query for the user with the specific email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log(`   ❌ Aucun utilisateur trouvé avec l\'email: ${email}`);
          continue;
        }
        
        // Get the user document
        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;
        
        // Update the user document with the new profile data
        const userRef = doc(db, 'users', userId);
        const { password, ...updateData } = profileData; // Exclude password from update
        
        // Add timestamp for the update
        const updatePayload = {
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        
        await updateDoc(userRef, updatePayload);
        
        console.log(`   ✅ Profil mis à jour pour: ${profileData.prenom} ${profileData.nom}`);
        console.log(`      - Expériences: ${profileData.experiences.length} (Aucune)`);
        console.log(`      - Compétences techniques: ${profileData.technicalSkills.reduce((acc, cat) => acc + cat.skills.length, 0)} compétences`);
        console.log(`      - Projets: ${profileData.projects.length} projets`);
        console.log(`      - Certifications: ${profileData.certifications.length} (Aucune)`);
        
        updatedCount++;
      } catch (error) {
        console.error(`   ❌ Erreur pour l'utilisateur ${email}:`, error.message);
      }
    }
    
    console.log('\n✅ MISE À JOUR DES PROFILS TERMINÉE AVEC SUCCÈS !');
    console.log('\n📈 Résumé:');
    console.log(`   - ${updatedCount} profils étudiants mis à jour`);
    console.log('   - Tous les profils sont maintenant adaptés pour des étudiants de 3ème année');
    console.log('   - Expériences professionnelles supprimées');
    console.log('   - Compétences limitées pour refléter le niveau d\'étude');
    console.log('   - Projets académiques uniquement');
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécution
updateStudentProfiles();