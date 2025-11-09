import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockOffers, mockCompanies } from '@/data/mockData';
import { addApplication } from '@/data/applicationStore';
import { useProfileData } from '@/hooks/useProfileData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LeafletMap from '@/components/ui/leaflet-map';
import { Building2, MapPin, Euro, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OfferDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profileData } = useProfileData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Find the offer and company based on the ID from the URL
  const offer = mockOffers.find(o => o.id === id);
  const company = mockCompanies.find(c => c.name === offer?.company);

  const handleApply = () => {
    if (!offer) return;
    
    setLoading(true);
    setTimeout(() => {
      addApplication({
        company: offer.company,
        position: offer.title,
        location: offer.location,
        salary: offer.salary,
        type: offer.type,
        offerId: offer.id
      });
      
      setLoading(false);
      toast({
        title: "Succès",
        description: "Candidature envoyée avec succès !",
      });
      
      setTimeout(() => {
        navigate('/student/applications');
      }, 1000);
    }, 1500);
  };

  if (!offer || !company) {
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
                    <Building2 className="w-8 h-8 text-primary" />
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
                <div className="flex items-center gap-2"><Clock className="w-5 h-5" /> Posté le {offer.posted}</div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Description du poste</h3>
                <p className="text-base whitespace-pre-wrap">{offer.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {offer.technologies.map((tech) => (
                    <Badge key={tech} variant="default">{tech}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Exigences</h3>
                <ul className="list-disc list-inside space-y-1">
                  {offer.requirements.map((req, index) => (
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
          <LeafletMap
            studentLocation={profileData.personalInfo.location}
            studentCoordinates={profileData.personalInfo.coordinates}
            companies={[company]} // Pass only the relevant company
          />
        </div>
      </div>
    </div>
  );
};

export default OfferDetailPage;
