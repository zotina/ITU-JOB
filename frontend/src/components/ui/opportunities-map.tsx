import React, { useRef, useEffect, useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, User } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";

interface Company {
  id: string;
  name: string;
  location: string;
  coordinates?: [number, number];
  offers: number;
  distance?: number;
}

interface OpportunitiesMapProps {
  studentLocation?: string;
  studentCoordinates?: [number, number];
  companies: Company[];
  className?: string;
}

const OpportunitiesMap = ({ 
  studentLocation, 
  studentCoordinates, 
  companies,
  className = ""
}: OpportunitiesMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const lines = useRef<google.maps.Polyline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGoogleMaps = useCallback(async () => {
    const loader = new Loader({
      apiKey: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
      version: "weekly",
      libraries: ["places", "geometry"]
    });

    try {
      await loader.load();
      return true;
    } catch (error) {
      console.error("Error loading Google Maps:", error);
      return false;
    }
  }, []);

  const clearMarkersAndLines = () => {
    // Supprimer les marqueurs existants
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];
    
    // Supprimer les lignes existantes
    lines.current.forEach(line => line.setMap(null));
    lines.current = [];
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const initializeMap = useCallback(async () => {
    const loaded = await loadGoogleMaps();
    if (!loaded || !mapContainer.current) {
      setIsLoading(false);
      return;
    }

    // Position par défaut (Paris)
    let centerLat = 48.8566;
    let centerLng = 2.3522;

    // Utiliser la position de l'étudiant si disponible
    if (studentCoordinates) {
      centerLng = studentCoordinates[0];
      centerLat = studentCoordinates[1];
    }

    const mapOptions: google.maps.MapOptions = {
      center: { lat: centerLat, lng: centerLng },
      zoom: 10,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    map.current = new google.maps.Map(mapContainer.current, mapOptions);

    // Ajouter le marqueur de l'étudiant
    if (studentCoordinates) {
      const studentMarker = new google.maps.Marker({
        position: { lat: centerLat, lng: centerLng },
        map: map.current,
        title: "Votre position",
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="white" stroke-width="3"/>
              <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        }
      });

      markers.current.push(studentMarker);

      // InfoWindow pour l'étudiant
      const studentInfoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
              <strong>Votre position</strong>
            </div>
            <p class="text-sm text-gray-600">${studentLocation || 'Position actuelle'}</p>
          </div>
        `
      });

      studentMarker.addListener('click', () => {
        studentInfoWindow.open(map.current, studentMarker);
      });
    }

    // Ajouter les marqueurs des entreprises et les lignes de distance
    companies.forEach((company, index) => {
      if (!company.coordinates) return;

      const [lng, lat] = company.coordinates;
      const distance = studentCoordinates 
        ? calculateDistance(centerLat, centerLng, lat, lng)
        : null;

      // Marqueur de l'entreprise
      const companyMarker = new google.maps.Marker({
        position: { lat, lng },
        map: map.current,
        title: company.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#10B981" stroke="white" stroke-width="3"/>
              <rect x="10" y="8" width="12" height="16" fill="white" rx="1"/>
              <rect x="12" y="10" width="2" height="2" fill="#10B981"/>
              <rect x="15" y="10" width="2" height="2" fill="#10B981"/>
              <rect x="18" y="10" width="2" height="2" fill="#10B981"/>
              <rect x="12" y="13" width="2" height="2" fill="#10B981"/>
              <rect x="15" y="13" width="2" height="2" fill="#10B981"/>
              <rect x="18" y="13" width="2" height="2" fill="#10B981"/>
              <rect x="12" y="16" width="8" height="2" fill="#10B981"/>
              <rect x="14" y="18" width="4" height="4" fill="#10B981"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      });

      markers.current.push(companyMarker);

      // InfoWindow pour l'entreprise
      const companyInfoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-4 h-4 bg-green-500 rounded-sm"></div>
              <strong>${company.name}</strong>
            </div>
            <p class="text-sm text-gray-600 mb-1">${company.location}</p>
            <p class="text-sm text-blue-600">${company.offers} offre${company.offers > 1 ? 's' : ''} disponible${company.offers > 1 ? 's' : ''}</p>
            ${distance ? `<p class="text-xs text-gray-500 mt-1">Distance: ${distance.toFixed(1)} km</p>` : ''}
          </div>
        `
      });

      companyMarker.addListener('click', () => {
        companyInfoWindow.open(map.current, companyMarker);
      });

      // Ligne de distance si l'étudiant a une position
      if (studentCoordinates && distance) {
        const line = new google.maps.Polyline({
          path: [
            { lat: centerLat, lng: centerLng },
            { lat, lng }
          ],
          geodesic: true,
          strokeColor: '#6B7280',
          strokeOpacity: 0.6,
          strokeWeight: 2,
          icons: [{
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 3,
              fillColor: '#6B7280',
              fillOpacity: 0.8,
              strokeWeight: 0
            },
            offset: '100%'
          }]
        });

        line.setMap(map.current);
        lines.current.push(line);

        // Label de distance au milieu de la ligne
        const midLat = (centerLat + lat) / 2;
        const midLng = (centerLng + lng) / 2;

        const distanceLabel = new google.maps.Marker({
          position: { lat: midLat, lng: midLng },
          map: map.current,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="60" height="24" rx="12" fill="white" stroke="#E5E7EB" stroke-width="1"/>
                <text x="30" y="15" text-anchor="middle" font-family="Arial" font-size="11" fill="#374151">${distance.toFixed(1)} km</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(60, 24),
            anchor: new google.maps.Point(30, 12)
          }
        });

        markers.current.push(distanceLabel);
      }
    });

    // Ajuster la vue pour inclure tous les marqueurs
    if (markers.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.current.forEach(marker => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      map.current.fitBounds(bounds);
      
      // Zoom minimum pour éviter un zoom trop élevé
      const listener = google.maps.event.addListener(map.current, "idle", () => {
        if (map.current && map.current.getZoom() && map.current.getZoom()! > 15) {
          map.current.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      });
    }

    setIsLoading(false);
  }, [studentCoordinates, studentLocation, companies, loadGoogleMaps]);

  useEffect(() => {
    initializeMap();
    
    return () => {
      clearMarkersAndLines();
    };
  }, [initializeMap]);

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-muted-foreground">Chargement de la carte...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Carte des Opportunités</h3>
            <p className="text-sm text-muted-foreground">
              Découvrez les entreprises près de chez vous
            </p>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div ref={mapContainer} className="w-full h-96" />
        
        {/* Légende */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Votre position</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
              <Building2 className="w-2 h-2 text-white" />
            </div>
            <span>Entreprises</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-0.5 bg-gray-400"></div>
            <span>Distance</span>
          </div>
        </div>
      </div>
      
      {!studentCoordinates && (
        <div className="p-4 bg-amber-50 border-t border-amber-200">
          <div className="flex items-center gap-2 text-amber-800">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">
              Définissez votre localisation dans votre profil pour voir les distances
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default OpportunitiesMap;