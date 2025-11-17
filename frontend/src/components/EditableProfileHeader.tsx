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
  const personalInfo = profileData?.personalInfo || {};

  const updatePersonalInfo = (field: string, value: string | boolean | [number, number]) => {
    onUpdate({
      personalInfo: {
        ...personalInfo,
        [field]: value
      }
    });
  };

  const handleLocationChange = (location: string, coordinates?: [number, number]) => {
    onUpdate({
      personalInfo: {
        ...personalInfo,
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
            currentImage={personalInfo.profileImage || ''}
            onImageChange={(imageUrl) => updatePersonalInfo("profileImage", imageUrl)}
          />
          
          <div className="flex-1 space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center">Nom complet
                  {!personalInfo.nom && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="name"
                  value={personalInfo.nom || ''}
                  onChange={(e) => updatePersonalInfo("name", e.target.value)}
                  className="text-2xl font-bold"
                />
              </div>
              
              <div>
                <Label htmlFor="title" className="flex items-center">Titre professionnel
                  {!personalInfo.title && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="title"
                  value={personalInfo.title || ''}
                  onChange={(e) => updatePersonalInfo("title", e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="flex items-center">Description
                  {!personalInfo.description && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Textarea
                  id="description"
                  value={personalInfo.description || ''}
                  onChange={(e) => updatePersonalInfo("description", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="flex items-center">Email
                  {!personalInfo.email && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="email"
                  value={personalInfo.email || ''}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  type="email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="flex items-center">Téléphone
                  {!personalInfo.phone && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="phone"
                  value={personalInfo.phone || ''}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="linkedin" className="flex items-center">LinkedIn
                  {!personalInfo.linkedin && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="linkedin"
                  value={personalInfo.linkedin || ''}
                  onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github">GitHub (optionnel)</Label>
                <Input
                  id="github"
                  value={personalInfo.github || ""}
                  onChange={(e) => updatePersonalInfo("github", e.target.value)}
                  placeholder="github.com/votre-profil"
                />
              </div>
              
              <div>
                <Label htmlFor="website">Site web (optionnel)</Label>
                <Input
                  id="website"
                  value={personalInfo.website || ""}
                  onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  placeholder="votre-site.com"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="availability" className="flex items-center">Disponibilité
                  {!personalInfo.availability && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                </Label>
                <Input
                  id="availability"
                  value={personalInfo.availability || ''}
                  onChange={(e) => updatePersonalInfo("availability", e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="remote-work"
                  checked={!!personalInfo.remoteWork}
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
            src={personalInfo.profileImage || '/src/assets/default-avatar.png'}
            alt="Photo de profil"
            className="w-32 h-32 rounded-2xl object-cover shadow-card"
          />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent rounded-full border-4 border-card"></div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            {!hideHeader && (
              <>
                <h1 className="text-3xl font-bold text-foreground mb-2">{profileData.nom + " " + profileData.prenom  || 'Nom non spécifié'}</h1>
                <p className="text-xl text-muted-foreground mb-3">{personalInfo.title || 'Titre non spécifié'}</p>
              </>
            )}
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              {personalInfo.description || 'Aucune description disponible'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span>{personalInfo.email || 'Email non spécifié'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>{personalInfo.phone || 'Téléphone non spécifié'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-primary" />
              <span>{personalInfo.linkedin || 'LinkedIn non spécifié'}</span>
            </div>
            {personalInfo.github && (
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-primary" />
                <span>{personalInfo.github}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span>{personalInfo.website}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary" className="bg-accent-light text-accent-foreground">
              {personalInfo.availability || 'Disponibilité non spécifiée'}
            </Badge>
            {personalInfo.remoteWork && (
              <Badge variant="outline">Télétravail possible</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EditableProfileHeader;