import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, MapPin, Euro, Clock, Star, Filter, Loader2 } from 'lucide-react';
import { mockOffers, mockCompanies } from '@/data/mockData';
import { addApplication } from '@/data/applicationStore';
import { SearchInput } from '@/components/ui/search-input';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const StudentOffers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const companiesFilter = searchParams.get('companies')?.split(',') || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<string | null>(null);
  const itemsPerPage = 6;

  const recommendedOffers = useMemo(() => {
    return [...mockOffers]
      .sort((a, b) => b.matchingScore - a.matchingScore)
      .slice(0, 4);
  }, []);

  const allOffers = useMemo(() => {
    let filtered = mockOffers.filter(offer => {
      const matchesCompanies = companiesFilter.length > 0 ? companiesFilter.includes(offer.company) : true;
      const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === 'all' || offer.location.includes(locationFilter);
      const matchesType = typeFilter === 'all' || offer.type === typeFilter;
      const matchesTech = techFilter === 'all' || offer.technologies.some(tech => tech.toLowerCase().includes(techFilter.toLowerCase()));
      
      return matchesCompanies && matchesSearch && matchesLocation && matchesType && matchesTech;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchingScore - a.matchingScore;
        case 'salary':
          return parseInt(b.salary.replace(/\D/g, '')) - parseInt(a.salary.replace(/\D/g, ''));
        case 'recent':
          return new Date(b.posted || '2024-01-01').getTime() - new Date(a.posted || '2024-01-01').getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, locationFilter, typeFilter, techFilter, sortBy]);

  const totalPages = Math.ceil(allOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = allOffers.slice(startIndex, startIndex + itemsPerPage);

  const uniqueLocations = [...new Set(mockOffers.map(offer => offer.location))];
  const uniqueTypes = [...new Set(mockOffers.map(offer => offer.type))];
  const uniqueTechs = [...new Set(mockOffers.flatMap(offer => offer.technologies))].slice(0, 10);

  const handleApply = (offerId: string, offerTitle: string, company: string, location: string, salary: string, type: string) => {
    setLoading(offerId);
    setTimeout(() => {
      addApplication({
        company,
        position: offerTitle,
        location,
        salary,
        type,
        offerId
      });
      
      setLoading(null);
      toast({
        title: "Succès",
        description: "Candidature envoyée avec succès !",
        variant: "default",
      });
      
      // Redirect to applications page after a short delay
      setTimeout(() => {
        navigate('/student/applications');
      }, 1000);
    }, 1500);
  };

  const renderOfferCard = (offer: any, isRecommended: boolean) => (
    <Card key={offer.id} className="hover:shadow-elegant transition-all duration-300 flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => {
              const company = mockCompanies.find(c => c.name === offer.company);
              if (company) {
                navigate(`/student/company/${company.id}`);
              }
            }}>
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{offer.title}</CardTitle>
              <p className="text-muted-foreground font-medium cursor-pointer hover:text-primary hover:underline" onClick={() => {
                const company = mockCompanies.find(c => c.name === offer.company);
                if (company) {
                  navigate(`/student/company/${company.id}`);
                }
              }}>{offer.company}</p>
            </div>
          </div>
          {isRecommended && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 font-semibold">
              {offer.matchingScore}% Match
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-grow">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {offer.location}</div>
          <div className="flex items-center gap-1"><Euro className="w-4 h-4" /> {offer.salary}</div>
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {offer.type}</div>
        </div>
        
        <p className="text-sm line-clamp-2 flex-grow">{offer.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {offer.technologies.slice(0, 4).map((tech: string) => (
            <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
          ))}
          {offer.technologies.length > 4 && (
            <Badge variant="outline" className="text-xs">+{offer.technologies.length - 4}</Badge>
          )}
        </div>
      </CardContent>

      <div className="p-6 pt-0">
        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1" 
            onClick={() => handleApply(offer.id, offer.title, offer.company, offer.location, offer.salary, offer.type)} 
            disabled={loading === offer.id}
          >
            {loading === offer.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading === offer.id ? 'Envoi...' : 'Postuler'}
          </Button>
          <Link to={`/student/offers/${offer.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Détails
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Toutes les offres */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Toutes les offres</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres & Recherche
              <Badge variant="secondary" className="ml-auto">
                {allOffers.length} résultat{allOffers.length !== 1 ? 's' : ''}
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
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger><SelectValue placeholder="Localisation" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {uniqueLocations.map(location => <SelectItem key={location} value={location}>{location}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger><SelectValue placeholder="Type de contrat" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {uniqueTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={techFilter} onValueChange={setTechFilter}>
                <SelectTrigger><SelectValue placeholder="Technologie" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les technologies</SelectItem>
                  {uniqueTechs.map(tech => <SelectItem key={tech} value={tech}>{tech}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger><SelectValue placeholder="Trier par" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Pertinence</SelectItem>
                  <SelectItem value="salary">Salaire</SelectItem>
                  <SelectItem value="recent">Plus récent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {companiesFilter.length > 0 && (
              <div className="pt-4">
                <Badge variant="secondary" className="text-sm p-2">
                  Filtre actif : {companiesFilter.join(', ')}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-2"
                    onClick={() => setSearchParams({})}
                  >
                    &times;
                  </Button>
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {paginatedOffers.map(offer => renderOfferCard(offer, false))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default StudentOffers;