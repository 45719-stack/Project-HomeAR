import axios from 'axios';

// Create generic backend error
export class ApiError extends Error {
    public status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

// Get API URL from env or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = 'An unexpected error occurred';
        let status = 500;

        if (error.response) {
            status = error.response.status;
            message = error.response.data?.message || error.message;

            if (status === 401) message = 'User not found. Please sign up first.';
            if (status === 409) message = 'User already exists';
            if (status === 0) message = 'Server offline';
        } else if (error.request) {
            message = 'Server offline';
            status = 0;
        }

        return Promise.reject(new ApiError(message, status));
    }
);

export const authService = {
    async login(email: string, password: string) {
        const response = await api.post('/api/auth/login', { email, password });
        return response.data;
    },

    async signup(name: string, email: string, password: string) {
        const response = await api.post('/api/auth/register', { name, email, password });
        return response.data;
    },

    async checkHealth() {
        try {
            await api.get('/health');
            return true;
        } catch {
            return false;
        }
    }
};

export default api;
