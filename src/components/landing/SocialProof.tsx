import { Star, Zap, Ruler, CheckCircle } from 'lucide-react';

export default function SocialProof() {
    return (
        <div className="py-12 bg-white dark:bg-slate-950 border-y border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                    {/* Rating Section */}
                    <div className="col-span-1 border-r-0 md:border-r border-gray-100 dark:border-gray-800 pr-0 md:pr-8 text-center md:text-left">
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 font-medium">Trusted by students & homeowners</p>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} fill="currentColor" size={20} />
                                ))}
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white text-lg">4.8/5</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">2,000+</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Redesigns Created</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Fast Results</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Under 30 seconds</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                                <Ruler size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">Cost & Scope</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">PKR Budgeting</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
