import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Star, CheckCircle, X, MessageCircle, User } from 'lucide-react';
import { mockCandidates, mockOffers } from '@/data/mockData';
import { useState, useMemo } from 'react';
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

const FilteredApplications = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { toast } = useToast();

  // Extraire l'ID de l'offre depuis les paramètres d'URL
  const params = new URLSearchParams(location.search);
  const offerId = params.get('offerId');
  
  // Trouver les détails de l'offre à partir de l'ID
  const offer = mockOffers.find(offer => offer.id === offerId);
  const offerTitle = offer?.title || '';

  // Filtrer les candidatures basées sur l'offre
  const filteredApplications = useMemo(() => {
    let applications = mockCandidates.filter(candidate => 
      candidate.appliedJobs.includes(offerTitle)
    );

    // Filtre par recherche
    if (searchTerm) {
      applications = applications.filter(candidate => 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      applications = applications.filter(candidate => candidate.status === statusFilter);
    }

    return applications;
  }, [offerTitle, searchTerm, statusFilter]);

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

  const handleAcceptCandidate = (candidateName: string) => {
    toast({
      title: "Candidature acceptée",
      description: `Notification envoyée à ${candidateName}`,
    });
  };

  const handleRejectCandidate = (candidateName: string) => {
    toast({
      title: "Candidature rejetée",
      description: `Notification envoyée à ${candidateName}`,
    });
  };

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
        {paginatedApplications.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-elegant transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{candidate.title}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 font-semibold">
                  <Star className="w-3 h-3 mr-1" />
                  {candidate.matchingScore}%
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {candidate.location}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Compétences principales :</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{candidate.skills.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Expérience:</span>
                  <p className="font-medium">{candidate.experience}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Disponibilité:</span>
                  <p className="font-medium">{candidate.availability}</p>
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
                  onClick={() => handleAcceptCandidate(candidate.name)}
                  disabled={candidate.status !== 'pending'}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Accepter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleRejectCandidate(candidate.name)}
                  disabled={candidate.status !== 'pending'}
                >
                  <X className="w-4 h-4 mr-1" />
                  Refuser
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/recruiter/student-profile/${candidate.id}`)}
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