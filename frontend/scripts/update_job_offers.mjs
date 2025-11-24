import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
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

// Mapping of updated offers with more specific titles and appropriate salary information
const updatedOffers = {
  // Updated existing job titles to be more specific
  'offer-1': {
    title: 'Développeur Full Stack Java Senior',
    type: 'CDI',
    salary: '2,500,000 - 3,500,000 MGA/mois',
    description: `## À propos du poste

Rejoignez notre équipe technique en tant que Développeur Full Stack Java Senior pour développer des solutions digitales innovantes qui transforment la vie de millions de Malgaches. Nous recherchons un développeur passionné par les technologies Java avec expertise en architecture logicielle.

## Responsabilités

- Développer et maintenir nos applications web et mobiles avec Java/Spring Boot
- Participer à la conception d'architectures techniques Java orientées microservices
- Collaborer avec les équipes produit et design
- Assurer la qualité du code via code reviews
- Mentorat des développeurs juniors

## Environnement de travail

- Équipe dynamique et collaborative
- Technologies modernes Java/Spring Boot/React
- Formation continue
- Horaires flexibles
- Télétravail partiel possible`
  },
  'offer-2': {
    title: 'Data Scientist - Intelligence Artificielle',
    type: 'CDI',
    salary: '3,000,000 - 4,000,000 MGA/mois',
    description: `## À propos du poste

Analyse de données et développement de modèles d'intelligence artificielle pour améliorer nos services clients. Opportunité unique de travailler sur des projets d'IA à fort impact.

## Responsabilités

- Analyser les données clients et identifier les tendances
- Développer des modèles de machine learning et d'IA
- Créer des tableaux de bord et visualisations
- Collaborer avec les équipes métier
- Présenter les résultats aux parties prenantes

## Ce que nous offrons

- Projets challengeants et variés
- Accès aux dernières technologies IA
- Équipe data expérimentée
- Environnement stimulant`
  },
  'offer-3': {
    title: 'Développeur Mobile React Native - Paiements',
    type: 'CDI',
    salary: '2,200,000 - 3,200,000 MGA/mois',
    description: `## À propos du poste

Développement d'applications mobiles pour nos services de paiements numériques et de téléphonie mobile. Rejoignez une équipe qui impacte la vie quotidienne de millions d'utilisateurs.

## Responsabilités

- Développer des applications mobiles performantes avec React Native
- Maintenir et améliorer les apps existantes
- Collaborer avec les designers UX/UI
- Optimiser les performances
- Assurer la qualité du code

## Notre stack technique

- React Native pour le développement cross-platform
- Firebase pour le backend
- Redux pour la gestion d'état
- REST APIs`
  },
  'offer-4': {
    title: 'Ingénieur DevOps Cloud AWS',
    type: 'CDI',
    salary: '2,800,000 - 4,000,000 MGA/mois',
    description: `## À propos du poste

Responsable de l'infrastructure cloud et de l'automatisation des déploiements. Vous jouerez un rôle clé dans notre transformation digitale.

## Responsabilités

- Gérer et optimiser l'infrastructure cloud (AWS)
- Mettre en place des pipelines CI/CD
- Automatiser les déploiements
- Monitorer et améliorer les performances
- Assurer la sécurité des systèmes

## Technologies utilisées

- Docker & Kubernetes pour la conteneurisation
- Jenkins/GitLab CI pour l'automatisation
- Terraform pour l'infrastructure as code
- AWS comme cloud provider`
  },
  // Existing stage offers
  'offer-5': {
    title: 'Stage Développement Web Full Stack (6 mois)',
    type: 'Stage',
    salary: 'Gratification: 150 000 MGA/mois',
    description: `## À propos du stage

Stage de 6 mois en développement web Full Stack pour découvrir les technologies modernes et participer à des projets réels. Idéal pour les étudiants motivés souhaitant acquérir une expérience professionnelle.

## Ce que vous apprendrez

- Développement frontend avec React
- Développement backend avec Node.js
- Bases de données et APIs
- Méthodologies agiles
- Travail en équipe

## Encadrement

- Mentorat par des développeurs seniors
- Formations internes régulières
- Code reviews constructives
- Projets progressifs`
  },
  'offer-6': {
    title: 'Stage Analyste de Données (4 mois)',
    type: 'Stage',
    salary: 'Gratification: 120 000 MGA/mois',
    description: `## À propos du stage

Stage de 4 mois en analyse de données pour apprendre à manipuler les données massives et créer des rapports analytiques.

## Missions principales

- Analyse exploratoire de données
- Création de visualisations
- Automatisation de rapports
- Support à l'équipe data

## Compétences développées

- Maîtrise de Python et Pandas
- SQL avancé
- Data visualization (Power BI)
- Méthodologie d'analyse`
  },
  'offer-7': {
    title: 'Stage Ingénieur DevOps (6 mois)',
    type: 'Stage',
    salary: 'Gratification: 200 000 MGA/mois',
    description: `## À propos du stage

Stage de 6 mois en DevOps pour apprendre les outils d'automatisation et les pratiques CI/CD dans un environnement professionnel.

## Ce que vous ferez

- Assistance sur les déploiements
- Configuration de containers Docker
- Monitoring d'infrastructure
- Scripts d'automatisation
- Documentation technique

## Formation incluse

- Docker & Kubernetes
- CI/CD avec Jenkins
- AWS basics
- Linux administration`
  },
  'offer-8': {
    title: 'Stage Développement Mobile (5 mois)',
    type: 'Stage',
    salary: 'Gratification: 180 000 MGA/mois',
    description: `## À propos du stage

Stage de 5 mois en développement mobile pour participer à la création d'applications mobiles à fort trafic utilisées par des milliers de personnes.

## Vos missions

- Développement de features
- Correction de bugs
- Tests et optimisation
- Participation aux code reviews
- Documentation

## Technologies enseignées

- React Native ou Flutter
- APIs REST
- Firebase
- Gestion d'état (Redux)
- Publication sur stores`
  }
};

