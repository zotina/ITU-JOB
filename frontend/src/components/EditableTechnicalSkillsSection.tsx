import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, Database, Plus, Trash2 } from "lucide-react";
import { ProfileData } from "@/hooks/useProfileData";

interface EditableTechnicalSkillsSectionProps {
  data: ProfileData["technicalSkills"];
  isEditing: boolean;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const predefinedCategories = [
  "Développement Frontend",
  "Développement Backend", 
  "Développement Mobile",
  "Data Science & IA",
  "Cybersécurité",
  "DevOps & Cloud",
  "Design UX/UI",
  "Outils & Technologies"
];

const skillIcons = {
  "Développement Frontend": Code,
  "Développement Backend": Database,
  "Développement Mobile": Code,
  "Data Science & IA": Database,
  "Cybersécurité": Database,
  "DevOps & Cloud": Database,
  "Design UX/UI": Code,
  "Outils & Technologies": Code
};

const skillColors = {
  "Développement Frontend": "text-primary",
  "Développement Backend": "text-accent",
  "Développement Mobile": "text-primary",
  "Data Science & IA": "text-accent",
  "Cybersécurité": "text-red-500",
  "DevOps & Cloud": "text-blue-500",
  "Design UX/UI": "text-purple-500",
  "Outils & Technologies": "text-gray-500"
};

const levelOptions = ["Débutant", "Intermédiaire", "Avancé", "Expert"];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Expert": return "bg-accent text-accent-foreground";
    case "Avancé": return "bg-primary/10 text-primary";
    case "Intermédiaire": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const EditableTechnicalSkillsSection = ({ data, isEditing, onUpdate }: EditableTechnicalSkillsSectionProps) => {
  const updateSkillCategory = (categoryIndex: number, updates: Partial<typeof data[0]>) => {
    const newSkills = [...data];
    newSkills[categoryIndex] = { ...newSkills[categoryIndex], ...updates };
    onUpdate({ technicalSkills: newSkills });
  };

  const addSkill = (categoryIndex: number) => {
    const newSkills = [...data];
    newSkills[categoryIndex].skills.push({ name: "", level: "Intermédiaire" });
    onUpdate({ technicalSkills: newSkills });
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const newSkills = [...data];
    newSkills[categoryIndex].skills.splice(skillIndex, 1);
    onUpdate({ technicalSkills: newSkills });
  };

  const updateSkill = (categoryIndex: number, skillIndex: number, field: string, value: string) => {
    const newSkills = [...data];
    newSkills[categoryIndex].skills[skillIndex] = {
      ...newSkills[categoryIndex].skills[skillIndex],
      [field]: value
    };
    onUpdate({ technicalSkills: newSkills });
  };

  const addCategory = () => {
    const newSkills = [...data, { title: "", skills: [] }];
    onUpdate({ technicalSkills: newSkills });
  };

  const removeCategory = (categoryIndex: number) => {
    const newSkills = data.filter((_, index) => index !== categoryIndex);
    onUpdate({ technicalSkills: newSkills });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Compétences Techniques</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((category, categoryIndex) => {
          const IconComponent = skillIcons[category.title as keyof typeof skillIcons] || Code;
          const iconColor = skillColors[category.title as keyof typeof skillColors] || "text-primary";
          
          return (
            <Card 
              key={categoryIndex} 
              className="p-6 bg-gradient-to-br from-card to-muted/10 border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-muted">
                  <IconComponent className={`w-5 h-5 ${iconColor}`} />
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Select
                      value={category.title}
                      onValueChange={(value) => updateSkillCategory(categoryIndex, { title: value })}
                    >
                      <SelectTrigger className="text-lg font-semibold">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {predefinedCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCategory(categoryIndex)}
                      className="px-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                )}
              </div>
              
              <div className="space-y-3">
                {category.skills.length === 0 && isEditing && (
                  <div className="text-center p-4 border-dashed border-2 border-muted-foreground/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Cette catégorie est vide.</p>
                  </div>
                )}

                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <Input
                            value={skill.name}
                            onChange={(e) => updateSkill(categoryIndex, skillIndex, "name", e.target.value)}
                            placeholder="Nom de la compétence"
                            className="pr-8"
                          />
                          {!skill.name && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></span>}
                        </div>
                        <Select
                          value={skill.level}
                          onValueChange={(value) => updateSkill(categoryIndex, skillIndex, "level", value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {levelOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSkill(categoryIndex, skillIndex)}
                          className="px-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-foreground font-medium">{skill.name}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getLevelColor(skill.level)}`}
                        >
                          {skill.level}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(categoryIndex)}
                    className="w-full mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une compétence
                  </Button>
                )}
              </div>
            </Card>
          );
        })}

        {isEditing && (
          <Card className="p-6 bg-gradient-to-br from-muted/50 to-muted/20 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all duration-300">
            <Button
              onClick={addCategory}
              variant="outline"
              className="w-full h-24 text-muted-foreground hover:text-primary"
            >
              <Plus className="w-6 h-6 mr-2" />
              Ajouter une catégorie
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EditableTechnicalSkillsSection;
