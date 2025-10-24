import { useState, useCallback } from 'react';
import { apiClient } from '@/services/apiClient';
import { ApiResponse } from '@/types/auth';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = useCallback((error: any) => {
        const message = error instanceof Error ? error.message : 'Une erreur est survenue';
        setError(message);
        console.error('API Error:', error);
    }, []);

    const get = useCallback(async <T>(endpoint: string, secure: boolean = false): Promise<ApiResponse<T>> => {
        try {
            setLoading(true);
            setError(null);
            const result = secure
                ? await apiClient.getSecure<T>(endpoint)
                : await apiClient.get<T>(endpoint);
            return result as ApiResponse<T>;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const post = useCallback(async <T>(endpoint: string, data: any, secure: boolean = false): Promise<ApiResponse<T>> => {
        try {
            setLoading(true);
            setError(null);
            const result = secure
                ? await apiClient.postSecure<T>(endpoint, data)
                : await apiClient.post<T>(endpoint, data);
            return result as ApiResponse<T>;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const put = useCallback(async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient.putSecure<T>(endpoint, data);
            return result as ApiResponse<T>;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const del = useCallback(async <T>(endpoint: string): Promise<ApiResponse<T>> => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiClient.deleteSecure<T>(endpoint);
            return result as ApiResponse<T>;
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return { get, post, put, del, loading, error, clearError };
};