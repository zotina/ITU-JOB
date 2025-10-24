import { API_CONFIG } from '@/config/api';

export class ApiClient {
    private baseURL: string;
    private defaultHeaders: Record<string, string>;

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
    }

    private getAuthHeaders(): Record<string, string> {
        const token = localStorage.getItem('access_token');
        const phoneNumber = localStorage.getItem('user_phone');

        const headers: Record<string, string> = {};

        if (token) {
            headers[API_CONFIG.AUTH_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
        }

        if (phoneNumber) {
            headers[API_CONFIG.AUTH_HEADERS.PHONE_NUMBER] = phoneNumber;
        }

        return headers;
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {},
        requiresAuth: boolean = false
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const headers = {
            ...this.defaultHeaders,
            ...options.headers,
        };

        if (requiresAuth) {
            Object.assign(headers, this.getAuthHeaders());
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error for ${endpoint}:`, error);
            throw error;
        }
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'GET',
        });
    }

    async postSecure<T>(endpoint: string, data: any): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        }, true);
    }

    async getSecure<T>(endpoint: string): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'GET',
        }, true);
    }

    async putSecure<T>(endpoint: string, data: any): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        }, true);
    }

    async deleteSecure<T>(endpoint: string): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'DELETE',
        }, true);
    }

    async patchSecure<T>(endpoint: string, data?: any): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }, true);
    }

    async getPublic<T>(endpoint: string): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'GET',
        }, false); // No authentication required
    }

    async postMultipartSecure<T>(endpoint: string, formData: FormData): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getAuthHeaders();

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Multipart API Error for ${endpoint}:`, error);
            throw error;
        }
    }
}

export const apiClient = new ApiClient();