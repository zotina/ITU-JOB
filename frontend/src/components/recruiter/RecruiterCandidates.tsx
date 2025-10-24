import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, CheckCircle, X, MessageCircle, Send, Filter } from 'lucide-react';
import { mockCandidates } from '@/data/mockData';
import { useState, useMemo } from 'react';
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

const RecruiterCandidates = () => {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { toast } = useToast();

  // Filtrage et tri des candidats
  const filteredCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
      const matchesLocation = locationFilter === 'all' || candidate.location.includes(locationFilter);
      
      return matchesSearch && matchesStatus && matchesLocation;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchingScore - a.matchingScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return b.experience.localeCompare(a.experience);
        default:
          return 0;
      }
    });

    return filtered;
  }, [candidates, searchTerm, statusFilter, locationFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  // Obtenir les valeurs uniques pour les filtres
  const uniqueLocations = [...new Set(candidates.map(candidate => candidate.location))];
  const uniqueStatuses = [...new Set(candidates.map(candidate => candidate.status))];

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

  const handleAcceptCandidate = (candidateId: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, status: 'accepted' }
          : candidate
      )
    );
    
    // Envoyer la notification prédéfinie
    const candidate = candidates.find(c => c.id === candidateId);
    toast({
      title: "Candidature acceptée",
      description: `Notification envoyée à ${candidate?.name}`,
    });
  };

  const handleRejectCandidate = (candidateId: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, status: 'rejected' }
          : candidate
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Candidatures</h1>
        <Badge variant="secondary">
          {filteredCandidates.length} candidat{filteredCandidates.length !== 1 ? 's' : ''}
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

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Localisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Meilleur match</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="experience">Expérience</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setLocationFilter('all');
              setSortBy('match');
              setCurrentPage(1);
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedCandidates.map((candidate) => (
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
                <p className="text-sm font-medium">Candidatures :</p>
                {candidate.appliedJobs.map((job, index) => (
                  <div key={index} className="text-xs p-2 bg-muted rounded flex items-center justify-between">
                    <span>{job}</span>
                    <Badge className={getStatusColor(candidate.status)}>
                      {getStatusText(candidate.status)}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleAcceptCandidate(candidate.id)}
                  disabled={candidate.status !== 'pending'}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Accepter
                </Button>
                <Button variant="outline" size="sm" className="flex-1"
                  onClick={() => handleRejectCandidate(candidate.id)}
                  disabled={candidate.status !== 'pending'}>
                  <X className="w-4 h-4 mr-1" />
                  Refuser
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4" />
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