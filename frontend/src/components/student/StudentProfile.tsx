import { useProfileData } from "@/hooks/useProfileData";
import StudentPersonalTab from "@/components/student/StudentPersonalTab";
import StudentRecommendations from "@/components/student/StudentRecommendations";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Sparkles } from "lucide-react";

const StudentProfile = () => {
  const { 
    profileData, 
    isEditing, 
    startEditing, 
    cancelEditing, 
    saveChanges, 
    updateEditingData 
  } = useProfileData();
  
  const { toast } = useToast();

  const handleSave = () => {
    saveChanges();
    toast({
      title: "Modifications sauvegardées",
      description: "Votre profil a été mis à jour avec succès.",
    });
  };

  const handleCancel = () => {
    cancelEditing();
    toast({
      title: "Modifications annulées",
      description: "Les changements n'ont pas été sauvegardés.",
      variant: "destructive",
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 max-w-4xl mx-auto">
            <TabsTrigger value="personal" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Fiche Personnel</span>
              <span className="md:hidden">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden md:inline">Recommandations</span>
              <span className="md:hidden">IA</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-6">
            <StudentPersonalTab 
              isEditing={isEditing} 
              startEditing={startEditing}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <StudentRecommendations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentProfile;