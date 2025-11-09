import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Briefcase, Plus, Trash2, ExternalLink } from "lucide-react";
import { ProfileData } from "@/hooks/useProfileData";

interface EditableProjectsSectionProps {
  data: ProfileData["projects"];
  isEditing: boolean;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const EditableProjectsSection = ({ data, isEditing, onUpdate }: EditableProjectsSectionProps) => {
  const addProject = () => {
    onUpdate({ 
      projects: [...data, { title: "", description: "", link: "" }] 
    });
  };

  const removeProject = (index: number) => {
    const newProjects = data.filter((_, i) => i !== index);
    onUpdate({ projects: newProjects });
  };

  const updateProject = (index: number, field: keyof typeof data[0], value: string) => {
    const newProjects = [...data];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onUpdate({ projects: newProjects });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Mes Projets</h2>
      
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((project, index) => (
            <Card 
              key={index} 
              className="p-6 bg-gradient-to-br from-card to-muted/10 border-0 shadow-card hover:shadow-elegant transition-all duration-300"
            >
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">Projet {index + 1}</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeProject(index)}
                        className="px-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div>
                      <Label className="flex items-center">
                        Titre du projet
                        {!project.title && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                      </Label>
                      <Input
                        value={project.title}
                        onChange={(e) => updateProject(index, "title", e.target.value)}
                        placeholder="Titre du projet"
                      />
                    </div>
                    
                    <div>
                      <Label className="flex items-center">
                        Description
                        {!project.description && <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>}
                      </Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(index, "description", e.target.value)}
                        placeholder="Description courte du projet"
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div>
                      <Label>Lien (optionnel)</Label>
                      <Input
                        value={project.link || ""}
                        onChange={(e) => updateProject(index, "link", e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                    
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Voir le projet
                      </a>
                    )}
                  </>
                )}
              </div>
            </Card>
          ))}

          {isEditing && (
            <Card className="p-6 bg-gradient-to-br from-muted/50 to-muted/20 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all duration-300">
              <Button
                onClick={addProject}
                variant="outline"
                className="w-full h-full min-h-[200px] text-muted-foreground hover:text-primary"
              >
                <Plus className="w-6 h-6 mr-2" />
                Ajouter un projet
              </Button>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {!isEditing && (
            <Card className="p-6 text-center text-muted-foreground">
              Aucun projet ajouté pour le moment
            </Card>
          )}
          
          {isEditing && (
            <div className="text-center space-y-4 py-8">
              <p className="text-muted-foreground">Aucun projet ajouté</p>
              <Button
                onClick={addProject}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un projet
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableProjectsSection;
