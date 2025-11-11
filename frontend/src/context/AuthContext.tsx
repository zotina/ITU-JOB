import { simpleAuthService } from '@/services/simpleAuthService';
import { LoginRequest, SignupRequest, User } from '@/types/auth';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
                // Update state immediately
                setIsAuthenticated(true);
                setUser(response.user);

                // Dispatch custom event for other listeners
                window.dispatchEvent(new Event('auth-change'));

                // Navigate after state update
                if (response.user.role === 'etudiant' || response.user.role === 'student') {
                    navigate('/student/offers', { replace: true });
                } else if (response.user.role === 'recruteur' || response.user.role === 'recruiter') {
                    navigate('/recruiter/offers', { replace: true });
                }
                return response;
            } else {
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

    const value = {
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
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};