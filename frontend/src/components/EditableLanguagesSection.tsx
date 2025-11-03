import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Plus, Trash2 } from "lucide-react";
import { ProfileData } from "@/hooks/useProfileData";

interface EditableLanguagesSectionProps {
  data: ProfileData["languages"];
  isEditing: boolean;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const languageLevels = ["Débutant", "Intermédiaire", "Courant", "Natif"];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Natif": return "bg-accent text-accent-foreground";
    case "Courant": return "bg-primary/10 text-primary";
    case "Intermédiaire": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const EditableLanguagesSection = ({ data, isEditing, onUpdate }: EditableLanguagesSectionProps) => {
  const addLanguage = () => {
    onUpdate({ languages: [...data, { name: "", level: "Intermédiaire" }] });
  };

  const removeLanguage = (index: number) => {
    const newLanguages = data.filter((_, i) => i !== index);
    onUpdate({ languages: newLanguages });
  };

  const updateLanguage = (index: number, field: keyof typeof data[0], value: string) => {
    const newLanguages = [...data];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    onUpdate({ languages: newLanguages });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Langues</h2>
      
      <Card className="p-6 bg-gradient-to-br from-card to-muted/10 border-0 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-muted">
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Compétences linguistiques</h3>
        </div>
        
        <div className="space-y-3">
          {data.length === 0 && isEditing && (
            <div className="text-center p-4 border-dashed border-2 border-muted-foreground/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Aucune langue ajoutée.</p>
            </div>
          )}

          {data.map((language, index) => (
            <div key={index}>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={language.name}
                      onChange={(e) => updateLanguage(index, "name", e.target.value)}
                      placeholder="Nom de la langue"
                      className="pr-8"
                    />
                    {!language.name && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></span>}
                  </div>
                  <Select
                    value={language.level}
                    onValueChange={(value) => updateLanguage(index, "level", value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languageLevels.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeLanguage(index)}
                    className="px-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">{language.name}</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getLevelColor(language.level)}`}
                  >
                    {language.level}
                  </Badge>
                </div>
              )}
            </div>
          ))}
          
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={addLanguage}
              className="w-full mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une langue
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EditableLanguagesSection;
