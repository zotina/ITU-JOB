import { Routes, Route, Navigate } from 'react-router-dom';
import RecruiterOffers from '@/components/recruiter/RecruiterOffers';
import RecruiterCandidates from '@/components/recruiter/RecruiterCandidates';
import RecruiterAnalytics from '@/components/recruiter/RecruiterAnalytics';
import RecruiterChatbot from '@/components/recruiter/RecruiterChatbot';
import RecruiterProfile from '@/components/recruiter/RecruiterProfile';
import RecruiterCreateOffer from '@/pages/RecruiterCreateOffer';
import RecruiterStudentSearch from '@/components/recruiter/RecruiterStudentSearch';
import FilteredApplications from '@/pages/FilteredApplications';
import RecruiterStudentProfile from '@/pages/RecruiterStudentProfile';

const RecruiterDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/recruiter/offers" replace />} />
      <Route path="/offers" element={<RecruiterOffers />} />
      <Route path="/create-offer" element={<RecruiterCreateOffer />} />
      <Route path="/candidates" element={<RecruiterCandidates />} />
      <Route path="/candidates/filtered" element={<FilteredApplications />} />
      <Route path="/student-profile/:id" element={<RecruiterStudentProfile />} />
      <Route path="/student-search" element={<RecruiterStudentSearch />} />
      <Route path="/analytics" element={<RecruiterAnalytics />} />
      <Route path="/chatbot" element={<RecruiterChatbot />} />
      <Route path="/profile" element={<RecruiterProfile />} />
    </Routes>
  );
};

export default RecruiterDashboard;