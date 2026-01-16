import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { checkServerHealth } from '../utils/auth';

interface ServerContextType {
    isServerOnline: boolean;
    isChecking: boolean;
    checkHealth: () => Promise<void>;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export function ServerProvider({ children }: { children: ReactNode }) {
    const [isServerOnline, setIsServerOnline] = useState(true); // Optimistic default
    const [isChecking, setIsChecking] = useState(false);

    const checkHealth = useCallback(async () => {
        setIsChecking(true);
        const online = await checkServerHealth();
        setIsServerOnline(online);
        setIsChecking(false);
    }, []);

    // Initial check and periodic background check (optional, kept simple for now)
    useEffect(() => {
        checkHealth();
    }, [checkHealth]);

    return (
        <ServerContext.Provider value={{ isServerOnline, isChecking, checkHealth }}>
            {children}
            {/* Optional Global Offline Banner could go here if design permits, but user asked for Login/Signup specific handling */}
        </ServerContext.Provider>
    );
}

export function useServer() {
    const context = useContext(ServerContext);
    if (context === undefined) {
        throw new Error('useServer must be used within a ServerProvider');
    }
    return context;
}
