import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Filter, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { dataProvider } from '@/data/dataProvider';
import { useAuth } from '@/hooks/useAuth';

type ApplicationStatus = 'accepted' | 'rejected' | 'pending';

interface Application {
  id: string;
  studentId: string;
  studentName?: string;
  company: string;
  position: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
  salary: string;
  type: string;
  logo?: string;
  offerId?: string;
  isNew?: boolean;
}

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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        // Fetch only applications for the current student
        const apps = user ? await dataProvider.getApplications(user.id) : [];
        setApplications(apps);
        
        // Clear new flags after a delay for new applications
        const newApps = apps.filter(app => app.isNew);
        if (newApps.length > 0) {
          setTimeout(async () => {
            // For each new application, update the isNew flag to false
            for (const app of newApps) {
              await dataProvider.updateApplication(app.id, { isNew: false });
            }
            // Refetch the data to reflect the changes
            const updatedApps = user ? await dataProvider.getApplications(user.id) : [];
            setApplications(updatedApps);
          }, 3000);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        // Even if there's an error, we still set the applications to an empty array
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  // Only show applications for the current student
  const userApplications = user ? applications.filter(app => app.studentId === user.id) : applications;

  // Filtrage
  const filteredApplications = userApplications.filter(app => {
    const matchesSearch = (app.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (app.position || '').toLowerCase().includes(searchTerm.toLowerCase());
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
    total: userApplications.length,
    accepted: userApplications.filter(a => a.status === 'accepted').length,
    rejected: userApplications.filter(a => a.status === 'rejected').length,
    pending: userApplications.filter(a => a.status === 'pending').length,
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
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Chargement des candidatures...
            </CardContent>
          </Card>
        ) : userApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucune candidature
            </CardContent>
          </Card>
        ) : paginatedApplications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Aucune candidature trouvée pour les critères de recherche
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
                          <Badge variant="default" className="mb-2 bg-green-100 text-green-800 animate-pulse">
                            NOUVEAU
                          </Badge>
                        )}
                        <h3 className="text-xl font-semibold">{app.position}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          {app.logo ? (
                            <img 
                              src={app.logo} 
                              alt={`${app.company} logo`} 
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {app.company.charAt(0)}
                              </span>
                            </div>
                          )}
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
