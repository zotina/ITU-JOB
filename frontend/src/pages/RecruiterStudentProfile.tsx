import StudentProfile from '@/components/student/StudentProfile';

// Wrapper pour le profil étudiant en mode recruteur
const RecruiterStudentProfile = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Profil de l'étudiant</h1>
        <StudentProfile isRecruiterView={true} />
      </div>
    </div>
  );
};

export default RecruiterStudentProfile;