import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
 
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, Edit } from 'lucide-react';
import LeafletMap from '@/components/ui/leaflet-map';
import { mockCompanies, mockOffers } from '@/data/mockData';
import { useProfileData } from '@/hooks/useProfileData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LeafletLocationPicker from '@/components/ui/leaflet-location-picker';
import { useToast } from '@/hooks/use-toast';

const StudentLocation = () => {
  const navigate = useNavigate();
  const { profileData, setProfileData } = useProfileData();
  const { toast } = useToast();
  const [radius, setRadius] = useState(50); // Default radius in km

  const handleLocationChange = (location: string, coordinates?: [number, number]) => {
    setProfileData(prevData => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        location,
        coordinates
      }
    }));
    
    toast({
      title: "Localisation mise à jour",
      description: "Votre position a été enregistrée avec succès.",
    });
  };

  const haversineDistance = (
    coords1: [number, number],
    coords2: [number, number]
  ): number => {
    const toRad = (x: number) => (x * Math.PI) / 180;

    const R = 6371; // Earth radius in km
    const dLat = toRad(coords2[0] - coords1[0]);
    const dLon = toRad(coords2[1] - coords1[1]);
    const lat1 = toRad(coords1[0]);
    const lat2 = toRad(coords2[0]);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredCompanies = profileData.personalInfo.coordinates
    ? mockCompanies.filter(company => {
        if (!company.coordinates) return false;
        const distance = haversineDistance(profileData.personalInfo.coordinates!, company.coordinates as [number, number]);
        return distance <= radius;
      })
    : mockCompanies;

  const offersInRadius = mockOffers.filter(offer => 
    filteredCompanies.some(company => company.name === offer.company)
  );

  const handleNavigateToOffers = () => {
    const companyNames = filteredCompanies.map(c => c.name).join(',');
    if (companyNames) {
      navigate(`/student/offers?companies=${encodeURIComponent(companyNames)}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Navigation className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Localisation</h1>
          <p className="text-muted-foreground">
            Gérez votre localisation et découvrez les opportunités à proximité
          </p>
        </div>
      </div>

      {/* Informations de localisation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Votre Position</h2>
          </div>
          <LeafletLocationPicker
            currentLocation={profileData.personalInfo.location || ""}
            onLocationChange={handleLocationChange}
            trigger={
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Modifier
              </Button>
            }
          />
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Adresse actuelle</p>
          <p className="text-base text-foreground">
            {profileData.personalInfo.location || "Aucune localisation définie"}
          </p>
          </div>
          
          {profileData.personalInfo.coordinates && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Latitude</p>
                <p className="text-base text-foreground font-mono">
                  {profileData.personalInfo.coordinates[1].toFixed(6)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Longitude</p>
                <p className="text-base text-foreground font-mono">
                  {profileData.personalInfo.coordinates[0].toFixed(6)}
                </p>
              </div>
            </div>
          )}
          
          {!profileData.personalInfo.location && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                💡 Définissez votre localisation dans votre profil pour voir les distances et recommandations personnalisées.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Filtre de distance */}
      {profileData.personalInfo.coordinates && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Filtrer par distance (km)</h3>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="max-w-xs"
              placeholder="Rayon en km"
            />
          </div>
        </Card>
      )}

      {/* Carte des opportunités */}
      <LeafletMap
        studentLocation={profileData.personalInfo.location}
        studentCoordinates={profileData.personalInfo.coordinates}
        companies={filteredCompanies}
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={handleNavigateToOffers}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {offersInRadius.length}
            </p>
            <p className="text-sm text-muted-foreground">Offres disponibles {profileData.personalInfo.coordinates && `(rayon ${radius} km)`}</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {filteredCompanies.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Entreprises localisées {profileData.personalInfo.coordinates && `(rayon ${radius} km)`}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentLocation;