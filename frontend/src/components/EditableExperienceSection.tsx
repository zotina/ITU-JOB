import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Building, Plus, Trash2 } from "lucide-react";
import { ProfileData } from "@/hooks/useProfileData";

interface EditableExperienceSectionProps {
  data: ProfileData["experiences"];
  isEditing: boolean;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const EditableExperienceSection = ({ data, isEditing, onUpdate }: EditableExperienceSectionProps) => {
  const updateExperience = (index: number, updates: Partial<typeof data[0]>) => {
    const newExperiences = [...data];
    newExperiences[index] = { ...newExperiences[index], ...updates };
    onUpdate({ experiences: newExperiences });
  };

  const addExperience = () => {
    const newExperience = {
      title: "",
      company: "",
      location: "",
      period: "",
      type: "CDI",
      description: "",
      technologies: []
    };
    onUpdate({ experiences: [...data, newExperience] });
  };

  const removeExperience = (index: number) => {
    const newExperiences = data.filter((_, i) => i !== index);
    onUpdate({ experiences: newExperiences });
  };

  const updateTechnologies = (index: number, techString: string) => {
    const technologies = techString.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
    updateExperience(index, { technologies });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Expérience Professionnelle</h2>
        {isEditing && (
          <Button onClick={addExperience} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une expérience
          </Button>
        )}
      </div>

      {data && data.length > 0 ? (
        <div className="space-y-4">
          {data.map((exp, index) => (
            <Card 
              key={index}
              className="p-6 bg-gradient-to-br from-card to-muted/10 border-0 shadow-card hover:shadow-elegant transition-all duration-300"
            >
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`title-${index}`} className="flex items-center">Titre du poste
                            {!exp.title && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                          </Label>
                          <Input
                            id={`title-${index}`}
                            value={exp.title}
                            onChange={(e) => updateExperience(index, { title: e.target.value })}
                            placeholder="Titre du poste"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`company-${index}`} className="flex items-center">Entreprise
                            {!exp.company && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                          </Label>
                          <Input
                            id={`company-${index}`}
                            value={exp.company}
                            onChange={(e) => updateExperience(index, { company: e.target.value })}
                            placeholder="Nom de l'entreprise"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`location-${index}`} className="flex items-center">Localisation
                            {!exp.location && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                          </Label>
                          <Input
                            id={`location-${index}`}
                            value={exp.location}
                            onChange={(e) => updateExperience(index, { location: e.target.value })}
                            placeholder="Ville, Pays"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`period-${index}`} className="flex items-center">Période
                            {!exp.period && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                          </Label>
                          <Input
                            id={`period-${index}`}
                            value={exp.period}
                            onChange={(e) => updateExperience(index, { period: e.target.value })}
                            placeholder="2020 - 2022"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`type-${index}`} className="flex items-center">Type de contrat
                            {!exp.type && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                          </Label>
                          <Input
                            id={`type-${index}`}
                            value={exp.type}
                            onChange={(e) => updateExperience(index, { type: e.target.value })}
                            placeholder="CDI, CDD, Stage..."
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`description-${index}`} className="flex items-center">Description
                          {!exp.description && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                        </Label>
                        <Textarea
                          id={`description-${index}`}
                          value={exp.description}
                          onChange={(e) => updateExperience(index, { description: e.target.value })}
                          placeholder="Décrivez vos missions et réalisations..."
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`technologies-${index}`} className="flex items-center">Technologies (séparées par des virgules)
                          {exp.technologies.length === 0 && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                        </Label>
                        <Input
                          id={`technologies-${index}`}
                          value={exp.technologies.join(', ')}
                          onChange={(e) => updateTechnologies(index, e.target.value)}
                          placeholder="React, Node.js, PostgreSQL..."
                        />
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      className="ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-1">{exp.title}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{exp.company}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.period}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="self-start">{exp.type}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {exp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge 
                        key={techIndex}
                        variant="secondary" 
                        className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {isEditing && (
            <Card className="p-6 border-dashed border-2 border-muted-foreground/50 bg-muted/20">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Cette section est vide. Ajoutez vos expériences pour enrichir votre profil.</p>
                <Button onClick={addExperience}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter votre première expérience
                </Button>
              </div>
            </Card>
          )}
          
          {!isEditing && (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Aucune expérience professionnelle à afficher</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableExperienceSection;