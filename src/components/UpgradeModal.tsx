import { X, Zap, Crown } from 'lucide-react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: (plan: 'premium' | 'ultra') => void;
    title?: string;
    description?: string;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade, title, description }: UpgradeModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
                <div className="p-6 relative text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown size={32} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title || "Upgrade to Unlock"}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        {description || "This feature requires a Premium or Ultra plan. Upgrade now to access exclusive benefits."}
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => onUpgrade('premium')}
                            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-primary-100 dark:border-primary-900/50 hover:border-primary-500 dark:hover:border-primary-500 bg-white dark:bg-gray-800 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                                    <Zap size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 dark:text-white">Upgrade to Premium (Demo)</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Unlock all premium styles</div>
                                </div>
                            </div>
                            <div className="text-primary-600 dark:text-primary-400 font-semibold group-hover:scale-105 transition-transform">
                                Free
                            </div>
                        </button>

                        <button
                            onClick={() => onUpgrade('ultra')}
                            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-purple-100 dark:border-purple-900/50 hover:border-purple-500 dark:hover:border-purple-500 bg-white dark:bg-gray-800 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                                    <Crown size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900 dark:text-white">Upgrade to Ultra (Demo)</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Unlock everything + commercial</div>
                                </div>
                            </div>
                            <div className="text-purple-600 dark:text-purple-400 font-semibold group-hover:scale-105 transition-transform">
                                Free
                            </div>
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            Not now
                        </button>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 text-center text-xs text-gray-400 dark:text-gray-500">
                    This is a demo. No payment will be processed.
                </div>
            </div>
        </div>
    );
}
