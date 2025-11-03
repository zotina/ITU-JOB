import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GraduationCap, PlusCircle, Trash2 } from "lucide-react";
import { ProfileData } from "@/hooks/useProfileData";

interface EditableFormationSectionProps {
  data: ProfileData['formations'];
  isEditing: boolean;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const EditableFormationSection = ({ data, isEditing, onUpdate }: EditableFormationSectionProps) => {

  const handleUpdate = (index: number, field: string, value: string) => {
    const updatedFormations = [...data];
    updatedFormations[index] = { ...updatedFormations[index], [field]: value };
    onUpdate({ formations: updatedFormations });
  };

  const addFormation = () => {
    const newFormation = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      period: "",
      description: "",
    };
    onUpdate({ formations: [...data, newFormation] });
  };

  const removeFormation = (index: number) => {
    const updatedFormations = data.filter((_, i) => i !== index);
    onUpdate({ formations: updatedFormations });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-primary" />
          <CardTitle>Formations</CardTitle>
        </div>
        {isEditing && (
          <Button variant="outline" size="sm" onClick={addFormation} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Ajouter
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((formation, index) => (
          <div key={formation.id} className="p-4 border rounded-lg relative">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institution</Label>
                    <Input value={formation.institution} onChange={(e) => handleUpdate(index, 'institution', e.target.value)} />
                  </div>
                  <div>
                    <Label>Diplôme</Label>
                    <Input value={formation.degree} onChange={(e) => handleUpdate(index, 'degree', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Domaine d'étude</Label>
                    <Input value={formation.fieldOfStudy} onChange={(e) => handleUpdate(index, 'fieldOfStudy', e.target.value)} />
                  </div>
                  <div>
                    <Label>Période</Label>
                    <Input value={formation.period} onChange={(e) => handleUpdate(index, 'period', e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={formation.description} onChange={(e) => handleUpdate(index, 'description', e.target.value)} />
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeFormation(index)} className="absolute top-2 right-2 gap-2">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-lg">{formation.degree}</h3>
                <p className="text-md font-medium text-muted-foreground">{formation.institution}</p>
                <p className="text-sm text-muted-foreground">{formation.fieldOfStudy}</p>
                <p className="text-sm text-muted-foreground mt-1">{formation.period}</p>
                <p className="mt-2 text-sm leading-relaxed">{formation.description}</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EditableFormationSection;
