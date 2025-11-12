// src/components/auth/LoginSuccessRedirect.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const LoginSuccessRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const isStudent = user.role === 'etudiant' || user.role === 'student';
      const isRecruiter = user.role === 'recruteur' || user.role === 'recruiter';

      if (isStudent) {
        navigate('/student/offers', { replace: true });
      } else if (isRecruiter) {
        navigate('/recruiter/offers', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  return null; // This component does not render anything
};

export default LoginSuccessRedirect;
