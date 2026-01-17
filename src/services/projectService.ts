
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
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const saveProject = async (data: ProjectData): Promise<string> => {
    const userJson = localStorage.getItem('user');

    if (!userJson) throw new Error("User must be logged in to save a project");

    // Mock saving - just log it and return a fake ID
    console.log("Saving project (Local Mode):", data);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

    return "local_project_" + Date.now();
};
