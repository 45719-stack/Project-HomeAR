import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Create the Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token & Runtime Guard
apiClient.interceptors.request.use(
    (config) => {
        // Runtime Guard for Production
        if (!config.baseURL && import.meta.env.PROD) {
            // This effectively cancels the request and allows the response interceptor or catch block to handle it
            // However, axios doesn't support easy cancellation here without AbortController.
            // But if baseURL is empty, it will try to request relative to current page which is wrong if API is separate.
            throw new Error("Backend URL not configured. Set VITE_API_BASE_URL in environment variables.");
        }

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check for runtime configuration error first
        if (error.message === "Backend URL not configured. Set VITE_API_BASE_URL in environment variables.") {
            // Keep the message as is
        } else if (!error.response) {
            // Network error or timeout
            error.message = 'Server unreachable';
        } else if (error.response.status === 401) {
            error.message = 'Invalid email/password';
        } else if (error.response.status >= 500) {
            error.message = 'Server error';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
