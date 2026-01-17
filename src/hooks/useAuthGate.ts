import type { User } from '../services/authTypes';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export const useAuthGate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const requireAuth = (actionName: string = 'Premium features', redirectPath?: string) => {
        const token = localStorage.getItem('token');

        if (!token) {
            const currentPath = redirectPath || location.pathname + location.search;
            navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, {
                state: {
                    message: `Please log in to access ${actionName}.`,
                    from: currentPath
                }
            });
            return false;
        }
        return true;
    };

    return { requireAuth, user };
};
