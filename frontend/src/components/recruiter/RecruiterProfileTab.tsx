import { useProfileData } from "@/hooks/useProfileData";
import AppointmentCalendar from "@/components/AppointmentCalendar";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Calendar } from "lucide-react";
import { useLocation } from 'react-router-dom';

const RecruiterProfile = () => {
  const { 
    profileData, 
    isEditing, 
    startEditing, 
    cancelEditing, 
    saveChanges, 
    updateEditingData 
  } = useProfileData();
  
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
          <TabsList className="grid w-full grid-cols-2 max-w-4xl mx-auto">
            <TabsTrigger value="personal" className="gap-2">
              <User className="w-4 h-4" />
              <>
                <span className="hidden md:inline">Fiche Personnel</span>
                <span className="md:hidden">Profil</span>
              </>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden md:inline">Mes Rendez-vous</span>
              <span className="md:hidden">Rdvs</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Profil Personnel</h2>
              <p>Ce profil est en mode lecture seule pour le moment. Les fonctionnalités d'édition arriveront bientôt.</p>
              <div className="mt-4">
                <h3 className="font-semibold">Nom:</h3>
                <p>Responsable Recrutement</p>
                
                <h3 className="font-semibold mt-2">Email:</h3>
                <p>recruiter@company.com</p>
                
                <h3 className="font-semibold mt-2">Entreprise:</h3>
                <p>Ma Compagnie</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <AppointmentCalendar 
              appointments={profileData.appointments || []} 
              userType="recruiter" 
              onAppointmentClick={(appointment) => {
                // Handle appointment click if needed
                console.log('Appointment clicked:', appointment);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecruiterProfile;