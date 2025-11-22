import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs, query, where } from 'firebase/firestore';
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

// Fonction pour trouver l'ID d'un recruteur par nom d'entreprise
async function getRecruiterIdByCompanyName(companyName) {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('company.name', '==', companyName));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.id;
    } else {
      console.log(`❌ Recruteur pour ${companyName} non trouvé`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la recherche du recruteur pour ${companyName}:`, error);
    return null;
  }
}

// Nouvelles offres de stage à ajouter
const newOffers = [
  {
    id: 'offer-9',
    title: 'Développeur Front-End & UI Designer Junior',
    companyName: 'Yas Madagascar',
    recruiterId: null,
    location: 'Antananarivo, Madagascar',
    coordinates: [47.52566623322738, -18.909228523929638],
    salary: 'Gratification de stage',
    type: 'Stage',
    status: 'active',
    description: `## À propos du poste

Stage de 6 mois en tant que Développeur Front-End & UI Designer Junior pour participer à la conception et au développement d'interfaces web modernes et innovantes.

## Missions principales

- Développement d'interfaces utilisateur avec React et TypeScript
- Création de maquettes et prototypes UI/UX avec Figma
- Intégration de designs responsives et accessibles (WCAG)
- Collaboration étroite avec l'équipe produit et les designers
- Participation aux sprints agiles et cérémonies Scrum
- Maintenance et amélioration continue des composants UI

## Ce que vous apprendrez

- Développement frontend moderne avec React et TypeScript
- Design UI/UX et méthodologie de conception centrée utilisateur
- Création de design systems et bibliothèques de composants
- Méthodologies agiles (Scrum) et travail collaboratif
- Bonnes pratiques de développement (Clean Code, Git Flow)
- Tests unitaires et optimisation des performances`,
    requirements: [
      'Étudiant en informatique, design graphique ou multimédia (Bac+2/3)',
      'Solides bases en développement web (HTML5, CSS3, JavaScript)',
      'Sensibilité pour le design d\'interface et l\'expérience utilisateur',
      'Maîtrise d\'au moins un outil de design (Figma, Adobe XD)',
      'Créativité, rigueur et esprit d\'équipe'
    ],
    niceToHave: [
      'Expérience avec React, Vue.js ou Angular',
      'Connaissance de Tailwind CSS ou styled-components',
      'Portfolio de projets personnels ou académiques en ligne',
      'Compte GitHub actif avec contributions',
      'Notions d\'accessibilité web (ARIA, WCAG)',
      'Connaissance de Framer Motion ou animations CSS'
    ],
    technologies: ['React', 'TypeScript', 'CSS3', 'HTML5', 'Figma', 'Tailwind CSS', 'Git', 'UI/UX Design', 'Responsive Design'],
    benefits: [
      'Gratification mensuelle attractive',
      'Formation continue et mentorat personnalisé',
      'Forte possibilité d\'embauche en CDI',
      'Environnement créatif et bienveillant',
      'Équipement de travail fourni (MacBook/PC performant)',
      'Participation aux conférences et meetups tech',
      'Projets variés et stimulants'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'offer-10',
    title: 'Administrateur Systèmes et Réseaux Junior',
    companyName: 'Orange Madagascar',
    recruiterId: null,
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5229909, -18.8842199],
    salary: 'Gratification de stage',
    type: 'Stage',
    status: 'active',
    description: `## À propos du poste

Stage de 5 mois en tant qu'Administrateur Systèmes et Réseaux Junior pour acquérir des compétences techniques dans un environnement de télécommunications professionnel.

## Missions principales

- Administration des équipements réseau et infrastructures
- Configuration de routeurs, switches et pare-feux
- Gestion et administration de bases de données opérationnelles
- Monitoring et optimisation des performances réseau
- Support technique de niveau 2 aux équipes métier
- Documentation des procédures et interventions

## Compétences développées

- Technologies réseau (TCP/IP, VLAN, routage, sécurité)
- Administration de bases de données (SQL, NoSQL)
- Outils de supervision et monitoring réseau
- Bonnes pratiques de sécurité informatique
- Gestion d'incidents et résolution de problèmes`,
    requirements: [
      'Étudiant en informatique, réseaux ou télécommunications (Bac+2/3)',
      'Solides connaissances des concepts réseaux (modèle OSI, TCP/IP)',
      'Compétences en administration système Linux/Windows',
      'Maîtrise des bases de données relationnelles',
      'Rigueur, sens de l\'analyse et esprit d\'équipe'
    ],
    niceToHave: [
      'Certifications réseau (CCNA, CompTIA Network+)',
      'Expérience avec équipements Cisco ou Juniper',
      'Connaissance de MySQL, PostgreSQL ou MongoDB',
      'Expérience en scripting (Bash, Python)',
      'Lab personnel ou projets de simulation réseau'
    ],
    technologies: ['TCP/IP', 'Cisco', 'MySQL', 'PostgreSQL', 'MongoDB', 'Linux', 'Windows Server', 'Firewall', 'Python'],
    benefits: [
      'Gratification attractive',
      'Environnement professionnel de télécommunications',
      'Possibilité de certifications professionnelles',
      'Perspectives d\'embauche en CDI',
      'Matériel technique et accès aux infrastructures',
      'Formation par des experts réseaux'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  }
];

// Fonction pour ajouter les offres
async function addNewOffers() {
  console.log('\n🚀 AJOUT DES NOUVELLES OFFRES DE STAGE\n');
  console.log('=' .repeat(60));

  try {
    // Trouver les IDs des recruteurs
    console.log('\n🔍 Recherche des recruteurs...');
    const orangeRecruiterId = await getRecruiterIdByCompanyName('Orange Madagascar');
    const yasRecruiterId = await getRecruiterIdByCompanyName('Yas Madagascar');

    if (!orangeRecruiterId || !yasRecruiterId) {
      console.log('❌ Impossible de trouver les recruteurs nécessaires. Arrêt du script.');
      return;
    }

    // Mettre à jour les IDs des recruteurs dans les offres
    newOffers[0].recruiterId = yasRecruiterId;  // Stage Web et Design chez Yas
    newOffers[1].recruiterId = orangeRecruiterId;  // Stage Réseau et Base de Données chez Orange

    console.log(`✅ Recruteur Orange trouvé: ${orangeRecruiterId}`);
    console.log(`✅ Recruteur Yas trouvé: ${yasRecruiterId}`);

    // Créer les offres dans Firestore
    console.log('\n💼 Création des nouvelles offres...');
    const batch = writeBatch(db);
    let count = 0;

    for (const offer of newOffers) {
      try {
        const offerData = {
          ...offer,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const offerRef = doc(db, 'offers', offer.id);
        batch.set(offerRef, offerData);
        count++;

        console.log(`   ✅ ${offer.title} - ${offer.companyName}`);
      } catch (error) {
        console.error(`   ❌ Erreur pour ${offer.title}:`, error.message);
      }
    }

    await batch.commit();
    console.log(`\n📊 ${count} offres de stage ajoutées avec succès!`);

    // Mettre à jour les statistiques du recruteur
    console.log('\n📈 Mise à jour des statistiques des recruteurs...');
    
    // Mise à jour pour Orange Madagascar
    const orangeUserRef = doc(db, 'users', orangeRecruiterId);
    const orangeUserDoc = await getDocs(query(collection(db, 'users'), where('company.name', '==', 'Orange Madagascar')));
    if (!orangeUserDoc.empty) {
      const userData = orangeUserDoc.docs[0].data();
      const currentTotalOffers = userData.stats?.totalOffers || 0;
      const currentActiveOffers = userData.stats?.activeOffers || 0;
      
      await writeBatch(db).set(orangeUserRef, {
        ...userData,
        stats: {
          ...userData.stats,
          totalOffers: currentTotalOffers + 1,
          activeOffers: currentActiveOffers + 1
        },
        updatedAt: new Date().toISOString()
      });
      console.log(`   ✅ Stats Orange mises à jour`);
    }
    
    // Mise à jour pour Yas Madagascar
    const yasUserRef = doc(db, 'users', yasRecruiterId);
    const yasUserDoc = await getDocs(query(collection(db, 'users'), where('company.name', '==', 'Yas Madagascar')));
    if (!yasUserDoc.empty) {
      const userData = yasUserDoc.docs[0].data();
      const currentTotalOffers = userData.stats?.totalOffers || 0;
      const currentActiveOffers = userData.stats?.activeOffers || 0;
      
      await writeBatch(db).set(yasUserRef, {
        ...userData,
        stats: {
          ...userData.stats,
          totalOffers: currentTotalOffers + 1,
          activeOffers: currentActiveOffers + 1
        },
        updatedAt: new Date().toISOString()
      });
      console.log(`   ✅ Stats Yas mises à jour`);
    }

    // Résumé
    console.log('\n' + '='.repeat(60));
    console.log('✅ AJOUT DES OFFRES DE STAGE TERMINÉ AVEC SUCCÈS !');
    console.log('='.repeat(60));
    console.log('\n📊 Résumé:');
    console.log(`   🎓 Stage Web et Design - Yas Madagascar`);
    console.log(`   🖥️ Stage Réseau et Base de Données - Orange Madagascar`);
    console.log('\n💡 Les offres ont été ajoutées à la collection "offers" dans Firestore.');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécution
addNewOffers();