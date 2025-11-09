import { useParams } from 'react-router-dom';
import StudentProfile from '@/components/student/StudentProfile';

// Wrapper pour le profil étudiant en mode recruteur
const RecruiterStudentProfile = () => {
  const { id } = useParams(); // Get the student ID from URL params

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Profil de l'étudiant</h1>
        <StudentProfile isRecruiterView={true} studentId={id} />
      </div>
    </div>
  );
};

export default RecruiterStudentProfile;