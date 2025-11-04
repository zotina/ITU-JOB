import { Routes, Route, Navigate } from 'react-router-dom';
import StudentOffers from '@/components/student/StudentOffers';
import StudentApplications from '@/components/student/StudentApplications';
import StudentChatbot from '@/components/student/StudentChatbot';
import StudentLocationPage from '@/pages/StudentLocation';
import StudentProfile from '@/components/student/StudentProfile';
import StudentAppointments from '@/components/student/StudentAppointments';
import OfferDetailPage from '@/pages/OfferDetailPage';
import RecruiterProfile from '@/components/recruiter/RecruiterProfile';

const StudentDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/offers" replace />} />
      <Route path="/offers" element={<StudentOffers />} />
      <Route path="/offers/:id" element={<OfferDetailPage />} />
      <Route path="/applications" element={<StudentApplications />} />
      <Route path="/chatbot" element={<StudentChatbot />} />
      <Route path="/location" element={<StudentLocationPage />} />
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/appointments" element={<StudentAppointments />} />
      <Route path="/company/:id" element={<RecruiterProfile isReadOnly={true} />} />
    </Routes>
  );
};

export default StudentDashboard;