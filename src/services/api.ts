export const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

export class ApiError extends Error {
    public status?: number;
    public data?: unknown;

    constructor(message: string, status?: number, data?: unknown) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
    }
}

async function handleResponse(res: Response) {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new ApiError(data.message || 'Request failed', res.status, data);
    }
    return data;
}

export async function apiGet<T = any>(path: string): Promise<T> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(`${API_BASE}${path}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return handleResponse(res);
    } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') throw new ApiError('Request timeout', 408);
        if (err instanceof ApiError) throw err;
        throw new ApiError('Server offline', 0, err);
    }
}

export async function apiPost<T = any>(path: string, body: unknown): Promise<T> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(`${API_BASE}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return handleResponse(res);
    } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') throw new ApiError('Request timeout', 408);
        if (err instanceof ApiError) throw err;
        throw new ApiError('Server offline', 0, err);
    }
}

// Keep existing authService for backward compatibility if needed, 
// using the new apiPost
export const authService = {
    async login(email: string, password: string) {
        const res = await apiPost('/api/auth/login', { email, password });
        return { user: res.user, token: 'dummy-token' };
    },

    async signup(name: string, email: string, password: string) {
        return apiPost('/api/auth/signup', { name, email, password });
    },

    async checkHealth() {
        try {
            const res = await fetch(`${API_BASE}/health`);
            return res.ok;
        } catch {
            return false;
        }
    }
};
