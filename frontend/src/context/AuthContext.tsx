import { authService } from '@/services/authService';
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
    initiateSignup: (userData: SignupRequest) => Promise<any>;
    verifySignup: (sessionKey: string, telephone: string, codeOtp: string) => Promise<any>;
    resendOtp: (sessionKey: string, telephone: string) => Promise<any>;
    logout: () => Promise<void>;
    clearError: () => void;
    getCurrentUser: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [user, setUser] = useState<User | null>(authService.getStoredUser());
    const navigate = useNavigate();

    // Listen for storage changes and custom auth events
    useEffect(() => {
        const handleAuthChange = () => {
            const authenticated = authService.isAuthenticated();
            const storedUser = authService.getStoredUser();

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

            const response = await authService.login(credentials);

            if (response.status) {
                // Update state immediately
                setIsAuthenticated(true);
                if (response.user) {
                    setUser(response.user);
                }

                // Dispatch custom event for other listeners
                window.dispatchEvent(new Event('auth-change'));

                // Navigate after state update
                if (response.user.role === 'etudiant') {
                    navigate('/student/offers', { replace: true });
                } else if (response.user.role === 'recruteur') {
                    navigate('/recruiter/offers', { replace: true });
                }
                return response;
            } else {
                throw new Error(response.message);
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

            const response = await authService.initiateSignup(userData);

            if (!response.status) {
                throw new Error(response.message);
            }

            return response;
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

            const response = await authService.verifySignup(sessionKey, telephone, codeOtp);

            if (response.status) {
                // Update state immediately
                setIsAuthenticated(true);
                if (response.user) {
                    setUser(response.user);
                }

                // Dispatch custom event for other listeners
                window.dispatchEvent(new Event('auth-change'));

                // Navigate after state update
                if (response.user.role === 'etudiant') {
                    navigate('/student/offers', { replace: true });
                } else if (response.user.role === 'recruteur') {
                    navigate('/recruiter/offers', { replace: true });
                }
                return response;
            } else {
                throw new Error(response.message);
            }
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

            const response = await authService.resendOtp(sessionKey, telephone);

            if (!response.status) {
                throw new Error(response.message);
            }

            return response;
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
            await authService.logout();

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
        getCurrentUser: authService.getCurrentUser,
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