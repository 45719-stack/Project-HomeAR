export const getApiBaseUrl = (): string => {
    // 1. Prioritize environment variable
    const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL;

    if (envUrl) {
        return envUrl;
    }

    // 2. Strict Production Guard
    if (import.meta.env.PROD) {
        // Return empty string to signal missing config. 
        // The App component will check this and show the error screen.
        return '';
    }

    // 3. Dev fallback
    return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();
