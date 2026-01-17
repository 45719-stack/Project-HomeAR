import { AxiosError } from 'axios';
import apiClient from './apiClient';

// Helper to extract error message
const getErrorMessage = (error: unknown, defaultMessage: string) => {
    if (error instanceof AxiosError && error.response?.data?.message) {
        return error.response.data.message;
    }
    // If the interceptor set a custom message
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return defaultMessage;
};

export const checkServerHealth = async (): Promise<boolean> => {
    try {
        // Call the dedicated health endpoint
        // This is much more reliable than HEAD request to base URL
        await apiClient.get('/health', { timeout: 5000 });
        return true;
    } catch (error) {
        console.error('Health check failed:', error);
        return false;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await apiClient.post('/api/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, 'Login failed'));
    }
};

export const registerUser = async (name: string, email: string, password: string) => {
    try {
        const response = await apiClient.post('/api/auth/register', { name, email, password });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, 'Registration failed'));
    }
};
