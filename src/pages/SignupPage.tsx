import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
// import { useAuth } from '../context/AuthContext'; // No longer using useAuth for signup
import { apiPost } from '../services/api';
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

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    // const { signup } = useAuth(); // Removed

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            await apiPost("/api/auth/signup", { name, email, password });
            setShowSuccess(true);
            // Wait 1.5s then redirect to login with email prefilled
            setTimeout(() => {
                navigate('/login', { state: { email } });
            }, 1500);
        } catch (err: any) {
            console.error(err);
            if (err.message) {
                setError(err.message);
            } else {
                setError('Failed to create an account. Please try again.');
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-950 transition-colors">
            <Toast isVisible={showSuccess} message="Account created ✅ Now login to continue." />

            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                {/* Header */}
                <div className="p-8 text-center bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Create Account</h2>
                    <p className="text-gray-500 dark:text-gray-400">Join us to start designing your dream home</p>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <AuthErrorAlert
                            message={error}
                            onRetry={() => setError('')}
                        />
                    )}

                    {/* Form */}
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    disabled={isLoading || showSuccess}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    disabled={isLoading || showSuccess}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    disabled={isLoading || showSuccess}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    disabled={isLoading || showSuccess}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || showSuccess}
                            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading || showSuccess ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>Create Account <ArrowRight size={18} className="ml-2" /></>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
