import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Phone, Mail, Globe, Edit3 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { mockCompanies } from '@/data/mockData';

interface RecruiterProfileProps {
  isReadOnly?: boolean; // Prop pour déterminer si le profil est en mode lecture seule
}

const RecruiterProfile = ({ isReadOnly = false }: RecruiterProfileProps) => {
  const { id: companyId } = useParams<{ id: string }>();
  
  // Si un companyId est fourni dans l'URL, utiliser les données de l'entreprise correspondante
  // Sinon, utiliser les données par défaut pour le recruteur connecté
  let companyData, recruiterData;
  
  if (companyId) {
    // Trouver l'entreprise par ID ou par nom
    const company = mockCompanies.find(c => c.id === companyId || c.name === companyId);
    
    if (company) {
      companyData = {
        name: company.name,
        description: company.description,
        industry: 'Technologie / Software', // Données par défaut pour l'industrie
        size: '50-200 employés', // Données par défaut pour la taille
        website: company.website || '',
        location: `${company.address.city}, ${company.address.country}`,
        email: company.contact || 'contact@entreprise.com',
        phone: '+33 1 23 45 67 89', // Données par défaut pour le téléphone
        founded: '2015' // Données par défaut pour l'année de création
      };
      
      recruiterData = {
        name: 'Contact Recrutement',
        role: 'Responsable Recrutement',
        email: company.contact || 'contact@entreprise.com',
        phone: '+33 6 12 34 56 78'
      };
    } else {
      // Si l'entreprise n'est pas trouvée, utiliser des données par défaut
      companyData = {
        name: 'Entreprise Inconnue',
        description: 'Aucune description disponible.',
        industry: 'Non spécifié',
        size: 'Non spécifié',
        website: '',
        location: 'Non spécifié',
        email: 'contact@entreprise.com',
        phone: '+33 1 23 45 67 89',
        founded: 'Non spécifié'
      };
      
      recruiterData = {
        name: 'Contact',
        role: 'Responsable Recrutement',
        email: 'contact@entreprise.com',
        phone: '+33 6 12 34 56 78'
      };
    }
  } else {
    // Données par défaut pour le recruteur connecté
    companyData = {
      name: 'TechStart Solutions',
      description: 'Startup innovante spécialisée dans le développement d\'applications web modernes et de solutions SaaS pour les entreprises.',
      industry: 'Technologie / Software',
      size: '50-100 employés',
      website: 'https://techstart-solutions.com',
      location: 'Paris, France',
      email: 'contact@techstart-solutions.com',
      phone: '+33 1 23 45 67 89',
      founded: '2019'
    };

    recruiterData = {
      name: 'Marie Dubois',
      role: 'Responsable Recrutement',
      email: 'marie.dubois@techstart-solutions.com',
      phone: '+33 6 12 34 56 78'
    };
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profil Entreprise</h1>
          {!isReadOnly && (
            <Button className="gap-2">
              <Edit3 className="w-4 h-4" />
              Modifier
            </Button>
          )}
        </div>

        {/* Informations entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informations Entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom de l'entreprise</label>
                  <p className="text-lg font-semibold">{companyData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Secteur d'activité</label>
                  <p>{companyData.industry}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Taille de l'entreprise</label>
                  <p>{companyData.size}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Année de création</label>
                  <p>{companyData.founded}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{companyData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span>{companyData.website}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{companyData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{companyData.phone}</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="mt-1">{companyData.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Informations recruteur */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Recruteur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="text-lg font-semibold">{recruiterData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Poste</label>
                  <p>{recruiterData.role}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{recruiterData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{recruiterData.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        {!isReadOnly && (
             <Card>
              <CardHeader>
                <CardTitle>Statistiques de Recrutement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">6</p>
                    <p className="text-sm text-muted-foreground">Offres actives</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">127</p>
                    <p className="text-sm text-muted-foreground">Candidatures reçues</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">15</p>
                    <p className="text-sm text-muted-foreground">Entretiens planifiés</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">4</p>
                    <p className="text-sm text-muted-foreground">Embauches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
       
      </div>
    </div>
  );
};

export default RecruiterProfile;