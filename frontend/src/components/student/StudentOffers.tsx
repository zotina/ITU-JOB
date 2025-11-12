import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { useProfileData } from '@/hooks/useProfileData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, MapPin, Euro, Clock, Star, Filter, Loader2 } from 'lucide-react';
import { dataProvider } from '@/data/dataProvider';
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
import { useAuth } from '@/hooks/useAuth';

const StudentOffers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profileData } = useProfileData();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const companiesFilter = searchParams.get('companies')?.split(',') || [];
  const searchFromUrl = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(searchFromUrl);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('q', searchTerm);
    } else {
      params.delete('q');
    }
    // Only update if the parameter has changed
    if (searchParams.get('q') !== (searchTerm || null)) {
      setSearchParams(params);
    }
  }, [searchTerm, setSearchParams, searchParams]);
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [applyingOfferId, setApplyingOfferId] = useState<string | null>(null);
  const itemsPerPage = 6;

  // State for data
  const [offers, setOffers] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Fetch data from dataProvider
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        setDataError(null); // Clear previous errors
        const [offersData, companiesData] = await Promise.all([
          dataProvider.getOffers(),
          dataProvider.getCompanies()
        ]);
        setOffers(offersData);
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching data in StudentOffers:', error);
        setDataError('Erreur lors du chargement des offres. Veuillez réessayer plus tard.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const recommendedOffers = useMemo(() => {
    if (dataLoading) return [];
    return [...offers]
      .sort((a, b) => b.matchingScore - a.matchingScore)
      .slice(0, 4);
  }, [offers, dataLoading]);

  const allOffers = useMemo(() => {
    if (dataLoading) return [];
    let filtered = offers.filter(offer => {
      const matchesCompanies = companiesFilter.length > 0 ? companiesFilter.includes(offer.company) : true;
      const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === 'all' || locationFilter === '' || offer.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesType = typeFilter === 'all' || offer.type === typeFilter;
      const matchesTech = techFilter === 'all' || techFilter === '' || offer.technologies.some(tech => tech.toLowerCase().includes(techFilter.toLowerCase()));
      
      return matchesCompanies && matchesSearch && matchesLocation && matchesType && matchesTech;
    });

    // Tri par défaut par pertinence (matchingScore)
    filtered.sort((a, b) => b.matchingScore - a.matchingScore);

    return filtered;
  }, [offers, searchTerm, locationFilter, typeFilter, techFilter, companiesFilter, dataLoading]);

  const totalPages = Math.ceil(allOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = allOffers.slice(startIndex, startIndex + itemsPerPage);

  const uniqueTypes = [...new Set(offers.map(offer => offer.type))];

  const handleApply = (offerId: string, offerTitle: string, company: string, location: string, salary: string, type: string) => {
    setApplyingOfferId(offerId);
    
    // Get student info from authenticated user or profile
    const studentName = user?.prenom + ' ' + user?.nom || profileData?.personalInfo?.name || "Current Student";
    const studentId = user?.id || "current-student-id"; // Fallback to current user ID from auth context
    
    // Add application via dataProvider (which uses Firebase)
    dataProvider.addApplication({
      company,
      position: offerTitle,
      location,
      salary,
      type,
      offerId,
      studentName,
      studentId
    })
    .then(() => {
      setApplyingOfferId(null);
      toast({
        title: "Succès",
        description: "Candidature envoyée avec succès !",
        variant: "default",
      });
      
      // Redirect to applications page after a short delay
      setTimeout(() => {
        navigate('/student/applications');
      }, 1000);
    })
    .catch(error => {
      setApplyingOfferId(null);
      toast({
        title: "Erreur",
        description: "Échec de l'envoi de la candidature.",
        variant: "destructive",
      });
    });
  };

  const renderOfferCard = (offer: any, isRecommended: boolean) => (
    <Card key={offer.id} className="hover:shadow-elegant transition-all duration-300 flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => {
              const company = companies.find(c => c.name === offer.company);
              if (company) {
                navigate(`/student/company/${company.id}`);
              }
            }}>
              {(() => {
                const company = companies.find(c => c.name === offer.company);
                return company && company.logo ? (
                  <img 
                    src={company.logo} 
                    alt={`${offer.company} logo`}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallbackIcon = document.createElement('div');
                        fallbackIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" className="text-primary"/><path d="M6 12H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" className="text-primary"/></svg>';
                        parent.appendChild(fallbackIcon);
                      }
                    }}
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-primary" />
                );
              })()}
            </div>
            <div>
              <CardTitle className="text-lg">{offer.title}</CardTitle>
              <p className="text-muted-foreground font-medium cursor-pointer hover:text-primary hover:underline" onClick={() => {
                const company = companies.find(c => c.name === offer.company);
                if (company) {
                  navigate(`/student/company/${company.id}`);
                }
              }}>{offer.company}</p>
            </div>
          </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 font-semibold">
              {offer.matchingScore}% Match
            </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-grow">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {offer.location}</div>
          <div className="flex items-center gap-1"> {offer.salary}</div>
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
            disabled={applyingOfferId === offer.id}
          >
            {applyingOfferId === offer.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {applyingOfferId === offer.id ? 'Envoi...' : 'Postuler'}
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

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-4">{dataError}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty state if no offers are available after loading
  if (!dataLoading && offers.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Aucune offre disponible</h3>
            <p className="text-muted-foreground mb-4">Il n'y a actuellement aucune offre d'emploi disponible.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SearchInput
                placeholder="Rechercher par ville..."
                value={locationFilter === 'all' ? '' : locationFilter}
                onChange={(value) => setLocationFilter(value || 'all')}
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger><SelectValue placeholder="Type de contrat" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {uniqueTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
              <SearchInput
                placeholder="Rechercher par technologie..."
                value={techFilter === 'all' ? '' : techFilter}
                onChange={(value) => setTechFilter(value || 'all')}
              />
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