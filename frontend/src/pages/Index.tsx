import { Button } from "@/components/ui/button";
import { Edit3, Save, X, User, MapPin } from "lucide-react";
import { useProfileData } from "@/hooks/useProfileData";
import StudentPersonalTab from "@/components/student/StudentPersonalTab";
import StudentLocationTab from "@/components/student/StudentLocationTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Boutons d'action en haut */}
        <div className="flex justify-end mb-6">
          {!isEditing ? (
            <Button onClick={startEditing} className="gap-2">
              <Edit3 className="w-4 h-4" />
              Modifier le profil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Sauvegarder
              </Button>
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="w-4 h-4" />
                Annuler
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="personal" className="gap-2">
              <User className="w-4 h-4" />
              Fiche Personnel
            </TabsTrigger>
            <TabsTrigger value="location" className="gap-2">
              <MapPin className="w-4 h-4" />
              Localisation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-6">
            <StudentPersonalTab 
              isEditing={isEditing} 
              startEditing={startEditing}
              onSave={handleSave}
              onCancel={handleCancel}
              showActions={false}
            />
          </TabsContent>
          
          <TabsContent value="location" className="mt-6">
            <StudentLocationTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
