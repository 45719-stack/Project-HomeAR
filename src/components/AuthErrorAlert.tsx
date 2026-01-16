import { AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthErrorAlertProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

export default function AuthErrorAlert({
    title = "Can't connect to server",
    message,
    onRetry
}: AuthErrorAlertProps) {
    const isNetworkError = message.toLowerCase().includes('fetch') || message.toLowerCase().includes('network') || message.toLowerCase().includes('connect');

    // Customize message for network errors if generic "Failed to fetch" is passed
    const displayMessage = isNetworkError
        ? "Our server is not responding right now. Please check your internet or try again in a moment."
        : message;

    return (
        <div className="rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 shrink-0">
                    <AlertCircle size={20} />
                </div>
                <div className="flex-1 pt-0.5">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                        {isNetworkError ? "Can't connect to server" : (title || "Error")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {displayMessage}
                    </p>

                    <div className="flex items-center gap-3">
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm shadow-red-500/20"
                            >
                                <RefreshCw size={14} /> Retry
                            </button>
                        )}
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
