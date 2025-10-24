import { authService } from '@/services/authService';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export class TokenManager {
    private static instance: TokenManager;
    private refreshInterval: NodeJS.Timeout | null = null;

    private constructor() {
        this.setupTokenRefresh();
    }

    public static getInstance(): TokenManager {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }

    private async setupTokenRefresh() {
        const [expiresIn] = useLocalStorage<number>('token_expires_in', 0);
        if (expiresIn) {
            const refreshTime = (expiresIn * 1000) * 0.8;
            this.refreshInterval = setInterval(async () => {
                try {
                    await authService.refreshToken();
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    authService.clearTokenData();
                    window.location.href = '/login';
                }
            }, refreshTime);
        }
    }

    public stopRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    public async refreshTokenNow() {
        try {
            await authService.refreshToken();
        } catch (error) {
            console.error('Immediate token refresh failed:', error);
            authService.clearTokenData();
            window.location.href = '/login';
        }
    }
}

export const tokenManager = TokenManager.getInstance();