import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Filter, Calendar, Building2, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { getApplications, clearNewFlag } from '@/data/applicationStore';

type ApplicationStatus = 'accepted' | 'rejected' | 'pending';

interface Application {
  id: string;
  company: string;
  position: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
  salary: string;
  type: string;
  isNew?: boolean;
}

const mockApplications: Application[] = [
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

const getStatusBadge = (status: ApplicationStatus) => {
  const variants = {
    accepted: { label: 'Accepté', variant: 'default' as const, className: 'bg-green-500 hover:bg-green-600' },
    rejected: { label: 'Refusé', variant: 'destructive' as const, className: '' },
    pending: { label: 'En attente', variant: 'secondary' as const, className: 'bg-yellow-500 hover:bg-yellow-600 text-white' }
  };
  const config = variants[status];
  return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
};

const StudentApplications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState<Application[]>([]);
  const itemsPerPage = 5;

  useEffect(() => {
    const apps = getApplications();
    setApplications(apps);
    
    // Clear new flags after a delay
    const newApps = apps.filter(app => app.isNew);
    if (newApps.length > 0) {
      setTimeout(() => {
        newApps.forEach(app => clearNewFlag(app.id));
        setApplications(getApplications());
      }, 3000);
    }
  }, []);

  // Filtrage
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Tri par statut
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const statusOrder = { accepted: 0, pending: 1, rejected: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Pagination
  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = sortedApplications.slice(startIndex, startIndex + itemsPerPage);

  // Statistiques
  const stats = {
    total: applications.length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    pending: applications.filter(a => a.status === 'pending').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-2">
        <FileText className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Mes Candidatures</h1>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
              <p className="text-sm text-muted-foreground mt-1">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{stats.accepted}</p>
              <p className="text-sm text-muted-foreground mt-1">Acceptées</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
              <p className="text-sm text-muted-foreground mt-1">En attente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
              <p className="text-sm text-muted-foreground mt-1">Refusées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par entreprise ou poste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="accepted">Accepté</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="rejected">Refusé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des candidatures */}
      <div className="space-y-4">
        {paginatedApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucune candidature trouvée
            </CardContent>
          </Card>
        ) : (
          paginatedApplications.map((app) => (
            <Card 
              key={app.id} 
              className={`hover:shadow-lg transition-all ${app.isNew ? 'ring-2 ring-primary animate-pulse' : ''}`}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {app.isNew && (
                          <Badge className="mb-2 bg-primary">Nouvelle candidature</Badge>
                        )}
                        <h3 className="text-xl font-semibold">{app.position}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <Building2 className="w-4 h-4" />
                          <span>{app.company}</span>
                        </div>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{app.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Candidaté le {new Date(app.appliedDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <Badge variant="outline">{app.type}</Badge>
                      <Badge variant="outline">{app.salary}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
