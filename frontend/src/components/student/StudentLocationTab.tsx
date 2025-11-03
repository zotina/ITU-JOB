import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LeafletLocationPicker from "@/components/ui/leaflet-location-picker";
import OpportunitiesMap from "@/components/ui/opportunities-map";
import { useProfileData } from "@/hooks/useProfileData";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { mockCompanies } from "@/data/mockData";

const StudentLocationTab = () => {
  const { profileData, setProfileData } = useProfileData();
  const { toast } = useToast();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Géocodage inverse avec Nominatim
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            let locationName = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
            
            if (data && data.display_name) {
              locationName = data.display_name;
            }
            
            handleLocationChange(locationName, [longitude, latitude]);
            
            toast({
              title: "Position récupérée",
              description: "Votre position actuelle a été enregistrée.",
            });
          } catch (error) {
            console.error('Erreur lors du géocodage inverse:', error);
            // Fallback avec coordonnées brutes
            handleLocationChange(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`, [longitude, latitude]);
            
            toast({
              title: "Position récupérée",
              description: "Votre position a été enregistrée avec les coordonnées.",
            });
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          setIsGettingLocation(false);
          let errorMessage = "Veuillez autoriser l'accès à votre position ou saisir manuellement votre adresse.";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "L'accès à la géolocalisation a été refusé. Veuillez l'autoriser dans les paramètres de votre navigateur.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Les informations de localisation ne sont pas disponibles.";
              break;
            case error.TIMEOUT:
              errorMessage = "La demande de géolocalisation a expiré.";
              break;
          }
          
          toast({
            title: "Géolocalisation indisponible", 
            description: errorMessage,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      toast({
        title: "Géolocalisation indisponible",
        description: "Votre navigateur ne supporte pas la géolocalisation.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-0 shadow-elegant">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Ma Localisation</h2>
              <p className="text-muted-foreground">Gérez votre position géographique pour les opportunités</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">Position actuelle</span>
              </div>
              <p className="text-foreground break-words">
                {profileData.personalInfo.location || "Aucune position définie"}
              </p>
              {profileData.personalInfo.coordinates && (
                <p className="text-sm text-muted-foreground mt-1">
                  Coordonnées: {profileData.personalInfo.coordinates[1].toFixed(6)}, {profileData.personalInfo.coordinates[0].toFixed(6)}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <LeafletLocationPicker
                currentLocation={profileData.personalInfo.location || ""}
                onLocationChange={handleLocationChange}
              />
              
              <Button 
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                variant="outline" 
                className="gap-2"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Localisation en cours...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    Utiliser ma position actuelle
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <h3 className="font-medium text-foreground mb-2">💡 Pourquoi ma localisation ?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Trouvez des offres près de chez vous</li>
              <li>• Les recruteurs peuvent voir votre zone géographique</li>
              <li>• Optimisez vos chances pour les postes locaux</li>
              <li>• Filtrez les opportunités par distance</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentLocationTab;