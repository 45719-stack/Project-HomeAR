import { X, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Decorative Background */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 pointer-events-none"></div>

                <div className="text-center relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-primary-100 dark:from-yellow-900/30 dark:to-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600 dark:text-yellow-400 ring-4 ring-white dark:ring-gray-900 shadow-sm">
                        <Zap size={32} fill="currentColor" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upgrade Required</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-[80%] mx-auto">
                        This feature is Premium. Upgrade to continue.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/upgrade')}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Zap size={18} fill="currentColor" /> Upgrade to Premium
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
                        >
                            Not now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
