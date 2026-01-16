import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    featureName?: string;
}

export default function ProtectedRoute({ children, featureName = 'Premium features' }: ProtectedRouteProps) {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        return <Navigate
            to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
            state={{ message: `Please log in to access ${featureName}.` }}
            replace
        />;
    }

    return <>{children}</>;
}
