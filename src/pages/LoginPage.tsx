import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthErrorAlert from '../components/AuthErrorAlert';

// Simple Toast Component
const Toast = ({ message, isVisible }: { message: string; isVisible: boolean }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-gray-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-gray-700/50 dark:border-gray-200/50">
                <CheckCircle2 size={20} className="text-green-500 dark:text-green-600" />
                <span className="font-medium text-sm">{message}</span>
            </div>
        </div>
    );
};

// Full Screen Splash Component
const LoginSplash = ({ isVisible, isSuccess }: { isVisible: boolean; isSuccess: boolean }) => {
    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-xl transition-all duration-500 ${isSuccess ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col items-center">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8 scale-150">
                    <span className="font-extrabold text-3xl tracking-tight text-gray-900 dark:text-white">
                        Home<span className="text-primary-600 dark:text-primary-400">AR</span>
                    </span>
                </div>

                {/* Loading State */}
                {!isSuccess && (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-500 animate-spin"></div>
                            <div className="absolute inset-0 rounded-full blur-md bg-primary-500/20 animate-pulse"></div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Signing in...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSplashVisible, setIsSplashVisible] = useState(false);
    const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Derived state for info message
    const params = new URLSearchParams(location.search);

    // Check if we have an error message from navigation state
    const infoMessage = location.state?.message ||
        (params.get('redirect') === '/upgrade' ? 'Please log in to upgrade your plan.' : '');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        setIsSplashVisible(true);
        setLoginStatus('idle');
        setError('');

        const startTime = Date.now();

        try {
            await login(email, password);

            // Calculate elapsed time and ensure minimum splash duration (1500ms)
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 1500 - elapsed);

            if (remaining > 0) {
                await new Promise(resolve => setTimeout(resolve, remaining));
            }

            // Success Transition
            setLoginStatus('success');

            // Wait for fade out animation (500ms) before redirecting
            setTimeout(() => {
                const params = new URLSearchParams(location.search);
                const redirectParams = params.get('redirect');
                if (redirectParams) {
                    navigate(redirectParams);
                } else {
                    navigate('/');
                }
            }, 600); // Slightly longer than transition to ensure smooth exit

        } catch (err: unknown) {
            // For errors, hide splash immediately as requested
            setIsSplashVisible(false);
            setIsLoading(false);

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to login. Please check your connection or try again.');
            }

            setLoginStatus('error');
        }
    };

    return (
        <>
            <LoginSplash isVisible={isSplashVisible} isSuccess={loginStatus === 'success'} />
            <Toast isVisible={loginStatus === 'success'} message="Login successful" />

            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-950 transition-colors">
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    {/* Header */}
                    <div className="p-8 text-center bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-500 dark:text-gray-400">Sign in to continue your design journey</p>
                    </div>

                    {/* Body */}
                    <div className="p-8 space-y-6">
                        {/* Info Message (Redirect) */}
                        {infoMessage && (
                            <div className="rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 p-4 backdrop-blur-sm flex items-start gap-3">
                                <Info className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
                                <p className="text-sm text-blue-800 dark:text-blue-200">{infoMessage}</p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <AuthErrorAlert
                                message={error}
                                onRetry={() => handleLogin({ preventDefault: () => { } } as React.FormEvent)}
                            />
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between ml-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                    <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>Sign in <ArrowRight size={18} className="ml-2" /></>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
