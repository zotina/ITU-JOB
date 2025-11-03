import EditableProfileHeader from "@/components/EditableProfileHeader";
import EditableTechnicalSkillsSection from "@/components/EditableTechnicalSkillsSection";
import EditableLanguagesSection from "@/components/EditableLanguagesSection";
import EditableSoftSkillsSection from "@/components/EditableSoftSkillsSection";
import EditableProjectsSection from "@/components/EditableProjectsSection";
import EditableExperienceSection from "@/components/EditableExperienceSection";
import EditableFormationSection from "@/components/EditableFormationSection";
import { useProfileData } from "@/hooks/useProfileData";
import { Button } from "@/components/ui/button";
import { Edit3, Save, X, Loader2, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { preRempliCV } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

interface StudentPersonalTabProps {
  isEditing: boolean;
  startEditing: () => void;
  onSave: () => void;
  onCancel: () => void;
  showActions?: boolean;
}

const StudentPersonalTab = ({ isEditing, startEditing, onSave, onCancel, showActions = true }: StudentPersonalTabProps) => {
  const { profileData, updateEditingData, startEditingWithData } = useProfileData();
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImportCV = () => {
    setIsImporting(true);
    toast({
      title: "Import du CV en cours...",
      description: "Veuillez patienter, nous analysons votre document.",
    });

    setTimeout(() => {
      startEditingWithData(preRempliCV);
      setIsImporting(false);
      toast({
        title: "CV importé avec succès !",
        description: "Votre profil a été pré-rempli. Veuillez vérifier les informations.",
      });
      // Rediriger vers la page d'édition du profil
      navigate('/student/profile');
    }, 7000);
  };

  return (
    <div className="space-y-8">
      {showActions && (
        <div className="flex justify-end gap-2 mb-4">
          {!isEditing ? (
            <>
              <Button onClick={handleImportCV} variant="outline" className="gap-2" disabled={isImporting}>
                {isImporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                Importer un CV
              </Button>
              <Button onClick={startEditing} className="gap-2">
                <Edit3 className="w-4 h-4" />
                Modifier le profil
              </Button>
            </>
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
      <EditableTechnicalSkillsSection 
        data={profileData.technicalSkills}
        isEditing={isEditing}
        onUpdate={updateEditingData}
      />
      <EditableLanguagesSection 
        data={profileData.languages}
        isEditing={isEditing}
        onUpdate={updateEditingData}
      />
      <EditableSoftSkillsSection 
        data={profileData.softSkills}
        isEditing={isEditing}
        onUpdate={updateEditingData}
      />
      <EditableProjectsSection 
        data={profileData.projects}
        isEditing={isEditing}
        onUpdate={updateEditingData}
      />
      <EditableExperienceSection 
        data={profileData.experiences}
        isEditing={isEditing}
        onUpdate={updateEditingData}
      />
      <EditableFormationSection 
        data={profileData.formations}
        isEditing={isEditing}
        onUpdate={updateEditingData}
      />
    </div>
  );
};

export default StudentPersonalTab;