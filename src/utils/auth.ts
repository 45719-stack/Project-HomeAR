export const API_URL = 'http://localhost:5000/api/auth';
export const BASE_URL = 'http://localhost:5000';

export const checkServerHealth = async (): Promise<boolean> => {
    try {
        // Use a lightweight call like HEAD or verify a public endpoint exists
        // Since we might not have a dedicated /health, we can try to reach the base
        // or just rely on a fetch catching failure.
        // Using a short timeout to fail fast.
        await fetch(`${BASE_URL}`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(3000)
        });
        return true; // Any response (even 404) means server is reachable
    } catch (error) {
        return false;
    }
};

export const loginUser = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }
    return data;
};

export const registerUser = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }
    return data;
};
