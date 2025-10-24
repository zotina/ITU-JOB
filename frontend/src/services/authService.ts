import { apiClient } from './apiClient';
import {
    LoginRequest,
    LoginResponse,
    SignupRequest,
    SignupResponse,
    VerifySignupResponse,
    ApiResponse,
    TokenData,
    User
} from '@/types/auth';

export class AuthService {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

        if (response.status && response.token_data) {
            this.storeTokenData(response.token_data, response.user);
        }

        return response;
    }

    async initiateSignup(userData: SignupRequest): Promise<SignupResponse> {
        return await apiClient.post<SignupResponse>('/auth/signup/initiate', {
            ...userData,
        });
    }

    async verifySignup(sessionKey: string, telephone: string, codeOtp: string): Promise<VerifySignupResponse> {
        const response = await apiClient.post<VerifySignupResponse>('/auth/signup/verify', {
            session_key: sessionKey,
            telephone,
            code_otp: codeOtp
        });

        if (response.status && response.token_data) {
            this.storeTokenData(response.token_data, response.user);
        }

        return response;
    }

    async resendOtp(sessionKey: string, telephone: string): Promise<ApiResponse> {
        return await apiClient.post<ApiResponse>('/auth/signup/resend-otp', {
            session_key: sessionKey,
            telephone
        });
    }

    async refreshToken(): Promise<TokenData> {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post<{ status: boolean; message: string; token_data: TokenData }>('/auth/refresh-token', {
            refresh_token: refreshToken
        });

        if (response.status && response.token_data) {
            this.storeTokenData(response.token_data);
        }

        return response.token_data;
    }

    async getCurrentUser(): Promise<User> {
        const response = await apiClient.postSecure<{ status: boolean; message: string; user: User }>('/auth/me', {
            telephone: localStorage.getItem('user_phone')
        });

        if (!response.status) {
            throw new Error(response.message);
        }

        return response.user;
    }

    async logout(): Promise<void> {
        const telephone = localStorage.getItem('user_phone');
        if (telephone) {
            try {
                await apiClient.postSecure<ApiResponse>('/auth/logout', { telephone });
            } catch (error) {
                console.error('Logout API error:', error);
            }
        }

        this.clearTokenData();
    }

    private storeTokenData(tokenData: TokenData, user?: User): void {
        localStorage.setItem('access_token', tokenData.access_token);
        localStorage.setItem('refresh_token', tokenData.refresh_token);
        localStorage.setItem('token_expires_in', tokenData.expires_in.toString());
        localStorage.setItem('token_type', tokenData.token_type);

        if (user) {
            localStorage.setItem('user_data', JSON.stringify(user));
            localStorage.setItem('user_phone', user.telephone);
        }
    }

    clearTokenData(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expires_in');
        localStorage.removeItem('token_type');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_phone');
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    }

    getStoredUser(): User | null {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    // Change user password
    async changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<ApiResponse> {
        const request = {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation
        };

        const response = await apiClient.postSecure<ApiResponse>('/auth/change-password', request);
        return response;
    }
}

export const authService = new AuthService();