import { useProfileData } from "@/hooks/useProfileData";
import StudentPersonalTab from "@/components/student/StudentPersonalTab";
import StudentRecommendations from "@/components/student/StudentRecommendations";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Sparkles } from "lucide-react";
import { useLocation, useParams } from 'react-router-dom';

const StudentProfile = ({ isRecruiterView = false, studentId }: { isRecruiterView?: boolean; studentId?: string }) => {
  // Extract studentId from URL if not provided as prop
  const { id: urlStudentId } = useParams();
  const actualStudentId = studentId || urlStudentId;
  
  const { 
    profileData, 
    isEditing, 
    startEditing, 
    cancelEditing, 
    saveChanges, 
    updateEditingData 
  } = useProfileData(actualStudentId ? { specificUserId: actualStudentId } : undefined);
  
  const { toast } = useToast();
  const location = useLocation();

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
              {!isRecruiterView && (
                <TabsTrigger value="personal" className="gap-2">
                  <User className="w-4 h-4" />
                    <>
                      <span className="hidden md:inline">Fiche Personnel</span>
                      <span className="md:hidden">Profil</span>
                    </>
                </TabsTrigger>
              )}
            {!isRecruiterView && (
              <TabsTrigger value="recommendations" className="gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="hidden md:inline">Recommandations</span>
                <span className="md:hidden">IA</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="personal" className="mt-6">
            <StudentPersonalTab 
              isEditing={isEditing} 
              startEditing={startEditing}
              onSave={handleSave}
              onCancel={handleCancel}
              isRecruiterView={isRecruiterView}
            />
          </TabsContent>

          {!isRecruiterView && (
            <TabsContent value="recommendations" className="mt-6">
              <StudentRecommendations />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default StudentProfile;