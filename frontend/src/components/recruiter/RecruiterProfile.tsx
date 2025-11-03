import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Building2, MapPin, Phone, Mail, Globe, Edit3, Save, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { mockCompanies, updateCompany } from '@/data/mockData';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RecruiterProfileProps {
  isReadOnly?: boolean; // Prop pour déterminer si le profil est en mode lecture seule
}

const RecruiterProfile = ({ isReadOnly = false }: RecruiterProfileProps) => {
  const { id: companyId } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  // Si un companyId est fourni dans l'URL, utiliser les données de l'entreprise correspondante
  // Sinon, utiliser les données par défaut pour le recruteur connecté
  let baseCompanyData, baseRecruiterData;
  
  if (companyId) {
    // Trouver l'entreprise par ID ou par nom
    const company = mockCompanies.find(c => c.id === companyId || c.name === companyId);
    
    if (company) {
      baseCompanyData = {
        id: company.id,
        name: company.name,
        description: company.description,
        industry: 'Technologie / Software',
        size: '50-200 employés',
        website: company.website || '',
        location: `${company.address.city}, ${company.address.country}`,
        email: company.contact || 'contact@entreprise.com',
        phone: '+33 1 23 45 67 89',
        founded: '2015'
      };
      
      baseRecruiterData = {
        name: 'Contact Recrutement',
        role: 'Responsable Recrutement',
        email: company.contact || 'contact@entreprise.com',
        phone: '+33 6 12 34 56 78'
      };
    } else {
      // Si l'entreprise n'est pas trouvée, utiliser des données par défaut
      baseCompanyData = {
        id: '',
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
      
      baseRecruiterData = {
        name: 'Contact',
        role: 'Responsable Recrutement',
        email: 'contact@entreprise.com',
        phone: '+33 6 12 34 56 78'
      };
    }
  } else {
    // Données par défaut pour le recruteur connecté
    baseCompanyData = {
      id: '1',
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

    baseRecruiterData = {
      name: 'Marie Dubois',
      role: 'Responsable Recrutement',
      email: 'marie.dubois@techstart-solutions.com',
      phone: '+33 6 12 34 56 78'
    };
  }
  
  // États pour stocker les données éditables
  const [editedCompanyData, setEditedCompanyData] = useState<any>({...baseCompanyData});
  const [editedRecruiterData, setEditedRecruiterData] = useState<any>({...baseRecruiterData});
  
  // Fonction pour activer le mode édition
  const startEditing = () => {
    setEditedCompanyData({...baseCompanyData});
    setEditedRecruiterData({...baseRecruiterData});
    setIsEditing(true);
  };
  
  // Fonction pour annuler les modifications
  const cancelEditing = () => {
    setEditedCompanyData({...baseCompanyData});
    setEditedRecruiterData({...baseRecruiterData});
    setIsEditing(false);
  };
  
  // Fonction pour sauvegarder les modifications
  const saveChanges = () => {
    // Si ce n'est pas en mode lecture seule et que ce n'est pas une vue d'entreprise spécifique, on peut sauvegarder
    if (!isReadOnly && !companyId) {
      // Mettre à jour les données de l'entreprise dans le mockData
      updateCompany(editedCompanyData.id, {
        name: editedCompanyData.name,
        description: editedCompanyData.description,
        website: editedCompanyData.website,
        contact: editedCompanyData.email,
        address: {
          city: editedCompanyData.location.includes(',') ? editedCompanyData.location.split(',')[0].trim() : editedCompanyData.location,
          country: editedCompanyData.location.includes(',') ? editedCompanyData.location.split(',')[1].trim() : 'France'
        }
      });
      
      toast({
        title: "Profil mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    }
    
    setIsEditing(false);
  };
  
  // Données à afficher (celles en cours d'édition si en mode édition, sinon les données de base)
  const companyData = isEditing ? editedCompanyData : baseCompanyData;
  const recruiterData = isEditing ? editedRecruiterData : baseRecruiterData;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profil Entreprise</h1>
          {!isReadOnly && (
            <>
              {!isEditing ? (
                <Button className="gap-2" onClick={startEditing}>
                  <Edit3 className="w-4 h-4" />
                  Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={cancelEditing} className="gap-2">
                    <X className="w-4 h-4" />
                    Annuler
                  </Button>
                  <Button onClick={saveChanges} className="gap-2">
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </Button>
                </div>
              )}
            </>
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
                  {isEditing ? (
                    <Input
                      value={editedCompanyData.name}
                      onChange={(e) => setEditedCompanyData(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{companyData.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Secteur d'activité</label>
                  {isEditing ? (
                    <Input
                      value={editedCompanyData.industry}
                      onChange={(e) => setEditedCompanyData(prev => ({
                        ...prev,
                        industry: e.target.value
                      }))}
                    />
                  ) : (
                    <p>{companyData.industry}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Taille de l'entreprise</label>
                  {isEditing ? (
                    <Input
                      value={editedCompanyData.size}
                      onChange={(e) => setEditedCompanyData(prev => ({
                        ...prev,
                        size: e.target.value
                      }))}
                    />
                  ) : (
                    <p>{companyData.size}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Année de création</label>
                  {isEditing ? (
                    <Input
                      value={editedCompanyData.founded}
                      onChange={(e) => setEditedCompanyData(prev => ({
                        ...prev,
                        founded: e.target.value
                      }))}
                    />
                  ) : (
                    <p>{companyData.founded}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Localisation</label>
                  {isEditing ? (
                    <Input
                      value={editedCompanyData.location}
                      onChange={(e) => setEditedCompanyData(prev => ({
                        ...prev,
                        location: e.target.value
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{companyData.location}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Site web</label>
                  {isEditing ? (
                    <Input
                      value={editedCompanyData.website}
                      onChange={(e) => setEditedCompanyData(prev => ({
                        ...prev,
                        website: e.target.value
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span>{companyData.website}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  {isEditing ? (
                    <Input
                      value={editedCompanyData.email}
                      onChange={(e) => setEditedCompanyData(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{companyData.email}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                  {isEditing ? (
                    <Input
                      value={editedCompanyData.phone}
                      onChange={(e) => setEditedCompanyData(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{companyData.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              {isEditing ? (
                <Textarea
                  value={editedCompanyData.description}
                  onChange={(e) => setEditedCompanyData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{companyData.description}</p>
              )}
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
                  {isEditing ? (
                    <Input
                      value={editedRecruiterData.name}
                      onChange={(e) => setEditedRecruiterData(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{recruiterData.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Poste</label>
                  {isEditing ? (
                    <Input
                      value={editedRecruiterData.role}
                      onChange={(e) => setEditedRecruiterData(prev => ({
                        ...prev,
                        role: e.target.value
                      }))}
                    />
                  ) : (
                    <p>{recruiterData.role}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  {isEditing ? (
                    <Input
                      value={editedRecruiterData.email}
                      onChange={(e) => setEditedRecruiterData(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{recruiterData.email}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                  {isEditing ? (
                    <Input
                      value={editedRecruiterData.phone}
                      onChange={(e) => setEditedRecruiterData(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{recruiterData.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        {!isReadOnly && !isEditing && (
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