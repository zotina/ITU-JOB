import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from '@/pages/LoginPage';
import StudentDashboard from '@/pages/StudentDashboard';
import RecruiterDashboard from '@/pages/RecruiterDashboard';
import StudentLayout from '@/components/layouts/StudentLayout';
import RecruiterLayout from '@/components/layouts/RecruiterLayout';
import RecruiterRegistrationPage from '@/pages/RecruiterRegistrationPage';
import StudentRegistrationPage from '@/pages/StudentRegistrationPage';

const queryClient = new QueryClient();

// Simulation d'un état d'authentification
export type UserType = 'student' | 'recruiter' | null;

function App() {
  const [userType, setUserType] = useState<UserType>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route 
                path="/login" 
                element={<LoginPage onLogin={setUserType} />} 
              />
              
              {/* Routes étudiants */}
              <Route path="/student/*" element={
                userType === 'student' ? (
                  <StudentLayout>
                    <StudentDashboard />
                  </StudentLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } />
              
              {/* Routes recruteurs */}
              <Route path="/recruiter/*" element={
                userType === 'recruiter' ? (
                  <RecruiterLayout>
                    <RecruiterDashboard />
                  </RecruiterLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              } />
              
              <Route path="/register/student" element={<StudentRegistrationPage />} />
              <Route path="/register/recruiter" element={<RecruiterRegistrationPage />} />
              
              {/* Redirection par défaut */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;