import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  currentLocation: string;
  onLocationChange: (location: string, coordinates?: [number, number]) => void;
}

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to update map center
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 13);
  }, [map, center]);
  
  return null;
};

const LeafletLocationPicker = ({ currentLocation, onLocationChange }: LocationPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(currentLocation);
  const [tempCoordinates, setTempCoordinates] = useState<[number, number] | undefined>();
  const [address, setAddress] = useState(currentLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  const [markerPosition, setMarkerPosition] = useState<[number, number] | undefined>();
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Paris par défaut

  // Reverse geocoding using Nominatim (OpenStreetMap)
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`
      );
      const data = await response.json();
      return data.display_name || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Erreur de géocodage inverse:', error);
      return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    }
  };

  // Forward geocoding using Nominatim
  const forwardGeocode = async (address: string): Promise<{ lat: number; lng: number; display_name: string } | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&accept-language=fr`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          display_name: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      return null;
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setIsLoading(true);
    setMarkerPosition([lat, lng]);
    
    try {
      const addressName = await reverseGeocode(lat, lng);
      setTempLocation(addressName);
      setTempCoordinates([lng, lat]); // Longitude first for our format
      setAddress(addressName);
    } catch (error) {
      const fallbackName = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      setTempLocation(fallbackName);
      setTempCoordinates([lng, lat]);
      setAddress(fallbackName);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAddress = async () => {
    if (!searchAddress.trim()) return;

    try {
      setIsLoading(true);
      const result = await forwardGeocode(searchAddress);
      
      if (result) {
        const { lat, lng, display_name } = result;
        setMapCenter([lat, lng]);
        setMarkerPosition([lat, lng]);
        setTempLocation(display_name);
        setTempCoordinates([lng, lat]);
        setAddress(display_name);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
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
    setMarkerPosition(undefined);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    } else {
      // Get user's current location when opening
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMapCenter([latitude, longitude]);
          },
          () => {
            // Use default Paris location if geolocation fails
            setMapCenter([48.8566, 2.3522]);
          }
        );
      }
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
                    <>
                      <Search className="w-4 h-4 mr-1" />
                      Rechercher
                    </>
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
          <div className="flex-1 w-full rounded-lg border min-h-[300px] overflow-hidden">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler onLocationSelect={handleMapClick} />
              <MapController center={mapCenter} />
              
              {markerPosition && (
                <Marker position={markerPosition} />
              )}
            </MapContainer>
          </div>
          
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

export default LeafletLocationPicker;