import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, ApiError } from '../services/api'; // Import backend API
import type { User } from '../services/authTypes';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    setAuthUser: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Initial check: Restore session from localStorage
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                // Check if user data exists locally
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (storedUser && token) {
                    // Start by assuming local data is valid to avoid flicker
                    setUser(JSON.parse(storedUser));

                    // Verify health/validity in background (optional but good)
                    const isHealthy = await authService.checkHealth();
                    if (!isHealthy) {
                        // If backend is down, we might want to warn, but keeping logged in locally is better UX for now
                        console.warn("Backend unreachable, running in offline/cached mode.");
                    }
                }
            } catch (err) {
                console.error("Auth restore error:", err);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(email, password);
            const userData = data.user;

            // Persist to localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', data.token);

            setUser(userData);
        } catch (err: unknown) {
            console.error("Login failed:", err);
            const message = err instanceof ApiError ? err.message : 'Login failed. Please try again.';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            // Just call API, do not set user state or token so we don't auto-login
            await authService.signup(name, email, password);
        } catch (err: unknown) {
            console.error("Signup failed:", err);
            const message = err instanceof ApiError ? err.message : 'Signup failed. Please try again.';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login'; // Force redirect
    };

    const clearError = () => setError(null);

    const setAuthUser = (userData: User, token: string) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            signup,
            logout,
            clearError,
            setAuthUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
