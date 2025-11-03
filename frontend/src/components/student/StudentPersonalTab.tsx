import EditableProfileHeader from "@/components/EditableProfileHeader";
import EditableTechnicalSkillsSection from "@/components/EditableTechnicalSkillsSection";
import EditableLanguagesSection from "@/components/EditableLanguagesSection";
import EditableSoftSkillsSection from "@/components/EditableSoftSkillsSection";
import EditableProjectsSection from "@/components/EditableProjectsSection";
import EditableExperienceSection from "@/components/EditableExperienceSection";
import EditableFormationSection from "@/components/EditableFormationSection";
import { useProfileData } from "@/hooks/useProfileData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit3, Save, X, Loader2, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { preRempliCV } from "@/data/mockData";

interface StudentPersonalTabProps {
  showActions?: boolean;
  isRecruiterView?: boolean;
}

const StudentPersonalTab = ({ showActions = true, isRecruiterView = false }: StudentPersonalTabProps) => {
  const { 
    profileData, 
    isEditing, 
    updateEditingData, 
    startEditing, 
    startEditingWithData,
    saveChanges,
    cancelEditing 
  } = useProfileData();
  
  const [isImporting, setIsImporting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImportCV = async () => {
    setIsImporting(true);
    setIsDialogOpen(false);
    
    toast({
      title: "Import du CV en cours...",
      description: "Veuillez patienter, nous analysons votre document.",
    });

    // Simulation de traitement pendant 7 secondes
    await new Promise(resolve => setTimeout(resolve, 7000));

    // Passer en mode édition avec les données pré-remplies
    startEditingWithData(preRempliCV);
    setIsImporting(false);
    setSelectedFile(null);
    
    toast({
      title: "CV importé avec succès !",
      description: "Votre profil a été pré-rempli. Veuillez vérifier et sauvegarder les informations.",
    });
  };

  const handleSave = () => {
    // Sauvegarder les modifications
    if (saveChanges) {
      saveChanges();
    }
    
    toast({
      title: "Profil sauvegardé",
      description: "Vos modifications ont été enregistrées avec succès.",
    });
  };

  const handleCancel = () => {
    // Annuler les modifications
    if (cancelEditing) {
      cancelEditing();
    }
    
    toast({
      title: "Modifications annulées",
      description: "Les modifications n'ont pas été enregistrées.",
    });
  };

  return (
    <div className="space-y-8">
      {showActions && !isRecruiterView && (
        <div className="flex justify-end gap-2 mb-4">
          {!isEditing ? (
            <>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2" disabled={isImporting}>
                    {isImporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    Importer un CV
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Importer un CV</DialogTitle>
                    <DialogDescription>
                      Sélectionnez votre fichier CV à importer. Nous l'analyserons pour pré-remplir votre profil.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="cv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {selectedFile ? selectedFile.name : 'Cliquez pour télécharger'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOC, DOCX (MAX. 10MB)
                          </p>
                        </div>
                        <input 
                          id="cv-upload" 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.doc,.docx" 
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsDialogOpen(false);
                        setSelectedFile(null);
                      }}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleImportCV} 
                      disabled={!selectedFile || isImporting}
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        'Importer et analyser'
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={startEditing} className="gap-2">
                <Edit3 className="w-4 h-4" />
                Modifier le profil
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} className="gap-2" type="button">
                <Save className="w-4 h-4" />
                Sauvegarder
              </Button>
              <Button onClick={handleCancel} variant="outline" className="gap-2" type="button">
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