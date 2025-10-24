import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";

declare global {
  interface Window {
    google: any;
  }
}

interface LocationPickerProps {
  currentLocation: string;
  onLocationChange: (location: string, coordinates?: [number, number]) => void;
}

const LocationPicker = ({ currentLocation, onLocationChange }: LocationPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(currentLocation);
  const [tempCoordinates, setTempCoordinates] = useState<[number, number] | undefined>();
  const [address, setAddress] = useState(currentLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  const loadGoogleMaps = useCallback(async () => {
    const loader = new Loader({
      apiKey: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
      version: "weekly",
      libraries: ["places", "geometry"]
    });

    try {
      await loader.load();
      geocoder.current = new google.maps.Geocoder();
      return true;
    } catch (error) {
      console.error("Error loading Google Maps:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const initializeMap = async () => {
      const loaded = await loadGoogleMaps();
      if (!loaded || !mapContainer.current) return;

      // Petit délai pour s'assurer que le dialog est complètement ouvert
      setTimeout(() => {
        if (mapContainer.current && !map.current) {
          createMap();
        }
      }, 100);
    };

    initializeMap();

    return () => {
      // Nettoyage proper de la map
      if (map.current) {
        map.current = null;
      }
      if (marker.current) {
        marker.current.setMap(null);
        marker.current = null;
      }
    };
  }, [isOpen, loadGoogleMaps]);

  const createMap = () => {
    if (!mapContainer.current || map.current) return;

    // Obtenir la position actuelle de l'utilisateur ou utiliser une position par défaut
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        initializeGoogleMap(latitude, longitude);
      },
      () => {
        // Position par défaut (Paris)
        initializeGoogleMap(48.8566, 2.3522);
      }
    );
  };

  const initializeGoogleMap = (lat: number, lng: number) => {
    if (!mapContainer.current || !window.google) return;

    const mapOptions: google.maps.MapOptions = {
      center: { lat, lng },
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    map.current = new google.maps.Map(mapContainer.current, mapOptions);

    // Ajouter un événement de clic sur la carte
    map.current.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      
      const clickedLat = event.latLng.lat();
      const clickedLng = event.latLng.lng();

      // Supprimer le marqueur existant
      if (marker.current) {
        marker.current.setMap(null);
      }

      // Ajouter un nouveau marqueur
      marker.current = new google.maps.Marker({
        position: { lat: clickedLat, lng: clickedLng },
        map: map.current,
        title: "Position sélectionnée"
      });

      // Géocodage inverse avec Google Maps
      if (geocoder.current) {
        setIsLoading(true);
        geocoder.current.geocode(
          { location: { lat: clickedLat, lng: clickedLng } },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const placeName = results[0].formatted_address;
              setTempLocation(placeName);
              setTempCoordinates([clickedLng, clickedLat]);
              setAddress(placeName);
            } else {
              // Fallback avec coordonnées
              const fallbackName = `Lat: ${clickedLat.toFixed(6)}, Lng: ${clickedLng.toFixed(6)}`;
              setTempLocation(fallbackName);
              setTempCoordinates([clickedLng, clickedLat]);
              setAddress(fallbackName);
            }
            setIsLoading(false);
          }
        );
      }
    });

    // Forcer un redimensionnement de la carte
    setTimeout(() => {
      if (map.current) {
        google.maps.event.trigger(map.current, 'resize');
      }
    }, 100);
  };

  const handleSearchAddress = async () => {
    if (!searchAddress.trim() || !geocoder.current) return;

    try {
      setIsLoading(true);
      geocoder.current.geocode(
        { address: searchAddress },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const result = results[0];
            const location = result.geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            
            // Centrer la carte sur le résultat
            if (map.current) {
              map.current.setCenter({ lat, lng });
              map.current.setZoom(15);
              
              // Supprimer le marqueur existant
              if (marker.current) {
                marker.current.setMap(null);
              }
              
              // Ajouter un nouveau marqueur
              marker.current = new google.maps.Marker({
                position: { lat, lng },
                map: map.current,
                title: "Position recherchée"
              });
              
              setTempLocation(result.formatted_address);
              setTempCoordinates([lng, lat]);
              setAddress(result.formatted_address);
            }
          }
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    onLocationChange(tempLocation, tempCoordinates);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempLocation(currentLocation);
    setTempCoordinates(undefined);
    setAddress(currentLocation);
    setSearchAddress("");
    
    // Nettoyage du marqueur
    if (marker.current) {
      marker.current.setMap(null);
      marker.current = null;
    }
    
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Nettoyage complet lors de la fermeture
      setTempLocation(currentLocation);
      setTempCoordinates(undefined);
      setAddress(currentLocation);
      setSearchAddress("");
      setIsLoading(false);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="gap-2">
            <MapPin className="w-4 h-4" />
            Choisir sur la carte
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[600px]">
          <DialogHeader>
            <DialogTitle>Sélectionner votre localisation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 h-full flex flex-col">
            {/* Barre de recherche */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="search-address">Rechercher une adresse</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="search-address"
                    type="text"
                    placeholder="Entrez une adresse (ex: 1 rue de Rivoli, Paris)"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchAddress()}
                  />
                  <Button 
                    onClick={handleSearchAddress} 
                    disabled={isLoading || !searchAddress.trim()}
                    variant="outline"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Rechercher'
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Adresse sélectionnée */}
            <div>
              <Label htmlFor="address">Adresse sélectionnée</Label>
              <Input
                id="address"
                type="text"
                placeholder="Cliquez sur la carte pour sélectionner une position"
                value={address}
                readOnly
                className="bg-muted"
              />
            </div>
            
            {/* Carte */}
            <div 
              ref={mapContainer} 
              className="flex-1 w-full rounded-lg border min-h-[300px]"
            />
            
            {/* Instructions */}
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <p className="font-medium mb-1">💡 Comment utiliser :</p>
              <ul className="space-y-1">
                <li>• Recherchez une adresse dans la barre de recherche</li>
                <li>• Ou cliquez directement sur la carte pour sélectionner une position</li>
                <li>• La position sera automatiquement géocodée</li>
              </ul>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!tempLocation || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Chargement...
                  </>
                ) : (
                  'Confirmer la localisation'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

export default LocationPicker;