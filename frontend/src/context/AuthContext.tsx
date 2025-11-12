import { simpleAuthService } from '@/services/simpleAuthService';
import { LoginRequest, SignupRequest, User } from '@/types/auth';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    user: User | null;
    login: (credentials: LoginRequest) => Promise<any>;
    logout: () => Promise<void>;
    clearError: () => void;
    getCurrentUser: () => Promise<User>;
    // The following methods are provided for compatibility but will not be implemented in simple auth
    initiateSignup: (userData: SignupRequest) => Promise<any>;
    verifySignup: (sessionKey: string, telephone: string, codeOtp: string) => Promise<any>;
    resendOtp: (sessionKey: string, telephone: string) => Promise<any>;
}

// The rest of the file remains the same, only the export of useAuth is removed
// and the export of AuthContext is added.

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(simpleAuthService.isAuthenticated());
    const [user, setUser] = useState<User | null>(simpleAuthService.getCurrentUser());
    const navigate = useNavigate();

    // Listen for storage changes and custom auth events
    useEffect(() => {
        const handleAuthChange = () => {
            const authenticated = simpleAuthService.isAuthenticated();
            const storedUser = simpleAuthService.getCurrentUser();

            setIsAuthenticated(authenticated);
            setUser(storedUser);
        };

        // Listen for storage changes (from other tabs)
        window.addEventListener('storage', handleAuthChange);
        // Listen for custom auth change events (from same tab)
        window.addEventListener('auth-change', handleAuthChange);

        return () => {
            window.removeEventListener('storage', handleAuthChange);
            window.removeEventListener('auth-change', handleAuthChange);
        };
    }, []);

    const handleError = useCallback((error: any) => {
        const message = ErrorHandler.handleError(error);
        setError(message);
        console.error('Auth Error:', error);
    }, []);

    const login = useCallback(async (credentials: LoginRequest) => {
        try {
            setLoading(true);
            setError(null);

            const response = await simpleAuthService.login(credentials);

            if (response.status && response.user) {
                // Debug logging
                console.log('Login successful, user data:', response.user);
                console.log('User role:', response.user.role);
                
                // Update state immediately
                setIsAuthenticated(true);
                setUser(response.user);

                // Dispatch custom event for other listeners
                window.dispatchEvent(new Event('auth-change'));

                // Navigate after state update
                const isStudent = response.user.role === 'etudiant' || response.user.role === 'student';
                const isRecruiter = response.user.role === 'recruteur' || response.user.role === 'recruiter';
                
                console.log('Role check - isStudent:', isStudent, 'isRecruiter:', isRecruiter);
                
                if (isStudent) {
                    console.log('Redirecting to student dashboard');
                    try {
                        navigate('/student/offers', { replace: true });
                        console.log('Navigation to student dashboard completed');
                    } catch (navError) {
                        console.error('Navigation error:', navError);
                    }
                } else if (isRecruiter) {
                    console.log('Redirecting to recruiter dashboard');
                    try {
                        navigate('/recruiter/offers', { replace: true });
                        console.log('Navigation to recruiter dashboard completed');
                    } catch (navError) {
                        console.error('Navigation error:', navError);
                    }
                } else {
                    console.log('Unknown role, not redirecting');
                }
                return response;
            } else {
                console.log('Login failed:', response.message);
                throw new Error(response.message || 'Erreur de connexion');
            }
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [navigate, handleError]);

    const initiateSignup = useCallback(async (userData: SignupRequest) => {
        try {
            setLoading(true);
            setError(null);
            
            // For simple auth, we don't support signup through this service
            throw new Error('La création de compte n\'est pas supportée avec cette méthode d\'authentification');
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const verifySignup = useCallback(async (sessionKey: string, telephone: string, codeOtp: string) => {
        try {
            setLoading(true);
            setError(null);
            
            // For simple auth, we don't support signup through this service
            throw new Error('La vérification de compte n\'est pas supportée avec cette méthode d\'authentification');
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [navigate, handleError]);

    const resendOtp = useCallback(async (sessionKey: string, telephone: string) => {
        try {
            setLoading(true);
            setError(null);
            
            // For simple auth, we don't support OTP through this service
            throw new Error('La réémission OTP n\'est pas supportée avec cette méthode d\'authentification');
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const logout = useCallback(async () => {
        try {
            setLoading(true);
            await simpleAuthService.logout();

            // Update state immediately
            setIsAuthenticated(false);
            setUser(null);

            // Dispatch custom event for other listeners
            window.dispatchEvent(new Event('auth-change'));

            navigate('/login', { replace: true });
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    }, [navigate, handleError]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = useMemo(() => ({
        loading,
        error,
        login,
        initiateSignup,
        verifySignup,
        resendOtp,
        logout,
        clearError,
        isAuthenticated,
        user,
        getCurrentUser: simpleAuthService.getCurrentUser,
    }), [loading, error, login, initiateSignup, verifySignup, resendOtp, logout, clearError, isAuthenticated, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};