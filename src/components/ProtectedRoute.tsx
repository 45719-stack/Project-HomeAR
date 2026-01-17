import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    featureName?: string;
    requirePremium?: boolean;
}

export default function ProtectedRoute({ children, featureName = 'Premium features', requirePremium = false }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate
            to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
            state={{ message: `Please log in to access ${featureName}.` }}
            replace
        />;
    }

    const userPlan = user?.plan || 'free';

    if (requirePremium && userPlan === 'free') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 text-center relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl -ml-16 -mb-16"></div>

                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/10">
                            <Crown size={32} />
                        </div>

                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Upgrade Required</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            <span className="font-semibold text-primary-600 dark:text-primary-400">{featureName}</span> is a premium feature. Upgrade your plan to unlock unlimited access.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/upgrade')}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <Crown size={18} /> Go to Upgrade Page
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
