import { useProfileData } from "@/hooks/useProfileData";
import StudentPersonalTab from "@/components/student/StudentPersonalTab";
import StudentLocationTab from "@/components/student/StudentLocationTab";
import StudentStatistics from "@/components/student/StudentStatistics";
import StudentCVManager from "@/components/student/StudentCVManager";
import StudentRecommendations from "@/components/student/StudentRecommendations";
import StudentTopJobs from "@/components/student/StudentTopJobs";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, MapPin, BarChart3, FileText, Sparkles, TrendingUp } from "lucide-react";

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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 max-w-4xl mx-auto">
            <TabsTrigger value="personal" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Fiche Personnel</span>
              <span className="md:hidden">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden md:inline">Localisation</span>
              <span className="md:hidden">Lieu</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Statistiques</span>
              <span className="md:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="cv" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">CV & Export</span>
              <span className="md:hidden">CV</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden md:inline">Recommandations</span>
              <span className="md:hidden">IA</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden md:inline">Top Postes</span>
              <span className="md:hidden">Top</span>
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
          
          <TabsContent value="location" className="mt-6">
            <StudentLocationTab />
          </TabsContent>

          <TabsContent value="statistics" className="mt-6">
            <StudentStatistics />
          </TabsContent>

          <TabsContent value="cv" className="mt-6">
            <StudentCVManager />
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <StudentRecommendations />
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <StudentTopJobs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentProfile;