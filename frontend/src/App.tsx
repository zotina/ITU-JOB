import { Routes, Route, Navigate } from 'react-router-dom';
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
import { useAuth } from '@/hooks/useAuth';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        
          <div className="min-h-screen bg-background">
            <Routes>
              <Route 
                path="/login" 
                element={<LoginPage />} 
              />
              
              {/* Routes étudiants */}
              <Route path="/student/*" element={
                <StudentLayout>
                    <StudentDashboard />
                  </StudentLayout>
              } />
              
              {/* Routes recruteurs */}
              <Route path="/recruiter/*" element={
                <RecruiterLayout>
                    <RecruiterDashboard />
                  </RecruiterLayout>
              } />
              
              <Route path="/register/student" element={<StudentRegistrationPage />} />
              <Route path="/register/recruiter" element={<RecruiterRegistrationPage />} />
              
              {/* Redirection par défaut */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;