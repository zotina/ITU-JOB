import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Star, CheckCircle, X, MessageCircle, User, Loader2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SearchInput } from '@/components/ui/search-input';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAuth } from '@/hooks/useAuth';
import { dataProvider } from '@/data/dataProvider';
import { Application } from '@/services/firebaseService';

const FilteredApplications = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [offerTitle, setOfferTitle] = useState('');
  const itemsPerPage = 9;
  const { toast } = useToast();

  // Extraire l'ID de l'offre depuis les paramètres d'URL
  const params = new URLSearchParams(location.search);
  const offerId = params.get('offerId');

  // Fetch the applications for this offer (filtered by company)
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        if (offerId && user) {
          // Get applications for this specific offer from the recruiter's company
          const apps = await dataProvider.getApplications(user.id, offerId);
          setApplications(apps);
          
          // Get the offer title to display in the UI
          const offers = await dataProvider.getOffers(user.id);
          const offer = offers.find(o => o.id === offerId);
          setOfferTitle(offer?.title || 'Offre');
        } else {
          // If no offerId, get all applications for the recruiter's company
          const apps = await dataProvider.getApplications(user?.id);
          setApplications(apps);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
        toast({
          title: "Erreur",
          description: "Impossible de charger les candidatures.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user, offerId, toast]);

  // Filtrer les candidatures basées sur l'application
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    return filtered;
  }, [applications, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepté';
      case 'rejected': return 'Refusé';
      default: return 'En attente';
    }
  };

  const handleAcceptCandidate = async (candidateName: string, applicationId: string) => {
    try {
      // Update the application status in Firestore
      await dataProvider.updateApplication(applicationId, { status: 'accepted' });
      
      // Create a notification for the candidate
      // (This would require creating a notification service call)
      
      toast({
        title: "Candidature acceptée",
        description: `La candidature de ${candidateName} a été acceptée.`,
      });
      
      // Refresh the applications list
      if (user && offerId) {
        const apps = await dataProvider.getApplications(user.id, offerId);
        setApplications(apps);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la candidature.",
        variant: "destructive",
      });
    }
  };

  const handleRejectCandidate = async (candidateName: string, applicationId: string) => {
    try {
      // Update the application status in Firestore
      await dataProvider.updateApplication(applicationId, { status: 'rejected' });
      
      toast({
        title: "Candidature rejetée",
        description: `La candidature de ${candidateName} a été rejetée.`,
      });
      
      // Refresh the applications list
      if (user && offerId) {
        const apps = await dataProvider.getApplications(user.id, offerId);
        setApplications(apps);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la candidature.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Candidatures pour {offerTitle}
        </h1>
        <Badge variant="secondary">
          {filteredApplications.length} candidat{filteredApplications.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <SearchInput
            placeholder="Rechercher par nom, titre ou compétence..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="accepted">Accepté</option>
              <option value="rejected">Refusé</option>
            </select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCurrentPage(1);
            }}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-elegant transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {application.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{application.studentName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{application.position}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={getStatusColor(application.status)}>
                  {getStatusText(application.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {application.location}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Type de contrat:</p>
                <div className="text-xs p-2 bg-muted rounded">
                  {application.type}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Salaire:</span>
                  <p className="font-medium">{application.salary}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date de candidature:</span>
                  <p className="font-medium">{new Date(application.appliedDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Candidature pour:</p>
                <div className="text-xs p-2 bg-muted rounded">
                  {offerTitle}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleAcceptCandidate(application.studentName, application.id)}
                  disabled={application.status !== 'pending'}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Accepter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleRejectCandidate(application.studentName, application.id)}
                  disabled={application.status !== 'pending'}
                >
                  <X className="w-4 h-4 mr-1" />
                  Refuser
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/recruiter/student-profile/${application.studentId}`)}
                >
                  <User className="w-4 h-4 mr-1" />
                  Voir profil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default FilteredApplications;