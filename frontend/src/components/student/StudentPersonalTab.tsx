import EditableProfileHeader from "@/components/EditableProfileHeader";
import EditableSkillsSection from "@/components/EditableSkillsSection";
import EditableExperienceSection from "@/components/EditableExperienceSection";
import { useProfileData } from "@/hooks/useProfileData";
import { Button } from "@/components/ui/button";
import { Edit3, Save, X } from "lucide-react";

interface StudentPersonalTabProps {
  isEditing: boolean;
  startEditing: () => void;
  onSave: () => void;
  onCancel: () => void;
  showActions?: boolean;
}

const StudentPersonalTab = ({ isEditing, startEditing, onSave, onCancel, showActions = true }: StudentPersonalTabProps) => {
  const { profileData, updateEditingData } = useProfileData();

  return (
    <div className="space-y-8">
      {showActions && (
        <div className="flex justify-end gap-2 mb-4">
          {!isEditing ? (
            <Button onClick={startEditing} className="gap-2">
              <Edit3 className="w-4 h-4" />
              Modifier le profil
            </Button>
          ) : (
            <>
              <Button onClick={onSave} className="gap-2">
                <Save className="w-4 h-4" />
                Sauvegarder
              </Button>
              <Button onClick={onCancel} variant="outline" className="gap-2">
                <X className="w-4 h-4" />
                Annuler
              </Button>
            </>
          )}
        </div>
      )}
      
      <EditableProfileHeader
        profileData={profileData}
        isEditing={isEditing}
        onUpdate={updateEditingData}
        startEditing={startEditing}
      />
      <EditableSkillsSection 
        data={profileData.skills}
        isEditing={isEditing}
        onUpdate={updateEditingData}
      />
      <EditableExperienceSection 
        data={profileData.experiences}
        isEditing={isEditing}
        onUpdate={updateEditingData}
      />
    </div>
  );
};

export default StudentPersonalTab;