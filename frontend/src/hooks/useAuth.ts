import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { LoginRequest, SignupRequest, User } from '@/types/auth';
import { ErrorHandler } from '@/utils/ErrorHandler';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [user, setUser] = useState<User | null>(authService.getStoredUser());
    const navigate = useNavigate();

    // Listen for storage changes to update auth state across tabs
    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(authService.isAuthenticated());
            setUser(authService.getStoredUser());
        };

        // Listen for storage changes to update auth state
        window.addEventListener('storage', handleStorageChange);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
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
                // Update the auth state after successful login
                setIsAuthenticated(true);
                if (response.user) {
                    setUser(response.user);
                }
                navigate('/home');
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
                // Update the auth state after successful signup verification
                setIsAuthenticated(true);
                if (response.user) {
                    setUser(response.user);
                }
                navigate('/home');
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
            // Update the auth state after logout
            setIsAuthenticated(false);
            setUser(null);
            navigate('/login');
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    }, [navigate, handleError]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
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
};