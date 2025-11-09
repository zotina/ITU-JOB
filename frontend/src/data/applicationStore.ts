// Store pour gérer les candidatures en mémoire
type ApplicationStatus = 'accepted' | 'rejected' | 'pending';

export interface Application {
  id: string;
  company: string;
  position: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
  salary: string;
  type: string;
  logo?: string;
  studentName?: string;
  offerId?: string;
  isNew?: boolean;
}

let applicationStore: Application[] = [
  // Nouvelles candidatures pour Andriamalala Raviro
  {
    id: '9',
    company: 'Airtel Madagascar',
    position: 'Développeur Mobile',
    location: 'Antananarivo, Madagascar',
    appliedDate: '2025-01-28',
    status: 'pending',
    salary: '1.8-2.8M MGA/mois',
    type: 'CDI',
    logo: '/src/assets/company-logos/airtel.png',
    studentName: 'Andriamalala Raviro'
  },
  {
    id: '12',
    company: 'Orange Madagascar',
    position: 'Stage Développeur Web',
    location: 'Antananarivo, Madagascar',
    appliedDate: '2025-11-09',
    status: 'pending',
    salary: '',
    type: 'Stage',
    logo: '/src/assets/company-logos/orange.png',
    studentName: 'Andriamalala Raviro'
  },
  {
    id: '11',
    company: 'Yas Madagascar',
    position: 'Data Scientist',
    location: 'Antananarivo, Madagascar',
    appliedDate: '2025-01-30',
    status: 'pending',
    salary: '2.5-3.5M MGA/mois',
    type: 'CDI',
    logo: '/src/assets/company-logos/yas.png',
    studentName: 'Andriamalala Raviro'
  },
  {
    id: '10',
    company: 'Microlink Madagascar',
    position: 'Développeur Web',
    location: 'Antananarivo, Madagascar',
    appliedDate: '2025-01-29',
    status: 'pending',
    salary: '',
    type: 'Stage',
    logo: '/src/assets/company-logos/microlink.png',
    studentName: 'Andriamalala Raviro'
  }
];

export const getApplications = (): Application[] => {
  return applicationStore;
};

export const addApplication = (application: Omit<Application, 'id' | 'appliedDate' | 'status'> & { studentName?: string }): Application => {
  const newApplication: Application = {
    ...application,
    id: Date.now().toString(),
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    isNew: true,
  };
  
  applicationStore = [newApplication, ...applicationStore];
  return newApplication;
};

export const clearNewFlag = (id: string) => {
  applicationStore = applicationStore.map(app =>
    app.id === id ? { ...app, isNew: false } : app
  );
};