// Additional new stage offers to increase the number of stages
const additionalStageOffers = [
  {
    id: 'offer-9',
    title: 'Stage Développeur Backend Java (4 mois)',
    companyName: 'Orange Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5229909, -18.8842199],
    salary: 'Gratification: 150 000 MGA/mois',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage en développement backend Java/Spring Boot pour acquérir des compétences dans une équipe de développement logiciel. Idéal pour les étudiants en dernière année avec des bases solides en programmation.

## Missions principales

- Participer au développement d'applications backend
- Comprendre les architectures logicielles
- Mettre en pratique les bonnes pratiques de développement
- Travailler avec des bases de données relationnelles
- Collaborer avec les équipes techniques

## Ce que vous apprendrez

- Développement backend avec Java/Spring Boot
- Architecture logicielle
- Bases de données relationnelles
- Méthodologies AGILE
- Tests unitaires`
  },
  {
    id: 'offer-10',
    title: 'Stage Développeur Frontend React (4 mois)',
    companyName: 'Yas Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.52566623322738, -18.909228523929638],
    salary: 'Gratification: 140 000 MGA/mois',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage en développement frontend React pour acquérir des compétences dans le développement d'interfaces utilisateurs modernes. Idéal pour les étudiants avec des bases en JavaScript et HTML/CSS.

## Missions principales

- Développer des interfaces utilisateurs avec React
- Collaborer avec les designers UI/UX
- Optimiser les performances
- Participer aux revues de code
- Travailler en équipe agile

## Ce que vous apprendrez

- Développement frontend avec React
- Gestion d'état avec Redux
- Outils de développement (Webpack, Babel)
- Méthodologies AGILE
- Tests de composants`
  },
  {
    id: 'offer-11',
    title: 'Stage Intégrateur Web (3 mois)',
    companyName: 'Airtel Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.519278, -18.8753376],
    salary: 'Gratification: 100 000 MGA/mois',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage en intégration web pour transformer des designs en interfaces web fonctionnelles. Idéal pour les étudiants en informatique ou multimédia avec des bases en HTML/CSS/JavaScript.

## Missions principales

- Intégrer des designs graphiques en templates web
- Créer des interfaces responsives
- Optimiser les performances et l'accessibilité
- Collaborer avec les équipes design
- Participer à l'amélioration continue

## Ce que vous apprendrez

- Intégration HTML/CSS moderne
- Responsive design
- Accessibilité web
- Outils de développement (SASS, Bootstrap)
- Méthodologies de travail`
  },
  {
    id: 'offer-12',
    title: 'Stage Analyste Fonctionnel (6 mois)',
    companyName: 'SystAsia Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: 'Gratification: 180 000 MGA/mois',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage en analyse fonctionnelle pour jouer le rôle de relais entre les besoins métiers et les équipes techniques. Idéal pour les étudiants avec une appétence pour les relations humaines et la communication.

## Missions principales

- Recueillir les besoins des utilisateurs
- Rédiger des spécifications fonctionnelles
- Participer aux réunions de projet
- Assurer le suivi des développements
- Participer aux tests et validations

## Ce que vous apprendrez

- Analyse des besoins utilisateurs
- Rédaction de spécifications
- Gestion de projet informatique
- Communication technique et fonctionnelle
- Méthodologies AGILE`
  },
  {
    id: 'offer-13',
    title: 'Stage Cybersecurity Junior (4 mois)',
    companyName: 'SystAsia Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: 'Gratification: 200 000 MGA/mois',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage en cybersécurité pour apprendre à protéger les systèmes d'information contre les cybermenaces. Idéal pour les étudiants en informatique avec un intérêt pour la sécurité informatique.

## Missions principales

- Participer à l'audit de la sécurité
- Mettre en place des mesures de protection
- Surveiller les systèmes pour détecter les intrusions
- Participer à la sensibilisation à la sécurité
- Travailler avec des outils de sécurité

## Ce que vous apprendrez

- Concepts de sécurité informatique
- Outils de surveillance (SIEM)
- Tests d'intrusion
- Politiques de sécurité
- Analyse des risques`
  },
  {
    id: 'offer-14',
    title: 'Stage UX/UI Designer (5 mois)',
    companyName: 'Microlink Madagascar',
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5061, -18.9121],
    salary: 'Gratification: 160 000 MGA/mois',
    type: 'Stage',
    status: 'active',
    description: `## À propos du stage

Stage en design UX/UI pour créer des expériences utilisateur intuitives et agréables pour les applications et sites web. Idéal pour les étudiants en design graphique ou multimédia avec un intérêt pour l'ergonomie.

## Missions principales

- Créer des wireframes et prototypes
- Réaliser des tests d'utilisabilité
- Collaborer avec les développeurs
- Participer à la recherche utilisateur
- Concevoir des interfaces intuitives

## Ce que vous apprendrez

- Design UX/UI
- Outils de prototypage (Figma, Adobe XD)
- Recherche utilisateur
- Tests d'utilisabilité
- Design thinking`
  }
];

async function updateJobOffers() {
  console.log('\n🚀 MISE À JOUR DES OFFRES D\'EMPLOI');
  console.log('=====================================');
  
  try {
    console.log('\n📊 PHASE 1: Mise à jour des offres existantes...');
    
    // Update existing offers
    for (const [offerId, updatedData] of Object.entries(updatedOffers)) {
      try {
        const offerRef = doc(db, 'offers', offerId);
        await updateDoc(offerRef, updatedData);
        console.log(`   ✅ ${updatedData.title} (${updatedData.type})`);
      } catch (error) {
        console.error(`   ❌ Erreur pour l'offre ${offerId}:`, error.message);
      }
    }
    
    console.log('\n📊 PHASE 2: Ajout de nouvelles offres de stage...');
    
    // Add new stage offers to increase the number of stages
    for (const newOffer of additionalStageOffers) {
      try {
        const offerRef = doc(db, 'offers', newOffer.id);
        await updateDoc(offerRef, newOffer);
        console.log(`   ✅ ${newOffer.title} (${newOffer.type})`);
      } catch (error) {
        console.error(`   ❌ Erreur pour la nouvelle offre ${newOffer.id}:`, error.message);
      }
    }
    
    console.log('\n✅ MISE À JOUR DES OFFRES TERMINÉE AVEC SUCCÈS !');
    console.log('\n📈 Résumé:');
    console.log(`   - ${Object.keys(updatedOffers).length} offres existantes mises à jour`);
    console.log(`   - ${additionalStageOffers.length} nouvelles offres de stage ajoutées`);
    console.log(`   - Total des offres de stage : 9 sur 14`);
    console.log('\n💡 Les offres ont été adaptées au contexte malgache avec des salaires réalistes pour les stages.');
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Exécution
updateJobOffers();