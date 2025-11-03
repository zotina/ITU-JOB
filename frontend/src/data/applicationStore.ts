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
  offerId?: string;
  isNew?: boolean;
}

let applicationStore: Application[] = [
  {
    id: '1',
    company: 'Google',
    position: 'Software Engineer',
    location: 'Mountain View, CA',
    appliedDate: '2024-01-15',
    status: 'pending',
    salary: '120k - 150k MAD',
    type: 'Full-time'
  },
  {
    id: '2',
    company: 'Microsoft',
    position: 'Frontend Developer',
    location: 'Redmond, WA',
    appliedDate: '2024-01-10',
    status: 'accepted',
    salary: '110k - 140k MAD',
    type: 'Full-time'
  },
  {
    id: '3',
    company: 'Amazon',
    position: 'DevOps Engineer',
    location: 'Seattle, WA',
    appliedDate: '2024-01-05',
    status: 'rejected',
    salary: '100k - 130k MAD',
    type: 'Full-time'
  },
  {
    id: '4',
    company: 'Meta',
    position: 'Backend Developer',
    location: 'Menlo Park, CA',
    appliedDate: '2024-01-20',
    status: 'pending',
    salary: '130k - 160k MAD',
    type: 'Full-time'
  },
  {
    id: '5',
    company: 'Apple',
    position: 'iOS Developer',
    location: 'Cupertino, CA',
    appliedDate: '2023-12-28',
    status: 'accepted',
    salary: '115k - 145k MAD',
    type: 'Full-time'
  },
  {
    id: '6',
    company: 'Netflix',
    position: 'Full Stack Developer',
    location: 'Los Gatos, CA',
    appliedDate: '2023-12-20',
    status: 'rejected',
    salary: '125k - 155k MAD',
    type: 'Contract'
  },
  {
    id: '7',
    company: 'Tesla',
    position: 'Software Engineer',
    location: 'Palo Alto, CA',
    appliedDate: '2024-01-25',
    status: 'pending',
    salary: '105k - 135k MAD',
    type: 'Full-time'
  },
  {
    id: '8',
    company: 'Spotify',
    position: 'Data Engineer',
    location: 'Stockholm, Sweden',
    appliedDate: '2024-01-18',
    status: 'pending',
    salary: '95k - 125k MAD',
    type: 'Full-time'
  },
];

export const getApplications = (): Application[] => {
  return applicationStore;
};

export const addApplication = (application: Omit<Application, 'id' | 'appliedDate' | 'status'>): Application => {
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
