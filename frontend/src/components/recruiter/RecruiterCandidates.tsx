import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, CheckCircle, X, MessageCircle, Send, Filter, User, Target } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { dataProvider } from '@/data/dataProvider';
import { Application } from '@/services/firebaseService';
import { 
  calculateApplicationMatchingScore, 
  ApplicationWithMatching,
  getMatchScoreColor,
  getMatchScoreVariant
} from '@/utils/applicationMatching';

const RecruiterCandidates = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const offerId = searchParams.get('offerId');
  
  const [applications, setApplications] = useState<ApplicationWithMatching[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('relevance'); // Add sort option state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch applications for the specific offer or all applications for the user's company
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        let apps: Application[] = [];

        if (user && offerId) {
          // Get only applications for this specific offer
          apps = await dataProvider.getApplications(user.id, offerId);
        } else if (user) {
          console.log('Fetching all applications for company = ' + user.id);
          // If no offer ID, get all applications for the user's company
          apps = await dataProvider.getApplications(user.id);
        } else {
          apps = [];
        }

        // Calculate matching scores for each application
        const applicationsWithScores = await Promise.all(
          apps.map(async (app) => {
            // Get the corresponding job offer
            const offer = await dataProvider.getOfferById(app.offerId);
            
            if (offer) {
              // Calculate the matching score
              const { matchScore, matchingDetails } = await calculateApplicationMatchingScore(
                app,
                offer,
                async (studentId: string) => {
                  // Function to get candidate profile by ID
                  return await dataProvider.getUserProfile(studentId);
                }
              );
              
              return {
                ...app,
                matchScore,
                matchingDetails
              };
            }
            
            return {
              ...app,
              matchScore: 0,
              matchingDetails: ['Offre non trouvée']
            };
          })
        );
        
        setApplications(applicationsWithScores);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les candidatures.",
          variant: "destructive",
        });
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, offerId, toast]);

  // Filter and sort applications based on search term, status and sort option
  const filteredApplications = useMemo(() => {
    let result = applications.filter(app => {
      const matchesSearch = app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    // Apply sorting
    switch (sortOption) {
      case 'match':
        // Sort by matching score (highest first)
        result = result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
      case 'date':
        // Sort by application date (newest first)
        result = result.sort((a, b) => 
          new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        );
        break;
      case 'name':
        // Sort by student name (alphabetically)
        result = result.sort((a, b) => 
          (a.studentName || '').localeCompare(b.studentName || '')
        );
        break;
      case 'relevance':
      default:
        // Default: sort by matching score (highest first) as default
        result = result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
    }
    
    return result;
  }, [applications, searchTerm, statusFilter, sortOption]);

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

  const handleAcceptApplication = async (applicationId: string, studentName: string) => {
    try {
      await dataProvider.updateApplication(applicationId, { status: 'accepted' });
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'accepted' }
            : app
        )
      );
      
      toast({
        title: "Candidature acceptée",
        description: `La candidature de ${studentName} a été acceptée.`,
      });
    } catch (error) {
      console.error('Error accepting application:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la candidature.",
        variant: "destructive",
      });
    }
  };

  const handleRejectApplication = async (applicationId: string, studentName: string) => {
    try {
      await dataProvider.updateApplication(applicationId, { status: 'rejected' });
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'rejected' }
            : app
        )
      );
      
      toast({
        title: "Candidature rejetée",
        description: `La candidature de ${studentName} a été rejetée.`,
      });
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la candidature.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {offerId ? "Candidatures pour l'offre sélectionnée" : "Toutes les candidatures"}
        </h1>
        <Badge variant="secondary">
          {filteredApplications.length} candidature{filteredApplications.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <SearchInput
            placeholder="Rechercher par nom ou poste..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="accepted">Accepté</SelectItem>
                <SelectItem value="rejected">Refusé</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Pertinence</SelectItem>
                <SelectItem value="match">Score de matching</SelectItem>
                <SelectItem value="date">Date de candidature</SelectItem>
                <SelectItem value="name">Nom du candidat</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setSortOption('relevance');
              setCurrentPage(1);
            }}>
              <Filter className="w-4 h-4 mr-2" />
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
                      {application.studentName?.split(' ').map(n => n[0]).join('') || 'NA'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{application.studentName || 'Nom inconnu'}</CardTitle>
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

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium">{application.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Salaire:</span>
                  <p className="font-medium">{application.salary || 'Non spécifié'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Postulé pour:</p>
                <div className="text-xs p-2 bg-muted rounded">
                  {application.offerId}
                </div>
              </div>

              {/* Matching Score Section */}
              {application.matchScore !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Score de matching:</p>
                    <Badge className={getMatchScoreVariant(application.matchScore || 0)}>
                      <Target className="w-3 h-3 mr-1" />
                      {application.matchScore}%
                    </Badge>
                  </div>
                  {application.matchingDetails && application.matchingDetails.length > 0 && (
                    <div className="text-xs p-2 bg-muted rounded">
                      {application.matchingDetails[0] || 'Détails de matching non disponibles'}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Date de candidature:</p>
                <div className="text-xs p-2 bg-muted rounded">
                  {new Date(application.appliedDate).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleAcceptApplication(application.id, application.studentName || 'Candidat')}
                  disabled={application.status !== 'pending'}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Accepter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleRejectApplication(application.id, application.studentName || 'Candidat')}
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

export default RecruiterCandidates;