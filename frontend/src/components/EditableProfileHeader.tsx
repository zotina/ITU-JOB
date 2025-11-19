import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ui/image-upload";
import LocationPicker from "@/components/ui/location-picker";
import { ProfileData } from "@/hooks/useProfileData";
import { ProfileProgressBadge } from "./ui/profile-progress-badge";

interface EditableProfileHeaderProps {
  profileData: ProfileData;
  isEditing: boolean;
  onUpdate: (data: Partial<ProfileData>) => void;
  startEditing: () => void;
  hideHeader?: boolean;
}

const EditableProfileHeader = ({ profileData, isEditing, onUpdate, startEditing, hideHeader = false }: EditableProfileHeaderProps) => {
  console.log("EditableProfileHeader - profileData:", profileData);
  
  const updatePersonalInfo = (field: string, value: string | boolean | [number, number]) => {
    if (field === 'nom') {
      // For nom, update at the root level of profileData
      onUpdate({
        nom: value as string
      } as Partial<ProfileData>);
    } else if (field === 'prenom') {
      // For prenom, update at the root level of profileData
      onUpdate({
        prenom: value as string
      } as Partial<ProfileData>);
    } else if (field === 'email') {
      // For email, update at the root level of profileData
      onUpdate({
        email: value as string
      } as Partial<ProfileData>);
    } else {
      // For other fields, update in personalInfo - use current personalInfo from profileData
      onUpdate({
        personalInfo: {
          ...(profileData?.personalInfo || {}),
          [field]: value
        }
      });
    }
  };

  const handleLocationChange = (location: string, coordinates?: [number, number]) => {
    onUpdate({
      personalInfo: {
        ...(profileData?.personalInfo || {}),
        location,
        coordinates
      }
    });
  };

  if (isEditing) {
    return (
      <Card className="p-8 bg-gradient-to-br from-card to-muted/20 border-0 shadow-elegant">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <ImageUpload
            currentImage={profileData?.personalInfo?.profileImage || ''}
            onImageChange={(imageUrl) => updatePersonalInfo("profileImage", imageUrl)}
          />
          
          <div className="flex-1 space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="prenom" className="flex items-center">Prénom
                  {!profileData.prenom && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="prenom"
                  value={profileData.prenom || ''}
                  onChange={(e) => updatePersonalInfo("prenom", e.target.value)}
                  className="text-2xl font-bold"
                />
              </div>
              
              <div>
                <Label htmlFor="nom" className="flex items-center">Nom
                  {!profileData.nom && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="nom"
                  value={profileData.nom || ''}
                  onChange={(e) => updatePersonalInfo("nom", e.target.value)}
                  className="text-2xl font-bold"
                />
              </div>
              
              <div>
                <Label htmlFor="title" className="flex items-center">Titre professionnel
                  {!profileData?.personalInfo?.title && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="title"
                  value={profileData?.personalInfo?.title || ''}
                  onChange={(e) => updatePersonalInfo("title", e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="flex items-center">Description
                  {!profileData?.personalInfo?.description && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Textarea
                  id="description"
                  value={profileData?.personalInfo?.description || ''}
                  onChange={(e) => updatePersonalInfo("description", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="flex items-center">Email
                  {!profileData.email && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="email"
                  value={profileData.email || ''}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  type="email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="flex items-center">Téléphone
                  {!profileData?.personalInfo?.phone && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="phone"
                  value={profileData?.personalInfo?.phone || ''}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="linkedin" className="flex items-center">LinkedIn
                  {!profileData?.personalInfo?.linkedin && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="linkedin"
                  value={profileData?.personalInfo?.linkedin || ''}
                  onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github">GitHub (optionnel)</Label>
                <Input
                  id="github"
                  value={profileData?.personalInfo?.github || ""}
                  onChange={(e) => updatePersonalInfo("github", e.target.value)}
                  placeholder="github.com/votre-profil"
                />
              </div>
              
              <div>
                <Label htmlFor="website">Site web (optionnel)</Label>
                <Input
                  id="website"
                  value={profileData?.personalInfo?.website || ""}
                  onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  placeholder="votre-site.com"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="availability" className="flex items-center">Disponibilité
                  {!profileData?.personalInfo?.availability && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="availability"
                  value={profileData?.personalInfo?.availability || ''}
                  onChange={(e) => updatePersonalInfo("availability", e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="remote-work"
                  checked={!!profileData?.personalInfo?.remoteWork}
                  onCheckedChange={(checked) => updatePersonalInfo("remoteWork", checked)}
                />
                <Label htmlFor="remote-work">Télétravail possible</Label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative p-8 bg-gradient-to-br from-card to-muted/20 border-0 shadow-elegant">
      {!hideHeader && (
        <div className="absolute top-4 right-4">
          <ProfileProgressBadge profileData={profileData} startEditing={startEditing} />
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative">
          <img
            src={profileData?.personalInfo?.profileImage || '/src/assets/default-avatar.png'}
            alt="Photo de profil"
            className="w-32 h-32 rounded-2xl object-cover shadow-card"
          />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent rounded-full border-4 border-card"></div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {profileData.prenom && profileData.nom 
                ? `${profileData.prenom} ${profileData.nom}` 
                : profileData.prenom || profileData.nom || 'Nom non spécifié'
              }
            </h1>
            <p className="text-xl text-muted-foreground mb-3">{profileData.personalInfo?.title || 'Titre non spécifié'}</p>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              {profileData?.personalInfo?.description || 'Aucune description disponible'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>{profileData.email || 'Email non spécifié'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>{profileData?.personalInfo?.phone || 'Téléphone non spécifié'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-primary" />
              <span>{profileData?.personalInfo?.linkedin || 'LinkedIn non spécifié'}</span>
            </div>
            {profileData?.personalInfo?.github && (
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-primary" />
                <span>{profileData?.personalInfo?.github}</span>
              </div>
            )}
            {profileData?.personalInfo?.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span>{profileData?.personalInfo?.website}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary" className="bg-accent-light text-accent-foreground">
              {profileData?.personalInfo?.availability || 'Disponibilité non spécifiée'}
            </Badge>
            {profileData?.personalInfo?.remoteWork && (
              <Badge variant="outline">Télétravail possible</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EditableProfileHeader;