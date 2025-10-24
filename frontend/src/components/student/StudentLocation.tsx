import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Home, Briefcase } from 'lucide-react';

const StudentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState('Paris, 75001');
  const [searchRadius, setSearchRadius] = useState('25');

  const nearbyOffers = [
    { company: 'TechStart Solutions', distance: '2.3 km', time: '15 min en métro' },
    { company: 'InnovateCorp', distance: '5.7 km', time: '25 min en RER' },
    { company: 'DataIntel Labs', distance: '8.2 km', time: '35 min en voiture' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <MapPin className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Localisation et Mobilité</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration de localisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Ma localisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse actuelle</label>
              <Input
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="Entrez votre adresse"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Rayon de recherche (km)</label>
              <Input
                type="number"
                value={searchRadius}
                onChange={(e) => setSearchRadius(e.target.value)}
                placeholder="25"
              />
            </div>

            <Button className="w-full">
              <Navigation className="w-4 h-4 mr-2" />
              Utiliser ma position actuelle
            </Button>
          </CardContent>
        </Card>

        {/* Offres à proximité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Offres à proximité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nearbyOffers.map((offer, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{offer.company}</h4>
                    <span className="text-sm text-muted-foreground">{offer.distance}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{offer.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carte simulée */}
      <Card>
        <CardHeader>
          <CardTitle>Carte des opportunités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Carte interactive des offres d'emploi</p>
              <p className="text-sm text-muted-foreground mt-1">
                Visualisez les trajets vers les entreprises
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLocation;