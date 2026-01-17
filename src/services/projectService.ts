import { collection, addDoc, serverTimestamp, type DocumentReference } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface ProjectDimensions {
    width: number;
    height: number;
    length: number;
    unit: 'ft' | 'm';
}

export interface ProjectData {
    roomType: string;
    designStyle: string;
    dimensions: ProjectDimensions;
    [key: string]: any; // Flex for extra fields
}

export const saveProject = async (data: ProjectData): Promise<string> => {
    if (!db) throw new Error("Firestore is not initialized");
    if (!auth?.currentUser) throw new Error("User must be logged in to save a project");

    const projectPayload = {
        ...data,
        uid: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    try {
        const docRef: DocumentReference = await addDoc(collection(db, "projects"), projectPayload);
        console.log("Project saved with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error saving project:", error);
        throw error;
    }
};
