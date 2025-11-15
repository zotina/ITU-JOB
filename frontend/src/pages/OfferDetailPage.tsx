import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { dataProvider } from '@/data/dataProvider';
import { useProfileData } from '@/hooks/useProfileData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LeafletMap from '@/components/ui/leaflet-map';
import { Building2, MapPin, Euro, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const OfferDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profileData } = useProfileData();
  const { user } = useAuth(); // Get the current user
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [offer, setOffer] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loadingOffer, setLoadingOffer] = useState(true);

  useEffect(() => {
    const fetchOfferAndCompany = async () => {
      try {
        if (id) {
          setLoadingOffer(true);
          // Get the offer by ID
          const offerData = await dataProvider.getOfferById(id);
          if (offerData) {
            setOffer(offerData);
            
            // Get the company information - in new structure, company might be part of the offer or we need to find it by name
            // Try to get company by name first, then by id if available
            let companyData = null;
            if (offerData.company) {
              // Try to get company by name first
              const companies = await dataProvider.getCompanies();
              companyData = companies.find((c: any) => c.name === offerData.company);
              
              // If not found by name, try finding the recruiter user associated with the offer
              if (!companyData) {
                // In the new structure, company info may be in the user profile
                // For now, we'll create a minimal company object from offer data
                companyData = {
                  name: offerData.company,
                  logo: '/src/assets/company-logos/default.png', // Use a default logo
                  description: 'Company information',
                  coordinates: offerData.coordinates || profileData.personalInfo.coordinates
                };
              }
            }
            
            setCompany(companyData);
          }
        }
      } catch (error) {
        console.error('Error fetching offer or company:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de l'offre.",
          variant: "destructive",
        });
      } finally {
        setLoadingOffer(false);
      }
    };

    fetchOfferAndCompany();
  }, [id, toast]);

  const handleApply = async () => {
    if (!offer || !user) return;
    
    try {
      setLoading(true);
      // Use the dataProvider to add the application
      await dataProvider.addApplication({
        company: offer.company,
        position: offer.title,
        location: offer.location,
        salary: offer.salary,
        type: offer.type,
        offerId: offer.id,
        studentId: user.id, // Using the authenticated user ID
        studentName: `${user.prenom || ''} ${user.nom || ''}`.trim()
      });
      
      setLoading(false);
      toast({
        title: "Succès",
        description: "Candidature envoyée avec succès !",
      });
      
      setTimeout(() => {
        navigate('/student/applications');
      }, 1000);
    } catch (error) {
      console.error('Error applying for offer:', error);
      setLoading(false);
      toast({
        title: "Erreur",
        description: "Échec de l'envoi de la candidature.",
        variant: "destructive",
      });
    }
  };

  if (loadingOffer) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Offre non trouvée</h1>
        <p>L'offre que vous cherchez n'existe pas ou a été supprimée.</p>
        <Button onClick={() => window.history.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Button onClick={() => window.history.back()} variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux offres
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    {company && company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={`${offer.company} logo`}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallbackIcon = document.createElement('div');
                            fallbackIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" className="text-primary"/><path d="M6 12H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" className="text-primary"/></svg>';
                            parent.appendChild(fallbackIcon);
                          }
                        }}
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">{offer.title}</CardTitle>
                    <p className="text-lg text-muted-foreground font-medium">{offer.company}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-base">{offer.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 text-base text-muted-foreground">
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {offer.location}</div>
                <div className="flex items-center gap-2"> {offer.salary}</div>
                <div className="flex items-center gap-2"><Clock className="w-5 h-5" /> Posté le {new Date(offer.postedDate || offer.posted || new Date().toISOString()).toLocaleDateString('fr-FR')}</div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Description du poste</h3>
                <p className="text-base whitespace-pre-line">{offer.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {offer.technologies?.map((tech: string) => (
                    <Badge key={tech} variant="default">{tech}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Exigences</h3>
                <ul className="list-disc list-inside space-y-1">
                  {offer.requirements?.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <Button size="lg" className="w-full" onClick={handleApply} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Envoi...' : 'Postuler maintenant'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {company ? (
            <LeafletMap
              studentLocation={profileData.personalInfo?.location}
              studentCoordinates={profileData.personalInfo?.coordinates}
              companies={[company]} // Pass only the relevant company
            />
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              Carte non disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferDetailPage;
