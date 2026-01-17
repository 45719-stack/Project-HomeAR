import React, { createContext, useContext, useEffect, useState } from 'react';
import { demoAuth } from '../services/demoAuth';
import type { User } from '../services/authTypes';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentUser = await demoAuth.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error("Failed to restore session", error);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const loggedInUser = await demoAuth.login(email, password);
        setUser(loggedInUser);
    };

    const signup = async (email: string, password: string, name: string) => {
        const newUser = await demoAuth.signup(email, password, name);
        setUser(newUser);
    };

    const logout = async () => {
        await demoAuth.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

