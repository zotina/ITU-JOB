import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Plus, Trash2 } from "lucide-react";
import { ProfileData } from "@/hooks/useProfileData";

interface EditableSoftSkillsSectionProps {
  data: ProfileData["softSkills"];
  isEditing: boolean;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const EditableSoftSkillsSection = ({ data, isEditing, onUpdate }: EditableSoftSkillsSectionProps) => {
  const addSoftSkill = () => {
    onUpdate({ softSkills: [...data, ""] });
  };

  const removeSoftSkill = (index: number) => {
    const newSoftSkills = data.filter((_, i) => i !== index);
    onUpdate({ softSkills: newSoftSkills });
  };

  const updateSoftSkill = (index: number, value: string) => {
    const newSoftSkills = [...data];
    newSoftSkills[index] = value;
    onUpdate({ softSkills: newSoftSkills });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Compétences Personnelles (Soft Skills)</h2>
      
      <Card className="p-6 bg-gradient-to-br from-card to-muted/10 border-0 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-muted">
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Qualités interpersonnelles</h3>
        </div>
        
        <div className="space-y-3">
          {data.length === 0 && isEditing && (
            <div className="text-center p-4 border-dashed border-2 border-muted-foreground/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Aucune compétence ajoutée.</p>
            </div>
          )}

          {isEditing ? (
            <div className="space-y-2">
              {data.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={skill}
                      onChange={(e) => updateSoftSkill(index, e.target.value)}
                      placeholder="Nom de la compétence"
                      className="pr-8"
                    />
                    {!skill && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></span>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSoftSkill(index)}
                    className="px-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addSoftSkill}
                className="w-full mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une compétence
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EditableSoftSkillsSection;
