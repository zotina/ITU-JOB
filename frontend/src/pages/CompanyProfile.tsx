import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Mail, MapPin, Briefcase } from 'lucide-react';
import { mockCompanies } from '@/data/mockData';
import { useParams } from 'react-router-dom';

interface CompanyProfileProps {
  companyId?: string; // Si non fourni, on affiche une entreprise par défaut
}

const CompanyProfile = ({ companyId }: CompanyProfileProps) => {
  // Utiliser le paramètre de route s'il est disponible, sinon utiliser l'ID fourni
  const { id: urlCompanyId } = useParams<{ id: string }>();
  const idToUse = urlCompanyId || companyId;
  
  // Trouver l'entreprise par ID, ou chercher par nom si l'ID n'est pas trouvé
  let company = null;
  
  if (idToUse) {
    // D'abord, essayer de trouver par ID
    company = mockCompanies.find(c => c.id === idToUse);
    
    // Si pas trouvé par ID, essayer par nom
    if (!company) {
      company = mockCompanies.find(c => c.name === idToUse);
    }
  }

  // Si toujours pas trouvé, utiliser la première entreprise
  if (!company && mockCompanies.length > 0) {
    company = mockCompanies[0];
  }
  
  // Si aucune entreprise n'existe dans les données
  if (!company) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Aucune entreprise disponible</h2>
            <p className="text-muted-foreground">Aucune entreprise n'est enregistrée dans le système.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Entreprise non trouvée</h2>
            <p className="text-muted-foreground">L'entreprise demandée n'existe pas.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-24 h-24 rounded-xl object-cover shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {company.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{company.address.city}, {company.address.country}</span>
                </div>
                
                {company.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {company.website.replace('https://', '')}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{company.offers} offre{company.offers > 1 ? 's' : ''} ouverte{company.offers > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Description */}
          <section>
            <CardTitle className="mb-3">À propos</CardTitle>
            <p className="text-muted-foreground whitespace-pre-line">
              {company.description}
            </p>
          </section>
          
          {/* Informations de contact */}
          <section>
            <CardTitle className="mb-3">Informations de contact</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.contact && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <a 
                    href={`mailto:${company.contact}`} 
                    className="text-blue-500 hover:underline"
                  >
                    {company.contact}
                  </a>
                </div>
              )}
              
              {company.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </div>
          </section>
          
          {/* Offres de l'entreprise */}
          <section>
            <CardTitle className="mb-3">Offres de l'entreprise</CardTitle>
            <p className="text-muted-foreground">
              Cette entreprise propose actuellement {company.offers} offre{company.offers > 1 ? 's' : ''} d'emploi.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfile;