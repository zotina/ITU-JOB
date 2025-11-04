import { useProfileData } from "@/hooks/useProfileData";
import AppointmentCalendar from "@/components/AppointmentCalendar";

const StudentAppointments = () => {
  const { profileData } = useProfileData();

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mes Rendez-vous</h1>
        <AppointmentCalendar 
          appointments={profileData.appointments || []} 
          userType="student" 
          onAppointmentClick={(appointment) => {
            // Handle appointment click if needed
            console.log('Appointment clicked:', appointment);
          }}
        />
      </div>
    </div>
  );
};

export default StudentAppointments;