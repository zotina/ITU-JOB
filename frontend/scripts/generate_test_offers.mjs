import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc, getDocs } from 'firebase/firestore';

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

// Fonction pour récupérer les utilisateurs et trouver les IDs des recruteurs
async function getRecruiterIds() {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const recruiterIds = {};
  
  usersSnapshot.forEach(doc => {
    const userData = doc.data();
    if (userData.role === 'recruiter' && userData.company) {
      recruiterIds[userData.company.name] = doc.id;
    }
  });
  
  return recruiterIds;
}

// Offres de test basées sur le profil de Zo Tina
const testOffers = [
  {
    id: 'test-offer-1',
    title: 'Développeur Java Full Stack Senior',
    companyName: 'Orange Madagascar',  // Dénormalisé depuis users.company.name
    recruiterId: null,  // Sera rempli après création du recruteur
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5229909, -18.8842199],
    salary: '2,500,000 - 3,500,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Chez Orange Madagascar, nous recherchons un Développeur Java Full Stack Senior pour renforcer notre équipe technique dans le développement de solutions digitales innovantes. Vous participerez à la conception et au développement d'applications critiques pour notre infrastructure de télécommunications.

## Responsabilités

- Conception et développement d'applications Java full stack robustes et évolutives
- Conception et gestion d'architectures de systèmes distribués
- Collaboration avec les équipes produit, devops et sécurité
- Optimisation des performances des applications existantes
- Mentorat des développeurs juniors

## Environnement de travail

- Équipe technique expérimentée
- Technologies modernes et architecture avancée
- Formation continue
- Horaires flexibles
- Télétravail possible`,
    requirements: [
      'Minimum 3 ans d\'expérience en développement Java',
      'Maîtrise de Spring Boot et des frameworks Java avancés',
      'Expérience avec PostgreSQL et MySQL',
      'Connaissance des architectures distribuées',
      'Expérience avec Git et CI/CD',
      'Bon niveau en anglais technique'
    ],
    niceToHave: [
      'Expérience avec Docker et conteneurisation',
      'Connaissance des systèmes de télécommunications',
      'Expérience avec des ETL'
    ],
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'MySQL', 'Docker', 'Laravel', 'Vue.js', 'MongoDB', 'Git'],
    benefits: [
      'Assurance santé complémentaire',
      'Formation continue et certifications prises en charge',
      'Équipement de qualité',
      'Télétravail possible',
      'Horaires flexibles'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'test-offer-2',
    title: 'Ingénieur Bases de Données PostgreSQL',
    companyName: 'Orange Madagascar',  // Dénormalisé depuis users.company.name
    recruiterId: null,  // Sera rempli après création du recruteur
    location: 'Antananarivo, Madagascar',
    coordinates: [47.5229909, -18.8842199],
    salary: '2,200,000 - 3,200,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Rejoignez notre équipe de gestion des bases de données chez Orange Madagascar. En tant qu'Ingénieur Bases de Données, vous serez responsable de la conception, de l'implémentation et de l'optimisation de nos systèmes de gestion de données critiques pour nos services de télécommunications.

## Responsabilités

- Conception et optimisation d'architectures de bases de données PostgreSQL
- Administration et maintenance des serveurs PostgreSQL
- Optimisation des performances et des requêtes SQL complexes
- Conception d'architectures de systèmes distribués pour les bases de données
- Mise en place de solutions ETL pour l'analyse de données
- Veille technologique et formation continue

## Environnement de travail

- Environnement technique de pointe
- Projets à fort impact sur des millions d'utilisateurs
- Équipe experte en bases de données
- Technologies modernes`,
    requirements: [
      'Maîtrise avancée de PostgreSQL et MySQL',
      'Expérience en conception d\'architectures de bases de données',
      'Compétences en optimisation des performances',
      'Connaissance des systèmes distribués',
      'Expérience avec des outils ETL',
      'Expérience avec Docker et conteneurisation'
    ],
    niceToHave: [
      'Connaissance d\'Oracle Database',
      'Expérience avec des plateformes cloud (AWS, Azure)',
      'Certifications PostgreSQL'
    ],
    technologies: ['PostgreSQL', 'MySQL', 'Oracle', 'Docker', 'ETL', 'Git', 'Gantt', 'Looping'],
    benefits: [
      'Package salarial compétitif',
      'Formation technique continue',
      'Accès aux dernières technologies',
      'Projets innovants',
      'Horaires flexibles'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'test-offer-3',
    title: 'Développeur Backend PHP Laravel',
    companyName: 'Yas Madagascar',  // Dénormalisé depuis users.company.name
    recruiterId: null,  // Sera rempli après création du recruteur
    location: 'Antananarivo, Madagascar',
    coordinates: [47.52566623322738, -18.909228523929638],
    salary: '1,800,000 - 2,800,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Chez Yas Madagascar, nous recherchons un Développeur Backend expérimenté en PHP Laravel pour participer au développement de nos plateformes de télécommunications et services numériques.

## Responsabilités

- Développement d'APIs robustes avec PHP Laravel
- Intégration avec les systèmes de télécommunications existants
- Gestion et optimisation des bases de données
- Collaboration avec les équipes frontend et DevOps
- Revue de code et maintenabilité

## Environnement de travail

- Équipe jeune et dynamique
- Technologies modernes
- Projet à impact national
- Croissance professionnelle`,
    requirements: [
      'Maîtrise avancée de PHP et du framework Laravel',
      'Expérience avec PostgreSQL et MySQL',
      'Connaissance des API RESTful',
      'Expérience avec Git et méthodologies agiles',
      'Bonne compréhension des architectures MVC'
    ],
    niceToHave: [
      'Expérience avec Node.js ou Python',
      'Connaissance de Docker',
      'Expérience avec des outils de monitoring'
    ],
    technologies: ['PHP', 'Laravel', 'PostgreSQL', 'MySQL', 'JavaScript', 'Git', 'Docker'],
    benefits: [
      'Salaire compétitif',
      'Équipement professionnel',
      'Formation continue',
      'Évolution de carrière',
      'Très bon environnement de travail'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'test-offer-4',
    title: 'Architecte Logiciel Full Stack',
    companyName: 'Yas Madagascar',  // Dénormalisé depuis users.company.name
    recruiterId: null,  // Sera rempli après création du recruteur
    location: 'Antananarivo, Madagascar',
    coordinates: [47.52566623322738, -18.909228523929638],
    salary: '3,000,000 - 4,500,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Chez Yas Madagascar, nous recherchons un Architecte Logiciel Full Stack pour concevoir et superviser le développement de nos applications et services critiques de télécommunications.

## Responsabilités

- Conception d'architectures logicielles scalables et sécurisées
- Supervision du développement full stack (frontend et backend)
- Prise de décisions techniques et stratégie technologique
- Encadrement des équipes de développement
- Gestion des performances et de la sécurité

## Environnement de travail

- Poste à hautes responsabilités
- Technologie de pointe
- Croissance professionnelle rapide
- Participation à la transformation digitale de Madagascar`,
    requirements: [
      'Expertise en développement full stack (Java, PHP, JavaScript)',
      'Expérience avancée en architecture logicielle',
      'Maîtrise de plusieurs bases de données (PostgreSQL, MySQL, Oracle)',
      'Compétences en gestion de projet et leadership',
      'Expérience avec des systèmes de télécommunications'
    ],
    niceToHave: [
      'Connaissance des plateformes cloud',
      'Expérience avec des outils DevOps',
      'Maîtrise des méthodologies CI/CD'
    ],
    technologies: ['Java', 'PHP', 'Laravel', 'Spring Boot', 'JavaScript', 'Vue.js', 'PostgreSQL', 'MySQL', 'Oracle', 'Docker', 'Git', 'Express.js'],
    benefits: [
      'Rémunération excellente',
      'Participation aux décisions stratégiques',
      'Formation continue avancée',
      'Équipement haut de gamme',
      'Conditions de travail exceptionnelles'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  },
  {
    id: 'test-offer-5',
    title: 'Développeur Backend Java Spring Boot',
    companyName: 'Airtel Madagascar',  // Dénormalisé depuis users.company.name
    recruiterId: null,  // Sera rempli après création du recruteur
    location: 'Antananarivo, Madagascar',
    coordinates: [47.519278, -18.8753376],
    salary: '2,000,000 - 3,000,000 MGA/mois',
    type: 'CDI',
    status: 'active',
    description: `## À propos du poste

Airtel Madagascar recherche un Développeur Backend Java Spring Boot pour rejoindre son équipe technique dans le développement de solutions de télécommunications innovantes.

## Responsabilités

- Développement d'applications backend avec Java Spring Boot
- Conception d'APIs REST sécurisées et performantes
- Intégration avec les systèmes de télécommunications
- Optimisation des performances et de la sécurité
- Collaboration avec les équipes frontend et DevOps

## Environnement de travail

- Grand opérateur de télécommunications
- Environnement technique exigeant
- Projets à fort impact
- Technologies de pointe`,
    requirements: [
      'Maîtrise avancée de Java et Spring Boot',
      'Expérience avec PostgreSQL et MySQL',
      'Connaissance des API REST et de la sécurité web',
      'Expérience avec Git et CI/CD',
      'Bonnes capacités de travail en équipe'
    ],
    niceToHave: [
      'Expérience avec Docker et conteneurisation',
      'Connaissance des systèmes de télécommunications',
      'Expérience avec des outils de monitoring'
    ],
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'MySQL', 'JavaScript', 'Git', 'Docker', 'Express.js'],
    benefits: [
      'Package attractif',
      'Travail sur des projets à fort impact',
      'Formation continue',
      'Évolution de carrière',
      'Environnement professionnel stimulant'
    ],
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    viewsCount: 0,
    applicationsCount: 0
  }
];

// Fonction principale pour créer les offres de test
async function createTestOffers() {
  console.log('🚀 Création des offres de test...\n');
  
  try {
    // Récupérer les IDs des recruteurs
    const recruiterIds = await getRecruiterIds();
    console.log('✅ IDs des recruteurs récupérés:', recruiterIds);
    
    // Créer les offres
    const batch = writeBatch(db);
    
    for (const offer of testOffers) {
      try {
        const recruiterId = recruiterIds[offer.companyName];
        if (!recruiterId) {
          console.error(`❌ Aucun recruteur trouvé pour ${offer.companyName}`);
          continue;
        }
        
        // Convertir les dates en chaînes ISO
        const postedDate = typeof offer.postedDate === 'string' ? offer.postedDate : new Date().toISOString();
        const deadline = typeof offer.deadline === 'string' ? offer.deadline : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const offerData = {
          ...offer,
          recruiterId: recruiterId,
          postedDate: postedDate,
          deadline: deadline,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const offerRef = doc(db, 'offers', offer.id);
        batch.set(offerRef, offerData);
        
        console.log(`✅ ${offer.title} - ${offer.companyName}`);
      } catch (error) {
        console.error(`❌ Erreur pour ${offer.title}:`, error.message);
      }
    }
    
    await batch.commit();
    console.log('\n🎉 Toutes les offres de test ont été créées avec succès!');
    console.log(`📊 ${testOffers.length} offres créées`);
    
    console.log('\n📋 Détails des offres créées:');
    testOffers.forEach(offer => {
      console.log(`- ${offer.id}: ${offer.title} chez ${offer.companyName}`);
    });
    
  } catch (error) {
    console.error('❌ ERREUR:', error);
    process.exit(1);
  }
}

// Exécution
createTestOffers();