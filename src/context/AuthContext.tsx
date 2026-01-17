import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../utils/auth';

// Define a User interface that matches what the app expects (roughly compatible with what we had)
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

interface AuthContextType {
    user: User | null;
    userData: any | null; // Additional data
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    isConfigured: boolean;
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
    const [userData, setUserData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for persisted session on mount
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Map stored user to our User interface
                // Backend stores: { id, name, email }
                // We map to: { uid: id, displayName: name, email }
                if (parsedUser.id || parsedUser.uid) {
                    setUser({
                        uid: (parsedUser.id || parsedUser.uid).toString(),
                        email: parsedUser.email,
                        displayName: parsedUser.name || parsedUser.displayName,
                    });
                    setUserData(parsedUser);
                }
            } catch (e) {
                console.error("Failed to restore user session", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const data = await loginUser(email, password);
        // data: { message, user: { id, name, email }, token }

        const appUser: User = {
            uid: data.user.id.toString(),
            email: data.user.email,
            displayName: data.user.name
        };

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setUser(appUser);
        setUserData(data.user);
    };

    const signup = async (email: string, password: string, name: string) => {
        await registerUser(name, email, password);
        // data: { message, user: { id, name, email } }
        // Note: Register in this backend might not return a token automatically, 
        // strictly speaking we might need to login after register, but let's see.
        // If the backend implementation in server.js doesn't return a token on register, 
        // we should probably auto-login or ask user to login.
        // Looking at server.js: It returns { message, user }. No token.
        // So we will just redirect to login (or auto-login if we want to be fancy, but standard is login).
        // BUT, for better UX lets assume we want to auto login if possible, OR just let the UI handle the redirect.

        // Wait! The prompt asked to "switch to backend". Usage in LoginPage likely expects `login` to throw if failed.
        // `signup` usually redirects. 
        // Let's just return here. The UI (LoginPage/RegisterPage) usually handles the next step.
        // If we want to simulate "logged in after signup", we'd need a token. 
        // Since server.js doesn't give a token on register, we can't set user state as "logged in" fully.
        // We will just let the caller handle success.
    };

    const logout = async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setUserData(null);
    };

    const value = {
        user,
        userData,
        loading,
        login,
        signup,
        logout,
        isConfigured: true // Always true now that we use custom backend
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
