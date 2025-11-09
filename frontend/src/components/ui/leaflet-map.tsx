import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { MapPin, Building2 } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Company {
  id: string;
  name: string;
  location: string;
  coordinates?: [number, number];
  offers: number;
  distance?: number;
  logo?: string;
}

interface LeafletMapProps {
  studentLocation?: string;
  studentCoordinates?: [number, number];
  companies: Company[];
  className?: string;
}

// Custom icons
const studentIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="white" stroke-width="3"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const companyIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
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
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

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

// Component to fit map bounds
const FitBounds = ({ studentCoordinates, companies }: { studentCoordinates?: [number, number], companies: Company[] }) => {
  const map = useMap();
  
  useEffect(() => {
    const bounds = L.latLngBounds([]);
    
    if (studentCoordinates) {
      bounds.extend([studentCoordinates[1], studentCoordinates[0]]);
    }
    
    companies.forEach(company => {
      if (company.coordinates) {
        bounds.extend([company.coordinates[1], company.coordinates[0]]);
      }
    });
    
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, studentCoordinates, companies]);
  
  return null;
};

const LeafletMap = ({ 
  studentLocation, 
  studentCoordinates, 
  companies,
  className = ""
}: LeafletMapProps) => {
  // Position par défaut (Paris)
  const defaultCenter: [number, number] = [48.8566, 2.3522];
  const center = studentCoordinates ? [studentCoordinates[1], studentCoordinates[0]] as [number, number] : defaultCenter;

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
        <MapContainer
          center={center}
          zoom={10}
          style={{ height: '400px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <FitBounds studentCoordinates={studentCoordinates} companies={companies} />
          
          {/* Marqueur étudiant */}
          {studentCoordinates && (
            <Marker
              position={[studentCoordinates[1], studentCoordinates[0]]}
              icon={studentIcon}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <strong>Votre position</strong>
                  </div>
                  <p className="text-sm text-gray-600">{studentLocation || 'Position actuelle'}</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Marqueurs entreprises et lignes de distance */}
          {companies.map((company) => {
            if (!company.coordinates) return null;
            
            const [lng, lat] = company.coordinates;
            const distance = studentCoordinates 
              ? calculateDistance(studentCoordinates[1], studentCoordinates[0], lat, lng)
              : null;
            
            // Créer un icône personnalisé avec le logo de l'entreprise si disponible
            const companyMarkerIcon = company.logo ? 
              L.icon({
                iconUrl: company.logo,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
                className: 'company-logo-marker'
              }) :
              companyIcon; // Utiliser l'icône par défaut si pas de logo
            
            return (
              <React.Fragment key={company.id}>
                {/* Marqueur entreprise */}
                <Marker
                  position={[lat, lng]}
                  icon={companyMarkerIcon}
                >
                  <Popup>
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                        <strong>{company.name}</strong>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{company.location}</p>
                      <p className="text-sm text-blue-600">{company.offers} offre{company.offers > 1 ? 's' : ''} disponible{company.offers > 1 ? 's' : ''}</p>
                      {distance && <p className="text-xs text-gray-500 mt-1">Distance: {distance.toFixed(1)} km</p>}
                    </div>
                  </Popup>
                </Marker>
                
                {/* Ligne de distance */}
                {studentCoordinates && (
                  <Polyline
                    positions={[
                      [studentCoordinates[1], studentCoordinates[0]],
                      [lat, lng]
                    ]}
                    pathOptions={{ 
                      color: '#6B7280',
                      weight: 2,
                      opacity: 0.6,
                      dashArray: '5, 10'
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>
        
        {/* Légende */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 space-y-2 z-10">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Votre position</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
            <span>Entreprises</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-0.5 bg-gray-400 opacity-60" style={{ borderStyle: 'dashed' }}></div>
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

export default LeafletMap;