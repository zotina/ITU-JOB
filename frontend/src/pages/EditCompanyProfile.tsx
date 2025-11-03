import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockCompanies, updateCompany, Company } from '@/data/mockData';
import { MapPin, Globe, Mail, Upload } from 'lucide-react';
import ImageUpload from '@/components/ui/image-upload';

const EditCompanyProfile = () => {
  // Pour l'instant, on édite la première entreprise - dans une vraie app, on aurait l'ID de l'entreprise connectée
  const initialCompany = mockCompanies[0];
  const [company, setCompany] = useState<Company>({...initialCompany});
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleUpdate = () => {
    // Mettre à jour les données dans mockData
    updateCompany(company.id, company);
    
    setIsEditing(false);
    
    toast({
      title: "Profil entreprise mis à jour",
      description: "Les informations de votre entreprise ont été sauvegardées avec succès.",
    });
  };

  const handleCancel = () => {
    // Recharger les données initiales
    setCompany({...initialCompany});
    setIsEditing(false);
    
    toast({
      title: "Modification annulée",
      description: "Les modifications n'ont pas été sauvegardées.",
    });
  };

  const updateCompanyData = (field: string, value: any) => {
    setCompany(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateCompanyAddress = (field: string, value: string) => {
    setCompany(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Profil de l'entreprise</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <ImageUpload
                currentImage={company.logo || "/src/assets/company-logos/default-logo.png"}
                onImageChange={(url) => updateCompanyData('logo', url)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <div>
                <Label htmlFor="company-name">Nom de l'entreprise</Label>
                <Input
                  id="company-name"
                  value={company.name}
                  onChange={(e) => updateCompanyData('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="company-description">Description</Label>
                <Textarea
                  id="company-description"
                  value={company.description}
                  onChange={(e) => updateCompanyData('description', e.target.value)}
                  disabled={!isEditing}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-city">Ville</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company-city"
                  value={company.address.city}
                  onChange={(e) => updateCompanyAddress('city', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="company-country">Pays</Label>
              <Input
                id="company-country"
                value={company.address.country}
                onChange={(e) => updateCompanyAddress('country', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="company-website">Site web</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company-website"
                  value={company.website || ''}
                  onChange={(e) => updateCompanyData('website', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="company-contact">Contact</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company-contact"
                  value={company.contact || ''}
                  onChange={(e) => updateCompanyData('contact', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Modifier le profil
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
                <Button onClick={handleUpdate}>
                  Sauvegarder
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCompanyProfile;