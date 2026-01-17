export interface User {
    uid: string;
    email: string;
    displayName: string;
    plan: 'free' | 'premium' | 'ultra';
    createdAt: number;
    country?: string;
}

export interface AuthProvider {
    login(email: string, password: string): Promise<User>;
    signup(email: string, password: string, name: string): Promise<User>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
}
