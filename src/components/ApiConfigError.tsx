import React from 'react';

const ApiConfigError: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center border border-red-500/30">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
                <p className="text-gray-300 mb-6">
                    Backend URL not configured. Set <code className="bg-gray-900 px-2 py-1 rounded text-red-400">VITE_API_BASE_URL</code> in Vercel/Firebase env.
                </p>
                <div className="text-sm text-gray-500">
                    If you are the developer, please check your environment variables deployment settings.
                </div>
            </div>
        </div>
    );
};

export default ApiConfigError;
