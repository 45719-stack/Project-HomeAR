export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export class ApiError extends Error {
    public status?: number;
    public data?: any;

    constructor(message: string, status?: number, data?: any) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
    }
}

export async function apiPost(path: string, body: any) {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new ApiError(data.message || 'Request failed', res.status, data);
        }

        return data;
    } catch (err: any) {
        if (err instanceof ApiError) throw err;
        // Network errors (fetch throws on network failure)
        throw new ApiError('Server offline', 0, err);
    }
}

// Keep existing authService for backward compatibility if needed, 
// using the new apiPost
export const authService = {
    async login(email: string, password: string) {
        const res = await apiPost('/api/auth/login', { email, password });
        // Map backend response { ok: true, user: {...} } to expected format if needed
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
