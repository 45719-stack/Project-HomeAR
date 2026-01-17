import type { User, AuthProvider } from './authTypes';

const STORAGE_KEY_USER = 'homear_user';
const STORAGE_KEY_USERS_DB = 'homear_users_db'; // For simulating a database of registered users

class DemoAuthService implements AuthProvider {
    private getUsersDB(): User[] {
        const stored = localStorage.getItem(STORAGE_KEY_USERS_DB);
        return stored ? JSON.parse(stored) : [];
    }

    private saveUserToDB(user: User) {
        const users = this.getUsersDB();
        users.push(user);
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async login(email: string, _password: string): Promise<User> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const users = this.getUsersDB();
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        // For demo purposes, we accept any password for existing users, 
        // or if it's a completely new user not even in DB, we could optionally auto-register, 
        // but let's stick to "signup first" or "allow known demo credentials".

        if (foundUser) {
            // For simplicity in demo, we ignore actual password hash checks and just trust the user found.
            // In a real demo app, you might check password === 'demo' or something.
            // Here we'll just allow login if user exists.
            this.setCurrentUser(foundUser);
            return foundUser;
        }

        throw new Error('User not found. Please sign up first.');
    }

    async signup(email: string, _password: string, name: string): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 800));

        const users = this.getUsersDB();
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('Email already in use.');
        }

        const newUser: User = {
            uid: 'user_' + Date.now(),
            email,
            displayName: name,
            plan: 'free',
            createdAt: Date.now(),
            country: 'PK'
        };

        this.saveUserToDB(newUser);
        this.setCurrentUser(newUser);
        return newUser;
    }

    async logout(): Promise<void> {
        localStorage.removeItem(STORAGE_KEY_USER);
    }

    async getCurrentUser(): Promise<User | null> {
        const stored = localStorage.getItem(STORAGE_KEY_USER);
        return stored ? JSON.parse(stored) : null;
    }

    private setCurrentUser(user: User) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
}

export const demoAuth = new DemoAuthService();
