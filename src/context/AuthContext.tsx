import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Define a User interface that matches what the app expects
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

interface AuthContextType {
    user: User | null;
    userData: any | null; // Additional data from Firestore (plan, country, etc.)
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

    // Map Firebase errors to user-friendly messages
    const handleAuthError = (error: any) => {
        console.error("Auth Error:", error);
        let message = "An authentication error occurred.";
        if (typeof error === 'object' && error.code) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = "This email is already registered. Please login instead.";
                    break;
                case 'auth/invalid-email':
                    message = "Please enter a valid email address.";
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    message = "Invalid email or password.";
                    break;
                case 'auth/weak-password':
                    message = "Password should be at least 6 characters.";
                    break;
                case 'auth/network-request-failed':
                    message = "Network error. Please check your internet connection.";
                    break;
                default:
                    message = error.message || message;
            }
        }
        throw new Error(message);
    };

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Map Firebase user to App user
                const appUser: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName
                };
                setUser(appUser);

                // Fetch extra user data from Firestore
                if (db) {
                    try {
                        const userDocRef = doc(db, "users", firebaseUser.uid);
                        const userDoc = await getDoc(userDocRef);

                        if (userDoc.exists()) {
                            setUserData(userDoc.data());
                        } else {
                            // Recover: Create doc if missing (e.g. older accounts or manual creation)
                            const newUserData = {
                                email: firebaseUser.email,
                                displayName: firebaseUser.displayName,
                                createdAt: serverTimestamp(),
                                plan: "free",
                                country: "PK" // Default as requested
                            };
                            await setDoc(userDocRef, newUserData);
                            setUserData(newUserData);
                        }
                    } catch (err) {
                        console.error("Error fetching user data:", err);
                        // Don't block app load on Firestore error, but maybe show a toast?
                        // For now we just log it. "Firestore permissions denied" usually.
                        if (err instanceof Error && err.message.includes('permission-denied')) {
                            alert("Firestore rules blocked the request. Please check console.");
                        }
                    }
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        if (!auth || !db) throw new Error("Firebase is not initialized.");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged handles state update
        } catch (error) {
            handleAuthError(error);
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        if (!auth || !db) throw new Error("Firebase is not initialized.");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { user: newUser } = userCredential;

            // Create user document inside Firestore
            const newUserData = {
                email: newUser.email,
                displayName: name,
                createdAt: serverTimestamp(),
                plan: "free",
                country: "PK"
            };

            await setDoc(doc(db, "users", newUser.uid), newUserData);
            // onAuthStateChanged handles state update
        } catch (error) {
            handleAuthError(error);
        }
    };

    const logout = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
            setUser(null);
            setUserData(null);
            localStorage.removeItem('user'); // Clean up old mess just in case
            localStorage.removeItem('token');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const value = {
        user,
        userData,
        loading,
        login,
        signup,
        logout,
        isConfigured: !!auth // True if auth service is available
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
