import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import RecommendedProfiles from './RecommendedProfiles';
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
import { JobOffer } from '@/services/firebaseService';

const RecruiterOffers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  // Fetch the recruiter's offers (filtered by company)
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const offersData = await dataProvider.getOffers(user?.id);
        setOffers(offersData);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOffers();
    }
  }, [user]);

  // Filtrage des offres
  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
      const matchesType = typeFilter === 'all' || offer.type === typeFilter;
      const matchesLocation = locationFilter === 'all' || offer.location.includes(locationFilter);
      
      return matchesSearch && matchesStatus && matchesType && matchesLocation;
    });
  }, [offers, searchTerm, statusFilter, typeFilter, locationFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

  // Obtenir les valeurs uniques pour les filtres
  const uniqueLocations = [...new Set(offers.map(offer => offer.location))];
  const uniqueTypes = [...new Set(offers.map(offer => offer.type))];

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
        <h1 className="text-2xl font-bold">Mes Offres d'Emploi</h1>
        <Button className="gap-2" onClick={() => navigate('/recruiter/create-offer')}>
          <Plus className="w-4 h-4" />
          Créer une offre
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>
            Filtrer les offres
            <Badge variant="secondary" className="ml-auto">
              {filteredOffers.length} résultat{filteredOffers.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchInput
            placeholder="Rechercher par titre, entreprise ou mot-clé..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="expired">Expirée</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
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

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTypeFilter('all');
              setLocationFilter('all');
              setCurrentPage(1);
            }}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {paginatedOffers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{offer.title}</CardTitle>
                    {offer.isNouveau && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1">{offer.location} • {offer.type}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm line-clamp-2">{offer.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {offer.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                {/* <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>23 candidatures</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>156 vues</span>
                  </div>
                </div>
                 */}
                <div className="flex gap-2">
                  <RecommendedProfiles offerTitle={offer.title} />
                  <Button size="sm" onClick={() => navigate(`/recruiter/candidates?offerId=${offer.id}`)}>
                    Voir candidatures
                    {offer.nbCandidatures !== undefined && (
                      <Badge variant="secondary" className="ml-2">
                        {offer.nbCandidatures}
                      </Badge>
                    )}
                  </Button>
                </div>
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

export default RecruiterOffers;